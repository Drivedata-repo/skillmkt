const { requireAccess, requireSkill } = require("../lib/access.cjs");
const { send, failure, initializeLocale } = require("../lib/http.cjs");
const { db } = require("../lib/db.cjs");
const { limit } = require("../lib/limit.cjs");
const { officialGuide } = require("../lib/official-guides.cjs");
const skills = require("../data/skills.cjs");
const releases = require("../data/releases.cjs");
module.exports = async (req, res) => {
  initializeLocale(req, res);
  try {
    const access = await requireAccess(req);
    if (req.method !== "GET")
      return send(res, 405, { error: "Método não permitido." });
    const id = new URL(req.url, "https://local.invalid").searchParams.get("id");
    const skill = skills.find((x) => x.id === id);
    if (!skill) return send(res, 404, { error: "Skill não encontrada." });
    const guide = officialGuide(id);
    if (guide && !guide.packaged)
      return send(res, 403, {
        error: "Esta carta é entregue pela fonte oficial. Use o link indicado na carta.",
      });
    if (!guide) requireSkill(access, id);
    await limit(req, "demo-download", 150);
    const r = await db().query(
      "SELECT archive,sha256 FROM skillmkt.package_releases WHERE skill_id=$1 AND version=$2",
      [id, releases[id].version],
    );
    if (!r.rowCount)
      return send(res, 503, {
        error:
          "Este pacote ainda não está disponível. Tente novamente mais tarde.",
      });
    const { archive, sha256 } = r.rows[0];
    if (sha256 !== releases[id].sha256)
      throw new Error("Package integrity metadata mismatch");
    res.writeHead(200, {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${skill.code}-${skill.id}.zip"`,
      "Content-Length": archive.length,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Package-SHA256": sha256,
      "X-Package-Version": releases[id].version,
    });
    res.end(archive);
  } catch (e) {
    failure(res, e);
  }
};
