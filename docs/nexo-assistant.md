# NEXO — guia do DriveData Deck

Primeira versão funcional para a área autenticada do Deck, criada em 2026-11-08.

## Personagem e interface

NEXO é um robô flutuante original, com armadura azul-marinho, painéis azuis e verdes, rosto expressivo e uma carta na mão. O avatar transparente (WebP de 512 px, 65 KB) está em `dist/assets/nexo-avatar-v1.webp`; é o mesmo arquivo usado no botão flutuante, no cabeçalho da conversa e no acesso pela carta. A imagem foi gerada com a ferramenta integrada de imagens e copiada para o projeto. O PNG original de 1254 px, com 1,4 MB, fica como arte-mestre em `docs/nexo/avatar-master.png`, fora do `dist`, para não pesar no carregamento.

O personagem reage ao passar o mouse e ao consultar o catálogo. As animações respeitam movimento reduzido. A conversa usa um diálogo nativo, com teclado, Escape e retorno à carta. O idioma, o texto ainda não enviado, o histórico e as seções expandidas são preservados ao trocar PT/EN/ES. Recarregar a página inicia uma conversa nova.

## Capacidades desta versão

- Recebe a tarefa em texto e consulta a triagem existente; perguntas de refinamento viram escolhas dentro da conversa.
- Mostra a carta principal com finalidade, entrega, requisitos, limites, preço e fonte identificada por código e versão. Alternativas ficam recolhidas para facilitar a leitura.
- Explica a carta aberta e compara até três cartas pelos códigos DD.
- Quando a triagem reconhece um percurso de duas ou três etapas, apresenta sua ordem e permite adicionar as cartas ao Meu Deck.
- Abre a carta, o primeiro uso ou sua ajuda. Salvar reaproveita o fluxo de primeira inclusão e invocação do Deck.
- Orienta instalação, download, recuperação de erros comuns, preços da sessão, invocação e passaporte.
- Considera `mode=demo` ou `mode=customer`. Só aceita IDs presentes no catálogo autorizado da sessão; a API continua aplicando a autorização no servidor.

## Limites e dados

Esta versão é um assistente guiado pelo catálogo, com respostas de ajuda escritas e busca por capacidades. Não é uma conversa generativa de propósito geral. Usa `/api/triage` com `useAI:false`; não precisa de nova chave nem envia a conversa a um modelo externo.

O histórico fica em memória na aba, limitado a vinte mensagens. A busca envia o problema, os refinamentos e os filtros necessários ao servidor existente. Comparações e guias de interface usam os dados já carregados. Não há nova tabela, armazenamento de conversa ou integração de atendimento humano. NEXO não executa skills, altera contas, consulta pagamentos ou afirma ter aberto chamados.

O avatar não tem narração automática nesta versão. Conversação generativa, voz natural e atendimento humano são evoluções separadas, que precisam de operação e integração próprias.

## Implementação e verificação

- `dist/nexo-core.js`: interpretação de intenções, conteúdo de ajuda, normalização de respostas, restrição de IDs e percursos.
- `dist/nexo.js`: conversa, refinamentos, cancelamento de pedidos, idioma e ações de navegação.
- `dist/nexo.css`: personagem, painel, responsividade e movimento reduzido.
- `data/i18n-nexo.cjs`: traduções escritas em inglês e espanhol.
- `views/market.html` e `dist/market.js`: pontos de entrada e integração com o catálogo, a triagem e o Meu Deck.
- `tests/nexo.test.cjs`: idiomas, contexto, preços por modo de acesso, restrição de IDs, respostas sem correspondência e ordem dos percursos.

Prévia local: `http://127.0.0.1:4340/app?lang=pt`. O servidor precisa estar iniciado nessa porta. A primeira revisão fica na branch `feat/nexo-assistant`.

## Chat com IA (desligado por padrão)

A v1 acima continua sendo o comportamento padrão. O chat com IA responde perguntas livres (por que uma carta é grátis, se dá para usar com cliente, erros de instalação) e fica **inerte** até ser ligado.

### Como liga

Variáveis de ambiente na Vercel: `NEXO_AI=on` e `GROQ_API_KEY` ligam para compradores. A demo só com `NEXO_AI_DEMO=on` (a senha da demo é compartilhada e gastaria a cota). `NEXO_MODEL` troca o modelo (padrão `openai/gpt-oss-120b`) e `NEXO_AI_DAILY_CAP` muda o teto global diário dos compradores (padrão 300 respostas) e `NEXO_AI_DEMO_DAILY_CAP` o da demo (padrão 60). O catálogo informa ao navegador, por sessão, se o chat está ligado (`nexoAI`).

### Como funciona

- Rota: `/api/nexo`, reescrita para `/api/triage?route=chat` em `vercel.json`. Fica dentro de `api/triage.js` porque a pasta `api/` já tem as 12 funções permitidas pela Vercel.
- `lib/nexo-chat.cjs`: filtro de dados sensíveis (senha, cartão com Luhn, CPF válido, chaves) antes de qualquer envio; candidatas (até 5 cartas, pelo mesmo acesso da sessão); prompt com mensagem, histórico e catálogo como dados; schema que só aceita IDs candidatos e temas conhecidos; nota de licença sempre vinda da base escrita, nunca do modelo.
- `data/nexo-help.cjs`: base de ajuda em PT, EN e ES e notas de licença por classe de direito (`lib/sale-rights.cjs`). É a única fonte de fatos de ajuda do modelo. Os textos de licença são rascunho e precisam de aprovação antes de ligar.
- Limites: 800 caracteres por mensagem, 4 falas de usuário no histórico, 12 respostas por hora e 30 por dia por pessoa (comprador por cliente, demo por IP), teto global diário (a demo tem teto próprio, para não esgotar a cota dos compradores), 8 respostas por conversa no navegador e 900 caracteres por resposta.
- Histórico: o navegador pode forjar falas do NEXO, então só falas do usuário chegam ao modelo, e a carta aberta só vale se passou pelo filtro de acesso.
- Saída: código DD citado na resposta tem de ser de carta candidata, e valor em dólar tem de ser igual a um preço candidato (ou 0, 7 ou 47 da regra de preços); links são removidos. Se falar de licença ou de uso com cliente sem carta em questão, o texto escrito da base acompanha a resposta.
- Falhou, estourou o limite ou o modelo errou o formato: o navegador volta ao guia da v1, sem expor o motivo.
- Privacidade: saem do navegador a mensagem, as últimas mensagens, o código da carta aberta e o idioma. Não saem e-mail nem identificador de cliente. Nada é guardado no servidor nem registrado em log.
- Com a IA ligada, as respostas locais sobre privacidade e "quem é você" mudam (`privacyAI`, `aboutAI` em `dist/nexo-core.js`), porque as da v1 afirmam que a conversa não vai a um modelo externo.

### Avaliação

`data/nexo-evals.json` tem 38 casos em PT, EN e ES (triagem, ajuda, licença por classe, segurança, recusa, acesso). `node scripts/run-nexo-evals.cjs --mock` valida o executor sem custo e **não avalia qualidade**. Com `GROQ_API_KEY` roda no modelo real. Meta para ligar: 100% em segurança, licença, recusa e acesso; 90% ou mais em triagem e ajuda.

### Antes de ligar

1. Rodar a avaliação no modelo real e atingir a meta.
2. João aprovar os textos de licença de `data/nexo-help.cjs` e o aviso de privacidade.
3. Ativar a retenção zero de dados na conta da Groq (ação no painel deles).
4. Atualizar `dist/privacy.html`: hoje não menciona IA nem provedor.
5. Definir o orçamento mensal e o teto diário.
6. Decidir se a demo participa (`NEXO_AI_DEMO`).

### Limitações conhecidas

A busca de candidatas é por palavras. Termos ambíguos podem trazer cartas sem relação (por exemplo, "fonte" de dados e fonte tipográfica). A IA só escolhe entre as candidatas, então não corrige isso. A qualidade do modelo em português ainda não foi medida.
O histórico enviado ao modelo só tem falas do usuário, então perguntas de continuação perdem o contexto das respostas anteriores do NEXO. O teto de saída (`maxOutputTokens` 1400) e o schema sem `not` para o caso sem candidatas precisam ser confirmados com uma chamada real, porque o modelo gasta tokens raciocinando antes do JSON.

### Revisão

Uma revisão independente (agente de arquitetura, só leitura) achou sete problemas que bloqueavam ligar a flag e vários menores. Todos foram corrigidos e têm teste: fala forjada do NEXO no histórico, carta aberta forjada, "minha senha é x" e cartão seguido de validade que passavam pelo filtro, schema sem candidatas, texto de licença impreciso para cartas MIT e Apache, teto global esgotável pela demo. Também: a mensagem barrada sai da conversa, o limite de 800 caracteres avisa, e o cabeçalho de IP só vale na Vercel.
