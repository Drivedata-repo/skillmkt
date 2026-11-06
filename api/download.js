const { requireSession } = require("../lib/auth.cjs");
const { send, failure } = require("../lib/http.cjs");
const { db } = require("../lib/db.cjs");
const { limit } = require("../lib/limit.cjs");
const skills = require("../data/skills.cjs");
module.exports = async (req, res) => {
  try {
    requireSession(req);
    if (req.method !== "GET")
      return send(res, 405, { error: "Método não permitido." });
    const id = new URL(req.url, "https://local.invalid").searchParams.get("id");
    const skill = skills.find((x) => x.id === id);
    if (!skill) return send(res, 404, { error: "Skill não encontrada." });
    await limit(req, "demo-download", 150);
    const r = await db().query(
      "SELECT archive,sha256 FROM skillmkt.packages WHERE skill_id=$1",
      [id],
    );
    if (!r.rowCount)
      return send(res, 503, {
        error:
          "Este pacote ainda não está disponível. Tente novamente mais tarde.",
      });
    const { archive, sha256 } = r.rows[0];
    res.writeHead(200, {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${skill.code}-${skill.id}.zip"`,
      "Content-Length": archive.length,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Package-SHA256": sha256,
    });
    res.end(archive);
  } catch (e) {
    failure(res, e);
  }
};
