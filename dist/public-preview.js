// Public, fictional previews deliberately selected for the landing page.
const PublicPreview = ({
  "pt": [
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
        "categoryKey": "Documentos & operação",
        "role": "offer",
        "deliverables": [
          "Planilhas editáveis com fórmulas, tabelas e gráficos",
          "Limpeza e reorganização de dados",
          "Modelos de cálculo com premissas documentadas",
          "Conferência de fórmulas e resultados"
        ],
        "featured": true,
        "version": "1.2.0",
        "universe": {
          "alias": "Oficina de Células",
          "tagline": "Uma planilha útil mostra a conta e permite conferir o resultado."
        },
        "pricing": {
          "currency": "USD",
          "priceCents": 4200,
          "demoPriceCents": 0,
          "purchasable": false,
          "status": "proposed-free-demo",
          "revision": "2026-11-07",
          "assessedVersion": "1.2.0",
          "label": "Preço proposto",
          "demoLabel": "Grátis na demo",
          "notice": "Valor planejado em dólares americanos. Nenhuma compra ou cobrança está ativa.",
          "basis": "Avaliação documental do escopo; não é uma nota de qualidade nem comprovação de ganho.",
          "complexityLabel": "Especializada",
          "dimensions": [
            {
              "key": "depth",
              "label": "Profundidade técnica",
              "score": 4,
              "max": 5,
              "weight": 35
            },
            {
              "key": "scope",
              "label": "Abrangência da entrega",
              "score": 4,
              "max": 5,
              "weight": 30
            },
            {
              "key": "verification",
              "label": "Esforço de conferência",
              "score": 5,
              "max": 5,
              "weight": 20
            },
            {
              "key": "reuse",
              "label": "Reutilização",
              "score": 5,
              "max": 5,
              "weight": 15
            }
          ],
          "reason": "Entrega de referência: Planilhas editáveis com fórmulas, tabelas e gráficos.",
          "variantNote": null
        },
        "game": {
          "edition": "arcana-1",
          "fictional": true,
          "level": 3,
          "attack": 1960,
          "defense": 2620,
          "school": "Escriba",
          "flavor": "Preserva os detalhes que sustentam toda a missão.",
          "notice": "Níveis, ATQ e DEF são atributos fictícios de coleção. Não medem qualidade, preço ou resultado da skill."
        },
        "identity": {
          "schema": "drivedata.card-identity.v1",
          "namespace": "drivedata:deck:card:v1",
          "registryCode": "DD-042",
          "id": "ddk_bad9bc04dbc74b7e6bd47cce0845c7413b1a426c969b8f86b4775b7a8aafeaff",
          "digest": "bad9bc04dbc74b7e6bd47cce0845c7413b1a426c969b8f86b4775b7a8aafeaff",
          "serial": "DDK-042-BAD9-BC04-DBC7",
          "edition": {
            "id": "dde_3635de4b15a016f3807cc8232f62a5e6663ddc10a03ef06f64c7e99e121a7209",
            "digest": "3635de4b15a016f3807cc8232f62a5e6663ddc10a03ef06f64c7e99e121a7209",
            "version": "1.2.0",
            "packageSha256": "55c4e5e2db66da4dced132423ce65645eac18e7bb9efbe6d246963fcc8ece987"
          },
          "blockchain": {
            "status": "not-minted",
            "network": null,
            "contract": null,
            "tokenId": null
          }
        }
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
        "categoryKey": "Dados & inteligência",
        "role": "offer",
        "deliverables": [
          "Diagnóstico do modelo e medidas",
          "Revisão de regras e reconciliação com a fonte",
          "Otimização de DAX e atualização",
          "Avaliação de consumo e desempenho"
        ],
        "featured": true,
        "version": "1.2.0",
        "universe": {
          "alias": "Cartógrafo de Métricas",
          "tagline": "Encontre a regra por trás do número antes de otimizar a medida."
        },
        "pricing": {
          "currency": "USD",
          "priceCents": 4200,
          "demoPriceCents": 0,
          "purchasable": false,
          "status": "proposed-free-demo",
          "revision": "2026-11-07",
          "assessedVersion": "1.2.0",
          "label": "Preço proposto",
          "demoLabel": "Grátis na demo",
          "notice": "Valor planejado em dólares americanos. Nenhuma compra ou cobrança está ativa.",
          "basis": "Avaliação documental do escopo; não é uma nota de qualidade nem comprovação de ganho.",
          "complexityLabel": "Especializada",
          "dimensions": [
            {
              "key": "depth",
              "label": "Profundidade técnica",
              "score": 5,
              "max": 5,
              "weight": 35
            },
            {
              "key": "scope",
              "label": "Abrangência da entrega",
              "score": 4,
              "max": 5,
              "weight": 30
            },
            {
              "key": "verification",
              "label": "Esforço de conferência",
              "score": 5,
              "max": 5,
              "weight": 20
            },
            {
              "key": "reuse",
              "label": "Reutilização",
              "score": 5,
              "max": 5,
              "weight": 15
            }
          ],
          "reason": "Entrega de referência: Diagnóstico do modelo e medidas.",
          "variantNote": null
        },
        "game": {
          "edition": "arcana-1",
          "fictional": true,
          "level": 6,
          "attack": 2370,
          "defense": 1640,
          "school": "Oráculo",
          "flavor": "Decifra o que está escondido entre os números.",
          "notice": "Níveis, ATQ e DEF são atributos fictícios de coleção. Não medem qualidade, preço ou resultado da skill."
        },
        "identity": {
          "schema": "drivedata.card-identity.v1",
          "namespace": "drivedata:deck:card:v1",
          "registryCode": "DD-111",
          "id": "ddk_ea99b810fac1c751bb0f0f176e0c7bef4fd39b525c468573620488c5a001bcda",
          "digest": "ea99b810fac1c751bb0f0f176e0c7bef4fd39b525c468573620488c5a001bcda",
          "serial": "DDK-111-EA99-B810-FAC1",
          "edition": {
            "id": "dde_c26d6119f9667bb4cecefcd6e10435e973e79cf43b2c8fdf71870811cd0c5a7f",
            "digest": "c26d6119f9667bb4cecefcd6e10435e973e79cf43b2c8fdf71870811cd0c5a7f",
            "version": "1.2.0",
            "packageSha256": "fb69ef1ba64619c9baa7da68f0d62cbe7ea47a1ab81c9beaf3f4766db0a9277e"
          },
          "blockchain": {
            "status": "not-minted",
            "network": null,
            "contract": null,
            "tokenId": null
          }
        }
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
        "categoryKey": "Pesquisa & estratégia",
        "role": "offer",
        "deliverables": [
          "Protótipo navegável com dados de demonstração",
          "Mapeamento de fluxos e perfis",
          "Especificação funcional e critérios de aceite",
          "Matriz de rastreabilidade entre necessidade e funcionalidade"
        ],
        "featured": true,
        "version": "1.2.0",
        "universe": {
          "alias": "Laboratório do Escopo",
          "tagline": "Veja o fluxo funcionar em uma demonstração antes de assumir o escopo."
        },
        "pricing": {
          "currency": "USD",
          "priceCents": 3700,
          "demoPriceCents": 0,
          "purchasable": false,
          "status": "proposed-free-demo",
          "revision": "2026-11-07",
          "assessedVersion": "1.2.0",
          "label": "Preço proposto",
          "demoLabel": "Grátis na demo",
          "notice": "Valor planejado em dólares americanos. Nenhuma compra ou cobrança está ativa.",
          "basis": "Avaliação documental do escopo; não é uma nota de qualidade nem comprovação de ganho.",
          "complexityLabel": "Avançada",
          "dimensions": [
            {
              "key": "depth",
              "label": "Profundidade técnica",
              "score": 4,
              "max": 5,
              "weight": 35
            },
            {
              "key": "scope",
              "label": "Abrangência da entrega",
              "score": 4,
              "max": 5,
              "weight": 30
            },
            {
              "key": "verification",
              "label": "Esforço de conferência",
              "score": 4,
              "max": 5,
              "weight": 20
            },
            {
              "key": "reuse",
              "label": "Reutilização",
              "score": 5,
              "max": 5,
              "weight": 15
            }
          ],
          "reason": "Entrega de referência: Protótipo navegável com dados de demonstração.",
          "variantNote": null
        },
        "game": {
          "edition": "arcana-1",
          "fictional": true,
          "level": 7,
          "attack": 2740,
          "defense": 1580,
          "school": "Explorador",
          "flavor": "Segue pistas, cruza fronteiras e volta com novas perguntas.",
          "notice": "Níveis, ATQ e DEF são atributos fictícios de coleção. Não medem qualidade, preço ou resultado da skill."
        },
        "identity": {
          "schema": "drivedata.card-identity.v1",
          "namespace": "drivedata:deck:card:v1",
          "registryCode": "DD-118",
          "id": "ddk_bc7467d693430f414e6a33ebab2773e8ab320c7c09d0f0a36252818257959df1",
          "digest": "bc7467d693430f414e6a33ebab2773e8ab320c7c09d0f0a36252818257959df1",
          "serial": "DDK-118-BC74-67D6-9343",
          "edition": {
            "id": "dde_77746d88b71d217521d30824e8deb099eca0b3b8dc1561f6f00b502174682021",
            "digest": "77746d88b71d217521d30824e8deb099eca0b3b8dc1561f6f00b502174682021",
            "version": "1.2.0",
            "packageSha256": "e67c6fffa8304a5af58053035d89ab3b65eff0073a08ae4c6d8385e15a085448"
          },
          "blockchain": {
            "status": "not-minted",
            "network": null,
            "contract": null,
            "tokenId": null
          }
        }
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
        "categoryKey": "Vendas & conteúdo",
        "role": "offer",
        "deliverables": [
          "Calendário e pautas editoriais",
          "Posts, artigos e newsletters",
          "Carrosséis e peças para redes sociais",
          "Revisão de tom de voz e mensagens"
        ],
        "featured": true,
        "version": "1.2.0",
        "universe": {
          "alias": "Tradutor de Valor",
          "tagline": "Transforme capacidade técnica em uma mensagem que alguém entende."
        },
        "pricing": {
          "currency": "USD",
          "priceCents": 3200,
          "demoPriceCents": 0,
          "purchasable": false,
          "status": "proposed-free-demo",
          "revision": "2026-11-07",
          "assessedVersion": "1.2.0",
          "label": "Preço proposto",
          "demoLabel": "Grátis na demo",
          "notice": "Valor planejado em dólares americanos. Nenhuma compra ou cobrança está ativa.",
          "basis": "Avaliação documental do escopo; não é uma nota de qualidade nem comprovação de ganho.",
          "complexityLabel": "Avançada",
          "dimensions": [
            {
              "key": "depth",
              "label": "Profundidade técnica",
              "score": 3,
              "max": 5,
              "weight": 35
            },
            {
              "key": "scope",
              "label": "Abrangência da entrega",
              "score": 4,
              "max": 5,
              "weight": 30
            },
            {
              "key": "verification",
              "label": "Esforço de conferência",
              "score": 3,
              "max": 5,
              "weight": 20
            },
            {
              "key": "reuse",
              "label": "Reutilização",
              "score": 5,
              "max": 5,
              "weight": 15
            }
          ],
          "reason": "Entrega de referência: Calendário e pautas editoriais.",
          "variantNote": null
        },
        "game": {
          "edition": "arcana-1",
          "fictional": true,
          "level": 9,
          "attack": 3030,
          "defense": 1560,
          "school": "Embaixador",
          "flavor": "Transforma uma ideia em uma mensagem que encontra seu destino.",
          "notice": "Níveis, ATQ e DEF são atributos fictícios de coleção. Não medem qualidade, preço ou resultado da skill."
        },
        "identity": {
          "schema": "drivedata.card-identity.v1",
          "namespace": "drivedata:deck:card:v1",
          "registryCode": "DD-100",
          "id": "ddk_e061be3e63b7aa02cddbd1b20032db3426a7ce2eeff82edf46a49c71333b5f03",
          "digest": "e061be3e63b7aa02cddbd1b20032db3426a7ce2eeff82edf46a49c71333b5f03",
          "serial": "DDK-100-E061-BE3E-63B7",
          "edition": {
            "id": "dde_19227b7259dfe3d694ed2b7b9623107ba33c44724167df62246ab29a81ebceb4",
            "digest": "19227b7259dfe3d694ed2b7b9623107ba33c44724167df62246ab29a81ebceb4",
            "version": "1.2.0",
            "packageSha256": "c39a9d67fc9dd3100659c2965bcc51026f0fe013616a4989c1eeebd248233649"
          },
          "blockchain": {
            "status": "not-minted",
            "network": null,
            "contract": null,
            "tokenId": null
          }
        }
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
  ],
  "en": [
    {
      "id": "spreadsheets",
      "label": "Master my spreadsheets",
      "short": "Spreadsheets",
      "skillId": "claude-xlsx",
      "card": {
        "id": "claude-xlsx",
        "code": "DD-042",
        "title": "Structured spreadsheets and Excel analysis",
        "category": "Documents & operations",
        "categoryKey": "Documentos & operação",
        "role": "offer",
        "deliverables": [
          "Editable spreadsheets with formulas, tables and charts",
          "Data cleanup and reorganization",
          "Calculation models with documented assumptions",
          "Formula and result checks"
        ],
        "featured": true,
        "version": "1.2.0",
        "universe": {
          "alias": "Cell Workshop",
          "tagline": "A useful spreadsheet shows the calculation and lets you check the result."
        },
        "pricing": {
          "currency": "USD",
          "priceCents": 4200,
          "demoPriceCents": 0,
          "purchasable": false,
          "status": "proposed-free-demo",
          "revision": "2026-11-07",
          "assessedVersion": "1.2.0",
          "label": "Proposed price",
          "demoLabel": "Free in the demo",
          "notice": "Planned value in US dollars. No purchase or billing is active.",
          "basis": "Documentary assessment of scope; not a quality rating or proof of improvement.",
          "complexityLabel": "Specialist",
          "dimensions": [
            {
              "key": "depth",
              "label": "Technical depth",
              "score": 4,
              "max": 5,
              "weight": 35
            },
            {
              "key": "scope",
              "label": "Deliverable scope",
              "score": 4,
              "max": 5,
              "weight": 30
            },
            {
              "key": "verification",
              "label": "Verification effort",
              "score": 5,
              "max": 5,
              "weight": 20
            },
            {
              "key": "reuse",
              "label": "Reuse",
              "score": 5,
              "max": 5,
              "weight": 15
            }
          ],
          "reason": "Reference deliverable: Editable spreadsheets with formulas, tables and charts.",
          "variantNote": null
        },
        "game": {
          "edition": "arcana-1",
          "fictional": true,
          "level": 3,
          "attack": 1960,
          "defense": 2620,
          "school": "Scribe",
          "flavor": "Preserves the details that hold the mission together.",
          "notice": "Levels, ATK and DEF are fictional collection attributes. They do not measure skill quality, price or results."
        },
        "identity": {
          "schema": "drivedata.card-identity.v1",
          "namespace": "drivedata:deck:card:v1",
          "registryCode": "DD-042",
          "id": "ddk_bad9bc04dbc74b7e6bd47cce0845c7413b1a426c969b8f86b4775b7a8aafeaff",
          "digest": "bad9bc04dbc74b7e6bd47cce0845c7413b1a426c969b8f86b4775b7a8aafeaff",
          "serial": "DDK-042-BAD9-BC04-DBC7",
          "edition": {
            "id": "dde_3635de4b15a016f3807cc8232f62a5e6663ddc10a03ef06f64c7e99e121a7209",
            "digest": "3635de4b15a016f3807cc8232f62a5e6663ddc10a03ef06f64c7e99e121a7209",
            "version": "1.2.0",
            "packageSha256": "55c4e5e2db66da4dced132423ce65645eac18e7bb9efbe6d246963fcc8ece987"
          },
          "blockchain": {
            "status": "not-minted",
            "network": null,
            "contract": null,
            "tokenId": null
          }
        }
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
          "Total profit is 410",
          "The margin uses totals, not a simple average",
          "Zero revenue does not produce an error"
        ],
        "title": "Check a margin without misleading averages",
        "before": "The simple average of product margins is 25%, but it does not represent the consolidated margin.",
        "expected": "Revenue: 1100; cost: 690; profit: 410; consolidated margin: 37.27%.",
        "task": "Build a spreadsheet with revenue, cost, profit and margin. Calculate the total margin by dividing total profit by total revenue, with a formula and division-by-zero handling.",
        "limitation": "The reference checks the arithmetic and provides the formula. XLSX creation and recalculation are verified separately."
      }
    },
    {
      "id": "bi",
      "label": "Trust my metrics",
      "short": "Metrics",
      "skillId": "power-bi-modelagem-dax-performance",
      "card": {
        "id": "power-bi-modelagem-dax-performance",
        "code": "DD-111",
        "title": "Reliable metrics and more efficient Power BI",
        "category": "Data & intelligence",
        "categoryKey": "Dados & inteligência",
        "role": "offer",
        "deliverables": [
          "Model and measure diagnosis",
          "Rule review and reconciliation with the source",
          "DAX and refresh optimization",
          "Usage and performance assessment"
        ],
        "featured": true,
        "version": "1.2.0",
        "universe": {
          "alias": "Metric Cartographer",
          "tagline": "Find the rule behind the number before optimizing the measure."
        },
        "pricing": {
          "currency": "USD",
          "priceCents": 4200,
          "demoPriceCents": 0,
          "purchasable": false,
          "status": "proposed-free-demo",
          "revision": "2026-11-07",
          "assessedVersion": "1.2.0",
          "label": "Proposed price",
          "demoLabel": "Free in the demo",
          "notice": "Planned value in US dollars. No purchase or billing is active.",
          "basis": "Documentary assessment of scope; not a quality rating or proof of improvement.",
          "complexityLabel": "Specialist",
          "dimensions": [
            {
              "key": "depth",
              "label": "Technical depth",
              "score": 5,
              "max": 5,
              "weight": 35
            },
            {
              "key": "scope",
              "label": "Deliverable scope",
              "score": 4,
              "max": 5,
              "weight": 30
            },
            {
              "key": "verification",
              "label": "Verification effort",
              "score": 5,
              "max": 5,
              "weight": 20
            },
            {
              "key": "reuse",
              "label": "Reuse",
              "score": 5,
              "max": 5,
              "weight": 15
            }
          ],
          "reason": "Reference deliverable: Model and measure diagnosis.",
          "variantNote": null
        },
        "game": {
          "edition": "arcana-1",
          "fictional": true,
          "level": 6,
          "attack": 2370,
          "defense": 1640,
          "school": "Oracle",
          "flavor": "Deciphers what lies hidden between the numbers.",
          "notice": "Levels, ATK and DEF are fictional collection attributes. They do not measure skill quality, price or results."
        },
        "identity": {
          "schema": "drivedata.card-identity.v1",
          "namespace": "drivedata:deck:card:v1",
          "registryCode": "DD-111",
          "id": "ddk_ea99b810fac1c751bb0f0f176e0c7bef4fd39b525c468573620488c5a001bcda",
          "digest": "ea99b810fac1c751bb0f0f176e0c7bef4fd39b525c468573620488c5a001bcda",
          "serial": "DDK-111-EA99-B810-FAC1",
          "edition": {
            "id": "dde_c26d6119f9667bb4cecefcd6e10435e973e79cf43b2c8fdf71870811cd0c5a7f",
            "digest": "c26d6119f9667bb4cecefcd6e10435e973e79cf43b2c8fdf71870811cd0c5a7f",
            "version": "1.2.0",
            "packageSha256": "fb69ef1ba64619c9baa7da68f0d62cbe7ea47a1ab81c9beaf3f4766db0a9277e"
          },
          "blockchain": {
            "status": "not-minted",
            "network": null,
            "contract": null,
            "tokenId": null
          }
        }
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
              "month": "Feb",
              "revenue": 1500
            }
          ],
          "report": [
            {
              "month": "Jan",
              "revenue": 1000
            },
            {
              "month": "Feb",
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
              "month": "Feb",
              "source": 1500,
              "report": 1800,
              "difference": 300
            }
          ],
          "totalDifference": 300,
          "nextStep": "Check filters, duplicates and the recognition rule in Feb."
        },
        "checks": [
          "Comparison is performed by month",
          "The difference retains its sign",
          "Hypotheses are not presented as confirmed causes"
        ],
        "title": "Reconcile a metric with its source",
        "before": "The report and source show different values, but the month with the discrepancy has not been isolated.",
        "expected": "Jan matches; Feb shows a +300 difference; total difference is +300.",
        "task": "Compare monthly revenue in the source and report. Locate differences, formulate testable hypotheses and propose the next query. Do not change measures before confirming the rule.",
        "limitation": "The reference compares two samples. It does not execute DAX or measure Power BI performance."
      }
    },
    {
      "id": "product",
      "label": "Bring my idea to life",
      "short": "Product",
      "skillId": "prototipos-e-especificacao-funcional",
      "card": {
        "id": "prototipos-e-especificacao-funcional",
        "code": "DD-118",
        "title": "From idea to prototype and a verifiable scope",
        "category": "Research & strategy",
        "categoryKey": "Pesquisa & estratégia",
        "role": "offer",
        "deliverables": [
          "Navigable prototype with demonstration data",
          "Workflow and role mapping",
          "Functional specification and acceptance criteria",
          "Traceability matrix between needs and features"
        ],
        "featured": true,
        "version": "1.2.0",
        "universe": {
          "alias": "Scope Laboratory",
          "tagline": "Explore a demonstration flow before committing to the scope."
        },
        "pricing": {
          "currency": "USD",
          "priceCents": 3700,
          "demoPriceCents": 0,
          "purchasable": false,
          "status": "proposed-free-demo",
          "revision": "2026-11-07",
          "assessedVersion": "1.2.0",
          "label": "Proposed price",
          "demoLabel": "Free in the demo",
          "notice": "Planned value in US dollars. No purchase or billing is active.",
          "basis": "Documentary assessment of scope; not a quality rating or proof of improvement.",
          "complexityLabel": "Advanced",
          "dimensions": [
            {
              "key": "depth",
              "label": "Technical depth",
              "score": 4,
              "max": 5,
              "weight": 35
            },
            {
              "key": "scope",
              "label": "Deliverable scope",
              "score": 4,
              "max": 5,
              "weight": 30
            },
            {
              "key": "verification",
              "label": "Verification effort",
              "score": 4,
              "max": 5,
              "weight": 20
            },
            {
              "key": "reuse",
              "label": "Reuse",
              "score": 5,
              "max": 5,
              "weight": 15
            }
          ],
          "reason": "Reference deliverable: Navigable prototype with demonstration data.",
          "variantNote": null
        },
        "game": {
          "edition": "arcana-1",
          "fictional": true,
          "level": 7,
          "attack": 2740,
          "defense": 1580,
          "school": "Explorer",
          "flavor": "Follows clues, crosses borders and returns with new questions.",
          "notice": "Levels, ATK and DEF are fictional collection attributes. They do not measure skill quality, price or results."
        },
        "identity": {
          "schema": "drivedata.card-identity.v1",
          "namespace": "drivedata:deck:card:v1",
          "registryCode": "DD-118",
          "id": "ddk_bc7467d693430f414e6a33ebab2773e8ab320c7c09d0f0a36252818257959df1",
          "digest": "bc7467d693430f414e6a33ebab2773e8ab320c7c09d0f0a36252818257959df1",
          "serial": "DDK-118-BC74-67D6-9343",
          "edition": {
            "id": "dde_77746d88b71d217521d30824e8deb099eca0b3b8dc1561f6f00b502174682021",
            "digest": "77746d88b71d217521d30824e8deb099eca0b3b8dc1561f6f00b502174682021",
            "version": "1.2.0",
            "packageSha256": "e67c6fffa8304a5af58053035d89ab3b65eff0073a08ae4c6d8385e15a085448"
          },
          "blockchain": {
            "status": "not-minted",
            "network": null,
            "contract": null,
            "tokenId": null
          }
        }
      },
      "example": {
        "kind": "requirements",
        "input": {
          "need": "Track customer requests",
          "roles": [
            "Requester",
            "Manager"
          ],
          "states": [
            "Open",
            "Under review",
            "Completed"
          ]
        },
        "result": {
          "need": "Track customer requests",
          "flows": [
            {
              "role": "Requester",
              "screen": "New request",
              "acceptance": "When saving a valid request, display the Open state"
            },
            {
              "role": "Requester",
              "screen": "My requests",
              "acceptance": "Display the state and history of each authorized request"
            },
            {
              "role": "Manager",
              "screen": "Service queue",
              "acceptance": "Allow transitions between Open, Under review, Completed"
            }
          ],
          "openDecisions": [
            "Confirm permission rules",
            "Define persistence and integrations"
          ]
        },
        "checks": [
          "Each workflow has an acceptance criterion",
          "All three states are covered",
          "The prototype is distinguished from an operational integration"
        ],
        "title": "Turn an idea into verifiable criteria",
        "before": "“I want a request portal” does not yet define roles, states or acceptance criteria.",
        "expected": "A matrix covering creation, tracking and status changes; permissions and persistence identified as implementation decisions.",
        "task": "Propose a prototype using the provided roles and states, with fictional data. Link each need to a screen and an acceptance criterion. Identify open decisions.",
        "limitation": "The reference generates a scope matrix. Prototype navigation is built by the assistant in the usage environment."
      }
    },
    {
      "id": "content",
      "label": "Explain my offering clearly",
      "short": "Content",
      "skillId": "marketing-de-conteudo-b2b",
      "card": {
        "id": "marketing-de-conteudo-b2b",
        "code": "DD-100",
        "title": "B2B content that explains the solution's value",
        "category": "Sales & content",
        "categoryKey": "Vendas & conteúdo",
        "role": "offer",
        "deliverables": [
          "Editorial calendar and topics",
          "Posts, articles and newsletters",
          "Carousels and social media assets",
          "Tone of voice and messaging review"
        ],
        "featured": true,
        "version": "1.2.0",
        "universe": {
          "alias": "Value Translator",
          "tagline": "Turn technical capability into a message people can understand."
        },
        "pricing": {
          "currency": "USD",
          "priceCents": 3200,
          "demoPriceCents": 0,
          "purchasable": false,
          "status": "proposed-free-demo",
          "revision": "2026-11-07",
          "assessedVersion": "1.2.0",
          "label": "Proposed price",
          "demoLabel": "Free in the demo",
          "notice": "Planned value in US dollars. No purchase or billing is active.",
          "basis": "Documentary assessment of scope; not a quality rating or proof of improvement.",
          "complexityLabel": "Advanced",
          "dimensions": [
            {
              "key": "depth",
              "label": "Technical depth",
              "score": 3,
              "max": 5,
              "weight": 35
            },
            {
              "key": "scope",
              "label": "Deliverable scope",
              "score": 4,
              "max": 5,
              "weight": 30
            },
            {
              "key": "verification",
              "label": "Verification effort",
              "score": 3,
              "max": 5,
              "weight": 20
            },
            {
              "key": "reuse",
              "label": "Reuse",
              "score": 5,
              "max": 5,
              "weight": 15
            }
          ],
          "reason": "Reference deliverable: Editorial calendar and topics.",
          "variantNote": null
        },
        "game": {
          "edition": "arcana-1",
          "fictional": true,
          "level": 9,
          "attack": 3030,
          "defense": 1560,
          "school": "Envoy",
          "flavor": "Turns an idea into a message that finds its destination.",
          "notice": "Levels, ATK and DEF are fictional collection attributes. They do not measure skill quality, price or results."
        },
        "identity": {
          "schema": "drivedata.card-identity.v1",
          "namespace": "drivedata:deck:card:v1",
          "registryCode": "DD-100",
          "id": "ddk_e061be3e63b7aa02cddbd1b20032db3426a7ce2eeff82edf46a49c71333b5f03",
          "digest": "e061be3e63b7aa02cddbd1b20032db3426a7ce2eeff82edf46a49c71333b5f03",
          "serial": "DDK-100-E061-BE3E-63B7",
          "edition": {
            "id": "dde_19227b7259dfe3d694ed2b7b9623107ba33c44724167df62246ab29a81ebceb4",
            "digest": "19227b7259dfe3d694ed2b7b9623107ba33c44724167df62246ab29a81ebceb4",
            "version": "1.2.0",
            "packageSha256": "c39a9d67fc9dd3100659c2965bcc51026f0fe013616a4989c1eeebd248233649"
          },
          "blockchain": {
            "status": "not-minted",
            "network": null,
            "contract": null,
            "tokenId": null
          }
        }
      },
      "example": {
        "kind": "content",
        "input": {
          "audience": "Operations managers",
          "problem": "Consolidate spreadsheets",
          "capability": "Rule review and data organization",
          "cta": "Explore a consolidation example"
        },
        "result": {
          "draft": "Operations managers: is consolidating spreadsheets part of your routine?\n\nReviewing rules and organizing data is a starting point for understanding inconsistencies.\n\nExplore a consolidation example.",
          "status": "Draft for approval"
        },
        "checks": [
          "The audience and problem appear in the text",
          "The capability matches the input",
          "No numerical promises or invented testimonials"
        ],
        "title": "Communicate an offering without inventing results",
        "before": "A lengthy technical description makes the offering's practical application difficult to understand.",
        "expected": "A short text connecting spreadsheet consolidation, rule review and an invitation to see the example.",
        "task": "Write a short post for the specified audience. Connect the problem to the demonstrated capability and next step. Do not invent clients, testimonials or percentages.",
        "limitation": "The reference uses a deterministic editorial template. Brand voice review and publication approval are still required."
      }
    }
  ],
  "es": [
    {
      "id": "spreadsheets",
      "label": "Dominar mis hojas de cálculo",
      "short": "Hojas de cálculo",
      "skillId": "claude-xlsx",
      "card": {
        "id": "claude-xlsx",
        "code": "DD-042",
        "title": "Hojas de cálculo estructuradas y análisis en Excel",
        "category": "Documentos y operaciones",
        "categoryKey": "Documentos & operação",
        "role": "offer",
        "deliverables": [
          "Hojas de cálculo editables con fórmulas, tablas y gráficos",
          "Limpieza y reorganización de datos",
          "Modelos de cálculo con supuestos documentados",
          "Comprobación de fórmulas y resultados"
        ],
        "featured": true,
        "version": "1.2.0",
        "universe": {
          "alias": "Taller de Celdas",
          "tagline": "Una hoja útil muestra la cuenta y permite comprobar el resultado."
        },
        "pricing": {
          "currency": "USD",
          "priceCents": 4200,
          "demoPriceCents": 0,
          "purchasable": false,
          "status": "proposed-free-demo",
          "revision": "2026-11-07",
          "assessedVersion": "1.2.0",
          "label": "Precio propuesto",
          "demoLabel": "Gratis en la demo",
          "notice": "Valor previsto en dólares estadounidenses. No hay compras ni cobros activos.",
          "basis": "Evaluación documental del alcance; no es una nota de calidad ni una prueba de mejora.",
          "complexityLabel": "Especializada",
          "dimensions": [
            {
              "key": "depth",
              "label": "Profundidad técnica",
              "score": 4,
              "max": 5,
              "weight": 35
            },
            {
              "key": "scope",
              "label": "Alcance de la entrega",
              "score": 4,
              "max": 5,
              "weight": 30
            },
            {
              "key": "verification",
              "label": "Esfuerzo de revisión",
              "score": 5,
              "max": 5,
              "weight": 20
            },
            {
              "key": "reuse",
              "label": "Reutilización",
              "score": 5,
              "max": 5,
              "weight": 15
            }
          ],
          "reason": "Entrega de referencia: Hojas de cálculo editables con fórmulas, tablas y gráficos.",
          "variantNote": null
        },
        "game": {
          "edition": "arcana-1",
          "fictional": true,
          "level": 3,
          "attack": 1960,
          "defense": 2620,
          "school": "Escriba",
          "flavor": "Preserva los detalles que sostienen toda la misión.",
          "notice": "Los niveles, ATQ y DEF son atributos ficticios de colección. No miden la calidad, el precio ni los resultados de la skill."
        },
        "identity": {
          "schema": "drivedata.card-identity.v1",
          "namespace": "drivedata:deck:card:v1",
          "registryCode": "DD-042",
          "id": "ddk_bad9bc04dbc74b7e6bd47cce0845c7413b1a426c969b8f86b4775b7a8aafeaff",
          "digest": "bad9bc04dbc74b7e6bd47cce0845c7413b1a426c969b8f86b4775b7a8aafeaff",
          "serial": "DDK-042-BAD9-BC04-DBC7",
          "edition": {
            "id": "dde_3635de4b15a016f3807cc8232f62a5e6663ddc10a03ef06f64c7e99e121a7209",
            "digest": "3635de4b15a016f3807cc8232f62a5e6663ddc10a03ef06f64c7e99e121a7209",
            "version": "1.2.0",
            "packageSha256": "55c4e5e2db66da4dced132423ce65645eac18e7bb9efbe6d246963fcc8ece987"
          },
          "blockchain": {
            "status": "not-minted",
            "network": null,
            "contract": null,
            "tokenId": null
          }
        }
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
          "El beneficio total es 410",
          "El margen utiliza los totales, no un promedio simple",
          "Los ingresos cero no producen un error"
        ],
        "title": "Comprobar un margen sin promedios engañosos",
        "before": "El promedio simple de los márgenes por producto es del 25%, pero no representa el margen consolidado.",
        "expected": "Ingresos: 1100; coste: 690; beneficio: 410; margen consolidado: 37,27%.",
        "task": "Crea una hoja de cálculo con ingresos, coste, beneficio y margen. Calcula el margen total dividiendo la suma del beneficio entre la suma de los ingresos, con fórmula y tratamiento de la división por cero.",
        "limitation": "La referencia comprueba la aritmética y proporciona la fórmula. La creación y el recálculo del XLSX se verifican por separado."
      }
    },
    {
      "id": "bi",
      "label": "Confiar en mis indicadores",
      "short": "Indicadores",
      "skillId": "power-bi-modelagem-dax-performance",
      "card": {
        "id": "power-bi-modelagem-dax-performance",
        "code": "DD-111",
        "title": "Indicadores fiables y Power BI más eficiente",
        "category": "Datos e inteligencia",
        "categoryKey": "Dados & inteligência",
        "role": "offer",
        "deliverables": [
          "Diagnóstico del modelo y las medidas",
          "Revisión de reglas y conciliación con la fuente",
          "Optimización de DAX y actualizaciones",
          "Evaluación de consumo y rendimiento"
        ],
        "featured": true,
        "version": "1.2.0",
        "universe": {
          "alias": "Cartógrafo de Métricas",
          "tagline": "Encuentra la regla detrás de la cifra antes de optimizar la medida."
        },
        "pricing": {
          "currency": "USD",
          "priceCents": 4200,
          "demoPriceCents": 0,
          "purchasable": false,
          "status": "proposed-free-demo",
          "revision": "2026-11-07",
          "assessedVersion": "1.2.0",
          "label": "Precio propuesto",
          "demoLabel": "Gratis en la demo",
          "notice": "Valor previsto en dólares estadounidenses. No hay compras ni cobros activos.",
          "basis": "Evaluación documental del alcance; no es una nota de calidad ni una prueba de mejora.",
          "complexityLabel": "Especializada",
          "dimensions": [
            {
              "key": "depth",
              "label": "Profundidad técnica",
              "score": 5,
              "max": 5,
              "weight": 35
            },
            {
              "key": "scope",
              "label": "Alcance de la entrega",
              "score": 4,
              "max": 5,
              "weight": 30
            },
            {
              "key": "verification",
              "label": "Esfuerzo de revisión",
              "score": 5,
              "max": 5,
              "weight": 20
            },
            {
              "key": "reuse",
              "label": "Reutilización",
              "score": 5,
              "max": 5,
              "weight": 15
            }
          ],
          "reason": "Entrega de referencia: Diagnóstico del modelo y las medidas.",
          "variantNote": null
        },
        "game": {
          "edition": "arcana-1",
          "fictional": true,
          "level": 6,
          "attack": 2370,
          "defense": 1640,
          "school": "Oráculo",
          "flavor": "Descifra lo que se esconde entre los números.",
          "notice": "Los niveles, ATQ y DEF son atributos ficticios de colección. No miden la calidad, el precio ni los resultados de la skill."
        },
        "identity": {
          "schema": "drivedata.card-identity.v1",
          "namespace": "drivedata:deck:card:v1",
          "registryCode": "DD-111",
          "id": "ddk_ea99b810fac1c751bb0f0f176e0c7bef4fd39b525c468573620488c5a001bcda",
          "digest": "ea99b810fac1c751bb0f0f176e0c7bef4fd39b525c468573620488c5a001bcda",
          "serial": "DDK-111-EA99-B810-FAC1",
          "edition": {
            "id": "dde_c26d6119f9667bb4cecefcd6e10435e973e79cf43b2c8fdf71870811cd0c5a7f",
            "digest": "c26d6119f9667bb4cecefcd6e10435e973e79cf43b2c8fdf71870811cd0c5a7f",
            "version": "1.2.0",
            "packageSha256": "fb69ef1ba64619c9baa7da68f0d62cbe7ea47a1ab81c9beaf3f4766db0a9277e"
          },
          "blockchain": {
            "status": "not-minted",
            "network": null,
            "contract": null,
            "tokenId": null
          }
        }
      },
      "example": {
        "kind": "reconcile",
        "input": {
          "source": [
            {
              "month": "Ene",
              "revenue": 1000
            },
            {
              "month": "Feb",
              "revenue": 1500
            }
          ],
          "report": [
            {
              "month": "Ene",
              "revenue": 1000
            },
            {
              "month": "Feb",
              "revenue": 1800
            }
          ]
        },
        "result": {
          "rows": [
            {
              "month": "Ene",
              "source": 1000,
              "report": 1000,
              "difference": 0
            },
            {
              "month": "Feb",
              "source": 1500,
              "report": 1800,
              "difference": 300
            }
          ],
          "totalDifference": 300,
          "nextStep": "Comprobar filtros, duplicados y la regla de reconocimiento en Feb."
        },
        "checks": [
          "La comparación se realiza por mes",
          "La diferencia mantiene el signo",
          "Las hipótesis no se presentan como causas confirmadas"
        ],
        "title": "Conciliar el indicador con la fuente",
        "before": "El informe y la fuente presentan valores distintos, pero no se ha aislado el mes de la discrepancia.",
        "expected": "Ene coincide; Feb presenta una diferencia de +300; diferencia total de +300.",
        "task": "Compara los ingresos mensuales de la fuente con el informe. Localiza las diferencias, formula hipótesis verificables y propón la próxima consulta. No modifiques medidas antes de confirmar la regla.",
        "limitation": "La referencia compara dos muestras. No ejecuta DAX ni mide el rendimiento de Power BI."
      }
    },
    {
      "id": "product",
      "label": "Hacer realidad mi idea",
      "short": "Producto",
      "skillId": "prototipos-e-especificacao-funcional",
      "card": {
        "id": "prototipos-e-especificacao-funcional",
        "code": "DD-118",
        "title": "De la idea al prototipo y a un alcance verificable",
        "category": "Investigación y estrategia",
        "categoryKey": "Pesquisa & estratégia",
        "role": "offer",
        "deliverables": [
          "Prototipo navegable con datos de demostración",
          "Mapeo de flujos y perfiles",
          "Especificación funcional y criterios de aceptación",
          "Matriz de trazabilidad entre necesidades y funcionalidades"
        ],
        "featured": true,
        "version": "1.2.0",
        "universe": {
          "alias": "Laboratorio del Alcance",
          "tagline": "Explora un flujo de demostración antes de comprometer el alcance."
        },
        "pricing": {
          "currency": "USD",
          "priceCents": 3700,
          "demoPriceCents": 0,
          "purchasable": false,
          "status": "proposed-free-demo",
          "revision": "2026-11-07",
          "assessedVersion": "1.2.0",
          "label": "Precio propuesto",
          "demoLabel": "Gratis en la demo",
          "notice": "Valor previsto en dólares estadounidenses. No hay compras ni cobros activos.",
          "basis": "Evaluación documental del alcance; no es una nota de calidad ni una prueba de mejora.",
          "complexityLabel": "Avanzada",
          "dimensions": [
            {
              "key": "depth",
              "label": "Profundidad técnica",
              "score": 4,
              "max": 5,
              "weight": 35
            },
            {
              "key": "scope",
              "label": "Alcance de la entrega",
              "score": 4,
              "max": 5,
              "weight": 30
            },
            {
              "key": "verification",
              "label": "Esfuerzo de revisión",
              "score": 4,
              "max": 5,
              "weight": 20
            },
            {
              "key": "reuse",
              "label": "Reutilización",
              "score": 5,
              "max": 5,
              "weight": 15
            }
          ],
          "reason": "Entrega de referencia: Prototipo navegable con datos de demostración.",
          "variantNote": null
        },
        "game": {
          "edition": "arcana-1",
          "fictional": true,
          "level": 7,
          "attack": 2740,
          "defense": 1580,
          "school": "Explorador",
          "flavor": "Sigue pistas, cruza fronteras y vuelve con nuevas preguntas.",
          "notice": "Los niveles, ATQ y DEF son atributos ficticios de colección. No miden la calidad, el precio ni los resultados de la skill."
        },
        "identity": {
          "schema": "drivedata.card-identity.v1",
          "namespace": "drivedata:deck:card:v1",
          "registryCode": "DD-118",
          "id": "ddk_bc7467d693430f414e6a33ebab2773e8ab320c7c09d0f0a36252818257959df1",
          "digest": "bc7467d693430f414e6a33ebab2773e8ab320c7c09d0f0a36252818257959df1",
          "serial": "DDK-118-BC74-67D6-9343",
          "edition": {
            "id": "dde_77746d88b71d217521d30824e8deb099eca0b3b8dc1561f6f00b502174682021",
            "digest": "77746d88b71d217521d30824e8deb099eca0b3b8dc1561f6f00b502174682021",
            "version": "1.2.0",
            "packageSha256": "e67c6fffa8304a5af58053035d89ab3b65eff0073a08ae4c6d8385e15a085448"
          },
          "blockchain": {
            "status": "not-minted",
            "network": null,
            "contract": null,
            "tokenId": null
          }
        }
      },
      "example": {
        "kind": "requirements",
        "input": {
          "need": "Seguir las solicitudes de clientes",
          "roles": [
            "Solicitante",
            "Responsable"
          ],
          "states": [
            "Abierta",
            "En revisión",
            "Completada"
          ]
        },
        "result": {
          "need": "Seguir las solicitudes de clientes",
          "flows": [
            {
              "role": "Solicitante",
              "screen": "Nueva solicitud",
              "acceptance": "Al guardar una solicitud válida, mostrar el estado Abierta"
            },
            {
              "role": "Solicitante",
              "screen": "Mis solicitudes",
              "acceptance": "Mostrar el estado y el historial de cada solicitud autorizada"
            },
            {
              "role": "Responsable",
              "screen": "Cola de atención",
              "acceptance": "Permitir transiciones entre Abierta, En revisión, Completada"
            }
          ],
          "openDecisions": [
            "Confirmar las reglas de permisos",
            "Definir persistencia e integraciones"
          ]
        },
        "checks": [
          "Cada flujo tiene un criterio de aceptación",
          "Se contemplan los tres estados",
          "El prototipo se distingue de una integración operativa"
        ],
        "title": "Convertir una idea en criterios verificables",
        "before": "«Quiero un portal de solicitudes» aún no define perfiles, estados ni criterios de aceptación.",
        "expected": "Matriz con creación, seguimiento y cambio de estado; permisos y persistencia señalados como decisiones de implementación.",
        "task": "Propón un prototipo con los perfiles y estados proporcionados, usando datos ficticios. Relaciona cada necesidad con una pantalla y un criterio de aceptación. Identifica las decisiones pendientes.",
        "limitation": "La referencia genera una matriz de alcance. El asistente construye la navegación del prototipo en el entorno de uso."
      }
    },
    {
      "id": "content",
      "label": "Explicar mejor mi oferta",
      "short": "Contenido",
      "skillId": "marketing-de-conteudo-b2b",
      "card": {
        "id": "marketing-de-conteudo-b2b",
        "code": "DD-100",
        "title": "Contenido B2B que explica el valor de la solución",
        "category": "Ventas y contenido",
        "categoryKey": "Vendas & conteúdo",
        "role": "offer",
        "deliverables": [
          "Calendario y temas editoriales",
          "Publicaciones, artículos y boletines",
          "Carruseles y piezas para redes sociales",
          "Revisión del tono de voz y los mensajes"
        ],
        "featured": true,
        "version": "1.2.0",
        "universe": {
          "alias": "Traductor de Valor",
          "tagline": "Convierte capacidad técnica en un mensaje comprensible."
        },
        "pricing": {
          "currency": "USD",
          "priceCents": 3200,
          "demoPriceCents": 0,
          "purchasable": false,
          "status": "proposed-free-demo",
          "revision": "2026-11-07",
          "assessedVersion": "1.2.0",
          "label": "Precio propuesto",
          "demoLabel": "Gratis en la demo",
          "notice": "Valor previsto en dólares estadounidenses. No hay compras ni cobros activos.",
          "basis": "Evaluación documental del alcance; no es una nota de calidad ni una prueba de mejora.",
          "complexityLabel": "Avanzada",
          "dimensions": [
            {
              "key": "depth",
              "label": "Profundidad técnica",
              "score": 3,
              "max": 5,
              "weight": 35
            },
            {
              "key": "scope",
              "label": "Alcance de la entrega",
              "score": 4,
              "max": 5,
              "weight": 30
            },
            {
              "key": "verification",
              "label": "Esfuerzo de revisión",
              "score": 3,
              "max": 5,
              "weight": 20
            },
            {
              "key": "reuse",
              "label": "Reutilización",
              "score": 5,
              "max": 5,
              "weight": 15
            }
          ],
          "reason": "Entrega de referencia: Calendario y temas editoriales.",
          "variantNote": null
        },
        "game": {
          "edition": "arcana-1",
          "fictional": true,
          "level": 9,
          "attack": 3030,
          "defense": 1560,
          "school": "Embajador",
          "flavor": "Convierte una idea en un mensaje que encuentra su destino.",
          "notice": "Los niveles, ATQ y DEF son atributos ficticios de colección. No miden la calidad, el precio ni los resultados de la skill."
        },
        "identity": {
          "schema": "drivedata.card-identity.v1",
          "namespace": "drivedata:deck:card:v1",
          "registryCode": "DD-100",
          "id": "ddk_e061be3e63b7aa02cddbd1b20032db3426a7ce2eeff82edf46a49c71333b5f03",
          "digest": "e061be3e63b7aa02cddbd1b20032db3426a7ce2eeff82edf46a49c71333b5f03",
          "serial": "DDK-100-E061-BE3E-63B7",
          "edition": {
            "id": "dde_19227b7259dfe3d694ed2b7b9623107ba33c44724167df62246ab29a81ebceb4",
            "digest": "19227b7259dfe3d694ed2b7b9623107ba33c44724167df62246ab29a81ebceb4",
            "version": "1.2.0",
            "packageSha256": "c39a9d67fc9dd3100659c2965bcc51026f0fe013616a4989c1eeebd248233649"
          },
          "blockchain": {
            "status": "not-minted",
            "network": null,
            "contract": null,
            "tokenId": null
          }
        }
      },
      "example": {
        "kind": "content",
        "input": {
          "audience": "Responsables de operaciones",
          "problem": "Consolidar hojas de cálculo",
          "capability": "Revisión de reglas y organización de datos",
          "cta": "Conoce un ejemplo de consolidación"
        },
        "result": {
          "draft": "Responsables de operaciones: ¿consolidar hojas de cálculo forma parte de tu rutina?\n\nRevisar las reglas y organizar los datos es un punto de partida para entender las inconsistencias.\n\nConoce un ejemplo de consolidación.",
          "status": "Borrador para aprobación"
        },
        "checks": [
          "El público y el problema aparecen en el texto",
          "La capacidad corresponde a la entrada",
          "No hay promesas numéricas ni testimonios inventados"
        ],
        "title": "Comunicar una oferta sin inventar resultados",
        "before": "Una descripción técnica larga dificulta entender la aplicación práctica de la oferta.",
        "expected": "Texto breve que relaciona la consolidación de hojas de cálculo, la revisión de reglas y una invitación a ver el ejemplo.",
        "task": "Escribe una publicación breve para el público indicado. Relaciona el problema con la capacidad demostrada y el próximo paso. No inventes clientes, testimonios ni porcentajes.",
        "limitation": "La referencia utiliza una plantilla editorial determinista. La revisión de la voz de marca y la aprobación para publicar siguen siendo necesarias."
      }
    }
  ]
})[DeckI18n.locale];
