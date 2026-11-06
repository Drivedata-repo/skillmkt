# DriveData Deck — demonstração privada

**Problema → skill recomendada → download.** A pessoa entra com uma senha compartilhada, descreve o que precisa resolver ou explora as 137 cartas, e baixa o pacote escolhido. Não há briefing, formulário comercial, cobrança ou checkout nesta demonstração.

Nome provisório: **DriveData Deck**. URL sugerida: `deck.drivedata.com.br`, ainda não configurada por este repositório.

## Experiência

- Login com portal de luz, cartas em CSS 3D, reflexo holográfico, movimento e transição de desbloqueio.
- Assinatura sonora sintetizada com Web Audio após interação do visitante; botão para silenciar. Nenhum áudio externo.
- Movimento pode ser pausado e respeita `prefers-reduced-motion`.
- Catálogo: 137 IDs permanentes `DD-001` a `DD-137`, 10 grupos, busca, filtros e frente/verso.
- A recomendação explica a capacidade da skill e os requisitos para começar. Downloads estão liberados aos participantes da demo.
- Cada ZIP contém o `SKILL.md` instalado, arquivos auxiliares e `COMO-USAR.md`. O download não instala ferramentas, não executa a skill e não substitui as dependências do ambiente de origem.

## Rodar localmente

Node 24. Execute `npm ci`, configure `.env.local` conforme `.env.example`, `npm run build` e `npm start`. Login em http://127.0.0.1:4317/ . O servidor local escuta apenas nesta máquina.

Para definir/trocar a senha: `node scripts/set-demo-password.cjs`. A entrada é oculta; o script grava apenas o hash scrypt e uma chave aleatória em `.env.local`, ignorado pelo Git. Reinicie o servidor após a troca. Não copie a senha nem os valores das variáveis para arquivos públicos.

## Acesso

`POST /api/session` valida a senha no servidor. A sessão assinada dura 8 horas, em cookie HttpOnly/SameSite=Strict. Na Vercel, usa Secure e prefixo `__Host-`. Mudar o hash ou a chave invalida todas as sessões anteriores. Sair remove o cookie do navegador; esta demo não oferece administração individual de sessões nem contas por comprador.

Página `/app`, catálogo, recomendações, status e downloads exigem sessão. Falta de configuração bloqueia o acesso. Login usa limite persistido no banco de 25 tentativas/hora por IP; downloads, 150/hora por IP. O IP é armazenado apenas como hash HMAC no contador. As chaves e pacotes nunca estão no JavaScript público. O antigo endpoint de leads retorna 410; registros anteriores não foram apagados.

## Pacotes privados

Os arquivos originais **não fazem parte deste repositório público**. `scripts/package-skills.cjs <pasta-das-skills>` prepara os 137 ZIPs em `.local/packages`, faz uma checagem de padrões de credenciais e verifica a integridade. Os arquivos originais e atribuições são preservados. O script não deve ser executado no build público, pois requer os originais locais.

A tabela privada `skillmkt.packages` guarda o ZIP, SHA-256 e contagem de arquivos. A migração em `supabase/migrations/20261106184328_skill_packages.sql` habilita RLS e permite apenas SELECT ao papel `skillmkt_app`. `anon` e `authenticated` não têm acesso. A importação é uma operação administrativa local, separada do runtime do site. Os 137 pacotes da demo foram importados; a credencial administrativa não fica em arquivo nem na aplicação.

`GET /api/download?id=<skill-id>` valida a sessão e o ID, aplica o limite e entrega o ZIP por conexão TLS, com `Cache-Control: private, no-store`. O cliente não escolhe caminhos de arquivo. O maior pacote atual tem menos de 300 KB.

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

`npm test` cobre senha, sessão, expiração, adulteração, proteção de rotas, validação de ID e correspondência de skills. `node --env-file=.env.local --test tests/*.test.cjs` inclui a verificação dos 137 ZIPs no banco, hashes, manifests e restrições de leitura/escrita.

## Evolução para venda

Esta demo libera todos os pacotes após a senha. A versão comercial precisa de contas individuais, checkout, confirmação de pagamento no servidor e autorização de download por compra. Não reutilize a senha compartilhada como controle de compra. A preparação do catálogo comercial também deve definir quais originais e licenças podem ser distribuídos para cada público; o acervo atual foi preparado para demonstração interna autorizada.
