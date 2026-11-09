"use strict";
// Tudo que pode ser vendido, em três tamanhos: deck, combo e carta avulsa.
// A chave do produto é o que o webhook grava em purchases e entitlements.
const decks = require("../data/sale-products.cjs");
const skills = require("../data/skills.cjs");
const { getSkillPricing, getCombos } = require("./pricing.cjs");
const { canSell } = require("./sale-rights.cjs");

const usd = (cents) => cents / 100;

function build() {
  const list = [];
  for (const deck of decks)
    list.push({
      key: deck.key,
      kind: "deck",
      title: deck.title,
      priceUsd: deck.priceUsd,
      referenceUsd: usd(
        deck.skillIds.reduce((sum, id) => sum + (getSkillPricing(id)?.priceCents || 0), 0),
      ),
      skillIds: deck.skillIds,
      status: deck.status,
    });
  for (const combo of getCombos("pt"))
    list.push({
      key: "combo:" + combo.id,
      kind: "combo",
      title: combo.title,
      priceUsd: usd(combo.priceCents),
      referenceUsd: usd(combo.individualTotalCents),
      skillIds: combo.skillIds,
      status: "proposed",
    });
  for (const skill of skills) {
    const pricing = getSkillPricing(skill.id);
    if (!pricing) continue;
    list.push({
      key: "card:" + skill.id,
      kind: "card",
      title: skill.title,
      code: skill.code,
      priceUsd: usd(pricing.priceCents),
      referenceUsd: usd(pricing.priceCents),
      skillIds: [skill.id],
      status: "proposed",
    });
  }
  return list;
}

const all = build();
const byKey = new Map(all.map((p) => [p.key, p]));
if (byKey.size !== all.length) throw Error("Chave de produto repetida");
for (const key of byKey.keys())
  if (key.length > 60) throw Error("Chave de produto maior que o banco aceita: " + key);

const get = (key) => byKey.get(key) || null;
// Só é vendável quando toda carta do produto tem direito de venda confirmado.
const sellable = (key) => {
  const product = get(key);
  return Boolean(product && product.skillIds.every(canSell));
};
const list = () => all;

module.exports = { list, get, sellable };
