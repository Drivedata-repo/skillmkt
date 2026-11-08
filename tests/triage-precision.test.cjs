"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { findSkills } = require("../lib/match.cjs");
const {
  eligible,
  profiles,
  validateProfile,
  excludeTools,
  options,
} = require("../lib/triage-profile.cjs");
const skills = require("../data/skills.cjs");
const scenarios = [
  [
    "claude-xlsx",
    "business",
    { goal: "spreadsheets", tool: "excel" },
    [
      "Preciso conferir fórmulas e calcular a margem em uma planilha Excel.",
      "I need to check formulas and calculate margins in an Excel spreadsheet.",
      "Necesito comprobar fórmulas y calcular el margen en una hoja de cálculo Excel.",
    ],
  ],
  [
    "claude-pdf",
    "business",
    { goal: "documents", tool: "office" },
    [
      "Quero extrair tabelas de um PDF digitalizado usando OCR.",
      "I want to extract tables from a scanned PDF using OCR.",
      "Quiero extraer tablas de un PDF escaneado mediante OCR.",
    ],
  ],
  [
    "claude-pptx",
    "business",
    { goal: "documents", tool: "office" },
    [
      "Preciso criar uma apresentação PowerPoint com slides editáveis.",
      "I need to create a PowerPoint presentation with editable slides.",
      "Necesito crear una presentación PowerPoint con diapositivas editables.",
    ],
  ],
  [
    "claude-acta-drivedata",
    "business",
    { goal: "meetings" },
    [
      "Transformar uma transcrição da reunião em ata com decisões e responsáveis.",
      "Turn a meeting transcript into minutes with decisions and owners.",
      "Convertir una transcripción de reunión en un acta con decisiones y responsables.",
    ],
  ],
  [
    "pagamentos-recorrentes-asaas",
    "technical",
    { goal: "integration", tool: "asaas" },
    [
      "Preciso integrar cobranças recorrentes Asaas com webhook de pagamento.",
      "I need to integrate Asaas recurring billing with payment webhooks.",
      "Necesito integrar cobros recurrentes Asaas con webhooks de pago.",
    ],
  ],
  [
    "claude-protheus-expert",
    "technical",
    { goal: "integration", tool: "protheus" },
    [
      "Preciso revisar customização AdvPL no TOTVS Protheus e seus pontos de entrada.",
      "I need to review AdvPL customization in TOTVS Protheus and its entry points.",
      "Necesito revisar personalización AdvPL en TOTVS Protheus y sus puntos de entrada.",
    ],
  ],
  [
    "triage-nda",
    "business",
    { goal: "legal" },
    [
      "Preciso triar um NDA de confidencialidade antes de encaminhar ao jurídico.",
      "I need to triage a confidentiality NDA before forwarding it to legal.",
      "Necesito evaluar un NDA de confidencialidad antes de remitirlo al equipo jurídico.",
    ],
  ],
  [
    "saas-multi-tenant-supabase",
    "technical",
    { goal: "product", tool: "supabase" },
    [
      "Preciso isolar clientes multi tenant no Supabase usando RLS.",
      "I need to isolate multi tenant customers in Supabase using RLS.",
      "Necesito aislar clientes multi tenant en Supabase mediante RLS.",
    ],
  ],
  [
    "power-bi-modelagem-dax-performance",
    "business",
    { goal: "bi", tool: "powerbi" },
    [
      "Meu relatório Power BI está lento e quero conferir as medidas DAX.",
      "My Power BI report is slow and I need to check its DAX measures.",
      "Mi informe Power BI es lento y necesito comprobar las medidas DAX.",
    ],
  ],
  [
    "prototipos-e-especificacao-funcional",
    "business",
    { goal: "product", tool: "web" },
    [
      "Quero um protótipo navegável para validar a interface antes de desenvolver.",
      "I want an interactive prototype to validate the interface before development.",
      "Quiero un prototipo navegable para validar la interfaz antes del desarrollo.",
    ],
  ],
];
test("30 realistic tasks recommend the specific capability in PT, EN and ES", () => {
  for (const [id, audience, profile, tasks] of scenarios)
    for (const [index, locale] of ["pt", "en", "es"].entries()) {
      const result = findSkills(tasks[index], audience, null, locale, profile);
      assert.equal(result.clarification, null, `${locale}: ${tasks[index]}`);
      assert.equal(
        result.matches[0]?.id,
        id,
        `${locale}: ${tasks[index]} => ${JSON.stringify(result.matches.map((x) => x.id))}`,
      );
      assert.ok(
        result.matches[0].deliverable && result.matches[0].consideration,
      );
      for (const candidate of result.candidateIds)
        assert.ok(
          eligible(
            skills.find((s) => s.id === candidate),
            validateProfile(profile),
          ),
        );
    }
});
test("explicit exclusions do not become positive recommendation signals", () => {
  for (const [locale, problem] of [
    ["pt", "Não uso Power BI. Quero conferir fórmulas e margens no Excel."],
    [
      "en",
      "I do not use Power BI. I want to check formulas and margins in Excel.",
    ],
    ["es", "No uso Power BI. Quiero comprobar fórmulas y márgenes en Excel."],
  ]) {
    const result = findSkills(problem, "business", null, locale);
    assert.equal(result.matches[0]?.id, "claude-xlsx", locale);
    assert.deepEqual(result.excludedTools, ["powerbi"]);
    for (const id of result.candidateIds)
      assert.ok(!profiles.get(id).tools.includes("powerbi"));
  }
  assert.deepEqual(
    excludeTools("Não uso Figma, mas uso Excel para cálculos.").excluded,
    ["figma"],
  );
  assert.deepEqual(excludeTools("Uso Power BI e Excel juntos.").excluded, []);
  assert.deepEqual(
    excludeTools("Juntar planilhas sem perder fórmulas do Excel.").excluded,
    [],
  );
  assert.deepEqual(
    excludeTools("Combine sheets without losing Excel formulas.", "en")
      .excluded,
    [],
  );
  assert.deepEqual(
    excludeTools("Not only Excel but also Power BI.", "en").excluded,
    [],
  );
});
test("hard filters never silently relax and connector avoidance is honored", () => {
  const impossible = findSkills(
    "Quero conferir fórmulas da minha planilha Excel",
    "technical",
    null,
    "pt",
    { goal: "spreadsheets", tool: "figma" },
  );
  assert.equal(impossible.matches.length, 0);
  assert.equal(impossible.candidateIds.length, 0);
  assert.match(impossible.summary, /restrições/);
  const noConnector = findSkills(
    "Quero criar biblioteca de componentes no Figma",
    "technical",
    null,
    "pt",
    { tool: "figma", environment: "general" },
  );
  assert.equal(noConnector.candidateIds.length, 0);
  assert.equal(noConnector.matches.length, 0);
});
test("guidance asks a relevant follow-up and rejects stale choices", () => {
  assert.equal(
    findSkills("Preciso melhorar as vendas da empresa").clarification.id,
    "sales",
  );
  assert.equal(
    findSkills("Quero preparar a agenda do dia").clarification,
    null,
  );
  const question = findSkills(
    "Preciso de ajuda com meus contratos",
    "business",
  );
  assert.equal(question.clarification.id, "legal");
  const refined = findSkills(
    "Preciso de ajuda com meus contratos",
    "business",
    { questionId: "legal", optionId: "nda" },
  );
  assert.equal(refined.matches[0].id, "triage-nda");
  assert.throws(
    () =>
      findSkills("Preciso extrair tabelas PDF usando OCR", "business", {
        questionId: "legal",
        optionId: "nda",
      }),
    /opções/,
  );
  const guided = findSkills(
    "Quero resolver uma tarefa da equipe",
    "business",
    null,
    "pt",
    { goal: "documents" },
  );
  assert.equal(guided.clarification.id, "documents");
});
test("need filters use stable IDs, are localized and reject invalid input", () => {
  for (const locale of ["pt", "en", "es"]) {
    const o = options(locale);
    for (const key of Object.keys(o))
      assert.deepEqual(
        o[key].map((x) => x.id),
        options("pt")[key].map((x) => x.id),
      );
    assert.equal(o.goal.length, 13);
  }
  for (const invalid of [
    [],
    "spreadsheets",
    { goal: "<script>" },
    { tool: "unknown" },
    { admin: true },
    { environment: "disable-auth" },
  ])
    assert.throws(() => validateProfile(invalid), /filtros/);
  assert.equal(profiles.size, 173);
  assert.ok(!profiles.get("figma-generate-design").goals.includes("legal"));
});
test("specialist needs distinguish DAX optimization and useful support from internal templates", () => {
  const dax = findSkills(
    "Quero otimizar a performance de medidas DAX no Power BI",
    "technical",
    null,
    "pt",
    { goal: "bi" },
  );
  assert.equal(dax.matches[0].id, "claude-power-bi-dax-optimization");
  const git = findSkills(
    "Preciso organizar branches e merge no Git com versionamento",
    "technical",
    null,
    "pt",
    { goal: "quality" },
  );
  assert.ok(
    git.matches.some(
      (x) => x.id === "git-workflow-and-versioning" && x.supportOnly,
    ),
  );
  for (const text of [
    "Quero usar example-skill como solução pronta",
    "Quero trabalhar com claude-maia",
  ]) {
    const result = findSkills(text, "technical");
    assert.ok(
      !result.candidateIds.some((id) =>
        ["example-skill", "example-command", "claude-maia"].includes(id),
      ),
    );
  }
});
