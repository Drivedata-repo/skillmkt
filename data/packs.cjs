"use strict";
// Immutable 1.0.0 pack recipes. Source archives are pinned to reviewed edition 1.2.0.
const sourceReleases = {
  "claude-power-query-best-practices":
    "0601e3d06cfa19db7eb4bd0293c7bea26c7488b8eb4e421fe56c271763e22c1a",
  "claude-xlsx":
    "55c4e5e2db66da4dced132423ce65645eac18e7bb9efbe6d246963fcc8ece987",
  "automacao-documentos-office":
    "a7071953b83111f30052237ffb7e533bc6b39b03fe694a7821a42583439129ed",
  "power-bi-modelagem-dax-performance":
    "fb69ef1ba64619c9baa7da68f0d62cbe7ea47a1ab81c9beaf3f4766db0a9277e",
  "claude-power-bi-best-practices":
    "e4a3253e167e3e522327a17d3d57f113a8e551339542df58c7839f79df4f1076",
  "claude-bi-documentation":
    "d6c8690a1088e39443bd4eb2d3a5c2522b624ef7e0ea90fff83dacc5fe05984c",
};
const packs = [
  {
    id: "planilhas-confiaveis",
    copyKey: "sheets",
    version: "1.0.0",
    skillVersion: "1.2.0",
    kind: "orders",
    steps: [
      { id: "organize", skillId: "claude-power-query-best-practices" },
      { id: "calculate", skillId: "claude-xlsx" },
      { id: "document", skillId: "automacao-documentos-office" },
    ],
    reference: {
      inputRows: 6,
      uniqueRows: 5,
      duplicatesRemoved: 1,
      total: 330,
      orders: { "P-001": 160, "P-002": 80, "P-003": 40, "P-004": 50 },
    },
    checks: [
      { id: "uniqueRows", expected: 5 },
      { id: "duplicatesRemoved", expected: 1 },
      { id: "total", expected: 330 },
    ],
  },
  {
    id: "power-bi-sob-controle",
    copyKey: "powerbi",
    version: "1.0.0",
    skillVersion: "1.2.0",
    kind: "sales",
    steps: [
      { id: "prepare", skillId: "claude-power-query-best-practices" },
      { id: "model", skillId: "power-bi-modelagem-dax-performance" },
      { id: "audit", skillId: "claude-power-bi-best-practices" },
      { id: "document", skillId: "claude-bi-documentation" },
    ],
    reference: {
      salesCount: 4,
      Sales: 500,
      Cost: 310,
      Margin: 190,
      MarginPct: 0.38,
      months: {
        "2026-01": { Sales: 300, Cost: 180, Margin: 120, MarginPct: 0.4 },
        "2026-02": { Sales: 200, Cost: 130, Margin: 70, MarginPct: 0.35 },
      },
      categories: {
        A: { Sales: 250, Cost: 150, Margin: 100, MarginPct: 0.4 },
        B: { Sales: 250, Cost: 160, Margin: 90, MarginPct: 0.36 },
      },
    },
    checks: [
      { id: "salesCount", expected: 4 },
      { id: "Sales", expected: 500 },
      { id: "Cost", expected: 310 },
      { id: "Margin", expected: 190 },
      { id: "MarginPct", expected: 0.38 },
    ],
  },
];
module.exports = { packs, sourceReleases };
