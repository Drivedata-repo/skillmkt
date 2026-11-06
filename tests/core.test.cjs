const { test } = require("node:test");
const assert = require("node:assert/strict");
const { context, lead } = require("../lib/validation.cjs");
const { fallback } = require("../lib/triage.cjs");
const skills = require("../dist/skills.js");
test("137 cards have unique permanent codes and no source paths", () => {
  assert.equal(skills.length, 137);
  assert.equal(new Set(skills.map((s) => s.code)).size, 137);
  assert.equal(new Set(skills.map((s) => s.id)).size, 137);
  assert.ok(!JSON.stringify(skills).match(/[CD]:\\|sourceManifest|AppData/));
});
const input = {
  audience: "business",
  pain: "Preciso consolidar planilhas no Power BI com indicadores confiáveis",
  systems: "Excel",
  area: "dados",
};
test("fallback recommends known business solutions", () => {
  const r = fallback(context.parse(input));
  assert.equal(r.mode, "catalog");
  assert.ok(r.recommendations.some((x) => x.solutionId === "bi"));
  assert.ok(!r.recommendations.some((x) => x.solutionId === "mcp"));
  assert.ok(r.recommendations.length <= 3);
});
test("unknown scenario returns no invented offers", () =>
  assert.equal(
    fallback({
      ...input,
      pain: "Preciso plantar flores na varanda",
      systems: "",
      area: "",
    }).recommendations.length,
    0,
  ));
test("lead requires consent and rejects unknown skills", () => {
  const valid = {
    requestId: require("crypto").randomUUID(),
    name: "Teste QA",
    email: "qa@example.invalid",
    company: "Teste",
    context: input,
    solutions: ["bi"],
    consent: true,
  };
  assert.ok(lead.safeParse(valid).success);
  assert.ok(!lead.safeParse({ ...valid, consent: false }).success);
  assert.ok(!lead.safeParse({ ...valid, skillIds: ["invented"] }).success);
  assert.ok(!lead.safeParse({ ...valid, website: "spam" }).success);
});
test("triage validates size and audience", () => {
  assert.ok(!context.safeParse({ ...input, pain: "x".repeat(2001) }).success);
  assert.ok(!context.safeParse({ ...input, audience: "admin" }).success);
});
