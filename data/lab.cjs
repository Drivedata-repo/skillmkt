"use strict";
const skills = require("./skills.cjs");
const examples = require("./examples.cjs");
// Every card has an authored scenario. Only these ten deterministic fixtures
// have executable reference checks; neither category represents an AI run.
module.exports = Object.fromEntries(
  skills.map((skill) => [
    skill.id,
    {
      schemaVersion: 1,
      id: skill.id,
      scenarioId: `${skill.id}:authored-scenario`,
      method: "human-review-against-scenario",
      executionStatus: "not-run",
      executionEvidence: [],
      referenceKind: examples.find((x) => x.skillId === skill.id)?.kind || null,
    },
  ]),
);
