const { requireSession } = require("../lib/auth.cjs");
const { send, failure, initializeLocale } = require("../lib/http.cjs");
module.exports = (req, res) => {
  const locale = initializeLocale(req, res);
  try {
    requireSession(req);
    send(res, 200, {
      aiConfigured: !!process.env.GROQ_API_KEY,
      mode: "demo",
      locale,
    });
  } catch (e) {
    failure(res, e);
  }
};
