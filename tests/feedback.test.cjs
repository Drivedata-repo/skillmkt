"use strict";
const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto"),
  fs = require("node:fs"),
  path = require("node:path");
const feedback = require("../lib/feedback.cjs"),
  auth = require("../lib/auth.cjs");
const skillId = require("../data/skills.cjs")[0].id;
const payload = (extra = {}) => ({
  kind: "feedback",
  skillId,
  outcome: "resolved",
  reason: "none",
  runtime: "codex",
  goal: "any",
  tool: "any",
  consent: true,
  ...extra,
});
function setup() {
  const keys = [
      "DEMO_PASSWORD_HASH",
      "DEMO_SESSION_SECRET",
      "RATE_LIMIT_SECRET",
      "INSIGHTS_KEY",
      "VERCEL",
    ],
    before = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  process.env.DEMO_PASSWORD_HASH =
    crypto.randomBytes(16).toString("hex") +
    ":" +
    crypto.randomBytes(64).toString("hex");
  for (const k of ["DEMO_SESSION_SECRET", "RATE_LIMIT_SECRET", "INSIGHTS_KEY"])
    process.env[k] = crypto.randomBytes(32).toString("hex");
  delete process.env.VERCEL;
  return () => {
    for (const [k, v] of Object.entries(before)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  };
}
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
    end(body) {
      this.data = JSON.parse(body);
    },
  };
}
function request({
  method = "POST",
  locale = "pt",
  logged = true,
  body = payload(),
  headers = {},
} = {}) {
  return {
    method,
    url: `/api/feedback?lang=${locale}`,
    headers: {
      host: "deck.example.invalid",
      origin: "https://deck.example.invalid",
      "content-type": "application/json",
      ...(logged ? { cookie: auth.cookie(auth.issue()).split(";")[0] } : {}),
      ...headers,
    },
    body,
  };
}
function mockHandler() {
  const dbPath = require.resolve("../lib/db.cjs"),
    limitPath = require.resolve("../lib/limit.cjs"),
    handlerPath = require.resolve("../api/feedback.js");
  const db = require(dbPath),
    limit = require(limitPath),
    calls = [],
    limits = [];
  require.cache[dbPath].exports = {
    db: () => ({
      query: async (sql, params) => {
        calls.push({ sql, params });
        return { rows: [{ kind: "feedback", total: "2" }] };
      },
    }),
  };
  require.cache[limitPath].exports = {
    limit: async (...args) => limits.push(args),
  };
  delete require.cache[handlerPath];
  const handler = require(handlerPath);
  require.cache[dbPath].exports = db;
  require.cache[limitPath].exports = limit;
  return { handler, calls, limits };
}
test("feedback validates allowed event/outcome pairs and excludes arbitrary personal data", () => {
  const clean = feedback.validateFeedback(payload());
  assert.equal(clean.skillId, skillId);
  assert.ok(!Object.hasOwn(clean, "consent"));
  for (const row of [
    { kind: "issue", outcome: "blocked", reason: "dependency" },
    { kind: "download", outcome: "downloaded" },
    { kind: "recommendation", skillId: null, outcome: "matches" },
    { kind: "recommendation", skillId: null, outcome: "no-match" },
  ])
    assert.doesNotThrow(() => feedback.validateFeedback(payload(row)));
  for (const bad of [
    null,
    [],
    "text",
    payload({ consent: false }),
    payload({ consent: "true" }),
    payload({ skillId: "unknown-skill" }),
    payload({ kind: "admin" }),
    payload({ outcome: "downloaded" }),
    payload({ kind: "recommendation", skillId, outcome: "matches" }),
    payload({ kind: "issue", outcome: "resolved" }),
    payload({ reason: "run-sql" }),
    payload({ runtime: "administrator" }),
    payload({ goal: "unknown" }),
    payload({ tool: "unknown" }),
    payload({ email: "private@example.invalid" }),
    payload({ comment: "private note" }),
    payload({ session_key: "a".repeat(64) }),
    payload({ release_version: "999.0.0" }),
    JSON.parse('{"kind":"feedback","consent":true,"__proto__":{"admin":true}}'),
  ])
    assert.throws(
      () => feedback.validateFeedback(bad),
      (e) => e.status === 400,
    );
});
test("feedback rejects explicit non-string option values rather than silently normalizing forged data", () => {
  for (const key of ["runtime", "goal", "tool", "reason"])
    for (const bad of [false, 0, "", null, [], {}])
      assert.throws(
        () => feedback.validateFeedback(payload({ [key]: bad })),
        (e) => e.status === 400,
        `${key}=${JSON.stringify(bad)}`,
      );
});
test("session hashing is anchored and follows the same cookie name as authentication", () => {
  const restore = setup();
  try {
    for (const production of [false, true]) {
      if (production) process.env.VERCEL = "1";
      else delete process.env.VERCEL;
      const token = auth.issue(),
        realName = production ? "__Host-drive_demo" : "drive_demo",
        otherName = production ? "drive_demo" : "__Host-drive_demo";
      const req = { headers: { cookie: `${realName}=${token}` } },
        stable = feedback.sessionKey(req);
      assert.match(stable, /^[a-f0-9]{64}$/);
      assert.notEqual(stable, token);
      const prefixed = {
        headers: {
          cookie: `unrelated_${realName}=not-session; ${realName}=${token}`,
        },
      };
      assert.equal(feedback.sessionKey(prefixed), stable);
      const forged = {
        headers: { cookie: `${otherName}=forged-prefix; ${realName}=${token}` },
      };
      assert.equal(auth.authenticated(forged), true);
      assert.equal(feedback.sessionKey(forged), stable);
      assert.throws(
        () =>
          feedback.sessionKey({
            headers: { cookie: `unrelated_${realName}=not-session` },
          }),
        (e) => e.status === 401,
      );
    }
  } finally {
    restore();
  }
});
test("insights requires its own exact secret and never accepts a session token or header array", () => {
  const restore = setup();
  try {
    assert.equal(
      feedback.adminAllowed({
        headers: { "x-insights-key": process.env.INSIGHTS_KEY },
      }),
      true,
    );
    for (const value of [
      undefined,
      "",
      auth.issue(),
      process.env.INSIGHTS_KEY + "x",
      [process.env.INSIGHTS_KEY],
      "x".repeat(257),
    ])
      assert.equal(
        feedback.adminAllowed({ headers: { "x-insights-key": value } }),
        false,
      );
    process.env.INSIGHTS_KEY = "short";
    assert.equal(
      feedback.adminAllowed({ headers: { "x-insights-key": "short" } }),
      false,
    );
  } finally {
    restore();
  }
});
test("feedback API enforces authentication before validation, rate limit or database access", async () => {
  const restore = setup();
  try {
    const { handler, calls, limits } = mockHandler();
    for (const method of ["GET", "POST"]) {
      const res = response();
      await handler(
        request({
          method,
          logged: false,
          headers: { "x-insights-key": process.env.INSIGHTS_KEY },
        }),
        res,
      );
      assert.equal(res.status, 401);
      assert.deepEqual(Object.keys(res.data), ["error"]);
    }
    assert.equal(calls.length, 0);
    assert.equal(limits.length, 0);
  } finally {
    restore();
  }
});
test("authenticated demo visitors cannot read raw or aggregated feedback without the admin key", async () => {
  const restore = setup();
  try {
    const { handler, calls } = mockHandler();
    for (const headers of [
      {},
      { "x-insights-key": "wrong" },
      { "x-insights-key": [process.env.INSIGHTS_KEY] },
    ]) {
      const res = response();
      await handler(request({ method: "GET", headers }), res);
      assert.equal(res.status, 403);
    }
    assert.equal(calls.length, 0);
    const res = response();
    await handler(
      request({
        method: "GET",
        headers: { "x-insights-key": process.env.INSIGHTS_KEY },
      }),
      res,
    );
    assert.equal(res.status, 200);
    assert.equal(calls.length, 1);
    assert.match(calls[0].sql, /SELECT \* FROM skillmkt\.feedback_summary\(\)/);
    assert.doesNotMatch(calls[0].sql, /feedback_events/);
    assert.deepEqual(res.data.rows, [{ kind: "feedback", total: "2" }]);
  } finally {
    restore();
  }
});
test("feedback submission uses bound values, source-derived release and no raw cookie", async () => {
  const restore = setup();
  try {
    const { handler, calls, limits } = mockHandler();
    const req = request({ locale: "es" }),
      res = response();
    await handler(req, res);
    assert.equal(res.status, 200);
    assert.equal(calls.length, 1);
    assert.equal(limits.length, 1);
    assert.equal(limits[0][1], "deck-feedback");
    const { sql, params } = calls[0];
    assert.match(sql, /INSERT INTO skillmkt\.feedback_events/);
    assert.match(sql, /ON CONFLICT DO NOTHING/);
    assert.match(sql, /release_version/);
    assert.match(params[0], /^[a-f0-9]{64}$/);
    assert.ok(
      !params.some(
        (v) => typeof v === "string" && v.includes(req.headers.cookie),
      ),
    );
    assert.ok(params.includes("es"));
    assert.ok(
      params.includes(require("../data/releases.cjs")[skillId].version),
    );
    assert.ok(!JSON.stringify(res.data).includes("session_key"));
  } finally {
    restore();
  }
});
test("forged feedback and cross-origin writes never reach the database", async () => {
  const restore = setup();
  try {
    const { handler, calls, limits } = mockHandler();
    for (const body of [
      payload({ session_key: "f".repeat(64) }),
      payload({ kind: "issue", outcome: "resolved" }),
      payload({ skillId: "x'); DELETE FROM skillmkt.feedback_events; --" }),
      payload({ release_version: "999.0.0" }),
    ]) {
      const res = response();
      await handler(request({ body }), res);
      assert.equal(res.status, 400);
    }
    const csrf = response();
    await handler(
      request({ headers: { origin: "https://attacker.example.invalid" } }),
      csrf,
    );
    assert.equal(csrf.status, 403);
    const method = response();
    await handler(request({ method: "DELETE" }), method);
    assert.equal(method.status, 405);
    assert.equal(calls.length, 0);
    assert.equal(limits.length, 0);
  } finally {
    restore();
  }
});
test("feedback migration keeps raw events write-only and exposes only a fixed aggregate function", () => {
  const sql = fs.readFileSync(
    path.join(
      __dirname,
      "../supabase/migrations/20261106235141_deck_feedback.sql",
    ),
    "utf8",
  );
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/i);
  assert.match(
    sql,
    /REVOKE ALL ON skillmkt\.feedback_events FROM PUBLIC,anon,authenticated,skillmkt_app/i,
  );
  assert.match(
    sql,
    /GRANT INSERT ON skillmkt\.feedback_events TO skillmkt_app/i,
  );
  assert.doesNotMatch(
    sql,
    /GRANT\s+(?:ALL|SELECT)\s+ON\s+skillmkt\.feedback_events/i,
  );
  assert.match(sql, /CREATE FUNCTION skillmkt\.feedback_summary\(\)/i);
  assert.match(sql, /SECURITY DEFINER SET search_path = pg_catalog,skillmkt/i);
  assert.match(
    sql,
    /REVOKE ALL ON FUNCTION skillmkt\.feedback_summary\(\) FROM PUBLIC,anon,authenticated/i,
  );
  assert.match(sql, /PRIMARY KEY\s*\([^)]*release_version[^)]*\)/i);
});
