const { authenticated } = require("../lib/auth.cjs");
const { getLocale } = require("../lib/locale.cjs");
const fs = require("node:fs"),
  path = require("node:path");
module.exports = (req, res) => {
  const locale = getLocale(req);
  if (!authenticated(req)) {
    const original = new URL(req.url, "https://deck.invalid");
    const next = require("../dist/navigation.js").appPath(
      "/app" + original.search,
    );
    const params = new URLSearchParams();
    if (locale !== "pt") params.set("lang", locale);
    if (next !== "/app") params.set("next", next);
    res.writeHead(303, {
      Location: "/login" + (params.size ? "?" + params.toString() : ""),
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
