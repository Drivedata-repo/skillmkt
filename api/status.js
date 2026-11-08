const { requireAccess } = require("../lib/access.cjs");
const { send, failure, initializeLocale } = require("../lib/http.cjs");
module.exports = async (req, res) => {
  const locale = initializeLocale(req, res);
  try {
    const access = await requireAccess(req);
    send(res, 200, {
      aiConfigured: !!process.env.GROQ_API_KEY,
      mode: access.kind === "demo" ? "demo" : "customer",
      locale,
    });
  } catch (e) {
    failure(res, e);
  }
};
