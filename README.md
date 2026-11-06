# DriveData Deck — coleção 1.1 e lista de espera

**Problema → skill recomendada → download.** A landing pública apresenta missões e recebe inscrições na lista de espera. A demonstração continua gratuita: a pessoa entra com a senha compartilhada, escolhe uma das 137 cartas e baixa o pacote. Não há cobrança ou checkout.

Publicado em https://skillmkt-beta.vercel.app . A raiz é pública; `/login` abre a entrada da demo; `/app` exige sessão; `/privacidade` explica o uso dos dados.

Nome provisório: **DriveData Deck**. URL sugerida: `deck.drivedata.com.br`, ainda não configurada por este repositório.

## Experiência

- Landing com cartas holográficas, paralaxe e quatro seleções de tarefa. A revisão editorial mostra amostras de planilha, conciliação de indicador, escopo de produto e conteúdo, com dados fictícios do próprio catálogo. Explica o pacote, a instalação e os dois caminhos de uso. A lista de espera é distinta da demo gratuita por senha.
- Tipografia Archivo/Inter hospedada localmente. Direção visual e fontes da pesquisa de skills em `DESIGN.md`; efeitos concentrados nas cartas, com leitura em superfícies claras e escuras.
- Login com portal de luz, cartas em CSS 3D, reflexo holográfico, movimento e transição de desbloqueio.
- Assinatura sonora sintetizada com Web Audio após interação do visitante; botão para silenciar. Nenhum áudio externo.
- Movimento pode ser pausado e respeita `prefers-reduced-motion`.
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
select name, email, audience, interest, consent_version, created_at
from skillmkt.waitlist
order by created_at desc;
```

Exporte dados pessoais apenas pelo acesso administrativo autorizado. O formulário de demonstração foi testado com endereço fictício, removido após a verificação.

O banco usa o transaction pooler Supabase, com validação de certificado, pool máximo 2 e sem prepared statements nomeados. Certificado público da CA em `certs/supabase-ca.crt`, obtido do endpoint usado pelo dashboard oficial.

## Indicação de skills

`lib/match.cjs` relaciona o problema aos nomes, capacidades e descrições do catálogo. Não inventa novas skills. Falta de relação gera orientação para detalhar a tarefa. O perfil ajusta o público da recomendação.

Se `GROQ_API_KEY` estiver configurada e o visitante optar por IA, **Qwen3.8-27B via Groq** refina a justificativa entre os candidatos existentes. A saída é validada por schema/IDs, com timeout e retorno ao catálogo em caso de falha. O visitante é informado antes de enviar seu relato à Groq. Sem chave, a recomendação por capacidades continua funcionando. A chamada real ao modelo exige chave própria e não foi validada nesta demo.

## Vercel

Importe `Drivedata-repo/skillmkt`, framework **Other**, build `npm run build`, output `dist`. `vercel.json` configura as funções e a página autenticada. Configure no servidor:

- `DATABASE_URL`: conexão do papel restrito, sem parâmetros que desativem a validação TLS.
- `RATE_LIMIT_SECRET`: segredo HMAC dos limites.
- `DEMO_PASSWORD_HASH` e `DEMO_SESSION_SECRET`: valores gerados pelo script local.
- `GROQ_API_KEY` e `GROQ_MODEL`: opcionais.

As variáveis locais não são enviadas pelo Git. Não use prefixos públicos. Configure o domínio apenas após vincular o projeto correto. Push não comprova deploy; verifique o status e o fluxo no endereço publicado.

## Verificar

`npm test` cobre senha, sessão, expiração, adulteração, proteção de rotas, validação de ID, seleção com refinamento, dez exemplos, importação do Deck e consentimento da lista. `node --env-file=.env.local --test tests/*.test.cjs` inclui os 137 ZIPs da versão atual, hashes por arquivo, manifests e privilégios de banco. Total: 14 testes, sem skips quando o banco está configurado.

## Evolução para venda

Esta demo libera todos os pacotes após a senha. A versão comercial precisa de contas individuais, checkout, confirmação de pagamento no servidor e autorização de download por compra. Não reutilize a senha compartilhada como controle de compra. A preparação do catálogo comercial também deve definir quais originais e licenças podem ser distribuídos para cada público; o acervo atual foi preparado para demonstração interna autorizada.
