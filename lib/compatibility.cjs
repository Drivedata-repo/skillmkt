"use strict";
const { capabilities, entries } = require("../data/compatibility.cjs");
const index = (l) => ({ pt: 1, en: 2, es: 3 })[l] || 1;
const runtimeRows = [
  ["any", "Ainda não escolhi", "Not selected yet", "Aún no elegí"],
  ["codex", "Codex", "Codex", "Codex"],
  [
    "claude",
    "Claude / Claude Code",
    "Claude / Claude Code",
    "Claude / Claude Code",
  ],
  ["other", "Outro assistente", "Another assistant", "Otro asistente"],
];
const runtimeOptions = (l) =>
  runtimeRows.map((r) => ({ id: r[0], label: r[index(l)] }));
const capabilityOptions = (l) =>
  capabilities.map((r) => ({ id: r[0], label: r[index(l)] }));
function validateContext(runtime = "any", availability = {}) {
  if (
    !runtimeRows.some((r) => r[0] === runtime) ||
    !availability ||
    typeof availability !== "object" ||
    Array.isArray(availability) ||
    Object.keys(availability).length > capabilities.length ||
    Object.entries(availability).some(
      ([k, v]) =>
        !capabilities.some((r) => r[0] === k) ||
        !["available", "unavailable", "unknown"].includes(v),
    )
  )
    throw Object.assign(
      new Error("Escolha filtros válidos para refinar sua necessidade."),
      { status: 400 },
    );
  return { runtime, availability: { ...availability } };
}
const words = {
  pt: {
    dependency: "Requer configuração",
    unvalidated: "Execução não validada",
    blocked: "Requisito indisponível",
    runtime:
      "A fonte depende de outro runtime. Consulte uma adaptação antes de executar.",
    pending:
      "Confira as dependências antes de começar. Declarar uma ferramenta disponível não comprova execução.",
    plain:
      "O pacote pode ser consultado como instrução. A execução neste assistente ainda não foi validada.",
    evidence:
      "Metadados do pacote e dependências da fonte; não é teste de execução.",
  },
  en: {
    dependency: "Setup required",
    unvalidated: "Execution not validated",
    blocked: "Requirement unavailable",
    runtime:
      "The source depends on another runtime. Review an adaptation before executing it.",
    pending:
      "Check dependencies before starting. Declaring a tool available does not prove execution.",
    plain:
      "The package can be consulted as instructions. Execution in this assistant has not been validated.",
    evidence:
      "Package metadata and source dependencies; not an execution test.",
  },
  es: {
    dependency: "Requiere configuración",
    unvalidated: "Ejecución no validada",
    blocked: "Requisito no disponible",
    runtime:
      "La fuente depende de otro runtime. Revisa una adaptación antes de ejecutarla.",
    pending:
      "Comprueba dependencias antes de comenzar. Declarar una herramienta disponible no demuestra ejecución.",
    plain:
      "El paquete puede consultarse como instrucciones. Su ejecución en este asistente no está validada.",
    evidence:
      "Metadatos del paquete y dependencias de la fuente; no es una prueba de ejecución.",
  },
};
function assessCompatibility(skill, context = {}, locale = "pt") {
  const { runtime, availability } = validateContext(
      context.runtime || "any",
      context.availability || {},
    ),
    e = entries[skill.id];
  if (!e) throw new Error("Unknown skill");
  const w = words[locale] || words.pt;
  const requirements = e.required.map((id) => ({
    id,
    label: capabilityOptions(locale).find((x) => x.id === id).label,
    availability: availability[id] || "unknown",
  }));
  const runtimeMismatch =
    !!e.runtime && runtime !== "any" && runtime !== e.runtime;
  const blocking =
    runtimeMismatch ||
    requirements.some((r) => r.availability === "unavailable");
  const status = e.required.length || e.runtime ? "dependency" : "unvalidated";
  return {
    status,
    label: blocking ? w.blocked : w[status],
    summary: runtimeMismatch
      ? w.runtime
      : status === "dependency"
        ? w.pending
        : w.plain,
    runtime,
    requiredRuntime: e.runtime,
    requirements,
    sourceRequirements: skill.dependencies,
    blocking,
    packageVerified:
      skill.release?.review === "structure-checked" &&
      /^[a-f0-9]{64}$/.test(skill.release?.sha256 || ""),
    installationVerified: false,
    executionVerified: false,
    evidence: { kind: "source-review", source: e.source, note: w.evidence },
  };
}
module.exports = {
  runtimeOptions,
  capabilityOptions,
  validateContext,
  assessCompatibility,
};
