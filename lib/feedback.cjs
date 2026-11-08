"use strict";
const crypto = require("node:crypto");
const skills = require("../data/skills.cjs");
const { options } = require("../data/triage-options.cjs");
const ids = new Set(skills.map((s) => s.id));
const kinds = ["feedback", "issue", "recommendation", "download"];
const outcomes = [
  "resolved",
  "partial",
  "not-fit",
  "matches",
  "no-match",
  "downloaded",
  "blocked",
];
const reasons = [
  "none",
  "recognition",
  "dependency",
  "different-result",
  "unclear",
  "incompatible",
  "out-of-scope",
];
function validateFeedback(raw) {
  const fail = () => {
    throw Object.assign(new Error("Confira os campos da avaliação."), {
      status: 400,
    });
  };
  if (
    !raw ||
    typeof raw !== "object" ||
    Array.isArray(raw) ||
    Object.keys(raw).some(
      (k) =>
        ![
          "kind",
          "skillId",
          "outcome",
          "reason",
          "runtime",
          "goal",
          "tool",
          "consent",
        ].includes(k),
    )
  )
    fail();
  if (
    raw.consent !== true ||
    !kinds.includes(raw.kind) ||
    !outcomes.includes(raw.outcome) ||
    !reasons.includes(raw.reason ?? "none")
  )
    fail();
  if (
    raw.kind === "recommendation" ? raw.skillId !== null : !ids.has(raw.skillId)
  )
    fail();
  const pairs = {
    feedback: ["resolved", "partial", "not-fit"],
    issue: ["blocked"],
    recommendation: ["matches", "no-match"],
    download: ["downloaded"],
  };
  if (!pairs[raw.kind].includes(raw.outcome)) fail();
  const goal = raw.goal === undefined ? "any" : raw.goal,
    tool = raw.tool === undefined ? "any" : raw.tool,
    runtime = raw.runtime === undefined ? "any" : raw.runtime;
  if (raw.reason !== undefined && typeof raw.reason !== "string") fail();
  if (
    !["any", "codex", "claude", "other"].includes(runtime) ||
    !options().goal.some((x) => x.id === goal) ||
    !options().tool.some((x) => x.id === tool)
  )
    fail();
  return {
    kind: raw.kind,
    skillId: raw.skillId,
    outcome: raw.outcome,
    reason: raw.reason ?? "none",
    runtime,
    goal,
    tool,
  };
}
function sessionKey(req) {
  if (!process.env.RATE_LIMIT_SECRET)
    throw new Error("Feedback not configured");
  const pairs = String(req.headers.cookie || "")
    .split(";")
    .map((s) => s.trim().split("="));
  const names = process.env.VERCEL
    ? ["__Host-drive_demo", "__Host-deck_customer"]
    : ["drive_demo", "deck_customer"];
  const found = names
    .map((name) => [name, pairs.find((parts) => parts[0] === name)?.[1]])
    .find(([, value]) => value);
  const token = found ? found[0] + "=" + found[1] : null;
  if (!token)
    throw Object.assign(new Error("Entre com a senha da demonstração."), {
      status: 401,
    });
  return crypto
    .createHmac("sha256", process.env.RATE_LIMIT_SECRET)
    .update("feedback:" + token)
    .digest("hex");
}
function adminAllowed(req) {
  const expected = process.env.INSIGHTS_KEY || "",
    received = req.headers["x-insights-key"] || "";
  if (
    expected.length < 32 ||
    typeof received !== "string" ||
    received.length > 256
  )
    return false;
  return crypto.timingSafeEqual(
    crypto.createHash("sha256").update(expected).digest(),
    crypto.createHash("sha256").update(received).digest(),
  );
}
module.exports = { validateFeedback, sessionKey, adminAllowed };
