# DriveData Skill Marketplace

Catálogo comercial com **137 cartas de skills**, **22 soluções** e caminhos para empresas e equipes técnicas. Interface em português com logo DriveData, cartas holográficas CSS 3D, giro da vitrine, frente/verso, busca, filtros e briefing com envio ou download.

## Executar

Node 24, `npm ci`, copie `.env.example` para `.env.local` e configure as variáveis do servidor. `npm run build` e `npm start`. Prévia em http://127.0.0.1:4317.

`npm test` valida catálogo e entradas. `node --env-file=.env.local --test tests/*.test.cjs` inclui teste real do banco em transação revertida. `npm run db:check` verifica TLS e papel restrito.

## IA

Integração preparada para **Qwen3.8-27B**, pesos abertos Apache 2.0, hospedado pela **Groq**. Configure `GROQ_API_KEY` e `GROQ_MODEL` no servidor. A Groq é um serviço hospedado, não um servidor privado. Conta/chave são necessárias; limites gratuitos e cobrança dependem da conta. Sem chave, consentimento, resposta válida ou disponibilidade, a triagem usa o catálogo local e informa o modo utilizado.

A IA recebe apenas desafio, ferramentas, resultado esperado, área e ofertas públicas. Contatos não são incluídos pelo aplicativo. O visitante deve evitar inserir dados pessoais/sensíveis no relato. Consentimento é opcional e desmarcado. A saída é validada contra IDs do catálogo; não executa ferramentas, não fixa preços ou prazos.

Fontes: [modelos Groq](https://console.groq.com/docs/models), [modelo Qwen](https://huggingface.co/Qwen/Qwen3.8-27B), [limites](https://console.groq.com/docs/rate-limits), [chave](https://console.groq.com/keys).

## PostgreSQL / Supabase

Schema privado `skillmkt`, separado das demais aplicações. `leads` registra contato, contexto, soluções, skills e versão do consentimento. `rate_limits` limita envios e IA por IP com hash HMAC; não armazena IP bruto. A aplicação usa papel `skillmkt_app` com permissões restritas e RLS, sem acesso de leitura aos contatos. O usuário administrador consulta os pedidos pelo SQL Editor autenticado do projeto; não há painel público de leads.

A migração está em `supabase/migrations`. Em outro banco, crie um papel LOGIN `skillmkt_app` com senha forte via canal seguro e aplique a migração com usuário administrador. A senha administrativa não pertence às variáveis do site. A migração cria um schema novo deliberadamente e não apaga objetos existentes. Não reaplique em schema já configurado.

Conexão pelo transaction pooler IPv4, pool de no máximo 2 conexões por instância, sem prepared statements nomeados. TLS verifica identidade e certificado com `certs/supabase-ca.crt`, obtido do endereço oficial usado pelo dashboard: https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt . Não desative a validação TLS.

Envio possui chave idempotente: uma repetição retorna o mesmo protocolo; alteração com a mesma chave é rejeitada. Não dispara e-mails nem mensagens automaticamente. Atendimento e exclusão dos pedidos são feitos pela equipe autorizada no banco. Defina a política operacional de retenção antes de campanhas públicas.

## Vercel

Importe este repositório como framework **Other**. Build `npm run build`, output `dist`, funções Node em `api/`. Em Settings → Environment Variables, configure `DATABASE_URL` do papel restrito, `RATE_LIMIT_SECRET`, `GROQ_API_KEY` (opcional) e `GROQ_MODEL`. Nunca use prefixo `NEXT_PUBLIC_`. Use variáveis próprias para Preview se não quiser pedidos de teste no banco de produção. A publicação deve ser verificada após o build; push não comprova deploy.

## Catálogo e cartas

`dist/catalog.js`: ofertas comerciais revisadas. `dist/skills.js`: metadados públicos das 137 skills. IDs `DD-001` a `DD-137` são permanentes nesta coleção; ao adicionar uma carta, use o próximo código livre, sem renumerar. Acabamento HOLO é visual, não pontuação, homologação, exclusividade ou escassez real. Dependências e variantes são explicitadas no detalhe.

Os originais SKILL.md, caminhos locais, credenciais e histórico de clientes não fazem parte deste repositório público. `scripts/export-cards.cjs` importa apenas campos permitidos de um inventário revisado; não regenere códigos após mudanças sem preservar o mapa existente. Conteúdos restritos têm descrição pública genérica.

Movimento reduzido do sistema é respeitado; a vitrine permite pausar. Efeito “4D” é uma experiência visual de profundidade e holografia em CSS 3D, sem equipamento especial. Fontes locais e suas licenças ficam em `dist/fonts`. Logo fornecido pela DriveData.
