const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const skills = require("../data/skills.cjs");
const auth = require("../lib/auth.cjs"),
  { findSkills } = require("../lib/match.cjs");
const salt = crypto.randomBytes(16).toString("hex");
const testPassword = "unit-test-only-" + crypto.randomUUID();
process.env.DEMO_PASSWORD_HASH =
  salt + ":" + crypto.scryptSync(testPassword, salt, 64).toString("hex");
process.env.DEMO_SESSION_SECRET = crypto.randomBytes(32).toString("hex");
test("137 unique card codes, no local source paths", () => {
  assert.equal(skills.length, 184);
  assert.equal(new Set(skills.map((s) => s.code)).size, 184);
  assert.ok(!JSON.stringify(skills).match(/[CD]:\\|sourceManifest|AppData/));
});
test("password is checked on server and signed sessions expire or reject tampering", async () => {
  assert.ok(await auth.verifyPassword(testPassword));
  assert.ok(!(await auth.verifyPassword("wrong")));
  const now = Date.now(),
    token = auth.issue(now);
  assert.ok(auth.valid(token, now));
  assert.ok(!auth.valid(token + "x", now));
  assert.ok(!auth.valid(token, now + 9 * 3600000));
  const hash = process.env.DEMO_PASSWORD_HASH;
  process.env.DEMO_PASSWORD_HASH = hash.replace(
    /.$/,
    hash.endsWith("0") ? "1" : "0",
  );
  assert.ok(!auth.valid(token, now));
  process.env.DEMO_PASSWORD_HASH = hash;
});
test("missing auth configuration fails closed", () => {
  const secret = process.env.DEMO_SESSION_SECRET;
  delete process.env.DEMO_SESSION_SECRET;
  assert.equal(auth.valid("anything"), false);
  assert.throws(() => auth.issue());
  process.env.DEMO_SESSION_SECRET = secret;
});
test("production cookie is HttpOnly, Secure and host-only", () => {
  const original = process.env.VERCEL;
  process.env.VERCEL = "1";
  const cookie = auth.cookie("test");
  assert.match(cookie, /^__Host-drive_demo=/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Strict/);
  assert.match(cookie, /; Secure/);
  assert.ok(!cookie.includes("Domain="));
  if (original === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = original;
});
function mock() {
  return {
    status: 0,
    headers: {},
    writeHead(s, h) {
      this.status = s;
      this.headers = h || {};
    },
    setHeader(k, v) {
      this.headers[k] = v;
    },
    end(b) {
      this.body = b;
    },
  };
}
test("catalog, downloads and recommendations require login; app redirects", async () => {
  for (const route of ["catalog", "download", "triage"]) {
    const res = mock();
    await require("../api/" + route + ".js")(
      { headers: {}, method: "GET", url: "/api/" + route },
      res,
    );
    assert.equal(res.status, 401, route);
  }
  const r = mock();
  require("../api/app.js")({ headers: {} }, r);
  assert.equal(r.status, 303);
  assert.equal(r.headers.Location, "/login");
});
test("download validates ID without filesystem traversal", async () => {
  const res = mock();
  await require("../api/download.js")(
    {
      headers: { cookie: auth.cookie(auth.issue()).split(";")[0] },
      method: "GET",
      url: "/api/download?id=../../.env.local",
    },
    res,
  );
  assert.equal(res.status, 404);
});
test("known problems lead to skills, unrelated problems do not get invented answers", () => {
  assert.equal(
    findSkills(
      "Meu relatório Power BI está lento e quero otimizar minhas medidas DAX.",
    ).matches[0].id,
    "power-bi-modelagem-dax-performance",
  );
  assert.equal(
    findSkills(
      "Preciso automatizar planilhas Excel e documentos repetitivos da minha equipe.",
    ).matches[0].id,
    "automacao-documentos-office",
  );
  assert.equal(
    findSkills("Preciso plantar flores na varanda").matches.length,
    0,
  );
  for (const m of findSkills(
    "Quero criar um servidor MCP com autenticação e integrações",
    "technical",
  ).matches)
    assert.ok(skills.some((s) => s.id === m.id));
});
test(
  "database packages are present, valid ZIPs, hash-checked and private",
  { skip: !process.env.DATABASE_URL },
  async () => {
    const { db } = require("../lib/db.cjs"),
      { unzipSync } = require("fflate");
    try {
      const r = await db().query(
        "SELECT skill_id,archive,sha256,file_count FROM skillmkt.packages",
      );
      assert.equal(r.rowCount, 137);
      for (const p of r.rows) {
        assert.equal(
          crypto.createHash("sha256").update(p.archive).digest("hex"),
          p.sha256,
        );
        const files = unzipSync(p.archive);
        assert.ok(files[p.skill_id + "/SKILL.md"]);
        assert.ok(files["COMO-USAR.md"]);
        assert.equal(Object.keys(files).length, p.file_count);
      }
      const rights = await db().query(
        "SELECT has_table_privilege('anon','skillmkt.packages','SELECT') AS anonymous,has_table_privilege(current_user,'skillmkt.packages','INSERT') AS writable",
      );
      assert.equal(rights.rows[0].anonymous, false);
      assert.equal(rights.rows[0].writable, false);
    } finally {
      await db().end();
    }
  },
);
