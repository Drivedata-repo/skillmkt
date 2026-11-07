const { requireSession } = require("../lib/auth.cjs");
const { send, failure, initializeLocale } = require("../lib/http.cjs");
const { db } = require("../lib/db.cjs");
const { limit } = require("../lib/limit.cjs");
const {
  getPack,
  loadPackArchives,
  buildPackArchive,
  validatePackQuery,
  packMessage,
} = require("../lib/packs.cjs");
module.exports = async (req, res) => {
  const locale = initializeLocale(req, res);
  try {
    requireSession(req);
    if (req.method !== "GET")
      return send(res, 405, { error: "Método não permitido." });
    if (!validatePackQuery(req, true))
      return send(res, 400, { error: packMessage("invalid", locale) });
    const id = new URL(req.url, "https://local.invalid").searchParams.get("id"),
      pack = getPack(id, locale);
    if (!pack)
      return send(res, 404, { error: packMessage("notFound", locale) });
    await limit(req, "demo-pack-download", 30);
    const archives = await loadPackArchives(pack, (sql, values) =>
      db().query(sql, values),
    );
    const result = buildPackArchive(pack, archives);
    res.writeHead(200, {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Content-Length": result.archive.length,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Language": locale === "pt" ? "pt-BR" : locale,
      "X-Package-SHA256": result.sha256,
      "X-Package-Version": result.version,
    });
    res.end(result.archive);
  } catch (e) {
    if (e.status) return failure(res, e);
    return send(res, 503, { error: packMessage("unavailable", locale) });
  }
};
