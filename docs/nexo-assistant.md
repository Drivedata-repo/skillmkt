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
