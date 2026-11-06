const fs = require("node:fs");
const { skills } = require("../lib/catalog.cjs");
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
const result = missions.map((m) => {
  const s = skills.find((s) => s.id === m.skillId);
  return {
    ...m,
    card: {
      id: s.id,
      code: s.code,
      title: s.title,
      category: s.category,
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
fs.writeFileSync(
  "dist/public-preview.js",
  "// Public, fictional previews deliberately selected for the landing page.\nconst PublicPreview = " +
    JSON.stringify(result, null, 2) +
    ";\n",
);
console.log("4 public mission previews prepared");
