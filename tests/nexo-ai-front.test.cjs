"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../dist/nexo-core.js");
const help = require("../data/nexo-help.cjs");
const dictionary = {
  ...require("../lib/locale.cjs").messages,
  ...require("../data/i18n-market.cjs"),
  ...require("../data/i18n-public.cjs"),
};
const read = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8");

test("com IA ligada, privacidade e 'quem é você' deixam de afirmar que não há modelo externo", () => {
  const off = { skills: [], mode: "demo" };
  const on = { skills: [], mode: "demo", ai: true };
  assert.equal(core.resolve("o NEXO guarda minha conversa? privacidade", off).topic, "privacy");
  assert.equal(core.resolve("o NEXO guarda minha conversa? privacidade", on).topic, "privacyAI");
  assert.equal(core.resolve("quem é você?", off).topic, "about");
  assert.equal(core.resolve("quem é você?", on).topic, "aboutAI");
  assert.match(core.guides.privacy[0] + core.guides.about[0], /não envia a conversa a um modelo externo|não é uma conversa generativa|Esta versão não envia/);
  assert.doesNotMatch(core.guides.privacyAI[0] + core.guides.aboutAI[0], /não envia a conversa a um modelo externo/);
});

test("pergunta que cita uma carta vai ao chat; só o código continua mostrando o cartão", () => {
  const skills = require("../lib/catalog.cjs").skills;
  const ctx = { skills, audience: "business", mode: "demo", ai: true };
  for (const text of [
    "a DD-042 pode ser usada no meu cliente?",
    "posso revender a DD-042",
    "DD-042 tem licença MIT?",
    "is DD-042 free?",
  ]) {
    const response = core.resolve(text, ctx);
    assert.equal(response.type, "cards", text);
    assert.equal(core.wantsAI(text, response), true, text);
  }
  for (const text of ["DD-042", "Me explique a DD-042"]) {
    const response = core.resolve(text, ctx);
    assert.equal(core.wantsAI(text, response), false, text);
  }
  assert.equal(core.wantsAI("quero instalar?", { type: "guide" }), false);
});

test("o texto de privacidade do navegador é o mesmo da base de ajuda do servidor", () => {
  assert.equal(core.guides.privacyAI[0], help.topics.privacy.pt);
});

test("tudo que a IA acrescenta ao painel está traduzido para EN e ES", () => {
  const strings = [
    ...core.guides.privacyAI,
    ...core.guides.aboutAI,
    "O NEXO envia suas mensagens a um provedor de IA, nos Estados Unidos, para responder. Não guardamos a conversa. Não escreva senhas, dados de pagamento ou dados de clientes.",
    "Sobre a licença",
    "Resposta gerada por IA a partir do catálogo e da ajuda do Deck. Confira a licença no pacote.",
    "Você atingiu o limite de mensagens com IA por agora. O guia do catálogo continua disponível.",
    "Chegamos ao limite de respostas com IA desta conversa. Comece uma nova conversa para continuar; o guia do catálogo continua disponível.",
  ];
  for (const s of strings) {
    const tr = dictionary[s];
    assert.ok(Array.isArray(tr) && tr[0] && tr[1], s.slice(0, 60));
    assert.notEqual(tr[0], s);
    assert.notEqual(tr[1], s);
  }
});

test("o texto de privacidade traduzido bate com a base de ajuda nos três idiomas", () => {
  const [en, es] = dictionary[help.topics.privacy.pt];
  assert.equal(en, help.topics.privacy.en);
  assert.equal(es, help.topics.privacy.es);
});

test("o painel tem os dois rodapés e o aviso de IA começa escondido", () => {
  const html = read("views/market.html");
  assert.match(html, /<p id="nexo-footnote">/);
  assert.match(html, /<p id="nexo-ai-footnote" hidden>/);
});

test("a rota /api/nexo existe no rewrite e a pasta api/ continua com 12 funções", () => {
  const vercel = JSON.parse(read("vercel.json"));
  assert.ok(
    vercel.rewrites.some((r) => r.source === "/api/nexo" && r.destination === "/api/triage?route=chat"),
  );
  const functions = fs.readdirSync(path.join(__dirname, "..", "api")).filter((f) => f.endsWith(".js"));
  assert.ok(functions.length <= 12, `api/ tem ${functions.length} funções`);
});

test("o catálogo só diz nexoAI:true quando o chat está ligado para a sessão", () => {
  const chat = require("../lib/nexo-chat.cjs");
  assert.equal(chat.enabled({ kind: "customer", skillIds: new Set() }, {}), false);
  assert.equal(chat.enabled({ kind: "customer", skillIds: new Set() }, { NEXO_AI: "on", GROQ_API_KEY: "k" }), true);
});
