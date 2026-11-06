"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { findSkills } = require("../lib/match.cjs");
const { eligible, profiles, validateProfile } = require("../lib/triage-profile.cjs");
const skills = require("../data/skills.cjs");
const locales = ["pt", "en", "es"];
const commercial = new Set([
  "marketing-de-conteudo-b2b",
  "prospeccao-b2b-linkedin",
  "prospeccao-drivedata",
  "propostas-comerciais-e-estimativas",
]);

function describe(result) {
  return JSON.stringify({
    question: result.clarification?.id,
    matches: result.matches.map((m) => m.id),
    excluded: result.excludedTools,
  });
}

// Abstaining is preferable to claiming the wrong capability. When a concrete
// recommendation is made, the first card must actually address the stated task.
function firstIfPresent(result, allowed) {
  if (result.matches.length)
    assert.ok(allowed.includes(result.matches[0].id), describe(result));
}

function noCommercialRecommendation(result) {
  assert.notEqual(result.clarification?.id, "sales", describe(result));
  assert.ok(result.matches.every((m) => !commercial.has(m.id)), describe(result));
}

for (const [index, locale] of locales.entries()) {
  for (const [name, tasks] of [
    ["content-type", [
      "Preciso corrigir o cabeçalho content-type na resposta da minha API.",
      "Fix the content-type header in my API response.",
      "Necesito corregir el encabezado content-type en la respuesta de mi API.",
    ]],
    ["HTTP POST", [
      "Preciso depurar uma requisição POST que retorna HTTP 500.",
      "Debug a POST request returning HTTP 500.",
      "Necesito depurar una solicitud POST que devuelve HTTP 500.",
    ]],
  ]) {
    test(`${locale}: ${name} is a technical debugging task, not editorial content`, () => {
      const result = findSkills(tasks[index], "technical", null, locale);
      noCommercialRecommendation(result);
      assert.notEqual(result.clarification?.id, "legal", describe(result));
      firstIfPresent(result, [
        "debugging-and-error-recovery",
        "code-review-and-quality",
        "fullstack-nextjs-vercel",
        "security-and-hardening",
      ]);
    });
  }

  test(`${locale}: excluding Figma preserves the positive HTML prototype task after a conjunction`, () => {
    const tasks = [
      "Não quero usar Figma e preciso criar um protótipo HTML navegável.",
      "I do not want Figma and need a working HTML prototype.",
      "No quiero usar Figma y necesito un prototipo HTML navegable.",
    ];
    const result = findSkills(tasks[index], "technical", null, locale);
    assert.ok(result.excludedTools.includes("figma"), describe(result));
    assert.equal(result.clarification, null, describe(result));
    // This is a supported, explicit task; erasing it must not look like abstention.
    assert.equal(result.matches[0]?.id, "prototipos-e-especificacao-funcional", describe(result));
    for (const id of result.candidateIds)
      assert.ok(!profiles.get(id).tools.includes("figma"), id);
  });

  test(`${locale}: short Power BI exclusions are honored while Excel remains eligible`, () => {
    const tasks = [
      "Preciso calcular margens no Excel, sem Power BI.",
      "I need to calculate margins in Excel, not Power BI.",
      "Quiero calcular márgenes en Excel, no Power BI.",
    ];
    const result = findSkills(tasks[index], "business", null, locale);
    assert.ok(result.excludedTools.includes("powerbi"), describe(result));
    assert.ok(!result.excludedTools.includes("excel"), describe(result));
    assert.equal(result.matches[0]?.id, "claude-xlsx", describe(result));
    for (const id of result.candidateIds)
      assert.ok(!profiles.get(id).tools.includes("powerbi"), id);
  });

  test(`${locale}: short Excel exclusions do not become positive spreadsheet signals`, () => {
    const tasks = [
      "Preciso consolidar planilhas, sem Excel.",
      "I need to combine spreadsheets without Excel.",
      "Necesito combinar hojas de cálculo sin Excel.",
    ];
    const result = findSkills(tasks[index], "business", null, locale);
    assert.ok(result.excludedTools.includes("excel"), describe(result));
    for (const id of result.candidateIds)
      assert.ok(!profiles.get(id).tools.includes("excel"), id);
    for (const match of result.matches)
      assert.ok(!profiles.get(match.id).tools.includes("excel"), match.id);
  });

  test(`${locale}: scheduling in Google Calendar does not recommend transcription`, () => {
    const tasks = [
      "Preciso agendar uma reunião com clientes no Google Calendar.",
      "I need to schedule a meeting with customers in Google Calendar.",
      "Necesito programar una reunión con clientes en Google Calendar.",
    ];
    const result = findSkills(tasks[index], "business", null, locale);
    assert.ok(result.matches.every((m) => m.id !== "claude-acta-drivedata"), describe(result));
    noCommercialRecommendation(result);
    // The actual Google Workspace source covers Drive/Docs/Sheets/Slides, not
    // Calendar. No catalog skill may be presented as an available scheduler.
    assert.equal(result.matches.length, 0, describe(result));
  });

  test(`${locale}: a sales meeting agenda is meeting preparation, not a sales campaign`, () => {
    const tasks = [
      "Preciso montar a pauta para uma reunião de vendas.",
      "Need an agenda for a sales meeting.",
      "Necesito preparar la agenda para una reunión de ventas.",
    ];
    const result = findSkills(tasks[index], "business", null, locale);
    noCommercialRecommendation(result);
    assert.ok(result.matches.every((m) => m.id !== "claude-acta-drivedata"), describe(result));
    firstIfPresent(result, ["meeting-briefing"]);
  });

  test(`${locale}: website security review does not ask how to create a product`, () => {
    const tasks = [
      "Preciso revisar a segurança de um site existente.",
      "I need to review the security of a website.",
      "Necesito revisar la seguridad de un sitio web existente.",
    ];
    const result = findSkills(tasks[index], "technical", null, locale);
    assert.notEqual(result.clarification?.id, "product", describe(result));
    noCommercialRecommendation(result);
    firstIfPresent(result, ["security-audit", "security-and-hardening", "claude-security"]);
  });

  test(`${locale}: conflicting sales text cannot open a sales path under spreadsheet and Excel filters`, () => {
    const tasks = [
      "Preciso criar conteúdo para melhorar minhas vendas.",
      "I need to create content to improve my sales.",
      "Necesito crear contenido para mejorar mis ventas.",
    ];
    const profile = { goal: "spreadsheets", tool: "excel" };
    const result = findSkills(tasks[index], "business", null, locale, profile);
    assert.notEqual(result.clarification?.id, "sales", describe(result));
    if (result.clarification)
      assert.equal(result.clarification.id, "spreadsheets", describe(result));
    assert.ok(result.matches.every((m) => !commercial.has(m.id)), describe(result));
    for (const id of result.candidateIds)
      assert.ok(eligible(skills.find((s) => s.id === id), validateProfile(profile)), id);
  });

  test(`${locale}: a Next.js API does not become an MCP server project`, () => {
    const tasks = [
      "Preciso desenvolver uma API usando Next.js.",
      "I need to build an API using Next.js.",
      "Necesito desarrollar una API usando Next.js.",
    ];
    const result = findSkills(tasks[index], "technical", null, locale);
    assert.ok(result.matches.every((m) => ![
      "build-mcp-server", "build-mcp-app", "build-mcpb", "mcp-integration",
    ].includes(m.id)), describe(result));
    noCommercialRecommendation(result);
    firstIfPresent(result, ["fullstack-nextjs-vercel"]);
  });
}
