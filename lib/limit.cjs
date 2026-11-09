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
// Limite por identidade (pessoa, IP ou "all" para o teto global) e janela livre.
// Reaproveita skillmkt.rate_limits: a chave é um HMAC, então não guarda quem é a pessoa.
// `run` permite testar sem banco.
async function limitBy(identity, scope, max, windowMs, deps = {}) {
  if (!process.env.RATE_LIMIT_SECRET)
    throw new Error("Missing rate-limit configuration");
  const run = deps.run || ((sql, values) => db().query(sql, values));
  const bucket = Math.floor(Date.now() / windowMs);
  const key = createHmac("sha256", process.env.RATE_LIMIT_SECRET)
    .update(scope + ":" + bucket + ":" + identity)
    .digest("hex");
  const r = await run(
    "INSERT INTO skillmkt.rate_limits(key,count,expires_at) VALUES($1,1,now()+make_interval(secs => $2)) ON CONFLICT(key) DO UPDATE SET count=skillmkt.rate_limits.count+1 RETURNING count",
    [key, Math.ceil(windowMs / 1000)],
  );
  if (r.rows[0].count > max)
    throw Object.assign(
      new Error("Limite do chat atingido. Tente novamente mais tarde."),
      { status: 429 },
    );
  await run(
    "DELETE FROM skillmkt.rate_limits WHERE key IN (SELECT key FROM skillmkt.rate_limits WHERE expires_at<now() LIMIT 100)",
  );
}
module.exports = { limit, limitBy };
