"use strict";
const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const fx = require("../lib/fx.cjs");
const stripe = require("../lib/stripe.cjs");
const catalog = require("../lib/sale-catalog.cjs");

const root = path.join(__dirname, "..");
const NOW = Date.UTC(2026, 10, 9, 18, 0, 0);
const ptax = (venda, when = "2026-11-09 13:11:19.041465") => async () => ({
  ok: true,
  status: 200,
  json: async () => ({ value: [{ dataHoraCotacao: when, cotacaoCompra: venda - 0.0006, cotacaoVenda: venda }] }),
});

beforeEach(() => {
  fx.reset();
  delete process.env.USD_BRL_RATE;
  delete process.env.BRL_MARGIN_PERCENT;
});

test("reais are whole numbers rounded up, so the real never undercharges the dollar", () => {
  assert.equal(fx.brlCents(4700, 5.5146), 26000);
  assert.equal(fx.brlCents(3700, 5.5146), 20500);
  assert.equal(fx.brlCents(11060, 5.5146), 61000);
  assert.equal(fx.brlCents(700, 5), 3500);
  assert.equal(fx.brlCents(100, 5.0001), 600);
  for (const p of catalog.list()) {
    const cents = Math.round(p.priceUsd * 100);
    if (cents > 0) assert.ok(fx.brlCents(cents, 5.5146) >= cents * 5.5146, p.key);
  }
});

test("the rate comes from the Central Bank selling PTAX and is cached", async () => {
  let calls = 0;
  const counting = async (...a) => ((calls += 1), ptax(5.5146)(...a));
  const first = await fx.getRate({ fetch: counting, now: NOW });
  assert.deepEqual(first, { rate: 5.5146, asOf: "2026-11-09", source: "ptax" });
  await fx.getRate({ fetch: counting, now: NOW + 3600000 });
  assert.equal(calls, 1);
  await fx.getRate({ fetch: counting, now: NOW + 7 * 3600000 });
  assert.equal(calls, 2);
});

test("a margin can be added and a fixed rate overrides the Central Bank", async () => {
  process.env.BRL_MARGIN_PERCENT = "2";
  assert.equal((await fx.getRate({ fetch: ptax(5), now: NOW })).rate, 5.1);
  process.env.BRL_MARGIN_PERCENT = "999";
  fx.reset();
  assert.equal((await fx.getRate({ fetch: ptax(5), now: NOW })).rate, 6);
  process.env.USD_BRL_RATE = "5.4";
  process.env.BRL_MARGIN_PERCENT = "0";
  const manual = await fx.getRate({ fetch: async () => assert.fail("não deve consultar"), now: NOW });
  assert.deepEqual(manual, { rate: 5.4, asOf: null, source: "manual" });
});

test("a broken or absurd rate is never used; old rate holds for 3 days, then dollars only", async () => {
  const down = async () => ({ ok: false, status: 503, json: async () => ({}) });
  assert.equal(await fx.getRate({ fetch: down, now: NOW }), null);
  assert.equal(await fx.getRate({ fetch: ptax(0.5), now: NOW }), null);
  assert.equal(await fx.getRate({ fetch: ptax(500), now: NOW }), null);
  assert.equal(await fx.getRate({ fetch: async () => ({ ok: true, json: async () => ({ value: [] }) }), now: NOW }), null);
  await fx.getRate({ fetch: ptax(5.5), now: NOW });
  const old = await fx.getRate({ fetch: down, now: NOW + 24 * 3600000 });
  assert.equal(old.source, "ptax-antiga");
  assert.equal(old.rate, 5.5);
  assert.equal(await fx.getRate({ fetch: down, now: NOW + 4 * 24 * 3600000 }), null);
});

test("the country comes from the platform header; the test override works only off Vercel", () => {
  const original = process.env.VERCEL;
  delete process.env.VERCEL;
  assert.equal(fx.countryOf({ headers: { "x-vercel-ip-country": "br" } }), "BR");
  assert.equal(fx.countryOf({ headers: {}, url: "/x?country=BR" }), "BR");
  assert.equal(fx.countryOf({ headers: {}, url: "/x?country=Brasil" }), null);
  process.env.VERCEL = "1";
  assert.equal(fx.countryOf({ headers: {}, url: "/x?country=BR" }), null);
  assert.equal(fx.countryOf({ headers: { "x-vercel-ip-country": "CA" } }), "CA");
  if (original === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = original;
});

test("a Brazilian checkout charges reais from the catalog price, without Adaptive Pricing", () => {
  const items = stripe.resolveItems(["combo:power-bi-sob-controle", "card:automacao-documentos-office"]);
  const form = new URLSearchParams(
    stripe.encode(stripe.sessionParams({ items, orderId: "o", back: "/loja", origin: "https://x.test", currency: "brl", rate: 5.5146 })).join("&"),
  );
  assert.equal(form.get("line_items[0][price_data][currency]"), "brl");
  assert.equal(form.get("line_items[0][price_data][unit_amount]"), String(fx.brlCents(items[0].cents, 5.5146)));
  assert.equal(form.get("line_items[1][price_data][unit_amount]"), String(fx.brlCents(items[1].cents, 5.5146)));
  assert.equal(form.get("adaptive_pricing[enabled]"), null);
  assert.equal(form.get("payment_method_options[card][installments][enabled]"), "true");
  assert.equal(form.get("locale"), "pt-BR");
  assert.match(form.get("line_items[0][price_data][product_data][description]"), /US\$ 1 = R\$ 5\.5146/);
  const usd = new URLSearchParams(stripe.encode(stripe.sessionParams({ items, orderId: "o", back: "/loja", origin: "https://x.test" })).join("&"));
  assert.equal(usd.get("line_items[0][price_data][currency]"), "usd");
  assert.equal(usd.get("adaptive_pricing[enabled]"), "true");
  assert.equal(usd.get("payment_method_options[card][installments][enabled]"), null);
});

test("the order records the amount charged, the dollar value and the rate used", async () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_" + "k".repeat(24);
  const calls = [];
  const run = async (sql, values) => (calls.push([sql, values]), { rowCount: 1, rows: [{ id: "11111111-2222-4333-8444-555555555555" }] });
  const fetched = async () => ({ ok: true, status: 200, json: async () => ({ id: "cs_test_1", url: "https://checkout.stripe.com/c/pay/cs_test_1" }) });
  const out = await stripe.createCheckout({ items: ["card:automacao-documentos-office"] }, run, { fetch: fetched, origin: "https://x.test", currency: "brl", rate: 5.5146 });
  const usdCents = Math.round(catalog.get("card:automacao-documentos-office").priceUsd * 100);
  assert.equal(out.currency, "brl");
  assert.equal(out.amountCents, fx.brlCents(usdCents, 5.5146));
  assert.deepEqual(calls[0][1], [["card:automacao-documentos-office"], out.amountCents, "brl", usdCents, 5.5146, null]);
  await assert.rejects(
    stripe.createCheckout({ items: ["card:automacao-documentos-office"] }, run, { fetch: fetched, currency: "brl", rate: null }),
    (e) => e.status === 503,
  );
  delete process.env.STRIPE_SECRET_KEY;
});

test("the browser computes the same reais the server charges, for every product on sale", () => {
  const context = { window: {}, fetch: async () => ({}), AbortSignal, Intl, document: { addEventListener() {} }, location: { search: "" } };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, "dist/buy.js"), "utf8"), context);
  const buy = context.window.DeckBuy;
  for (const rate of [5.5146, 4.9999, 6.1, 5]) {
    for (const p of catalog.list().filter((x) => x.priceUsd > 0)) {
      const cents = Math.round(p.priceUsd * 100);
      assert.equal(buy.reais(p.priceUsd, { rate }) * 100, fx.brlCents(cents, rate), p.key + " " + rate);
    }
  }
  assert.equal(buy.reais(47, null), null);
  assert.match(buy.reaisText(260), /^R\$ 260$/);
});

test("pages show dollar first and the real beside it only when the API says the buyer is in Brazil", () => {
  const api = fs.readFileSync(path.join(root, "api/commerce.js"), "utf8");
  assert.match(api, /\brate,\r?\n/);
  assert.match(api, /country === "BR"/);
  const buy = fs.readFileSync(path.join(root, "dist/buy.js"), "utf8");
  assert.match(buy, /currency === "brl"/);
  for (const file of ["dist/loja.js", "dist/oferta.js"]) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    assert.match(source, /DeckBuy\.(quote|reais)/, file);
  }
  const window = {};
  new Function("window", fs.readFileSync(path.join(root, "dist/oferta-config.js"), "utf8"))(window);
  assert.equal(window.DeckOffer.priceUsd, 47);
  assert.match(window.DeckOffer.currencyNote, /dólar do dia/);
});

test("the third migration allows reais and keeps the dollar value and the rate", () => {
  const sql = fs.readFileSync(path.join(root, "supabase/migrations/20261109120000_orders_brl.sql"), "utf8");
  assert.match(sql, /CHECK \(currency IN \('usd','brl'\)\)/);
  assert.match(sql, /ADD COLUMN usd_cents/);
  assert.match(sql, /ADD COLUMN fx_rate numeric\(10,4\)/);
  assert.doesNotMatch(sql, /GRANT|DELETE FROM/i);
});
