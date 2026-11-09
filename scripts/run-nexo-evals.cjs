"use strict";
// Avaliação do chat do NEXO. Uso:
//   node scripts/run-nexo-evals.cjs --mock            valida o executor e os casos, sem modelo e sem custo
//   GROQ_API_KEY=... node scripts/run-nexo-evals.cjs  roda no modelo real (custa poucos centavos)
//   opções: --only=<categoria>  --id=<caso>  --limit=<n>  --json
// O modo --mock NÃO avalia qualidade: o "modelo" é um dublê fixo. Serve só para provar que o
// executor, os casos e as verificações funcionam. A aprovação para ligar a flag exige rodada real.
const fs = require("node:fs");
const path = require("node:path");
const chat = require("../lib/nexo-chat.cjs");
const help = require("../data/nexo-help.cjs");
const suite = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/nexo-evals.json"), "utf8"));

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v === undefined ? true : v];
  }),
);
const mock = Boolean(args.mock);
if (!mock && !process.env.GROQ_API_KEY) {
  console.error("Defina GROQ_API_KEY para rodar no modelo real, ou use --mock.");
  process.exit(2);
}

// Dublê: devolve uma resposta plausível e válida, sem raciocinar. Só para o modo --mock.
async function mockGenerate({ prompt }) {
  const p = JSON.parse(prompt);
  const first = p.candidates[0];
  return {
    inScope: true,
    answer: "Resposta do dublê de teste.",
    cardIds: first ? [first.id] : [],
    topics: [],
    licenseClass: first ? first.licenseClass : "none",
  };
}

function accessFor(spec) {
  if (spec && spec.kind === "customer")
    return { kind: "customer", customerId: "eval", skillIds: new Set(spec.skillIds || []) };
  return { kind: "demo" };
}

function isRefusal(result, locale) {
  return result.inScope === false || result.answer === help.refusal[locale];
}

async function runCase(c) {
  const locale = c.locale || "pt";
  const started = Date.now();
  const out = { id: c.id, category: c.category, checks: [], ms: 0 };
  const note = (name, ok, detail) => out.checks.push({ name, ok: Boolean(ok), detail });
  try {
    const sensitive = chat.screen(c.message).sensitive;
    if (c.expect.outcome === "blocked") {
      note("barrado antes do modelo", sensitive);
      out.ms = Date.now() - started;
      return out;
    }
    note("não deveria ser barrado", !sensitive);
    const result = await chat.answer(
      { message: c.message, history: c.history, selectedId: c.selectedId || null, locale, access: accessFor(c.access) },
      mock ? { generate: mockGenerate } : {},
    );
    const text = [result.answer, result.licenseNote].filter(Boolean).join(" ");
    if (c.expect.outcome === "refusal") note("recusou fora do escopo", isRefusal(result, locale));
    else note("respondeu no escopo", result.inScope);
    const e = c.expect;
    if (e.cardIdsInclude) note("traz as cartas esperadas", e.cardIdsInclude.every((id) => result.cardIds.includes(id)), result.cardIds.join(","));
    if (e.cardIdsAnyOf) note("traz alguma carta esperada", e.cardIdsAnyOf.some((id) => result.cardIds.includes(id)), result.cardIds.join(","));
    if (e.cardIdsExclude) note("não traz cartas proibidas", !e.cardIdsExclude.some((id) => result.cardIds.includes(id)), result.cardIds.join(","));
    if (e.topicsInclude) note("cita os temas esperados", e.topicsInclude.every((t) => result.topics.includes(t)), result.topics.join(","));
    if (e.licenseClass) {
      const expected = help.licenseNotes[e.licenseClass][locale];
      note("nota de licença da classe certa", result.licenseNote === expected, result.licenseNote ? "nota presente" : "sem nota");
    }
    for (const re of e.mustMatch || []) note("deve conter /" + re + "/", new RegExp(re, "i").test(text));
    for (const re of e.mustNotMatch || []) note("não pode conter /" + re + "/", !new RegExp(re, "i").test(text));
    if (e.language === "en") note("responde em inglês", !/[ãõç]|\b(você|não|para)\b/i.test(result.answer || ""));
    if (e.language === "es") note("responde em espanhol", !/[ãõ]|\b(você|não|para)\b/i.test(result.answer || ""));
    note("sem links", !/https?:\/\/|www\./i.test(text));
  } catch (error) {
    note("sem erro de execução ou de schema", false, String(error.message || error).slice(0, 160));
  }
  out.ms = Date.now() - started;
  return out;
}

(async () => {
  let cases = suite.cases;
  if (args.only) cases = cases.filter((c) => c.category === args.only);
  if (args.id) cases = cases.filter((c) => c.id === args.id);
  if (args.limit) cases = cases.slice(0, Number(args.limit));
  const results = [];
  for (const c of cases) results.push(await runCase(c));
  const byCategory = {};
  for (const r of results) {
    const ok = r.checks.every((x) => x.ok);
    const k = (byCategory[r.category] ||= { total: 0, passed: 0 });
    k.total += 1;
    if (ok) k.passed += 1;
  }
  if (args.json) console.log(JSON.stringify({ mock, byCategory, results }, null, 2));
  else {
    console.log(mock ? "MODO --mock: valida o executor, não a qualidade do modelo.\n" : `Modelo: ${chat.model()}\n`);
    for (const r of results) {
      const ok = r.checks.every((x) => x.ok);
      console.log(`${ok ? "OK    " : "FALHA "} ${r.category.padEnd(8)} ${r.id}  (${r.ms} ms)`);
      if (!ok)
        for (const x of r.checks.filter((y) => !y.ok))
          console.log(`         - ${x.name}${x.detail ? " [" + x.detail + "]" : ""}`);
    }
    console.log("");
    for (const [k, v] of Object.entries(byCategory))
      console.log(`${k.padEnd(8)} ${v.passed}/${v.total}  (${Math.round((100 * v.passed) / v.total)}%)`);
  }
  let approved = true;
  for (const k of suite.criteria.mustPass) if (byCategory[k] && byCategory[k].passed !== byCategory[k].total) approved = false;
  for (const [k, min] of Object.entries(suite.criteria.minRate)) if (byCategory[k] && byCategory[k].passed / byCategory[k].total < min) approved = false;
  if (!args.json) console.log(`\nCritério para ligar a flag: ${approved ? "ATENDIDO" : "NÃO atendido"}${mock ? " (sem valor: foi o dublê)" : ""}`);
  process.exit(approved || mock ? 0 : 1);
})();
