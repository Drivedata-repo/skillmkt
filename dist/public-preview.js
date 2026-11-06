// Public, fictional previews deliberately selected for the landing page.
const PublicPreview = [
  {
    "id": "spreadsheets",
    "label": "Dominar minhas planilhas",
    "short": "Planilhas",
    "skillId": "claude-xlsx",
    "card": {
      "id": "claude-xlsx",
      "code": "DD-042",
      "title": "Planilhas estruturadas e análises em Excel",
      "category": "Documentos & operação",
      "role": "offer",
      "deliverables": [
        "Planilhas editáveis com fórmulas, tabelas e gráficos",
        "Limpeza e reorganização de dados",
        "Modelos de cálculo com premissas documentadas",
        "Conferência de fórmulas e resultados"
      ],
      "featured": true,
      "version": "1.1.0"
    },
    "example": {
      "kind": "margin",
      "input": {
        "rows": [
          {
            "product": "A",
            "revenue": 1000,
            "cost": 600
          },
          {
            "product": "B",
            "revenue": 100,
            "cost": 90
          }
        ]
      },
      "result": {
        "revenue": 1100,
        "cost": 690,
        "profit": 410,
        "margin": 0.37272727272727274,
        "formula": "=IFERROR((SUM(B2:B3)-SUM(C2:C3))/SUM(B2:B3),0)"
      },
      "checks": [
        "Lucro total é 410",
        "Margem usa os totais, não média simples",
        "Receita zero não produz erro"
      ],
      "title": "Conferir uma margem sem médias enganosas",
      "before": "A média simples das margens por produto dá 25%, mas não representa a margem consolidada.",
      "expected": "Receita: 1100; custo: 690; lucro: 410; margem consolidada: 37,27%.",
      "task": "Monte uma planilha com receita, custo, lucro e margem. Calcule a margem total por soma do lucro dividida pela soma da receita, com fórmula e tratamento de divisão por zero.",
      "limitation": "A referência confere a aritmética e fornece a fórmula. A criação e o recálculo do XLSX são verificados separadamente."
    }
  },
  {
    "id": "bi",
    "label": "Confiar nos meus indicadores",
    "short": "Indicadores",
    "skillId": "power-bi-modelagem-dax-performance",
    "card": {
      "id": "power-bi-modelagem-dax-performance",
      "code": "DD-111",
      "title": "Indicadores confiáveis e Power BI mais eficiente",
      "category": "Dados & inteligência",
      "role": "offer",
      "deliverables": [
        "Diagnóstico do modelo e medidas",
        "Revisão de regras e reconciliação com a fonte",
        "Otimização de DAX e atualização",
        "Avaliação de consumo e desempenho"
      ],
      "featured": true,
      "version": "1.1.0"
    },
    "example": {
      "kind": "reconcile",
      "input": {
        "source": [
          {
            "month": "Jan",
            "revenue": 1000
          },
          {
            "month": "Fev",
            "revenue": 1500
          }
        ],
        "report": [
          {
            "month": "Jan",
            "revenue": 1000
          },
          {
            "month": "Fev",
            "revenue": 1800
          }
        ]
      },
      "result": {
        "rows": [
          {
            "month": "Jan",
            "source": 1000,
            "report": 1000,
            "difference": 0
          },
          {
            "month": "Fev",
            "source": 1500,
            "report": 1800,
            "difference": 300
          }
        ],
        "totalDifference": 300,
        "nextStep": "Conferir filtros, duplicidades e a regra de reconhecimento em Fev."
      },
      "checks": [
        "Comparação ocorre por mês",
        "Diferença mantém o sinal",
        "Hipóteses não são apresentadas como causa confirmada"
      ],
      "title": "Reconciliar o indicador com a fonte",
      "before": "O relatório e a fonte apresentam valores diferentes, mas o mês da divergência não está isolado.",
      "expected": "Jan confere; Fev apresenta diferença de +300; diferença total de +300.",
      "task": "Compare a receita mensal da fonte com o relatório. Localize as diferenças, formule hipóteses verificáveis e proponha a próxima consulta. Não altere medidas antes de confirmar a regra.",
      "limitation": "A referência compara duas amostras. Não executa DAX nem mede desempenho do Power BI."
    }
  },
  {
    "id": "product",
    "label": "Tirar minha ideia do papel",
    "short": "Produto",
    "skillId": "prototipos-e-especificacao-funcional",
    "card": {
      "id": "prototipos-e-especificacao-funcional",
      "code": "DD-118",
      "title": "Da ideia ao protótipo e escopo validável",
      "category": "Pesquisa & estratégia",
      "role": "offer",
      "deliverables": [
        "Protótipo navegável com dados de demonstração",
        "Mapeamento de fluxos e perfis",
        "Especificação funcional e critérios de aceite",
        "Matriz de rastreabilidade entre necessidade e funcionalidade"
      ],
      "featured": true,
      "version": "1.1.0"
    },
    "example": {
      "kind": "requirements",
      "input": {
        "need": "Acompanhar solicitações de clientes",
        "roles": [
          "Solicitante",
          "Gestor"
        ],
        "states": [
          "Aberta",
          "Em análise",
          "Concluída"
        ]
      },
      "result": {
        "need": "Acompanhar solicitações de clientes",
        "flows": [
          {
            "role": "Solicitante",
            "screen": "Nova solicitação",
            "acceptance": "Ao salvar uma solicitação válida, exibir o estado Aberta"
          },
          {
            "role": "Solicitante",
            "screen": "Minhas solicitações",
            "acceptance": "Exibir estado e histórico de cada solicitação autorizada"
          },
          {
            "role": "Gestor",
            "screen": "Fila de atendimento",
            "acceptance": "Permitir transições entre Aberta, Em análise, Concluída"
          }
        ],
        "openDecisions": [
          "Confirmar regras de permissão",
          "Definir persistência e integrações"
        ]
      },
      "checks": [
        "Cada fluxo tem critério de aceite",
        "Os três estados são contemplados",
        "Protótipo é distinguido de integração operacional"
      ],
      "title": "Converter uma ideia em critérios verificáveis",
      "before": "“Quero um portal de solicitações” ainda não define perfis, estados ou critérios de aceite.",
      "expected": "Matriz com abertura, acompanhamento e mudança de status; permissões e persistência apontadas como decisões de implementação.",
      "task": "Proponha um protótipo com os perfis e estados fornecidos, usando dados fictícios. Relacione cada necessidade a uma tela e a um critério de aceite. Identifique decisões em aberto.",
      "limitation": "A referência gera uma matriz de escopo. A navegação do protótipo é construída pelo assistente no ambiente de uso."
    }
  },
  {
    "id": "content",
    "label": "Explicar melhor minha oferta",
    "short": "Conteúdo",
    "skillId": "marketing-de-conteudo-b2b",
    "card": {
      "id": "marketing-de-conteudo-b2b",
      "code": "DD-100",
      "title": "Conteúdo B2B que explica o valor da solução",
      "category": "Vendas & conteúdo",
      "role": "offer",
      "deliverables": [
        "Calendário e pautas editoriais",
        "Posts, artigos e newsletters",
        "Carrosséis e peças para redes sociais",
        "Revisão de tom de voz e mensagens"
      ],
      "featured": true,
      "version": "1.1.0"
    },
    "example": {
      "kind": "content",
      "input": {
        "audience": "Gestores de operações",
        "problem": "Consolidar planilhas",
        "capability": "Revisão de regras e organização de dados",
        "cta": "Conheça um exemplo de consolidação"
      },
      "result": {
        "draft": "Gestores de operações: consolidar planilhas faz parte da sua rotina?\n\nRevisão de regras e organização de dados é um ponto de partida para entender as inconsistências.\n\nConheça um exemplo de consolidação.",
        "status": "Rascunho para aprovação"
      },
      "checks": [
        "Público e problema aparecem no texto",
        "A capacidade corresponde à entrada",
        "Não há promessa numérica ou depoimento inventado"
      ],
      "title": "Comunicar uma oferta sem inventar resultados",
      "before": "Uma descrição técnica longa dificulta entender a aplicação prática da oferta.",
      "expected": "Texto curto que relaciona consolidação de planilhas, revisão de regras e um convite para ver o exemplo.",
      "task": "Escreva uma publicação curta para o público informado. Conecte o problema à capacidade comprovada e ao próximo passo. Não invente clientes, depoimentos ou percentuais.",
      "limitation": "A referência usa um modelo editorial determinístico. A revisão de voz da marca e a aprovação para publicação continuam necessárias."
    }
  }
];
