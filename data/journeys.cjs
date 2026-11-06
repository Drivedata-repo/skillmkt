module.exports = [
  {
    id: "power-bi",
    title: "Revisar meu Power BI",
    audience: "both",
    description: "Da divergência à documentação, com evidências a cada etapa.",
    steps: [
      {
        id: "power-bi-modelagem-dax-performance",
        action: "Localize a divergência",
        handoff:
          "Tabela de diferenças, regra confirmada e hipóteses verificáveis.",
      },
      {
        id: "claude-power-bi-dax-optimization",
        action: "Revise as medidas",
        handoff: "Medidas revisadas e comparação de resultado e execução.",
      },
      {
        id: "claude-bi-documentation",
        action: "Documente o que mudou",
        handoff: "Dicionário de métricas e decisões do modelo.",
      },
    ],
  },
  {
    id: "office",
    title: "Organizar minha operação",
    audience: "business",
    description:
      "Transforme dados dispersos em números conferidos e comunicação clara.",
    steps: [
      {
        id: "claude-xlsx",
        action: "Organize a base",
        handoff: "Planilha conferida, com fórmulas e regras documentadas.",
      },
      {
        id: "claude-docx",
        action: "Estruture o documento",
        handoff: "Documento com fatos, decisões e pendências.",
      },
      {
        id: "claude-pptx",
        action: "Apresente a decisão",
        handoff: "Apresentação editável com fontes e próximo passo.",
      },
    ],
  },
  {
    id: "product",
    title: "Tirar uma ideia do papel",
    audience: "both",
    description: "Valide a jornada antes de avançar para a implementação.",
    steps: [
      {
        id: "prototipos-e-especificacao-funcional",
        action: "Defina o que validar",
        handoff: "Fluxos, protótipo e critérios de aceite.",
      },
      {
        id: "design-de-interface-autoral",
        action: "Defina a experiência",
        handoff: "Hierarquia visual e padrões de interação.",
      },
      {
        id: "fullstack-nextjs-vercel",
        action: "Implemente o escopo aprovado",
        handoff:
          "Aplicação testada com integrações explicitamente autorizadas.",
      },
    ],
  },
  {
    id: "presence",
    title: "Explicar minha oferta",
    audience: "business",
    description: "Conecte mensagem, presença digital e conteúdo.",
    steps: [
      {
        id: "marketing-de-conteudo-b2b",
        action: "Organize a mensagem",
        handoff: "Público, fatos aprovados e pauta editorial.",
      },
      {
        id: "sites-institucionais-e-seo",
        action: "Construa a página",
        handoff: "Página com oferta, evidências e chamada para ação.",
      },
      {
        id: "claude-pptx",
        action: "Prepare a apresentação",
        handoff: "Roteiro e apresentação comercial para revisão.",
      },
    ],
  },
  {
    id: "engineering",
    title: "Entregar código com confiança",
    audience: "technical",
    description:
      "Revisão, segurança e lançamento com verificações rastreáveis.",
    steps: [
      {
        id: "code-review-and-quality",
        action: "Revise a mudança",
        handoff: "Problemas priorizados, testes e correções.",
      },
      {
        id: "security-and-hardening",
        action: "Verifique os acessos",
        handoff: "Evidências de proteção e riscos restantes.",
      },
      {
        id: "shipping-and-launch",
        action: "Prepare a publicação",
        handoff: "Checklist de release e plano de recuperação.",
      },
    ],
  },
];
