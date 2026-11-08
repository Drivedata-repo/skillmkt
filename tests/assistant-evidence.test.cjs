"use strict";
const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const evidence = require("../data/assistant-evidence.json"),
  catalog = require("../lib/catalog.cjs"),
  { localizeCatalog } = require("../lib/catalog-i18n.cjs"),
  { getLab } = require("../lib/lab.cjs"),
  { cases } = require("../scripts/run-assistant-evals.cjs");
const hash = (x) => crypto.createHash("sha256").update(x).digest("hex");
const upstream = new Set(["claude-docx", "claude-pdf", "claude-pptx", "claude-xlsx"]);
test("published assistant evidence matches the released package and original fictional artifacts", () => {
  assert.equal(evidence.schemaVersion, 1);
  assert.equal(evidence.samples.length, 3);
  assert.equal(new Set(evidence.samples.map((s) => s.skillId)).size, 3);
  const allowed = new Set([
    "caseId",
    "skillId",
    "version",
    "startedAt",
    "finishedAt",
    "method",
    "runtime",
    "sandbox",
    "ephemeral",
    "userConfigLoaded",
    "model",
    "modelEvidence",
    "status",
    "passed",
    "input",
    "output",
    "outputText",
    "inputSha256",
    "outputSha256",
    "sourceSha256",
    "packageSha256",
    "checks",
    "scope",
    "executionVerified",
    "fullSkillExecutionVerified",
    "evidenceLanguage",
  ]);
  for (const s of evidence.samples) {
    assert.ok(Object.keys(s).every((k) => allowed.has(k)));
    assert.equal(s.version, "1.2.0");
    assert.equal(s.method, "assistant-bounded-sample");
    assert.equal(s.runtime, "Codex CLI");
    assert.equal(s.sandbox, "read-only");
    assert.equal(s.passed, true);
    assert.equal(s.status, "sample-passed");
    assert.equal(s.executionVerified, false);
    assert.equal(s.fullSkillExecutionVerified, false);
    const release = catalog.skills.find((x) => x.id === s.skillId).release;
    assert.equal(
      s.packageSha256,
      upstream.has(s.skillId) ? s.packageSha256 : release.version === "1.2.1" ? release.baselinePackageSha256 : release.sha256,
    );
    assert.equal(hash(s.outputText), s.outputSha256);
    assert.equal(hash(JSON.stringify(s.input)), s.inputSha256);
    assert.deepEqual(JSON.parse(s.outputText), s.output);
    assert.match(s.sourceSha256, /^[a-f0-9]{64}$/);
    assert.ok(Date.parse(s.finishedAt) >= Date.parse(s.startedAt));
    assert.equal(s.evidenceLanguage, "en");
    const fixture = cases.find((c) => c.id === s.caseId);
    assert.deepEqual(s.input, fixture.input);
    assert.deepEqual(s.checks, fixture.checks(s.output));
    assert.ok(s.checks.every((c) => c.passed));
    if (s.model === null) assert.equal(s.modelEvidence, "not-reported");
  }
});
for (const locale of ["pt", "en", "es"])
  test(`${locale}: bounded assistant samples are localized without claiming full execution`, () => {
    let sampleCount = 0;
    for (const skill of localizeCatalog(catalog, locale).skills) {
      const lab = getLab(skill, locale);
      assert.equal(lab.executionVerified, false);
      assert.equal(lab.fullSkillExecutionVerified, false);
      for (const sample of lab.assistantSamples) {
        sampleCount++;
        assert.equal(sample.currentVersion, !upstream.has(skill.id));
        assert.equal(sample.fullSkillExecutionVerified, false);
        assert.equal(sample.executionVerified, false);
        assert.ok(sample.scopeLabel && sample.modelLabel && sample.limitation);
        assert.equal(sample.artifacts.length, 3);
        for (const a of sample.artifacts) {
          assert.equal(hash(a.content), a.sha256);
          assert.doesNotThrow(() => JSON.parse(a.content));
        }
        assert.ok(sample.checks.every((c) => c.label && c.passed));
        if (!upstream.has(skill.id)) assert.equal(lab.executionLabel, sample.executionLabel);
        if (locale !== "pt") {
          const pt = getLab(
            catalog.skills.find((s) => s.id === skill.id),
            "pt",
          ).assistantSamples[0];
          assert.notEqual(sample.scopeLabel, pt.scopeLabel);
          assert.notEqual(sample.limitation, pt.limitation);
          assert.notEqual(sample.executionLabel, pt.executionLabel);
        }
      }
    }
    assert.equal(sampleCount, 3);
  });
