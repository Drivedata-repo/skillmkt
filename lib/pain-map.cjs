"use strict";
const { areas } = require("../data/pain-map.cjs");
const index = (locale) => ({ en: 1, es: 2 })[locale] || 0;

function getPainMap(locale = "pt") {
  const i = index(locale);
  return areas.map(([id, label, symptoms]) => ({
    id,
    label: label[i],
    symptoms: symptoms.map(([sid, say, name, first, skillIds]) => ({ id: sid, say: say[i], name: name[i], first: first[i], skillIds })),
  }));
}

// Palavras comuns que também encontram a carta na busca da coleção.
function painTerms(skillId, locale = "pt") {
  const i = index(locale);
  const terms = [];
  for (const [, label, symptoms] of areas)
    for (const [, say, name, , skillIds] of symptoms)
      if (skillIds.includes(skillId)) terms.push(label[i], say[i], name[i]);
  return [...new Set(terms)].join(" ");
}

module.exports = { getPainMap, painTerms };
