"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const { getPack, sha256 } = require("../lib/packs.cjs");
const { sourceReleases } = require("../data/packs.cjs");
const releases = require("../data/releases.cjs");
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
      query: async (sql) => {
        // A consulta de acesso da conta não conta como acesso ao armazenamento dos pacotes.
        if (/FROM skillmkt\.customers c/.test(sql))
          return { rows: [{ email: "t@example.com", name: "T", session_version: 1, products: ["combo:power-bi-sob-controle"] }] };
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
process.env.CUSTOMER_SESSION_SECRET = "isolated-pack-session-test-secret-000000000";
delete process.env.VERCEL;
const customerAuth = require("../lib/customer-auth.cjs"),
  list = require("../api/packs.js"),
  download = require("../api/pack-download.js");
function req(url, authenticated = true, method = "GET") {
  return {
    url,
    method,
    headers: { cookie: authenticated ? "deck_customer=" + customerAuth.issue({ id: "11111111-2222-4333-8444-555555555555", sessionVersion: 1 }) : "" },
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
test("both APIs require an account before returning catalog or touching storage", async () => {
  for (const handler of [list, download]) {
    const res = response();
    await handler(req("/api/packs?lang=en", false), res);
    assert.equal(res.status, 401);
    assert.match(JSON.parse(res.payload).error, /account/i);
  }
  assert.equal(databaseCalls, 0);
  assert.equal(limitCalls, 0);
});
test("a buyer sees only the packs whose cards were all bought, in the selected language, with no cache", async () => {
  const res = response();
  await list(req("/api/packs?lang=es"), res);
  assert.equal(res.status, 200);
  const data = JSON.parse(res.payload);
  assert.ok(Array.isArray(data));
  assert.equal(data.length, 1);
  assert.equal(data[0].id, "power-bi-sob-controle");
  assert.equal(data[0].locale, "es");
  assert.equal(data[0].title, getPack("power-bi-sob-controle", "es").title);
  assert.equal(res.headers["Cache-Control"], "private, no-store");
});
test("invalid method, parameters and unknown pack fail before loading archives", async () => {
  for (const [url, method, status] of [
    ["/api/pack-download?id=power-bi-sob-controle", "POST", 405],
    ["/api/pack-download?id=../../x", "GET", 400],
    ["/api/pack-download?id=unknown&lang=en", "GET", 404],
    ["/api/pack-download?id=power-bi-sob-controle&lang=fr", "GET", 400],
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
      req("/api/pack-download?id=power-bi-sob-controle&lang=en"),
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
      req("/api/pack-download?id=power-bi-sob-controle&lang=es"),
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
    skip: getPack("power-bi-sob-controle", "en").steps.every((s) =>
      fs.existsSync(path.join(__dirname, "../.local/releases", releases[s.skillId].version, s.skillId + ".zip")),
    )
      ? false
      : "Private archive fixtures unavailable",
  },
  async () => {
    const pack = getPack("power-bi-sob-controle", "en");
    rows = pack.steps.map((s) => ({
      skill_id: s.skillId,
      version: releases[s.skillId].version,
      archive: fs.readFileSync(
        path.join(__dirname, "../.local/releases", releases[s.skillId].version, s.skillId + ".zip"),
      ),
      sha256: sourceReleases[s.skillId],
    }));
    const res = response();
    await download(
      req("/api/pack-download?id=power-bi-sob-controle&lang=en"),
      res,
    );
    assert.equal(res.status, 200);
    assert.equal(res.headers["X-Package-Version"], "1.0.0");
    assert.equal(res.headers["X-Package-SHA256"], sha256(res.payload));
    assert.equal(res.headers["Content-Length"], res.payload.length);
    assert.match(
      res.headers["Content-Disposition"],
      /power-bi-sob-controle-1\.0\.0-en\.zip/,
    );
    assert.equal(res.headers["Cache-Control"], "private, no-store");
    rows[0] = { ...rows[0], archive: Buffer.from(rows[0].archive) };
    rows[0].archive[0] ^= 1;
    const rejected = response();
    await download(
      req("/api/pack-download?id=power-bi-sob-controle&lang=en"),
      rejected,
    );
    assert.equal(rejected.status, 503);
    assert.equal(
      rejected.headers["Content-Type"],
      "application/json; charset=utf-8",
    );
  },
);
