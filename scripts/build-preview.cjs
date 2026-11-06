const fs = require("node:fs");
const catalog = require("../lib/catalog.cjs");
const { localizeCatalog } = require("../lib/catalog-i18n.cjs");
const { translate } = require("../dist/i18n-core.js");
const dictionary = {
  ...require("../data/i18n-market.cjs"),
  ...require("../data/i18n-public.cjs"),
};
const missions = [
  {
    id: "spreadsheets",
    label: "Dominar minhas planilhas",
    short: "Planilhas",
    skillId: "claude-xlsx",
  },
  {
    id: "bi",
    label: "Confiar nos meus indicadores",
    short: "Indicadores",
    skillId: "power-bi-modelagem-dax-performance",
  },
  {
    id: "product",
    label: "Tirar minha ideia do papel",
    short: "Produto",
    skillId: "prototipos-e-especificacao-funcional",
  },
  {
    id: "content",
    label: "Explicar melhor minha oferta",
    short: "Conteúdo",
    skillId: "marketing-de-conteudo-b2b",
  },
];
function build(locale) {
  const { skills } = localizeCatalog(catalog, locale);
  return missions.map((m) => {
    const s = skills.find((s) => s.id === m.skillId);
    return {
      ...m,
      label: translate(dictionary, locale, m.label),
      short: translate(dictionary, locale, m.short),
      card: {
        id: s.id,
        code: s.code,
        title: s.title,
        category: s.category,
        categoryKey: s.categoryKey || s.category,
        role: s.role,
        deliverables: s.deliverables,
        featured: s.featured,
        version: s.version,
      },
      example: {
        kind: s.example.kind,
        input: s.example.input,
        result: s.example.result,
        checks: s.example.checks,
        title: s.example.title,
        before: s.example.before,
        expected: s.example.expected,
        task: s.example.task,
        limitation: s.example.limitation,
      },
    };
  });
}
const result = Object.fromEntries(
  ["pt", "en", "es"].map((locale) => [locale, build(locale)]),
);
fs.writeFileSync(
  "dist/public-preview.js",
  "// Public, fictional previews deliberately selected for the landing page.\nconst PublicPreview = (" +
    JSON.stringify(result, null, 2) +
    ")[DeckI18n.locale];\n",
);
console.log("4 public mission previews prepared");
