const { requireSession } = require("../lib/auth.cjs");
const { send, failure, initializeLocale } = require("../lib/http.cjs");
module.exports = (req, res) => {
  const locale = initializeLocale(req, res);
  try {
    requireSession(req);
    if (req.method !== "GET")
      return send(res, 405, { error: "Método não permitido." });
    const { skills, journeys } = require("../lib/catalog.cjs");
    const { localizeCatalog } = require("../lib/catalog-i18n.cjs");
    const {
      assessCompatibility,
      validateContext,
      runtimeOptions,
      capabilityOptions,
    } = require("../lib/compatibility.cjs");
    const { getLab } = require("../lib/lab.cjs");
    const params = new URL(req.url, "http://localhost").searchParams;
    let availability = {};
    try {
      if (params.has("availability"))
        availability = JSON.parse(params.get("availability"));
    } catch {
      throw Object.assign(
        new Error("Escolha filtros válidos para refinar sua necessidade."),
        { status: 400 },
      );
    }
    const context = validateContext(
      params.get("runtime") || "any",
      availability,
    );
    const catalog = localizeCatalog({ skills, journeys }, locale);
    send(res, 200, {
      ...catalog,
      packs: require("../lib/packs.cjs").getPacks(locale),
      skills: catalog.skills.map((skill) => ({
        ...skill,
        compatibilityAssessment: assessCompatibility(skill, context, locale),
        lab: getLab(skill, locale),
      })),
      runtimeOptions: runtimeOptions(locale),
      capabilityOptions: capabilityOptions(locale),
      compatibilityContext: context,
      mode: "demo",
      edition:
        new Set(skills.map((skill) => skill.version)).size === 1
          ? skills[0].version
          : "mixed",
      locale,
      originalsLanguage: "mixed",
      triageOptions: require("../lib/triage-profile.cjs").options(locale),
    });
  } catch (e) {
    failure(res, e);
  }
};
