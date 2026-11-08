"use strict";
const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const { findSkills } = require("../lib/match.cjs");
const { validateProfile } = require("../lib/triage-profile.cjs");
const {
  assessCompatibility,
  capabilityOptions,
  validateContext,
} = require("../lib/compatibility.cjs");
const { getLab, verifyReference } = require("../lib/lab.cjs");
const catalog = require("../lib/catalog.cjs");
const { localizeCatalog } = require("../lib/catalog-i18n.cjs");
const examples = require("../data/examples.cjs");
const questions = [
  "Preciso de ajuda com um relatório",
  "I need help with a report",
  "Necesito ayuda con un informe",
];
for (const [i, locale] of ["pt", "en", "es"].entries()) {
  test(`${locale}: report context is resolved in at most two validated questions`, () => {
    const first = findSkills(questions[i], "business", null, locale);
    assert.equal(first.clarification.id, "report_scope");
    assert.equal(first.clarification.step, 1);
    for (const [scope, followup, option, id] of [
      ["collect", "report_source", "pdf", "claude-pdf"],
      ["calculate", "report_calculation", "excel", "claude-xlsx"],
      ["present", "report_presentation", "slides", "claude-pptx"],
    ]) {
      const answers = [{ questionId: "report_scope", optionId: scope }];
      const second = findSkills(questions[i], "business", answers, locale);
      assert.equal(second.clarification.id, followup);
      assert.equal(second.clarification.step, 2);
      const done = findSkills(
        questions[i],
        "business",
        [...answers, { questionId: followup, optionId: option }],
        locale,
      );
      assert.equal(done.clarification, null);
      assert.equal(done.matches[0].id, id);
      assert.equal(done.progress.maxSteps, 2);
    }
    if (locale !== "pt")
      assert.notEqual(
        first.clarification.question,
        findSkills(questions[0]).clarification.question,
      );
  });
  test(`${locale}: compound PDF calculation and presentation gets an ordered eligible plan`, () => {
    const text = [
      "Extrair tabelas PDF, calcular margens em planilhas e criar slides PowerPoint",
      "Extract PDF tables, calculate margins in spreadsheets and create PowerPoint slides",
      "Extraer tablas PDF, calcular márgenes en hojas de cálculo y crear diapositivas PowerPoint",
    ][i];
    const result = findSkills(text, "business", null, locale, {
      runtime: "codex",
    });
    assert.deepEqual(
      result.plan.steps.map((x) => x.skillId),
      ["claude-pdf", "claude-xlsx", "claude-pptx"],
    );
    assert.deepEqual(
      result.plan.steps.map((x) => x.order),
      [1, 2, 3],
    );
    for (const step of result.plan.steps) {
      assert.ok(step.input && step.output && step.rationale);
      assert.equal(step.compatibility.executionVerified, false);
      assert.equal(step.compatibility.blocking, false);
    }
    assert.equal(
      findSkills(text, "business", null, locale, { tool: "excel" }).plan,
      null,
    );
    assert.equal(
      findSkills(text, "business", null, locale, {
        availability: { pdf: "unavailable" },
      }).plan,
      null,
    );
  });
  test(`${locale}: compatibility and lab metadata cover every skill without inventing AI runs`, () => {
    const localized = localizeCatalog(catalog, locale),
      references = [];
    assert.equal(localized.skills.length, 169);
    for (const skill of localized.skills) {
      const c = assessCompatibility(skill, { runtime: "codex" }, locale);
      assert.equal(c.executionVerified, false);
      assert.equal(c.installationVerified, false);
      assert.ok(c.label && c.summary);
      assert.deepEqual(c.sourceRequirements, skill.dependencies);
      const lab = getLab(skill, locale);
      assert.equal(lab.executionVerified, false);
      assert.equal(lab.executionStatus, lab.assistantSamples.some(s=>s.currentVersion)||lab.deliverableSamples.length ? "limited-sample-verified" : "not-run");
      assert.ok(
        lab.scenario.request && lab.scenario.check && lab.prerequisites.length,
      );
      if (lab.reference) {
        references.push(lab.reference);
        assert.equal(lab.reference.passed, true);
        assert.equal(lab.reference.model, null);
        assert.equal(lab.reference.executionVerified, false);
        for (const artifact of lab.reference.artifacts) {
          assert.equal(
            crypto.createHash("sha256").update(artifact.content).digest("hex"),
            artifact.sha256,
          );
          assert.doesNotThrow(() => JSON.parse(artifact.content));
        }
      } else assert.equal(lab.status, "scenario-ready");
    }
    assert.equal(references.length, 10);
    assert.deepEqual(
      capabilityOptions(locale).map((x) => x.id),
      capabilityOptions("pt").map((x) => x.id),
    );
  });
}
test("context rejects forged, excess and stale answers without accepting arbitrary options", () => {
  for (const answers of [
    [{ questionId: "report_scope", optionId: "admin" }],
    [{ questionId: "report_presentation", optionId: "slides" }],
    [
      { questionId: "report_scope", optionId: "present" },
      { questionId: "report_source", optionId: "pdf" },
    ],
    Array(3).fill({ questionId: "report_scope", optionId: "present" }),
  ])
    assert.throws(
      () => findSkills(questions[0], "business", answers),
      (e) => e.status === 400,
    );
  assert.throws(
    () =>
      findSkills("Preciso extrair tabelas PDF", "business", [
        { questionId: "report_scope", optionId: "collect" },
      ]),
    (e) => e.status === 400,
  );
  assert.throws(
    () => validateProfile({ runtime: "fake" }),
    (e) => e.status === 400,
  );
  assert.throws(
    () => validateProfile({ availability: { figma: "installed" } }),
    (e) => e.status === 400,
  );
  assert.throws(
    () => validateContext("codex", { secret: "available" }),
    (e) => e.status === 400,
  );
});
test("an explicit report stage skips the redundant scope question", () => {
  for (const [locale, text] of [
    ["pt", "Preciso calcular os números do relatório"],
    ["en", "I need to calculate the numbers in a report"],
    ["es", "Necesito calcular los números del informe"],
  ]) {
    const question = findSkills(text, "business", null, locale);
    assert.equal(question.clarification.id, "report_calculation");
    assert.equal(question.progress.maxSteps, 1);
    const done = findSkills(
      text,
      "business",
      [{ questionId: "report_calculation", optionId: "excel" }],
      locale,
    );
    assert.equal(done.matches[0].id, "claude-xlsx");
    assert.equal(done.clarification, null);
  }
});
test("declared prerequisites constrain recommendations without treating unknown tools as unavailable", () => {
  const figma = catalog.skills.find((s) => s.id === "figma-generate-design");
  assert.equal(
    assessCompatibility(figma, { runtime: "codex" }).blocking,
    false,
  );
  assert.equal(
    assessCompatibility(figma, {
      runtime: "codex",
      availability: { figma: "unavailable" },
    }).blocking,
    true,
  );
  const channel = catalog.skills.find((s) => s.id === "telegram-configure");
  assert.equal(
    assessCompatibility(channel, { runtime: "codex" }).blocking,
    true,
  );
  assert.equal(
    assessCompatibility(channel, { runtime: "claude" }).blocking,
    false,
  );
  assert.equal(
    assessCompatibility(channel, {
      runtime: "claude",
      availability: { channels: "available", claude_plugin: "available" },
    }).executionVerified,
    false,
  );
  const result = findSkills(
    "Quero gerar telas de interface no Figma",
    "technical",
    null,
    "pt",
    { availability: { figma: "unavailable" } },
  );
  assert.ok(
    !result.candidateIds.some(
      (id) =>
        assessCompatibility(
          catalog.skills.find((s) => s.id === id),
          { availability: { figma: "unavailable" } },
        ).blocking,
    ),
  );
});
test("singular goals stay singular and explicitly excluded output stages are not added", () => {
  assert.equal(findSkills("Preciso extrair tabelas PDF usando OCR").plan, null);
  const r = findSkills(
    "Preciso extrair tabelas PDF e calcular margens no Excel, sem slides",
  );
  assert.deepEqual(
    r.plan.steps.map((x) => x.skillId),
    ["claude-pdf", "claude-xlsx"],
  );
});
test("reference checks detect changed fixture facts rather than blessing any successful function call", () => {
  const original = examples.find((x) => x.kind === "margin");
  const changed = structuredClone(original);
  changed.input.rows[0].revenue += 100;
  assert.equal(verifyReference(original).passed, true);
  assert.equal(verifyReference(changed).passed, false);
});
test("catalog runtime context stays authenticated, validated and localized", async () => {
  const auth = require("../lib/auth.cjs"),
    handler = require("../api/catalog.js");
  const previousHash = process.env.DEMO_PASSWORD_HASH,
    previousSecret = process.env.DEMO_SESSION_SECRET;
  try {
    process.env.DEMO_PASSWORD_HASH =
      crypto.randomBytes(16).toString("hex") +
      ":" +
      crypto.randomBytes(64).toString("hex");
    process.env.DEMO_SESSION_SECRET = crypto.randomBytes(32).toString("hex");
    const cookie = auth.cookie(auth.issue()).split(";")[0];
    function response() {
      return {
        headers: {},
        writeHead(code, headers) {
          this.status = code;
          Object.assign(this.headers, headers);
        },
        setHeader(k, v) {
          this.headers[k] = v;
        },
        end(data) {
          this.data = JSON.parse(data);
        },
      };
    }
    const noAuth = response();
    await handler(
      { method: "GET", url: "/api/catalog?lang=en&runtime=codex", headers: {} },
      noAuth,
    );
    assert.equal(noAuth.status, 401);
    assert.deepEqual(Object.keys(noAuth.data), ["error"]);
    const invalid = response();
    await handler(
      {
        method: "GET",
        url: "/api/catalog?lang=es&runtime=administrator",
        headers: { cookie },
      },
      invalid,
    );
    assert.equal(invalid.status, 400);
    assert.match(invalid.data.error, /Elige filtros/);
    const good = response();
    await handler(
      {
        method: "GET",
        url:
          "/api/catalog?lang=es&runtime=codex&availability=" +
          encodeURIComponent(JSON.stringify({ figma: "unavailable" })),
        headers: { cookie },
      },
      good,
    );
    assert.equal(good.status, 200);
    assert.equal(good.data.skills.length, 169);
    assert.equal(good.data.compatibilityContext.runtime, "codex");
    assert.equal(
      good.data.skills.find((s) => s.id === "figma-generate-design")
        .compatibilityAssessment.blocking,
      true,
    );
    assert.equal(good.data.skills.filter((s) => s.lab.reference).length, 10);
  } finally {
    if (previousHash === undefined) delete process.env.DEMO_PASSWORD_HASH;
    else process.env.DEMO_PASSWORD_HASH = previousHash;
    if (previousSecret === undefined) delete process.env.DEMO_SESSION_SECRET;
    else process.env.DEMO_SESSION_SECRET = previousSecret;
  }
});
