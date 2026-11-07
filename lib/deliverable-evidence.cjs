"use strict";
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const evidence = require("../data/deliverable-evidence.json");
const hash = (data) => crypto.createHash("sha256").update(data).digest("hex");
const common = {
  pt: {
    blocked: "Execução bloqueada pelo ambiente",
    "not-run": "Cenário preparado; não executado",
    passed: "Cenário com entregável conferido",
    model: "Modelo não informado",
    boundary:
      "Este cenário limitado não homologa a execução integral da skill.",
    blockedReason:
      "O terminal do assistente recusou operações por política. Nenhum entregável foi produzido.",
    waiting:
      "Execução pendente em um ambiente que permita criar arquivos. O cenário não conta como execução por IA.",
  },
  en: {
    blocked: "Execution blocked by the environment",
    "not-run": "Scenario prepared; not executed",
    passed: "Scenario with a verified deliverable",
    model: "Model not reported",
    boundary:
      "This limited scenario does not certify full execution of the skill.",
    blockedReason:
      "The assistant terminal rejected operations under its execution policy. No deliverable was produced.",
    waiting:
      "Execution is pending in an environment that permits file creation. This scenario does not count as an AI execution.",
  },
  es: {
    blocked: "Ejecución bloqueada por el entorno",
    "not-run": "Escenario preparado; no ejecutado",
    passed: "Escenario con entregable verificado",
    model: "Modelo no informado",
    boundary:
      "Este escenario limitado no homologa la ejecución integral de la skill.",
    blockedReason:
      "El terminal del asistente rechazó operaciones por su política de ejecución. No se produjo ningún entregable.",
    waiting:
      "La ejecución está pendiente en un entorno que permita crear archivos. Este escenario no cuenta como ejecución por IA.",
  },
};
function language(locale) {
  return ["pt", "en", "es"].includes(locale) ? locale : "pt";
}
function current(record, skill) {
  return (
    record.version === skill.release?.version &&
    record.packageSha256 === skill.release?.sha256
  );
}
function validArtifact(artifact) {
  if (
    !artifact ||
    !/^\/evidence-assets\/\d+\.\d+\.\d+\/[a-z0-9-]+\/[a-z0-9-]+\.[a-z0-9]+$/.test(
      artifact.url,
    ) ||
    !/^[a-f0-9]{64}$/.test(artifact.sha256 || "")
  )
    return false;
  const target = path.resolve(__dirname, "../dist", artifact.url.slice(1));
  const root = path.resolve(__dirname, "../dist/evidence-assets") + path.sep;
  return (
    target.startsWith(root) &&
    fs.existsSync(target) &&
    fs.statSync(target).isFile() &&
    hash(fs.readFileSync(target)) === artifact.sha256
  );
}
function getDeliverableSamples(skill, locale = "pt") {
  locale = language(locale);
  const words = common[locale];
  return evidence.scenarios
    .filter(
      (s) =>
        s.skillId === skill.id &&
        s.status === "passed" &&
        s.passed === true &&
        s.assistantExecuted === true &&
        current(s, skill) &&
        s.artifacts?.length &&
        s.artifacts.every(validArtifact) &&
        s.checks?.length &&
        s.checks.every((c) => c.passed === true),
    )
    .map((s) => ({
      caseId: s.caseId,
      title: s.copy[locale].title,
      scope: s.copy[locale].scope,
      status: "passed",
      statusLabel: words.passed,
      limitations: [...s.copy[locale].limitations, words.boundary],
      runtime: s.runtime,
      modelLabel: s.model || words.model,
      version: s.version,
      finishedAt: s.finishedAt,
      sourceSha256: s.sourceSha256,
      packageSha256: s.packageSha256,
      checks: s.checks.map((c) => ({
        id: c.id,
        label: c.labels[locale],
        passed: c.passed,
      })),
      artifacts: s.artifacts.map((a) => ({
        label: a.labels[locale],
        url: a.url,
        filename: a.filename,
        mimeType: a.mimeType,
        sha256: a.sha256,
      })),
      passed: true,
      currentVersion: true,
      evidenceLanguage: "pt",
      fullSkillExecutionVerified: false,
      executionVerified: false,
    }));
}
function getDeliverableReadiness(skill, locale = "pt") {
  locale = language(locale);
  const words = common[locale];
  return evidence.scenarios
    .filter((s) => s.skillId === skill.id)
    .map((s) => ({
      caseId: s.caseId,
      title: s.copy[locale].title,
      scope: s.copy[locale].scope,
      status: s.status,
      statusLabel: words[s.status],
      prerequisites: s.copy[locale].prerequisites,
      checks: s.checks.map((c) => ({
        id: c.id,
        label: c.labels[locale],
        passed: c.passed,
      })),
      limitations: [
        ...s.copy[locale].limitations,
        ...(s.status === "blocked"
          ? [words.blockedReason]
          : s.status === "not-run"
            ? [words.waiting]
            : []),
        words.boundary,
      ],
      version: s.version,
      attempts: s.attempts.length,
      finishedAt: s.finishedAt,
      currentVersion: current(s, skill),
      fullSkillExecutionVerified: false,
      passed:
        s.status === "passed" &&
        getDeliverableSamples(skill, locale).some((x) => x.caseId === s.caseId),
    }));
}
module.exports = {
  getDeliverableSamples,
  getDeliverableReadiness,
  validArtifact,
};
