const { body, send, failure } = require("../lib/http.cjs");
const { context } = require("../lib/validation.cjs");
const { fallback, analyze } = require("../lib/triage.cjs");
const { limit } = require("../lib/limit.cjs");
module.exports = async (req, res) => {
  try {
    const raw = await body(req);
    const input = context.parse(raw.context);
    if (raw.aiConsent !== true || !process.env.GROQ_API_KEY)
      return send(res, 200, fallback(input));
    await limit(req, "ai", 12);
    try {
      return send(res, 200, await analyze(input));
    } catch {
      return send(res, 200, {
        ...fallback(input),
        notice: "A IA está indisponível; usamos os temas do catálogo.",
      });
    }
  } catch (e) {
    failure(res, e);
  }
};
