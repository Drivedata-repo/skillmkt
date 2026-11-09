"use strict";
const crypto = require("node:crypto");
const catalog = require("./sale-catalog.cjs");
const fileMap = require("../data/hotmart-products.cjs");
const { canSell } = require("./sale-rights.cjs");
const customerAuth = require("./customer-auth.cjs");

const GRANT = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
const REVOKE = {
  PURCHASE_REFUNDED: "refunded",
  PURCHASE_CHARGEBACK: "chargeback",
  PURCHASE_CANCELED: "canceled",
};
const TERMINAL = new Set(["refunded", "chargeback"]);
const MAX_BODY = 131072;

const fail = (status, message) => Object.assign(new Error(message), { status });
const digest = (value) => crypto.createHash("sha256").update(String(value)).digest();

function hottokValid(req, payload) {
  const expected = process.env.HOTMART_HOTTOK || "";
  if (expected.length < 16) throw fail(503, "Webhook ainda não configurado.");
  const received = req.headers["x-hotmart-hottok"] || payload?.hottok || "";
  return crypto.timingSafeEqual(digest(received), digest(expected));
}

// Corpo exato como chegou. A assinatura do Stripe é calculada sobre esses bytes.
async function readRawBody(req) {
  if (req.method !== "POST") throw fail(405, "Método não permitido.");
  let raw = "";
  if (!req.readableEnded && !req.destroyed) {
    try {
      for await (const chunk of req) {
        raw += chunk;
        if (Buffer.byteLength(raw) > MAX_BODY) throw fail(413, "Dados muito longos.");
      }
    } catch (error) {
      if (error.status) throw error;
    }
  }
  // Só se a plataforma já tiver consumido o fluxo.
  if (!raw && req.body !== undefined)
    raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  if (Buffer.byteLength(raw) > MAX_BODY) throw fail(413, "Dados muito longos.");
  return raw;
}

function parseJson(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    return parsed;
  } catch {
    throw fail(400, "JSON inválido.");
  }
}

const readWebhookBody = async (req) => parseJson(await readRawBody(req));

// Junta o arquivo e a variável de ambiente. Só entra produto vendável: uma chave
// sem direito de venda não pode liberar acesso a nada.
function productMap(value = process.env.HOTMART_PRODUCT_MAP) {
  const map = new Map();
  const add = (id, key) => {
    if (id && /^[0-9A-Za-z_-]{1,60}$/.test(id) && catalog.sellable(key)) map.set(id, key);
  };
  for (const [id, key] of Object.entries(fileMap)) add(id.trim(), key);
  for (const pair of String(value || "").split(",")) {
    const [id, key] = pair.split("=").map((x) => x?.trim());
    add(id, key);
  }
  return map;
}

function skillsForProducts(keys) {
  const ids = new Set();
  for (const key of keys)
    for (const id of catalog.get(key)?.skillIds || [])
      if (canSell(id)) ids.add(id);
  return ids;
}

const text = (value, max) =>
  typeof value === "string" || typeof value === "number"
    ? String(value).trim().slice(0, max) || null
    : null;

function toDate(value) {
  const date = new Date(typeof value === "number" ? value : NaN);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalize(payload) {
  const event = String(payload?.event || "").toUpperCase();
  if (!/^[A-Z_]{3,60}$/.test(event)) throw fail(400, "Evento inválido.");
  const data = payload.data && typeof payload.data === "object" ? payload.data : {};
  const purchase = data.purchase || {};
  const price = purchase.price || purchase.full_price || {};
  const value = Number(price.value);
  const transaction = text(purchase.transaction, 120);
  const occurredAt = toDate(payload.creation_date);
  return {
    eventId:
      text(payload.id, 200) ||
      digest([event, transaction, payload.creation_date].join("|")).toString("hex"),
    event,
    transaction,
    productId: text(data.product?.id, 60),
    email: customerAuth.normalizeEmail(data.buyer?.email),
    name: text(data.buyer?.name, 200) || "",
    offerCode: text(purchase.offer?.code, 60),
    priceValue: Number.isFinite(value) ? value : null,
    currency: text(price.currency_value, 8),
    isOrderBump: purchase.order_bump?.is_order_bump === true,
    parentTransaction: text(purchase.order_bump?.parent_purchase_transaction, 120),
    occurredAt,
  };
}

function actionFor(event) {
  if (GRANT.has(event)) return { type: "grant" };
  if (REVOKE[event]) return { type: "revoke", reason: REVOKE[event] };
  return null;
}

function transition(current, action) {
  if (action.type === "revoke")
    return { status: action.reason, effect: "revoke", outcome: "revoked" };
  if (TERMINAL.has(current))
    return { status: current, effect: "none", outcome: "blocked-terminal" };
  return { status: "approved", effect: "grant", outcome: "granted" };
}

// Aplica um evento de pagamento, de qualquer provedor, ao acesso do comprador.
// s: { provider, eventId, event, occurredAt, action, transaction, email, name,
//      productKeys[], productId, offerCode, priceValue, currency, isOrderBump,
//      parentTransaction, strict }
async function settle(run, s) {
  const inserted = await run(
    `INSERT INTO skillmkt.webhook_events(event_id,provider,event,transaction_code,hotmart_product_id,outcome,occurred_at)
     VALUES($1,$2,$3,$4,$5,'recorded',$6) ON CONFLICT(event_id) DO NOTHING RETURNING event_id`,
    [s.eventId, s.provider, s.event, s.transaction || null, s.productId || null, s.occurredAt || null],
  );
  if (!inserted.rowCount) return { duplicate: true, outcome: "duplicate" };
  if (!s.action) return { outcome: "recorded" };
  if (s.strict && (!s.transaction || !s.productId || !s.email))
    throw fail(400, "Dados da compra incompletos.");
  if (!s.transaction) throw fail(400, "Dados da compra incompletos.");

  const lock = () =>
    run(
      `SELECT p.status,p.customer_id,c.email,c.name,c.password_hash IS NOT NULL AS has_password
       FROM skillmkt.purchases p JOIN skillmkt.customers c ON c.id=p.customer_id
       WHERE p.transaction_code=$1 FOR UPDATE OF p`,
      [s.transaction],
    );
  let purchase = (await lock()).rows[0];
  const keys = [...new Set(s.productKeys || [])];
  const keyColumn = keys.length === 1 ? keys[0] : null;

  if (!purchase) {
    // Sem e-mail não há como criar a compra (reembolso de pagamento que não é nosso).
    if (!s.email) {
      await run("UPDATE skillmkt.webhook_events SET outcome='recorded' WHERE event_id=$1", [s.eventId]);
      return { outcome: "recorded" };
    }
    const created = await run(
      `INSERT INTO skillmkt.customers(email,name) VALUES($1,$2)
       ON CONFLICT(email) DO UPDATE SET updated_at=now() RETURNING id`,
      [s.email, s.name || ""],
    );
    await run(
      `INSERT INTO skillmkt.purchases(transaction_code,provider,customer_id,hotmart_product_id,product_key,offer_code,status,price_value,currency,is_order_bump,parent_transaction,last_event_at)
       VALUES($1,$2,$3,$4,$5,$6,'pending',$7,$8,$9,$10,$11) ON CONFLICT(transaction_code) DO NOTHING`,
      [
        s.transaction,
        s.provider,
        created.rows[0].id,
        s.productId || null,
        keyColumn,
        s.offerCode || null,
        s.priceValue ?? null,
        s.currency || null,
        s.isOrderBump === true,
        s.parentTransaction || null,
        s.occurredAt || null,
      ],
    );
    // A trava na linha da compra põe em fila eventos simultâneos da mesma transação.
    purchase = (await lock()).rows[0];
  }

  const next = transition(purchase.status, s.action);
  await run(
    `UPDATE skillmkt.purchases SET status=$2,product_key=COALESCE($3,product_key),last_event_at=COALESCE($4,last_event_at),updated_at=now()
     WHERE transaction_code=$1`,
    [s.transaction, next.status, keyColumn, s.occurredAt || null],
  );

  let outcome = next.outcome,
    notify = null;
  if (next.effect === "revoke")
    await run(
      `UPDATE skillmkt.entitlements SET revoked_at=now(),revoke_reason=$2
       WHERE transaction_code=$1 AND revoked_at IS NULL`,
      [s.transaction, s.action.reason],
    );
  if (next.effect === "grant") {
    if (!keys.length) outcome = "unmapped";
    else {
      // Só devolve linha quando o acesso é novo ou foi reativado.
      let changed = false;
      for (const key of keys) {
        const row = await run(
          `INSERT INTO skillmkt.entitlements(customer_id,product_key,transaction_code) VALUES($1,$2,$3)
           ON CONFLICT(transaction_code,product_key) DO UPDATE SET revoked_at=NULL,revoke_reason=NULL
           WHERE skillmkt.entitlements.revoked_at IS NOT NULL RETURNING id`,
          [purchase.customer_id, key, s.transaction],
        );
        if (row.rowCount > 0) changed = true;
      }
      // Um segundo evento da mesma compra não manda outro e-mail de acesso.
      if (changed && !purchase.has_password)
        notify = {
          email: purchase.email,
          name: purchase.name,
          purpose: "first-access",
          token: await customerAuth.createAccessToken(run, purchase.customer_id, "first-access"),
        };
    }
  }
  await run("UPDATE skillmkt.webhook_events SET outcome=$2 WHERE event_id=$1", [s.eventId, outcome]);
  return { outcome, notify };
}

async function processEvent(payload, run, options = {}) {
  const e = normalize(payload);
  const map = options.map || productMap();
  const key = map.get(e.productId) || null;
  return settle(run, {
    provider: "hotmart",
    eventId: e.eventId,
    event: e.event,
    occurredAt: e.occurredAt,
    action: actionFor(e.event),
    transaction: e.transaction,
    email: e.email,
    name: e.name,
    productKeys: key ? [key] : [],
    productId: e.productId,
    offerCode: e.offerCode,
    priceValue: e.priceValue,
    currency: e.currency,
    isOrderBump: e.isOrderBump,
    parentTransaction: e.parentTransaction,
    strict: true,
  });
}

module.exports = {
  hottokValid,
  readRawBody,
  parseJson,
  readWebhookBody,
  productMap,
  skillsForProducts,
  normalize,
  actionFor,
  transition,
  settle,
  processEvent,
};
