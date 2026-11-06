// Explicitly allowlisted public descriptions; original instructions and local paths never ship.
const fs = require("node:fs");
const input = process.argv[2];
if (!input) throw new Error("Provide the reviewed inventory file");
const { skills } = JSON.parse(fs.readFileSync(input, "utf8"));
const groups = {
  "Dados e Business Intelligence": "Dados & inteligência",
  "Dados e inteligência de negócio": "Dados & inteligência",
  "Assistentes e automação": "Automação & IA",
  "Automação de processos": "Automação & IA",
  "Automação e produtividade": "Automação & IA",
  "IA e conhecimento": "Automação & IA",
  "Inteligência artificial": "Automação & IA",
  "Integrações e conectores": "Sistemas & integrações",
  "Integrações e ERP": "Sistemas & integrações",
  "Financeiro e integrações": "Sistemas & integrações",
  "Sistemas e plataformas": "Sistemas & integrações",
  "Design e produto digital": "Design & experiência",
  "Experiência e presença digital": "Design & experiência",
  "Vendas e inteligência comercial": "Vendas & conteúdo",
  "Vendas e marketing": "Vendas & conteúdo",
  "Comunicação e conteúdo": "Vendas & conteúdo",
  "Documentos e produtividade": "Documentos & operação",
  "Processos e documentação": "Documentos & operação",
  "Contratos e governança": "Documentos & operação",
  "Engenharia de software": "Qualidade & engenharia",
  "Engenharia e qualidade": "Qualidade & engenharia",
  "Qualidade e segurança": "Qualidade & engenharia",
  "Estratégia e conhecimento": "Pesquisa & estratégia",
  "Estratégia e entrega": "Pesquisa & estratégia",
  "Pesquisa e análise especializada": "Pesquisa & estratégia",
  "Hardware e experimentação": "Inovação & experimentação",
  "Operação interna": "Apoio interno",
  "Componentes internos": "Apoio interno",
  "Referências internas restritas": "Apoio interno",
};
const cards = [...skills]
  .sort((a, b) => a.id.localeCompare(b.id, "en"))
  .map((s, i) => ({
    id: s.id,
    code: "DD-" + String(i + 1).padStart(3, "0"),
    title: s.title,
    category: groups[s.category] || s.category,
    audience: s.audience,
    role: s.role,
    pain: s.pain,
    deliverables: s.deliverables,
    dependencies: s.dependencies,
    offers: s.commercialOffers.map((o) => o.id),
    variantOf: s.duplicateOf || null,
  }));
const restricted = cards.find((s) => s.id === "claude-maia");
Object.assign(restricted, {
  title: "Referência de projeto especializado",
  pain: "Capacidade interna vinculada a um contexto específico, indisponível como oferta pública.",
  deliverables: ["Referência interna com conteúdo reservado"],
  dependencies: ["Avaliação interna de autorização e aplicabilidade"],
  offers: [],
});
fs.writeFileSync(
  "data/skills.cjs",
  "const SKILLS = " +
    JSON.stringify(cards, null, 2) +
    ";\nif(typeof module!=='undefined')module.exports=SKILLS;\n",
);
console.log(
  cards.length +
    " public skill cards exported. Codes are committed and must remain stable.",
);
