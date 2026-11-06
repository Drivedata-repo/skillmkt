# DriveData Deck — coleção 1.1 e lista de espera

**Problema → skill recomendada → download.** A landing pública apresenta missões e recebe inscrições na lista de espera. A demonstração continua gratuita: a pessoa entra com a senha compartilhada, escolhe uma das 137 cartas e baixa o pacote. Não há cobrança ou checkout.

Publicado em https://deck.drivedata.com.br . A raiz é pública; `/login` abre a entrada da demo; `/app` exige sessão; `/privacidade` explica o uso dos dados. O endereço técnico `skillmkt-beta.vercel.app` permanece disponível.

Produto: **DriveData Deck**. Subdomínio `deck.drivedata.com.br` configurado e verificado na Vercel, com CNAME no Cloudflare. O domínio principal da DriveData é preservado.

## Experiência

- Landing com cartas holográficas, paralaxe e quatro seleções de tarefa. A revisão editorial mostra amostras de planilha, conciliação de indicador, escopo de produto e conteúdo, com dados fictícios do próprio catálogo. Explica o pacote, a instalação e os dois caminhos de uso. A lista de espera é distinta da demo gratuita por senha.
- Tipografia Archivo/Inter hospedada localmente. Direção visual e fontes da pesquisa de skills em `DESIGN.md`; efeitos concentrados nas cartas, com leitura em superfícies claras e escuras.
- Rolagem abre uma carta em três camadas: skill, instruções e resultado ilustrativo. Conexões luminosas, perspectiva nos exemplos e movimento nos guias reforçam a apresentação. A cena fixa se adapta ao tamanho da tela; um controle de pausa acompanha a leitura.
- Login com portal de luz, cartas em CSS 3D, reflexo holográfico, movimento e transição de desbloqueio.
- Assinatura sonora sintetizada com Web Audio após interação do visitante; botão para silenciar. Nenhum áudio externo.
- Movimento pode ser pausado e respeita `prefers-reduced-motion`.
- Português, inglês e espanhol em todo o produto: seletor com bandeiras SVG, escolha persistida, catálogo, triagem, exemplos, primeiro uso, Meu Deck, jornadas, login, privacidade e mensagens. Guias Markdown podem ser baixados no idioma selecionado.
- Catálogo: 137 IDs permanentes `DD-001` a `DD-137`, 10 grupos, busca, filtros e frente/verso.
- A recomendação explica a capacidade da skill e os requisitos para começar. Downloads estão liberados aos participantes da demo.
- Pedidos ambíguos recebem uma pergunta curta. A seleção considera até 20 candidatos e apresenta até três indicações.
- Dez exemplos com dados fictícios, resultado de referência e critérios de conferência. São referências determinísticas, não execuções homologadas das skills por IA.
- Primeiro uso guiado: ambiente, instalação, comando e conferência. Meu Deck guarda favoritos, downloads, versões e progresso neste navegador, com exportação/importação JSON. Não sincroniza dados entre usuários.
- Cinco jornadas combinam três skills cada, com roteiro baixável e entregas entre etapas.
- Cada ZIP contém a pasta da skill, `COMO-USAR.md`, `REVISAO.md`, manifesto, hashes por arquivo e exemplo quando disponível. O download não instala ferramentas, não executa a skill e não substitui as dependências do ambiente de origem.

## Rodar localmente

Node 24. Execute `npm ci`, configure `.env.local` conforme `.env.example`, `npm run build` e `npm start`. Landing em http://127.0.0.1:4317/ e login em http://127.0.0.1:4317/login . O servidor local escuta apenas nesta máquina.

Para definir/trocar a senha: `node scripts/set-demo-password.cjs`. A entrada é oculta; o script grava apenas o hash scrypt e uma chave aleatória em `.env.local`, ignorado pelo Git. Reinicie o servidor após a troca. Não copie a senha nem os valores das variáveis para arquivos públicos.

## Acesso

`POST /api/session` valida a senha no servidor. A sessão assinada dura 8 horas, em cookie HttpOnly/SameSite=Strict. Na Vercel, usa Secure e prefixo `__Host-`. Mudar o hash ou a chave invalida todas as sessões anteriores. Sair remove o cookie do navegador; esta demo não oferece administração individual de sessões nem contas por comprador.

Página `/app`, catálogo, recomendações, status e downloads exigem sessão. Falta de configuração bloqueia o acesso. Login usa limite persistido no banco de 25 tentativas/hora por IP; downloads, 150/hora por IP. O IP é armazenado apenas como hash HMAC no contador. As chaves e pacotes nunca estão no JavaScript público. O antigo endpoint de leads retorna 410; registros anteriores não foram apagados.

## Pacotes privados

Os arquivos originais **não fazem parte deste repositório público**. `scripts/package-skills.cjs <pasta-das-skills>` prepara os 137 ZIPs em `.local/releases/1.1.0`, verifica padrões de credenciais, frontmatter e integridade. Referências pessoais de caminhos foram normalizadas em 122 arquivos de documentação; scripts, licenças e atribuições são preservados. O script não deve ser executado no build público, pois requer os originais locais. `data/releases.cjs` contém apenas metadados seguros para o catálogo. Alterações de conteúdo devem gerar uma nova versão, sem sobrescrever releases existentes.

A tabela privada `skillmkt.package_releases` guarda ZIP, versão, SHA-256 e manifesto. A migração `20261106204653_deck_releases.sql` habilita RLS e permite apenas SELECT ao papel `skillmkt_app`; `anon` e `authenticated` não têm acesso. A tabela antiga `skillmkt.packages` foi preservada. A importação administrativa é separada do runtime. Os 137 pacotes 1.1.0 foram importados; a credencial administrativa não fica em arquivo nem na aplicação.

`GET /api/download?id=<skill-id>` valida a sessão e o ID, aplica o limite e entrega o ZIP por conexão TLS, com `Cache-Control: private, no-store`. O cliente não escolhe caminhos de arquivo. O maior pacote atual tem menos de 300 KB.

O servidor confere o hash cadastrado da versão e o navegador verifica o SHA-256 do arquivo antes de iniciar o download e registrar o histórico.

## Lista de espera

`POST /api/waitlist` recebe nome, email, perfil, interesse e consentimento explícito. Valida tamanho, formato e origem; aplica limite de cinco solicitações/hora por IP e campo antiautomação. Emails repetidos recebem a mesma confirmação sem duplicar a inscrição. Não envia mensagens automaticamente nem confirma compra.

`skillmkt.waitlist` tem RLS. O runtime só pode inserir; não pode consultar ou editar a lista. Não existe endpoint público de listagem, e a senha da demo não dá acesso aos inscritos. Para consultar a lista, use uma sessão administrativa do SQL Editor do Supabase:

```sql
select name, email, audience, interest, preferred_language, consent_version, created_at
from skillmkt.waitlist
order by created_at desc;
```

Exporte dados pessoais apenas pelo acesso administrativo autorizado. O formulário de demonstração foi testado com endereço fictício, removido após a verificação.

O banco usa o transaction pooler Supabase, com validação de certificado, pool máximo 2 e sem prepared statements nomeados. Certificado público da CA em `certs/supabase-ca.crt`, obtido do endpoint usado pelo dashboard oficial.

## Idiomas

- URLs aceitam `?lang=pt`, `?lang=en` e `?lang=es`. O seletor salva a preferência em `drivedata-language` e no cookie `deck_locale`; o padrão é português. Links internos e redirecionamentos preservam a escolha, e a seção ativa da coleção é mantida na troca.
- `data/i18n-public.cjs` e `data/i18n-market.cjs` contêm as traduções da interface. O build gera `dist/translations.js`, valida pares e placeholders. `dist/i18n-core.js` e `dist/i18n.js` aplicam texto e atributos sem converter traduções em HTML ou alterar o texto digitado pelo visitante.
- `data/i18n/catalog-text.json` contém 1.080 frases de produto traduzidas; `lib/catalog-i18n.cjs` localiza as 137 skills, cinco jornadas e dez exemplos. IDs, versões, hashes, fórmulas, permissões e valores numéricos permanecem estáveis. `categoryKey` preserva a arte de cada grupo.
- A API valida o idioma pela query, pelo cabeçalho `x-deck-language` ou pelo cookie. A triagem tem vocabulário e perguntas nos três idiomas; a IA opcional também recebe a preferência de idioma. O modo de catálogo funciona sem provedor de tradução externo.
- Os ZIPs originais permanecem na língua de origem e com seus hashes originais. A tela explica isso e oferece um guia de primeiro uso no idioma escolhido. Comandos copiados, exemplos JSON e roteiros Markdown são localizados; dados informados pelo visitante não são traduzidos automaticamente.
- A migração aditiva `20261106222629_waitlist_language.sql` registra `preferred_language` na lista de espera. Cadastros anteriores e versões antigas do site usam `pt`; novos cadastros aceitam apenas `pt/en/es`. Ela deve ser aplicada antes de publicar o código. RLS e acesso de inserção da aplicação são preservados; inscrições repetidas continuam sem alteração do registro original.
- Regressões verificam cobertura de texto, paridade dos idiomas, integridade dos exemplos, comandos, seleção de idioma, triagem e permissões. Os testes de banco usam transações revertidas e não deixam cadastros de QA.

## Indicação de skills

`lib/match.cjs` relaciona o problema às capacidades, aplicações e requisitos reais do catálogo. Há 12 objetivos de trabalho, 10 opções de ferramenta e filtro para evitar conectores específicos, além das escolhas abertas. `lib/triage-profile.cjs` valida os filtros e aplica a interseção; não relaxa restrições para preencher a lista. O ranking mostra até três indicações, com entrega e limite de uso; grupos ambíguos recebem uma pergunta contextual.

O motor distingue termos HTTP de conteúdo editorial, preparação de reunião de transcrição, necessidades de segurança de criação de produto e API Next.js de servidor MCP. Exclusões explícitas de ferramentas são reconhecidas por regras nos três idiomas, com nomes excluídos visíveis no resultado. Essas regras não são compreensão semântica universal: quando não há correspondência, a interface orienta a reformular. Agendamento de eventos no Google Calendar/Outlook não é uma capacidade desta coleção e recebe resposta explícita, sem indicar a skill de documentos Google para isso.

Skills de apoio úteis, como Git ou TMDL, entram somente em tarefas explícitas compatíveis; modelos internos, contexto privado e variantes de staging não são promovidos como soluções prontas. A indicação por IA opcional recebe apenas candidatos que já passaram pelos filtros.

## Universos das 137 cartas

- `data/universes/001-046.json`, `047-092.json` e `093-137.json`: autoria individual em PT/EN/ES. Cada registro tem identidade, frase curta, história ilustrativa, propósito, duas aplicações, missão com contexto/comando/entrega/conferência, três passos e limite real.
- `lib/universes.cjs` valida o contrato; `lib/catalog-i18n.cjs` entrega a versão autorada de cada idioma. Não há tradução automática das narrativas nem mistura de histórias fictícias com resultados homologados.
- Cada carta tem uma assinatura gráfica estável. O modal organiza Universo, Aplicações, Missão prática, Primeiro uso e Ficha técnica. Os dez exemplos determinísticos continuam separados dos 137 cenários ilustrativos.
- O comando da missão reúne contexto e critérios; o guia Markdown leva o universo completo no idioma ativo. Os ZIPs originais 1.1.0 permanecem íntegros e separados desse material editorial.
- A URL conserva carta, capítulo, etapa, giro e face durante a troca de idioma. Foco de teclado é restaurado entre capítulos e ao fechar; avisos do modal ficam em sua própria região acessível. Movimento reduzido desabilita o giro.

## Revisão das instruções originais

`reviews/REVISAO-137-SKILLS.md` e `reviews/skill-audit.json` consolidam a leitura individual das 137 fontes, com qualidade existente, melhoria, evidência, alteração sugerida e cenário candidato de validação. São propostas de evolução, não alegações de execução ou alterações silenciosas nas skills globais.

`scripts/audit-skill-sources.cjs` confere os ZIPs locais contra os hashes distribuídos e inspeciona frontmatter, extensão e links. A revisão encontrou sete referências externas a `CONNECTORS.md` ausentes no ZIP e quatro arquivos principais acima de 5.000 palavras. Também registra incompatibilidades entre variantes e a necessidade de separar referências privadas de futuras edições distribuíveis. Os pacotes da demo seguem protegidos por autenticação.

Se `GROQ_API_KEY` estiver configurada e o visitante optar por IA, **Qwen3.8-27B via Groq** refina a justificativa entre os candidatos existentes. A saída é validada por schema/IDs, com timeout e retorno ao catálogo em caso de falha. O visitante é informado antes de enviar seu relato à Groq. Sem chave, a recomendação por capacidades continua funcionando. A chamada real ao modelo exige chave própria e não foi validada nesta demo.

## Vercel

Importe `Drivedata-repo/skillmkt`, framework **Other**, build `npm run build`, output `dist`. `vercel.json` configura as funções e a página autenticada. Configure no servidor:

- `DATABASE_URL`: conexão do papel restrito, sem parâmetros que desativem a validação TLS.
- `RATE_LIMIT_SECRET`: segredo HMAC dos limites.
- `DEMO_PASSWORD_HASH` e `DEMO_SESSION_SECRET`: valores gerados pelo script local.
- `GROQ_API_KEY` e `GROQ_MODEL`: opcionais.

As variáveis locais não são enviadas pelo Git. Não use prefixos públicos. Configure o domínio apenas após vincular o projeto correto. Push não comprova deploy; verifique o status e o fluxo no endereço publicado.

## Verificar

`npm test` cobre senha, sessão, expiração, adulteração, proteção de rotas, validação de ID, seleção com refinamento, dez exemplos, importação do Deck e consentimento da lista. `node --env-file=.env.local --test tests/*.test.cjs` inclui os 137 ZIPs da versão atual, hashes por arquivo, manifests e privilégios de banco. Total: 72 testes, sem skips quando o banco está configurado, incluindo os universos em três idiomas e regressões de precisão da triagem.

## Evolução para venda

Esta demo libera todos os pacotes após a senha. A versão comercial precisa de contas individuais, checkout, confirmação de pagamento no servidor e autorização de download por compra. Não reutilize a senha compartilhada como controle de compra. A preparação do catálogo comercial também deve definir quais originais e licenças podem ser distribuídos para cada público; o acervo atual foi preparado para demonstração interna autorizada.
