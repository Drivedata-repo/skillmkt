"use strict";
const rights = require("../data/sale-rights.cjs");

const classes = {
  ownDeclared: { key: "own-declared", rights: true, ready: true },
  mit: { key: "mit", rights: true, ready: true },
  apacheInPackage: { key: "apache-2.0", rights: true, ready: true },
  freeOffice: { key: "free-apache", rights: true, ready: false },
  proprietary: { key: "proprietary", rights: false, ready: false },
  noLicense: { key: "no-license", rights: false, ready: false },
};

const byId = new Map();
for (const [list, info] of Object.entries(classes))
  for (const id of rights[list]) {
    if (byId.has(id)) throw Error("Carta em duas classes de direito: " + id);
    byId.set(id, info);
  }

function validAuthorization(id) {
  const a = rights.authorizations[id];
  return Boolean(a && a.by && a.date && a.document);
}

function classify(id) {
  const info = byId.get(id);
  if (!info) return { id, class: "unknown", rights: false, ready: false };
  if (!info.rights && validAuthorization(id))
    return { id, class: "authorized", rights: true, ready: true };
  return { id, class: info.key, rights: info.rights, ready: info.ready };
}

// Só o que pode entrar em produto hoje: direito confirmado e pacote em condições.
const canSell = (id) => classify(id).ready;

function productProblems(products) {
  const problems = [];
  for (const product of products)
    for (const id of product.skillIds) {
      const status = classify(id);
      if (!status.ready)
        problems.push(`${product.key}: ${id} (${status.class})`);
    }
  return problems;
}

function summary(ids) {
  const out = { total: ids.length, rights: 0, ready: 0, blocked: 0, classes: {} };
  for (const id of ids) {
    const status = classify(id);
    out.classes[status.class] = (out.classes[status.class] || 0) + 1;
    if (status.rights) out.rights += 1;
    else out.blocked += 1;
    if (status.ready) out.ready += 1;
  }
  return out;
}

module.exports = { classify, canSell, productProblems, summary };
