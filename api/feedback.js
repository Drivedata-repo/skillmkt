const { requireSession } = require("../lib/auth.cjs");
const { send, body, failure, initializeLocale } = require("../lib/http.cjs");
const { db } = require("../lib/db.cjs");
const { limit } = require("../lib/limit.cjs");
const {
  validateFeedback,
  sessionKey,
  adminAllowed,
} = require("../lib/feedback.cjs");
module.exports = async (req, res) => {
  initializeLocale(req, res);
  try {
    requireSession(req);
    if (req.method === "GET") {
      if (!adminAllowed(req))
        return send(res, 403, { error: "Acesso ao painel não autorizado." });
      const data = await db().query(
        "SELECT * FROM skillmkt.feedback_summary()",
      );
      return send(res, 200, {
        rows: data.rows,
        windowDays: 90,
        unit: "sessions",
        containsPersonalData: false,
      });
    }
    const item = validateFeedback(await body(req));
    await limit(req, "deck-feedback", 90);
    const version = item.skillId
      ? require("../data/releases.cjs")[item.skillId].version
      : "catalog";
    await db().query(
      `INSERT INTO skillmkt.feedback_events(session_key,kind,skill_id,outcome,reason,runtime,goal,tool,locale,release_version)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT DO NOTHING`,
      [
        sessionKey(req),
        item.kind,
        item.skillId || "",
        item.outcome,
        item.reason,
        item.runtime,
        item.goal,
        item.tool,
        res.deckLocale,
        version,
      ],
    );
    return send(res, 200, {
      message: "Avaliação recebida. Obrigado por ajudar a melhorar o Deck.",
    });
  } catch (error) {
    failure(res, error);
  }
};
