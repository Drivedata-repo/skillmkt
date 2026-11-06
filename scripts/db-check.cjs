const { db } = require("../lib/db.cjs");
(async () => {
  try {
    const r = await db().query(
      "SELECT current_user, count(id)::int AS visible_records FROM skillmkt.leads",
    );
    console.log(r.rows);
    console.log("Database connected with TLS verification.");
  } catch (e) {
    console.error("Database check failed:", e.code || "connection unavailable");
    process.exitCode = 1;
  } finally {
    await db().end();
  }
})();
