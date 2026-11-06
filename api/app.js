const { authenticated } = require("../lib/auth.cjs");
const { getLocale } = require("../lib/locale.cjs");
const fs = require("node:fs"),
  path = require("node:path");
module.exports = (req, res) => {
  const locale = getLocale(req);
  if (!authenticated(req)) {
    res.writeHead(303, {
      Location: "/login" + (locale === "pt" ? "" : "?lang=" + locale),
      "Cache-Control": "no-store",
    });
    return res.end();
  }
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex, nofollow",
    "Content-Language": { pt: "pt-BR", en: "en", es: "es" }[locale],
  });
  res.end(
    fs.readFileSync(path.join(__dirname, "../views/market.html"), "utf8"),
  );
};
