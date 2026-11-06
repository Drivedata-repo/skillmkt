const { requireSession } = require("../lib/auth.cjs");
const { send, failure } = require("../lib/http.cjs");
module.exports = (req, res) => {
  try {
    requireSession(req);
    if (req.method !== "GET")
      return send(res, 405, { error: "Método não permitido." });
    const { skills, journeys } = require("../lib/catalog.cjs");
    send(res, 200, { skills, journeys, mode: "demo", edition: "1.1.0" });
  } catch (e) {
    failure(res, e);
  }
};
