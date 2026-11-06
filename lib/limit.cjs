const { createHmac } = require("node:crypto");
const { db } = require("./db.cjs");
async function limit(req, scope, max) {
  if (!process.env.RATE_LIMIT_SECRET)
    throw new Error("Missing rate-limit configuration");
  const ip = process.env.VERCEL
    ? req.headers["x-vercel-forwarded-for"] || "unknown"
    : req.socket.remoteAddress;
  const bucket = Math.floor(Date.now() / 3600000);
  const key = createHmac("sha256", process.env.RATE_LIMIT_SECRET)
    .update(scope + ":" + bucket + ":" + ip)
    .digest("hex");
  const r = await db().query(
    "INSERT INTO skillmkt.rate_limits(key,count,expires_at) VALUES($1,1,now()+interval '1 hour') ON CONFLICT(key) DO UPDATE SET count=skillmkt.rate_limits.count+1 RETURNING count",
    [key],
  );
  if (r.rows[0].count > max)
    throw Object.assign(
      new Error("Limite de tentativas atingido. Tente novamente em uma hora."),
      { status: 429 },
    );
  await db().query(
    "DELETE FROM skillmkt.rate_limits WHERE key IN (SELECT key FROM skillmkt.rate_limits WHERE expires_at<now() LIMIT 100)",
  );
}
module.exports = { limit };
