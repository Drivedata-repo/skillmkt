"use strict";
const { test } = require("node:test"),
  assert = require("node:assert/strict");
const { findSkills } = require("../lib/match.cjs");
const { profiles } = require("../lib/triage-profile.cjs");
const cases = [
  [
    "pt",
    "Quero criar um design de interface no Figma com componentes reutilizáveis.",
    "Quero orientações de frontend-design sobre componentes e uso Figma apenas como referência, sem executar ferramentas.",
  ],
  [
    "en",
    "I want to create an interface design in Figma with reusable components.",
    "I want frontend-design guidance on components and use Figma only as a reference, without executing tools.",
  ],
  [
    "es",
    "Quiero crear un diseño de interfaz en Figma con componentes reutilizables.",
    "Quiero orientación de frontend-design sobre componentes y uso Figma solo como referencia, sin ejecutar herramientas.",
  ],
];
for (const [locale, task, concept] of cases) {
  test(`${locale}: explicit Figma work cannot fall back to Power BI when its tools are unavailable`, () => {
    const blocked = findSkills(task, "technical", null, locale, {
      runtime: "codex",
      availability: { figma: "unavailable", figquery: "unavailable" },
    });
    assert.deepEqual(blocked.matches, []);
    assert.deepEqual(blocked.candidateIds, []);
    const noConnector = findSkills(task, "technical", null, locale, {
      environment: "general",
    });
    assert.deepEqual(noConnector.matches, []);
    assert.deepEqual(noConnector.candidateIds, []);
  });
  test(`${locale}: an available Figma backend preserves specific eligible recommendations`, () => {
    const result = findSkills(task, "technical", null, locale, {
      runtime: "codex",
      availability: { figma: "available", figquery: "unavailable" },
    });
    assert.ok(result.matches.length > 0);
    assert.ok(
      result.candidateIds.every((id) =>
        profiles.get(id).tools.includes("figma"),
      ),
    );
    assert.ok(result.matches.every((m) => !m.id.endsWith("-figquery")));
  });
  test(`${locale}: Figma may remain a conceptual reference without requiring execution`, () => {
    const result = findSkills(concept, "technical", null, locale, {
      runtime: "codex",
      availability: { figma: "unavailable", figquery: "unavailable" },
    });
    assert.ok(result.matches.some((m) => m.id === "frontend-design"));
  });
}
