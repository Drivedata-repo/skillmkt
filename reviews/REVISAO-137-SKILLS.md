# Revisão individual das 137 skills — DriveData Deck

Leitura das instruções originais, revisão editorial por skill e inspeção estática dos pacotes 1.1.0. Os arquivos instalados foram comparados com os SKILL.md distribuídos, considerando apenas a normalização de caminhos pessoais; as 137 fontes coincidem.

## O que foi verificado

- 137 arquivos SKILL.md lidos, um por um, para entender finalidade, procedimento e dependências.
- 137 pacotes conferidos contra o SHA-256 da versão distribuída.
- Frontmatter, tamanho, referências Markdown locais e menções a ferramentas de plataforma inspecionados.
- Uma melhoria específica, evidência, proposta de alteração e cenário de validação registrados para cada skill.

A revisão é estática. Cenários fictícios são propostas de teste; não comprovam execução por IA, compatibilidade universal ou resultados de negócio. As alterações abaixo estão propostas: os ZIPs 1.1.0 e as skills globais não foram sobrescritos por esta auditoria.

## Prioridades

| Prioridade | Skills |
|---|---:|
| Alta | 64 |
| Média | 69 |
| Baixa | 4 |

Todos os 137 frontmatters têm nome e descrição. 7 skills fazem referência local a um CONNECTORS.md externo ao pacote. 4 arquivos principais ultrapassam 5.000 palavras. Um texto longo não é, por si só, um defeito; deve-se avaliar se referências separadas melhoram a ativação e reduzem leitura desnecessária.

### Referências que não acompanham o ZIP

- DD-004 / brief: `../../CONNECTORS.md`. Proposta: incorporar a referência autorizada ou documentar a dependência do plugin de origem. Depois, conferir os links a partir da pasta extraída, sem depender de diretórios externos.

- DD-046 / compliance-check: `../../CONNECTORS.md`. Proposta: incorporar a referência autorizada ou documentar a dependência do plugin de origem. Depois, conferir os links a partir da pasta extraída, sem depender de diretórios externos.

- DD-096 / legal-response: `../../CONNECTORS.md`. Proposta: incorporar a referência autorizada ou documentar a dependência do plugin de origem. Depois, conferir os links a partir da pasta extraída, sem depender de diretórios externos.

- DD-120 / review-contract: `../../CONNECTORS.md`. Proposta: incorporar a referência autorizada ou documentar a dependência do plugin de origem. Depois, conferir os links a partir da pasta extraída, sem depender de diretórios externos.

- DD-127 / signature-request: `../../CONNECTORS.md`. Proposta: incorporar a referência autorizada ou documentar a dependência do plugin de origem. Depois, conferir os links a partir da pasta extraída, sem depender de diretórios externos.

- DD-133 / triage-nda: `../../CONNECTORS.md`. Proposta: incorporar a referência autorizada ou documentar a dependência do plugin de origem. Depois, conferir os links a partir da pasta extraída, sem depender de diretórios externos.

- DD-134 / vendor-check: `../../CONNECTORS.md`. Proposta: incorporar a referência autorizada ou documentar a dependência do plugin de origem. Depois, conferir os links a partir da pasta extraída, sem depender de diretórios externos.

### Arquivos principais extensos

- DD-023 / claude-marketplace-skill-creator: 5151 palavras no corpo. Avaliar a separação de detalhes e exemplos, mantendo fluxo, critérios de ativação e links no SKILL.md.

- DD-040 / claude-skill-creator: 5651 palavras no corpo. Avaliar a separação de detalhes e exemplos, mantendo fluxo, critérios de ativação e links no SKILL.md.

- DD-063 / figma-generate-design: 5155 palavras no corpo. Avaliar a separação de detalhes e exemplos, mantendo fluxo, critérios de ativação e links no SKILL.md.

- DD-126 / siege: 12830 palavras no corpo. Avaliar a separação de detalhes e exemplos, mantendo fluxo, critérios de ativação e links no SKILL.md.

## Sequência sugerida para alterar as próprias skills

1. Resolver referências ausentes e conflitos de ferramentas antes de ampliar a oferta de execução.
2. Corrigir instruções que prometem atomicidade, paralelismo ou disponibilidade de ferramentas sem verificar o runtime.
3. Melhorar os gatilhos e limites entre variantes, mantendo os identificadores estáveis.
4. Aplicar as propostas abaixo em cópias versionadas; validar links e cenários positivos e negativos.
5. Publicar uma nova versão somente após a conferência adequada ao ambiente. Preservar autoria, licenças, hashes e a versão anterior.

## Fichas individuais

### DD-001 — Agentes especializados para rotinas de desenvolvimento

Identificador: `agent-development` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Estrutura frontmatter, exemplos de ativação e ferramentas mínimas tornam o contrato do agente legível.

**Ponto de melhoria:** Acrescentar validação executável do arquivo e testes negativos de ativação para impedir que uma descrição ampla capture tarefas fora do escopo.

**Evidência na fonte:** Seções “Frontmatter Fields”, “System Prompt Design” e “Creating Agents”.

**Alteração sugerida:** Adicionar um exemplo de validador de YAML e uma matriz de pedidos que devem e não devem ativar o agente; registrar dependência do runtime Claude Code.

**Cenário candidato de validação:** O revisor de leitura. Projeto fictício: um plugin precisa analisar diffs e apontar riscos, sem alterar o repositório.

**Entrega a conferir:** Arquivo de definição do agente e roteiro de teste de ativação, sujeitos à validação no plugin.

**Critério de conferência:** Confira se nenhuma ferramenta de escrita foi concedida e se os exemplos distinguem revisão de implementação.

**Rastreabilidade:** SKILL.md com 402 linhas e 1541 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `6a2826571320828cc6f8f21ccd8e6eefd2bced62000c8c5e43a712c12e2d83a1`.

### DD-002 — Preparação do ambiente de desenvolvimento

Identificador: `ambiente-dev-windows` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue comandos executados pelo agente dos comandos copiados pelo usuário e protege segredos e TLS.

**Ponto de melhoria:** Separar o inventário histórico da máquina de uma descoberta obrigatória do ambiente atual, evitando presumir caminhos e programas instalados.

**Evidência na fonte:** Seções “Comando para o usuário colar (sempre)”, “Armadilhas conhecidas” e “Regras que mudaram”.

**Alteração sugerida:** Introduzir um bloco de descoberta com Get-Command e Test-Path antes das receitas; rotular referências à máquina original como exemplos e manter a proibição de desabilitar TLS.

**Cenário candidato de validação:** O comando na pasta errada. Cenário fictício: um projeto Node em [PASTA_PROJETO] apresenta erro de certificado ao instalar dependências.

**Entrega a conferir:** Diagnóstico de ambiente com hipóteses verificáveis e uma sequência de comandos contextualizada.

**Critério de conferência:** Verifique se cada comando indica a pasta correta e mantém a validação de certificados ativa.

**Rastreabilidade:** SKILL.md com 131 linhas e 1364 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `4c4b8a0e05287f12723906cb6ca733da2e7b2e248c738a223b1028fb5e4f6f7d`.

### DD-003 — Documentos e planilhas sem retrabalho

Identificador: `automacao-documentos-office` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Trata documentos como entregáveis que precisam abrir, recalcular e ser inspecionados, preservando alterações existentes.

**Ponto de melhoria:** Tornar explícita a seleção do motor de validação por formato e o registro da diferença entre arquivo gerado e arquivo realmente renderizado.

**Evidência na fonte:** Seções “Fluxo de trabalho recomendado”, “Armadilhas conhecidas” e “Checklist de entrega”.

**Alteração sugerida:** Adicionar matriz DOCX/XLSX/PPTX/PDF com ferramenta preferida, alternativa disponível e evidência mínima; identificar Word COM como dependente de Windows e Office instalado.

**Cenário candidato de validação:** Um pacote, uma fonte. Exemplo fictício: pedidos A=120, B=80 e C=50 devem aparecer em uma tabela Word e em uma planilha.

**Entrega a conferir:** Dois arquivos previstos com os mesmos pedidos e total de 250, acompanhados das verificações realizadas.

**Critério de conferência:** Compare os valores entre os formatos e confira se o total da planilha vem de uma fórmula.

**Rastreabilidade:** SKILL.md com 115 linhas e 1158 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `0d63703d40850ee7db3d68024f27f0a5f98e62ac176f86d1d29b79d216814142`.

### DD-004 — Briefing operacional para equipes jurídicas

Identificador: `brief` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Organiza briefing jurídico por urgência, contratos, solicitações e fontes indisponíveis.

**Ponto de melhoria:** Vincular cada pendência a fonte e data de consulta, separando prazos expressos dos inferidos em mensagens ou documentos.

**Evidência na fonte:** Seções “Sources to Scan”, “Sources Not Available” e “Daily Legal Brief -- [Date]”.

**Alteração sugerida:** Acrescentar colunas fonte, data consultada, responsável confirmado e prazo literal; exigir revisão profissional e fonte normativa atual quando houver interpretação jurídica.

**Cenário candidato de validação:** Três fontes, uma pendência. Cenário fictício: uma nota registra revisão na terça-feira; um e-mail pede nova cláusula; o contrato ainda não contém essa alteração.

**Entrega a conferir:** Briefing preliminar com fatos separados de lacunas e uma lista de documentos necessários para revisão.

**Critério de conferência:** Verifique se terça-feira não ganhou uma data inventada e se a cláusula ausente não foi interpretada como aceita.

**Rastreabilidade:** SKILL.md com 209 linhas e 944 palavras no corpo; 1 links Markdown locais inspecionados. SHA-256 da fonte: `7f1d6d63a74e14e76729d161bf76f2f624b1441d7e4655708e493083a0b93bd2`.

**Pendência estrutural:** referência ausente no pacote: `../../CONNECTORS.md`.

### DD-005 — Aplicativos interativos dentro de assistentes

Identificador: `build-mcp-app` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue widgets de elicitação e explica recursos de UI, ferramentas e formatos de implantação.

**Ponto de melhoria:** Acrescentar uma matriz explícita de host, versão do SDK, CSP e fallback textual para evitar promessa de widget universal.

**Evidência na fonte:** Seções “Claude host specifics”, “Widgets vs Elicitation — route correctly” e “Testing”.

**Alteração sugerida:** Criar teste mínimo de host compatível, host sem UI, recurso bloqueado por CSP e ferramenta indisponível; registrar versões usadas no scaffold e no teste.

**Cenário candidato de validação:** Escolha sem copiar códigos. Dados fictícios: opções A — Consulta e B — Exportação; selecionar uma opção não deve executar nenhuma operação externa.

**Entrega a conferir:** Especificação e código proposto de um seletor, com plano de teste no host e alternativa textual.

**Critério de conferência:** Confirme que escolher B não dispara exportação e que a ferramenta retorna uma descrição útil sem o widget.

**Rastreabilidade:** SKILL.md com 393 linhas e 2456 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `d2fd94f0096506469ec855c581e48293d35480e58e6405b2bfcdba0486a0c218`.

### DD-006 — Conectores para sistemas e assistentes de IA

Identificador: `build-mcp-server` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Começa por descoberta de API, usuários, autenticação e superfície antes de recomendar implantação.

**Ponto de melhoria:** Aprofundar testes de escopo de credenciais e falhas de API para que o scaffold tenha contrato verificável além do caminho feliz.

**Evidência na fonte:** “Phase 1 — Interrogate the use case”, especialmente “What auth does the upstream service use?”.

**Alteração sugerida:** Adicionar casos de credencial ausente, escopo insuficiente, limite de requisições, timeout e resposta malformada; distinguir operações de leitura e escrita no contrato de cada ferramenta.

**Cenário candidato de validação:** Uma consulta bem delimitada. API fictícia: GET /items/{id} devolve id, name e quantity. Não existe operação de escrita no escopo.

**Entrega a conferir:** Contrato da ferramenta, arquitetura recomendada e roteiro de implementação e testes sem publicação.

**Critério de conferência:** Confira se o identificador é validado e se nenhuma capacidade de escrita foi adicionada à API descrita.

**Rastreabilidade:** SKILL.md com 222 linhas e 1719 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `088cd04be7f03ebbdfd24973cbcbf93c7a2e09117c4bba7b2b06bcc3e0a556f6`.

### DD-007 — Distribuição de conectores locais

Identificador: `build-mcpb` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Explica manifesto, empacotamento e ausência de sandbox, incluindo dependências nativas.

**Ponto de melhoria:** Transformar o aviso de ausência de sandbox em requisitos testáveis de acesso local e compatibilidade entre sistemas.

**Evidência na fonte:** Seções “MCPB has no sandbox — security is on you” e “Build pipeline”.

**Alteração sugerida:** Adicionar allowlist de diretórios, teste de travessia de caminho e declaração de sistemas suportados; verificar dependências nativas no sistema de destino e assinatura do pacote quando aplicável.

**Cenário candidato de validação:** A pasta que pode viajar. Cenário fictício: um servidor stdio existente lista nomes de arquivos apenas dentro de [PASTA_PERMITIDA].

**Entrega a conferir:** Manifesto proposto, inventário de dependências e plano de testes de instalação e limites de acesso.

**Critério de conferência:** Teste tentativas de sair da pasta permitida e confirme que dependências nativas correspondem ao sistema de destino.

**Rastreabilidade:** SKILL.md com 200 linhas e 982 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `6bb90afd0415754e13f353ee5982d13857c14826edbcbdf5f1481fa5563cd56b`.

### DD-008 — Aplicativos experimentais para dispositivos Cardputer

Identificador: `cardputer-buddy` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Traz ciclo incremental de envio de arquivos, logs seriais e execução REPL sobre um dispositivo já preparado.

**Ponto de melhoria:** Declarar um protocolo de recuperação quando uma alteração de aplicativo impede a inicialização, preservando o provisionamento existente.

**Evidência na fonte:** Seções “Device layout”, “Adding an app” e “Dev loop tooling (buddy/scripts/)”.

**Alteração sugerida:** Antes do envio, validar caminho do dispositivo e cópia do arquivo alterado; documentar restauração do aplicativo via serial e critério para escalar ao m5-onboard sem reflashear por padrão.

**Cenário candidato de validação:** Uma tecla, uma mensagem. Exemplo fictício: um Cardputer preparado deve mostrar Pronto e trocar para Teste ao receber uma tecla definida.

**Entrega a conferir:** Código proposto de um aplicativo simples e roteiro de verificação no dispositivo, sem pressupor execução bem-sucedida.

**Critério de conferência:** Confira o evento de tecla nos registros e confirme que os demais aplicativos continuam acessíveis após a atualização.

**Rastreabilidade:** SKILL.md com 47 linhas e 175 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `dae31d1459c8ee7b4a03d04bf55485f4ece04bdd4f5a2650ad39eb3d07d9be10`.

### DD-009 — Atas e compromissos de reunião

Identificador: `claude-acta-drivedata` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Extrai decisões, responsáveis e prazos sem inventar informações e entrega documentos com estrutura consistente.

**Ponto de melhoria:** Parametrizar idioma e identidade visual mantendo o modelo original como opção explícita, em vez de assumir espanhol e uma marca para todo uso.

**Evidência na fonte:** Seções “Estrutura do documento (sempre esta ordem)”, “Regras de estilo do e-mail” e “Script base”.

**Alteração sugerida:** Adicionar parâmetros de idioma, marca e modelo autorizado; preservar nomes e datas fornecidos, marcar lacunas e manter o email como rascunho até autorização de envio.

**Cenário candidato de validação:** O prazo que não foi dito. Transcrição fictícia: Ana revisará o cadastro até sexta-feira. Bruno validará o relatório, sem prazo informado.

**Entrega a conferir:** Ata proposta com duas ações, datas pendentes identificadas e arquivos condicionados à validação de geração.

**Critério de conferência:** Confirme que Bruno não recebeu um prazo inventado e que os nomes não ganharam sobrenomes ausentes.

**Rastreabilidade:** SKILL.md com 127 linhas e 682 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `67f5253d78eb15efeb49365ff7b98bbf14fb7bfd22f16374f7e962798629c774`.

### DD-010 — Diagnóstico de automações para equipes de desenvolvimento

Identificador: `claude-automation-recommender` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Relaciona recomendações de automação à análise do repositório e evita iniciar por implementação.

**Ponto de melhoria:** Acrescentar custo de manutenção e pré-requisitos por recomendação para comparar uma automação com a rotina atual.

**Evidência na fonte:** “Phase 1: Codebase Analysis” e “Phase 3: Output Recommendations Report”.

**Alteração sugerida:** Estender o relatório com evidência no repositório, dependências, esforço de manutenção e teste de utilidade; não quantificar economia de tempo sem medição real.

**Cenário candidato de validação:** Antes do próximo plugin. Projeto fictício: testes rodam manualmente, convenções estão documentadas e já existe um comando de revisão.

**Entrega a conferir:** Relatório priorizado de oportunidades, com justificativas, dependências e opções que não devem ser duplicadas.

**Critério de conferência:** Confirme que cada recomendação cita um arquivo ou comportamento observado, e não apenas uma categoria genérica de ferramenta.

**Rastreabilidade:** SKILL.md com 290 linhas e 1464 palavras no corpo; 5 links Markdown locais inspecionados. SHA-256 da fonte: `441c57e26f0931b64dd085deaad9213c4e3efea27d916dd7443cd33c7e338227`.

### DD-011 — Documentação do ambiente Power BI

Identificador: `claude-bi-documentation` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Define coleta de tabelas, colunas, relações, medidas e páginas para documentação estruturada do modelo.

**Ponto de melhoria:** Desacoplar o template visual específico da origem e conferir cobertura da documentação contra o inventário extraído.

**Evidência na fonte:** Seções “Document Structure”, “Generation” e “Adapting to Different Models”; geração utiliza modelo visual de origem.

**Alteração sugerida:** Parametrizar marca e cores e adicionar contadores de objetos extraídos/documentados; listar objetos ilegíveis ou não cobertos sem apresentar a documentação como completa.

**Cenário candidato de validação:** Um modelo para outra equipe. Cenário fictício: o projeto em [PASTA_PBIP] será recebido por uma equipe que não conhece as medidas existentes.

**Entrega a conferir:** Documento técnico proposto, com inventário rastreável e registro da cobertura dos metadados.

**Critério de conferência:** Compare a quantidade de medidas documentadas com o inventário do projeto e confira a marca usada na capa.

**Rastreabilidade:** SKILL.md com 94 linhas e 662 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `a6eae92daa8797dbaa16e15b3b2bd5c02d43e372dd12169bd92f4e9411bdcd30`.

### DD-012 — Navegação assistida no navegador integrado

Identificador: `claude-built-in-browser` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Preserva sessões do usuário, explica permissões de site e exige reconhecer limitações de acesso.

**Ponto de melhoria:** Evidenciar logo no início que os nomes de ferramentas pertencem ao navegador integrado do Claude e precisam de correspondência real em outro host.

**Evidência na fonte:** Seções “Loading via ToolSearch”, “Site approvals, blocked sites, and request_access” e “When the built-in browser cannot be reached”.

**Alteração sugerida:** Adicionar preflight de plataforma e ferramenta; na ausência do navegador correspondente, relatar indisponibilidade e escolher uma alternativa autorizada sem simular os nomes de API.

**Cenário candidato de validação:** A página que precisa de evidência. Cenário fictício: uma pessoa quer confirmar o texto de um aviso em [URL_AUTORIZADA], sem mudar dados.

**Entrega a conferir:** Registro do aviso observado ou descrição precisa do impedimento, com referência ao endereço consultado.

**Critério de conferência:** Confira se o relato corresponde ao texto visível e se nenhuma sessão foi alterada para completar a consulta.

**Rastreabilidade:** SKILL.md com 49 linhas e 885 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `781e8ef42feac96c5ccf4afef929765f02f221ef6fd6d4917d56ce898f9c417a`.

### DD-013 — Navegação assistida no Chrome

Identificador: `claude-chrome-browser` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Começa por contexto de abas, cria aba de trabalho e descreve permissões e observação de console.

**Ponto de melhoria:** Acrescentar critério de evidência final por tipo de interação para evitar confundir clique, envio e confirmação do sistema.

**Evidência na fonte:** Seções “Starting a session: tab context first, then a new tab”, “Reading console output” e “Staying on task, and when to stop”.

**Alteração sugerida:** Incluir exemplos de confirmação observável para navegação e formulários de teste, com aba e tentativa identificadas; declarar ausência de confirmação mesmo quando o clique ocorre sem erro.

**Cenário candidato de validação:** O botão sem confirmação. Ambiente fictício de teste em [URL_TESTE], com formulário que aceita somente dados fictícios e não envia mensagens externas.

**Entrega a conferir:** Registro da sequência observada, com mensagem final, falhas identificadas e limitações das ferramentas disponíveis.

**Critério de conferência:** Confira se existe confirmação final no fluxo e se os registros pertencem à mesma tentativa de teste.

**Rastreabilidade:** SKILL.md com 65 linhas e 737 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `e389bcebf7f20dca0111572d02c6dfde527ef1b6325a53cec50dbe95538a396f`.

### DD-014 — Arquitetura e evolução de sistemas em nuvem

Identificador: `claude-cloud-code-architecture` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Cobre princípios de design, estado, segredos, resiliência e idempotência em aplicações de nuvem.

**Ponto de melhoria:** Converter princípios amplos em decisões com critérios e testes, especialmente na janela entre efeito externo e persistência local.

**Evidência na fonte:** Seções “3.4. Idempotência”, “2.3. Padrões de Resiliência” e “4. Checklist de Arquitetura para o Assistente”.

**Alteração sugerida:** Adicionar cenário de evento duplicado e falha após efeito externo, com contrato de chave idempotente, estado, retry e observabilidade; evitar recomendar microsserviços sem necessidade evidenciada.

**Cenário candidato de validação:** O evento repetido. Cenário fictício: o evento pedido-criado, com identificador EVT-A, pode ser entregue mais de uma vez.

**Entrega a conferir:** Proposta de fronteiras e persistência, com cenários de falha e plano de testes para mensagens repetidas.

**Critério de conferência:** Verifique o que ocorre quando a falha acontece depois da operação externa e antes do registro local.

**Rastreabilidade:** SKILL.md com 128 linhas e 1310 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `31e71e017ce6dcc809e975ecf7ed44e73e6cccaf0179c1f70f09702d117ac240`.

### DD-015 — Operação assistida de aplicativos

Identificador: `claude-computer-use` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue superfícies, pede observar antes de afirmar e delimita permissões e ações financeiras.

**Ponto de melhoria:** Separar claramente as APIs históricas do Claude das ferramentas de controle realmente disponibilizadas pelo host atual.

**Evidência na fonte:** Seções “Separate filesystems”, “Loading via ToolSearch”, “Access flow” e “Look before asserting”.

**Alteração sugerida:** Adicionar tabela de pré-requisitos e ponto de interrupção quando a ferramenta não existir; registrar app, tela anterior e evidência posterior em ações que alteram documentos.

**Cenário candidato de validação:** Uma janela de cada vez. Cenário fictício: uma pessoa autorizou revisar o título de um documento aberto em [APLICATIVO], sem enviar ou publicar o arquivo.

**Entrega a conferir:** Registro da edição e do estado de salvamento, ou indicação precisa da intervenção necessária.

**Critério de conferência:** Confira o título na janela correta depois da ação e diferencie conteúdo editado de arquivo efetivamente salvo.

**Rastreabilidade:** SKILL.md com 83 linhas e 1860 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `8fe2f6a56c986a81fcff8a2cd512e9c2971ac3de9897cd0023bf3e8487ac4d69`.

### DD-016 — Operação assistida de aplicativos — variante de preparação

Identificador: `claude-computer-use-staging` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Mantém as mesmas salvaguardas de observação, superfície e acesso da variante principal de controle de desktop.

**Ponto de melhoria:** Explicar finalidade e manutenção da variante staging para evitar instalação duplicada com instruções divergentes ou promessa de recurso adicional.

**Evidência na fonte:** Título “Computer use (desktop control)” e mesmas seções “Access flow” e “Financial actions” da variante principal.

**Alteração sugerida:** Adicionar metadados de variante, relação com a principal e política de sincronização; usar teste de equivalência dos limites críticos entre as duas versões.

**Cenário candidato de validação:** Antes do primeiro clique. Cenário fictício: a equipe quer alterar um aplicativo, mas ainda não sabe se ele está acessível às ferramentas da sessão.

**Entrega a conferir:** Roteiro de prontidão com pré-requisitos, limites de acesso e indicação do próximo passo permitido.

**Critério de conferência:** Confira se o roteiro distingue ferramenta disponível, acesso autorizado e ação já executada.

**Rastreabilidade:** SKILL.md com 83 linhas e 1780 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `23fd6bbf860c234eea7b243106f4b6bb9d59fcd132c5a4e3065e8edcd722eb77`.

### DD-017 — Pesquisa estratégica e comparação de alternativas

Identificador: `claude-deep-research` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Decompõe pesquisa e separa pesquisadores da síntese, limitando rodada adicional de investigação.

**Ponto de melhoria:** Tornar orçamento de pesquisa, frescor das fontes e fallback sem agentes parte explícita do contrato de entrada.

**Evidência na fonte:** Seções “Decompose the user’s query to determine subagent count”, “Spawn foreground research subagents (in parallel)” e “Conduct one additional round of research”.

**Alteração sugerida:** Definir critérios de parada por cobertura, prazo e fontes; verificar ferramenta de agentes antes de delegar e registrar conflitos entre fontes com data e evidência na síntese.

**Cenário candidato de validação:** Três documentos, uma decisão. Uma equipe fictícia compara [DOCUMENTO_A], [DOCUMENTO_B] e [DOCUMENTO_C] para escolher um padrão técnico; os arquivos ou URLs serão fornecidos.

**Entrega a conferir:** Síntese comparativa com fontes rastreáveis, divergências e perguntas pendentes para a decisão técnica.

**Critério de conferência:** Abra uma fonte de cada conclusão central e verifique se ela realmente sustenta a interpretação apresentada.

**Rastreabilidade:** SKILL.md com 147 linhas e 1959 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `93961552fbddf8ff749496c277bcc1a15e18e1160e912c2776d059fb0d66bbad`.

### DD-018 — Documentos colaborativos no ambiente Claude

Identificador: `claude-docs` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Faz encaminhamento curto ao ambiente de documentos sem duplicar uma implementação inexistente.

**Ponto de melhoria:** Expandir a declaração de dependência para que o item não seja confundido com um gerador autônomo de arquivos.

**Evidência na fonte:** Arquivo curto de encaminhamento, sem seções de criação, validação ou implementação de documentos.

**Alteração sugerida:** Adicionar operações suportadas pelo conector, preflight de acesso e saída quando o conector não existe; declarar que leitura, edição e comentários dependem da ferramenta conectada.

**Cenário candidato de validação:** Um link sem conexão. Uma equipe fictícia quer revisar [URL_DOCUMENTO], mas ainda não confirmou quais ferramentas de documentos estão disponíveis na sessão.

**Entrega a conferir:** Diagnóstico de acesso e capacidades disponíveis, com próximo passo viável para revisar o documento.

**Critério de conferência:** Confirme que o diagnóstico identifica uma ferramenta real ou declara sua ausência, sem inventar o conteúdo do arquivo.

**Rastreabilidade:** SKILL.md com 7 linhas e 37 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `d38166bb8784d40e4866744b6bd12ed97e1c70fecff8edc385980d37c4a8d194`.

### DD-019 — Documentos Word profissionais

Identificador: `claude-docx` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Inclui edição estrutural, comentários, alterações controladas e verificação de saída.

**Ponto de melhoria:** Adicionar uma bateria pequena de documentos de regressão com comentários ligados a trechos alterados, cabeçalhos e numeração.

**Evidência na fonte:** Seções “Editing existing documents”, “Comments” e “Verify the output”.

**Alteração sugerida:** Criar fixtures com comentário, tracked changes, tabela multipágina e referência interna; comparar relações XML e renderização antes/depois de uma alteração pontual.

**Cenário candidato de validação:** A revisão que preserva rastros. Um documento fictício em [ARQUIVO_DOCX] contém comentários e uma seção denominada Escopo; o novo texto autorizado será fornecido em [NOVO_TEXTO].

**Entrega a conferir:** Cópia Word revisada e registro das alterações, acompanhados das verificações de estrutura e layout disponíveis.

**Critério de conferência:** Compare as seções não autorizadas para alteração e confira se os comentários continuam ligados ao texto correspondente.

**Rastreabilidade:** SKILL.md com 94 linhas e 947 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `b62988b03219a3ad80ddc04fbd493010370f9ff45fbd301a1193ae9598673454`.

### DD-020 — Documentos e planilhas no Google Workspace

Identificador: `claude-google-workspace` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Exige referências, verificação de conectores e controles de colaboração antes de tocar os arquivos.

**Ponto de melhoria:** Explicitar matriz de capacidades por conector e teste de conflito de revisão para não pressupor suporte uniforme a sugestões.

**Evidência na fonte:** Seções “1. Check the connectors before you start”, “2. Rules for every file” e “6. What the connectors can’t do”.

**Alteração sugerida:** Registrar leitura, escrita, sugestão e guarda de revisão por ferramenta; incluir um cenário de revisão concorrente e fallback em proposta separada quando o modo pedido não existe.

**Cenário candidato de validação:** Sugestões em uma versão viva. Em [URL_DOCUMENTO], uma equipe fictícia mantém um texto colaborativo; o pedido permite apenas sugestões na seção Objetivo, com base em [ORIENTACOES].

**Entrega a conferir:** Sugestões autorizadas no modo disponível ou uma lista separada para revisão, com registro claro do acesso e das alterações.

**Critério de conferência:** Verifique que o modo de sugestão foi respeitado e que nenhuma revisão concorrente foi silenciosamente sobrescrita.

**Rastreabilidade:** SKILL.md com 98 linhas e 2490 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `4b81a3563e444bb77dee1bf13a8c6190dc1d8b33ff44ca7cca9d253a0cdbfff9`.

### DD-021 — Importação de contexto pessoal para o Claude

Identificador: `claude-import-memory` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Prioriza verificação da ferramenta, importação aditiva e separação de informações duradouras e sensíveis.

**Ponto de melhoria:** Destacar que a memória pertence ao produto e que gravar um arquivo local não equivale a inserir memória ativa em outro assistente.

**Evidência na fonte:** Seções “Ground rules — read these first”, “Flow” e “Edge cases”.

**Alteração sugerida:** Adicionar matriz de compatibilidade de plataforma e relatório de notas novas, duplicadas, descartadas e não gravadas; manter a proposta sem escrita até confirmação do escopo de importação.

**Cenário candidato de validação:** Preferências que merecem ficar. Exportação fictícia: prefere respostas em português; prefere respostas em português; reunião encerrada; chave de acesso omitida. O arquivo autorizado será [EXPORTACAO].

**Entrega a conferir:** Proposta de notas duradouras e exclusões justificadas, condicionada à existência das ferramentas de memória.

**Critério de conferência:** Confirme que a preferência aparece uma vez e que tarefas encerradas ou credenciais não viraram notas permanentes.

**Rastreabilidade:** SKILL.md com 90 linhas e 1648 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `4a4b239f255a59f0b6138127f839e5b48381c764cd6f337853c3f127c91aed77`.

### DD-022 — Referência de projeto especializado

Identificador: `claude-maia` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Documenta o contexto e as fontes de um fluxo interno especializado, permitindo identificar que sua distribuição precisa de restrições.

**Ponto de melhoria:** Remover a referência da distribuição pública até revisão de titularidade e privacidade; não transformar os módulos de segmentação eleitoral em oferta aberta.

**Evidência na fonte:** Seções “Contexto”, “Fontes de dados”, “Módulos de atuação” e “Contexto técnico do sistema”; fonte contém contexto eleitoral e dados operacionais privados.

**Alteração sugerida:** Produzir somente inventário de acesso, responsável, autorização e retenção; redigir dados privados e restringir o pacote. Não ampliar capacidades de segmentação ou persuasão política.

**Cenário candidato de validação:** Inventário sem exposição. Acervo fictício: item R-01, acesso restrito, responsável ainda não confirmado e autorização de distribuição ausente. Não há dados pessoais no exemplo.

**Entrega a conferir:** Ficha de governança do item R-01 com pendências de autorização e limites claros de publicação.

**Critério de conferência:** Confira se a ficha contém apenas metadados do inventário e se nenhuma autorização ausente foi tratada como concedida.

**Rastreabilidade:** SKILL.md com 455 linhas e 2211 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `9f4f83568b28ff89860a2773885e96eb717dbb08fe8db1e01f03a0eefb7b30b2`.

### DD-023 — Criação e avaliação de skills personalizadas

Identificador: `claude-marketplace-skill-creator` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Combina captura de intenção, exemplos, avaliações e revisão de resultados no ciclo de autoria.

**Ponto de melhoria:** Distinguir claramente esta cópia de marketplace da skill principal e verificar dependências do avaliador antes de oferecer execução automatizada.

**Evidência na fonte:** Seções “Capture Intent”, “Write the SKILL.md” e guia de avaliação presentes também na variante principal.

**Alteração sugerida:** Adicionar metadados de origem/variante, versão e diferenças intencionais; executar o mesmo conjunto de casos nas variantes e marcar avaliações que dependem de Claude CLI ou agentes.

**Cenário candidato de validação:** Notas que viram estrutura. Exemplo fictício: Ana revisa o cadastro; prazo não definido; decisão de manter o formato atual. A skill candidata será escrita em [PASTA_SKILL].

**Entrega a conferir:** Rascunho de skill com casos de avaliação, critérios de sucesso e plano de comparação antes de publicação.

**Critério de conferência:** Teste se o prazo ausente permanece explicitamente indefinido e se o pedido fora do escopo evita ativação indevida.

**Rastreabilidade:** SKILL.md com 486 linhas e 5151 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `af0070a86ed0722e60ac83010b85bfc3cbe7a5630271b351a19c5d8cff0eb9e3`.

### DD-024 — Organização do contexto técnico para assistentes

Identificador: `claude-md-improver` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Produz relatório de qualidade e diferenças pontuais antes de modificar as instruções do projeto.

**Ponto de melhoria:** Anexar localização e validade observável a cada orientação proposta para evitar incorporar comandos que apenas parecem corretos.

**Evidência na fonte:** Seções “Phase 3: Quality Report Output”, “Phase 4: Targeted Updates” e “Phase 5: Apply Updates”.

**Alteração sugerida:** Exigir evidência em package scripts, configuração ou procedimento existente para comandos novos; registrar instruções conflitantes e não alterar arquivos até a etapa de revisão prevista.

**Cenário candidato de validação:** O comando que envelheceu. Em [REPOSITORIO], um projeto fictício tem arquivos CLAUDE.md e scripts de desenvolvimento que precisam ser comparados; nenhuma edição está autorizada nesta etapa.

**Entrega a conferir:** Relatório de qualidade e diferenças propostas, com evidência para cada mudança nas instruções do projeto.

**Critério de conferência:** Confira cada comando sugerido contra um script ou procedimento existente e verifique que nenhuma edição ocorreu antes da revisão.

**Rastreabilidade:** SKILL.md com 180 linhas e 810 palavras no corpo; 2 links Markdown locais inspecionados. SHA-256 da fonte: `b06c7420be08ca1c7f6d75f7f4709fdb787624a2d363e2f8052216d8c780f85b`.

### DD-025 — Atualização de base de conhecimento comercial

Identificador: `claude-messi-knowledge-ingest` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Separa inventário, taxonomia, deduplicação e destinos de texto e dados comerciais.

**Ponto de melhoria:** Fortalecer versionamento e expiração de preços, além de comprovar carga e indexação separadamente da extração de PDFs.

**Evidência na fonte:** Seções “Deduplicar contra o que já existe”, “Gerar os chunks no formato certo” e “Rotina de atualização (mês a mês)”.

**Alteração sugerida:** Adicionar chave de documento/versão, validade temporal, checksum e estado de carga; validar amostras OCR e fazer consulta de recuperação após ingestão, sem apresentar extração como publicação concluída.

**Cenário candidato de validação:** Duas versões na mesma pasta. Lote fictício em [PASTA_PDFS]: catálogo A, versão anterior de A e tabela de preços B; os destinos serão definidos em [DESTINOS].

**Entrega a conferir:** Inventário do lote, amostras rastreáveis, proposta de classificação e plano de destinos separado por tipo de informação.

**Critério de conferência:** Verifique que a versão anterior de A está identificada e que um preço não foi tratado como texto atual sem validação.

**Rastreabilidade:** SKILL.md com 168 linhas e 1097 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `adf248d142f38c4be16b1d64ccf398e5c88fd879512beb923b7108a0ce2cfe2e`.

### DD-026 — Resumo executivo do dia

Identificador: `claude-morning` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Organiza panorama em HTML, explicita fontes ausentes e não transforma mensagens recebidas em autorização de ação.

**Ponto de melhoria:** Acrescentar indicação de data, fuso e atualização por fonte para impedir mistura silenciosa entre agenda de hoje e notas antigas.

**Evidência na fonte:** Seções “Gather”, “Sort”, “Verify” e “Ground rules”.

**Alteração sugerida:** Incluir carimbo de consulta e fuso no panorama, separar evento confirmado de sugestão e testar visualização com fonte desconectada; manter execução pontual salvo pedido de recorrência.

**Cenário candidato de validação:** Uma manhã com lacunas. Dia fictício: revisão de proposta às 09:00 e reunião de projeto às 11:00. Notas: proposta sem anexo; reunião precisa da pauta. Outras fontes não conectadas.

**Entrega a conferir:** Página HTML do dia com compromissos, preparação sugerida e lacunas de informação explicitamente identificadas.

**Critério de conferência:** Confira os horários e verifique que o anexo e a pauta aparecem como pendências, não como materiais já disponíveis.

**Rastreabilidade:** SKILL.md com 153 linhas e 2937 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `50f074b0e5669a461b13b950d100f2262fad7603c41cdb7402d8198594c3d99b`.

### DD-027 — Inteligência de carteira e oportunidades B2B

Identificador: `claude-oraculo` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Oferece módulos distintos de conciliação, indicadores e exploração de carteiras de telecom.

**Ponto de melhoria:** Revisar linguagem de predição e simulador para impedir que classificação heurística ou cenário seja apresentado como previsão comprovada ou receita garantida.

**Evidência na fonte:** Seções “Scoring Dinâmico”, “Simulador de Receita” e “Predição e Ciência de Dados”.

**Alteração sugerida:** Exigir dicionário de dados, janela temporal e validação histórica fora da amostra para alegações preditivas; apresentar hipóteses, faixas e restrições de uso, mantendo estimativas separadas de faturamento realizado.

**Cenário candidato de validação:** A carteira que não fecha. Base fictícia A: conta C-01 com 8 linhas. Base fictícia B: conta C-01 com 7 linhas. Arquivos completos autorizados: [MAPA_PARQUE] e [PARQUE_MOVEL].

**Entrega a conferir:** Diagnóstico de conciliação e roteiro analítico com indicadores possíveis, hipóteses declaradas e lacunas que impedem conclusões.

**Critério de conferência:** Confirme que a diferença entre 8 e 7 linhas permanece sinalizada e que nenhuma estimativa foi apresentada como receita realizada.

**Rastreabilidade:** SKILL.md com 977 linhas e 3824 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `341ac2a15d2d2ace5778e0e8d71f78c1667d2f53e06b16d3cd734579ef5ac534`.

### DD-028 — Organização e versionamento de projetos Power BI

Identificador: `claude-pbip` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Diferencia formatos, estruturas e referências de projeto, incluindo cenários thin/thick e legado/moderno.

**Ponto de melhoria:** Uniformizar a orientação de conversão PBIX com as outras skills PBIR e deixar explícito o que depende do Desktop e do tipo de arquivo.

**Evidência na fonte:** Seções “Working with PBIX Files”, “Thick vs Thin PBIX”, “Legacy vs Modern PBIX” e “Assembling a PBIP from an Extracted Thin PBIX”.

**Alteração sugerida:** Adicionar matriz de conversão por tipo de PBIX com pré-condições e limitações; testar amostras thin/thick e nunca generalizar extração de ZIP como conversão completa do modelo.

**Cenário candidato de validação:** O nome que atravessa arquivos. Projeto fictício em [PASTA_PBIP]; a coluna [COLUNA_ATUAL] será avaliada para renomeação a [COLUNA_NOVA], sem alteração nesta etapa.

**Entrega a conferir:** Mapa da estrutura e das referências afetadas, com plano de mudança e verificação do projeto.

**Critério de conferência:** Confira se medidas e visuais foram considerados e se o plano diferencia definição versionável de cache local.

**Rastreabilidade:** SKILL.md com 288 linhas e 2138 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `768324bdcfa7b7673a09e558857184dbd922a1dfab145afd6f3f7863d3b7649c`.

### DD-029 — Engenharia de relatórios Power BI como código

Identificador: `claude-pbir-expert` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Integra leitura de PBIP/PBIR/TMDL com preservação de identificadores e atenção a esquemas e referências.

**Ponto de melhoria:** Vincular exemplos de estrutura à versão do esquema e explicitar testes de referência semântica após alterações visuais.

**Evidência na fonte:** Seções “Before you start any task”, “Migration guidance (PBIX to PBIP/PBIR)” e “Common gotchas”.

**Alteração sugerida:** Registrar versão PBIR/TMDL, validar esquemas e gerar comparação de GUIDs, bindings e filtros; abrir no Desktop antes de declarar uma edição ou migração validada.

**Cenário candidato de validação:** Mover sem trocar o indicador. Projeto fictício em [PASTA_PBIP]; a página [PAGINA] tem dois visuais identificados em [VISUAIS], cuja posição deve ser invertida sem mudar os dados.

**Entrega a conferir:** Alteração delimitada de layout ou proposta equivalente, com diferenças verificáveis e roteiro de validação no Desktop.

**Critério de conferência:** Compare os vínculos de medidas e filtros antes e depois; apenas as posições autorizadas devem mudar.

**Rastreabilidade:** SKILL.md com 198 linhas e 1820 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `f7ffe730146605cebced9485150dc8f821c3f28e58d0f2e6897cef43840124ad`.

### DD-030 — Referência técnica do formato PBIR

Identificador: `claude-pbir-format` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Delimita PBIR aprimorado e favorece ferramenta própria para reduzir edição frágil de JSON.

**Ponto de melhoria:** Adicionar fixtures de herança de tema e propriedades locais para validar mudanças que passam no esquema mas não alteram o visual esperado.

**Evidência na fonte:** Seções “General, critical guidance”, “Rules”, “Additional validation” e “definition.pbir”.

**Alteração sugerida:** Criar exemplos mínimos por versão com cor herdada e sobrescrita local; conferir esquema, identidade do visual e resultado renderizado, declarando quando pbir CLI não está disponível.

**Cenário candidato de validação:** A cor que não aparece. Em [PASTA_RELATORIO], o visual [ID_VISUAL] precisa usar a cor #167D8D; o formato e a versão do relatório ainda serão confirmados.

**Entrega a conferir:** Diagnóstico do formato e alteração de cor delimitada, com referência à propriedade correta e verificações necessárias.

**Critério de conferência:** Confira a cor renderizada e se o ajuste não foi neutralizado pelo tema ou aplicado a outro objeto.

**Rastreabilidade:** SKILL.md com 183 linhas e 1965 palavras no corpo; 4 links Markdown locais inspecionados. SHA-256 da fonte: `62133fb1b2e97cf0032f59631bd624c0bb15e8d5e32117f8d9f3921233ebc0b1`.

### DD-031 — Processamento e organização de PDFs

Identificador: `claude-pdf` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Oferece caminhos diferentes para extração textual, tabelas, manipulação e OCR de documentos.

**Ponto de melhoria:** Padronizar saída de extração com origem por página e marcação de incerteza, sobretudo em tabelas escaneadas.

**Evidência na fonte:** Seções “pdfplumber - Text and Table Extraction”, “Advanced Table Extraction” e receitas de OCR.

**Alteração sugerida:** Acrescentar fixture digital e escaneada com cabeçalho repetido, célula vazia e valor negativo; comparar amostra com renderização e registrar campos que exigem revisão manual.

**Cenário candidato de validação:** Tabela digital ou imagem. Documento fictício em [ARQUIVO_PDF], com uma tabela na página [PAGINA_TABELA]; o usuário precisa de dados conferíveis, não apenas de texto corrido.

**Entrega a conferir:** Tabela extraída com referência à página, células ambíguas sinalizadas e relato das verificações visuais realizadas.

**Critério de conferência:** Compare cabeçalhos, unidades e uma amostra de valores com a imagem original, incluindo células vazias e sinais negativos.

**Rastreabilidade:** SKILL.md com 315 linhas e 927 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `9fe463ca615f24c8d9f0f66a013608a43a9f95e43125786b9613f8482c414c3d`.

### DD-032 — Auditoria de qualidade e desempenho do Power BI

Identificador: `claude-power-bi-best-practices` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Organiza regras por severidade e considera exceções em vez de aplicar correções cegamente.

**Ponto de melhoria:** Registrar versão das regras e separar cobertura efetiva de regras não avaliáveis por falta de métricas ou acesso ao modelo.

**Evidência na fonte:** Seções “Antes de qualquer auditoria”, “Sistema de severidade” e “Regras verificadas e aprovadas”.

**Alteração sugerida:** Adicionar estados aprovado, achado, exceção justificada e não avaliado por regra; incluir evidência e métrica exigida, evitando tratar ausência de dados Vertipaq como aprovação de desempenho.

**Cenário candidato de validação:** Alertas com pesos diferentes. Modelo fictício em [MODELO]; inventário de regras em [REGRAS] e métricas, quando existentes, em [METRICAS]. A tarefa inicial é somente auditoria.

**Entrega a conferir:** Auditoria priorizada com evidências, exceções justificadas e critérios de verificação para as correções propostas.

**Critério de conferência:** Escolha um alerta de cada severidade e confira se sua evidência existe e se a correção respeita o contexto do modelo.

**Rastreabilidade:** SKILL.md com 184 linhas e 1515 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `894840a6a22dc94dc293d089bc55e6750a6b39baca25211af0ac9092fbad1a0f`.

### DD-033 — Indicadores e análise para decisões de negócio

Identificador: `claude-power-bi-data-analysis` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Começa pelo entendimento do negócio e conecta modelo, medidas e relatório analítico.

**Ponto de melhoria:** Incluir um contrato formal de cada métrica para resolver ambiguidades de evento, granularidade, período e denominador antes de gerar DAX.

**Evidência na fonte:** Seções “Fase 1: Entendimento do Negócio (Obrigatória)” e “Fase 3: Geração de Medidas DAX”.

**Alteração sugerida:** Adicionar ficha de métrica com pergunta, unidade, granularidade, fonte, filtros, regra de BLANK/zero e exemplo calculado; exigir conferência com dados antes de redigir insights.

**Cenário candidato de validação:** Duas definições de venda. Dados fictícios: pedido P-01 emitido com valor 100 e ainda não faturado; pedido P-02 emitido e faturado com valor 80. Não há outros registros.

**Entrega a conferir:** Catálogo de métricas e estrutura de relatório que separam pedidos emitidos, faturamento e dados financeiros indisponíveis.

**Critério de conferência:** Confira se pedidos emitidos totalizam 180, faturamento totaliza 80 e recebimento permanece desconhecido.

**Rastreabilidade:** SKILL.md com 256 linhas e 1284 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `6d80af71a44775f9d2957fe54dcb14601a7260615a8a94489bd8c56b3a4ee4b9`.

### DD-034 — Revisão e otimização de medidas DAX

Identificador: `claude-power-bi-dax-optimization` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Analisa desempenho, legibilidade e manutenção, apresentando justificativas para fórmulas propostas.

**Ponto de melhoria:** Tornar equivalência semântica e medição comparável critérios obrigatórios antes de chamar uma reescrita de otimização.

**Evidência na fonte:** Seções “Performance Analysis”, “Optimization Process” e “Common Optimization Patterns”.

**Alteração sugerida:** Adicionar testes em total, contexto de linha, filtros múltiplos, BLANK e relacionamentos; registrar dados, cache e medições, sem prometer ganhos por usar VAR ou reduzir tamanho textual.

**Cenário candidato de validação:** O total mudou sem aviso. Medida fictícia em [DAX_ORIGINAL], modelo em [MODELO] e comportamento esperado em [REGRA_NEGOCIO]; o total precisa manter a mesma definição após a revisão.

**Entrega a conferir:** Proposta DAX comentada com comparação semântica e plano de teste de resultados e desempenho.

**Critério de conferência:** Confira equivalência nos cenários definidos e aceite afirmações de velocidade somente com medição comparável.

**Rastreabilidade:** SKILL.md com 174 linhas e 692 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `f57b5bcc865a74dc7a1825f04b4b490574198d9349a2ab6cec2a3d55034d6af0`.

### DD-035 — Otimização da preparação de dados

Identificador: `claude-power-query-best-practices` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Estrutura auditoria por etapas, severidade, organização de consultas e contexto de fonte.

**Ponto de melhoria:** Documentar comprovação de folding por conector e testar fronteiras de filtros de atualização incremental antes de recomendar reorganização.

**Evidência na fonte:** Seções “Antes de qualquer auditoria”, “Checklist mestre rápido” e orientações sobre query folding e RangeStart/RangeEnd.

**Alteração sugerida:** Criar matriz de suporte da fonte, evidência de folding e teste de fronteira temporal; tratar Table.Buffer como decisão contextual e comparar contagens e tipos após a mudança.

**Cenário candidato de validação:** O filtro no lugar certo. Consulta fictícia em [CONSULTA_M], origem descrita em [FONTE] e filtro de período definido em [REGRA_PERIODO]; credenciais não devem ser incluídas.

**Entrega a conferir:** Revisão da consulta com etapas claras, hipóteses de folding e plano de comparação dos dados e da atualização.

**Critério de conferência:** Confira contagens e limites do período, além de comprovar folding com a ferramenta adequada quando a origem permitir.

**Rastreabilidade:** SKILL.md com 189 linhas e 1423 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `f7df3706505931f410db556c30b1c908bfecad49d2ae24bf1b929861ffec274a`.

### DD-036 — Visuais personalizados para dashboards Power BI

Identificador: `claude-powerbi-html-visuals` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Enuncia preservação dos dados e exige verificações visuais, numéricas e de filtros.

**Ponto de melhoria:** Adicionar um contrato de capacidades do visual hospedeiro, incluindo scripts, links, CSS e acessibilidade, antes de desenhar interações.

**Evidência na fonte:** Seções “Core principle: preserve the data, change the form”, “Validation is not optional” e “Data integrity checks”.

**Alteração sugerida:** Registrar visual instalado e versão, testar estados sem dados e dimensões pequenas, conferir contraste e rótulos; não transportar promessas de navegador completo para um visual HTML restrito.

**Cenário candidato de validação:** Uma participação dominante. Dados fictícios: categoria A com 90 e categoria B com 10. Visual existente em [MEDIDA_HTML] e contexto de filtros em [MODELO].

**Entrega a conferir:** Proposta de visual HTML em DAX com hierarquia, estados necessários e verificações para o hospedeiro Power BI.

**Critério de conferência:** Confira valores 90 e 10, resposta aos filtros, legibilidade dos rótulos e comportamento quando não houver dados.

**Rastreabilidade:** SKILL.md com 142 linhas e 1494 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `80165d20ce4354486c08ac232450311aa940c5d3d9b55626a4e3e02a6c1d1052`.

### DD-037 — Apresentações comerciais e executivas

Identificador: `claude-pptx` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Combina narrativa e composição editável com QA de conteúdo e renderização.

**Ponto de melhoria:** Acrescentar regressão para notas, fontes e identidade do template quando o trabalho parte de uma apresentação existente.

**Evidência na fonte:** Seções “Editing existing decks and templates”, “Deck content and flow” e “QA (Required)”.

**Alteração sugerida:** Criar fixture com notas, master e fonte ausente; comparar ordem, notas e renderização antes/depois e relatar limitações da ferramenta sem converter silenciosamente tudo em imagem.

**Cenário candidato de validação:** Uma escolha com critérios. Cenário fictício: alternativa A atende leitura; alternativa B atende leitura e edição. O critério obrigatório é edição. Modelo autorizado em [MODELO_PPTX].

**Entrega a conferir:** Apresentação editável com comparação baseada nos critérios fornecidos, notas úteis e registro de inspeção visual.

**Critério de conferência:** Confira se B é a única alternativa descrita com edição e se nenhuma informação ausente apareceu como fato no slide.

**Rastreabilidade:** SKILL.md com 272 linhas e 4248 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `5be220830c48d24d04cbfb44f5c0be737942ac2f6089185d4b8bb03c36c65f46`.

### DD-038 — Diagnóstico e evolução de soluções Protheus

Identificador: `claude-protheus-expert` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Reúne arquitetura, linguagem, dicionário e contexto funcional do ERP, permitindo análise transversal.

**Ponto de melhoria:** Contextualizar recomendações de banco e compatibilidade por release; evitar que padrões como leitura sem bloqueio sejam aplicados automaticamente.

**Evidência na fonte:** Seções “Releases e compatibilidade”, “Acesso a banco de dados” e “DICIONÁRIO DE DADOS”.

**Alteração sugerida:** Exigir release, banco, contexto transacional e homologação; acrescentar casos de filial, registros excluídos e consistência, além de revisão das referências oficiais aplicáveis antes de sugerir NOLOCK ou mudanças fiscais.

**Cenário candidato de validação:** A diferença entre filiais. Rotina fictícia em [FONTE_ADVPL], versão do ambiente em [VERSAO] e descrição da falha em [LOG_SEM_SEGREDOS]; o trabalho ocorrerá em [HOMOLOGACAO].

**Entrega a conferir:** Diagnóstico técnico e proposta de correção com dependências de ambiente, verificações de filial e plano de homologação.

**Critério de conferência:** Confira se a proposta identifica versão, campos e regras relevantes e se os testes cobrem filiais sem misturar seus dados.

**Rastreabilidade:** SKILL.md com 396 linhas e 2047 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `735ee3c003c700f9a66711a1831c7073de2c28b9e62b0340a4e3611e55f57c8c`.

### DD-039 — Revisão de segurança assistida no Claude Security

Identificador: `claude-security` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue análise, proposta de patch e verificação, evitando aplicar ou publicar correções automaticamente.

**Ponto de melhoria:** Impedir que um pacote isolado seja apresentado como plugin operacional ou sandbox de segurança já instalado.

**Evidência na fonte:** Seções “Environment and Paths (substituted at invocation, use verbatim)” e “What to say about safety, if asked”.

**Alteração sugerida:** Adicionar manifesto de componentes exigidos e preflight que detecte placeholders não substituídos; relatar indisponibilidade de workflow, agentes ou sandbox-runtime sem simular varredura nem proteção.

**Cenário candidato de validação:** Do alerta à evidência. Repositório fictício em [REPOSITORIO_AUTORIZADO], escopo permitido em [ESCOPO] e ferramentas do plugin ainda não confirmadas; nenhuma publicação está autorizada.

**Entrega a conferir:** Achados verificáveis e propostas de correção quando o ambiente permitir, ou um plano explícito diante de dependências ausentes.

**Critério de conferência:** Confirme que cada achado tem evidência rastreável e que propostas não foram tratadas como correções aplicadas ou publicadas.

**Rastreabilidade:** SKILL.md com 70 linhas e 631 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `58898a55aa8d086460bc4cc9c87e75b6198bf3b7cd55fe1fa231c0d66016480f`.

### DD-040 — Criação e avaliação de assistentes especializados

Identificador: `claude-skill-creator` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Mantém ciclo de intenção, escrita, avaliação, feedback e revisão de ativação.

**Ponto de melhoria:** Separar avaliação de qualidade de conteúdo da avaliação de disparo e registrar dependências por tipo de teste.

**Evidência na fonte:** Seções “Capture Intent”, “Skill Writing Guide” e fluxo de avaliação e otimização de descrição.

**Alteração sugerida:** Adicionar matriz de teste com ativação positiva/negativa, resultado esperado, baseline e avaliador; informar quando Claude CLI ou agentes faltam, sem tratar revisão subjetiva como ganho medido.

**Cenário candidato de validação:** Um procedimento que pode ser ensaiado. Procedimento fictício: revisar relatórios para separar fato, hipótese e pendência; texto de exemplo em [RELATORIO_EXEMPLO] e destino de autoria em [PASTA_SKILL].

**Entrega a conferir:** Rascunho de skill com critérios de ativação, exemplos contrastantes e plano de avaliação de comportamento.

**Critério de conferência:** Verifique se uma afirmação sem fonte é marcada como hipótese ou pendência, sem ganhar evidência inventada durante a revisão.

**Rastreabilidade:** SKILL.md com 507 linhas e 5651 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `bf6644e60a287f38980fc9414cf446aa701a8e08c2050bd9167cd156ca27d0c9`.

### DD-041 — Manutenção técnica de modelos TMDL

Identificador: `claude-tmdl` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Posiciona edição direta como último recurso e documenta indentação, nomes, identidades e propriedades.

**Ponto de melhoria:** Adicionar testes de preservação de identidade e rollback para mudanças pequenas que poderiam gerar objetos novos involuntariamente.

**Evidência na fonte:** Seções “When to Use This Skill”, “Critical”, “Object Nesting Rules” e “Syntax Rules”.

**Alteração sugerida:** Comparar lineageTag, nomes, fórmulas e relações antes/depois; validar via TOM, Tabular Editor ou ferramenta adequada, mantendo cópia restaurável e separando sintaxe TMDL de equivalência DAX.

**Cenário candidato de validação:** Formato sem trocar identidade. Modelo fictício em [PASTA_TMDL], medida [MEDIDA] e formato desejado [FORMAT_STRING]; nenhuma mudança de fórmula foi solicitada.

**Entrega a conferir:** Alteração mínima de formatação ou proposta para ferramenta apropriada, com diferenças e plano de validação do modelo.

**Critério de conferência:** Confira que lineageTag e fórmula são idênticos aos originais e que somente o formato solicitado mudou.

**Rastreabilidade:** SKILL.md com 456 linhas e 2776 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `0bd4e24752a38d26024b2c65eb39b90d05595429b977150446fd17f457144b0c`.

### DD-042 — Planilhas estruturadas e análises em Excel

Identificador: `claude-xlsx` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Exige fórmulas verificáveis, recálculo e compatibilidade do entregável, cobrindo armadilhas de openpyxl.

**Ponto de melhoria:** Apresentar restrições de funções como limitações do motor de validação escolhido, evitando proibições universais de recursos modernos do Excel.

**Evidência na fonte:** Seções “Recalculate (mandatory whenever the file contains formulas)” e “Choosing formulas that survive verification”.

**Alteração sugerida:** Adicionar matriz Excel/LibreOffice e versão, com suporte a funções e resultados armazenados; registrar recálculo não realizado quando o motor faltar, sem inventar valores de cache.

**Cenário candidato de validação:** O total precisa acompanhar a linha. Dados fictícios: item A, quantidade 3, preço 20; item B, quantidade 2, preço 15. Não há impostos, descontos ou frete neste exemplo.

**Entrega a conferir:** Arquivo XLSX com entradas organizadas, fórmulas de totais e registro do recálculo e das verificações disponíveis.

**Critério de conferência:** Confira totais de A igual a 60, B igual a 30 e geral igual a 90; altere uma quantidade em cópia para testar a fórmula.

**Rastreabilidade:** SKILL.md com 100 linhas e 1149 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `721494429ab9839b197f9d82ecb46cda58462e90455f7ab7e6df75d0030f177e`.

### DD-043 — Planilhas estruturadas — variante de preparação

Identificador: `claude-xlsx-staging` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Preserva o mesmo foco em fórmulas e recálculo da skill principal de planilhas.

**Ponto de melhoria:** Documentar a finalidade da variante staging e sincronizar restrições críticas, evitando divergência de comportamento para o mesmo arquivo.

**Evidência na fonte:** Mesmas seções “Requirements for every output”, “Recalculate” e “Dependencies” da variante principal.

**Alteração sugerida:** Adicionar relação explícita com claude-xlsx, versão e testes compartilhados para erros de fórmula e compatibilidade; não vender a variante como capacidade adicional.

**Cenário candidato de validação:** A fórmula e o aplicativo. Arquivo fictício em [ARQUIVO_XLSX], fórmula a revisar em [CELULA] e aplicativo de destino definido em [APLICATIVO_DESTINO]; não há autorização para sobrescrever o original.

**Entrega a conferir:** Cópia de teste e análise de compatibilidade da fórmula, com alternativa justificada e estado real do recálculo.

**Critério de conferência:** Confira se a regra foi preservada e se o arquivo foi testado no motor de destino, sem confundir gravação com recálculo.

**Rastreabilidade:** SKILL.md com 100 linhas e 1149 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `5df6339db52185fb2f9b75504b915659d132b1c188755700399b6a0f71e00809`.

### DD-044 — Revisão técnica de código

Identificador: `code-review-and-quality` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Revisão em cinco eixos com adaptação ao contexto DriveData e proteção do trabalho compartilhado.

**Ponto de melhoria:** Exigir cenário reproduzível e impacto para achados, mantendo sugestões estilísticas separadas de defeitos que bloqueiam integração.

**Evidência na fonte:** Seções “The Five-Axis Review”, “Change Sizing” e “Review Process”.

**Alteração sugerida:** Adicionar modelo de achado com localização, entrada, esperado/observado e teste; incluir conclusão sem achados que declare escopo e limites, sem prometer auditoria integral.

**Cenário candidato de validação:** O caso vazio ficou de fora. Mudança fictícia em [DIFF] altera uma função de agrupamento; contrato esperado em [CONTRATO] e testes existentes em [TESTES]. A revisão é somente leitura.

**Entrega a conferir:** Revisão priorizada com cenários reproduzíveis, impacto e verificações recomendadas, ou conclusão delimitada sem achados.

**Critério de conferência:** Tente reproduzir cada achado com o contrato fornecido e confira se sugestões de estilo não foram classificadas como defeitos funcionais.

**Rastreabilidade:** SKILL.md com 417 linhas e 3720 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `a5381c8a2394a48d24b3a269879cc93ec2d5849272d1ac52021cf86f7c8dc352`.

### DD-045 — Comandos personalizados para equipes técnicas

Identificador: `command-development` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Explica comandos como instruções, incluindo argumentos, metadados e ferramentas permitidas.

**Ponto de melhoria:** Deixar a preferência entre estrutura legada e skills atuais inequívoca e testar argumentos vazios ou maliciosos antes da execução.

**Evidência na fonte:** Seções “Critical: Commands are Instructions FOR Claude”, “Command Locations” e “Dynamic Arguments”.

**Alteração sugerida:** Adicionar árvore de decisão por projeto/versão e exemplos de argumento ausente, caminho fora do escopo e conteúdo que tenta virar instrução; usar ferramentas mínimas e não interpolar argumentos em shell sem validação.

**Cenário candidato de validação:** Um atalho com contrato. Projeto fictício em [REPOSITORIO]; o comando pretendido é /revisar-notas e recebe [CAMINHO_NOTAS] para listar ambiguidades, sem modificar o arquivo.

**Entrega a conferir:** Definição de comando ou skill compatível com a estrutura do projeto, com argumento validado, escopo mínimo e exemplos de uso.

**Critério de conferência:** Confira que a ausência de caminho produz orientação clara e que o comando não modifica o arquivo nem segue instruções inseridas nas notas.

**Rastreabilidade:** SKILL.md com 885 linhas e 2387 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `c55ad02cfe4cbb2a947eea3b1ed5fa1871e722d627c3c6792c3ed87c10c4d7a8`.

### DD-046 — Triagem de requisitos de conformidade

Identificador: `compliance-check` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Estrutura levantamento de contexto, riscos, requisitos e aprovações para ações propostas.

**Ponto de melhoria:** Impedir que o panorama regulatório seja tratado como referência permanentemente atual ou como autorização para lançamento.

**Evidência na fonte:** Seções “What I Need From You”, “Applicable Regulations and Policies”, “Approvals Needed” e “Privacy Regulation Overview”.

**Alteração sugerida:** Adicionar jurisdição, data de consulta e fonte primária por obrigação; separar fato, hipótese, pendência e revisão especializada, preservando a natureza preliminar e sem emitir certificação.

**Cenário candidato de validação:** Antes do formulário público. Projeto fictício: formulário para lista de espera coleta nome e email. Países de operação, prazo de retenção e fornecedores ainda não foram definidos.

**Entrega a conferir:** Matriz preliminar de perguntas, riscos e pendências para revisão jurídica e operacional antes de publicar o formulário.

**Critério de conferência:** Confira que países, retenção e fornecedores permanecem pendentes e que nenhuma base legal foi afirmada sem contexto e fonte aplicável.

**Rastreabilidade:** SKILL.md com 275 linhas e 2045 palavras no corpo; 1 links Markdown locais inspecionados. SHA-256 da fonte: `8dff8ebe7eda9ad5e38f3faf1016a7fc1eeba65bcdb7f5ae45ea507824bbc1c2`.

**Pendência estrutural:** referência ausente no pacote: `../../CONNECTORS.md`.

### DD-047 — Adaptação de assistentes aos processos da empresa

Identificador: `cowork-plugin-customizer` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue configuração genérica, ajuste pontual e adaptação ampla sem renomear o plugin.

**Ponto de melhoria:** O empacotamento exclui setup/ sem um relatório explícito dos arquivos removidos.

**Evidência na fonte:** Packaging the Plugin: excluir setup/* do ZIP.

**Alteração sugerida:** Acrescentar manifesto comparativo do pacote e confirmação de que setup/ não contém dependência referenciada.

**Cenário candidato de validação:** A reunião que mudou de lugar. Cenário fictício: o plugin [pasta-do-plugin] usa um canal antigo. A equipe combina atualizações às 9h em [canal-atual]; o restante do processo deve permanecer igual.

**Entrega a conferir:** Pacote .plugin revisado, acompanhado de um resumo das mudanças e das conexões pendentes.

**Critério de conferência:** Compare os arquivos alterados com o escopo e confirme que nomes e rotinas não solicitadas foram preservados.

**Rastreabilidade:** SKILL.md com 147 linhas e 1333 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `027b38d51e5ecc53b07cd11a00fbb6541ed9e79da043297951374480358c5d89`.

### DD-048 — Assistente de trabalho personalizado para Cowork

Identificador: `create-cowork-plugin` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Planeja componentes necessários e oferece validação manual quando a CLI falta.

**Ponto de melhoria:** A validação final é estrutural; falta um caso de ativação positiva e negativa por skill criada.

**Evidência na fonte:** Phase 5 valida manifesto, diretórios e SKILL.md; Best Practices recomenda começar pequeno.

**Alteração sugerida:** Incluir exemplos de invocação, esperado e limite de comportamento no roteiro de revisão, sem alegar execução quando o runtime não estiver disponível.

**Cenário candidato de validação:** Uma bancada para revisar propostas. Cenário fictício: uma equipe quer um plugin local para revisar a presença de objetivo, escopo e próximos passos em textos de proposta, sem acessar serviços externos.

**Entrega a conferir:** Estrutura mínima do plugin, documentação de uso e pacote .plugin validado estruturalmente.

**Critério de conferência:** Confirme a presença do manifesto e da skill e verifique se o fluxo não incluiu integrações desnecessárias.

**Rastreabilidade:** SKILL.md com 268 linhas e 1766 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `a4cb3a4624a8529099918c78bc931e97c993774ba9108bf9724fe54612ee38bb`.

### DD-049 — Diagnóstico e correção de falhas

Identificador: `debugging-and-error-recovery` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Preserva evidências, exige reprodução e separa correção de causa da correção de sintoma.

**Ponto de melhoria:** Exemplos de npm test usam flags de runners diferentes e podem falhar em projetos Node nativos.

**Evidência na fonte:** Step 1 mostra --grep e --testPathPattern apesar de orientar substituir pelo comando do repositório.

**Alteração sugerida:** Colocar descoberta do runner antes dos exemplos e apresentar uma tabela curta para node:test, Vitest e Jest, com comandos realmente compatíveis.

**Cenário candidato de validação:** O pedido que aparece duas vezes. Cenário fictício: na tela [rota-de-teste], clicar duas vezes em Salvar cria dois registros. Há logs autorizados em [arquivo-de-log] e código em [repositorio].

**Entrega a conferir:** Relato da reprodução, causa sustentada por evidências, correção focalizada e resultado da verificação.

**Critério de conferência:** Repita a sequência original e confira tanto a resposta da tela quanto a quantidade de registros criados.

**Rastreabilidade:** SKILL.md com 319 linhas e 2084 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `54789df96167b72060d5db86f97459f68c5c44a4559396786fc5402e9bfc4396`.

### DD-050 — Interfaces claras e com identidade

Identificador: `design-de-interface-autoral` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Relaciona identidade a uso, exige contraste computado, foco e recomposição móvel.

**Ponto de melhoria:** A lista de nunca mistura preferências do autor com problemas objetivos de acessibilidade.

**Evidência na fonte:** Princípios e regras: Nunca (cara de IA), incluindo neon, partículas e emojis.

**Alteração sugerida:** Separar restrições técnicas de preferências visuais e permitir exceções explícitas do briefing, com critério de validação para cada efeito.

**Cenário candidato de validação:** O próximo pedido visível. Cenário fictício: [rota-da-tela] apresenta pedidos abertos, atrasados e concluídos. A marca usa [arquivo-de-identidade], mas os estados hoje dependem apenas de cor.

**Entrega a conferir:** Tela piloto com direção visual, estados distinguíveis e registro das verificações realizadas.

**Critério de conferência:** Confirme que cada estado continua compreensível sem cor e que a ação principal funciona com teclado.

**Rastreabilidade:** SKILL.md com 127 linhas e 1440 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `7f44e9e9d20a806c19a94bdedc4f70b489d2ee82b860ca0dd54ec9ade12ca6ca`.

### DD-051 — Controle de acesso ao assistente pelo Discord

Identificador: `discord-access` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Não aceita aprovações por mensagens do canal e distingue IDs de usuário e conversa.

**Ponto de melhoria:** Leitura seguida de gravação pode sobrescrever pendências adicionadas pelo servidor entre as duas operações.

**Evidência na fonte:** Implementation notes: Always Read before Write, pois servidor pode adicionar pending entries.

**Alteração sugerida:** Adotar gravação atômica e verificação de versão/mtime ou API de mutação do servidor; em conflito reler e reaplicar a alteração específica.

**Cenário candidato de validação:** A porta antes da aprovação. Cenário fictício: o responsável quer revisar o arquivo local de acesso do canal Discord. Há um código pendente [codigo] e um canal de grupo [id-do-canal], ainda sem decisão de aprovação.

**Entrega a conferir:** Resumo do estado local e proposta explícita de política para o grupo, sem concessão automática de acesso.

**Critério de conferência:** Confira validade do código e correspondência entre usuário, conversa e canal; nenhum pendente deve ser aprovado por inferência.

**Rastreabilidade:** SKILL.md com 138 linhas e 545 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `ad9b015f10795e4df60f6ea677b359238d3d02d5f202d5d102898185f02095f3`.

### DD-052 — Configuração do canal Discord para assistentes

Identificador: `discord-configure` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue token lido no boot de política recarregada por mensagem.

**Ponto de melhoria:** Sugere passar token como argumento e revelar prefixo, aumentando exposição em histórico e relatórios.

**Evidência na fonte:** Dispatch <token> e status: show first 6 chars masked.

**Alteração sugerida:** Preferir entrada oculta ou secret store, reportar apenas configurado/não configurado e documentar permissões equivalentes no Windows.

**Cenário candidato de validação:** Pronto para quem?. Cenário fictício: existe um bot da equipe, mas sua conexão local ainda não foi verificada. O grupo autorizado será informado em [lista-de-ids]; nenhuma credencial deve aparecer no relatório.

**Entrega a conferir:** Diagnóstico de configuração com estado da credencial, política atual e próximos passos condicionados às informações disponíveis.

**Critério de conferência:** O relatório deve permitir entender o bloqueio sem expor token nem declarar o canal pronto quando falta acesso autorizado.

**Rastreabilidade:** SKILL.md com 100 linhas e 621 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `9950c2c60bcffec4d4ea971d518ab5a365a5ad8cff850eee0d4c7b2c2ebe82a9`.

### DD-053 — Padrões internos de colaboração

Identificador: `estilo-de-colaboracao` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Exige separar fato, hipótese, testes e pendências, com formato adequado ao destinatário.

**Ponto de melhoria:** A distribuição a terceiros carrega nomes pessoais, histórico de correções e regras específicas de um usuário.

**Evidência na fonte:** Visão geral e Regras que mudaram citam João, pessoas e decisões datadas.

**Alteração sugerida:** Criar variante pública parametrizada com preferências explícitas e remover histórico identificável, mantendo a original privada.

**Cenário candidato de validação:** Um status que permite decidir. Cenário fictício: uma tela piloto foi implementada e testada localmente. A publicação não ocorreu, e o aceite do responsável ainda está pendente.

**Entrega a conferir:** Rascunho de status adequado ao destinatário, com fatos verificados e decisão pendente claramente separados.

**Critério de conferência:** Confira se o texto não diz que a tela está publicada nem trata teste local como aceite.

**Rastreabilidade:** SKILL.md com 176 linhas e 2249 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `f1d81f769f24a84a76707c2b01a185f244c34c5298eb4b44611f4292833a5f9c`.

### DD-054 — Exemplo de estrutura de comando para plugins

Identificador: `example-command` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Mostra claramente layout e campos de invocação por argumentos.

**Ponto de melhoria:** A instrução Perform requested action é ampla para um exemplo que não define ação nem entradas válidas.

**Evidência na fonte:** Instructions, item 2: Perform the requested action using allowed tools.

**Alteração sugerida:** Trocar por operação demonstrativa sem efeitos externos e especificar erro para argumento ausente e resultado esperado.

**Cenário candidato de validação:** O primeiro argumento. Cenário fictício: o aprendiz quer entender um comando chamado mapa-rotina que receberia [nome-da-rotina], mas a ação de mapear ainda não será implementada.

**Entrega a conferir:** Esboço didático do comando, chamada ilustrativa e lista das partes que ainda precisam de implementação.

**Critério de conferência:** Confirme que argumentos e configuração estão explicados e que nenhuma ação inexistente foi apresentada como funcional.

**Rastreabilidade:** SKILL.md com 40 linhas e 137 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `d561981660827f3818b0daec456ae5b31894f68c22407d8c495a77b3105ba96d`.

### DD-055 — Exemplo de estrutura de skill

Identificador: `example-skill` · Prioridade: **Baixa** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Explica descrição de ativação, organização de referências e foco de domínio.

**Ponto de melhoria:** Recomenda testar ativação sem fornecer um exemplo verificável de caso positivo e negativo.

**Evidência na fonte:** Best Practices: Test that the skill activates for expected queries.

**Alteração sugerida:** Adicionar matriz pequena com pedido, ativar sim/não e motivo, deixando explícito que o template não implementa a especialidade.

**Cenário candidato de validação:** Quando chamar o organizador. Cenário fictício: será criada uma skill de estudo para organizar notas de leitura. Ela deve ser acionada por pedidos de resumo de notas, mas não por tradução de contratos.

**Entrega a conferir:** Modelo de SKILL.md com gatilhos, organização de referências e casos positivos e negativos de ativação.

**Critério de conferência:** Verifique se a descrição cobre notas de leitura sem prometer interpretar contratos ou pesquisar fontes.

**Rastreabilidade:** SKILL.md com 85 linhas e 323 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `87d90442621ace039aa3379805f99c3f95bf500e9f7b96f9e7876ac2dcf804f5`.

### DD-056 — Conexão entre componentes de design e código

Identificador: `figma-code-connect` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue templates parserless de .figma.tsx e cobre variantes, SLOT e INSTANCE_SWAP.

**Ponto de melhoria:** O texto contém tensão entre deixar o runtime tratar instâncias sem Code Connect e omitir qualquer instância não conectada.

**Evidência na fonte:** Rules and Pitfalls 2 diz runtime handles instances without Code Connect; item 7 manda omitir se não houver Code Connect.

**Alteração sugerida:** Definir uma política única por tipo de instância e incluir exemplos esperados para componente sem mapeamento.

**Cenário candidato de validação:** O botão com três tamanhos. Cenário fictício: [url-figma-com-node-id] aponta para um botão publicado. O componente correspondente está em [arquivo-do-componente]; os tamanhos do design precisam ser conferidos com o código.

**Entrega a conferir:** Template .figma.ts e mapa entre propriedades reais do design e do componente de código.

**Critério de conferência:** Verifique todos os tamanhos observados e confirme que o template não emite props inexistentes nem fixa ícones que deveriam variar.

**Rastreabilidade:** SKILL.md com 529 linhas e 3527 palavras no corpo; 5 links Markdown locais inspecionados. SHA-256 da fonte: `87af3996edb167d6aa3c044cb1bbb6a0d8e2d631c731bb896b1e1e8669640415`.

### DD-057 — Conexão entre componentes de design e código — variante FigQuery

Identificador: `figma-code-connect-figquery` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Mantém proteção contra props inventadas e cobertura exaustiva de variantes.

**Ponto de melhoria:** A variante muda o nome, mas mantém chamadas MCP genéricas sem explicar o contrato FigQuery necessário.

**Evidência na fonte:** Prerequisites e Steps 2/3 ainda usam get_code_connect_suggestions/get_context_for_code_connect.

**Alteração sugerida:** Adicionar matriz explícita de ferramentas FigQuery equivalentes e verificação de compatibilidade antes do fluxo; não sugerir que só o nome habilita backend.

**Cenário candidato de validação:** Conteúdo que não cabe num ícone. Cenário fictício: o componente [url-figma-com-node-id] contém uma região de conteúdo e uma propriedade de ícone. O código está em [arquivo-do-componente], e o acesso disponível é a variante FigQuery.

**Entrega a conferir:** Template parserless acompanhado da distinção entre slots, trocas de instância e props do componente.

**Critério de conferência:** Inspecione o tipo de cada propriedade e verifique que resultados estruturados não foram concatenados como texto.

**Rastreabilidade:** SKILL.md com 529 linhas e 3527 palavras no corpo; 5 links Markdown locais inspecionados. SHA-256 da fonte: `365093b7c0e4bb63d23107c4fab2047f58bbfdb6bd74e0059240f07982b32ee0`.

### DD-058 — Importação de interfaces e protótipos para Figma

Identificador: `figma-code-workflows` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Separa saída editável de código executável e exige confirmação real de importação.

**Ponto de melhoria:** A heurística de quantidade de telas pode escolher um destino não disponível quando a conta não tem Code Layers.

**Evidência na fonte:** Choose output exige code_layers_enabled e depois usa menos de 10 telas como heurística de Code Layer.

**Alteração sugerida:** Tornar a verificação de capacidade um filtro explícito anterior à heurística e documentar fallback sem mudar destino confirmado.

**Cenário candidato de validação:** Desenho editável, comportamento preservado na origem. Cenário fictício: [arquivo-html] contém uma tela estática de catálogo. O objetivo é criar camadas editáveis no arquivo Design [url-do-destino], mantendo o original intacto.

**Entrega a conferir:** Camadas editáveis no destino confirmado e relato do que foi preservado ou limitado na conversão.

**Critério de conferência:** Abra o arquivo retornado e confirme que há camadas editáveis, não apenas uma captura ou um destino de código diferente.

**Rastreabilidade:** SKILL.md com 48 linhas e 620 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `ac69b52d96a5d1b1832be9f0be99c221cfd861f8aad2260a0508386229982c7c`.

### DD-059 — Preparação de arquivos de design colaborativo

Identificador: `figma-create-new-file` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Resolve plano/editor e trata o grid inicial vazio de Slides.

**Ponto de melhoria:** Não descreve recuperação de criação com resposta perdida, podendo gerar arquivos duplicados ao repetir.

**Evidência na fonte:** Step 2 chama create_new_file e usa file_key; não há ramo de timeout ou resultado indeterminado.

**Alteração sugerida:** Antes de repetir uma criação inconclusiva, consultar arquivos recentes no plano ou registrar pendência e pedir revisão do resultado.

**Cenário candidato de validação:** A sala do workshop. Cenário fictício: será realizado um workshop chamado Mapa de Atendimento. O destino desejado é FigJam no plano [plano-escolhido]; ainda não existem notas ou diagramas.

**Entrega a conferir:** Arquivo FigJam criado no plano confirmado, com chave e link retornados pela ferramenta.

**Critério de conferência:** Confira nome, editor e plano no resultado real; não considere um link presumido como prova de criação.

**Rastreabilidade:** SKILL.md com 43 linhas e 250 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `bb7bc48c487f0ad7e738c23d0685bad5ec0bbbca8f5b5bb6295dc0666cc9ddf1`.

### DD-060 — Preparação de arquivos de design colaborativo — variante FigQuery

Identificador: `figma-create-new-file-figquery` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Preserva escolha explícita de plano e tipo de editor.

**Ponto de melhoria:** O conteúdo mantém o contrato genérico create_new_file sem declarar diferenças ou ausência delas no FigQuery.

**Evidência na fonte:** Step 2 exige fileName, planKey e editorType; o exemplo continua genérico.

**Alteração sugerida:** Documentar o adaptador FigQuery esperado, retorno file_key e teste mínimo de criação/consulta sem presumir compatibilidade.

**Cenário candidato de validação:** Antes da primeira página. Cenário fictício: o arquivo Slides chamado Revisão do Produto deve nascer em [plano-escolhido] pelo ambiente FigQuery. Nenhuma página ou conteúdo foi criado.

**Entrega a conferir:** Arquivo Slides no destino confirmado e orientação explícita para tratar a primeira página ausente.

**Critério de conferência:** Verifique se o retorno contém a chave real e se nenhuma propriedade foi lida de um slide inexistente.

**Rastreabilidade:** SKILL.md com 43 linhas e 250 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `10376d0f36677cb078d2a314a46504d869223402c09d7ae8e5681fe245cbf8b0`.

### DD-061 — Implementação de telas a partir do Figma

Identificador: `figma-design-to-code` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Exige contexto detalhado, reutilização de componentes e verificação de todos os recursos visuais.

**Ponto de melhoria:** A verificação enfatiza geometria de assets, mas não define prova mínima de interações e acessibilidade implementadas.

**Evidência na fonte:** Implementation exige interactive code; Verification lista sobretudo slots, callsites e geometria.

**Alteração sugerida:** Adicionar critérios de teclado, estados de erro/carregamento e ação principal por tela, proporcionais ao contrato fornecido.

**Cenário candidato de validação:** Um perfil que também funciona. Cenário fictício: [url-figma-com-node-id] mostra uma tela de perfil. O projeto [repositorio] já tem componentes de formulário e as ações devem usar [contrato-de-interacao].

**Entrega a conferir:** Tela implementada no projeto e comparação visual do escopo, com estados e recursos verificados.

**Critério de conferência:** Confirme que a captura não foi usada como a própria interface e que componentes e ações respondem conforme o contrato.

**Rastreabilidade:** SKILL.md com 29 linhas e 514 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `a6e852421e4db72260b2ca641929b1f84684e5b067aead081e35111f5b5feee4`.

### DD-062 — Implementação de telas a partir do Figma — variante FigQuery

Identificador: `figma-design-to-code-figquery` · Prioridade: **Baixa** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Não permite implementar a partir de contexto esparso e pede detalhes dos nós visíveis.

**Ponto de melhoria:** O parâmetro de rastreamento usa o nome da skill base, tornando a variante indistinguível na telemetria.

**Evidência na fonte:** Context: incluir figma-design-to-code em skillNames, mesmo nesta variante -figquery.

**Alteração sugerida:** Registrar o identificador real da variante quando o schema permitir e documentar a compatibilidade do backend em vez de copiar a referência sem distinção.

**Cenário candidato de validação:** A moldura não é a tela. Cenário fictício: a lista em [url-figma-com-node-id] tem filtros e estado vazio. A resposta inicial pode ser esparsa; a implementação fica em [repositorio] usando FigQuery.

**Entrega a conferir:** Implementação da lista sustentada pelo contexto dos nós inspecionados, com lacunas explicitadas.

**Critério de conferência:** Verifique que cada região implementada tem contexto real e que recursos não dependem de URLs temporárias do Figma.

**Rastreabilidade:** SKILL.md com 29 linhas e 514 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `891e0904080ec2fee729dc52ed809e58f52ddccd32bfc002f83dc1dd69477a28`.

### DD-063 — Prototipação de telas e jornadas

Identificador: `figma-generate-design` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Exige camadas editáveis e leitura estrutural final.

**Ponto de melhoria:** A exceção html_to_figma precisa dos mesmos critérios de componentes e variáveis.

**Evidência na fonte:** HTML import exceptions; Final validation

**Alteração sugerida:** Acrescentar verificação explícita de editabilidade, fontes e vínculos após html_to_figma.

**Cenário candidato de validação:** Reservas que continuam editáveis. Cenário fictício: página de reservas com foto, datas e botão. Forneça [REPOSITÓRIO], [URL_LOCAL] e [ARQUIVO_FIGMA].

**Entrega a conferir:** Tela composta por camadas editáveis e registro das referências utilizadas.

**Critério de conferência:** Confira se título e botão são editáveis, sem uma imagem única substituindo a interface.

**Rastreabilidade:** SKILL.md com 477 linhas e 5155 palavras no corpo; 3 links Markdown locais inspecionados. SHA-256 da fonte: `9631818ea71468dd6ccd65edd77922e9bf43f279910ba11256db636049d17de8`.

### DD-064 — Prototipação de telas e jornadas — variante FigQuery

Identificador: `figma-generate-design-figquery` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Construção por seções com $fig e validação visual localizada.

**Ponto de melhoria:** Afirma atomicidade universal de scripts falhos, divergindo do contrato mais cauteloso da versão padrão.

**Evidência na fonte:** Retry ... failed scripts are atomic

**Alteração sugerida:** Substituir a garantia por leitura de safeToRetryWithoutCanvasRead e inspeção de estado quando necessária.

**Cenário candidato de validação:** Produto em três seções. Cenário fictício: página com galeria, descrição e compra. Insumos: [REPOSITÓRIO], [URL_LOCAL], [ARQUIVO_FIGMA].

**Entrega a conferir:** Composição seccionada com instâncias, imagens e referências verificáveis.

**Critério de conferência:** Verifique backend, conteúdo das três seções e ausência de duplicatas após falhas.

**Rastreabilidade:** SKILL.md com 440 linhas e 3825 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `418c84104f837cebec4d5cc72d09f0e68de3ec811f4090dbd424a36c11c5131f`.

### DD-065 — Mapeamento visual de processos e arquitetura

Identificador: `figma-generate-diagram` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Delimita Mermaid suportado e evita inventar relações.

**Ponto de melhoria:** Falta critério explícito para verificar cardinalidade e caminhos depois da geração.

**Evidência na fonte:** Supported Diagram Types; Best Practices

**Alteração sugerida:** Exigir comparação das arestas e condições renderizadas com uma lista derivada do pedido.

**Cenário candidato de validação:** A rota da devolução. Cenário fictício: receber item; inspecionar; se aprovado, reembolsar; se recusado, comunicar motivo. Responsável pela inspeção desconhecido.

**Entrega a conferir:** Fluxograma com duas saídas de decisão e responsabilidade pendente explícita.

**Critério de conferência:** Confira se os caminhos aprovado e recusado não convergem para reembolso.

**Rastreabilidade:** SKILL.md com 113 linhas e 1378 palavras no corpo; 11 links Markdown locais inspecionados. SHA-256 da fonte: `adba7dac2ab2008aa5d030d0fc8163b7fdafdbd6fd8cdb738b8bb013cabfe5c2`.

### DD-066 — Mapeamento visual de processos e arquitetura — variante FigQuery

Identificador: `figma-generate-diagram-figquery` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Extensões híbridas respeitam APIs exclusivas do FigJam.

**Ponto de melhoria:** O nome da variante não explica quais ferramentas o backend precisa oferecer.

**Evidência na fonte:** Hybrid workflow; generate_diagram

**Alteração sugerida:** Adicionar detecção de generate_diagram e use_figma compatível com FigJam, com fallback descritivo quando ausentes.

**Cenário candidato de validação:** Cadastro de biblioteca. Cenário fictício: cada empréstimo tem um leitor e um exemplar; leitores e exemplares podem ter vários empréstimos históricos.

**Entrega a conferir:** Diagrama de três entidades com relações históricas explicitadas.

**Critério de conferência:** Confira duas relações um para muitos, sem presumir empréstimos simultâneos permitidos.

**Rastreabilidade:** SKILL.md com 113 linhas e 1378 palavras no corpo; 11 links Markdown locais inspecionados. SHA-256 da fonte: `5b6e74761ef4af424af0a3498da26f03140f1960d3e00df1b39fc941c0d82c9b`.

### DD-067 — Sistema de design e biblioteca de componentes

Identificador: `figma-generate-library` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Escopos separados evitam transformar um botão em biblioteca inteira.

**Ponto de melhoria:** A persistência do ledger não define versão nem reconciliação após alteração externa.

**Evidência na fonte:** State persistence; Resume protocol

**Alteração sugerida:** Registrar fileKey, versão do formato e última leitura; reconciliar IDs removidos ou alterados antes da retomada.

**Cenário candidato de validação:** Uma família de botões. Cenário fictício: Button tem tamanhos S e M, estados Default e Disabled. Fonte de verdade: [REPOSITÓRIO]; destino: [ARQUIVO_FIGMA].

**Entrega a conferir:** Família com quatro variantes, vínculos de tokens e quadro de revisão.

**Critério de conferência:** Confira quatro combinações distintas e variáveis vinculadas, sem expandir para uma biblioteca completa.

**Rastreabilidade:** SKILL.md com 344 linhas e 3311 palavras no corpo; 17 links Markdown locais inspecionados. SHA-256 da fonte: `7d285e5dfe7e7cb12d0244b734bb22c19f46cd190cdb7c309827a5217e29a203`.

### DD-068 — Sistema de design e biblioteca de componentes — variante FigQuery

Identificador: `figma-generate-library-figquery` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Registro de IDs, aliases e vínculos reduz inconsistências de bibliotecas.

**Ponto de melhoria:** Obriga 20–100 chamadas e fases de biblioteca inteira mesmo para componente isolado.

**Evidência na fonte:** This is NEVER a one-shot task; Phase 0 anti-patterns

**Alteração sugerida:** Portar o contrato de escopo da variante padrão; remover mínimo artificial de chamadas e limitar documentação ao solicitado.

**Cenário candidato de validação:** Biblioteca com fronteira definida. Cenário fictício: biblioteca inicial inclui Button e Badge, com modos Light e Dark. Insumos: [REPOSITÓRIO] e [ARQUIVO_FIGMA].

**Entrega a conferir:** Biblioteca delimitada e registro de construção com evidências por fase.

**Critério de conferência:** Confira inventário, modos e IDs reais antes de retomar qualquer criação.

**Rastreabilidade:** SKILL.md com 377 linhas e 3312 palavras no corpo; 17 links Markdown locais inspecionados. SHA-256 da fonte: `9609e97a5de5653df7c2e39f3d404c643565ca0a8850d5d9047b88083d7e2232`.

### DD-069 — Ferramentas generativas para Figma

Identificador: `figma-generative-plugins` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Proíbe segredos e exige substituir scaffold por interface funcional.

**Ponto de melhoria:** Atualização aceita não comprova funcionamento real da ação no editor.

**Evidência na fonte:** Success condition: non-error update

**Alteração sugerida:** Adicionar checklist de teste de entrada vazia, seleção e resultado; separar compilação de execução observada.

**Cenário candidato de validação:** Nomes de quadros em ordem. Cenário fictício: quadros selecionados devem receber o prefixo REV_. O plugin terá campo de prefixo, botão e mensagem de resultado.

**Entrega a conferir:** Código e interface de plugin com escopo restrito à seleção.

**Critério de conferência:** Teste seleção vazia, um quadro e múltiplos quadros; confira o estado informado.

**Rastreabilidade:** SKILL.md com 54 linhas e 638 palavras no corpo; 1 links Markdown locais inspecionados. SHA-256 da fonte: `b97eb184a1f6b6545f3b8266a4d1a1e29304888904db7daed2864b9fd036b124`.

### DD-070 — Ferramentas generativas para Figma — variante FigQuery

Identificador: `figma-generative-plugins-figquery` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Exige leitura integral dos arquivos e preservação de controles existentes.

**Ponto de melhoria:** Fonte idêntica à variante padrão salvo nome não define disponibilidade ou diferenças do adaptador.

**Evidência na fonte:** name: figma-generative-plugins-figquery

**Alteração sugerida:** Documentar matriz de capacidades do backend e tratar ausência de create/update sem presumir suporte.

**Cenário candidato de validação:** Três cores na bancada. Cenário fictício: paleta local #123456, #42A5F5 e #FFFFFF. A extensão cria amostras rotuladas somente após ação do usuário.

**Entrega a conferir:** Plugin de paleta local com validação de entrada e resultado visível.

**Critério de conferência:** Confira três amostras rotuladas e rejeição de um hexadecimal inválido.

**Rastreabilidade:** SKILL.md com 54 linhas e 638 palavras no corpo; 1 links Markdown locais inspecionados. SHA-256 da fonte: `60377551324ec87cd29546a990f53a6c515b6636b53607e49f246e7c5dfcb89c`.

### DD-071 — Animações de interface implementadas no produto

Identificador: `figma-implement-motion` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Associa movimento por ID exato e exige reduced motion.

**Ponto de melhoria:** O limite recursivo de 500 nós não tem procedimento explícito para inventário maior.

**Evidência na fonte:** recursive: true (capped at 500 nodes)

**Alteração sugerida:** Adicionar particionamento por subárvore e deduplicação de IDs com detecção de truncamento.

**Cenário candidato de validação:** Confirmação em movimento. Cenário fictício: cartão animado em [URL_FIGMA] e componente correspondente em [REPOSITÓRIO].

**Entrega a conferir:** Código de animação integrado à estrutura existente e relato da verificação.

**Critério de conferência:** Compare um ciclo inteiro e teste prefers-reduced-motion sem perder conteúdo.

**Rastreabilidade:** SKILL.md com 150 linhas e 3140 palavras no corpo; 16 links Markdown locais inspecionados. SHA-256 da fonte: `24a0a8cc64e1b43d8c4323baf719f95d35e3ce39a7bad36b6f0828faa0029e10`.

### DD-072 — Animações de interface implementadas no produto — variante FigQuery

Identificador: `figma-implement-motion-figquery` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Preserva transformOrigin e separa transforms estáticos e animados.

**Ponto de melhoria:** Orienta referências diretas a URLs temporárias de assets, que podem expirar na aplicação.

**Evidência na fonte:** Critical Rule 6: Reference the URL directly

**Alteração sugerida:** Alinhar à versão padrão: persistir assets autorizados localmente e usar caminhos duráveis.

**Cenário candidato de validação:** Sinais na mesma linha. Cenário fictício: três elementos animados em [URL_FIGMA], com implementação alvo em [REPOSITÓRIO].

**Entrega a conferir:** Sequência implementada com associação por instância e coordenação de timeline.

**Critério de conferência:** Confira ordem, repetição e isolamento das instâncias ao longo do ciclo.

**Rastreabilidade:** SKILL.md com 147 linhas e 3080 palavras no corpo; 16 links Markdown locais inspecionados. SHA-256 da fonte: `687819c3866c1227224088bc43fb0ac2b05ad85e6380a4dad93dd6d6ecb16208`.

### DD-073 — Efeitos visuais personalizados para Figma

Identificador: `figma-shaders` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue fill/effect e sincroniza metadados de animação e mouse.

**Ponto de melhoria:** Compilação aceita é tratada como sucesso sem separar validade visual.

**Evidência na fonte:** Treat a non-error update_shader result as success

**Alteração sugerida:** Diferenciar publicação de fonte, compilação e teste visual; registrar verificação ou pendência.

**Cenário candidato de validação:** Papel digital ajustável. Cenário fictício: preenchimento estático de ruído suave, cor base #E8E2D4 e intensidade ajustável de 0 a 1.

**Entrega a conferir:** Shader de preenchimento com controles de cor e intensidade.

**Critério de conferência:** Confira tipo fill, limites dos controles e ausência de dependência de tempo.

**Rastreabilidade:** SKILL.md com 57 linhas e 768 palavras no corpo; 1 links Markdown locais inspecionados. SHA-256 da fonte: `c7e34c5a4eb316cfe84768cb419fe71b3ce840b29561ecd0f90eb402a72e1adf`.

### DD-074 — Efeitos visuais personalizados para Figma — variante FigQuery

Identificador: `figma-shaders-figquery` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Controla limites de parâmetros e impede contornar capacidade bloqueada.

**Ponto de melhoria:** Atualizações não documentam preservação explícita de valores de instâncias existentes.

**Evidência na fonte:** Preserve existing controls and behavior

**Alteração sugerida:** Antes de renomear ou remover controles, comparar schema atual e impacto em instâncias, com migração descrita.

**Cenário candidato de validação:** Pixels sob controle. Cenário fictício: efeito estático de pixelização sobre uma camada; controle de tamanho dos blocos entre 2 e 32.

**Entrega a conferir:** Efeito de pixelização com controle limitado e fonte atualizada.

**Critério de conferência:** Confira leitura da camada, transparência e comportamento nos extremos 2 e 32.

**Rastreabilidade:** SKILL.md com 57 linhas e 768 palavras no corpo; 1 links Markdown locais inspecionados. SHA-256 da fonte: `381ed04482d49aea7d961fc43221cb03d68c502235f0a72d9440f67bb1f47254`.

### DD-075 — Especificações de produto colaborativas

Identificador: `figma-spec` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Edição pontual preserva comentários e exige plano correto.

**Ponto de melhoria:** Não esclarece como tratar edição concorrente entre getContent e editContent.

**Evidência na fonte:** editContent requires exactly one match

**Alteração sugerida:** Se contexto mudou, reler e recalcular alvo; nunca substituir documento como fallback.

**Cenário candidato de validação:** Um requisito mais preciso. Cenário fictício: em [URL_SPEC], substituir a única frase “Salvar os dados” por “Salvar os dados e mostrar confirmação”.

**Entrega a conferir:** Edição pontual de uma especificação e confirmação por leitura do conteúdo.

**Critério de conferência:** Confira ocorrência única, comentários preservados e ausência de substituição integral.

**Rastreabilidade:** SKILL.md com 114 linhas e 809 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `7bc6c406d19906217724279f254d773193bac45d385b35d5db6b58673c73f7e3`.

### DD-076 — Integração de design e interfaces iOS

Identificador: `figma-swiftui` · Prioridade: **Baixa** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Reconhece padrões iOS e cores semânticas em ambos os sentidos.

**Ponto de melhoria:** Gatilho inclui qualquer menção a iOS mesmo sem tradução Figma.

**Evidência na fonte:** Use whenever ... iOS, iPhone, or iPad

**Alteração sugerida:** Restringir gatilho a tarefa de tradução ou sincronização Figma/SwiftUI e incluir exemplos negativos.

**Cenário candidato de validação:** Lista de leitura nativa. Cenário fictício: tela de lista em [URL_FIGMA]; projeto SwiftUI em [PROJETO_IOS]. Direção desejada: design para código.

**Entrega a conferir:** Implementação SwiftUI alinhada aos padrões identificados e limitações registradas.

**Critério de conferência:** Confira nomes dos símbolos, cores semânticas e adaptação do texto sem coordenadas rígidas desnecessárias.

**Rastreabilidade:** SKILL.md com 37 linhas e 438 palavras no corpo; 4 links Markdown locais inspecionados. SHA-256 da fonte: `e3515f157db7a9006dbbf0b528b2499dcdc7565b09009f9411231b605b94ce7f`.

### DD-077 — Integração de design e interfaces iOS — variante FigQuery

Identificador: `figma-swiftui-figquery` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Mantém nomes SF Symbols e direciona referências por sentido.

**Ponto de melhoria:** Não define checagem do suporte getSfSymbolCharacter no backend da variante.

**Evidência na fonte:** figma.util.getSfSymbolCharacter(name)

**Alteração sugerida:** Checar capacidade antes de gravar; relatar símbolo não suportado sem mapear codepoint manualmente.

**Cenário candidato de validação:** O código volta ao quadro. Cenário fictício: vista SwiftUI em [ARQUIVO_SWIFT] e destino [ARQUIVO_FIGMA]. Direção: código para design.

**Entrega a conferir:** Representação Figma editável da vista SwiftUI com diferenças documentadas.

**Critério de conferência:** Confira os símbolos por nome e a correspondência entre tokens, estrutura e referência.

**Rastreabilidade:** SKILL.md com 37 linhas e 438 palavras no corpo; 4 links Markdown locais inspecionados. SHA-256 da fonte: `0744da018fc3e8158ea2684b69c447bfb5295f1e59699715e16df5ff083f7454`.

### DD-078 — Operação assistida de arquivos Figma

Identificador: `figma-use` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Contratos detalhados de fontes, tipos, retorno de IDs e recuperação.

**Ponto de melhoria:** Writes entre páginas são explicitamente paralelos, em conflito com generate-library.

**Evidência na fonte:** Page Rules: reads and writes alike; library Rule 13

**Alteração sugerida:** Definir precedência por backend e serializar mutações que compartilham documento, variáveis ou dependências.

**Cenário candidato de validação:** Uma troca de rótulo. Cenário fictício: em [URL_FIGMA], o nó [NODE_ID] contém “Continuar” e deve receber “Revisar pedido”.

**Entrega a conferir:** Rótulo alterado com ID registrado e encaixe visual conferido.

**Critério de conferência:** Confira texto, fonte e largura, além da ausência de mudanças em outros nós.

**Rastreabilidade:** SKILL.md com 381 linhas e 4512 palavras no corpo; 26 links Markdown locais inspecionados. SHA-256 da fonte: `e6d7a9f8b12732bf36fde1e068d8135feee7de249d8119fe71fa007e1ab0b66f`.

### DD-079 — Quadros colaborativos para planejamento

Identificador: `figma-use-figjam` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue inspeção get_figjam e proíbe createPage no editor errado.

**Ponto de melhoria:** Orienta schema discovery com ToolSearch específico de outro host.

**Evidência na fonte:** Deferred Tools — Batch-Load Schemas

**Alteração sugerida:** Adicionar descoberta por capacidades do host e fallback de ferramentas indisponíveis sem presumir ToolSearch.

**Cenário candidato de validação:** Retrospectiva em três espaços. Cenário fictício: Manter: revisão conjunta; Mudar: pedidos sem contexto; Experimentar: checklist de entrada. Destino: [URL_FIGJAM].

**Entrega a conferir:** Quadro com três seções e três notas editáveis.

**Critério de conferência:** Confira conteúdo completo, ausência de sobreposição e IDs das notas.

**Rastreabilidade:** SKILL.md com 65 linhas e 858 palavras no corpo; 14 links Markdown locais inspecionados. SHA-256 da fonte: `757a419aaf704fd9d3cefef0a3e1ba2a6be2fee31c2aea4396d70e7209f74f74`.

### DD-080 — Quadros colaborativos para planejamento — variante FigQuery

Identificador: `figma-use-figjam-figquery` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Mantém receita de fontes e endpoints para quadros FigJam.

**Ponto de melhoria:** Referências de mutação podem usar API raw que a base FigQuery restringe.

**Evidência na fonte:** Text Mutations; base $fig all node creation

**Alteração sugerida:** Declarar quais tipos FigJam exigem raw API e verificar compatibilidade das receitas com builder antes da escrita.

**Cenário candidato de validação:** Duas rotas de atendimento. Cenário fictício: notas existentes [ID_ENTRADA], [ID_TÉCNICO] e [ID_COMERCIAL] em [URL_FIGJAM]; rotas “Dúvida técnica” e “Orçamento”.

**Entrega a conferir:** Dois conectores rotulados entre notas confirmadas.

**Critério de conferência:** Confira endpoints, rótulos e ausência de duplicatas ou alterações nas notas.

**Rastreabilidade:** SKILL.md com 65 linhas e 858 palavras no corpo; 14 links Markdown locais inspecionados. SHA-256 da fonte: `a8cd8a3e38c8e72621b7df362108b96b9446c0e653e3652779e6960147583e47`.

### DD-081 — Operação assistida de arquivos Figma — variante FigQuery

Identificador: `figma-use-figquery` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Explica plano versus nó materializado e flush automático.

**Ponto de melhoria:** Proíbe get_design_context enquanto skills consumidoras FigQuery o exigem.

**Evidência na fonte:** Critical Rule 13: Never call get_design_context

**Alteração sugerida:** Criar contrato único de leitura FigQuery e adaptar design-to-code, implement-motion e SwiftUI ao contexto realmente suportado. Remover teto arbitrário de três leituras quando houver lacunas.

**Cenário candidato de validação:** Etiquetas com espaçamento comum. Cenário fictício: em [ARQUIVO_FIGMA], os containers [ID_1] e [ID_2] precisam de gap 12; demais propriedades devem permanecer.

**Entrega a conferir:** Dois containers ajustados com valores e IDs confirmados.

**Critério de conferência:** Confira gap 12 em ambos e nenhuma alteração fora dos dois IDs.

**Rastreabilidade:** SKILL.md com 292 linhas e 3318 palavras no corpo; 26 links Markdown locais inspecionados. SHA-256 da fonte: `859fe72151773d67ddb301eee656dfd32aa799088aaafed02d6f789ce74536d4`.

### DD-082 — Prototipação de movimento e microinterações

Identificador: `figma-use-motion` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue screenshot estático de verificação temporal e controla capacidades.

**Ponto de melhoria:** Sugere ignorar export sem extrator sem classificar a verificação resultante.

**Evidência na fonte:** Without a frame extractor ... reason about keyframes

**Alteração sugerida:** Rotular resultado como validação estrutural quando movimento não foi observado e indicar como obter evidência temporal depois.

**Cenário candidato de validação:** Uma entrada discreta. Cenário fictício: descendente [NODE_ID] de [FRAME_ID], em [ARQUIVO_FIGMA], deve passar de opacidade 0 a 1 em 1 segundo.

**Entrega a conferir:** Animação no arquivo Figma e evidência disponível da sua timeline.

**Critério de conferência:** Confira opacidade inicial e final, duração e preservação das trilhas anteriores.

**Rastreabilidade:** SKILL.md com 91 linhas e 1120 palavras no corpo; 9 links Markdown locais inspecionados. SHA-256 da fonte: `4e83f7680159bbcff204ce2b9ad222bf8884109e805c9fd521451b4ac2205972`.

### DD-083 — Prototipação de movimento e microinterações — variante FigQuery

Identificador: `figma-use-motion-figquery` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Recusa capacidades bloqueadas e usa campos públicos de motion.

**Ponto de melhoria:** Afirma feature flag metronome e não cobre estilos customizados existentes na versão padrão.

**Evidência na fonte:** Runtime Gating; brand-new animation style ... stop

**Alteração sugerida:** Versionar matriz de capacidades e usar descoberta efetiva em vez de flag interna fixa; explicitar diferença funcional da variante.

**Cenário candidato de validação:** Marcador com pulso. Cenário fictício: [NODE_ID] dentro de [FRAME_ID], em [ARQUIVO_FIGMA]; escala 1, 1.1 e 1 nos tempos 0, 0.5 e 1 segundo.

**Entrega a conferir:** Trilha de escala configurada ou limitação de capacidade explicitada.

**Critério de conferência:** Confira os três valores e tempos, sem alterar conteúdo nem trilhas não solicitadas.

**Rastreabilidade:** SKILL.md com 81 linhas e 908 palavras no corpo; 4 links Markdown locais inspecionados. SHA-256 da fonte: `c3966508d9a2da57b9d7f56f67dd11171c392b859ea1bae9497a9f58a48efced`.

### DD-084 — Apresentações colaborativas no Figma

Identificador: `figma-use-slides` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Preserva slides existentes e corrige ordem appendChild antes de posicionar.

**Ponto de melhoria:** Regra 4 manda retornar posições em closePlugin, proibido pela base use_figma.

**Evidência na fonte:** Critical Rules 4: closePlugin() output

**Alteração sugerida:** Substituir por return estruturado e adicionar verificação estática para referências conflitantes de lifecycle.

**Cenário candidato de validação:** Uma proposta em três cenas. Cenário fictício: problema — arquivos dispersos; proposta — biblioteca organizada; próximo passo — revisar um piloto. Destino: [ARQUIVO_SLIDES], marca: [GUIA_VISUAL].

**Entrega a conferir:** Deck de três slides com narrativa, identidade e elementos editáveis.

**Critério de conferência:** Confira as três mensagens, legibilidade e inexistência de números inventados.

**Rastreabilidade:** SKILL.md com 215 linhas e 3200 palavras no corpo; 16 links Markdown locais inspecionados. SHA-256 da fonte: `965e5d6c8f7bcebef131d7bf451f16c0a4810f089eeba307609e8b883fb6a7bb`.

### DD-085 — Apresentações colaborativas no Figma — variante FigQuery

Identificador: `figma-use-slides-figquery` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Notas de apresentador complementam conteúdo sem alterar telas.

**Ponto de melhoria:** Repete orientação closePlugin incompatível e pode herdar chamadas raw inválidas no builder.

**Evidência na fonte:** Critical Rules 4; base FigQuery auto-flush

**Alteração sugerida:** Adaptar exemplos de Slides ao retorno FigDoneResult ou return e validar recipes no runtime FigQuery antes de distribuir.

**Cenário candidato de validação:** Uma ponte entre slides. Cenário fictício: [ID_SLIDE_1] explica arquivos dispersos; [ID_SLIDE_2] apresenta biblioteca organizada, em [ARQUIVO_SLIDES].

**Entrega a conferir:** Notas de apresentação em dois slides existentes, preservando o deck.

**Critério de conferência:** Confira se notas complementam a fala e não alteram o conteúdo visível.

**Rastreabilidade:** SKILL.md com 215 linhas e 3200 palavras no corpo; 16 links Markdown locais inspecionados. SHA-256 da fonte: `e72e2f286623423ac253d8d60ecfe96351ce04b1741fe03bd13670cc94f13504`.

### DD-086 — Design de interfaces com identidade própria

Identificador: `frontend-design` · Prioridade: **Baixa** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Liga direção visual ao assunto, escrita clara e acessibilidade.

**Ponto de melhoria:** Lista de tendências genéricas pode envelhecer e virar nova fórmula rígida.

**Evidência na fonte:** For calibration, AI-generated design right now clusters

**Alteração sugerida:** Datar exemplos de tendências e pedir justificativa ligada ao brief; acrescentar critérios observáveis para hierarquia e legibilidade.

**Cenário candidato de validação:** Uma feira com matéria própria. Cenário fictício: feira de cerâmica; objetivo da página: apresentar peças e permitir inscrição. Insumos: [FOTOS], [TEXTOS] e [REPOSITÓRIO].

**Entrega a conferir:** Página com direção visual específica e verificação de uso responsivo.

**Critério de conferência:** Confira se o conteúdo orienta o design e se a inscrição é compreensível e acessível.

**Rastreabilidade:** SKILL.md com 72 linhas e 1477 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3`.

### DD-087 — Aplicações web sob medida

Identificador: `fullstack-nextjs-vercel` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Confere URL real, ambiente e build completo antes de declarar publicação.

**Ponto de melhoria:** Receitas fixam versões de correção CVE e limites de plataforma que envelhecem.

**Evidência na fonte:** Vulnerable version ... 16.0.7; limites 4,5 MB

**Alteração sugerida:** Separar casos históricos de orientação vigente e exigir consulta à versão corrigida e limites atuais antes da receita.

**Cenário candidato de validação:** A rota que desaparece. Cenário fictício: app Vite em [REPOSITÓRIO]; /catalogo abre por navegação, mas retorna 404 ao recarregar em [URL_PREVIEW].

**Entrega a conferir:** Correção de configuração e evidências de navegação direta na prévia.

**Critério de conferência:** Teste recarga em /catalogo e confirme que /api continua usando seu destino correto.

**Rastreabilidade:** SKILL.md com 119 linhas e 1338 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `d9bf31922c3af0be3e69114d98b06a94c774a8ee11a187f479c494129c5f0445`.

### DD-088 — Plano visual de projeto e entregas

Identificador: `generate-project-plan` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Parte do PRD e torna explícitas lacunas por seção.

**Ponto de melhoria:** Afirma scripts atômicos e exige confirmação a cada microetapa, além de hexadecimal inválido.

**Evidência na fonte:** Operational rules atomic; palette #FFEC BD

**Alteração sugerida:** Usar contrato safeToRetryWithoutCanvasRead, consolidar decisões já autorizadas e corrigir/validar hexadecimais na paleta.

**Cenário candidato de validação:** Plano para uma biblioteca piloto. Cenário fictício: objetivo organizar documentos; escopo busca por título; fora do escopo cobrança. Responsável e prazo não definidos. Fonte: [PRD].

**Entrega a conferir:** Proposta revisável de seções e quadro editável após definição do conteúdo.

**Critério de conferência:** Confira que prazo e responsável permanecem pendentes e cobrança fica fora do escopo.

**Rastreabilidade:** SKILL.md com 495 linhas e 3806 palavras no corpo; 20 links Markdown locais inspecionados. SHA-256 da fonte: `0cc7b780099b957d0687bb2f375b77d1dcf226809210ec88b8f92b6d4a20e3db`.

### DD-089 — Projetos com escopo e aceite rastreáveis

Identificador: `gestao-de-entregas-e-homologacao` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Preserva histórico incremental e separa implementação de homologação.

**Ponto de melhoria:** Trata promoção de deploy antigo como causa universal de perda de dados.

**Evidência na fonte:** Nunca promover deploy antigo ... perde dados mesclados

**Alteração sugerida:** Explicar compatibilidade de schema/dados e distinguir rollback de código de restauração de banco; avaliar caso a caso.

**Cenário candidato de validação:** Um lote com dois estados. Cenário fictício: filtro corrigido e testado; exportação implementada, ainda sem teste. Fonte de ajustes: [PLANILHA_V1]; evidências: [REGISTROS].

**Entrega a conferir:** Planilha versionada e devolutiva com estados e pendências separados.

**Critério de conferência:** Confira preservação do histórico e exportação explicitamente não testada.

**Rastreabilidade:** SKILL.md com 119 linhas e 1227 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `5a384d8ada57a2dc9752b70022390a0477cbb467280f2b84b16a4389b217390c`.

### DD-090 — Controle interno de versões e mudanças

Identificador: `git-workflow-and-versioning` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Protege trabalho compartilhado e exige commits só do conteúdo próprio.

**Ponto de melhoria:** Inclui nome/email pessoais e comandos de projetos reais no pacote reutilizável.

**Evidência na fonte:** Como aplicar na DriveData: Autor com user.name e user.email

**Alteração sugerida:** Extrair perfil local privado; usar identidade Git do usuário atual e documentar precedência das convenções sem distribuir dados pessoais.

**Cenário candidato de validação:** Um commit com fronteiras. Cenário fictício: [REPOSITÓRIO] tem mudanças próprias em [ARQUIVO_PRÓPRIO] e mudanças de outra frente em [ARQUIVO_ALHEIO].

**Entrega a conferir:** Conjunto delimitado de mudanças e mensagem de commit revisável.

**Critério de conferência:** Confira o diff preparado e confirme que trabalho de outras frentes permanece intacto.

**Rastreabilidade:** SKILL.md com 375 linhas e 2553 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `b0e6d07f460e668149f440a46c82bd2c7bde7b67f457ef2edd5fb581754d5c85`.

### DD-091 — Verificações automáticas durante o desenvolvimento

Identificador: `hook-development` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Fornece testes, validação de entrada e portabilidade para hooks Claude Code.

**Ponto de melhoria:** Schema de settings, eventos e contratos de saída são tratados como universais sem versão suportada.

**Evidência na fonte:** Settings Format Direct; Supported events; version 0.1.0

**Alteração sugerida:** Declarar versão de Claude Code, verificar schema oficial atual e incluir fixtures por evento; marcar incompatibilidade com hooks Codex.

**Cenário candidato de validação:** Uma regra antes da gravação. Cenário fictício: plugin Claude Code em [PLUGIN]; bloquear escrita no arquivo .env de [PROJETO], sem registrar seu conteúdo.

**Entrega a conferir:** Configuração e script de hook com exemplos de teste e instruções de ativação.

**Critério de conferência:** Confira rejeição do alvo, aceitação de arquivo comum e tratamento de JSON inválido.

**Rastreabilidade:** SKILL.md com 713 linhas e 2034 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `f47e2d42f6360294216a859ae0c30b93caafdd2b2e5ffc007489ba4ca447fa5c`.

### DD-092 — Assistentes e copilotos com contexto do negócio

Identificador: `ia-aplicada-a-produtos` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Valida IDs/saída no servidor e mantém permissões do usuário.

**Ponto de melhoria:** Fallback pode transmitir dados a outro provedor sem política explícita por finalidade.

**Evidência na fonte:** Fornecedor por env com fila e fallback; Log LGPD

**Alteração sugerida:** Adicionar allowlist por tipo de dado, retenção e consentimento aplicável; só ativar provedor reserva se autorizado para o mesmo contexto. Remover limiar universal de self-hosting.

**Cenário candidato de validação:** Recomendação sem itens inventados. Cenário fictício: catálogo A — organizar documentos; B — revisar interfaces. Pedido: localizar arquivos dispersos. Projeto: [REPOSITÓRIO].

**Entrega a conferir:** Fluxo de recomendação validado contra catálogo, com falhas tratadas.

**Critério de conferência:** Teste ID inexistente, pedido ambíguo e indisponibilidade do provedor, além do caso A.

**Rastreabilidade:** SKILL.md com 110 linhas e 1317 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `0a570b0ad5e33d507a0af97e0bd30605a0e068069f6c099958b5a05b47cc5911`.

### DD-093 — Controle de acesso ao assistente pelo iMessage

Identificador: `imessage-access` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Separa autorização no terminal de mensagens do canal e exige códigos de pareamento exatos.

**Ponto de melhoria:** Tornar a gravação da política resistente a alterações simultâneas e permitir conferência do diff antes da aplicação.

**Evidência na fonte:** State shape; Dispatch on arguments; Implementation notes

**Alteração sugerida:** Adicionar leitura-validar-escrever atômico, cópia de recuperação e teste de duas alterações concorrentes em access.json.

**Cenário candidato de validação:** Uma lista antes da abertura. Cenário fictício: um Mac autorizado possui o canal iMessage instalado. [ARQUIVO_ACCESS] contém a configuração atual; [REMETENTE] identifica a pessoa proposta.

**Entrega a conferir:** Resumo de acesso atual e proposta de alteração com o remetente explicitamente identificado.

**Critério de conferência:** Compare a lista anterior e a proposta; nenhum remetente adicional deve aparecer.

**Rastreabilidade:** SKILL.md com 141 linhas e 614 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `fbbf63066c18620a2cfbf859f4ae31330707d867de8603aa028d11121b50cba0`.

### DD-094 — Configuração do canal iMessage para assistentes

Identificador: `imessage-configure` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Explica Full Disk Access, banco local de mensagens e construção direta da allowlist no macOS.

**Ponto de melhoria:** Distinguir prontidão de configuração, acesso efetivo ao banco e servidor operacional no resumo de status.

**Evidência na fonte:** Status and guidance; Build the allowlist — don't pair

**Alteração sugerida:** Adicionar estados separados para permissão de leitura, plugin disponível, processo iniciado e troca de teste, sem inferir conexão por configuração existente.

**Cenário candidato de validação:** O telefone recebe, o canal não. Cenário fictício: [MAC_AUTORIZADO] tem iMessage ativo; [TERMINAL] executa o assistente. Nenhuma credencial deve ser enviada ao chat.

**Entrega a conferir:** Diagnóstico de preparação com evidências e próximos passos por impedimento encontrado.

**Critério de conferência:** O relatório deve distinguir acesso ao banco, política do canal e disponibilidade real do plugin.

**Rastreabilidade:** SKILL.md com 83 linhas e 487 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `78e913e83100fbbd24f5dc57d1ce3bb2adae51eb2ad62d8c32212d5d386f45fe`.

### DD-095 — Sistemas financeiros conectados

Identificador: `integracoes-erp-fiscal-financeiro` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Relaciona idempotência, renovação OAuth, reconciliação e diferenças entre caixa, competência e projeção.

**Ponto de melhoria:** Fortalecer receitas de recuperação após corrida de refresh token e falhas parciais de paginação.

**Evidência na fonte:** Armadilhas conhecidas; Checklist de entrega

**Alteração sugerida:** Documentar bloqueio por conexão durante refresh, checkpoint por página e cenários de reexecução com reconciliação que preservem pagamentos e cancelamentos.

**Cenário candidato de validação:** Uma baixa que ficou para trás. Dados fictícios: título A de 800 foi recebido no ERP; título B de 200 permanece aberto. O espelho ainda mostra ambos abertos.

**Entrega a conferir:** Reconciliação esperada de 800 de diferença e desenho de conferência dos títulos abertos.

**Critério de conferência:** O saldo reconciliado deve ser 200; o diagnóstico não pode somar projeção e realizado.

**Rastreabilidade:** SKILL.md com 123 linhas e 1653 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `2359165894b93936e8eaea612e36a6f3867fdcab909590688f66c22873dc57d0`.

### DD-096 — Minutas e padronização de respostas jurídicas

Identificador: `legal-response` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Verifica gatilhos de escalonamento antes de gerar resposta a partir de modelos.

**Ponto de melhoria:** Dar rastreabilidade inequívoca à versão e aprovação do template jurídico utilizado.

**Evidência na fonte:** Step 2: Load Template; Step 3: Check Escalation Triggers

**Alteração sugerida:** Exigir identificador, jurisdição, responsável, versão e data de aprovação do modelo; rotular qualquer redação sem modelo aprovado como rascunho para counsel.

**Cenário candidato de validação:** O pedido que não cabe no modelo. Cenário fictício: [SOLICITACAO] pede acesso e exclusão de dados; [MODELO_APROVADO] cobre apenas acesso. [JURISDICAO] e identidade do solicitante precisam de confirmação.

**Entrega a conferir:** Minuta de recebimento, variáveis pendentes e lista de temas para revisão jurídica.

**Critério de conferência:** A minuta deve reconhecer ambos os pedidos sem afirmar exclusão realizada ou prazo não confirmado.

**Rastreabilidade:** SKILL.md com 458 linhas e 2257 palavras no corpo; 1 links Markdown locais inspecionados. SHA-256 da fonte: `b3a0585ee00a53ccb159fbf5b7dd4d4b45c39e5e65cc8f4f39cbb134fef493db`.

**Pendência estrutural:** referência ausente no pacote: `../../CONNECTORS.md`.

### DD-097 — Organização e classificação de riscos contratuais

Identificador: `legal-risk-assessment` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Explicita severidade, probabilidade, pontuação e ações correspondentes.

**Ponto de melhoria:** Evitar que multiplicar escalas ordinais crie aparência de precisão ou empate enganoso.

**Evidência na fonte:** Severity x Likelihood Matrix; Risk Score Calculation

**Alteração sugerida:** Adicionar campo de confiança, evidência e motivo de cada nota; comparar separadamente riscos de mesma pontuação e permitir escalonamento por impacto catastrófico.

**Cenário candidato de validação:** Duas avaliações, duas dimensões. Hipótese fictícia: risco A tem severidade 4 e probabilidade 2; risco B tem severidade 2 e probabilidade 4. As notas são premissas, não fatos comprovados.

**Entrega a conferir:** Matriz com pontuação 8 para ambos os riscos, justificativas distintas e lacunas de evidência.

**Critério de conferência:** A análise deve preservar as dimensões originais e não deduzir aprovação apenas da pontuação.

**Rastreabilidade:** SKILL.md com 266 linhas e 1746 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `9f7985e3a98ac8419b52067cdaa1b72f754fa38c20489e7f0bf9de36347d4d89`.

### DD-098 — Preparação de dispositivos M5Stack e ESP32

Identificador: `m5-onboard` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Traz passos físicos de conexão e scripts de provisionamento com observação de logs.

**Ponto de melhoria:** Substituir a suposição de variante por identificação positiva antes de selecionar firmware.

**Evidência na fonte:** Which variant to assume; Relaying physical steps to the user (REQUIRED)

**Alteração sugerida:** Exigir confirmação do modelo e evidência USB/chip compatível antes de flash; fixar versão e hash do firmware e registrar opção de recuperação.

**Cenário candidato de validação:** Duas placas na bancada. Cenário fictício: [PORTA_A] e [PORTA_B] aparecem no computador; o dispositivo alvo tem modelo [MODELO_CONFIRMADO]. O conteúdo existente deve ser preservado até a decisão de gravação.

**Entrega a conferir:** Plano associado ao modelo e à porta corretos, seguido de registro dos testes autorizados.

**Critério de conferência:** A identificação do hardware deve corresponder ao firmware escolhido; teste não executado deve ficar explícito.

**Rastreabilidade:** SKILL.md com 186 linhas e 3450 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `c6ba88fd06f59a3e902fead2bb863b6834f189672cfcc75248941c23ae39bd2d`.

### DD-099 — Execução local de modelos com Magnitude

Identificador: `magnitude` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Delega ao onboarding e CLI do próprio produto, evitando documentação longa rapidamente desatualizada.

**Ponto de melhoria:** Deixar explícita a dependência da CLI e uma saída útil quando ela não estiver instalada.

**Evidência na fonte:** # Magnitude; magnitude docs onboarding

**Alteração sugerida:** Acrescentar pré-checagem de executável e versão, resumo de hardware necessário, documentação consultada e fallback informativo sem inventar comandos de instalação.

**Cenário candidato de validação:** Cabe antes de baixar. Cenário fictício: [MAQUINA] possui [RAM] e [GPU]. Magnitude está instalado, mas nenhum modelo foi escolhido; [HARNESS] é o ambiente pretendido.

**Entrega a conferir:** Comparação de compatibilidade e roteiro de instalação com estados de aquisição, carga e conexão separados.

**Critério de conferência:** Uma configuração sugerida deve apontar a evidência de hardware; catálogo disponível não equivale a modelo carregado.

**Rastreabilidade:** SKILL.md com 17 linhas e 71 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `37de67f0c7b831415f6298c8785b7ae97d5cfe454dc778651d96114840d2ace2`.

### DD-100 — Conteúdo B2B que explica o valor da solução

Identificador: `marketing-de-conteudo-b2b` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Parte de dor, oferta e fatos aprovados e separa redação, arte e publicação.

**Ponto de melhoria:** Conectar cada alegação factual do material ao responsável ou documento que a sustenta.

**Evidência na fonte:** Princípios e regras; Checklist de entrega

**Alteração sugerida:** Adicionar mapa de alegações com fonte, aprovação e validade; deixar números e cases sem evidência como pendências antes de gerar arte ou publicar.

**Cenário candidato de validação:** Uma oferta sem siglas soltas. Cenário fictício: a Prisma oferece conferência de indicadores. Público: gestores financeiros. Fato permitido: o serviço compara relatórios com suas fontes; não há resultado de economia aprovado.

**Entrega a conferir:** Post, orientação visual e chamada coerentes com a capacidade informada.

**Critério de conferência:** Cada afirmação de resultado deve ter fonte; o texto não pode transformar a hipótese em case real.

**Rastreabilidade:** SKILL.md com 103 linhas e 1352 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `a33ccbc77498f850348ce06bb646f4f24f10dc8de33e6714e99ee3942f4a8b3f`.

### DD-101 — Análise e verificação de problemas matemáticos

Identificador: `math-olympiad` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Combina interpretação, candidatos, limpeza e verificação adversarial com possibilidade de abstenção.

**Ponto de melhoria:** Separar heurísticas e estatísticas históricas das garantias da execução atual.

**Evidência na fonte:** The five things that change outcomes; Interpretation check; Calibrated abstention

**Alteração sugerida:** Identificar a proveniência e limites dos números citados e oferecer modo sem ferramentas de orquestração, mantendo uma lista explícita de obrigações de prova.

**Cenário candidato de validação:** O caso de igualdade esquecido. Problema de demonstração: para números reais a e b, provar que a² + b² ≥ 2ab e identificar quando ocorre igualdade.

**Entrega a conferir:** Demonstração baseada em (a − b)² ≥ 0, com igualdade quando a = b e registro da revisão.

**Critério de conferência:** Teste a = 0, b = 0 e sinais opostos; nenhuma etapa pode exigir divisão por uma variável.

**Rastreabilidade:** SKILL.md com 412 linhas e 2810 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `f697e195d343520f3db551bd4fb44c5120504ee2c47a9cc2016cd57767f23403`.

### DD-102 — Integração de serviços em plugins Claude Code

Identificador: `mcp-integration` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Explica caminhos portáveis, tipos de transporte e padrões de autenticação de plugins.

**Ponto de melhoria:** Validar os tipos de transporte descritos contra a versão real do host antes de produzir configuração.

**Evidência na fonte:** MCP Server Types; Authentication Patterns

**Alteração sugerida:** Criar matriz host/versão/transporte e testes de conexão; não emitir SSE, HTTP ou WebSocket apenas por estarem no guia quando o runtime não os aceitar.

**Cenário candidato de validação:** Um servidor, uma ferramenta permitida. Cenário fictício: [PLUGIN] deve acessar o servidor MCP existente [ENDPOINT]. O escopo aprovado permite somente a ferramenta [FERRAMENTA_LEITURA].

**Entrega a conferir:** Configuração proposta, requisitos de autenticação e plano de teste com escopo de leitura.

**Critério de conferência:** Nenhum segredo deve aparecer no manifesto; o teste não pode chamar ferramentas de escrita.

**Rastreabilidade:** SKILL.md com 555 linhas e 1597 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `b9319d8e44c8f058c1c4f003168295ab2582567fd6329c8b933409116e938bc6`.

### DD-103 — Preparação de reuniões e negociações

Identificador: `meeting-briefing` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Sintetiza objetivo, participantes, contexto jurídico e lacunas a partir das fontes disponíveis.

**Ponto de melhoria:** Exibir conflitos e atualidade das fontes ao lado de decisões supostamente tomadas.

**Evidência na fonte:** Step 3: Gather Context from Connected Sources; Step 5: Identify Preparation Gaps

**Alteração sugerida:** Acrescentar fonte e data a decisões, marcar divergências entre email e contrato e apresentar o alcance da busca quando algum conector estiver ausente.

**Cenário candidato de validação:** A renovação sem contexto único. Cenário fictício: [CONTRATO] vence em [DATA]; [PROPOSTA] altera o escopo; [ATA_ANTERIOR] registra uma pendência. [PARTICIPANTES] define os responsáveis.

**Entrega a conferir:** Briefing com fontes, questões de renovação e tabela de ações ainda não decididas.

**Critério de conferência:** Decisões anteriores devem ter referência; campos novos de responsável ou prazo não podem parecer acordos já feitos.

**Rastreabilidade:** SKILL.md com 221 linhas e 1293 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `4d19bc2ddb2138d1b306b150c5d0900ce0a398d5ab690b8eba8101ef33d98baa`.

### DD-104 — Cobranças e assinaturas integradas

Identificador: `pagamentos-recorrentes-asaas` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue assinatura e cobrança e exige filtro de conta, autenticação e idempotência de webhook.

**Ponto de melhoria:** Ampliar a recuperação de eventos fora de ordem, estornos e falhas após confirmação de recebimento.

**Evidência na fonte:** Princípios e regras; Armadilhas conhecidas

**Alteração sugerida:** Descrever uma máquina de estados com inbox transacional, reprocessamento e casos sandbox para CONFIRMED/RECEIVED, duplicação, reembolso e revogação de acesso.

**Cenário candidato de validação:** O mesmo pagamento, dois avisos. Dados fictícios: assinatura sub_demo e cobrança pay_demo recebem PAYMENT_CONFIRMED e depois PAYMENT_RECEIVED. Ambos se referem ao mesmo pagamento; nenhuma chamada real é necessária.

**Entrega a conferir:** Fluxo idempotente de eventos e tabela de testes sem movimentação financeira.

**Critério de conferência:** Reenviar qualquer evento não pode gerar novo pagamento, duplicar acesso ou substituir o identificador da assinatura.

**Rastreabilidade:** SKILL.md com 121 linhas e 1376 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `085d7d3550f5a9a37c6e640ceec524abae6b7929e353cd4ec560e52fe30ae848`.

### DD-105 — Academia digital e área do aluno

Identificador: `plataformas-de-ensino-online` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Trata matrícula, progresso, certificados e acesso a vídeo como responsabilidades de produto e servidor.

**Ponto de melhoria:** Detalhar um teste de acesso após expiração ou revogação, inclusive com URL de mídia já obtida.

**Evidência na fonte:** Princípios e regras; Checklist de entrega

**Alteração sugerida:** Adicionar matriz usuário/matrícula/conteúdo, verificação no servidor e expiração de URLs; distinguir ocultação de player de proteção efetiva do material.

**Cenário candidato de validação:** A aula que ainda não abriu. Cenário fictício: curso Trilhas tem uma aula publicada e outra em rascunho. [REPOSITORIO] contém a aplicação; [REGRAS_MATRICULA] define quem pode assistir.

**Entrega a conferir:** Mapa de estados, controles de servidor e casos de teste para as duas aulas.

**Critério de conferência:** Um aluno sem acesso não deve obter o recurso por chamada direta; a aula em rascunho permanece indisponível.

**Rastreabilidade:** SKILL.md com 132 linhas e 1775 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `d55fcfd0987cf72ab9bade669c8d988ab82057d47cf8ea053451f8c6af0715e7`.

### DD-106 — Simuladores e exploradores interativos

Identificador: `playground` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Define HTML autossuficiente com controles, prévia instantânea, presets e prompt copiável.

**Ponto de melhoria:** Tornar navegação por teclado e anúncio de atualização parte do contrato de cada playground.

**Evidência na fonte:** Core requirements (every playground); Common mistakes to avoid

**Alteração sugerida:** Incluir labels, foco visível, controles nativos, estado de copiar e aria-live com atualização moderada; testar sem mouse e com reduced motion.

**Cenário candidato de validação:** Três ritmos para a mesma página. Cenário fictício: uma página de leitura deve permitir comparar os presets Compacto, Equilibrado e Amplo. O conteúdo de demonstração está em [TEXTO_AMOSTRA].

**Entrega a conferir:** Arquivo HTML com três presets, prévia reativa e descrição copiável da configuração.

**Critério de conferência:** Cada controle deve atualizar prévia e comando; carregar um preset precisa alterar todos os valores relacionados.

**Rastreabilidade:** SKILL.md com 77 linhas e 509 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `521a3d62211e5f47b65ed17b660e001b15cf8d88d058cbf31bc00e889bcb63cc`.

### DD-107 — Configurações por projeto para plugins

Identificador: `plugin-settings` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Organiza configurações locais com frontmatter, defaults e aplicação pelo plugin.

**Ponto de melhoria:** Substituir exemplos frágeis de parsing por um leitor YAML com validação de tipos.

**Evidência na fonte:** Reading Settings Files; From Hooks (Bash Scripts)

**Alteração sugerida:** Fornecer parser que aceite YAML válido sem avaliação de código, rejeite tipos inesperados e preserve o corpo Markdown; incluir valores com dois-pontos, aspas e multilinhas.

**Cenário candidato de validação:** Um hook com configuração local. Cenário fictício: o plugin revisão possui enabled=true e max_retries=3. [PROJETO] precisa de configuração própria, sem guardar segredos nem versionar preferências pessoais.

**Entrega a conferir:** Modelo de configuração local, regras de leitura e tratamento de ausência ou erro.

**Critério de conferência:** O leitor deve distinguir false da string false e rejeitar limites fora do intervalo definido.

**Rastreabilidade:** SKILL.md com 545 linhas e 1566 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `028b955244b937ebc1a5c268a12776b8ceae4cbfb60928fbca927227f4c8851d`.

### DD-108 — Arquitetura e organização de plugins

Identificador: `plugin-structure` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Explica descoberta de componentes, manifesto e referências portáveis pelo diretório do plugin.

**Ponto de melhoria:** Adicionar verificação automática entre manifesto, caminhos declarados e arquivos realmente empacotados.

**Evidência na fonte:** Directory Structure; Component Path Configuration; Portable Path References

**Alteração sugerida:** Criar checklist executável de existência, case sensitivity e colisões de descoberta, seguido de instalação de teste em diretório diferente do desenvolvimento.

**Cenário candidato de validação:** O plugin que só funciona aqui. Cenário fictício: [PLUGIN] contém comandos dentro de .claude-plugin e um script referenciado por caminho pessoal. O objetivo é preparar uma estrutura portável.

**Entrega a conferir:** Árvore proposta, manifesto revisável e lista de referências de caminho a corrigir.

**Critério de conferência:** Nenhum caminho pessoal deve permanecer; manifesto e diretórios precisam concordar com o método de descoberta escolhido.

**Rastreabilidade:** SKILL.md com 477 linhas e 1559 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `0b19088c8d0ad3155bd46f55ae3b2307f2c176d0828549b44cc22cf2a0be45b3`.

### DD-109 — Memória interna do portfólio

Identificador: `portfolio-de-projetos` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Preserva contexto de retomada e adverte sobre verificar repositório, publicação e estado real.

**Ponto de melhoria:** Separar estritamente a base privada de projetos do conteúdo distribuível no marketplace.

**Evidência na fonte:** Índice; Pessoas e papéis recorrentes; Como cada projeto publica

**Alteração sugerida:** Criar uma edição pública sem clientes, pessoas, caminhos ou links internos; manter a original em armazenamento restrito e bloquear seu ZIP público até revisão de dados.

**Cenário candidato de validação:** Retomar sem expor o histórico. Cenário fictício: [NOTAS_INTERNAS] mencionam Projeto Cedro e [REPOSITORIO_AUTORIZADO] permite conferir seu estado. A apresentação externa não pode conter pessoas ou dados de clientes.

**Entrega a conferir:** Mapa de retomada com estado confirmado, pendências e versão demonstrativa anonimizada.

**Critério de conferência:** Cada afirmação de situação atual deve apontar evidência recente; a versão externa não pode revelar informações internas.

**Rastreabilidade:** SKILL.md com 134 linhas e 2094 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `d6b3b002f583f789bb3116af058fad022c503a1b761c4d3bbe690469d96be23f`.

### DD-110 — Portal de indicadores com a sua marca

Identificador: `power-bi-embedded-portais` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue permissões de interface, RLS, identidade efetiva e geração de tokens no servidor.

**Ponto de melhoria:** Transformar o isolamento entre clientes em evidência negativa repetível antes da entrega.

**Evidência na fonte:** Princípios e regras; Armadilhas conhecidas

**Alteração sugerida:** Incluir testes com identidades de tenants diferentes, tentativa de trocar reportId/workspaceId e inspeção de expiração; registrar capacidade e licenças verificadas na data.

**Cenário candidato de validação:** O mesmo portal, dados separados. Cenário fictício: empresas Cedro e Ipê usam [PORTAL]. [RELATORIO] contém dados de ambas; [MODELO_RLS] deve restringir cada identidade ao cliente correspondente.

**Entrega a conferir:** Fluxo de autenticação e embed, requisitos de capacidade e matriz de testes entre clientes.

**Critério de conferência:** A identidade de Cedro não deve consultar os dados de Ipê, inclusive por requisição modificada.

**Rastreabilidade:** SKILL.md com 127 linhas e 1520 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `67d68a0434972b710666256beb170ef949d756257726b9ed98abb92380675840`.

### DD-111 — Indicadores confiáveis e Power BI mais eficiente

Identificador: `power-bi-modelagem-dax-performance` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Prioriza correção numérica e equivalência antes de substituir medidas e avaliar desempenho.

**Ponto de melhoria:** Formalizar as amostras e tolerâncias usadas na comparação de medidas.

**Evidência na fonte:** Fluxo de trabalho recomendado; Checklist de entrega

**Alteração sugerida:** Definir cenários de total, subconjunto, BLANK, relacionamento e calendário com diferenças esperadas; registrar tempos frios/quentes separadamente para evitar conclusões de cache.

**Cenário candidato de validação:** A média que mudou a margem. Dados fictícios: produto A tem receita 1.000 e lucro 400; produto B tem receita 100 e lucro 10. A margem consolidada deve usar os totais.

**Entrega a conferir:** Comparação entre 25% de média simples e aproximadamente 37,27% de margem consolidada, com DAX revisável.

**Critério de conferência:** A razão correta usa 410 dividido por 1.100; a medida deve ser testada também com receita zero.

**Rastreabilidade:** SKILL.md com 114 linhas e 1311 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `ab5af7bce418f8786c5c645cf34d80c817c69b65745b80cd4523b3c4d4dbe0d4`.

### DD-112 — Dashboards e relatórios Power BI sob medida

Identificador: `power-bi-relatorios-como-codigo` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Trata PBIP/PBIR/TMDL como código versionado e exige validação real no Power BI Desktop.

**Ponto de melhoria:** Documentar compatibilidade de versão e integridade de bookmarks e referências após regeneração.

**Evidência na fonte:** Princípios e regras; Armadilhas conhecidas

**Alteração sugerida:** Registrar versão do Desktop e schemas, validar referências de visuais e bookmarks, comparar totais e imagens antes/depois e manter cópia recuperável do relatório.

**Cenário candidato de validação:** Uma página nova, os mesmos números. Cenário fictício: [PROJETO_PBIP] possui medidas de Receita e Margem já aprovadas. Uma nova página deve mostrar ambas e permitir filtro por região.

**Entrega a conferir:** Nova versão de arquivos do relatório, descrição das interações e roteiro de conferência no Desktop.

**Critério de conferência:** Receita e Margem devem coincidir com a versão anterior nos mesmos filtros; a limpeza precisa restaurar o estado definido.

**Rastreabilidade:** SKILL.md com 129 linhas e 1637 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `cf1922444721e392f133724e148a98ec5c216f79469f327357093f507ebc8a85`.

### DD-113 — Aplicativos internos e automações Microsoft

Identificador: `power-platform-code-first` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Usa exportação real como base e reconhece limites de Studio, delegação e conectores.

**Ponto de melhoria:** Associar cada receita ao formato e versão de exportação que foi efetivamente validado.

**Evidência na fonte:** Princípios e regras; Armadilhas conhecidas

**Alteração sugerida:** Adicionar matriz de export/import, teste de abertura no Studio e publicação em sandbox; incluir caso de consulta acima do limite de delegação com resultado esperado.

**Cenário candidato de validação:** A manutenção que some na busca. Cenário fictício: [APP_EXPORTADO] consulta a lista [LISTA_CHAMADOS] no SharePoint. Um filtro local pode deixar de localizar itens; a produção deve permanecer intacta.

**Entrega a conferir:** Diagnóstico de delegação, proposta de Power Fx e roteiro de testes em cópia do aplicativo.

**Critério de conferência:** O teste deve localizar um item fora do primeiro lote; esconder registros na interface não equivale a proteger a base.

**Rastreabilidade:** SKILL.md com 117 linhas e 1267 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `0e035a178202d0dab9a237ab0d2321d265f02f0f5fe578ccb1075d12db6096b2`.

### DD-114 — Visão compartilhada do andamento de projetos

Identificador: `project-artifact` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Mantém configuração persistente e atualizações por diferenças, evitando recontar o projeto sem necessidade.

**Ponto de melhoria:** Explicitar fallback quando o runtime não oferece a ferramenta Artifact e login Claude exigidos.

**Evidência na fonte:** Workflow; The artifact config (one per project); Freshness and trust

**Alteração sugerida:** Detectar capacidades primeiro; oferecer rascunho local com status não publicado em ambientes incompatíveis e nunca simular uma URL de artifact acessível.

**Cenário candidato de validação:** Uma frente avançou, outra espera. Cenário fictício: projeto Aurora tem dados concluídos, interface em revisão e validação bloqueada pela interface. [FONTES] contém evidências; [ARTEFATO_EXISTENTE] guarda o status anterior.

**Entrega a conferir:** Página de status ou estrutura pronta para publicação, com diferenças e dependências identificadas.

**Critério de conferência:** Validação não pode aparecer como concluída; publicação só deve ser afirmada após confirmação da ferramenta.

**Rastreabilidade:** SKILL.md com 262 linhas e 3085 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `34e13249dba8a066f33c5f723dbb7b9cb6174b80cc490dd866fbfd1736f0577f`.

### DD-115 — Estruturação interna de propostas e estimativas

Identificador: `propostas-comerciais-e-estimativas` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Separa esforço interno, horas vendidas, custos recorrentes e critérios de aceite.

**Ponto de melhoria:** Exibir incerteza de estimativas de forma rastreável, sem transformar pontos desconhecidos em preço fixo.

**Evidência na fonte:** Princípios e regras; Fluxo de trabalho recomendado

**Alteração sugerida:** Adicionar premissas, intervalo de esforço, exclusões e gatilhos de revisão por fase; preservar aprovação comercial explícita para preço final.

**Cenário candidato de validação:** A premissa escondida no orçamento. Dados fictícios: descoberta exige 8 horas e implantação 24 horas. A taxa aprovada é [TAXA_HORA]; infraestrutura e preparação dos dados ainda não foram definidas.

**Entrega a conferir:** Estimativa de 32 horas com preço parametrizado, exclusões, responsabilidades e critérios de aceite.

**Critério de conferência:** O total deve somar 32 horas; custos indefinidos não podem ser apresentados como incluídos ou gratuitos.

**Rastreabilidade:** SKILL.md com 140 linhas e 1629 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `21d0735e06f439792cc34d7feaad9de3ccfd3aaaad543b203864bd36ed0b5b90`.

### DD-116 — Prospecção B2B orientada por sinais

Identificador: `prospeccao-b2b-linkedin` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Usa sinais observáveis, histórico e aprovação de mensagem antes do contato.

**Ponto de melhoria:** Distinguir estratégia geral de exemplos históricos de campanha e limites atuais da plataforma.

**Evidência na fonte:** Sequência que funcionou (campanha de portal de BI); Painel do funil

**Alteração sugerida:** Marcar exemplos como históricos, verificar regras atuais do canal e criar chave de deduplicação por perfil/etapa para evitar contato duplicado entre rodadas.

**Cenário candidato de validação:** Um sinal, uma hipótese. Cenário fictício: [PERFIL_PUBLICO] lidera dados e [FONTE_PUBLICA] informa contratação de especialista em BI. [HISTORICO] deve ser conferido para evitar abordagem repetida.

**Entrega a conferir:** Ficha de qualificação, hipótese delimitada e rascunho de abordagem com fonte.

**Critério de conferência:** A mensagem deve usar apenas sinais observados e o histórico não pode conter uma abordagem duplicada ignorada.

**Rastreabilidade:** SKILL.md com 151 linhas e 1831 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `13f1f034d6ff42376cd2e3bdf8faad82b27501ef8c30a2ede9ff9bb832d89ea9`.

### DD-117 — Playbook comercial interno da DriveData

Identificador: `prospeccao-drivedata` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Relaciona sinais do prospect às ofertas específicas da DriveData e mantém a aprovação de envio.

**Ponto de melhoria:** Reduzir divergência com a skill de prospecção B2B e com versões novas do portfólio comercial.

**Evidência na fonte:** Regras que não mudam; Produto por sinal; Fluxos

**Alteração sugerida:** Referenciar uma fonte canônica versionada para ofertas e fluxo compartilhado; deixar nesta skill apenas especializações DriveData e não distribuir a base comercial privada.

**Cenário candidato de validação:** Duas necessidades, duas direções. Cenário fictício: perfil A busca distribuir Power BI a leitores; perfil B divulga demanda temporária por especialista. [BASE_COMERCIAL] e [HISTORICO] são as únicas referências autorizadas.

**Entrega a conferir:** Duas qualificações e rascunhos distintos, ligados à base comercial vigente.

**Critério de conferência:** Cada oferta precisa existir na base aprovada; sinais observados e intenção inferida devem permanecer separados.

**Rastreabilidade:** SKILL.md com 150 linhas e 1290 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `1e74de7bebc84681cec75f178654d9e963fbb8d06d386439169be64e499249dd`.

### DD-118 — Da ideia ao protótipo e escopo validável

Identificador: `prototipos-e-especificacao-funcional` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Conecta protótipo, fluxos e regras aos critérios de aceite e distingue demonstração de integração real.

**Ponto de melhoria:** Tornar rastreável a cobertura dos estados de exceção no protótipo e na especificação.

**Evidência na fonte:** Fluxo de trabalho recomendado; Checklist de entrega

**Alteração sugerida:** Adicionar matriz requisito→tela→estado→critério com carregamento, vazio, erro, permissão e sucesso, mantendo hipóteses separadas de decisões aprovadas.

**Cenário candidato de validação:** Quem pode devolver o pedido?. Cenário fictício: solicitante cria pedido, gestor aprova ou devolve e solicitante corrige. [REQUISITOS] ainda não define o que acontece após a correção.

**Entrega a conferir:** Protótipo demonstrativo, critérios de aceite e decisão aberta sobre o reenvio após correção.

**Critério de conferência:** Telas e especificação precisam descrever o mesmo fluxo; a regra ausente não pode ser inventada como requisito aprovado.

**Rastreabilidade:** SKILL.md com 123 linhas e 1404 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `e8c96625e5f41c3491d13046c0c2955ff313fd5cc62d775c3f91a972e128c802`.

### DD-119 — Relatório de atividade e impacto do assistente

Identificador: `receipts` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Cruza transcrições e Git local e orienta a calibrar impacto sem inventar retorno.

**Ponto de melhoria:** Acrescentar revisão explícita de conteúdo sensível antes de compartilhar o relatório gerencial.

**Evidência na fonte:** Step 2 — run the miner; What the numbers mean; Framing for a manager

**Alteração sugerida:** Gerar modo de exportação redigido com projetos e trechos revisáveis, cobertura da coleta e limite de atribuição entre conversa, commit e entrega efetivamente aceita.

**Cenário candidato de validação:** Atividade não é resultado garantido. Cenário fictício: [TRANSCRICOES_LOCAIS] contém sessões autorizadas e [REPOSITORIOS] permite consultar Git. O período solicitado é [PERIODO]; não há medição de horas economizadas.

**Entrega a conferir:** Relatório local de atividade com fontes, projetos e limites da interpretação.

**Critério de conferência:** Toda entrega alegada precisa de evidência; quantidade de mensagens ou tokens não pode ser apresentada como impacto comprovado.

**Rastreabilidade:** SKILL.md com 301 linhas e 2705 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `5b2f407ff40639727310236f4b34986cacd4bf616c07d2e4198846726842e346`.

### DD-120 — Apoio à revisão e negociação de contratos

Identificador: `review-contract` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Compara cláusulas com playbook, prioriza desvios e propõe alternativas de negociação.

**Ponto de melhoria:** Garantir que redações sugeridas respeitem referências cruzadas e definições do contrato completo.

**Evidência na fonte:** Step 4: Clause-by-Clause Analysis; Step 6: Generate Redline Suggestions

**Alteração sugerida:** Após redlines, revisar definições, numeração, anexos e efeitos nas demais cláusulas; registrar versão do playbook e manter concessões como pendentes de aprovação.

**Cenário candidato de validação:** A renovação automática divergente. Cenário fictício: [CONTRATO] prevê renovação automática; [PLAYBOOK] exige aprovação expressa para renovar. [JURISDICAO] e alçadas de concessão precisam ser confirmadas.

**Entrega a conferir:** Análise do desvio, proposta de redação e alternativa com alçada de revisão explícita.

**Critério de conferência:** Cada alteração deve responder ao desvio identificado; nenhuma alternativa pode aparecer como posição já aprovada sem evidência.

**Rastreabilidade:** SKILL.md com 359 linhas e 2291 palavras no corpo; 1 links Markdown locais inspecionados. SHA-256 da fonte: `3a6413475f51adedbff130f4d5aabbeeacfb2abd323e0338bc91c21937fbfb76`.

**Pendência estrutural:** referência ausente no pacote: `../../CONNECTORS.md`.

### DD-121 — Plataformas com dados separados por cliente

Identificador: `saas-multi-tenant-supabase` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue identidade confiável, RLS, grants e funções, com verificação do banco real.

**Ponto de melhoria:** Converter a lista de cuidados em uma matriz de testes de bypass e recuperação de migração.

**Evidência na fonte:** Princípios e regras; Armadilhas conhecidas; Checklist de entrega

**Alteração sugerida:** Cobrir anon, authenticated, função SECURITY DEFINER, service role, Storage e metadados editáveis; validar restauração ou migração corretiva em ambiente isolado.

**Cenário candidato de validação:** O identificador trocado na requisição. Cenário fictício: tabela pedidos possui tenant_id; usuários dos clientes Cedro e Ipê consultam o mesmo aplicativo. [SCHEMA] e [POLICIES_ATUAIS] estão disponíveis para revisão.

**Entrega a conferir:** Revisão de isolamento, migração proposta e testes cruzados entre os dois clientes.

**Critério de conferência:** Uma identidade de Cedro não pode ler nem gravar pedidos de Ipê, mesmo fornecendo outro tenant_id.

**Rastreabilidade:** SKILL.md com 154 linhas e 2058 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `01f5fdb8c51117c3724b577763416329b333adf2f143a8cca96c467181def877`.

### DD-122 — Fortalecimento da segurança da aplicação

Identificador: `security-and-hardening` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Parte de ameaça concreta e adapta controles ao escopo, incluindo entrada, sessão e integrações.

**Ponto de melhoria:** Separar controles obrigatórios por caminho de dados das recomendações que exigem decisão de produto.

**Evidência na fonte:** Process: Threat Model First; Hardening Controls; Como aplicar na DriveData

**Alteração sugerida:** Adicionar exemplo de revisão pequena com entrada→autorização→persistência→saída e critérios verificáveis; preservar o escopo sem converter todo ajuste em auditoria completa.

**Cenário candidato de validação:** O arquivo não é só um nome. Cenário fictício: [ROTA_UPLOAD] recebe arquivo e nome informado pelo usuário; [REPOSITORIO] contém o código. O armazenamento deve ser privado e associado ao usuário autenticado.

**Entrega a conferir:** Mapa de ameaças do upload, controles propostos e testes locais de autorização e entrada.

**Critério de conferência:** Um nome fornecido não pode escolher um caminho arbitrário; outro usuário não deve recuperar o arquivo privado.

**Rastreabilidade:** SKILL.md com 236 linhas e 2890 palavras no corpo; 16 links Markdown locais inspecionados. SHA-256 da fonte: `8b353920db3f170203180d16833226ce57a311681b689b77dc27865661566083`.

### DD-123 — Auditoria de segurança com evidências

Identificador: `security-audit` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Exige fronteira de confiança e resultado observável, distinguindo prioridade de certeza.

**Ponto de melhoria:** Deixar mais rápida a checagem de dependências dos artefatos e validadores do modo completo.

**Evidência na fonte:** Operating modes; Full audit setup; Separate priority from certainty

**Alteração sugerida:** Adicionar comando de pré-voo que liste scripts/referências ausentes e seleção explícita scoped/full; registrar cobertura incompleta quando o runtime não permitir reprodução.

**Cenário candidato de validação:** O relatório que aceita outro dono. Cenário fictício: [ROTA_RELATORIO] recebe report_id; [CODIGO] implementa autenticação. Um ambiente isolado contém usuários A e B e relatórios separados para cada um.

**Entrega a conferir:** Achado confirmado ou resultado negativo delimitado, com trilha da autorização e evidências locais.

**Critério de conferência:** A conclusão deve distinguir tentativa, reprodução e impacto; nenhum acesso a dados reais é necessário.

**Rastreabilidade:** SKILL.md com 193 linhas e 3065 palavras no corpo; 8 links Markdown locais inspecionados. SHA-256 da fonte: `2a68ab5531dfccedac2b054e0814f2b6517daae9887b3ee40afcc5d8a7063c3a`.

### DD-124 — Análise de consumo e eficiência de sessões

Identificador: `session-report` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Gera relatório navegável a partir de transcrições locais e distingue custos estimados de cobrança oficial.

**Ponto de melhoria:** Versionar o parser conforme o formato da transcrição e tratar sessões parciais ou corrompidas.

**Evidência na fonte:** Steps 1–2: analyze-sessions.mjs --json --since 7d e leitura de overall/by_project; Notes: top_prompts inclui subagentes e continuações.

**Alteração sugerida:** Adicionar fixtures de versões diferentes, linhas JSON inválidas, fusos e sessões sem encerramento; apresentar o número de registros ignorados e opção de redação de prompts.

**Cenário candidato de validação:** Uma sessão fora do padrão. Cenário fictício: [DIRETORIO_SESSOES] contém transcrições autorizadas do Claude Code. [PERIODO] delimita a análise; o objetivo é explicar variações, não emitir uma fatura.

**Entrega a conferir:** Relatório HTML de consumo observado com hipótese de variação e limites da coleta.

**Critério de conferência:** As métricas devem corresponder aos registros; a hipótese precisa indicar quais evidências ainda faltam para confirmação.

**Rastreabilidade:** SKILL.md com 43 linhas e 413 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `ef0fbc4259a41b7fd61b517fb1c9a95f02b83ea3c79ba0b3afbeee4942570397`.

### DD-125 — Preparação interna para lançamento

Identificador: `shipping-and-launch` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Combina verificação prévia, monitoramento, rollout e recuperação com adaptação ao contexto DriveData.

**Ponto de melhoria:** Associar os critérios de rollback ao estado dos dados e aos sinais medidos após a publicação.

**Evidência na fonte:** Staged Rollout; Rollout Decision Thresholds; Como aplicar na DriveData

**Alteração sugerida:** Definir sinais, janela e responsável por rollback; distinguir reversão de código de migração irreversível e exigir verificação funcional de URL após o deploy.

**Cenário candidato de validação:** Voltar o código não volta os dados. Cenário fictício: [RELEASE] adiciona uma coluna usada pela aplicação. [MIGRACAO] é aditiva; [VERSAO_ANTERIOR] precisa continuar funcionando caso haja retorno de código.

**Entrega a conferir:** Plano de lançamento com verificações, sinais de interrupção e recuperação compatível com o banco.

**Critério de conferência:** O retorno precisa considerar o formato dos dados; sucesso de build não pode ser o único critério de liberação.

**Rastreabilidade:** SKILL.md com 360 linhas e 2251 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `1bf65108f873fea9e7e0a395af0b107cd00325913e298d2ba9df485d1b2b1bc3`.

### DD-126 — Investigação matemática em rodadas

Identificador: `siege` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Mantém rodadas, julgamento independente e registro de resultados provados, refutados ou abertos.

**Ponto de melhoria:** Explicitar orçamento executável e dependências antes de iniciar a extensa orquestração.

**Evidência na fonte:** Setup; The round loop — for r = 1, 2, …, MAX_ROUNDS; Rules that hold throughout

**Alteração sugerida:** Criar pré-voo para scripts, capacidade de agentes e teto de rodadas/recursos; persistir checkpoint e definir saída inconclusiva quando orçamento ou ferramentas forem insuficientes.

**Cenário candidato de validação:** Uma hipótese escondida. Cenário fictício: [ENUNCIADO] define o problema e [TENTATIVAS] reúne argumentos anteriores. O orçamento de rodadas e recursos será [ORCAMENTO]; nenhuma solução está assumida.

**Entrega a conferir:** Registro de investigação e prova revisável, ou relatório explícito das questões abertas.

**Critério de conferência:** Cada conclusão deve apontar premissas e justificativa; consenso entre trabalhadores não substitui demonstração.

**Rastreabilidade:** SKILL.md com 733 linhas e 12830 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `f40134d3b418b256656777ad89d1cee93ad9b8a8a1aa84754262752e91d6b542`.

### DD-127 — Preparação e organização de assinaturas

Identificador: `signature-request` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Inclui checklist pré-assinatura, signatários e ordem de envio antes do roteamento.

**Ponto de melhoria:** Amarrar aprovação ao documento exato para evitar troca de versão entre conferência e envio.

**Evidência na fonte:** Step 2: Pre-Signature Checklist; Step 4: Route for Signature

**Alteração sugerida:** Registrar hash ou versão imutável do pacote aprovado, ordem e destinatários; exigir nova conferência caso algum elemento mude antes de criar o envelope.

**Cenário candidato de validação:** O anexo de outra versão. Cenário fictício: [CONTRATO_FINAL] e [ANEXOS] devem ser assinados por [SIGNATARIOS]. [APROVACOES] contém as autorizações; a ordem será confirmada antes de qualquer envio.

**Entrega a conferir:** Checklist do pacote, pendências e configuração proposta do fluxo de assinatura.

**Critério de conferência:** O documento e os anexos precisam ter versão confirmada; cada signatário deve ter identidade e autoridade verificadas.

**Rastreabilidade:** SKILL.md com 105 linhas e 480 palavras no corpo; 1 links Markdown locais inspecionados. SHA-256 da fonte: `bf702fbe7d21073c3e6952ee2c72f66bf6c56fc806b3abb7e44d7863d7534682`.

**Pendência estrutural:** referência ausente no pacote: `../../CONNECTORS.md`.

### DD-128 — Sites que organizam sua presença e captação

Identificador: `sites-institucionais-e-seo` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Une mensagem, estrutura, SEO técnico, formulário e verificação da publicação.

**Ponto de melhoria:** Validar a entrega efetiva do lead além da resposta positiva na interface.

**Evidência na fonte:** Fluxo de trabalho recomendado; Checklist de entrega

**Alteração sugerida:** Adicionar submissão sintética autorizada com confirmação no destino, comportamento de erro/retry e verificação de canonical/hreflang para cada versão linguística publicada.

**Cenário candidato de validação:** O contato sem destino. Cenário fictício: Horizonte oferece consultoria descrita em [OFERTA_APROVADA]. [SITE] contém um formulário sem destino confirmado; [DESTINO_LEADS] e [DOMINIO] serão fornecidos.

**Entrega a conferir:** Conteúdo proposto, revisão técnica de SEO e fluxo verificável de captação.

**Critério de conferência:** A chamada principal deve corresponder à oferta; o formulário precisa de destino e estados de sucesso e erro confirmados.

**Rastreabilidade:** SKILL.md com 138 linhas e 1749 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `6323eaa5d480c6518d5679047ffbdecfe0eccfd0de8b085e9e4deb6fa2915ec4`.

### DD-129 — Padronização de conhecimento operacional em skills

Identificador: `skill-development` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Usa exemplos concretos e divulgação progressiva para manter instruções e recursos organizados.

**Ponto de melhoria:** Adicionar uma ficha de compatibilidade para distribuição fora do runtime Claude Code.

**Evidência na fonte:** Anatomy of a Skill; Progressive Disclosure Design Principle; Step 1: Understanding the Skill with Concrete Examples

**Alteração sugerida:** Registrar ferramentas, permissões e caminhos exigidos, testar casos de ativação positiva/negativa e distinguir portabilidade documental de integração operacional.

**Cenário candidato de validação:** A instrução que não é encontrada. Cenário fictício: [PROCEDIMENTO] descreve uma revisão interna e [EXEMPLOS] contém pedidos que devem ou não ativá-la. O destino é [PLUGIN_CLAUDE_CODE].

**Entrega a conferir:** Estrutura de skill com descrição, procedimento, referências e casos de validação.

**Critério de conferência:** Os exemplos positivos devem corresponder ao escopo; casos negativos precisam demonstrar onde a skill não deve ser usada.

**Rastreabilidade:** SKILL.md com 638 linhas e 3143 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `d51b4e20043b13e462aa86c47ea82d43e216eb292871538127f4b12a54e4944f`.

### DD-130 — Pesquisa matemática com registro de evidências

Identificador: `solo` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Preserva continuidade da investigação de um único agente e exige prova autocontida.

**Ponto de melhoria:** Definir formato mínimo das notas para não carregar tentativas falhas como resultados estabelecidos.

**Evidência na fonte:** Setup e The task: retomar DIR/notes.md e registrar lemas, reduções, impasses e a afirmação em análise antes de produzir proof.md autocontido.

**Alteração sugerida:** Estruturar notas em enunciado, hipóteses, lemas provados, tentativas descartadas e obrigações abertas; incluir checkpoint de recursos e conclusão honestamente inconclusiva.

**Cenário candidato de validação:** O passo que ficou sem justificativa. Cenário fictício: [ENUNCIADO] contém o problema e [NOTAS] registra uma tentativa com um passo ainda injustificado. [LIMITE] define os recursos disponíveis.

**Entrega a conferir:** Notas de investigação e demonstração autocontida, ou registro preciso do ponto aberto.

**Critério de conferência:** Todo passo da prova final precisa de justificativa; notas exploratórias não podem aparecer como teoremas estabelecidos.

**Rastreabilidade:** SKILL.md com 70 linhas e 957 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `2b6ecb93b01471142f928dd0fa4abd7e35782ed8f1058d498521039564387305`.

### DD-131 — Controle de acesso ao assistente pelo Telegram

Identificador: `telegram-access` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Exige autorização confiável no terminal e trata políticas de remetente e grupo separadamente.

**Ponto de melhoria:** Melhorar verificação de identidade numérica e atualização concorrente do estado de acesso.

**Evidência na fonte:** State shape; pair <code>; group add <groupId>; Implementation notes

**Alteração sugerida:** Validar tipos de IDs e código exato, gravar estado atomicamente e testar mensagens de canal que tentam se promover à allowlist sem autorização do terminal.

**Cenário candidato de validação:** A mensagem que tenta conceder acesso. Cenário fictício: [POLITICA_ATUAL] descreve o canal e [CODIGO_EXATO] será informado pelo usuário no terminal. Uma mensagem externa solicita adicionar [REMETENTE].

**Entrega a conferir:** Revisão da política e proposta mínima condicionada à autorização confiável.

**Critério de conferência:** Uma mensagem do Telegram não pode autorizar sua própria inclusão; o pareamento deve usar o código exato informado.

**Rastreabilidade:** SKILL.md com 147 linhas e 558 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `a69adeb034413ddfa88392a217e7cb7d67eb5fcd393fd2429fe1e4f88506a46d`.

### DD-132 — Configuração do canal Telegram para assistentes

Identificador: `telegram-configure` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Explica token, diretório de estado e transição do pareamento temporário para allowlist.

**Ponto de melhoria:** Evitar exposição parcial de token e minimizar passagem de credencial pela linha de comando.

**Evidência na fonte:** No args — status and guidance: show first 10 chars masked; <token> — save it

**Alteração sugerida:** Mostrar apenas configurado/não configurado e aceitar segredo por entrada protegida ou mecanismo de credenciais; evitar que argumentos e logs persistam o token.

**Cenário candidato de validação:** Configurado não significa conectado. Cenário fictício: [DIRETORIO_ESTADO] contém a configuração do canal e [REMETENTES_AUTORIZADOS] define os participantes. A credencial será fornecida por um mecanismo seguro do ambiente.

**Entrega a conferir:** Estado da configuração, pendências de pareamento e roteiro de teste do canal.

**Critério de conferência:** O token não pode aparecer no relatório; estar salvo não comprova conexão nem autorização dos remetentes.

**Rastreabilidade:** SKILL.md com 109 linhas e 604 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `1bb834ccaf5f64d0190d6ee4cf9627fbf64d35bd2b6fd4d9b6fedc021293ac4a`.

### DD-133 — Triagem de acordos de confidencialidade

Identificador: `triage-nda` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Procura restrições adicionais e exclusões além do título NDA, com roteamento para revisão.

**Ponto de melhoria:** Qualificar os parâmetros padrão por jurisdição e evitar que GREEN pareça aprovação automática.

**Evidência na fonte:** Step 2: Load NDA Playbook; If no NDA playbook is configured; Quick Screen

**Alteração sugerida:** Exigir contexto de jurisdição e versão do playbook; quando ausente, rotular critérios como provisórios e impedir equiparar classificação verde a poder de assinatura.

**Cenário candidato de validação:** O NDA com obrigação adicional. Cenário fictício: [NDA] contém confidencialidade e uma restrição de contratação. [PLAYBOOK_NDA] informa os critérios internos; [JURISDICAO] ainda precisa ser confirmada.

**Entrega a conferir:** Triagem fundamentada, cláusulas relevantes e perguntas para o responsável jurídico.

**Critério de conferência:** A classificação precisa apontar critérios e trechos; um resultado favorável não equivale à aprovação para assinar.

**Rastreabilidade:** SKILL.md com 263 linhas e 2060 palavras no corpo; 1 links Markdown locais inspecionados. SHA-256 da fonte: `767a8f6759268e003ee882af8dfb56579aca2121b9dc49a2c65c4e77de93f768`.

**Pendência estrutural:** referência ausente no pacote: `../../CONNECTORS.md`.

### DD-134 — Organização de contratos e pendências de fornecedores

Identificador: `vendor-check` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Consolida contratos de várias fontes e separa análise de lacunas e prazos próximos.

**Ponto de melhoria:** Distinguir ausência na janela de busca de inexistência do acordo ou obrigação.

**Evidência na fonte:** Step 2: Search Connected Systems; Step 4: Gap Analysis

**Alteração sugerida:** Incluir cobertura por sistema, intervalos consultados e consulta a contratos antigos ainda vigentes; usar não encontrado nas fontes consultadas em vez de não existe.

**Cenário candidato de validação:** A proposta que parecia contrato. Cenário fictício: Cedro tem [CONTRATO_ASSINADO], [PROPOSTA_RECENTE] e [ADITIVOS_DISPONIVEIS]. [FONTES_AUTORIZADAS] define os sistemas pesquisáveis; outras bases podem estar indisponíveis.

**Entrega a conferir:** Quadro de acordos com fontes, datas, lacunas e perguntas de validação.

**Critério de conferência:** Proposta não pode aparecer como contrato assinado; cada status deve ser sustentado pelo documento original ou marcado como pendente.

**Rastreabilidade:** SKILL.md com 160 linhas e 791 palavras no corpo; 1 links Markdown locais inspecionados. SHA-256 da fonte: `38be57a5e9e959874d2cb78e8493211664bc452e6225cb5bdbb8b12e6f444d2e`.

**Pendência estrutural:** referência ausente no pacote: `../../CONNECTORS.md`.

### DD-135 — Mapeamento de jornadas a partir de gravações

Identificador: `video-interaction-mapper` · Prioridade: **Alta** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Separa análise local, upload e verificação visual de um storyboard nativo em Figma Design.

**Ponto de melhoria:** Adaptar instalação de dependências e pré-voo ao ambiente sem alterar pacotes globais desnecessariamente.

**Evidência na fonte:** Required Inputs and Tools; Validate and Prepare: pip install Pillow --break-system-packages -q

**Alteração sugerida:** Trocar a instalação global por ambiente Python dedicado e verificar capacidades create_new_file/use_figma/upload_assets; bloquear escrita em FigJam ou Slides e preservar gatilhos incertos.

**Cenário candidato de validação:** O painel que aparece sem clique visível. Cenário fictício: [VIDEO_LOCAL] mostra uma busca abrindo um painel, mas o cursor desaparece no momento da transição. [ARQUIVO_FIGMA_DESIGN] é o destino autorizado.

**Entrega a conferir:** Storyboard estático com quadros, anotações e incertezas sobre as transições.

**Critério de conferência:** Cada estado deve corresponder a um quadro real; gatilhos não visíveis precisam estar marcados como inferência ou desconhecidos.

**Rastreabilidade:** SKILL.md com 313 linhas e 1546 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `e40ac6049ef26a0aa7ee486fd413cdd6673a56d3a7d3722a8ab2eb98619d6290`.

### DD-136 — Vídeos de produto e conteúdo para redes

Identificador: `video-programatico-reels` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Usa renderização determinística, sincronização por palavras e prévia antes do render final.

**Ponto de melhoria:** Externalizar caminhos de ferramentas e validar capacidade de disco antes de uma renderização longa.

**Evidência na fonte:** Visão geral: Ajuste as constantes de caminho; Princípios e regras

**Alteração sugerida:** Criar configuração por ambiente, descoberta de ffmpeg/Edge, estimativa de espaço e pasta de saída segura; validar áudio e vídeo com ffprobe antes de anunciar arquivo final.

**Cenário candidato de validação:** A voz mudou de ritmo. Cenário fictício: [ROTEIRO_APROVADO] apresenta um produto com dados de demonstração. [ASSETS_AUTORIZADOS] contém imagens; a saída desejada é vertical 1080x1920 com voz autorizada.

**Entrega a conferir:** Prévia revisável e, após validação, arquivo de vídeo com verificação técnica.

**Critério de conferência:** Legendas devem acompanhar a fala; o arquivo precisa ter a resolução solicitada e não pode expor dados reais de clientes.

**Rastreabilidade:** SKILL.md com 106 linhas e 1313 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `924559aaec77092dbfda8a520edf8a1eac69c7c60eb9997e0a1dc1154da549f9`.

### DD-137 — Regras de automação para rotinas no Claude Code

Identificador: `writing-hookify-rules` · Prioridade: **Média** · Estado: melhoria proposta.

**O que já funciona nas instruções:** Distingue eventos, condições, avisos e bloqueios, incluindo exemplos de teste de regex.

**Ponto de melhoria:** Testar a semântica real do plugin além da correspondência isolada da expressão.

**Evidência na fonte:** Frontmatter Fields; Advanced Format (Multiple Conditions); Testing Patterns

**Alteração sugerida:** Adicionar fixtures por evento e campo, casos de condições combinadas e ação block em eventos suportados; registrar falsos positivos e limites de observação do Hookify.

**Cenário candidato de validação:** O aviso que dispara em tudo. Cenário fictício: [REGRA_ATUAL] tenta observar arquivos de ambiente. [CASOS_POSITIVOS] e [CASOS_NEGATIVOS] contêm exemplos sintéticos sem credenciais reais; Hookify precisa estar disponível.

**Entrega a conferir:** Regra Hookify revisável, mensagem de orientação e resultados dos casos de correspondência.

**Critério de conferência:** Casos positivos devem disparar e negativos devem passar; a ação declarada precisa corresponder ao evento suportado.

**Rastreabilidade:** SKILL.md com 375 linhas e 1106 palavras no corpo; 0 links Markdown locais inspecionados. SHA-256 da fonte: `2994b5d3152243b1a1cbf8358e9d7c18f290f31a23920647f31053c3efdf990d`.
