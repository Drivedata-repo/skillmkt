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
    send(res, 200, {
      ...localizeCatalog({ skills, journeys }, locale),
      mode: "demo",
      edition: "1.1.0",
      locale,
      originalsLanguage: "mixed",
      triageOptions: require("../lib/triage-profile.cjs").options(locale),
    });
  } catch (e) {
    failure(res, e);
  }
};
