"use strict";
const fs = require("node:fs");
const skills = require("../data/skills.cjs");
const { getUniverse } = require("../lib/universes.cjs");
const sourceAudit = JSON.parse(
  fs.readFileSync(".local/skill-source-audit.json", "utf8"),
);
const reviews = ["001", "047", "093"].flatMap((batch) =>
  JSON.parse(fs.readFileSync(`.local/universe-${batch}-review.json`, "utf8")),
);
if (reviews.length !== 137 || new Set(reviews.map((r) => r.id)).size !== 137)
  throw new Error("All 137 individual reviews are required");
const records = skills.map((s) => {
  const review = reviews.find((r) => r.id === s.id),
    structural = sourceAudit.find((r) => r.id === s.id);
  if (!review?.sourceRead || !structural)
    throw new Error("Missing source review: " + s.id);
  for (const key of ["strength", "improvement", "evidence", "suggestedChange"])
    if (typeof review[key] !== "string" || review[key].length < 20)
      throw new Error("Incomplete review: " + s.id + "/" + key);
  if (!["high", "medium", "low"].includes(review.priority))
    throw new Error("Invalid priority: " + s.id);
  return {
    id: s.id,
    code: s.code,
    title: s.title,
    status: "reviewed-proposed",
    ...review,
    source: structural,
    validationScenario: getUniverse(s.id).scenario,
  };
});
const counts = Object.fromEntries(
  ["high", "medium", "low"].map((p) => [
    p,
    records.filter((r) => r.priority === p).length,
  ]),
);
const missing = records.filter((r) => r.source.missingLocalLinks.length);
const long = records.filter((r) => r.source.bodyWords > 5000);
const labels = { high: "Alta", medium: "Média", low: "Baixa" };
const lines = [
  "# Revisão individual das 137 skills — DriveData Deck",
  "Leitura das instruções originais, revisão editorial por skill e inspeção estática dos pacotes 1.1.0. Os arquivos instalados foram comparados com os SKILL.md distribuídos, considerando apenas a normalização de caminhos pessoais; as 137 fontes coincidem.",
  "## O que foi verificado",
  "- 137 arquivos SKILL.md lidos, um por um, para entender finalidade, procedimento e dependências.\n- 137 pacotes conferidos contra o SHA-256 da versão distribuída.\n- Frontmatter, tamanho, referências Markdown locais e menções a ferramentas de plataforma inspecionados.\n- Uma melhoria específica, evidência, proposta de alteração e cenário de validação registrados para cada skill.",
  "A revisão é estática. Cenários fictícios são propostas de teste; não comprovam execução por IA, compatibilidade universal ou resultados de negócio. As alterações abaixo estão propostas: os ZIPs 1.1.0 e as skills globais não foram sobrescritos por esta auditoria.",
  "## Prioridades",
  `| Prioridade | Skills |\n|---|---:|\n| Alta | ${counts.high} |\n| Média | ${counts.medium} |\n| Baixa | ${counts.low} |`,
  `Todos os 137 frontmatters têm nome e descrição. ${missing.length} skills fazem referência local a um CONNECTORS.md externo ao pacote. ${long.length} arquivos principais ultrapassam 5.000 palavras. Um texto longo não é, por si só, um defeito; deve-se avaliar se referências separadas melhoram a ativação e reduzem leitura desnecessária.`,
  "### Referências que não acompanham o ZIP",
  ...missing.map(
    (r) =>
      `- ${r.code} / ${r.id}: ${r.source.missingLocalLinks.map((p) => "`" + p + "`").join(", ")}. Proposta: incorporar a referência autorizada ou documentar a dependência do plugin de origem. Depois, conferir os links a partir da pasta extraída, sem depender de diretórios externos.`,
  ),
  "### Arquivos principais extensos",
  ...long.map(
    (r) =>
      `- ${r.code} / ${r.id}: ${r.source.bodyWords} palavras no corpo. Avaliar a separação de detalhes e exemplos, mantendo fluxo, critérios de ativação e links no SKILL.md.`,
  ),
  "## Sequência sugerida para alterar as próprias skills",
  "1. Resolver referências ausentes e conflitos de ferramentas antes de ampliar a oferta de execução.\n2. Corrigir instruções que prometem atomicidade, paralelismo ou disponibilidade de ferramentas sem verificar o runtime.\n3. Melhorar os gatilhos e limites entre variantes, mantendo os identificadores estáveis.\n4. Aplicar as propostas abaixo em cópias versionadas; validar links e cenários positivos e negativos.\n5. Publicar uma nova versão somente após a conferência adequada ao ambiente. Preservar autoria, licenças, hashes e a versão anterior.",
  "## Fichas individuais",
];
for (const r of records)
  lines.push(
    `### ${r.code} — ${r.title}`,
    `Identificador: \`${r.id}\` · Prioridade: **${labels[r.priority]}** · Estado: melhoria proposta.`,
    `**O que já funciona nas instruções:** ${r.strength}`,
    `**Ponto de melhoria:** ${r.improvement}`,
    `**Evidência na fonte:** ${r.evidence}`,
    `**Alteração sugerida:** ${r.suggestedChange}`,
    `**Cenário candidato de validação:** ${r.validationScenario.title}. ${r.validationScenario.context}`,
    `**Entrega a conferir:** ${r.validationScenario.output}`,
    `**Critério de conferência:** ${r.validationScenario.check}`,
    `**Rastreabilidade:** SKILL.md com ${r.source.sourceLines} linhas e ${r.source.bodyWords} palavras no corpo; ${r.source.markdownLinksChecked} links Markdown locais inspecionados. SHA-256 da fonte: \`${r.source.sourceSha256}\`.`,
    ...(r.source.missingLocalLinks.length
      ? [
          `**Pendência estrutural:** referência ausente no pacote: ${r.source.missingLocalLinks.map((p) => "`" + p + "`").join(", ")}.`,
        ]
      : []),
  );
fs.mkdirSync("reviews", { recursive: true });
fs.writeFileSync(
  "reviews/skill-audit.json",
  JSON.stringify(
    { edition: "1.1.0", scope: "static-source-review", counts, records },
    null,
    2,
  ) + "\n",
);
fs.writeFileSync("reviews/REVISAO-137-SKILLS.md", lines.join("\n\n") + "\n");
console.log(
  JSON.stringify({
    reviewed: records.length,
    priorities: counts,
    missingReferences: missing.length,
  }),
);
