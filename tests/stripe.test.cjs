"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const stripe = require("../lib/stripe.cjs");
const commerce = require("../lib/commerce.cjs");
const catalog = require("../lib/sale-catalog.cjs");

const SECRET = "whsec_" + "t".repeat(32);
const root = path.join(__dirname, "..");
const ORDER = "11111111-2222-4333-8444-555555555555";

function sign(raw, secret = SECRET, time = Math.floor(Date.now() / 1000)) {
  return `t=${time},v1=${crypto.createHmac("sha256", secret).update(`${time}.${raw}`).digest("hex")}`;
}

test("webhook signature: valid, wrong secret, tampered body, stale and malformed headers", () => {
  const raw = '{"id":"evt_1","type":"charge.refunded"}';
  assert.equal(stripe.verifySignature(raw, sign(raw), SECRET), true);
  assert.equal(stripe.verifySignature(raw, sign(raw, "whsec_" + "x".repeat(32)), SECRET), false);
  assert.equal(stripe.verifySignature(raw + " ", sign(raw), SECRET), false);
  const old = Math.floor(Date.now() / 1000) - 3600;
  assert.equal(stripe.verifySignature(raw, sign(raw, SECRET, old), SECRET), false);
  assert.equal(stripe.verifySignature(raw, "", SECRET), false);
  assert.equal(stripe.verifySignature(raw, "t=abc,v1=zz", SECRET), false);
  assert.equal(stripe.verifySignature(raw, sign(raw), ""), false);
  assert.equal(stripe.verifySignature(raw, sign(raw), "curto"), false);
  // Durante a troca do segredo o Stripe manda duas assinaturas; basta uma conferir.
  const good = sign(raw);
  assert.equal(stripe.verifySignature(raw, good + ",v1=" + "0".repeat(64), SECRET), true);
});

test("form encoding uses the bracket notation Stripe expects", () => {
  const body = stripe.encode({ mode: "payment", line_items: [{ quantity: 1, price_data: { currency: "usd" } }], metadata: { a: "x y" } }).join("&");
  assert.match(body, /mode=payment/);
  assert.match(body, /line_items%5B0%5D%5Bquantity%5D=1/);
  assert.match(body, /line_items%5B0%5D%5Bprice_data%5D%5Bcurrency%5D=usd/);
  assert.match(body, /metadata%5Ba%5D=x%20y/);
});

test("checkout items are validated against the catalog, never against the browser", () => {
  assert.throws(() => stripe.resolveItems([]), (e) => e.status === 400);
  assert.throws(() => stripe.resolveItems("card:x"), (e) => e.status === 400);
  assert.throws(() => stripe.resolveItems(Array.from({ length: 11 }, (_, i) => "card:x" + i)), (e) => e.status === 400);
  assert.throws(() => stripe.resolveItems(["card:claude-xlsx"]), /não está à venda/);
  assert.throws(() => stripe.resolveItems(["card:nao-existe"]), /não está à venda/);
  assert.throws(() => stripe.resolveItems(["deck-lancamento"]), /não está à venda/);
  assert.throws(() => stripe.resolveItems(["combo:planilhas-confiaveis"]), /não está à venda/);
  assert.throws(() => stripe.resolveItems([{ key: "card:automacao-documentos-office", price: 1 }]), /não está à venda/);
  const items = stripe.resolveItems(["card:automacao-documentos-office", "combo:power-bi-sob-controle", "card:automacao-documentos-office"]);
  assert.equal(items.length, 2);
  assert.equal(items[0].cents, catalog.get("card:automacao-documentos-office").priceUsd * 100);
  assert.equal(items[1].cents, Math.round(catalog.get("combo:power-bi-sob-controle").priceUsd * 100));
});

test("checkout session: dollars from the catalog, order id tying it back, adaptive pricing on", async () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_" + "k".repeat(24);
  const calls = [];
  const run = async (sql, values) => {
    calls.push([sql, values]);
    return { rowCount: 1, rows: [{ id: ORDER }] };
  };
  let request;
  const fakeFetch = async (url, options) => {
    request = { url, options };
    return { ok: true, status: 200, json: async () => ({ id: "cs_test_1", url: "https://checkout.stripe.com/c/pay/cs_test_1" }) };
  };
  const out = await stripe.createCheckout(
    { items: ["combo:power-bi-sob-controle"], email: "A@B.com", back: "/loja", price: 1, amount: 1 },
    run,
    { fetch: fakeFetch, origin: "https://deck.example" },
  );
  assert.equal(out.url, "https://checkout.stripe.com/c/pay/cs_test_1");
  const expected = Math.round(catalog.get("combo:power-bi-sob-controle").priceUsd * 100);
  assert.equal(out.amountCents, expected);
  assert.deepEqual(calls[0][1], [["combo:power-bi-sob-controle"], expected, "usd", expected, null]);
  assert.equal(request.url, "https://api.stripe.com/v1/checkout/sessions");
  assert.match(request.options.headers.Authorization, /^Bearer sk_test_/);
  assert.equal(request.options.headers["Idempotency-Key"], "order-" + ORDER);
  const form = new URLSearchParams(request.options.body);
  assert.equal(form.get("mode"), "payment");
  assert.equal(form.get("line_items[0][price_data][currency]"), "usd");
  assert.equal(form.get("line_items[0][price_data][unit_amount]"), String(expected));
  assert.equal(form.get("client_reference_id"), ORDER);
  assert.equal(form.get("metadata[order_id]"), ORDER);
  assert.equal(form.get("payment_intent_data[metadata][order_id]"), ORDER);
  assert.equal(form.get("adaptive_pricing[enabled]"), "true");
  assert.equal(form.get("customer_email"), "a@b.com");
  assert.equal(form.get("success_url"), "https://deck.example/acesso?compra=ok");
  assert.equal(form.get("cancel_url"), "https://deck.example/loja");
  assert.equal(form.get("automatic_tax[enabled]"), null);
  // O voltar só vai para páginas nossas.
  await stripe.createCheckout({ items: ["card:automacao-documentos-office"], back: "https://evil.example" }, run, { fetch: fakeFetch, origin: "https://deck.example" });
  assert.equal(new URLSearchParams(request.options.body).get("cancel_url"), "https://deck.example/loja");
  delete process.env.STRIPE_SECRET_KEY;
});

test("checkout fails closed without a key and hides Stripe errors from the buyer", async () => {
  delete process.env.STRIPE_SECRET_KEY;
  await assert.rejects(stripe.createCheckout({ items: ["card:automacao-documentos-office"] }, async () => ({ rows: [] })), (e) => e.status === 503);
  process.env.STRIPE_SECRET_KEY = "sk_test_" + "k".repeat(24);
  const run = async () => ({ rowCount: 1, rows: [{ id: ORDER }] });
  const bad = async () => ({ ok: false, status: 401, json: async () => ({ error: { type: "invalid_request_error", message: "Invalid API Key provided: sk_test_***" } }) });
  const original = console.error;
  console.error = () => {};
  try {
    await assert.rejects(
      stripe.createCheckout({ items: ["card:automacao-documentos-office"] }, run, { fetch: bad }),
      (e) => e.status === 502 && !/sk_test|Invalid API Key/.test(e.message),
    );
  } finally {
    console.error = original;
    delete process.env.STRIPE_SECRET_KEY;
  }
});

const session = (type, extra = {}, object = {}) => ({
  id: "evt_" + type.replace(/\W/g, "_") + (extra.suffix || ""),
  type,
  created: 1762600000,
  data: {
    object: {
      id: "cs_test_1",
      mode: "payment",
      payment_status: "paid",
      payment_intent: "pi_1",
      client_reference_id: ORDER,
      amount_total: 4700,
      currency: "usd",
      customer_details: { email: " Compradora@Teste.com ", name: "Compradora" },
      ...object,
    },
  },
});

test("events: paid sessions grant, unpaid Pix waits, partial refund is ignored, dispute revokes", () => {
  const paid = stripe.normalizeEvent(session("checkout.session.completed"));
  assert.equal(paid.action.type, "grant");
  assert.equal(paid.transaction, "pi_1");
  assert.equal(paid.email, "compradora@teste.com");
  assert.equal(paid.priceValue, 47);
  assert.equal(paid.currency, "USD");
  assert.equal(stripe.normalizeEvent(session("checkout.session.completed", {}, { payment_status: "unpaid" })).action, null);
  assert.equal(stripe.normalizeEvent(session("checkout.session.async_payment_succeeded", {}, { payment_status: "unpaid" })).action.type, "grant");
  assert.equal(stripe.normalizeEvent(session("checkout.session.completed", {}, { mode: "subscription" })).action, null);
  const refund = (full) => ({ id: "evt_r" + full, type: "charge.refunded", created: 1, data: { object: { refunded: full, payment_intent: "pi_1" } } });
  assert.equal(stripe.normalizeEvent(refund(true)).action.reason, "refunded");
  assert.equal(stripe.normalizeEvent(refund(false)).action, null);
  const dispute = stripe.normalizeEvent({ id: "evt_d", type: "charge.dispute.created", created: 1, data: { object: { payment_intent: "pi_1" } } });
  assert.equal(dispute.action.reason, "chargeback");
  assert.equal(dispute.transaction, "pi_1");
  assert.equal(stripe.normalizeEvent({ id: "evt_x", type: "customer.created", data: { object: {} } }).action, null);
  assert.throws(() => stripe.normalizeEvent({}), (e) => e.status === 400);
});

test("a repeated Stripe event is recognized before anything else happens", async () => {
  const calls = [];
  const run = async (sql) => (calls.push(sql), { rowCount: 0, rows: [] });
  const out = await stripe.processEvent(session("checkout.session.completed"), run);
  assert.equal(out.duplicate, true);
  // Só a leitura do pedido e o registro do evento; nada de acesso.
  assert.ok(calls.every((sql) => !/entitlements|customers/.test(sql)));
});

test("the Stripe webhook route and checkout route are wired, with the raw body kept", () => {
  const vercel = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
  assert.ok(vercel.rewrites.some((r) => r.source === "/api/webhooks/stripe" && /stripe-webhook/.test(r.destination)));
  const api = fs.readFileSync(path.join(root, "api/commerce.js"), "utf8");
  assert.match(api, /bodyParser: false/);
  assert.match(api, /"stripe-webhook": stripeWebhook/);
  assert.match(api, /checkout,/);
  assert.match(api, /verifySignature/);
  // A assinatura é conferida antes de qualquer leitura do evento.
  assert.ok(api.indexOf("verifySignature") < api.indexOf("parseJson(raw)"));
  const files = fs.readdirSync(path.join(root, "api")).filter((f) => f.endsWith(".js"));
  assert.ok(files.length <= 12, String(files.length));
});

test("raw body reader keeps bytes exactly and falls back only when the stream is gone", async () => {
  const { Readable } = require("node:stream");
  const payload = '{"a":"café","n":1.0}';
  const stream = Readable.from([Buffer.from(payload)]);
  stream.method = "POST";
  assert.equal(await commerce.readRawBody(stream), payload);
  const consumed = { method: "POST", readableEnded: true, destroyed: false, body: { a: 1 } };
  assert.equal(await commerce.readRawBody(consumed), '{"a":1}');
  await assert.rejects(commerce.readRawBody({ method: "GET" }), (e) => e.status === 405);
});

test("the page the buyer returns to explains what happens next", () => {
  const source = fs.readFileSync(path.join(root, "dist/acesso.js"), "utf8");
  assert.match(source, /compra"\) === "ok"/);
  assert.match(source, /Pix/);
});

test("the second migration widens providers, adds orders and still gives no DELETE", () => {
  const sql = fs.readFileSync(path.join(root, "supabase/migrations/20261108180000_stripe_orders.sql"), "utf8");
  assert.match(sql, /CHECK \(provider IN \('hotmart','stripe'\)\)/);
  assert.match(sql, /ALTER COLUMN hotmart_product_id DROP NOT NULL/);
  assert.match(sql, /ALTER TABLE skillmkt\.orders ENABLE ROW LEVEL SECURITY/);
  assert.match(sql, /REVOKE ALL ON skillmkt\.orders FROM PUBLIC, anon, authenticated, skillmkt_app/);
  assert.doesNotMatch(sql, /GRANT[^;]*DELETE/i);
  assert.doesNotMatch(sql, /\b(cpf|phone|telefone|card_number)\b/i);
});

test("the payment key may be a secret or a restricted key, never a publishable one", () => {
  const original = process.env.STRIPE_SECRET_KEY;
  for (const [value, expected] of [
    ["sk_test_" + "a".repeat(24), true],
    ["sk_live_" + "a".repeat(24), true],
    ["rk_live_" + "a".repeat(24), true],
    ["rk_test_" + "a".repeat(24), true],
    ["pk_live_" + "a".repeat(24), false],
    ["whsec_" + "a".repeat(24), false],
    ["", false],
  ]) {
    process.env.STRIPE_SECRET_KEY = value;
    assert.equal(stripe.configured(), expected, value.slice(0, 8));
  }
  if (original === undefined) delete process.env.STRIPE_SECRET_KEY;
  else process.env.STRIPE_SECRET_KEY = original;
});
