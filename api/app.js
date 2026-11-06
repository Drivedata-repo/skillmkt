const { authenticated } = require("../lib/auth.cjs");
const fs = require("node:fs"),
  path = require("node:path");
module.exports = (req, res) => {
  if (!authenticated(req)) {
    res.writeHead(303, { Location: "/login", "Cache-Control": "no-store" });
    return res.end();
  }
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex, nofollow",
  });
  res.end(
    fs.readFileSync(path.join(__dirname, "../views/market.html"), "utf8"),
  );
};
