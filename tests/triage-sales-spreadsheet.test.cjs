"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { findSkills } = require("../lib/match.cjs");

const ids = (result) => result.matches.slice(0, 3).map((m) => m.id);

test("'vendas' como conteúdo de planilha não vira pergunta comercial", () => {
  for (const text of [
    "preciso conferir uma planilha de vendas que não fecha",
    "minha planilha de vendas tem números que não batem",
    "planilha de vendas com valores duplicados",
  ]) {
    const result = findSkills(text, "business");
    assert.equal(result.clarification, null, text);
    assert.ok(ids(result).includes("claude-xlsx"), `${text}: ${ids(result)}`);
  }
});

test("'vendas' em painel de Power BI vai para as cartas de Power BI", () => {
  const result = findSkills(
    "dashboard de vendas no Power BI está lento",
    "business",
  );
  assert.equal(result.clarification, null);
  assert.ok(
    ids(result).includes("power-bi-modelagem-dax-performance"),
    String(ids(result)),
  );
});

test("pedidos comerciais de verdade continuam perguntando o trabalho comercial", () => {
  assert.equal(
    findSkills("Preciso melhorar as vendas da empresa", "business")
      .clarification.id,
    "sales",
  );
  assert.ok(
    ids(findSkills("quero postar no LinkedIn sobre minha oferta", "business")).includes(
      "prospeccao-b2b-linkedin",
    ),
  );
});

test("em inglês e espanhol, planilha de vendas pergunta sobre planilhas, não sobre vendas", () => {
  for (const text of [
    "I need to check my sales spreadsheet that does not add up",
    "necesito revisar mi hoja de ventas que no cuadra",
  ]) {
    assert.equal(findSkills(text, "business").clarification.id, "spreadsheets", text);
  }
});
