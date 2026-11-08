"use strict";
const crypto = require("node:crypto");
const products = require("../data/sale-products.cjs");
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

async function readWebhookBody(req) {
  if (req.method !== "POST") throw fail(405, "Método não permitido.");
  let raw;
  if (req.body !== undefined) {
    raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  } else {
    raw = "";
    for await (const chunk of req) {
      raw += chunk;
      if (Buffer.byteLength(raw) > MAX_BODY) throw fail(413, "Dados muito longos.");
    }
  }
  if (Buffer.byteLength(raw) > MAX_BODY) throw fail(413, "Dados muito longos.");
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    return parsed;
  } catch {
    throw fail(400, "JSON inválido.");
  }
}

function productMap(value = process.env.HOTMART_PRODUCT_MAP) {
  const keys = new Set(products.map((p) => p.key));
  const map = new Map();
  for (const pair of String(value || "").split(",")) {
    const [id, key] = pair.split("=").map((x) => x?.trim());
    if (id && keys.has(key)) map.set(id, key);
  }
  return map;
}

function skillsForProducts(keys) {
  const ids = new Set();
  for (const key of keys)
    for (const id of products.find((p) => p.key === key)?.skillIds || [])
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

async function processEvent(payload, run, options = {}) {
  const e = normalize(payload);
  const map = options.map || productMap();
  const inserted = await run(
    `INSERT INTO skillmkt.webhook_events(event_id,event,transaction_code,hotmart_product_id,outcome,occurred_at)
     VALUES($1,$2,$3,$4,'recorded',$5) ON CONFLICT(event_id) DO NOTHING RETURNING event_id`,
    [e.eventId, e.event, e.transaction, e.productId, e.occurredAt],
  );
  if (!inserted.rowCount) return { duplicate: true, outcome: "duplicate" };
  const action = actionFor(e.event);
  if (!action) return { outcome: "recorded" };
  if (!e.transaction || !e.productId || !e.email)
    throw fail(400, "Dados da compra incompletos.");

  const created = await run(
    `INSERT INTO skillmkt.customers(email,name) VALUES($1,$2)
     ON CONFLICT(email) DO UPDATE SET updated_at=now() RETURNING id`,
    [e.email, e.name],
  );
  const productKey = map.get(e.productId) || null;
  await run(
    `INSERT INTO skillmkt.purchases(transaction_code,customer_id,hotmart_product_id,product_key,offer_code,status,price_value,currency,is_order_bump,parent_transaction,last_event_at)
     VALUES($1,$2,$3,$4,$5,'pending',$6,$7,$8,$9,$10) ON CONFLICT(transaction_code) DO NOTHING`,
    [
      e.transaction,
      created.rows[0].id,
      e.productId,
      productKey,
      e.offerCode,
      e.priceValue,
      e.currency,
      e.isOrderBump,
      e.parentTransaction,
      e.occurredAt,
    ],
  );
  // A trava na linha da compra põe em fila eventos simultâneos da mesma transação.
  const purchase = (
    await run(
      `SELECT p.status,p.customer_id,c.email,c.name,c.password_hash IS NOT NULL AS has_password
       FROM skillmkt.purchases p JOIN skillmkt.customers c ON c.id=p.customer_id
       WHERE p.transaction_code=$1 FOR UPDATE OF p`,
      [e.transaction],
    )
  ).rows[0];
  const next = transition(purchase.status, action);
  await run(
    `UPDATE skillmkt.purchases SET status=$2,product_key=COALESCE($3,product_key),last_event_at=COALESCE($4,last_event_at),updated_at=now()
     WHERE transaction_code=$1`,
    [e.transaction, next.status, productKey, e.occurredAt],
  );

  let outcome = next.outcome,
    notify = null;
  if (next.effect === "revoke")
    await run(
      `UPDATE skillmkt.entitlements SET revoked_at=now(),revoke_reason=$2
       WHERE transaction_code=$1 AND revoked_at IS NULL`,
      [e.transaction, action.reason],
    );
  if (next.effect === "grant") {
    if (!productKey) outcome = "unmapped";
    else {
      await run(
        `INSERT INTO skillmkt.entitlements(customer_id,product_key,transaction_code) VALUES($1,$2,$3)
         ON CONFLICT(transaction_code,product_key) DO UPDATE SET revoked_at=NULL,revoke_reason=NULL
         WHERE skillmkt.entitlements.revoked_at IS NOT NULL`,
        [purchase.customer_id, productKey, e.transaction],
      );
      if (!purchase.has_password)
        notify = {
          email: purchase.email,
          name: purchase.name,
          purpose: "first-access",
          token: await customerAuth.createAccessToken(run, purchase.customer_id, "first-access"),
        };
    }
  }
  await run("UPDATE skillmkt.webhook_events SET outcome=$2 WHERE event_id=$1", [e.eventId, outcome]);
  return { outcome, notify };
}

module.exports = {
  hottokValid,
  readWebhookBody,
  productMap,
  skillsForProducts,
  normalize,
  actionFor,
  transition,
  processEvent,
};
