const base = require("../data/skills.cjs");
const examples = require("../data/examples.cjs");
const { run } = require("./example-reference.cjs");
const releases = require("../data/releases.cjs");
const journeys = require("../data/journeys.cjs");
const { getUniverse } = require("./universes.cjs");
const { getSkillPricing } = require("./pricing.cjs");
const { getCardGame } = require("./card-game.cjs");
const { getCardIdentity } = require("./card-identity.cjs");
const skills = base.map((s) => {
  const example = examples.find((x) => x.skillId === s.id),
    release = releases[s.id];
  return {
    ...s,
    universe: getUniverse(s.id),
    pricing: getSkillPricing(s.id),
    game: getCardGame(s),
    identity: getCardIdentity(s, release),
    featured: !!example,
    version: release.version,
    release,
    setup:
      s.role === "platform-specific"
        ? "Conexão específica"
        : s.audience === "technical"
          ? "Ambiente técnico"
          : "Assistente + arquivos",
    compatibility: {
      format: "SKILL.md revisado",
      execution: "Execução da skill ainda não homologada neste ambiente",
      platformSpecific: s.role === "platform-specific",
      tools: release.tools,
    },
    firstPrompt: `Use a skill ${s.id} para me ajudar com esta tarefa: [descreva sua tarefa].\n\nResultado desejado: ${s.deliverables[0]}.\nMateriais disponíveis: [liste os arquivos e as fontes].\nAntes de começar, confirme as ferramentas necessárias e as informações que faltam. Não invente dados nem execute ações externas sem minha autorização. Ao concluir, mostre o resultado e como posso conferi-lo.`,
    acceptance: [
      `A entrega contempla: ${s.deliverables[0]}.`,
      "Dados e afirmações têm origem identificada.",
      "Pendências, dependências e limitações estão explícitas.",
    ],
    example: example
      ? {
          ...example,
          result: run(example.kind, example.input),
          verification:
            "Referência determinística conferida; não é uma execução da skill por IA.",
        }
      : null,
    changelog: [
      {
        version: release.version,
        date: release.date,
        changes: [
          ...(['1.2.0','1.2.1'].includes(release.version) ? ['Instruções específicas aprimoradas e cenários de conferência incluídos','Versão anterior preservada com rastreabilidade das alterações'] : []),
          "Manifesto, integridade e dependências documentados",
          "Guia de primeiro uso e checklist de conferência",
          ...(example ? ["Exemplo fictício com resultado reproduzível"] : []),
          ...(release.normalizedFiles
            ? ["Referências locais em documentação tornadas genéricas"]
            : []),
        ],
      },
    ],
  };
});
module.exports = { skills, journeys };
