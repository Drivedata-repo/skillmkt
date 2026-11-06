const crypto = require("node:crypto");
const { promisify } = require("node:util");
const scrypt = promisify(crypto.scrypt);
const AGE = 8 * 60 * 60;
function configured() {
  return (
    /^[a-f0-9]{32}:[a-f0-9]{128}$/.test(process.env.DEMO_PASSWORD_HASH || "") &&
    (process.env.DEMO_SESSION_SECRET || "").length >= 32
  );
}
function signature(value) {
  return crypto
    .createHmac("sha256", process.env.DEMO_SESSION_SECRET)
    .update(value + ":" + process.env.DEMO_PASSWORD_HASH)
    .digest("base64url");
}
function equal(a, b) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
async function verifyPassword(password) {
  if (!configured() || typeof password !== "string" || password.length > 256)
    return false;
  const [salt, hash] = process.env.DEMO_PASSWORD_HASH.split(":");
  return equal((await scrypt(password, salt, 64)).toString("hex"), hash);
}
function issue(now = Date.now()) {
  if (!configured()) throw new Error("Demo not configured");
  const body = `1.${Math.floor(now / 1000) + AGE}.${crypto.randomBytes(16).toString("hex")}`;
  return body + "." + signature(body);
}
function valid(token, now = Date.now()) {
  if (!configured() || typeof token !== "string" || token.length > 256)
    return false;
  const parts = token.split(".");
  if (
    parts.length !== 4 ||
    parts[0] !== "1" ||
    !/^\d{10}$/.test(parts[1]) ||
    !/^[a-f0-9]{32}$/.test(parts[2])
  )
    return false;
  const expiry = Number(parts[1]),
    time = Math.floor(now / 1000);
  return (
    expiry > time &&
    expiry <= time + AGE &&
    equal(signature(parts.slice(0, 3).join(".")), parts[3])
  );
}
function cookieName() {
  return process.env.VERCEL ? "__Host-drive_demo" : "drive_demo";
}
function authenticated(req) {
  const pairs = String(req.headers.cookie || "")
    .split(";")
    .map((x) => x.trim().split("="));
  const token = pairs.find((x) => x[0] === cookieName())?.[1];
  return valid(token);
}
function cookie(token, clear = false) {
  return `${cookieName()}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${clear ? 0 : AGE}${process.env.VERCEL ? "; Secure" : ""}`;
}
function requireSession(req) {
  if (!authenticated(req))
    throw Object.assign(new Error("Entre com a senha da demonstração."), {
      status: 401,
    });
}
module.exports = {
  configured,
  verifyPassword,
  issue,
  valid,
  cookie,
  authenticated,
  requireSession,
};
