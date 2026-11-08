const { body, send, failure, initializeLocale } = require("../lib/http.cjs");
const auth = require("../lib/auth.cjs");
const { limit } = require("../lib/limit.cjs");
const customerAuth = require("../lib/customer-auth.cjs");
const { hasSignedSession, demoEnabled } = require("../lib/access.cjs");
module.exports = async (req, res) => {
  initializeLocale(req, res);
  try {
    if (req.method === "GET")
      return send(res, 200, {
        authenticated: hasSignedSession(req),
        configured: auth.configured(),
      });
    const input = await body(req);
    if (input.action === "logout") {
      res.setHeader("Set-Cookie", [
        auth.cookie("", true),
        customerAuth.cookie("", true),
      ]);
      return send(res, 200, { ok: true });
    }
    if (!demoEnabled())
      return send(res, 403, { error: "A demonstração foi encerrada." });
    if (!auth.configured())
      return send(res, 503, {
        error: "O acesso à demonstração ainda não foi configurado.",
      });
    if (typeof input.password !== "string" || input.password.length > 256)
      return send(res, 400, { error: "Informe a senha da demonstração." });
    await limit(req, "demo-login", 25);
    if (!(await auth.verifyPassword(input.password)))
      return send(res, 401, {
        error: "Senha incorreta. Confira a senha compartilhada com você.",
      });
    res.setHeader("Set-Cookie", auth.cookie(auth.issue()));
    return send(res, 200, { ok: true });
  } catch (e) {
    failure(res, e);
  }
};
