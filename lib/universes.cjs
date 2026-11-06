"use strict";

// Editorial material only. Original skill packages and their release hashes stay intact.
const records = [
  ...require("../data/universes/001-046.json"),
  ...require("../data/universes/047-092.json"),
  ...require("../data/universes/093-137.json"),
];
const byId = new Map();
const keys = [
  "alias",
  "tagline",
  "story",
  "purpose",
  "useCases",
  "scenario",
  "steps",
  "boundary",
].sort();
for (const record of records) {
  if (!record.id || byId.has(record.id))
    throw new Error("Duplicate universe: " + record.id);
  for (const locale of ["pt", "en", "es"]) {
    const u = record[locale];
    if (!u || Object.keys(u).sort().join() !== keys.join())
      throw new Error("Universe schema: " + record.id + "/" + locale);
    if (u.useCases.length !== 2 || u.steps.length !== 3)
      throw new Error("Universe steps: " + record.id);
    if (
      Object.keys(u.scenario).sort().join() !==
      "check,context,output,request,title"
    )
      throw new Error("Universe scenario: " + record.id);
    const leaves = (value) =>
      typeof value === "string"
        ? [value]
        : Object.values(value).flatMap(leaves);
    if (leaves(u).some((text) => !text.trim()))
      throw new Error("Empty universe field: " + record.id);
  }
  byId.set(record.id, record);
}
function getUniverse(id, locale = "pt") {
  const record = byId.get(id);
  if (!record) throw new Error("Missing universe: " + id);
  return record[locale === "en" || locale === "es" ? locale : "pt"];
}
module.exports = { records, getUniverse };
