# Revisão aplicada — edição 1.2.0

137 pacotes receberam mudanças operacionais específicas. As fontes instaladas e os ZIPs 1.1.0 foram preservados. Os novos arquivos estão em .local/releases/1.2.0; o Git contém somente patches autorais, scripts, hashes e metadados. Nenhuma operação externa descrita nas skills foi executada.

## Estados

- applied-specific: procedimento específico incorporado, casos negativos e critérios verificáveis.
- reference-split: quatro entradas extensas reorganizadas com guia detalhado e âncoras preservadas.
- original-retained-in-private-baseline: entrada conflitante ou privada substituída; original conservado fora do Git.
- execution-untested: execução integral com IA, plugins e serviços não homologada. Testes de helpers não equivalem à execução da skill.

7 links CONNECTORS foram substituídos por documentação local honesta de dependências. Contratos Figma/FigQuery agora exigem descoberta real, writes sequenciais dependentes e reconciliação de efeitos após falhas. Licenças e atribuições existentes foram preservadas; esta revisão não concede direitos comerciais. Fontes privadas não foram copiadas para este relatório.

## Aplicação individual

| Skill | Foco aplicado | Transformações adicionais | Referência de origem | Limitação remanescente |
| --- | --- | --- | --- | --- |
| DD-001 / agent-development | Definição de agente de plugin Claude Code | specific-operational-contract-and-cases | supporting-source-preserved | A validação local de estrutura não executa nem instala um agente no Claude Code. |
| DD-002 / ambiente-dev-windows | Diagnóstico de ambiente Windows | specific-operational-contract-and-cases | supporting-source-preserved | Disponibilidade de Office, Node, Python e certificados precisa ser observada na sessão atual. |
| DD-003 / automacao-documentos-office | Entrega de arquivo Office verificável | specific-operational-contract-and-cases | supporting-source-preserved | Fontes, bibliotecas e aplicativos de renderização variam entre ambientes. |
| DD-004 / brief | Briefing jurídico com rastreabilidade | local-connector-dependency | supporting-source-preserved | Conectores e fontes normativas podem não estar disponíveis; consulte CONNECTORS.md local. |
| DD-005 / build-mcp-app | Widget MCP compatível com o host | specific-operational-contract-and-cases | supporting-source-preserved | A validação do contrato local não demonstra compatibilidade com todos os clientes MCP. |
| DD-006 / build-mcp-server | Servidor MCP com superfície delimitada | specific-operational-contract-and-cases | supporting-source-preserved | Servidor e testes de contrato não fornecem credenciais ou compatibilidade automática com o host. |
| DD-007 / build-mcpb | Pacote local sem sandbox implícito | specific-operational-contract-and-cases | supporting-source-preserved | O sistema de destino e componentes nativos precisam de validação própria. |
| DD-008 / cardputer-buddy | Iteração de aplicativo em dispositivo provisionado | specific-operational-contract-and-cases | supporting-source-preserved | Depende do dispositivo compatível, bundle e acesso serial reais. |
| DD-009 / claude-acta-drivedata | Ata baseada em transcrição | align-supporting-runtime-guidance | supporting-source-preserved | Template e ferramentas de conversão precisam existir e ser autorizados. |
| DD-010 / claude-automation-recommender | Recomendação baseada no repositório | specific-operational-contract-and-cases | supporting-source-preserved | Recomendação não instala integração nem comprova ganho operacional. |
| DD-011 / claude-bi-documentation | Documentação de modelo com cobertura conferida | align-supporting-runtime-guidance | supporting-source-preserved | PBIP/PBIR/TMDL acessíveis e renderização são dependências, não recursos instalados pela skill. |
| DD-012 / claude-built-in-browser | Leitura no navegador integrado compatível | align-supporting-runtime-guidance | supporting-source-preserved | O fluxo original é do navegador integrado Claude; outro host exige adaptação de ferramentas. |
| DD-013 / claude-chrome-browser | Navegação autorizada com confirmação observável | align-supporting-runtime-guidance | supporting-source-preserved | Depende da extensão Claude in Chrome conectada e autorizada. |
| DD-014 / claude-cloud-code-architecture | Arquitetura orientada a contratos e falhas | align-supporting-runtime-guidance | supporting-source-preserved | Desenho arquitetural não prova que infraestrutura, filas ou observabilidade estão implantadas. |
| DD-015 / claude-computer-use | Controle de desktop por capacidades reais | align-supporting-runtime-guidance | supporting-source-preserved | Permissões, sistemas de arquivos e APIs variam conforme o host. |
| DD-016 / claude-computer-use-staging | Variante de controle de desktop | align-supporting-runtime-guidance | supporting-source-preserved | A equivalência documental não substitui teste no host compatível. |
| DD-017 / claude-deep-research | Pesquisa com escopo e evidência | align-supporting-runtime-guidance | supporting-source-preserved | Acesso web e coordenação de agentes precisam estar disponíveis; não há execução presumida. |
| DD-018 / claude-docs | Encaminhamento honesto ao conector de documentos | align-supporting-runtime-guidance | supporting-source-preserved | Este material encaminha ao conector e não é gerador autônomo de documentos. |
| DD-019 / claude-docx | Edição Word com estrutura preservada | align-supporting-runtime-guidance | supporting-source-preserved | Bibliotecas e renderizadores têm limites; declare verificações não realizadas. |
| DD-020 / claude-google-workspace | Edição colaborativa com controle de revisão | align-supporting-runtime-guidance | supporting-source-preserved | Conectores Google variam em capacidades e permissões. |
| DD-021 / claude-import-memory | Importação de contexto duradouro | align-supporting-runtime-guidance | supporting-source-preserved | O fluxo depende de memória Claude; Codex e outros produtos precisam de mecanismo próprio. |
| DD-022 / claude-maia | Inventário de referência restrita | update-specific-trigger; sanitized-parameterized-edition; align-supporting-runtime-guidance | original-retained-in-private-baseline | Edição sanitizada de inventário; funções operacionais privadas não são distribuídas. |
| DD-023 / claude-marketplace-skill-creator | Autoria e avaliação de skill | extract-progressive-reference-preserve-anchors; align-supporting-runtime-guidance | reference-split | Avaliação automatizada depende do runtime e ferramentas; não foi executada por esta revisão. |
| DD-024 / claude-md-improver | Revisão de instruções de repositório | specific-operational-contract-and-cases | supporting-source-preserved | Depende do repositório acessível e da revisão prevista no fluxo. |
| DD-025 / claude-messi-knowledge-ingest | Ingestão versionada e rastreável | update-specific-trigger; sanitized-parameterized-edition; align-supporting-runtime-guidance | original-retained-in-private-baseline | Taxonomia, destinos e fluxo n8n de origem precisam de adaptação autorizada. |
| DD-026 / claude-morning | Panorama diário com data e lacunas | align-supporting-runtime-guidance | supporting-source-preserved | O panorama depende de fontes autorizadas e não garante cobertura da rotina inteira. |
| DD-027 / claude-oraculo | Análise exploratória de carteira | update-specific-trigger; sanitized-parameterized-edition; align-supporting-runtime-guidance | original-retained-in-private-baseline | Depende de campos e histórico; esta edição elimina promessas não comprovadas do material de origem. |
| DD-028 / claude-pbip | Estrutura e conversão de projeto Power BI | align-supporting-runtime-guidance | supporting-source-preserved | Conversão e verificação dependem do tipo de arquivo e do Desktop compatível. |
| DD-029 / claude-pbir-expert | Edição PBIR com referências preservadas | align-supporting-runtime-guidance | supporting-source-preserved | Esquemas e Desktop compatíveis são necessários para validação completa. |
| DD-030 / claude-pbir-format | Formatação PBIR por camada correta | align-supporting-runtime-guidance | supporting-source-preserved | Ferramentas e suporte ao formato precisam ser detectados. |
| DD-031 / claude-pdf | Extração PDF com conferência de página | align-supporting-runtime-guidance | supporting-source-preserved | OCR e renderização exigem ferramentas disponíveis e revisão proporcional à complexidade. |
| DD-032 / claude-power-bi-best-practices | Auditoria BPA com cobertura declarada | align-supporting-runtime-guidance | supporting-source-preserved | Regras e métricas são contextuais; revisão estática não garante ganho de velocidade. |
| DD-033 / claude-power-bi-data-analysis | Definição verificável de métricas | align-supporting-runtime-guidance | supporting-source-preserved | Análise depende de dados e definição do negócio; exemplos não são resultados do cliente. |
| DD-034 / claude-power-bi-dax-optimization | Reescrita DAX com equivalência | align-supporting-runtime-guidance | supporting-source-preserved | Modelo e ferramentas de medição precisam estar disponíveis. |
| DD-035 / claude-power-query-best-practices | Consulta M com fonte e fronteiras verificadas | align-supporting-runtime-guidance | supporting-source-preserved | Folding e incremental dependem da fonte e das operações efetivas. |
| DD-036 / claude-powerbi-html-visuals | HTML em Power BI com capacidades delimitadas | align-supporting-runtime-guidance | supporting-source-preserved | Edição ao vivo pode exigir MCP e o hospedeiro impõe limites próprios. |
| DD-037 / claude-pptx | Apresentação editável com regressão visual | align-supporting-runtime-guidance | supporting-source-preserved | Animações, fontes e masters precisam de validação no aplicativo de destino. |
| DD-038 / claude-protheus-expert | Correção Protheus contextualizada | align-supporting-runtime-guidance | supporting-source-preserved | Ambiente, documentação oficial e homologação são indispensáveis. |
| DD-039 / claude-security | Revisão pelo plugin disponível | specific-operational-contract-and-cases | supporting-source-preserved | Os componentes do plugin Claude Security precisam ser fornecidos pelo host. |
| DD-040 / claude-skill-creator | Autoria com avaliações separadas | extract-progressive-reference-preserve-anchors; align-supporting-runtime-guidance | reference-split | Ferramentas do host e revisão humana continuam necessárias. |
| DD-041 / claude-tmdl | Edição textual como último recurso | align-supporting-runtime-guidance | supporting-source-preserved | Validação completa exige ferramentas compatíveis com o modelo. |
| DD-042 / claude-xlsx | Planilha com motor de cálculo declarado | align-supporting-runtime-guidance | supporting-source-preserved | Excel e LibreOffice podem divergir no suporte a funções avançadas. |
| DD-043 / claude-xlsx-staging | Variante de planilha com contrato equivalente | align-supporting-runtime-guidance | supporting-source-preserved | A equivalência documental não comprova compatibilidade de execução. |
| DD-044 / code-review-and-quality | Achados reproduzíveis e proporcionais | specific-operational-contract-and-cases | supporting-source-preserved | Cobertura depende do código e contexto acessíveis. |
| DD-045 / command-development | Comando com argumento e escopo | specific-operational-contract-and-cases | supporting-source-preserved | Convenções são específicas do Claude Code e da versão instalada. |
| DD-046 / compliance-check | Triagem jurídica preliminar | local-connector-dependency | supporting-source-preserved | Panoramas regulatórios envelhecem e conectores podem faltar; consulte CONNECTORS.md. |
| DD-047 / cowork-plugin-customizer | Customização com pacote conferível | specific-operational-contract-and-cases | supporting-source-preserved | Conectores de conhecimento e runtime Cowork precisam existir. |
| DD-048 / create-cowork-plugin | Plugin com contratos de ativação | specific-operational-contract-and-cases | supporting-source-preserved | Dependências e conectores não são instalados pelo Markdown. |
| DD-049 / debugging-and-error-recovery | Diagnóstico com runner descoberto | replace-mixed-runner-flags | supporting-source-preserved | Comandos devem respeitar o script e a versão do runner do projeto. |
| DD-050 / design-de-interface-autoral | Design autoral com critérios observáveis | specific-operational-contract-and-cases | supporting-source-preserved | Originalidade depende do contexto; nenhum estilo garante qualidade por si só. |
| DD-051 / discord-access | Política de acesso sem perda concorrente | replace-unguarded-access-overwrites; align-supporting-runtime-guidance | supporting-source-preserved | Depende do servidor, formato do estado e mecanismo real de exclusão mútua. |
| DD-052 / discord-configure | Configuração sem exposição de token | remove-secret-argument-trigger; replace-conflicting-entry; align-supporting-runtime-guidance | original-retained-in-private-baseline | Configuração armazenada não comprova conexão ou servidor ativo. |
| DD-053 / estilo-de-colaboracao | Preferências declaradas por sessão | update-specific-trigger; sanitized-parameterized-edition | original-retained-in-private-baseline | Esta edição parametrizada não distribui histórico identificável da fonte privada. |
| DD-054 / example-command | Comando demonstrativo sem efeitos | update-specific-trigger; replace-conflicting-entry | original-retained-in-private-baseline | Exemplo educacional, não automação de negócio. |
| DD-055 / example-skill | Template com limites testáveis | specific-operational-contract-and-cases | supporting-source-preserved | Template depende de autoria e validação posteriores. |
| DD-056 / figma-code-connect | Mapeamento com instâncias não conectadas explícitas | unify-unmapped-instance-policy | supporting-source-preserved | Formato parserless e APIs dependem da versão e do backend disponível. |
| DD-057 / figma-code-connect-figquery | Mapeamento no adaptador FigQuery | unify-unmapped-instance-policy; align-supporting-runtime-guidance | supporting-source-preserved | Sem adaptador compatível, o fluxo operacional fica pendente. |
| DD-058 / figma-code-workflows | Importação com destino disponível | specific-operational-contract-and-cases | supporting-source-preserved | Importação depende de capacidades da conta e do host. |
| DD-059 / figma-create-new-file | Criação sem duplicar após resposta perdida | specific-operational-contract-and-cases | supporting-source-preserved | Reconciliar depende de listagem/status oferecido pelo backend. |
| DD-060 / figma-create-new-file-figquery | Criação por contrato FigQuery | align-supporting-runtime-guidance | supporting-source-preserved | Exige backend com criação e consulta de arquivo documentadas. |
| DD-061 / figma-design-to-code | Implementação com estados e acessibilidade | specific-operational-contract-and-cases | supporting-source-preserved | Contexto de design e ambiente de execução precisam estar disponíveis. |
| DD-062 / figma-design-to-code-figquery | Design para código com leitura compatível | align-supporting-runtime-guidance | supporting-source-preserved | Equivalência do adaptador e execução do aplicativo precisam ser verificadas. |
| DD-063 / figma-generate-design | Tela editável com design system | extract-progressive-reference-preserve-anchors; align-supporting-runtime-guidance | reference-split | Ferramentas de captura e escrita dependem do host e do arquivo. |
| DD-064 / figma-generate-design-figquery | Montagem FigQuery sem atomicidade presumida | remove-universal-atomicity; align-supporting-runtime-guidance | supporting-source-preserved | Atomicidade e retry pertencem ao contrato observado do backend. |
| DD-065 / figma-generate-diagram | Diagrama com arestas conferidas | align-supporting-runtime-guidance | supporting-source-preserved | Geração e inspeção dependem das ferramentas de diagrama/FigJam disponíveis. |
| DD-066 / figma-generate-diagram-figquery | Diagrama por capacidades FigJam | align-supporting-runtime-guidance | supporting-source-preserved | O backend precisa declarar capacidades por editor. |
| DD-067 / figma-generate-library | Biblioteca com ledger reconciliado | align-supporting-runtime-guidance | supporting-source-preserved | Identidades e estado precisam de leitura atual do backend. |
| DD-068 / figma-generate-library-figquery | Biblioteca FigQuery proporcional ao escopo | remove-artificial-call-minimum; replace-full-library-mandate; align-supporting-runtime-guidance | supporting-source-preserved | Builder e APIs da biblioteca devem ser confirmados no backend. |
| DD-069 / figma-generative-plugins | Plugin testado no editor | specific-operational-contract-and-cases | supporting-source-preserved | Testes reais dependem do editor e das permissões. |
| DD-070 / figma-generative-plugins-figquery | Plugin no adaptador compatível | align-supporting-runtime-guidance | supporting-source-preserved | A variante não fornece por si o backend de plugins. |
| DD-071 / figma-implement-motion | Movimento com inventário completo | align-supporting-runtime-guidance | supporting-source-preserved | Contexto de movimento e execução temporal precisam estar disponíveis. |
| DD-072 / figma-implement-motion-figquery | Movimento com assets duráveis | persist-temporary-assets; align-supporting-runtime-guidance | supporting-source-preserved | Persistência depende de autorização sobre os assets e do ambiente de destino. |
| DD-073 / figma-shaders | Shader com validade visual separada | specific-operational-contract-and-cases | supporting-source-preserved | Shader e controles dependem do runtime gráfico disponível. |
| DD-074 / figma-shaders-figquery | Shader com migração de controles | align-supporting-runtime-guidance | supporting-source-preserved | Backend e instâncias acessíveis determinam o que pode ser validado. |
| DD-075 / figma-spec | Edição de spec sem perda concorrente | specific-operational-contract-and-cases | supporting-source-preserved | Sem escrita condicional, coordenação com outros editores pode ser necessária. |
| DD-076 / figma-swiftui | Tradução entre Figma e SwiftUI | update-specific-trigger; narrow-figma-swiftui-trigger; align-supporting-runtime-guidance | supporting-source-preserved | Exige ferramentas de leitura e ambiente SwiftUI apropriados. |
| DD-077 / figma-swiftui-figquery | SwiftUI com símbolos suportados | update-specific-trigger; narrow-figma-swiftui-trigger; align-supporting-runtime-guidance | supporting-source-preserved | Capacidades variam entre backend FigQuery e runtime SwiftUI. |
| DD-078 / figma-use | Mutação de canvas com concorrência controlada | serialize-shared-document-writes; align-supporting-runtime-guidance | supporting-source-preserved | Concorrência, contexto e atomicidade são propriedades do runtime efetivo. |
| DD-079 / figma-use-figjam | FigJam descoberto por capacidades | align-supporting-runtime-guidance | supporting-source-preserved | Receitas dependem das APIs reais de FigJam. |
| DD-080 / figma-use-figjam-figquery | FigJam com builder e raw delimitados | align-supporting-runtime-guidance | supporting-source-preserved | Exige matriz de capacidades por editor e versão do backend. |
| DD-081 / figma-use-figquery | Contrato único de leitura e builder | replace-conflicting-read-and-retry-rules; align-supporting-runtime-guidance | supporting-source-preserved | Este arquivo não instala $fig nem traduz automaticamente APIs de outro backend. |
| DD-082 / figma-use-motion | Movimento com evidência temporal | align-supporting-runtime-guidance | supporting-source-preserved | Observação temporal depende do editor e ferramentas disponíveis. |
| DD-083 / figma-use-motion-figquery | Motion FigQuery com capacidades versionadas | remove-fixed-feature-flag; align-supporting-runtime-guidance | supporting-source-preserved | Recursos variam conforme backend, conta e versão. |
| DD-084 / figma-use-slides | Slides com retorno e geometria conferidos | fix-slides-lifecycle; align-supporting-runtime-guidance | supporting-source-preserved | Ferramentas e APIs de Slides precisam ser confirmadas. |
| DD-085 / figma-use-slides-figquery | Slides no lifecycle FigQuery | fix-slides-lifecycle; align-supporting-runtime-guidance | supporting-source-preserved | A validação estática não comprova execução das receitas no backend. |
| DD-086 / frontend-design | Decisões visuais fundamentadas | specific-operational-contract-and-cases | supporting-source-preserved | Qualidade visual exige contexto e revisão, não um estilo universal. |
| DD-087 / fullstack-nextjs-vercel | Implementação com versões verificadas | specific-operational-contract-and-cases | supporting-source-preserved | Rede, conta e serviços externos precisam de autorização e ferramentas disponíveis. |
| DD-088 / generate-project-plan | Plano FigJam com escopo e recuperação | repair-invalid-hex; remove-plan-atomicity-assumption | supporting-source-preserved | Construção depende do backend FigJam e evidência de estado. |
| DD-089 / gestao-de-entregas-e-homologacao | Release com compatibilidade de dados | correct-rollback-causality | supporting-source-preserved | Aceite e publicação dependem da autorização e evidência de cada entrega. |
| DD-090 / git-workflow-and-versioning | Git sem identidade pessoal embutida | update-specific-trigger; sanitized-parameterized-edition | original-retained-in-private-baseline | Edição parametrizada sem perfil pessoal da fonte original. |
| DD-091 / hook-development | Hook com versão e evento verificados | specific-operational-contract-and-cases | supporting-source-preserved | Execução depende da versão e dos recursos do host. |
| DD-092 / ia-aplicada-a-produtos | IA com roteamento de dados autorizado | remove-universal-hosting-threshold | supporting-source-preserved | Integração depende de políticas e credenciais reais; modelos citados precisam de reconfirmação. |
| DD-093 / imessage-access | Estado de acesso com conflito detectado | replace-unguarded-access-overwrites; align-supporting-runtime-guidance | supporting-source-preserved | É necessário controle real do escritor ou uma API de mutação consistente. |
| DD-094 / imessage-configure | Prontidão em estados independentes | align-supporting-runtime-guidance | supporting-source-preserved | Depende de macOS, permissões e plugin compatível. |
| DD-095 / integracoes-erp-fiscal-financeiro | Integração recuperável | specific-operational-contract-and-cases | supporting-source-preserved | Contratos e estados dependem do ERP e provedor atual. |
| DD-096 / legal-response | Resposta vinculada a template aprovado | local-connector-dependency | supporting-source-preserved | Conectores e revisão profissional são dependências; consulte CONNECTORS.md. |
| DD-097 / legal-risk-assessment | Risco jurídico com evidência e confiança | specific-operational-contract-and-cases | supporting-source-preserved | Classificação preliminar não substitui avaliação jurídica qualificada. |
| DD-098 / m5-onboard | Firmware com identificação positiva | require-positive-board-identification | supporting-source-preserved | Hardware, porta e ferramentas de provisionamento precisam ser compatíveis. |
| DD-099 / magnitude | Inferência local com pré-checagem | specific-operational-contract-and-cases | supporting-source-preserved | Exige CLI e hardware compatíveis, além de modelo autorizado. |
| DD-100 / marketing-de-conteudo-b2b | Conteúdo com alegações rastreáveis | specific-operational-contract-and-cases | supporting-source-preserved | Publicação depende de autorização e dados comerciais atualizados. |
| DD-101 / math-olympiad | Prova com obrigações explícitas | specific-operational-contract-and-cases | supporting-source-preserved | Orçamento e ferramentas limitam a busca; nenhum método garante resolver todo problema. |
| DD-102 / mcp-integration | Transporte MCP aceito pelo host | specific-operational-contract-and-cases | supporting-source-preserved | Compatibilidade precisa ser confirmada na documentação e versão reais. |
| DD-103 / meeting-briefing | Preparação com conflitos visíveis | specific-operational-contract-and-cases | supporting-source-preserved | Cobertura depende dos conectores e documentos acessíveis. |
| DD-104 / pagamentos-recorrentes-asaas | Cobrança com estado e recuperação | specific-operational-contract-and-cases | supporting-source-preserved | Máquina de estados deve seguir o contrato atual do provedor e regras do produto. |
| DD-105 / plataformas-de-ensino-online | Conteúdo protegido no servidor | specific-operational-contract-and-cases | supporting-source-preserved | Streaming e armazenamento precisam suportar a política de acesso definida. |
| DD-106 / playground | Interação acessível e copiável | specific-operational-contract-and-cases | supporting-source-preserved | Validação de acessibilidade exige uso real do artefato, além de inspeção de HTML. |
| DD-107 / plugin-settings | Configuração YAML validada | replace-conflicting-entry; replace-shell-yaml-parsing | original-retained-in-private-baseline | Parser depende de Python e PyYAML; ausência deve ser relatada, não contornada com parsing frágil. |
| DD-108 / plugin-structure | Manifesto e pacote em correspondência | specific-operational-contract-and-cases | supporting-source-preserved | Schema do manifesto depende da versão Claude Code. |
| DD-109 / portfolio-de-projetos | Portfólio a partir de fonte autorizada | update-specific-trigger; sanitized-parameterized-edition | original-retained-in-private-baseline | Sem fonte autorizada, entregue estrutura de catálogo sem inventar cases. |
| DD-110 / power-bi-embedded-portais | Embedded com teste negativo de tenant | specific-operational-contract-and-cases | supporting-source-preserved | Exige configuração Power BI/Entra, capacidade e credenciais adequadas. |
| DD-111 / power-bi-modelagem-dax-performance | Métricas equivalentes e desempenho medido | specific-operational-contract-and-cases | supporting-source-preserved | Modelo, dados e ferramentas de medição precisam ser acessíveis. |
| DD-112 / power-bi-relatorios-como-codigo | Regeneração com referências preservadas | specific-operational-contract-and-cases | supporting-source-preserved | Compatibilidade depende da versão e do formato do projeto. |
| DD-113 / power-platform-code-first | Exportação e importação versionadas | specific-operational-contract-and-cases | supporting-source-preserved | Studio, ambiente sandbox e conectores precisam estar disponíveis. |
| DD-114 / project-artifact | Status publicado somente com ferramenta real | specific-operational-contract-and-cases | supporting-source-preserved | Runtime e login do produto de origem podem não existir em outro assistente. |
| DD-115 / propostas-comerciais-e-estimativas | Estimativa com premissas e revisão | specific-operational-contract-and-cases | supporting-source-preserved | Valores dependem de escopo, contexto e aprovação comercial atuais. |
| DD-116 / prospeccao-b2b-linkedin | Prospecção com fonte e deduplicação | specific-operational-contract-and-cases | supporting-source-preserved | Limites da plataforma e oferta comercial precisam ser atualizados. |
| DD-117 / prospeccao-drivedata | Oferta canônica antes da abordagem | update-specific-trigger; sanitized-parameterized-edition | original-retained-in-private-baseline | Esta edição não inclui a base comercial privada e não envia mensagens por conta própria. |
| DD-118 / prototipos-e-especificacao-funcional | Protótipo com estados rastreáveis | specific-operational-contract-and-cases | supporting-source-preserved | Protótipo demonstra fluxo e contrato, não integração operacional por si só. |
| DD-119 / receipts | Relatório de uso com exportação redigida | specific-operational-contract-and-cases | supporting-source-preserved | Coleta depende dos logs locais e formatos disponíveis. |
| DD-120 / review-contract | Redline coerente com contrato inteiro | local-connector-dependency | supporting-source-preserved | Conectores e revisão qualificada são necessários; consulte CONNECTORS.md. |
| DD-121 / saas-multi-tenant-supabase | Isolamento e migração testados | specific-operational-contract-and-cases | supporting-source-preserved | Depende de projeto, roles e ambiente de teste autorizado. |
| DD-122 / security-and-hardening | Controles pelo caminho de dados | specific-operational-contract-and-cases | supporting-source-preserved | Verificação depende do código e do ambiente autorizado. |
| DD-123 / security-audit | Auditoria com modo e dependências | align-supporting-runtime-guidance | supporting-source-preserved | Provas de exploração exigem ambiente autorizado e limites definidos. |
| DD-124 / session-report | Parser com cobertura e redação | specific-operational-contract-and-cases | supporting-source-preserved | Formatos de logs variam e precisam de fixtures por versão. |
| DD-125 / shipping-and-launch | Lançamento com sinais e recuperação | specific-operational-contract-and-cases | supporting-source-preserved | Publicação depende de autorização e serviços conectados. |
| DD-126 / siege | Busca de prova com orçamento executável | extract-progressive-reference-preserve-anchors | reference-split | Orquestração requer ferramentas do host; esta revisão não executou busca matemática. |
| DD-127 / signature-request | Assinatura vinculada ao pacote aprovado | local-connector-dependency | supporting-source-preserved | Exige conector e autoridade de assinatura; consulte CONNECTORS.md. |
| DD-128 / sites-institucionais-e-seo | Lead confirmado no destino | specific-operational-contract-and-cases | supporting-source-preserved | Destino e publicação precisam estar conectados e autorizados. |
| DD-129 / skill-development | Skill com ficha de compatibilidade | specific-operational-contract-and-cases | supporting-source-preserved | Compatibilidade depende do host e das capacidades reais. |
| DD-130 / solo | Notas de prova sem contaminação | specific-operational-contract-and-cases | supporting-source-preserved | Limites de tempo e ferramentas podem impedir conclusão. |
| DD-131 / telegram-access | Acesso com IDs e autoridade explícitos | replace-unguarded-access-overwrites; align-supporting-runtime-guidance | supporting-source-preserved | Atualização segura exige controle real de concorrência do servidor. |
| DD-132 / telegram-configure | Token protegido e status mínimo | remove-secret-argument-trigger; replace-conflicting-entry; align-supporting-runtime-guidance | original-retained-in-private-baseline | Arquivo de token existente não comprova conexão operacional. |
| DD-133 / triage-nda | Classificação NDA sem aprovação implícita | local-connector-dependency | supporting-source-preserved | Depende de playbook e revisão profissional; consulte CONNECTORS.md. |
| DD-134 / vendor-check | Busca de acordo com cobertura declarada | local-connector-dependency | supporting-source-preserved | Conectores e cobertura limitam a conclusão; consulte CONNECTORS.md. |
| DD-135 / video-interaction-mapper | Vídeo com ferramentas e destino conferidos | dedicated-python-environment | supporting-source-preserved | Ferramentas de vídeo e backend Figma precisam estar disponíveis. |
| DD-136 / video-programatico-reels | Renderização com pré-voo e verificação | specific-operational-contract-and-cases | supporting-source-preserved | Capacidade de disco, codecs e renderizadores variam entre ambientes. |
| DD-137 / writing-hookify-rules | Regra testada no evento correto | specific-operational-contract-and-cases | supporting-source-preserved | Semântica de eventos e ações depende do Hookify instalado. |

## Reprodução

1. Disponibilize os ZIPs e manifests íntegros 1.1.0 em .local/releases/1.1.0.
2. Execute node scripts/upgrade-skills.cjs. O diretório de originais pode ser informado por SKILL_SOURCE_ROOT.
3. Execute node scripts/validate-upgraded-skills.cjs e node --test tests/skill-upgrades.test.cjs.
4. Confira hashes e relatório antes de qualquer sincronização global ou publicação.

Sincronização global, banco, publicação e homologação de integrações não foram realizadas por este script.

## Verificação executada nesta preparação

- `node scripts/validate-upgraded-skills.cjs`: 137 pacotes aprovados em integridade, mudanças de fonte e links locais; sete CONNECTORS presentes e quatro entradas extensas reorganizadas.
- `node --test tests/skill-upgrades.test.cjs`: 10 testes aprovados, sem falhas. Cobrem geração determinística, rejeição de baseline adulterada, licenças, omissão de referências privadas, tokens, argumento tratado como dado, frontmatter, inventário, conflito de escrita, JSONL parcial e parsing YAML seguro.
- Sintaxe dos scripts Node e Python: válida. O teste YAML foi executado com PyYAML 6.0.3, sem instalar pacotes globais.
- SHA-256 das 137 fontes instaladas conferido novamente após a preparação: nenhuma modificação. Os 137 ZIPs 1.1.0 continuam idênticos à auditoria de origem.
- Mapeamento exato dos caminhos privados omitidos: somente em `.local/releases/1.2.0/PROVENANCE.local.json`, fora do Git e dos pacotes distribuídos. Os manifests públicos usam identificadores redigidos e hashes.

Estes resultados são testes estáticos e de helpers locais. Não comprovam execução integral das 137 skills por IA, comportamento de conectores, compilação de plugins remotos ou homologação de plataformas externas.

Em checkouts sem os arquivos privados, os quatro testes que dependem dos ZIPs são explicitamente ignorados com motivo; o teste Python também informa dependência ausente sem instalar nada. Nesta preparação, os 10 testes foram executados, sem testes ignorados.
