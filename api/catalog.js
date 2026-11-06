const { requireSession } = require("../lib/auth.cjs");
const { send, failure } = require("../lib/http.cjs");
module.exports = (req, res) => {
  try {
    requireSession(req);
    if (req.method !== "GET")
      return send(res, 405, { error: "Método não permitido." });
    send(res, 200, { skills: require("../data/skills.cjs"), mode: "demo" });
  } catch (e) {
    failure(res, e);
  }
};
