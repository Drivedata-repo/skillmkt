"use strict";
// Gera dist/loja-data.js com tudo que está à venda: sem rascunho e só com direito de venda.
// O preço mostrado vem do catálogo; o valor cobrado é calculado de novo no servidor.
const fs = require("node:fs");
const path = require("node:path");
const catalog = require("../lib/sale-catalog.cjs");
const skills = require("../data/skills.cjs");

const byId = new Map(skills.map((s) => [s.id, s]));
const order = { deck: 0, combo: 1, card: 2 };
const items = catalog
  .list()
  .filter((p) => p.status !== "draft" && catalog.sellable(p.key) && p.priceUsd > 0)
  .map((p) => ({
    key: p.key,
    kind: p.kind,
    title: p.title,
    code: p.code || null,
    priceUsd: p.priceUsd,
    referenceUsd: p.referenceUsd,
    cards: p.skillIds.map((id) => ({ code: byId.get(id).code, title: byId.get(id).title })),
  }))
  .sort((a, b) => order[a.kind] - order[b.kind] || a.title.localeCompare(b.title, "pt"));

fs.writeFileSync(
  path.join(__dirname, "../dist/loja-data.js"),
  `"use strict";\nwindow.DeckStore=${JSON.stringify({ items })};\n`,
);
console.log(`${items.length} produtos na loja.`);
