"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const { getPack, sha256 } = require("../lib/packs.cjs");
const { sourceReleases } = require("../data/packs.cjs");
// Isolated test-worker dependencies; no database or rate-limit writes.
let databaseCalls = 0,
  limitCalls = 0,
  rateError = null,
  dbError = null,
  rows = [];
const dbPath = require.resolve("../lib/db.cjs"),
  limitPath = require.resolve("../lib/limit.cjs");
require.cache[dbPath] = {
  id: dbPath,
  filename: dbPath,
  loaded: true,
  exports: {
    db: () => ({
      query: async () => {
        databaseCalls++;
        if (dbError) throw dbError;
        return { rows };
      },
    }),
  },
};
require.cache[limitPath] = {
  id: limitPath,
  filename: limitPath,
  loaded: true,
  exports: {
    limit: async (req, scope, max) => {
      limitCalls++;
      assert.equal(scope, "demo-pack-download");
      assert.equal(max, 30);
      if (rateError) throw rateError;
    },
  },
};
process.env.DEMO_PASSWORD_HASH = "a".repeat(32) + ":" + "b".repeat(128);
process.env.DEMO_SESSION_SECRET = "isolated-pack-session-test-secret-000000000";
delete process.env.VERCEL;
const auth = require("../lib/auth.cjs"),
  list = require("../api/packs.js"),
  download = require("../api/pack-download.js");
function req(url, authenticated = true, method = "GET") {
  return {
    url,
    method,
    headers: { cookie: authenticated ? "drive_demo=" + auth.issue() : "" },
    socket: { remoteAddress: "127.0.0.1" },
  };
}
function response() {
  return {
    status: null,
    headers: null,
    payload: null,
    writeHead(status, headers) {
      this.status = status;
      this.headers = headers;
    },
    end(body) {
      this.payload = body;
    },
  };
}
test("both APIs require the demo session before returning catalog or touching storage", async () => {
  for (const handler of [list, download]) {
    const res = response();
    await handler(req("/api/packs?lang=en", false), res);
    assert.equal(res.status, 401);
    assert.match(JSON.parse(res.payload).error, /password|demo/i);
  }
  assert.equal(databaseCalls, 0);
  assert.equal(limitCalls, 0);
});
test("authenticated pack list is an array in the selected language with no cache", async () => {
  const res = response();
  await list(req("/api/packs?lang=es"), res);
  assert.equal(res.status, 200);
  const data = JSON.parse(res.payload);
  assert.ok(Array.isArray(data));
  assert.equal(data.length, 2);
  assert.equal(data[0].locale, "es");
  assert.equal(data[0].title, "Hojas de cálculo fiables");
  assert.equal(res.headers["Cache-Control"], "private, no-store");
});
test("invalid method, parameters and unknown pack fail before loading archives", async () => {
  for (const [url, method, status] of [
    ["/api/pack-download?id=planilhas-confiaveis", "POST", 405],
    ["/api/pack-download?id=../../x", "GET", 400],
    ["/api/pack-download?id=unknown&lang=en", "GET", 404],
    ["/api/pack-download?id=planilhas-confiaveis&lang=fr", "GET", 400],
  ]) {
    const res = response();
    await download(req(url, true, method), res);
    assert.equal(res.status, status);
  }
  assert.equal(databaseCalls, 0);
  assert.equal(limitCalls, 0);
});
test("rate limiting returns localized error without fetching archives", async () => {
  rateError = Object.assign(
    new Error("Limite de tentativas atingido. Tente novamente em uma hora."),
    { status: 429 },
  );
  try {
    const res = response();
    await download(
      req("/api/pack-download?id=planilhas-confiaveis&lang=en"),
      res,
    );
    assert.equal(res.status, 429);
    assert.equal(databaseCalls, 0);
  } finally {
    rateError = null;
  }
});
test("storage failure reveals neither schema, credentials nor source content", async () => {
  dbError = Error("private-table password=never-display");
  try {
    const res = response();
    await download(
      req("/api/pack-download?id=planilhas-confiaveis&lang=es"),
      res,
    );
    assert.equal(res.status, 503);
    assert.match(JSON.parse(res.payload).error, /temporalmente/);
    assert.doesNotMatch(res.payload, /private-table|never-display/);
  } finally {
    dbError = null;
  }
});
test(
  "successful download headers match actual assembled bytes and corrupted data is refused",
  {
    skip: fs.existsSync(path.join(__dirname, "../.local/releases/1.2.0"))
      ? false
      : "Private archive fixtures unavailable",
  },
  async () => {
    const pack = getPack("planilhas-confiaveis", "en");
    rows = pack.steps.map((s) => ({
      skill_id: s.skillId,
      version: "1.2.0",
      archive: fs.readFileSync(
        path.join(__dirname, "../.local/releases/1.2.0", s.skillId + ".zip"),
      ),
      sha256: sourceReleases[s.skillId],
    }));
    const res = response();
    await download(
      req("/api/pack-download?id=planilhas-confiaveis&lang=en"),
      res,
    );
    assert.equal(res.status, 200);
    assert.equal(res.headers["X-Package-Version"], "1.0.0");
    assert.equal(res.headers["X-Package-SHA256"], sha256(res.payload));
    assert.equal(res.headers["Content-Length"], res.payload.length);
    assert.match(
      res.headers["Content-Disposition"],
      /planilhas-confiaveis-1\.0\.0-en\.zip/,
    );
    assert.equal(res.headers["Cache-Control"], "private, no-store");
    rows[0] = { ...rows[0], archive: Buffer.from(rows[0].archive) };
    rows[0].archive[0] ^= 1;
    const rejected = response();
    await download(
      req("/api/pack-download?id=planilhas-confiaveis&lang=en"),
      rejected,
    );
    assert.equal(rejected.status, 503);
    assert.equal(
      rejected.headers["Content-Type"],
      "application/json; charset=utf-8",
    );
  },
);
