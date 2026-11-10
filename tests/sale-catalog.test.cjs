"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const catalog = require("../lib/sale-catalog.cjs");
const commerce = require("../lib/commerce.cjs");
const access = require("../lib/access.cjs");
const rights = require("../lib/sale-rights.cjs");
const skills = require("../data/skills.cjs");

const root = path.join(__dirname, "..");

test("the catalog offers decks, combos and one product per priced card", () => {
  const list = catalog.list();
  const count = (kind) => list.filter((p) => p.kind === kind).length;
  assert.equal(count("deck"), 2);
  assert.equal(count("combo"), 5);
  assert.equal(count("card"), skills.length);
  assert.equal(new Set(list.map((p) => p.key)).size, list.length);
  for (const p of list) assert.ok(p.key.length <= 60, p.key);
});

test("a product is sellable only when every card in it can be sold", () => {
  assert.equal(catalog.sellable("card:automacao-documentos-office"), true);
  assert.equal(catalog.sellable("card:claude-xlsx"), false);
  assert.equal(catalog.sellable("combo:power-bi-sob-controle"), true);
  assert.equal(catalog.sellable("combo:planilhas-confiaveis"), false);
  assert.equal(catalog.sellable("combo:documentos-que-convencem"), false);
  assert.equal(catalog.sellable("card:nao-existe"), false);
  for (const p of catalog.list())
    assert.equal(catalog.sellable(p.key), p.skillIds.every((id) => rights.canSell(id)), p.key);
});

test("card and combo prices come from the catalog pricing, never typed by hand", () => {
  const { getSkillPricing, getCombo } = require("../lib/pricing.cjs");
  assert.equal(catalog.get("card:automacao-documentos-office").priceUsd * 100, getSkillPricing("automacao-documentos-office").priceCents);
  assert.equal(catalog.get("combo:power-bi-sob-controle").priceUsd * 100, getCombo("power-bi-sob-controle").priceCents);
  assert.ok(catalog.get("combo:power-bi-sob-controle").referenceUsd > catalog.get("combo:power-bi-sob-controle").priceUsd);
});

test("webhook map accepts cards, combos and decks, and refuses what cannot be sold", () => {
  const map = commerce.productMap(
    "1=card:automacao-documentos-office,2=combo:power-bi-sob-controle,3=card:claude-xlsx,4=combo:planilhas-confiaveis,5=deck-lancamento,6=inventado,bad id=deck-comercial",
  );
  assert.deepEqual([...map.keys()].sort(), ["1", "2", "5"]);
  assert.equal(map.get("2"), "combo:power-bi-sob-controle");
});

test("access follows what was bought: one card, one combo, never a blocked card", () => {
  assert.equal(commerce.skillsForProducts(["card:automacao-documentos-office"]).size, 1);
  assert.equal(commerce.skillsForProducts(["combo:power-bi-sob-controle"]).size, 4);
  assert.equal(commerce.skillsForProducts(["card:claude-xlsx"]).size, 0);
  const both = commerce.skillsForProducts(["combo:power-bi-sob-controle", "card:automacao-documentos-office"]);
  assert.equal(both.size, 5);
});

test("the client reads the labels the server sends and keeps the demo wording as fallback", () => {
  const source = fs.readFileSync(path.join(root, "dist/commerce.js"), "utf8");
  assert.match(source, /p\.demoLabel\|\|t\("Grátis na demo"\)/);
  assert.match(source, /p\.label\|\|t\("Preço proposto"\)/);
});

test("the store lists what is on sale, never drafts or blocked cards, and holds no external link", () => {
  const html = fs.readFileSync(path.join(root, "dist/loja.html"), "utf8");
  assert.match(html, /noindex/);
  assert.doesNotMatch(html, /https?:\/\/[^"']*\.(js|css)/);
  const window = {};
  new Function("window", fs.readFileSync(path.join(root, "dist/loja-data.js"), "utf8"))(window);
  const keys = window.DeckStore.items.map((i) => i.key);
  assert.ok(keys.length > 0);
  for (const key of keys) {
    assert.ok(catalog.sellable(key), key);
    assert.notEqual(catalog.get(key).status, "draft", key);
  }
  assert.ok(!keys.includes("deck-lancamento"));
  assert.ok(!keys.includes("card:claude-xlsx"));
  assert.doesNotMatch(JSON.stringify(window.DeckStore), /hotmart|https?:/i);
});

test("the buy script only sends product keys and only follows a Stripe address", () => {
  const source = fs.readFileSync(path.join(root, "dist/buy.js"), "utf8");
  // O corpo enviado ao servidor leva só as chaves e a página de volta; o valor nunca sai do navegador.
  assert.ok(source.includes("body: JSON.stringify({ items: keys, back }),"));
  // Sem conta, a pessoa vai criar a dela e volta para comprar.
  assert.match(source, /\/acesso\?cadastro=1/);
  assert.equal(source.split("JSON.stringify").length - 1, 1);
  assert.match(source, /endsWith\("stripe\.com"\)/);
});
