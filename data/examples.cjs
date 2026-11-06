// Fictional, reproducible teaching fixtures. These are reference results, not AI executions.
module.exports = [
  {
    skillId: "automacao-documentos-office",
    title: "Consolidar pedidos sem contar duas vezes",
    kind: "orders",
    input: {
      orders: [
        { id: "P01", client: "Aurora", value: 1200 },
        { id: "P02", client: "Norte", value: 800 },
        { id: "P01", client: "Aurora", value: 1200 },
        { id: "P03", client: "Aurora", value: 500 },
      ],
    },
    before: "Dois arquivos foram reunidos e o pedido P01 apareceu duas vezes.",
    task: "Consolide os pedidos por ID. Liste duplicatas, totalize por cliente e preserve a origem. Não elimine registros conflitantes sem me consultar.",
    expected:
      "3 pedidos únicos; Aurora: 1700; Norte: 800; total: 2500; uma duplicata identificada.",
    checks: [
      "P01 é contado uma única vez",
      "O total confere com os pedidos únicos",
      "Duplicatas continuam rastreáveis",
    ],
    limitation:
      "A referência usa JSON e gera CSV. Criar Word, Excel ou PDF exige as ferramentas da skill.",
  },
  {
    skillId: "claude-acta-drivedata",
    title: "Transformar decisões em compromissos claros",
    kind: "minutes",
    input: {
      meeting: "Revisão do protótipo",
      date: "2026-11-06",
      decisions: [
        { action: "Revisar o cadastro", owner: "Ana", due: "2026-11-10" },
        { action: "Validar o relatório", owner: "Bruno", due: null },
      ],
    },
    before:
      "As ações estão dispersas nas anotações; uma delas não tem prazo definido.",
    task: "Prepare uma ata em português com decisões, responsáveis e prazos. Marque informação ausente como “a confirmar”. Não envie e-mails.",
    expected:
      "Duas ações organizadas; a segunda com prazo “A confirmar”, sem inventar uma data.",
    checks: [
      "As duas decisões estão presentes",
      "Responsáveis mantêm os nomes da entrada",
      "Prazo ausente é explicitado",
    ],
    limitation:
      "A referência começa com decisões estruturadas. Transcrever áudio e gerar Word/PDF são etapas separadas; o original precisa de adaptação de idioma.",
  },
  {
    skillId: "claude-docx",
    title: "Organizar um documento de proposta",
    kind: "document",
    input: {
      title: "Proposta de painel operacional",
      scope: ["Mapear indicadores", "Construir uma página de demonstração"],
      exclusions: ["Integração com ERP"],
      acceptance:
        "Indicadores conferidos com uma amostra fornecida pelo cliente",
    },
    before: "Escopo, exclusões e aceite estão misturados em um texto informal.",
    task: "Organize este conteúdo como proposta com objetivo, escopo, exclusões e critérios de aceite. Preserve os fatos; não invente valores ou prazos. Gere Word se as ferramentas estiverem disponíveis.",
    expected:
      "Documento estruturado em quatro seções, preservando a exclusão de integração com ERP.",
    checks: [
      "Escopo conserva os dois itens",
      "Exclusões são visíveis",
      "Nenhum valor ou prazo é inventado",
    ],
    limitation:
      "A referência é Markdown. A geração e a renderização de DOCX precisam ser verificadas no seu ambiente.",
  },
  {
    skillId: "claude-power-query-best-practices",
    title: "Identificar inconsistências antes da atualização",
    kind: "cleanup",
    input: {
      rows: [
        { product: "  alfa ", amount: "120,50" },
        { product: "ALFA", amount: "79,50" },
        { product: "beta ", amount: "inválido" },
      ],
    },
    before:
      "Espaços, letras diferentes e um valor inválido dificultam a consolidação.",
    task: "Revise a preparação destes dados: normalize nomes, use a localidade pt-BR nos valores e separe erros. Mostre o código M proposto e valide a contagem; não prometa melhora sem medição.",
    expected:
      "ALFA totaliza 200,00; BETA permanece na lista de erros, sem ser convertido em zero.",
    checks: [
      "Nomes normalizados",
      "Valor inválido é separado",
      "Nenhum registro desaparece sem justificativa",
    ],
    limitation:
      "A referência reproduz a regra em JavaScript. Query folding e desempenho exigem execução na fonte e no Power Query.",
  },
  {
    skillId: "claude-pptx",
    title: "Dar uma sequência a uma apresentação",
    kind: "slides",
    input: {
      audience: "Equipe de operações",
      objective: "Decidir o próximo piloto",
      facts: [
        "O fechamento usa três planilhas",
        "Existe duplicidade de pedidos",
        "O piloto vai conferir 20 pedidos",
      ],
    },
    before: "Os fatos aparecem sem uma sequência para apoiar a decisão.",
    task: "Crie uma apresentação de três slides: situação, problema e próximo passo. Use apenas os fatos fornecidos e inclua notas. Não invente economia ou resultados.",
    expected:
      "Roteiro com três slides e notas, terminando com a conferência de 20 pedidos.",
    checks: [
      "Cada fato aparece em um slide",
      "O piloto tem escopo claro",
      "Não há métricas de retorno inventadas",
    ],
    limitation:
      "A referência é um roteiro textual. O arquivo PPTX e sua revisão visual dependem das ferramentas disponíveis.",
  },
  {
    skillId: "claude-xlsx",
    title: "Conferir uma margem sem médias enganosas",
    kind: "margin",
    input: {
      rows: [
        { product: "A", revenue: 1000, cost: 600 },
        { product: "B", revenue: 100, cost: 90 },
      ],
    },
    before:
      "A média simples das margens por produto dá 25%, mas não representa a margem consolidada.",
    task: "Monte uma planilha com receita, custo, lucro e margem. Calcule a margem total por soma do lucro dividida pela soma da receita, com fórmula e tratamento de divisão por zero.",
    expected:
      "Receita: 1100; custo: 690; lucro: 410; margem consolidada: 37,27%.",
    checks: [
      "Lucro total é 410",
      "Margem usa os totais, não média simples",
      "Receita zero não produz erro",
    ],
    limitation:
      "A referência confere a aritmética e fornece a fórmula. A criação e o recálculo do XLSX são verificados separadamente.",
  },
  {
    skillId: "power-bi-modelagem-dax-performance",
    title: "Reconciliar o indicador com a fonte",
    kind: "reconcile",
    input: {
      source: [
        { month: "Jan", revenue: 1000 },
        { month: "Fev", revenue: 1500 },
      ],
      report: [
        { month: "Jan", revenue: 1000 },
        { month: "Fev", revenue: 1800 },
      ],
    },
    before:
      "O relatório e a fonte apresentam valores diferentes, mas o mês da divergência não está isolado.",
    task: "Compare a receita mensal da fonte com o relatório. Localize as diferenças, formule hipóteses verificáveis e proponha a próxima consulta. Não altere medidas antes de confirmar a regra.",
    expected:
      "Jan confere; Fev apresenta diferença de +300; diferença total de +300.",
    checks: [
      "Comparação ocorre por mês",
      "Diferença mantém o sinal",
      "Hipóteses não são apresentadas como causa confirmada",
    ],
    limitation:
      "A referência compara duas amostras. Não executa DAX nem mede desempenho do Power BI.",
  },
  {
    skillId: "prototipos-e-especificacao-funcional",
    title: "Converter uma ideia em critérios verificáveis",
    kind: "requirements",
    input: {
      need: "Acompanhar solicitações de clientes",
      roles: ["Solicitante", "Gestor"],
      states: ["Aberta", "Em análise", "Concluída"],
    },
    before:
      "“Quero um portal de solicitações” ainda não define perfis, estados ou critérios de aceite.",
    task: "Proponha um protótipo com os perfis e estados fornecidos, usando dados fictícios. Relacione cada necessidade a uma tela e a um critério de aceite. Identifique decisões em aberto.",
    expected:
      "Matriz com abertura, acompanhamento e mudança de status; permissões e persistência apontadas como decisões de implementação.",
    checks: [
      "Cada fluxo tem critério de aceite",
      "Os três estados são contemplados",
      "Protótipo é distinguido de integração operacional",
    ],
    limitation:
      "A referência gera uma matriz de escopo. A navegação do protótipo é construída pelo assistente no ambiente de uso.",
  },
  {
    skillId: "marketing-de-conteudo-b2b",
    title: "Comunicar uma oferta sem inventar resultados",
    kind: "content",
    input: {
      audience: "Gestores de operações",
      problem: "Consolidar planilhas",
      capability: "Revisão de regras e organização de dados",
      cta: "Conheça um exemplo de consolidação",
    },
    before:
      "Uma descrição técnica longa dificulta entender a aplicação prática da oferta.",
    task: "Escreva uma publicação curta para o público informado. Conecte o problema à capacidade comprovada e ao próximo passo. Não invente clientes, depoimentos ou percentuais.",
    expected:
      "Texto curto que relaciona consolidação de planilhas, revisão de regras e um convite para ver o exemplo.",
    checks: [
      "Público e problema aparecem no texto",
      "A capacidade corresponde à entrada",
      "Não há promessa numérica ou depoimento inventado",
    ],
    limitation:
      "A referência usa um modelo editorial determinístico. A revisão de voz da marca e a aprovação para publicação continuam necessárias.",
  },
  {
    skillId: "sites-institucionais-e-seo",
    title: "Revisar a estrutura básica de uma página",
    kind: "seo",
    input: {
      title: "Serviços de dados",
      description: "",
      headings: ["Soluções", "Soluções"],
      images: [{ file: "equipe.png", alt: "" }],
      contactLink: "https://example.invalid/contato",
    },
    before:
      "A página tem título, mas falta descrição, há dois títulos principais e uma imagem sem texto alternativo.",
    task: "Faça uma revisão de conteúdo e estrutura da página. Liste evidências, prioridade e correção proposta para título, descrição, headings e imagens. Não prometa posição no Google.",
    expected:
      "Três pendências verificáveis: descrição ausente, dois H1 e imagem sem alternativa textual.",
    checks: [
      "São apontadas as três pendências da amostra",
      "Cada problema tem uma ação sugerida",
      "Não há garantia de posicionamento",
    ],
    limitation:
      "A referência analisa metadados fictícios. Indexação, desempenho e conversões exigem testes no site real.",
  },
];
