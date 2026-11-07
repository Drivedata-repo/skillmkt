"use strict";
const { test } = require("node:test"),
  assert = require("node:assert/strict");
const { cases, readSource } = require("../scripts/run-assistant-evals.cjs");
test("assistant sample oracles independently reject invented facts and wrong aggregate calculations", () => {
  const margin = cases.find((c) => c.id === "weighted-margin");
  assert.ok(
    margin
      .checks({ revenue: 1100, cost: 690, profit: 410, margin: 410 / 1100 })
      .every((x) => x.passed),
  );
  assert.ok(
    margin
      .checks({ revenue: 1100, cost: 690, profit: 410, margin: 0.25 })
      .some((x) => !x.passed),
  );
  const minutes = cases.find((c) => c.id === "minutes-missing-date");
  assert.ok(
    minutes
      .checks({
        actions: [
          { owner: "Ana", action: "Review", due: "2026-11-10" },
          { owner: "Bruno", action: "Validate", due: null },
        ],
      })
      .every((x) => x.passed),
  );
  assert.ok(
    minutes
      .checks({
        actions: [
          { owner: "Ana", action: "Review", due: "2026-11-10" },
          { owner: "Bruno", action: "Validate", due: "2026-11-11" },
        ],
      })
      .some((x) => !x.passed),
  );
  const risk = cases.find((c) => c.id === "risk-matrix");
  assert.ok(
    risk
      .checks({
        risks: [
          { id: "A", score: 8, level: "medium" },
          { id: "B", score: 8, level: "medium" },
        ],
        legalApproval: false,
      })
      .every((x) => x.passed),
  );
  assert.ok(
    risk
      .checks({
        risks: [
          { id: "A", score: 8, level: "medium" },
          { id: "B", score: 8, level: "medium" },
        ],
        legalApproval: true,
      })
      .some((x) => !x.passed),
  );
});
test("assistant source reader rejects path traversal before opening an archive", () => {
  assert.throws(() => readSource("../../private", "1.1.0"));
});
