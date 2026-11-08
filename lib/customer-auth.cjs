"use strict";
const crypto = require("node:crypto");
const { promisify } = require("node:util");
const scrypt = promisify(crypto.scrypt);

const AGE = 7 * 24 * 60 * 60;
const TOKEN_HOURS = { "first-access": 72, reset: 2 };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const configured = () => (process.env.CUSTOMER_SESSION_SECRET || "").length >= 32;
const cookieName = () => (process.env.VERCEL ? "__Host-deck_customer" : "deck_customer");

function equal(a, b) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function normalizeEmail(value) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

const validPassword = (value) =>
  typeof value === "string" && value.length >= 10 && value.length <= 256;

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return salt + ":" + (await scrypt(password, salt, 64)).toString("hex");
}

// Sem conta o custo do scrypt é o mesmo, para o tempo não revelar quem comprou.
const DUMMY = "0".repeat(32) + ":" + "0".repeat(128);
async function verifyPassword(password, stored) {
  if (typeof password !== "string" || password.length > 256) return false;
  const [salt, hash] = (stored || DUMMY).split(":");
  const matched = equal((await scrypt(password, salt, 64)).toString("hex"), hash);
  return Boolean(stored) && matched;
}

function signature(body) {
  return crypto
    .createHmac("sha256", process.env.CUSTOMER_SESSION_SECRET)
    .update(body)
    .digest("base64url");
}

function issue({ id, sessionVersion }, now = Date.now()) {
  if (!configured()) throw new Error("Customer session not configured");
  const expiry = Math.floor(now / 1000) + AGE;
  const body = `c1.${id}.${sessionVersion}.${expiry}.${crypto.randomBytes(12).toString("hex")}`;
  return body + "." + signature(body);
}

function parse(token, now = Date.now()) {
  if (!configured() || typeof token !== "string" || token.length > 300) return null;
  const parts = token.split(".");
  if (
    parts.length !== 6 ||
    parts[0] !== "c1" ||
    !UUID.test(parts[1]) ||
    !/^\d{1,9}$/.test(parts[2]) ||
    !/^\d{10}$/.test(parts[3]) ||
    !/^[a-f0-9]{24}$/.test(parts[4])
  )
    return null;
  const expiry = Number(parts[3]),
    time = Math.floor(now / 1000);
  if (expiry <= time || expiry > time + AGE) return null;
  if (!equal(signature(parts.slice(0, 5).join(".")), parts[5])) return null;
  return { customerId: parts[1], sessionVersion: Number(parts[2]) };
}

function readCookie(req) {
  return String(req.headers.cookie || "")
    .split(";")
    .map((x) => x.trim().split("="))
    .find((x) => x[0] === cookieName())?.[1];
}

const fromRequest = (req) => parse(readCookie(req));

function cookie(token, clear = false) {
  return `${cookieName()}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear ? 0 : AGE}${process.env.VERCEL ? "; Secure" : ""}`;
}

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// O e-mail leva o token; o banco guarda só o hash.
async function createAccessToken(run, customerId, purpose) {
  const token = crypto.randomBytes(32).toString("hex");
  await run(
    `INSERT INTO skillmkt.access_tokens(token_hash,customer_id,purpose,expires_at)
     VALUES($1,$2,$3,now()+make_interval(hours => $4::int))`,
    [hashToken(token), customerId, purpose, TOKEN_HOURS[purpose]],
  );
  return token;
}

module.exports = {
  configured,
  cookieName,
  normalizeEmail,
  validPassword,
  hashPassword,
  verifyPassword,
  issue,
  parse,
  readCookie,
  fromRequest,
  cookie,
  hashToken,
  createAccessToken,
};
