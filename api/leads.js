const { body, send, failure } = require("../lib/http.cjs");
const { lead } = require("../lib/validation.cjs");
const { db } = require("../lib/db.cjs");
const { limit } = require("../lib/limit.cjs");
const { createHash } = require("node:crypto");
module.exports = async (req, res) => {
  try {
    const input = lead.parse(await body(req));
    await limit(req, "lead", 10);
    const { requestId, ...content } = input;
    const fingerprint = createHash("sha256")
      .update(JSON.stringify(content))
      .digest("hex");
    const r = await db().query(
      "INSERT INTO skillmkt.leads(request_id,fingerprint,name,email,company,phone,context,solutions,skill_ids) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(request_id) DO NOTHING RETURNING id",
      [
        requestId,
        fingerprint,
        input.name,
        input.email,
        input.company,
        input.phone,
        input.context,
        input.solutions,
        input.skillIds,
      ],
    );
    let id = r.rows[0]?.id;
    if (!id) {
      const prior = await db().query(
        "SELECT id,fingerprint FROM skillmkt.leads WHERE request_id=$1",
        [requestId],
      );
      if (prior.rows[0]?.fingerprint !== fingerprint)
        return send(res, 409, {
          error: "O briefing mudou. Atualize a página antes de um novo envio.",
        });
      id = prior.rows[0].id;
    }
    send(res, 200, { ok: true, reference: id });
  } catch (e) {
    failure(res, e);
  }
};
