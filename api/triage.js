const { body, send, failure, initializeLocale } = require("../lib/http.cjs");
const { requireAccess, restrictTriage } = require("../lib/access.cjs");
const { limit } = require("../lib/limit.cjs");
const { findSkills, analyzeSkills } = require("../lib/match.cjs");
module.exports = async (req, res) => {
  const locale = initializeLocale(req, res);
  try {
    const access = await requireAccess(req);
    const raw = await body(req);
    if (
      typeof raw.problem !== "string" ||
      raw.problem.trim().length < 12 ||
      raw.problem.length > 2000 ||
      !["business", "technical"].includes(raw.audience)
    )
      return send(res, 400, {
        error: "Descreva seu problema com 12 a 2.000 caracteres.",
      });
    const result = restrictTriage(
      findSkills(
        raw.problem,
        raw.audience,
        raw.refinement || null,
        locale,
        raw.profile,
      ),
      access,
    );
    const { candidateIds, ...publicResult } = result;
    if (
      raw.useAI === true &&
      process.env.GROQ_API_KEY &&
      result.matches.length
    ) {
      await limit(req, "demo-ai", 15);
      try {
        return send(
          res,
          200,
          await analyzeSkills(raw.problem, raw.audience, result, locale),
        );
      } catch {
        return send(res, 200, {
          ...publicResult,
          notice:
            "A IA não respondeu. As indicações usam as capacidades do catálogo.",
        });
      }
    }
    return send(res, 200, publicResult);
  } catch (e) {
    failure(res, e);
  }
};
