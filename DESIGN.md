# DriveData Deck: landing pública

## Objetivo

Explicar skills a quem ainda não conhece o formato, demonstrar quatro aplicações e captar interesse no lançamento. A demo por senha continua gratuita. O visitante não está comprando nem executando IA na página pública.

## Revisão de 6 de novembro de 2026

A abertura anterior apresentava a metáfora antes do produto: “Conhecimento. Em outra dimensão.”. Os exemplos eram parágrafos pequenos; o brilho, as órbitas, a faixa móvel e os rótulos competiam com as cartas. A lista prometia “um próximo capítulo” sem explicar a relação entre espera e demo.

Direção escolhida: mesa de trabalho com uma coleção de instrumentos. As cartas preservam a personalidade lúdica solicitada pelo João; o conteúdo ao redor usa tarefas, arquivos e resultados de referência. O efeito especial fica no objeto colecionável, não em todos os componentes.

## Composição

```
marca               exemplos / como usar        entrar na demo
Tem trabalho        carta física em destaque
para essa IA.       cartas de fundo e identificação
explicação          seleção de quatro tarefas
lista de espera     ver exemplo da carta
-------------------------------------------------------------
o que é uma skill   instrução / materiais / conferência
-------------------------------------------------------------
exemplos            tarefa -> amostra da entrega -> limites
-------------------------------------------------------------
o que vem no ZIP    pacote aberto + roteiro de uso
-------------------------------------------------------------
caminho negócio / caminho desenvolvimento
-------------------------------------------------------------
convite claro       formulário com consentimento
dúvidas frequentes / rodapé
```

## Tokens e tipografia

- Noite #070c13: abertura e seção do pacote.
- Azul profundo #112c4a: superfície da coleção.
- Azul Drive #075cdd: ação e lista de espera.
- Verde Drive #34d59a: acento de marca e seleção, com texto escuro.
- Papel frio #edf2f7: exemplos e explicação.
- Tinta #172e46: texto em superfícies claras; texto secundário #475d72.
- Archivo 700 para títulos e números de exemplo, Inter para leitura. Mono somente em nomes de arquivos e fórmula.
- Alinhamento à esquerda, títulos compactos, corpo de 15–18 px. Nenhum texto essencial minúsculo.

## Princípios

Não usar depoimentos, métricas de economia, clientes ou escassez inventados. As contagens vêm do catálogo. Exemplos explicitamente fictícios; saída de referência, nunca simulação de execução de IA. Não alterar login, autenticação, pacotes ou contratos do formulário. Uma chamada principal consistente: “Entrar na lista de espera”. Movimento de cartas pausável e reduzido conforme preferência do sistema. Sem faixa móvel, órbitas ou partículas decorativas no fundo. O pedido posterior de mais presença tecnológica é atendido pela abertura das cartas em camadas e por conexões luminosas ligadas à explicação do produto.

## Referências de skills pesquisadas

- Anthropic frontend-design: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- Impeccable: https://github.com/pbakaus/impeccable (pesquisado como referência de crítica e acabamento; CLI não instalado).
- Skills locais aplicadas: frontend-design, design-de-interface-autoral e sites-institucionais-e-seo.

Revisão da direção: manter apenas preto/verde e títulos com uma palavra colorida repetiria a LP anterior. A composição acrescenta amostras claras de trabalho e azul da marca; a carta continua sendo o elemento de destaque. Não estender esta revisão à área autenticada.

## Verificação da revisão

- Layout observado em 1440 px; medição em 1280, 1024, 820 e 390 px sem overflow horizontal. A tabela acompanha a largura útil do conteúdo.
- 18 pares de texto/fundo medidos por estilo computado: menor contraste 4,98:1. As superfícies holográficas decorativas das cartas não entram nessa medição.
- Quatro seleções de tarefa, frente/verso, pausa de movimento, controle de som e modal com comando e critérios conferidos no navegador.
- Caminho de desenvolvimento preenche o perfil da lista. Cadastro com consentimento confirmado usando endereço fictício de teste.
- Build e 14 testes existentes aprovados, incluindo banco, arquivos de exemplo e proteção das rotas. Nenhuma alteração na API de cadastro, autenticação ou nos pacotes da coleção.

## Movimento pela rolagem

A seção “Abra uma carta” fica entre os números do catálogo e a definição de skill. Uma carta se separa em instruções e resultado de referência à medida que a página desce. Perspectiva, rotação, opacidade e um traço luminoso acompanham o progresso; a sequência se recompõe ao subir. A cena é ilustrativa, com a mesma conferência de margem dos exemplos públicos.

- Cena fixa somente acima de 960 px de largura e a partir de 821 px de altura. Em notebook baixo, tablet e celular, permanece no fluxo normal da página.
- Abertura do leque no hero, chegada do exemplo em perspectiva, separação dos guias e deslocamento discreto da marca no formulário completam o movimento entre seções.
- Controle de pausa disponível durante a leitura; reaproveita o estado do botão existente. `prefers-reduced-motion` remove a sequência fixa e mantém a composição estática.
- Atualizações por `requestAnimationFrame` solicitadas por rolagem ou mudança de estado, sem loop permanente. Elementos fora da tela não são recalculados; a aba oculta interrompe as atualizações.
- CSS e JavaScript isolados em `landing-motion.css` e `landing-motion.js`, sem dependências novas. Sem JavaScript, textos e links permanecem disponíveis e os painéis de referência usam posições estáticas.
- Verificação visual em 1440×1000, 1280×700, 1024×821, 820×1100 e 390×844. Conferidos pausa/retomada, avanço e retorno das camadas, ausência de sobreposição com as legendas e navegação para exemplos e lista de espera. Sem erros de JavaScript observados. Preferência de redução inspecionada no código; não houve alteração da configuração do sistema operacional.

## Seletor de idioma

Três bandeiras vetoriais representam português brasileiro, inglês e espanhol, acompanhadas de PT/EN/ES e nomes acessíveis completos. A seleção tem contorno e sublinhado, além de mudança de cor. Uma inclinação leve no hover segue o tema das cartas; a preferência de redução de movimento remove essa transição. Contraste do texto do seletor acima de 11:1.

O cabeçalho se reorganiza em telas menores, mantendo as bandeiras visíveis na landing, no login e na coleção. Na privacidade, o seletor fica no início do conteúdo. A troca usa navegação normal, preserva página, âncora e seção da coleção; favoritos e histórico continuam associados aos IDs originais. Formulários em andamento são reiniciados ao trocar o idioma.

A tradução abrange microtextos, atributos acessíveis, mensagens de erro, exemplos, metadados das cartas e conteúdo gerado para copiar/baixar. Nomes próprios, caminhos técnicos, IDs e arquivos originais das skills não são reescritos. O guia localizado é oferecido separadamente do ZIP original. Layouts conferidos em 1440, 1280, 820, 390 e 375 px; recomendações e navegação testadas em inglês e espanhol, com retorno ao português.

## Universos da coleção

Cada carta ganha uma identidade editorial ligada ao trabalho: Cartógrafo de Métricas, Oficina de Entregas e outras 135 identidades próprias, traduzidas para inglês e espanhol. A ilustração mantém o símbolo da família, com marca geométrica exclusiva derivada do identificador, órbitas e variação discreta de matiz. A identidade nunca representa pontuação, escassez ou desempenho inventado.

O detalhe funciona como um caderno de campo: uma cena ilustrativa, o problema, aplicações concretas, uma missão copiável e um percurso de três passos. A narrativa tem tipografia maior e leitura espaçada; exemplos e limites ficam próximos da ação. O material técnico continua acessível em capítulo próprio. No celular, carta e controles ocupam uma composição compacta em duas colunas, antes do conteúdo.

Os filtros da triagem usam termos de trabalho, como organizar planilhas ou conectar sistemas. As recomendações explicam a entrega e os requisitos e abrem diretamente a missão. Seleções incompatíveis produzem estado vazio explicado. Não há percentual fictício de compatibilidade.

Validação desta entrega: 72 testes aprovados com banco configurado; universos completos e paridade PT/EN/ES conferidos para as 137 cartas. Fluxo integrado de triagem em espanhol, missão específica, troca de idioma no detalhe e composição móvel a 390 px conferidos no navegador, sem erros no console. Exemplos narrativos estão identificados como ilustrações, separados dos dez exemplos reproduzíveis.
