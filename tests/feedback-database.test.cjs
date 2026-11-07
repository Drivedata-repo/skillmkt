const { test } = require("node:test");
const assert = require("node:assert/strict");
test(
  "feedback accepts private writes and deduplicates while only aggregates are readable",
  { skip: !process.env.DATABASE_URL },
  async () => {
    const { db } = require("../lib/db.cjs");
    const client = await db().connect();
    try {
      await client.query("BEGIN");
      const key = require("node:crypto").randomBytes(32).toString("hex");
      const rights = await client.query(
        "SELECT has_table_privilege(current_user,'skillmkt.feedback_events','SELECT') AS read,has_table_privilege('anon','skillmkt.feedback_events','INSERT') AS anon_insert,has_function_privilege('anon','skillmkt.feedback_summary()','EXECUTE') AS anon_summary",
      );
      assert.deepEqual(rights.rows[0], {
        read: false,
        anon_insert: false,
        anon_summary: false,
      });
      const sql =
        "INSERT INTO skillmkt.feedback_events(session_key,kind,skill_id,outcome,reason,runtime,goal,tool,locale,release_version) VALUES($1,'feedback','claude-xlsx','resolved','none','codex','spreadsheets','excel',$2,'1.2.0') ON CONFLICT DO NOTHING";
      assert.equal((await client.query(sql, [key, "en"])).rowCount, 1);
      assert.equal((await client.query(sql, [key, "es"])).rowCount, 0);
      const rows = (
        await client.query("SELECT * FROM skillmkt.feedback_summary()")
      ).rows;
      assert.ok(
        rows.some(
          (r) =>
            r.skill_id === "claude-xlsx" &&
            r.locale === "en" &&
            Number(r.total) >= 1,
        ),
      );
      assert.ok(
        rows.every((r) => !("session_key" in r) && !("created_at" in r)),
      );
    } finally {
      await client.query("ROLLBACK");
      client.release();
      await db().end();
    }
  },
);
