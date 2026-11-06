const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
test(
  "real database: insert, retry, altered retry and restricted reads; rolled back",
  { skip: !process.env.DATABASE_URL },
  async () => {
    const mod = require("../lib/db.cjs"),
      pool = mod.db(),
      client = await pool.connect();
    const old = mod.db;
    mod.db = () => client;
    delete require.cache[require.resolve("../api/leads.js")];
    delete require.cache[require.resolve("../lib/limit.cjs")];
    const handler = require("../api/leads.js");
    try {
      await client.query("BEGIN");
      const input = {
        requestId: crypto.randomUUID(),
        name: "QA transacional",
        email: "qa@example.invalid",
        company: "Teste automatizado",
        context: {
          audience: "business",
          pain: "Teste automatizado de triagem para relatórios de Power BI",
          area: "dados",
        },
        solutions: ["bi"],
        skillIds: ["automacao-documentos-office"],
        consent: true,
      };
      const invoke = async (body) => {
        let status, data;
        const req = {
          method: "POST",
          headers: { host: "localhost", "content-type": "application/json" },
          body,
          socket: { remoteAddress: "qa-transaction" },
        };
        await handler(req, {
          writeHead(s) {
            status = s;
          },
          end(x) {
            data = JSON.parse(x);
          },
        });
        return { status, data };
      };
      const a = await invoke(input),
        b = await invoke(input);
      assert.equal(a.status, 200);
      assert.equal(a.data.reference, b.data.reference);
      assert.equal((await invoke({ ...input, name: "Changed" })).status, 409);
      await client.query("SAVEPOINT permissions");
      await assert.rejects(
        client.query("SELECT email FROM skillmkt.leads"),
        (e) => e.code === "42501",
      );
      await client.query("ROLLBACK TO SAVEPOINT permissions");
      const r = await client.query(
        "SELECT count(id)::int n FROM skillmkt.leads WHERE request_id=$1",
        [input.requestId],
      );
      assert.equal(r.rows[0].n, 1);
    } finally {
      await client.query("ROLLBACK");
      mod.db = old;
      client.release();
      await pool.end();
    }
  },
);
