const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
test("signup persists the validated request language rather than arbitrary form values", async (t) => {
  const writes = [];
  t.mock.method(require("../lib/db.cjs"), "db", () => ({
    query: async (sql, params) => {
      writes.push({ sql, params });
      return { rowCount: 1 };
    },
  }));
  t.mock.method(require("../lib/limit.cjs"), "limit", async () => {});
  const handler = require("../api/waitlist.js");
  for (const locale of ["en", "es", "invalid"]) {
    const req = {
      url: "/api/waitlist?lang=" + locale,
      method: "POST",
      headers: { "content-type": "application/json" },
      body: {
        name: "Locale QA",
        email: "qa@example.invalid",
        audience: "business",
        interest: "explore",
        consent: true,
        locale: "untrusted",
      },
    };
    const res = {
      writeHead(status) {
        this.status = status;
      },
      end(body) {
        this.body = body;
      },
    };
    await handler(req, res);
    assert.equal(res.status, 202);
    assert.match(writes.at(-1).sql, /preferred_language/);
    assert.equal(
      writes.at(-1).params.at(-1),
      locale === "invalid" ? "pt" : locale,
    );
  }
});
test(
  "waitlist runtime can store allowed languages while records remain unreadable",
  { skip: !process.env.DATABASE_URL },
  async () => {
    const pool = require("../lib/db.cjs").db();
    const client = await pool.connect();
    try {
      const rights = await client.query(
        "SELECT has_table_privilege(current_user,'skillmkt.waitlist','SELECT') AS can_read,has_column_privilege(current_user,'skillmkt.waitlist','preferred_language','INSERT') AS can_store_language",
      );
      assert.deepEqual(rights.rows[0], {
        can_read: false,
        can_store_language: true,
      });
      await client.query("BEGIN");
      const sql =
        "INSERT INTO skillmkt.waitlist(name,email,audience,interest,consent_version,preferred_language) VALUES('Locale QA',$1,'business','explore','2026-11-06',$2)";
      for (const language of ["pt", "en", "es"]) {
        const result = await client.query(sql, [
          `qa-locale-${crypto.randomUUID()}@example.invalid`,
          language,
        ]);
        assert.equal(result.rowCount, 1);
      }
      await assert.rejects(
        client.query(sql, [
          `qa-locale-${crypto.randomUUID()}@example.invalid`,
          "fr",
        ]),
        (error) => error.code === "23514",
      );
    } finally {
      await client.query("ROLLBACK");
      client.release();
      await pool.end();
    }
  },
);
