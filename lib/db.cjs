const { Pool } = require("pg");
let pool;
function db() {
  if (!process.env.DATABASE_URL) throw new Error("Database unavailable");
  return (pool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: true,
      ca: require("node:fs").readFileSync(
        require("node:path").join(__dirname, "../certs/supabase-ca.crt"),
        "utf8",
      ),
    },
    max: 2,
    connectionTimeoutMillis: 7000,
    idleTimeoutMillis: 10000,
  }));
}
async function transaction(work) {
  const client = await db().connect();
  try {
    await client.query("BEGIN");
    const result = await work((sql, values) => client.query(sql, values));
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
module.exports = { db, transaction };
