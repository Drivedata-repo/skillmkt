const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const skills = require("../data/skills.cjs");
const { findSkills } = require("../lib/match.cjs");
const customer = require("./support/customer.cjs");
test("137 unique card codes, no local source paths", () => {
  assert.equal(skills.length, 184);
  assert.equal(new Set(skills.map((s) => s.code)).size, 184);
  assert.ok(!JSON.stringify(skills).match(/[CD]:\\|sourceManifest|AppData/));
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
test("catalog, downloads and recommendations require an account; app redirects to the account page", async () => {
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
  assert.equal(r.headers.Location, "/acesso");
});
test("download validates ID without filesystem traversal", async () => {
  const session = customer.install();
  const res = mock();
  await require("../api/download.js")(
    {
      headers: { cookie: session.cookie },
      method: "GET",
      url: "/api/download?id=../../.env.local",
    },
    res,
  );
  session.restore();
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
