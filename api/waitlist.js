const { body, send, failure } = require("../lib/http.cjs");
const { validateWaitlist } = require("../lib/waitlist.cjs");
const { limit } = require("../lib/limit.cjs");
const { db } = require("../lib/db.cjs");
module.exports = async (req, res) => {
  try {
    const raw = await body(req);
    const input = validateWaitlist(raw);
    if (input.website)
      return send(res, 202, {
        ok: true,
        message: "Recebemos sua solicitação.",
      });
    await limit(req, "waitlist", 5);
    await db().query(
      "INSERT INTO skillmkt.waitlist(name,email,audience,interest,consent_version) VALUES($1,$2,$3,$4,'2026-11-06') ON CONFLICT DO NOTHING",
      [input.name, input.email, input.audience, input.interest],
    );
    return send(res, 202, {
      ok: true,
      message:
        "Você está na lista. Seu interesse foi registrado; não há cobrança nem reserva de compra.",
    });
  } catch (e) {
    failure(res, e);
  }
};
