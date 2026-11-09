// Gera dist/home-fable-data.js, o índice público usado pelo protótipo home-fable.
// Publica só o que a grade mostra: código, nome, grupo e acabamento de cada carta,
// mais as três cartas de cada jornada ligada a uma tarefa da home.
// Rode com: node scripts/build-home-fable-data.cjs
const fs = require("node:fs");
const vm = require("node:vm");
const catalog = require("../lib/catalog.cjs");
const journeys = require("../data/journeys.cjs");

// O acabamento usa a mesma regra de dist/deck-art.js, sem copiar os limites.
const DeckArt = vm.runInNewContext(
  fs.readFileSync("dist/deck-art.js", "utf8") + "\nDeckArt;",
);
const finishOf = (s) => DeckArt.finish(s)?.key || "paper";

const groupNames = [...new Set(catalog.skills.map((s) => s.category))];
const groups = groupNames
  .map((name) => ({
    name,
    count: catalog.skills.filter((s) => s.category === name).length,
  }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "pt"));
const groupIndex = new Map(groups.map((g, i) => [g.name, i]));

const cards = [...catalog.skills]
  .sort((a, b) => a.code.localeCompare(b.code))
  .map((s) => [s.code, s.title, groupIndex.get(s.category), finishOf(s), s.id]);

// Cada tarefa da home aponta para uma jornada já existente no catálogo.
const tasks = [
  ["spreadsheets", "office", "conferir-planilhas"],
  ["bi", "power-bi", "conciliar-indicadores-power-bi"],
  ["product", "product", null],
  ["content", "presence", null],
].map(([id, journeyId, sample]) => {
  const journey = journeys.find((j) => j.id === journeyId);
  if (!journey || journey.steps.length !== 3)
    throw new Error("Jornada sem três cartas: " + journeyId);
  return {
    id,
    journey: journey.title,
    sample,
    cards: journey.steps.map((step) => {
      const s = catalog.skills.find((x) => x.id === step.id);
      if (!s) throw new Error("Carta ausente: " + step.id);
      return {
        id: s.id,
        code: s.code,
        title: s.title,
        category: s.category,
        finish: finishOf(s),
        finishLabel: DeckArt.finish(s)?.label || "Papel",
        alias: s.universe.alias,
        tagline: s.universe.tagline,
        version: s.version,
        action: step.action,
        handoff: step.handoff,
      };
    }),
  };
});

const data = { total: cards.length, groups, cards, tasks };
fs.writeFileSync(
  "dist/home-fable-data.js",
  "// Gerado por scripts/build-home-fable-data.cjs. Não edite à mão.\n" +
    "// O protótipo é só pt-BR: DeckI18n mínimo para public-preview.js e deck-art.js.\n" +
    'window.DeckI18n = window.DeckI18n || { locale: "pt", intlLocale: "pt-BR", t: (s) => s, apply() {} };\n' +
    "window.HomeFableData = " +
    JSON.stringify(data) +
    ";\n",
);
console.log(
  `home-fable-data.js: ${cards.length} cartas, ${groups.length} grupos, ${tasks.length} tarefas.`,
);
