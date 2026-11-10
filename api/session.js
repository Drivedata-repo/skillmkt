const { body, send, failure, initializeLocale } = require("../lib/http.cjs");
const customerAuth = require("../lib/customer-auth.cjs");
const { hasSignedSession } = require("../lib/access.cjs");
// Entrar e criar conta ficam em /api/account/login e /api/account/register.
// Aqui só se consulta a sessão e se sai.
module.exports = async (req, res) => {
  initializeLocale(req, res);
  try {
    if (req.method === "GET")
      return send(res, 200, {
        authenticated: hasSignedSession(req),
        configured: customerAuth.configured(),
      });
    const input = await body(req);
    if (input.action === "logout") {
      res.setHeader("Set-Cookie", customerAuth.cookie("", true));
      return send(res, 200, { ok: true });
    }
    return send(res, 400, { error: "Ação inválida." });
  } catch (e) {
    failure(res, e);
  }
};
