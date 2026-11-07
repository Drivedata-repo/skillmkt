# DriveData Deck — avaliação e preços propostos

Revisão: 2026-11-07. Moeda única: USD. Demo gratuita, sem checkout ou cobrança.

## Critério

As 137 entradas foram avaliadas individualmente pelos entregáveis, dependências e contrato operacional da edição 1.2.0. Os hashes vinculam a análise aos pacotes e documentos consultados. Esta é uma avaliação documental para posicionamento de preço, não uma execução integral, uma pesquisa de disposição a pagar ou certificação. Os dez ensaios de arquivos reais estão registrados separadamente.

Notas de 1 a 5: profundidade técnica (35%), abrangência da entrega (30%), esforço necessário de conferência (20%) e reutilização (15%). Um significa escopo introdutório ou muito restrito; cinco, escopo amplo e especializado. Esforço de conferência não significa verificação já realizada.

Preço em dólares = 7 + 5 × arredondar((média ponderada − 1) × 2). Faixas: 7, 12, 17, 22, 27, 32, 37, 42 e 47. Variantes da mesma finalidade recebem as mesmas notas e preço, com requisitos próprios preservados. Quantidade de arquivos, raridade visual e poderes fictícios não entram no cálculo. Os valores são propostas para validação comercial, não preços anteriormente praticados.

Ferramentas, assinaturas, infraestrutura, implantação e serviço humano não estão incluídos no preço proposto do pacote de instruções. Os registros de licença e liberação comercial existentes não foram alterados.

## Combos

Descontos calculados sobre a soma dos preços individuais propostos, em centavos. O teto de US$ 47 vale por skill; os combos reúnem várias skills. Não há cobrança nem renovação automática. Os dois primeiros têm percursos guiados já existentes; os demais são coleções por objetivo.

| Combo | Skills | Soma proposta | Desconto | Combo proposto | Economia proposta |
|---|---|---:|---:|---:|---:|
| Planilhas confiáveis | DD-035, DD-042, DD-003 | US$ 121 | 25% | US$ 90.75 | US$ 30.25 |
| Power BI sob controle | DD-035, DD-111, DD-032, DD-011 | US$ 158 | 30% | US$ 110.60 | US$ 47.40 |
| Documentos que convencem | DD-019, DD-037, DD-031 | US$ 101 | 20% | US$ 80.80 | US$ 20.20 |
| Da ideia ao produto | DD-118, DD-086, DD-087 | US$ 116 | 25% | US$ 87 | US$ 29 |
| Comercial com contexto | DD-100, DD-116, DD-115 | US$ 96 | 20% | US$ 76.80 | US$ 19.20 |

## Todas as avaliações

D = profundidade; A = abrangência; C = esforço de conferência; R = reuso.

| Carta | Skill | D/A/C/R | Complexidade | USD proposto | Justificativa documental |
|---|---|---|---|---:|---|
| DD-001 | agent-development | 4/3/4/4 | Avançada | US$ 32 | Define agentes, ferramentas mínimas e testes de ativação; depende do runtime de plugins. |
| DD-002 | ambiente-dev-windows | 3/2/2/3 | Intermediária | US$ 22 | Diagnóstico reutilizável de runtimes, caminhos e TLS; receitas locais exigem reconfirmação. |
| DD-003 | automacao-documentos-office | 4/4/4/5 | Avançada | US$ 37 | Coordena quatro formatos editáveis com recálculo, renderização e consistência entre arquivos. |
| DD-004 | brief | 2/3/3/4 | Intermediária | US$ 27 | Organiza fontes, prazos e pendências jurídicas; interpretação continua sujeita a revisão profissional. |
| DD-005 | build-mcp-app | 4/5/4/4 | Especializada | US$ 42 | Combina servidor, widget, CSP e contratos de interação com fallback no host. |
| DD-006 | build-mcp-server | 4/5/4/5 | Especializada | US$ 42 | Cria ferramentas e autenticação com testes de timeout, escopo e respostas inválidas. |
| DD-007 | build-mcpb | 4/3/4/3 | Avançada | US$ 32 | Empacota servidor e dependências; exige manifesto, verificação de caminhos e instalação portátil. |
| DD-008 | cardputer-buddy | 4/3/3/2 | Avançada | US$ 27 | Itera aplicativo MicroPython com logs e recuperação em hardware específico já provisionado. |
| DD-009 | claude-acta-drivedata | 2/3/3/5 | Intermediária | US$ 27 | Transforma transcrição em ata e compromissos rastreáveis; verifica nomes, datas e formatos. |
| DD-010 | claude-automation-recommender | 3/3/2/4 | Intermediária | US$ 27 | Diagnóstico de repositório com recomendações priorizadas; não implementa a automação. |
| DD-011 | claude-bi-documentation | 4/4/4/4 | Avançada | US$ 37 | Inventaria metadados e DAX com cobertura e revisão do documento Word. |
| DD-012 | claude-built-in-browser | 2/1/2/3 | Essencial | US$ 17 | Guia de operação dependente do navegador e permissões do host; não instala automação. |
| DD-013 | claude-chrome-browser | 2/2/2/3 | Essencial | US$ 17 | Orienta navegação e evidência antes/depois com extensão conectada; escopo de apoio. |
| DD-014 | claude-cloud-code-architecture | 4/4/3/4 | Avançada | US$ 37 | Analisa eventos, idempotência e recuperação; desenho não equivale a infraestrutura implantada. |
| DD-015 | claude-computer-use | 2/2/2/3 | Essencial | US$ 17 | Procedimento de inspeção e operação de aplicativos; depende de ferramentas do host. |
| DD-016 | claude-computer-use-staging | 2/2/2/3 | Essencial | US$ 17 | Variante de preparação, com a mesma finalidade; não é capacidade adicional. |
| DD-017 | claude-deep-research | 3/4/4/5 | Avançada | US$ 37 | Pesquisa com fontes, conflitos e limites de cobertura; entrega síntese para decisão. |
| DD-018 | claude-docs | 1/1/1/1 | Essencial | US$ 7 | Encaminhamento ao conector de documentos; não contém um gerador autônomo. |
| DD-019 | claude-docx | 3/4/4/5 | Avançada | US$ 37 | Cria e edita Word preservando comentários, relações e estrutura, com renderização. |
| DD-020 | claude-google-workspace | 3/4/4/4 | Avançada | US$ 32 | Atua em documentos, planilhas e slides via conectores, preservando revisão concorrente. |
| DD-021 | claude-import-memory | 2/1/2/2 | Essencial | US$ 12 | Importação aditiva de contexto duradouro para um mecanismo de memória específico. |
| DD-022 | claude-maia | 1/1/1/1 | Essencial | US$ 7 | Somente referência sanitizada de inventário; funções e dados privados não são distribuídos. |
| DD-023 | claude-marketplace-skill-creator | 4/4/4/5 | Avançada | US$ 37 | Variante de origem marketplace do mesmo processo de autoria e avaliação. |
| DD-024 | claude-md-improver | 2/2/3/4 | Intermediária | US$ 22 | Revisa instruções de repositório com evidência e diff pontual; escopo documental delimitado. |
| DD-025 | claude-messi-knowledge-ingest | 4/4/4/4 | Avançada | US$ 37 | Prepara ingestão versionada, deduplicação e rastreabilidade; indexação requer pipeline real. |
| DD-026 | claude-morning | 2/2/3/4 | Intermediária | US$ 22 | Consolida agenda e prioridades em HTML a partir das fontes disponíveis, sem recorrência implícita. |
| DD-027 | claude-oraculo | 4/5/4/4 | Especializada | US$ 42 | Concilia bases comerciais, indicadores e cenários com premissas; scoring não é previsão validada. |
| DD-028 | claude-pbip | 4/3/4/4 | Avançada | US$ 32 | Organiza e converte projetos com diferenças thin/thick, caches e referências preservadas. |
| DD-029 | claude-pbir-expert | 4/4/4/4 | Avançada | US$ 37 | Edita relatórios e modelos como código, preservando IDs, bindings e semântica. |
| DD-030 | claude-pbir-format | 4/2/3/4 | Intermediária | US$ 27 | Referência especializada de esquemas e camadas PBIR; escopo menor que implementar um relatório. |
| DD-031 | claude-pdf | 3/3/4/5 | Avançada | US$ 32 | Extrai, organiza e produz PDFs com OCR e conferência de página conforme a entrada. |
| DD-032 | claude-power-bi-best-practices | 4/4/5/4 | Especializada | US$ 37 | Audita modelos por severidade e cobertura, com exceções justificadas e métricas quando disponíveis. |
| DD-033 | claude-power-bi-data-analysis | 4/4/4/4 | Avançada | US$ 37 | Liga perguntas de negócio a granularidade, indicadores, medidas e estrutura analítica. |
| DD-034 | claude-power-bi-dax-optimization | 4/3/5/5 | Avançada | US$ 37 | Refatora DAX preservando filtros, totais e BLANK; desempenho precisa de medição separada. |
| DD-035 | claude-power-query-best-practices | 4/4/5/5 | Especializada | US$ 42 | Revisa tipos, etapas, parâmetros e folding, com comparação de dados e fronteiras incrementais. |
| DD-036 | claude-powerbi-html-visuals | 4/4/4/4 | Avançada | US$ 37 | Combina DAX e HTML com restrições do visual hospedeiro e teste dos filtros e números. |
| DD-037 | claude-pptx | 3/4/4/4 | Avançada | US$ 32 | Produz apresentações editáveis preservando notas, masters e legibilidade em renderização. |
| DD-038 | claude-protheus-expert | 5/5/5/4 | Especializada | US$ 47 | Integra conhecimento de ERP, AdvPL/TLPP, dicionário e isolamento transacional por versão. |
| DD-039 | claude-security | 4/2/3/3 | Intermediária | US$ 27 | Orquestra revisão em plugin externo; componentes não incluídos limitam a autonomia do pacote. |
| DD-040 | claude-skill-creator | 4/4/4/5 | Avançada | US$ 37 | Cria skills e avaliações de ativação e qualidade com comparação de referência. |
| DD-041 | claude-tmdl | 4/3/4/4 | Avançada | US$ 32 | Edita modelo textual preservando lineage, relações e fórmulas; exige validação semântica externa. |
| DD-042 | claude-xlsx | 4/4/5/5 | Especializada | US$ 42 | Produz planilhas com fórmulas, entradas e gráficos; recálculo e mutação de entradas são relevantes. |
| DD-043 | claude-xlsx-staging | 4/4/5/5 | Especializada | US$ 42 | Alternativa da mesma finalidade; não adiciona recursos nem substitui a verificação no motor. |
| DD-044 | code-review-and-quality | 4/3/4/5 | Avançada | US$ 37 | Revisão focalizada de código com achados reproduzíveis e verificação de regressão. |
| DD-045 | command-development | 3/3/3/4 | Intermediária | US$ 27 | Constrói comandos parametrizados e valida argumentos, ferramentas e fronteiras do shell. |
| DD-046 | compliance-check | 3/3/3/4 | Intermediária | US$ 27 | Organiza requisitos e riscos por jurisdição; entrega triagem, não aprovação de conformidade. |
| DD-047 | cowork-plugin-customizer | 3/4/4/3 | Avançada | US$ 32 | Adapta pacote existente, referências e configuração, preservando integridade e licenças. |
| DD-048 | create-cowork-plugin | 3/4/4/4 | Avançada | US$ 32 | Cria fluxo e componentes de plugin com manifesto, testes de ativação e instalação dependente do host. |
| DD-049 | debugging-and-error-recovery | 4/3/4/5 | Avançada | US$ 37 | Reproduz falhas, isola hipóteses e verifica a correção no runner adequado. |
| DD-050 | design-de-interface-autoral | 4/4/4/5 | Avançada | US$ 37 | Coordena identidade, hierarquia e estados com contraste, responsividade e movimento reduzido. |
| DD-051 | discord-access | 3/2/3/3 | Intermediária | US$ 22 | Opera política de acesso e concorrência de configuração no plugin Discord. |
| DD-052 | discord-configure | 2/2/3/3 | Intermediária | US$ 22 | Configura canal e credenciais com diagnóstico de prontidão, sem fornecer o bot completo. |
| DD-053 | estilo-de-colaboracao | 1/1/1/2 | Essencial | US$ 7 | Referência de comunicação que deve ser adaptada; não entrega uma solução operacional por si só. |
| DD-054 | example-command | 1/1/1/1 | Essencial | US$ 7 | Template demonstrativo de argumento e parser; não constitui serviço final. |
| DD-055 | example-skill | 1/1/1/1 | Essencial | US$ 7 | Esqueleto didático de definição e ativação; não implementa uma especialidade. |
| DD-056 | figma-code-connect | 4/3/4/4 | Avançada | US$ 32 | Mapeia componentes e variantes para código, preservando instâncias sem correspondência. |
| DD-057 | figma-code-connect-figquery | 4/3/4/4 | Avançada | US$ 32 | Mesmo escopo de Code Connect; exige adaptador FigQuery compatível. |
| DD-058 | figma-code-workflows | 3/3/3/3 | Intermediária | US$ 27 | Importa interfaces para o destino escolhido e confere editabilidade e assets. |
| DD-059 | figma-create-new-file | 1/1/2/2 | Essencial | US$ 12 | Prepara um arquivo no editor correto; não inclui a criação de seu conteúdo. |
| DD-060 | figma-create-new-file-figquery | 1/1/2/2 | Essencial | US$ 12 | Variante de criação de arquivo para FigQuery, sem entrega adicional. |
| DD-061 | figma-design-to-code | 4/5/4/5 | Especializada | US$ 42 | Implementa design com estados, semântica, teclado e comparação visual no produto. |
| DD-062 | figma-design-to-code-figquery | 4/5/4/5 | Especializada | US$ 42 | Mesmo resultado de implementação, com descoberta de contexto pelo adaptador FigQuery. |
| DD-063 | figma-generate-design | 3/4/4/4 | Avançada | US$ 32 | Compõe telas editáveis e confere fontes, componentes e vínculos após importação. |
| DD-064 | figma-generate-design-figquery | 3/4/4/4 | Avançada | US$ 32 | Variante da mesma prototipação, com reconciliação de falhas pelo builder FigQuery. |
| DD-065 | figma-generate-diagram | 2/3/3/4 | Intermediária | US$ 27 | Converte processos em nós e relações verificáveis, com validação da direção e condições. |
| DD-066 | figma-generate-diagram-figquery | 2/3/3/4 | Intermediária | US$ 27 | Variante do mesmo diagrama para capacidades FigQuery disponíveis. |
| DD-067 | figma-generate-library | 4/5/4/5 | Especializada | US$ 42 | Constrói tokens, componentes e variantes com reconciliação de IDs e alinhamento ao código. |
| DD-068 | figma-generate-library-figquery | 4/5/4/5 | Especializada | US$ 42 | Mesmo sistema de design, adaptado ao builder e ao escopo do runtime FigQuery. |
| DD-069 | figma-generative-plugins | 4/4/4/4 | Avançada | US$ 37 | Cria código generativo reutilizável e verifica compilação, entradas e efeito no editor. |
| DD-070 | figma-generative-plugins-figquery | 4/4/4/4 | Avançada | US$ 37 | Variante de plugin generativo; não acrescenta o backend necessário à execução. |
| DD-071 | figma-implement-motion | 4/4/4/4 | Avançada | US$ 37 | Traduz inventário de movimento em código, com cobertura de nós e verificação temporal. |
| DD-072 | figma-implement-motion-figquery | 4/4/4/4 | Avançada | US$ 37 | Mesmo escopo de motion, com assets e leitura compatíveis com FigQuery. |
| DD-073 | figma-shaders | 4/3/4/3 | Avançada | US$ 32 | Produz shaders e controles, verificando compilação, valores extremos e aparência. |
| DD-074 | figma-shaders-figquery | 4/3/4/3 | Avançada | US$ 32 | Variante do shader; migração de controles precisa de validação no adaptador. |
| DD-075 | figma-spec | 2/3/3/4 | Intermediária | US$ 27 | Edita especificações com controle de versão, preservando trechos não autorizados. |
| DD-076 | figma-swiftui | 4/5/4/4 | Especializada | US$ 42 | Traduz design e SwiftUI em duas direções com estados e validação no ambiente iOS. |
| DD-077 | figma-swiftui-figquery | 4/5/4/4 | Especializada | US$ 42 | Variante da tradução SwiftUI; exige ferramentas e símbolos realmente suportados. |
| DD-078 | figma-use | 3/2/3/4 | Intermediária | US$ 27 | Base de operação e inspeção de nós e variáveis; não equivale a um projeto completo de design. |
| DD-079 | figma-use-figjam | 2/2/3/4 | Intermediária | US$ 22 | Organiza elementos e relações em quadros; depende do editor e conector adequados. |
| DD-080 | figma-use-figjam-figquery | 2/2/3/4 | Intermediária | US$ 22 | Variante de operação do FigJam via builder, com a mesma finalidade. |
| DD-081 | figma-use-figquery | 3/2/3/4 | Intermediária | US$ 27 | Alternativa do mesmo operador de canvas; compatibilidade precisa ser observada. |
| DD-082 | figma-use-motion | 3/3/3/4 | Intermediária | US$ 27 | Define keyframes e timing; verificação visual requer preview temporal disponível. |
| DD-083 | figma-use-motion-figquery | 3/3/3/4 | Intermediária | US$ 27 | Mesma finalidade de movimento, limitada às capacidades do adaptador FigQuery. |
| DD-084 | figma-use-slides | 3/3/3/4 | Intermediária | US$ 27 | Organiza slides editáveis, geometria, ordem e notas com inspeção visual. |
| DD-085 | figma-use-slides-figquery | 3/3/3/4 | Intermediária | US$ 27 | Variante de Slides com retorno e builder próprios, sem nova capacidade comercial. |
| DD-086 | frontend-design | 3/3/3/5 | Intermediária | US$ 32 | Direção visual e implementação da hierarquia com conteúdo real, teclado e responsividade. |
| DD-087 | fullstack-nextjs-vercel | 5/5/5/5 | Especializada | US$ 47 | Abrange aplicação, integrações, idiomas e publicação com build e validação do fluxo online. |
| DD-088 | generate-project-plan | 3/3/3/4 | Intermediária | US$ 27 | Transforma PRD e código em frentes e etapas num quadro, preservando decisões e relações. |
| DD-089 | gestao-de-entregas-e-homologacao | 3/4/4/5 | Avançada | US$ 37 | Estrutura backlog, aceite, liberação e recuperação com rastreabilidade de evidências. |
| DD-090 | git-workflow-and-versioning | 2/2/3/5 | Intermediária | US$ 22 | Apoia branches, commits e conflitos preservando alterações compartilhadas e contexto. |
| DD-091 | hook-development | 4/3/4/4 | Avançada | US$ 32 | Constrói hooks por evento com fixtures e diferenças explícitas entre runtimes. |
| DD-092 | ia-aplicada-a-produtos | 5/5/5/5 | Especializada | US$ 47 | Integra modelos, dados e ações com controles, avaliação de respostas e fallback autorizado. |
| DD-093 | imessage-access | 3/2/3/3 | Intermediária | US$ 22 | Gerencia allowlist e concorrência no plugin iMessage, exigindo macOS e acesso autorizado. |
| DD-094 | imessage-configure | 2/2/3/3 | Intermediária | US$ 22 | Diagnostica configuração e conexão do canal iMessage; não funciona por si só no Windows. |
| DD-095 | integracoes-erp-fiscal-financeiro | 5/5/5/5 | Especializada | US$ 47 | Conecta operações financeiras com idempotência, refresh concorrente e reconciliação de efeitos. |
| DD-096 | legal-response | 2/3/3/4 | Intermediária | US$ 27 | Preenche minutas por template aprovado e encaminha exceções para revisão jurídica. |
| DD-097 | legal-risk-assessment | 3/3/3/4 | Intermediária | US$ 27 | Organiza riscos com evidência, confiança e escalonamento, sem precisão estatística presumida. |
| DD-098 | m5-onboard | 4/3/4/2 | Avançada | US$ 32 | Provisiona hardware identificado, com firmware, recuperação e validação após gravação. |
| DD-099 | magnitude | 3/2/3/2 | Intermediária | US$ 22 | Avalia hardware e configura inferência local específica, com confirmação de serviço e teste. |
| DD-100 | marketing-de-conteudo-b2b | 3/4/3/5 | Avançada | US$ 32 | Planeja e produz conteúdo em vários formatos com mapa de alegações e revisão de marca. |
| DD-101 | math-olympiad | 5/3/5/3 | Especializada | US$ 37 | Organiza prova, contraexemplos e revisão matemática; não garante solução nem inclui ferramentas externas. |
| DD-102 | mcp-integration | 3/3/3/4 | Intermediária | US$ 27 | Conecta um servidor existente ao plugin, com schema, autenticação e descoberta de ferramentas. |
| DD-103 | meeting-briefing | 2/3/3/4 | Intermediária | US$ 27 | Prepara contexto e pauta a partir de fontes conflitantes, preservando compromissos confirmados. |
| DD-104 | pagamentos-recorrentes-asaas | 5/5/5/4 | Especializada | US$ 47 | Implementa assinaturas e acesso com inbox, estados financeiros e reconciliação de webhooks. |
| DD-105 | plataformas-de-ensino-online | 4/5/5/4 | Especializada | US$ 42 | Abrange área do aluno, conteúdo, progresso e controle efetivo de acesso à mídia. |
| DD-106 | playground | 3/3/3/5 | Intermediária | US$ 32 | Cria exploração HTML com controles, presets e saída consistente, testável por teclado e no celular. |
| DD-107 | plugin-settings | 3/2/3/4 | Intermediária | US$ 27 | Implementa parsing seguro e validação tipada de configuração, preservando o corpo Markdown. |
| DD-108 | plugin-structure | 3/2/3/4 | Intermediária | US$ 27 | Organiza manifestos e componentes com validação de caminhos e pacote extraído. |
| DD-109 | portfolio-de-projetos | 1/1/1/1 | Essencial | US$ 7 | Referência sanitizada de portfólio; o acervo privado e seus clientes não acompanham a edição. |
| DD-110 | power-bi-embedded-portais | 5/5/5/4 | Especializada | US$ 47 | Integra portal, identidade e relatórios com teste de isolamento entre tenants e licenciamento separado. |
| DD-111 | power-bi-modelagem-dax-performance | 5/4/5/5 | Especializada | US$ 42 | Combina reconciliação de negócio, modelagem e medição de DAX com múltiplos contextos. |
| DD-112 | power-bi-relatorios-como-codigo | 4/5/4/5 | Especializada | US$ 42 | Constrói relatórios versionados com temas, páginas e interações, verificando referências e números. |
| DD-113 | power-platform-code-first | 4/5/4/4 | Especializada | US$ 42 | Produz apps e fluxos Microsoft com importação, delegação e validação no Studio. |
| DD-114 | project-artifact | 2/2/3/3 | Intermediária | US$ 22 | Consolida status em página compartilhada; publicação depende do recurso Artifact externo. |
| DD-115 | propostas-comerciais-e-estimativas | 3/4/3/4 | Avançada | US$ 32 | Estrutura escopo e estimativa com premissas e condições sujeitas à decisão comercial. |
| DD-116 | prospeccao-b2b-linkedin | 3/4/3/5 | Avançada | US$ 32 | Organiza qualificação, mensagens e histórico com deduplicação; envio e resultado não são automáticos. |
| DD-117 | prospeccao-drivedata | 2/1/2/2 | Essencial | US$ 12 | Camada de marca e roteamento que depende da base autorizada; sobrepõe a prospecção B2B. |
| DD-118 | prototipos-e-especificacao-funcional | 4/4/4/5 | Avançada | US$ 37 | Conecta requisitos, protótipo navegável, estados e critérios de aceite sem simular backend pronto. |
| DD-119 | receipts | 2/3/3/3 | Intermediária | US$ 22 | Consolida registros locais e Git num relatório de atividade, sem inferir ROI ou aceite. |
| DD-120 | review-contract | 3/4/4/4 | Avançada | US$ 32 | Compara cláusulas com playbook e propõe redlines coerentes; revisão profissional permanece necessária. |
| DD-121 | saas-multi-tenant-supabase | 5/5/5/5 | Especializada | US$ 47 | Abrange autenticação, RLS, Storage, migrações e testes de isolamento por caminho de acesso. |
| DD-122 | security-and-hardening | 4/4/4/5 | Avançada | US$ 37 | Fortalece fronteiras de confiança e verifica controles e bypasses pertinentes ao fluxo. |
| DD-123 | security-audit | 4/4/5/4 | Especializada | US$ 37 | Revisão defensiva com escopo, achados reproduzíveis e limites de cobertura, sem certificação. |
| DD-124 | session-report | 2/3/3/3 | Intermediária | US$ 22 | Gera HTML de consumo e sessões com parsing, cobertura e tratamento de registros incompletos. |
| DD-125 | shipping-and-launch | 3/3/4/4 | Avançada | US$ 32 | Prepara lançamento, sinais de falha e recuperação com distinção entre código e dados. |
| DD-126 | siege | 5/3/5/3 | Especializada | US$ 37 | Estrutura investigação matemática em rodadas, ledger e checkpoints; orçamento e ferramentas são externos. |
| DD-127 | signature-request | 2/3/3/4 | Intermediária | US$ 27 | Prepara documento, anexos e signatários com versão conferida; conector e envio não estão implícitos. |
| DD-128 | sites-institucionais-e-seo | 4/4/4/5 | Avançada | US$ 37 | Combina conteúdo, site e captação com conferência de persistência e SEO multilíngue. |
| DD-129 | skill-development | 3/3/3/4 | Intermediária | US$ 27 | Estrutura conhecimento em pacote de skill com gatilhos, dependências e validação de links. |
| DD-130 | solo | 4/2/4/3 | Avançada | US$ 32 | Organiza prova e obrigações abertas em pesquisa direta; escopo menor que orquestração de avaliações. |
| DD-131 | telegram-access | 3/2/3/3 | Intermediária | US$ 22 | Controla acesso e IDs sem perda de precisão, com concorrência segura no plugin Telegram. |
| DD-132 | telegram-configure | 2/2/3/3 | Intermediária | US$ 22 | Configura canal e armazenamento de segredos com estados de prontidão e teste autorizado. |
| DD-133 | triage-nda | 3/3/3/4 | Intermediária | US$ 27 | Classifica desvios de NDA por cláusula e playbook; triagem não autoriza assinatura. |
| DD-134 | vendor-check | 2/3/3/4 | Intermediária | US$ 27 | Inventaria acordos, vigências e lacunas conforme cobertura das fontes realmente consultadas. |
| DD-135 | video-interaction-mapper | 3/3/4/3 | Avançada | US$ 27 | Transforma gravação em storyboard com frames, tempos e incerteza dos gatilhos no Figma. |
| DD-136 | video-programatico-reels | 4/5/4/4 | Especializada | US$ 42 | Produz vídeo com cenas, áudio e legendas, incluindo prévia e verificação técnica da mídia. |
| DD-137 | writing-hookify-rules | 3/2/3/4 | Intermediária | US$ 27 | Cria regras por evento com testes de regex, falsos positivos e suporte real ao bloqueio. |

## Próxima validação comercial

Conduzir pilotos com os dois percursos, observar primeira entrega e repetição de uso, comparar com/sem skill e testar a disposição a pagar. Não inferir preço aceito, produtividade ou demanda apenas desta matriz.
