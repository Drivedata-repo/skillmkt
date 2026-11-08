"use strict";
const crypto = require("node:crypto");
const schema = require("../data/lab.cjs");
const examples = require("../data/examples.cjs");
const { run } = require("./example-reference.cjs");
const { getUniverse } = require("./universes.cjs");
const assistantEvidence = require("../data/assistant-evidence.json");
const {
  getDeliverableSamples,
  getDeliverableReadiness,
} = require("./deliverable-evidence.cjs");
const checks = {
  orders: (r) =>
    r.uniqueOrders === 3 &&
    r.total === 2500 &&
    r.byClient.Aurora === 1700 &&
    r.byClient.Norte === 800 &&
    r.duplicates.join() === "P01",
  minutes: (r) =>
    r.actions.length === 2 &&
    r.actions[0].owner === "Ana" &&
    r.actions[1].owner === "Bruno" &&
    r.actions[1].due === "A confirmar",
  document: (r) =>
    r.sections.length === 4 &&
    r.sections[2].items.join() === "Integração com ERP",
  cleanup: (r) => r.totals.ALFA === 200 && r.errors.length === 1,
  slides: (r) =>
    r.slides.length === 3 && r.slides[2].body.includes("20 pedidos"),
  margin: (r) =>
    r.revenue === 1100 &&
    r.profit === 410 &&
    Math.abs(r.margin - 410 / 1100) < 1e-10,
  reconcile: (r) => r.totalDifference === 300 && r.rows[1].difference === 300,
  requirements: (r) => r.flows.length === 3 && r.openDecisions.length === 2,
  content: (r) =>
    r.status === "Rascunho para aprovação" &&
    r.draft.includes("Revisão de regras"),
  seo: (r) => r.issues.length === 3,
};
const hash = (x) =>
  crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function verifyReference(example) {
  const output = run(example.kind, structuredClone(example.input));
  const passed = checks[example.kind]?.(output) === true;
  return {
    kind: example.kind,
    passed,
    inputSha256: hash(example.input),
    outputSha256: hash(output),
    output,
    method: "deterministic-reference",
    model: null,
    runtime: `Node.js ${process.version}`,
    executedAt: new Date().toISOString(),
    checks: [{ id: `${example.kind}:expected-facts`, passed }],
    executionVerified: false,
  };
}
const words = {
  pt: {
    ready: "Cenário pronto para avaliação",
    checked: "Referência reproduzível conferida",
    failed: "Referência requer revisão",
    notice:
      "Cenário editorial e referência local não comprovam execução da skill por IA.",
    check:
      "Compare a saída com o critério do cenário e registre evidência antes de declarar aprovação.",
    method: "Revisão humana do resultado contra o cenário",
    evidence: "Nenhuma execução por assistente registrada",
  },
  en: {
    ready: "Scenario ready for evaluation",
    checked: "Reproducible reference checked",
    failed: "Reference needs review",
    notice:
      "An authored scenario and local reference do not prove AI execution of the skill.",
    check:
      "Compare output with the scenario criterion and record evidence before marking it passed.",
    method: "Human review of output against the scenario",
    evidence: "No assistant execution recorded",
  },
  es: {
    ready: "Escenario listo para evaluación",
    checked: "Referencia reproducible comprobada",
    failed: "La referencia requiere revisión",
    notice:
      "Un escenario editorial y una referencia local no demuestran ejecución de la skill por IA.",
    check:
      "Compara la salida con el criterio del escenario y registra evidencia antes de aprobarlo.",
    method: "Revisión humana del resultado frente al escenario",
    evidence: "Ninguna ejecución del asistente registrada",
  },
};
const sampleCopy = {
  label: [
    "Amostra limitada registrada; execução integral não homologada",
    "Limited sample recorded; full execution not validated",
    "Muestra limitada registrada; ejecución integral no homologada",
  ],
  model: [
    "Modelo não informado pelos eventos do CLI",
    "Model not reported by CLI events",
    "Modelo no informado por los eventos del CLI",
  ],
  limitation: [
    "Ensaio com dados fictícios e resposta JSON, sem ferramentas ou serviços externos. Não valida criação de arquivos, integrações, todos os casos da skill nem revisão profissional. A entrada e a saída originais foram preservadas em inglês para conferir os hashes.",
    "A fictional-input, JSON-response sample without tools or external services. It does not validate file creation, integrations, all skill cases or professional review. Original English input and output are preserved for hash verification.",
    "Ensayo con datos ficticios y respuesta JSON, sin herramientas ni servicios externos. No valida creación de archivos, integraciones, todos los casos de la skill ni revisión profesional. Entrada y salida originales conservadas en inglés para verificar hashes.",
  ],
  cases: {
    "weighted-margin": [
      "Cálculo de margem ponderada a partir de CSV fictício",
      "Weighted margin calculation from fictional CSV",
      "Cálculo de margen ponderado desde CSV ficticio",
    ],
    "minutes-missing-date": [
      "Extração de decisões sem inventar o prazo ausente",
      "Decision extraction without inventing a missing deadline",
      "Extracción de decisiones sin inventar una fecha ausente",
    ],
    "risk-matrix": [
      "Aplicação da matriz de risco a pontuações fictícias",
      "Applying the risk matrix to fictional scores",
      "Aplicación de la matriz de riesgo a puntuaciones ficticias",
    ],
  },
  checks: {
    "source-totals": [
      "Receita 1100 e custo 690 preservados",
      "Revenue 1100 and cost 690 preserved",
      "Ingresos 1100 y coste 690 conservados",
    ],
    profit: ["Lucro igual a 410", "Profit equals 410", "Beneficio igual a 410"],
    "weighted-margin": [
      "Margem agregada igual a 410/1100",
      "Aggregate margin equals 410/1100",
      "Margen agregado igual a 410/1100",
    ],
    "two-actions": [
      "Duas ações, sem ações extras",
      "Two actions, without extra actions",
      "Dos acciones, sin acciones adicionales",
    ],
    "ana-date": [
      "Prazo de Ana preservado: 2026-11-10",
      "Ana's deadline preserved: 2026-11-10",
      "Fecha de Ana conservada: 2026-11-10",
    ],
    "bruno-date-unknown": [
      "Prazo de Bruno mantido como desconhecido",
      "Bruno's deadline remains unknown",
      "La fecha de Bruno sigue desconocida",
    ],
    "no-extra-owner": [
      "Somente responsáveis da entrada",
      "Only owners from the input",
      "Solo responsables de la entrada",
    ],
    "both-risks": [
      "Ambos os riscos A e B preservados",
      "Both risks A and B preserved",
      "Ambos riesgos A y B conservados",
    ],
    "matrix-score": [
      "Ambos classificados com pontuação 8 e risco médio",
      "Both classified with score 8 and medium risk",
      "Ambos clasificados con puntuación 8 y riesgo medio",
    ],
    "not-legal-approval": [
      "Sem declarar aprovação jurídica",
      "No claim of legal approval",
      "Sin afirmar aprobación jurídica",
    ],
  },
};
function getAssistantSamples(skill, locale = "pt") {
  const i = { pt: 0, en: 1, es: 2 }[locale] || 0;
  return assistantEvidence.samples
    .filter((s) => s.skillId === skill.id)
    .map((s) => {
      const { outputText, ...record } = structuredClone(s);
      const outputArtifact = {
        filename: `${s.skillId}-${s.version}-${s.caseId}-assistant-output.json`,
        mimeType: "application/json",
        content: outputText,
        sha256: s.outputSha256,
      };
      const inputContent = JSON.stringify(s.input);
      const inputArtifact = {
        filename: `${s.skillId}-${s.version}-${s.caseId}-assistant-input.json`,
        mimeType: "application/json",
        content: inputContent,
        sha256: s.inputSha256,
      };
      return {
        ...record,
        // A 1.2.1 só acrescenta licença e aviso de autoria; a amostra feita na 1.2.0 continua válida.
        currentVersion:
          (s.version === skill.version &&
            s.packageSha256 === skill.release?.sha256) ||
          (skill.version === "1.2.1" &&
            skill.release?.baselineVersion === s.version &&
            skill.release?.baselinePackageSha256 === s.packageSha256),
        scopeLabel: sampleCopy.cases[s.caseId][i],
        modelLabel: s.model || sampleCopy.model[i],
        limitation: sampleCopy.limitation[i],
        executionLabel: sampleCopy.label[i],
        checks: s.checks.map((c) => ({
          ...c,
          label: sampleCopy.checks[c.id][i],
        })),
        artifacts: [
          inputArtifact,
          outputArtifact,
          artifact(
            `${s.skillId}-${s.version}-${s.caseId}-assistant-evidence.json`,
            record,
          ),
        ],
      };
    });
}
function getLab(skill, locale = "pt") {
  const e = schema[skill.id],
    u = getUniverse(skill.id, locale),
    w = words[locale] || words.pt;
  if (!e) throw new Error("Unknown skill");
  const original = examples.find((x) => x.skillId === skill.id),
    result = original ? verifyReference(original) : null;
  const output = skill.example?.result || result?.output;
  const reference = result
    ? {
        ...result,
        sourceOutputSha256: result.outputSha256,
        outputSha256: hash(output),
        output,
        title: skill.example?.title,
        criteria: skill.example?.checks || [],
        limitation: skill.example?.limitation,
        fixtureLanguage: locale,
        artifacts: [
          artifact(
            `${skill.id}-${locale}-input.json`,
            skill.example?.input || original.input,
          ),
          artifact(`${skill.id}-${locale}-output.json`, output),
        ],
      }
    : null;
  const assistantSamples = getAssistantSamples(skill, locale),
    deliverableSamples = getDeliverableSamples(skill, locale),
    hasCurrentSample = assistantSamples.some((s) => s.currentVersion) || deliverableSamples.length > 0;
  return {
    ...e,
    status: result
      ? result.passed
        ? "reference-checked"
        : "reference-failed"
      : "scenario-ready",
    label: result ? (result.passed ? w.checked : w.failed) : w.ready,
    scenario: { ...u.scenario },
    prerequisites: skill.dependencies,
    criteria: [u.scenario.check, w.check],
    methodLabel: w.method,
    executionVerified: false,
    fullSkillExecutionVerified: false,
    executionStatus: hasCurrentSample ? "limited-sample-verified" : "not-run",
    executionLabel: hasCurrentSample
      ? sampleCopy.label[{ pt: 0, en: 1, es: 2 }[locale] || 0]
      : w.evidence,
    notice: w.notice,
    reference,
    assistantSamples,
    deliverableSamples,
    deliverableReadiness: getDeliverableReadiness(skill, locale),
  };
}
function artifact(filename, value) {
  const content = JSON.stringify(value, null, 2) + "\n";
  return {
    filename,
    mimeType: "application/json",
    content,
    sha256: crypto.createHash("sha256").update(content).digest("hex"),
  };
}
module.exports = { getLab, verifyReference, getAssistantSamples };
