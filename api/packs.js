const { requireSession } = require("../lib/auth.cjs");
const { send, failure, initializeLocale } = require("../lib/http.cjs");
const {
  getPacks,
  validatePackQuery,
  packMessage,
} = require("../lib/packs.cjs");
module.exports = (req, res) => {
  const locale = initializeLocale(req, res);
  try {
    requireSession(req);
    if (req.method !== "GET")
      return send(res, 405, { error: "Método não permitido." });
    if (!validatePackQuery(req))
      return send(res, 400, { error: packMessage("invalid", locale) });
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Language": locale === "pt" ? "pt-BR" : locale,
    });
    res.end(JSON.stringify(getPacks(locale)));
  } catch (e) {
    failure(res, e);
  }
};
