"use strict";
// Rascunho do que é vendido. O vínculo com o produto da Hotmart fica em
// HOTMART_PRODUCT_MAP, no servidor. Preço único em USD; o checkout cobra.
module.exports = [
  {
    key: "deck-lancamento",
    title: "Deck de lançamento",
    status: "draft",
    role: "main",
    priceUsd: 47,
    skillIds: [
      "automacao-documentos-office",
      "claude-power-query-best-practices",
      "claude-power-bi-data-analysis",
      "power-bi-modelagem-dax-performance",
      "claude-power-bi-best-practices",
      "claude-bi-documentation",
    ],
  },
  {
    key: "deck-comercial",
    title: "Deck comercial",
    status: "draft",
    role: "order-bump",
    priceUsd: null,
    skillIds: [
      "marketing-de-conteudo-b2b",
      "prospeccao-b2b-linkedin",
      "propostas-comerciais-e-estimativas",
    ],
  },
];
