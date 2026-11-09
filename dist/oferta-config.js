"use strict";
// Tudo que muda no lançamento fica aqui. Campo vazio esconde o bloco na página.
window.DeckOffer = {
  // Link direto do vídeo (MP4 ou WebM). Vazio enquanto a VSL não estiver gravada.
  videoSrc: "",
  // Imagem opcional. Vazia usa a thumbnail desenhada em HTML.
  poster: "",
  // Segundo do vídeo em que o botão de compra e o resto do conteúdo aparecem.
  revealAt: 720,
  // Chave do produto em lib/sale-catalog.cjs. O pagamento só abre se o produto estiver aprovado.
  checkoutKey: "deck-lancamento",
  priceUsd: 47,
  priceLabel: "US$ 47",
  currencyNote: "Preço em dólar. No Brasil, o valor em reais acompanha o dólar do dia, e você paga em reais.",
  deckTitle: "Deck de lançamento",
  cards: [
    { code: "DD-003", title: "Documentos e planilhas sem retrabalho" },
    { code: "DD-035", title: "Otimização da preparação de dados" },
    { code: "DD-033", title: "Indicadores e análise para decisões de negócio" },
    { code: "DD-111", title: "Indicadores confiáveis e Power BI mais eficiente" },
    { code: "DD-032", title: "Auditoria de qualidade e desempenho do Power BI" },
    { code: "DD-011", title: "Documentação do ambiente Power BI" },
  ],
  // Prazo configurado no produto da Hotmart. Venda para a Europa exige 15 dias ou mais.
  guaranteeDays: null,
  // Depoimentos reais e autorizados: { text: "...", author: "..." }.
  proofs: [],
  faq: [
    {
      q: "O que eu recebo?",
      a: "Acesso às cartas deste deck no site do DriveData Deck. Cada carta é um pacote de instruções para baixar e instalar no seu assistente de IA.",
    },
    {
      q: "Preciso de qual ferramenta?",
      a: "De um assistente que aceite skills, como Claude Code ou Codex. Em outros assistentes, o pacote serve como instruções de consulta, e a execução não foi validada.",
    },
    {
      q: "Como recebo o acesso?",
      a: "Depois da compra aprovada, você recebe no e-mail da compra um link para criar sua senha e abrir o Deck.",
    },
  ],
};
