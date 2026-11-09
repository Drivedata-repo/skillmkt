"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const skills = require("../data/skills.cjs");
const rightsData = require("../data/sale-rights.cjs");
const products = require("../data/sale-products.cjs");
const rights = require("../lib/sale-rights.cjs");
const commerce = require("../lib/commerce.cjs");
const customerAuth = require("../lib/customer-auth.cjs");
const access = require("../lib/access.cjs");
const mailer = require("../lib/mailer.cjs");

process.env.CUSTOMER_SESSION_SECRET = "s".repeat(40);
const root = path.join(__dirname, "..");
const ids = skills.map((s) => s.id);
const UUID = "11111111-2222-4333-8444-555555555555";

test("all 137 cards have exactly one rights class", () => {
  const lists = ["ownDeclared", "mit", "apacheInPackage", "freeOffice", "proprietary", "noLicense"];
  const all = lists.flatMap((k) => rightsData[k]);
  assert.equal(all.length, 184);
  assert.deepEqual([...new Set(all)].sort(), [...ids].sort());
  const s = rights.summary(ids);
  assert.equal(s.rights, 146);
  assert.equal(s.blocked, 38);
  assert.equal(s.ready, 142);
});

test("proprietary and unlicensed cards cannot be sold", () => {
  for (const id of ["claude-xlsx", "claude-docx", "figma-use", "claude-security"])
    assert.equal(rights.canSell(id), false, id);
  assert.equal(rights.canSell("automacao-documentos-office"), true);
  assert.equal(rights.canSell("brief"), true);
  assert.equal(rights.canSell("portfolio-de-projetos"), true);
  assert.equal(rights.canSell("code-review-and-quality"), true);
});

test("a blocked card is unlocked only by a complete written authorization", () => {
  rightsData.authorizations["claude-computer-use"] = { by: "Titular" };
  assert.equal(rights.canSell("claude-computer-use"), false);
  rightsData.authorizations["claude-computer-use"] = { by: "Titular", date: "2026-11-08", document: "ref" };
  assert.equal(rights.canSell("claude-computer-use"), true);
  delete rightsData.authorizations["claude-computer-use"];
});

test("every product contains only cards sellable today", () => {
  assert.deepEqual(rights.productProblems(products), []);
  const blocked = [{ key: "x", skillIds: ["claude-xlsx"] }];
  assert.equal(rights.productProblems(blocked).length, 1);
});

test("access expansion drops anything that cannot be sold", () => {
  const set = commerce.skillsForProducts(["deck-lancamento", "nao-existe"]);
  assert.equal(set.size, 6);
  assert.ok(!set.has("claude-xlsx"));
});

test("hottok is required, compared by value and accepted from the header", () => {
  const old = process.env.HOTMART_HOTTOK;
  delete process.env.HOTMART_HOTTOK;
  assert.throws(() => commerce.hottokValid({ headers: {} }, {}), /configurado/);
  process.env.HOTMART_HOTTOK = "h".repeat(32);
  assert.equal(commerce.hottokValid({ headers: { "x-hotmart-hottok": "h".repeat(32) } }, {}), true);
  assert.equal(commerce.hottokValid({ headers: {} }, { hottok: "h".repeat(32) }), true);
  assert.equal(commerce.hottokValid({ headers: { "x-hotmart-hottok": "errado" } }, {}), false);
  assert.equal(commerce.hottokValid({ headers: {} }, {}), false);
  if (old === undefined) delete process.env.HOTMART_HOTTOK;
  else process.env.HOTMART_HOTTOK = old;
});

test("state machine: refund and chargeback are terminal, cancel is not", () => {
  const grant = { type: "grant" };
  assert.equal(commerce.transition("pending", grant).effect, "grant");
  assert.equal(commerce.transition("refunded", grant).effect, "none");
  assert.equal(commerce.transition("chargeback", grant).outcome, "blocked-terminal");
  assert.equal(commerce.transition("canceled", grant).effect, "grant");
  assert.equal(commerce.transition("approved", { type: "revoke", reason: "refunded" }).status, "refunded");
  assert.deepEqual(commerce.actionFor("PURCHASE_COMPLETE"), grant);
  assert.equal(commerce.actionFor("PURCHASE_CHARGEBACK").reason, "chargeback");
  assert.equal(commerce.actionFor("PURCHASE_DELAYED"), null);
});

test("product map keeps only known product keys", () => {
  const map = commerce.productMap("10=deck-lancamento, 20=deck-comercial,30=inventado,=x");
  assert.equal(map.get("10"), "deck-lancamento");
  assert.equal(map.get("20"), "deck-comercial");
  assert.equal(map.size, 2);
});

test("duplicated event does nothing beyond the first insert", async () => {
  const calls = [];
  const run = async (sql) => (calls.push(sql), { rowCount: 0, rows: [] });
  const r = await commerce.processEvent({ id: "e1", event: "PURCHASE_APPROVED", data: {} }, run, { map: new Map() });
  assert.equal(r.duplicate, true);
  assert.equal(calls.length, 1);
});

test("normalize keeps no phone or document", () => {
  const n = commerce.normalize({
    id: "e",
    event: "purchase_approved",
    creation_date: 1700000000000,
    data: {
      product: { id: 123 },
      buyer: { email: " A@B.com ", name: "Ana", checkout_phone: "5511", document: "000" },
      purchase: { transaction: "HP1", price: { value: 47, currency_value: "USD" } },
    },
  });
  assert.equal(n.email, "a@b.com");
  assert.equal(n.productId, "123");
  assert.ok(!JSON.stringify(n).includes("5511"));
  assert.ok(!JSON.stringify(n).includes('"000"'));
});

test("customer session rejects tampering, expiry and malformed tokens", () => {
  const now = Date.now();
  const token = customerAuth.issue({ id: UUID, sessionVersion: 2 }, now);
  assert.deepEqual(customerAuth.parse(token, now), { customerId: UUID, sessionVersion: 2 });
  assert.equal(customerAuth.parse(token + "x", now), null);
  assert.equal(customerAuth.parse(token.replace(".2.", ".3."), now), null);
  assert.equal(customerAuth.parse(token, now + 8 * 86400000), null);
  assert.equal(customerAuth.parse("c1.a.b", now), null);
});

test("passwords are hashed and verified; a missing account never matches", async () => {
  const stored = await customerAuth.hashPassword("senha-de-teste-1");
  assert.match(stored, /^[a-f0-9]{32}:[a-f0-9]{128}$/);
  assert.equal(await customerAuth.verifyPassword("senha-de-teste-1", stored), true);
  assert.equal(await customerAuth.verifyPassword("outra", stored), false);
  assert.equal(await customerAuth.verifyPassword("x", null), false);
});

test("customer cookie is HttpOnly, Lax and host-only on Vercel", () => {
  const old = process.env.VERCEL;
  process.env.VERCEL = "1";
  const c = customerAuth.cookie("t");
  assert.match(c, /^__Host-deck_customer=t/);
  assert.match(c, /HttpOnly/);
  assert.match(c, /SameSite=Lax/);
  assert.match(c, /; Secure/);
  if (old === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = old;
});

function customerRequest(version = 1) {
  const token = customerAuth.issue({ id: UUID, sessionVersion: version });
  return { headers: { cookie: "deck_customer=" + token } };
}
const owning = (products_, version = 1) => async () => ({
  rows: [{ email: "a@b.com", session_version: version, products: products_ }],
});

test("customer access is limited to what was bought", async () => {
  const a = await access.resolveAccess(customerRequest(), owning(["deck-comercial"]));
  assert.equal(a.kind, "customer");
  assert.equal(a.skillIds.size, 3);
  assert.equal(access.allowsSkill(a, "prospeccao-b2b-linkedin"), true);
  assert.throws(() => access.requireSkill(a, "claude-xlsx"), (e) => e.status === 403);
});

test("an old session stops working after the password changes", async () => {
  assert.equal(await access.resolveAccess(customerRequest(1), owning([], 2)), null);
});

test("no cookie means 401 without touching the database", async () => {
  let called = false;
  await assert.rejects(
    access.requireAccess({ headers: {} }, async () => ((called = true), { rows: [] })),
    (e) => e.status === 401,
  );
  assert.equal(called, false);
});

test("closing the demo rejects demo sessions and changes the login message", async () => {
  const auth = require("../lib/auth.cjs");
  const crypto = require("node:crypto");
  const salt = crypto.randomBytes(16).toString("hex");
  process.env.DEMO_PASSWORD_HASH = salt + ":" + crypto.scryptSync("x", salt, 64).toString("hex");
  process.env.DEMO_SESSION_SECRET = "d".repeat(40);
  const req = { headers: { cookie: "drive_demo=" + auth.issue() } };
  assert.equal((await access.resolveAccess(req)).kind, "demo");
  process.env.DEMO_ENABLED = "false";
  await assert.rejects(access.requireAccess(req), /sua compra/);
  delete process.env.DEMO_ENABLED;
});

test("catalog and triage show a customer only the owned cards", () => {
  const a = { kind: "customer", skillIds: new Set(["a"]) };
  const out = access.restrictCatalog(
    {
      skills: [{ id: "a", pricing: { demoLabel: "Grátis na demo" } }, { id: "b" }],
      journeys: [{ steps: [{ id: "a" }, { id: "b" }] }, { steps: [{ id: "a" }] }],
      combos: [{ skillIds: ["a", "b"] }],
      packs: [{ steps: [{ skillId: "a" }] }],
    },
    a,
    "pt",
  );
  assert.equal(out.mode, "customer");
  assert.deepEqual(out.skills.map((s) => s.id), ["a"]);
  assert.equal(out.skills[0].pricing.demoLabel, "Incluída na sua compra");
  assert.equal(out.journeys.length, 1);
  assert.equal(out.combos.length, 0);
  assert.equal(out.packs.length, 1);
  const t = access.restrictTriage(
    { matches: [{ id: "a" }, { id: "b" }], candidateIds: ["b", "a"], plan: { steps: [{ skillId: "b" }] } },
    a,
  );
  assert.deepEqual(t.matches, [{ id: "a" }]);
  assert.deepEqual(t.candidateIds, ["a"]);
  assert.equal(t.plan, null);
});

test("demo keeps the full catalog", () => {
  const c = { skills: [1, 2], journeys: [], combos: [], packs: [] };
  assert.equal(access.restrictCatalog(c, { kind: "demo" }, "pt"), c);
});

test("mail without provider reports it and never throws; failures are absorbed", async () => {
  delete process.env.MAIL_API_KEY;
  assert.deepEqual(await mailer.sendAccessEmail({ email: "a@b.com", token: "t", purpose: "reset" }), {
    sent: false,
    reason: "not-configured",
  });
  process.env.MAIL_API_KEY = "k";
  process.env.MAIL_FROM = "x@y.com";
  const down = async () => {
    throw new Error("rede");
  };
  assert.equal((await mailer.sendAccessEmail({ email: "a@b.com", token: "t", purpose: "reset" }, down)).sent, false);
  delete process.env.MAIL_API_KEY;
  delete process.env.MAIL_FROM;
});

test("access link carries the token only after the hash and escapes the name", () => {
  const m = mailer.accessMessage({ name: "<b>Ana", token: "abc", purpose: "first-access" });
  assert.match(m.text, /\/acesso#t=abc/);
  assert.ok(!m.text.includes("?t="));
  assert.ok(!m.html.includes("<b>Ana"));
});

test("the function count stays within the Hobby limit and new routes are wired", () => {
  const files = fs.readdirSync(path.join(root, "api")).filter((f) => f.endsWith(".js"));
  assert.ok(files.length <= 12, String(files.length));
  const vercel = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
  const sources = vercel.rewrites.map((r) => r.source);
  for (const s of ["/acesso", "/oferta", "/api/webhooks/hotmart", "/api/account/:route"]) assert.ok(sources.includes(s), s);
  const oferta = vercel.headers.find((h) => h.source === "/oferta");
  assert.ok(oferta.headers.some((h) => h.key === "Content-Security-Policy"));
});

test("migration protects buyer data and gives the runtime no DELETE", () => {
  const sql = fs.readFileSync(path.join(root, "supabase/migrations/20261108120000_commerce_accounts.sql"), "utf8");
  for (const t of ["customers", "webhook_events", "purchases", "entitlements", "access_tokens"])
    assert.match(sql, new RegExp(`ALTER TABLE skillmkt\\.${t} ENABLE ROW LEVEL SECURITY`));
  assert.match(sql, /FROM PUBLIC, anon, authenticated, skillmkt_app/);
  assert.doesNotMatch(sql, /GRANT[^;]*DELETE/i);
  assert.doesNotMatch(sql, /\b(cpf|phone|telefone)\s+text/i);
});

test("offer page: only play and pause, proof never invented, card list matches the product", () => {
  const html = fs.readFileSync(path.join(root, "dist/oferta.html"), "utf8");
  assert.doesNotMatch(html, /<video[^>]*\bcontrols\b/);
  assert.match(html, /noindex/);
  assert.doesNotMatch(html, /https?:\/\/[^"']*\.(js|css)/);
  const window = {};
  new Function("window", fs.readFileSync(path.join(root, "dist/oferta-config.js"), "utf8"))(window);
  assert.deepEqual(window.DeckOffer.proofs, []);
  assert.equal(window.DeckOffer.revealAt, 720);
  assert.equal(window.DeckOffer.priceLabel, "US$ 47");
  assert.match(window.DeckOffer.currencyNote, /dólar do dia/);
  const main = products.find((p) => p.role === "main");
  assert.deepEqual(
    window.DeckOffer.cards.map((c) => c.code).sort(),
    main.skillIds.map((id) => skills.find((s) => s.id === id).code).sort(),
  );
  const weight = ["oferta.html", "oferta.css", "oferta.js", "oferta-config.js"].reduce(
    (sum, f) => sum + fs.statSync(path.join(root, "dist", f)).size,
    0,
  );
  assert.ok(weight < 30000, String(weight));
});
