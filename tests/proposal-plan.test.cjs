"use strict";
const { test } = require("node:test"),
  assert = require("node:assert/strict");
const { findSkills } = require("../lib/match.cjs");
const { buildPlan } = require("../lib/plans.cjs");
const { skills } = require("../lib/catalog.cjs");
const tasks = [
  [
    "pt",
    "Preciso preparar uma proposta comercial e uma apresentação de slides para apresentar ao cliente.",
    "Preciso preparar uma proposta comercial, sem slides.",
    "Preciso criar slides, mas não quero preparar uma proposta comercial.",
  ],
  [
    "en",
    "I need to prepare a commercial proposal and PowerPoint slides to present to the customer.",
    "I need to prepare a commercial proposal without slides.",
    "I need PowerPoint slides, but I do not want a commercial proposal.",
  ],
  [
    "es",
    "Necesito preparar una propuesta comercial y diapositivas para presentar al cliente.",
    "Necesito preparar una propuesta comercial sin diapositivas.",
    "Necesito diapositivas, pero no quiero preparar una propuesta comercial.",
  ],
];
for (const [locale, task, noSlides, noProposal] of tasks) {
  test(`${locale}: proposal and presentation form an ordered two-card plan`, () => {
    const result = findSkills(task, "business", null, locale, {
      runtime: "codex",
      availability: { documents: "available" },
    });
    assert.equal(result.clarification, null);
    assert.equal(result.plan?.id, "proposal-presentation");
    assert.deepEqual(
      result.plan.steps.map((s) => s.skillId),
      ["propostas-comerciais-e-estimativas", "claude-pptx"],
    );
    assert.deepEqual(
      result.plan.steps.map((s) => s.order),
      [1, 2],
    );
    assert.ok(
      result.plan.steps.every(
        (s) => s.input && s.output && s.rationale && !s.compatibility.blocking,
      ),
    );
    assert.ok(
      !result.plan.steps.some((s) => s.skillId === "claude-deep-research"),
    );
    if (locale !== "pt")
      assert.notEqual(result.plan.title, findSkills(tasks[0][1]).plan.title);
  });
  test(`${locale}: negated proposal or slides never becomes a proposal-presentation plan`, () => {
    assert.equal(findSkills(noSlides, "business", null, locale).plan, null);
    assert.equal(findSkills(noProposal, "business", null, locale).plan, null);
  });
  test(`${locale}: proposal plans preserve declared availability and hard filters`, () => {
    assert.equal(
      findSkills(task, "business", null, locale, {
        availability: { documents: "unavailable" },
      }).plan,
      null,
    );
    assert.equal(
      findSkills(task, "business", null, locale, {
        goal: "spreadsheets",
        tool: "excel",
      }).plan,
      null,
    );
    assert.equal(
      findSkills(task, "business", null, locale, { goal: "sales" }).plan,
      null,
    );
    assert.equal(
      buildPlan(
        task,
        skills.filter((s) => s.id !== "claude-pptx"),
        {},
        locale,
      ),
      null,
    );
  });
}
