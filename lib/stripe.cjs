"use strict";
// Checkout próprio com Stripe, sem SDK e sem produto cadastrado: o servidor monta o
// pagamento a partir do catálogo e o Stripe hospeda a tela de cobrança.
const crypto = require("node:crypto");
const catalog = require("./sale-catalog.cjs");
const customerAuth = require("./customer-auth.cjs");
const commerce = require("./commerce.cjs");
const mailer = require("./mailer.cjs");
const fx = require("./fx.cjs");

const API = "https://api.stripe.com/v1";
const MAX_ITEMS = 10;
const TOLERANCE_SECONDS = 300;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const BACK = new Set(["/oferta", "/loja", "/app"]);

const fail = (status, message) => Object.assign(new Error(message), { status });
const configured = () => /^(sk|rk)_(live|test)_/.test(process.env.STRIPE_SECRET_KEY || "");

// ---------------------------------------------------------------- assinatura

function verifySignature(raw, header, secret, now = Date.now()) {
  if (typeof secret !== "string" || secret.length < 16) return false;
  const parts = String(header || "")
    .split(",")
    .map((p) => p.trim().split("="));
  const timestamp = parts.find((p) => p[0] === "t")?.[1];
  const signatures = parts.filter((p) => p[0] === "v1").map((p) => p[1]);
  if (!/^\d{9,12}$/.test(timestamp || "") || !signatures.length) return false;
  if (Math.abs(Math.floor(now / 1000) - Number(timestamp)) > TOLERANCE_SECONDS) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex");
  const a = Buffer.from(expected);
  return signatures.some((s) => {
    const b = Buffer.from(String(s));
    return b.length === a.length && crypto.timingSafeEqual(a, b);
  });
}

// ------------------------------------------------------------------ checkout

// Notação de colchetes que o Stripe espera em application/x-www-form-urlencoded.
function encode(value, prefix = "", out = []) {
  if (Array.isArray(value))
    value.forEach((item, i) => encode(item, `${prefix}[${i}]`, out));
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) encode(v, prefix ? `${prefix}[${k}]` : k, out);
  else if (value !== undefined && value !== null)
    out.push(encodeURIComponent(prefix) + "=" + encodeURIComponent(String(value)));
  return out;
}

function resolveItems(keys) {
  if (!Array.isArray(keys) || !keys.length || keys.length > MAX_ITEMS)
    throw fail(400, "Escolha de 1 a 10 itens.");
  const unique = [...new Set(keys)];
  return unique.map((key) => {
    const product = typeof key === "string" ? catalog.get(key) : null;
    // Rascunho não é vendido; sem direito de venda, nunca.
    if (!product || product.status === "draft" || !catalog.sellable(key) || !(product.priceUsd > 0))
      throw fail(400, "Este item não está à venda.");
    return { key, product, cents: Math.round(product.priceUsd * 100) };
  });
}

// currency: "usd" cobra o valor do catálogo; "brl" cobra em reais pela cotação (rate).
function sessionParams({ items, orderId, email, back, origin, currency = "usd", rate = null }) {
  const taxed = process.env.STRIPE_AUTOMATIC_TAX === "true";
  const brl = currency === "brl";
  const lineCents = (i) => (brl ? fx.brlCents(i.cents, rate) : i.cents);
  const params = {
    mode: "payment",
    success_url: `${origin}/app?compra=ok`,
    cancel_url: `${origin}${BACK.has(back) ? back : "/loja"}`,
    client_reference_id: orderId,
    metadata: { order_id: orderId },
    payment_intent_data: { metadata: { order_id: orderId } },
    locale: brl ? "pt-BR" : "auto",
    line_items: items.map((i) => ({
      quantity: 1,
      price_data: {
        currency,
        unit_amount: lineCents(i),
        product_data: {
          name: i.product.title.slice(0, 120),
          description:
            (i.product.skillIds.length > 1
              ? `${i.product.skillIds.length} cartas do DriveData Deck`
              : "Carta do DriveData Deck") +
            (brl ? `. Valor em reais pelo dólar do dia: US$ 1 = R$ ${rate}` : ""),
          ...(taxed ? { tax_code: "txcd_10000000" } : {}),
        },
      },
    })),
  };
  if (brl) params.payment_method_options = { card: { installments: { enabled: true } } };
  // Mostra o valor na moeda do comprador quando a conta for elegível (só vale para dólar).
  else params.adaptive_pricing = { enabled: true };
  if (taxed) params.automatic_tax = { enabled: true };
  if (email) params.customer_email = email;
  return params;
}

async function createCheckout(input, run, options = {}) {
  if (!configured()) throw fail(503, "O pagamento ainda não foi configurado.");
  const items = resolveItems(input?.items);
  // A compra é feita dentro de uma conta: o pedido guarda quem comprou e o e-mail dela vai pré-preenchido.
  const customer = options.customer || null;
  const email = customer?.email || customerAuth.normalizeEmail(input?.email) || null;
  const origin = options.origin || mailer.publicUrl();
  const brl = options.currency === "brl";
  if (brl && !(options.rate > 0)) throw fail(503, "Cotação indisponível. Tente novamente.");
  const rate = brl ? options.rate : null;
  const usdTotal = items.reduce((sum, i) => sum + i.cents, 0);
  const total = brl ? items.reduce((sum, i) => sum + fx.brlCents(i.cents, rate), 0) : usdTotal;
  const order = await run(
    `INSERT INTO skillmkt.orders(product_keys,amount_cents,currency,usd_cents,fx_rate,customer_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
    [items.map((i) => i.key), total, brl ? "brl" : "usd", usdTotal, rate, customer?.id || null],
  );
  const orderId = order.rows[0].id;
  const response = await (options.fetch || fetch)(API + "/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Idempotency-Key": "order-" + orderId,
    },
    body: encode(
      sessionParams({ items, orderId, email, back: input?.back, origin, currency: brl ? "brl" : "usd", rate }),
    ).join("&"),
    signal: AbortSignal.timeout(12000),
  });
  const session = await response.json().catch(() => ({}));
  if (!response.ok || typeof session.url !== "string" || typeof session.id !== "string") {
    console.error("stripe.checkout_failed", response.status, session?.error?.type, session?.error?.code);
    throw fail(502, "Não foi possível abrir o pagamento. Tente novamente.");
  }
  await run("UPDATE skillmkt.orders SET stripe_session_id=$2,updated_at=now() WHERE id=$1", [
    orderId,
    session.id,
  ]);
  return { url: session.url, orderId, amountCents: total, currency: brl ? "brl" : "usd" };
}

// -------------------------------------------------------------------- eventos

const text = (v, max) => (typeof v === "string" && v ? v.slice(0, max) : null);

function normalizeEvent(event) {
  const type = text(event?.type, 80);
  const eventId = text(event?.id, 200);
  if (!type || !eventId) throw fail(400, "Evento inválido.");
  const object = event.data?.object || {};
  const base = {
    eventId,
    event: type,
    occurredAt: Number.isFinite(event.created) ? new Date(event.created * 1000) : null,
    action: null,
  };
  if (type === "checkout.session.completed" || type === "checkout.session.async_payment_succeeded") {
    if (object.mode !== "payment") return base;
    // Pix, boleto e similares completam a sessão antes de pagar: só libera quando paga.
    const paid =
      type === "checkout.session.async_payment_succeeded" ||
      object.payment_status === "paid" ||
      object.payment_status === "no_payment_required";
    if (!paid) return base;
    const value = Number(object.amount_total);
    return {
      ...base,
      action: { type: "grant" },
      transaction: text(object.payment_intent, 120) || text(object.id, 120),
      orderId: text(object.client_reference_id, 60) || text(object.metadata?.order_id, 60),
      email: customerAuth.normalizeEmail(object.customer_details?.email || object.customer_email),
      name: text(object.customer_details?.name, 200) || "",
      priceValue: Number.isFinite(value) ? value / 100 : null,
      currency: text(object.currency, 8)?.toUpperCase() || null,
    };
  }
  if (type === "checkout.session.expired")
    return { ...base, expireOrder: text(object.client_reference_id, 60) };
  // Só reembolso total tira o acesso; parcial não.
  if (type === "charge.refunded" && object.refunded === true)
    return { ...base, action: { type: "revoke", reason: "refunded" }, transaction: text(object.payment_intent, 120) };
  if (type === "charge.dispute.created")
    return { ...base, action: { type: "revoke", reason: "chargeback" }, transaction: text(object.payment_intent, 120) };
  return base;
}

async function processEvent(event, run) {
  const n = normalizeEvent(event);
  let productKeys = [];
  let orderId = null;
  let customerId = null;
  if (n.action?.type === "grant" && n.orderId && UUID.test(n.orderId)) {
    const order = await run("SELECT id,product_keys,customer_id FROM skillmkt.orders WHERE id=$1", [n.orderId]);
    if (order.rowCount) {
      orderId = order.rows[0].id;
      customerId = order.rows[0].customer_id || null;
      productKeys = order.rows[0].product_keys.filter((key) => catalog.sellable(key));
    }
  }
  const result = await commerce.settle(run, {
    provider: "stripe",
    eventId: n.eventId,
    event: n.event,
    occurredAt: n.occurredAt,
    action: n.action,
    transaction: n.transaction,
    customerId,
    email: n.email,
    name: n.name,
    productKeys,
    priceValue: n.priceValue,
    currency: n.currency,
  });
  if (orderId && result.outcome === "granted")
    await run("UPDATE skillmkt.orders SET status='paid',updated_at=now() WHERE id=$1", [orderId]);
  if (n.expireOrder && UUID.test(n.expireOrder))
    await run(
      "UPDATE skillmkt.orders SET status='expired',updated_at=now() WHERE id=$1 AND status='created'",
      [n.expireOrder],
    );
  return result;
}

module.exports = {
  configured,
  verifySignature,
  encode,
  resolveItems,
  sessionParams,
  createCheckout,
  normalizeEvent,
  processEvent,
};
