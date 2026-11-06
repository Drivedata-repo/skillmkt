const { requireSession } = require("../lib/auth.cjs");
const { send, failure } = require("../lib/http.cjs");
module.exports = (req, res) => {
  try {
    requireSession(req);
    send(res, 200, { aiConfigured: !!process.env.GROQ_API_KEY, mode: "demo" });
  } catch (e) {
    failure(res, e);
  }
};
