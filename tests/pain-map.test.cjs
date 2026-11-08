"use strict";
const { test } = require("node:test"), assert = require("node:assert/strict");
const { areas } = require("../data/pain-map.cjs");
const { getPainMap, painTerms } = require("../lib/pain-map.cjs");
const skills = require("../data/skills.cjs");
const rights = require("../lib/sale-rights.cjs");

test("cada frase da descoberta leva a cartas reais e disponíveis", () => {
  const ids = new Set(skills.map((s) => s.id)), seen = new Set();
  for (const [, , symptoms] of areas)
    for (const [id, , , , cards] of symptoms) {
      assert.ok(!seen.has(id), id);
      seen.add(id);
      assert.ok(cards.length >= 2 && cards.length <= 3, id);
      for (const card of cards) {
        assert.ok(ids.has(card), card);
        const status = rights.classify(card);
        assert.ok(status.ready || status.class === "free-apache", card);
      }
    }
  assert.ok(seen.size >= 30);
});

test("as três línguas têm texto próprio, sem jargão de carta e sem travessão", () => {
  for (const locale of ["pt", "en", "es"])
    for (const area of getPainMap(locale)) {
      assert.ok(area.label);
      for (const s of area.symptoms) {
        assert.ok(s.say.length > 15 && s.name && s.first.length > 20, s.id);
        assert.doesNotMatch(s.say + s.name + s.first, /\u2014/);
      }
    }
  const pt = getPainMap("pt"), en = getPainMap("en");
  assert.notEqual(pt[0].symptoms[0].say, en[0].symptoms[0].say);
});

test("palavras do dia a dia encontram a carta", () => {
  assert.match(painTerms("automacao-documentos-office", "pt"), /copiando e colando/);
  assert.equal(painTerms("figma-use", "pt"), "");
});
