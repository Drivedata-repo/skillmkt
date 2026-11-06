const { getLocale, translateError } = require("./locale.cjs");
function initializeLocale(req, res) {
  res.deckLocale = getLocale(req);
  return res.deckLocale;
}
function send(res, status, data) {
  const locale = res.deckLocale || "pt";
  const translated = { ...data };
  for (const key of ["error", "message", "notice"])
    if (typeof translated[key] === "string")
      translated[key] = translateError(translated[key], locale);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Language": locale === "pt" ? "pt-BR" : locale,
  });
  res.end(JSON.stringify(translated));
}
async function body(req) {
  if (req.method !== "POST")
    throw Object.assign(new Error("Método não permitido."), { status: 405 });
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && new URL(origin).host !== host)
    throw Object.assign(new Error("Origem não permitida."), { status: 403 });
  if (!String(req.headers["content-type"]).startsWith("application/json"))
    throw Object.assign(new Error("Envie JSON."), { status: 415 });
  if (req.body) {
    if (Buffer.byteLength(JSON.stringify(req.body)) > 16384)
      throw Object.assign(new Error("Dados muito longos."), { status: 413 });
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (Buffer.byteLength(raw) > 16384)
      throw Object.assign(new Error("Dados muito longos."), { status: 413 });
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error("JSON inválido."), { status: 400 });
  }
}
function failure(res, e) {
  if (e.name === "ZodError")
    return send(res, 400, {
      error: "Confira os campos obrigatórios e seus limites.",
    });
  send(res, e.status || 503, {
    error: e.status
      ? e.message
      : "Serviço temporariamente indisponível. Tente novamente em instantes.",
  });
}
module.exports = { send, body, failure, initializeLocale };
