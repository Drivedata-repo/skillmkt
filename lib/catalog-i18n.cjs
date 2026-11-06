"use strict";

// Authored translations of product metadata; downloaded skill sources are untouched.
const catalogText = require("../data/i18n/catalog-text.json");
const { getUniverse } = require("./universes.cjs");

function normalizeLocale(locale) {
  const code = String(locale || "pt")
    .toLowerCase()
    .split(/[-_]/)[0];
  return code === "en" || code === "es" ? code : "pt";
}

function translateCatalogText(text, locale) {
  const lang = normalizeLocale(locale);
  if (typeof text !== "string" || lang === "pt") return text;
  const entry = catalogText[text];
  return entry ? entry[lang === "en" ? 0 : 1] : text;
}

function translateValue(value, locale) {
  if (typeof value === "string") return translateCatalogText(value, locale);
  if (Array.isArray(value))
    return value.map((item) => translateValue(item, locale));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        translateValue(item, locale),
      ]),
    );
  return value;
}

function localizeCatalog(catalog, locale) {
  const lang = normalizeLocale(locale);
  if (lang === "pt") return catalog;
  const skills = catalog.skills.map((source) => {
    const { universe, ...metadata } = source;
    const skill = translateValue(metadata, lang);
    // These narratives are authored per skill and locale, not machine-translated
    // or indexed by shared sentences that may have different meanings.
    skill.universe = structuredClone(getUniverse(source.id, lang));
    skill.categoryKey = source.categoryKey || source.category;
    // Exact authored phrases localize synthetic input/output narratives together.
    // IDs, hashes, numeric strings, dates, formulas and filenames are not rewritten.
    const delivery = skill.deliverables[0];
    skill.firstPrompt =
      lang === "en"
        ? `Use the ${skill.id} skill to help me with this task: [describe your task].\n\nDesired result: ${delivery}.\nAvailable materials: [list the files and sources].\nBefore starting, confirm the necessary tools and missing information. Do not invent data or take external actions without my authorization. When finished, show the result and how I can check it.`
        : `Usa la skill ${skill.id} para ayudarme con esta tarea: [describe tu tarea].\n\nResultado deseado: ${delivery}.\nMateriales disponibles: [enumera los archivos y las fuentes].\nAntes de empezar, confirma las herramientas necesarias y la información que falta. No inventes datos ni ejecutes acciones externas sin mi autorización. Al terminar, muestra el resultado y cómo puedo comprobarlo.`;
    skill.acceptance =
      lang === "en"
        ? [
            `The deliverable covers: ${delivery}.`,
            "Data and claims have identifiable sources.",
            "Outstanding items, dependencies and limitations are explicit.",
          ]
        : [
            `La entrega contempla: ${delivery}.`,
            "Los datos y las afirmaciones tienen fuentes identificadas.",
            "Los asuntos pendientes, las dependencias y las limitaciones son explícitos.",
          ];
    return skill;
  });
  return {
    ...catalog,
    skills,
    journeys: translateValue(catalog.journeys, lang),
  };
}

module.exports = { localizeCatalog, translateCatalogText, normalizeLocale };
