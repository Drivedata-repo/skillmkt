const { body, send, failure, initializeLocale } = require("../lib/http.cjs");
const { db, transaction } = require("../lib/db.cjs");
const { limit } = require("../lib/limit.cjs");
const commerce = require("../lib/commerce.cjs");
const stripe = require("../lib/stripe.cjs");
const fx = require("../lib/fx.cjs");
const customerAuth = require("../lib/customer-auth.cjs");
const mailer = require("../lib/mailer.cjs");
const access = require("../lib/access.cjs");
const catalog = require("../lib/sale-catalog.cjs");

// Uma função só: o plano da Vercel limita a quantidade de funções por projeto.
const run = (sql, values) => db().query(sql, values);
const GENERIC_LOGIN = "E-mail ou senha incorretos.";
const REQUEST_SENT =
  "Se houver uma compra aprovada neste e-mail, enviamos um link para criar sua senha.";

const ensureConfigured = () => {
  if (!customerAuth.configured())
    throw Object.assign(new Error("O acesso de clientes ainda não foi configurado."), {
      status: 503,
    });
};

async function hasActiveEntitlement(customerId) {
  const r = await run(
    "SELECT 1 FROM skillmkt.entitlements WHERE customer_id=$1 AND revoked_at IS NULL LIMIT 1",
    [customerId],
  );
  return r.rowCount > 0;
}

async function webhook(req, res) {
  const payload = await commerce.readWebhookBody(req);
  if (!commerce.hottokValid(req, payload))
    return send(res, 401, { error: "Token inválido." });
  const result = await transaction((tx) => commerce.processEvent(payload, tx));
  if (result.notify) {
    const mail = await mailer.sendAccessEmail(result.notify);
    if (!mail.sent) console.error("commerce.mail_failed", mail.reason);
  }
  return send(res, 200, { ok: true, outcome: result.outcome });
}

// Pagamento recebido: a assinatura confere o corpo exato; só depois o evento é lido.
async function stripeWebhook(req, res) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (secret.length < 16) return send(res, 503, { error: "Webhook ainda não configurado." });
  const raw = await commerce.readRawBody(req);
  if (!stripe.verifySignature(raw, req.headers["stripe-signature"], secret))
    return send(res, 400, { error: "Assinatura inválida." });
  const result = await transaction((tx) => stripe.processEvent(commerce.parseJson(raw), tx));
  if (result.notify) {
    const mail = await mailer.sendAccessEmail(result.notify);
    if (!mail.sent) console.error("commerce.mail_failed", mail.reason);
  }
  return send(res, 200, { ok: true, outcome: result.outcome });
}

// O catálogo é em dólar. Quem está no Brasil paga em reais, pela cotação do dia;
// se não houver cotação confiável, cai para o dólar em vez de errar o valor.
async function quoteFor(req) {
  const country = fx.countryOf(req);
  const quote = country === "BR" ? await fx.getRate() : null;
  return { country, quote };
}

async function rate(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Método não permitido." });
  const { country, quote } = await quoteFor(req);
  return send(res, 200, {
    country,
    currency: quote ? "brl" : "usd",
    rate: quote ? quote.rate : null,
    asOf: quote ? quote.asOf : null,
    // Sem a chave do Stripe, a página mostra "Em breve" em vez de um botão que falha.
    payments: stripe.configured(),
  });
}

async function checkout(req, res) {
  const input = await body(req);
  await limit(req, "checkout", 20);
  const { quote } = await quoteFor(req);
  const session = await stripe.createCheckout(input, run, {
    currency: quote ? "brl" : "usd",
    rate: quote ? quote.rate : null,
  });
  return send(res, 200, { url: session.url });
}

async function login(req, res) {
  ensureConfigured();
  const input = await body(req);
  const email = customerAuth.normalizeEmail(input.email);
  await limit(req, "customer-login", 25);
  const found = email
    ? await run(
        "SELECT id,password_hash,session_version FROM skillmkt.customers WHERE email=$1",
        [email],
      )
    : { rows: [] };
  const customer = found.rows[0];
  if (!(await customerAuth.verifyPassword(input.password, customer?.password_hash)))
    return send(res, 401, { error: GENERIC_LOGIN });
  if (!(await hasActiveEntitlement(customer.id)))
    return send(res, 403, { error: "Não encontramos acesso ativo para este e-mail." });
  res.setHeader(
    "Set-Cookie",
    customerAuth.cookie(
      customerAuth.issue({ id: customer.id, sessionVersion: customer.session_version }),
    ),
  );
  return send(res, 200, { ok: true });
}

async function requestAccess(req, res) {
  const input = await body(req);
  const email = customerAuth.normalizeEmail(input.email);
  await limit(req, "customer-request-access", 8);
  if (email) {
    const found = await run(
      `SELECT c.id,c.name,c.password_hash IS NOT NULL AS has_password,
         (SELECT count(*)::int FROM skillmkt.access_tokens t
          WHERE t.customer_id=c.id AND t.created_at>now()-interval '1 hour') AS recent
       FROM skillmkt.customers c WHERE c.email=$1`,
      [email],
    );
    const customer = found.rows[0];
    if (customer && customer.recent < 3 && (await hasActiveEntitlement(customer.id))) {
      const purpose = customer.has_password ? "reset" : "first-access";
      const token = await customerAuth.createAccessToken(run, customer.id, purpose);
      const mail = await mailer.sendAccessEmail({ email, name: customer.name, token, purpose });
      if (!mail.sent) console.error("commerce.mail_failed", mail.reason);
    }
  }
  // Mesma resposta sempre, para não revelar quem comprou.
  return send(res, 200, { ok: true, message: REQUEST_SENT });
}

async function setPassword(req, res) {
  ensureConfigured();
  const input = await body(req);
  if (typeof input.token !== "string" || !/^[a-f0-9]{64}$/.test(input.token))
    return send(res, 400, { error: "Este link não é válido. Peça um novo." });
  if (!customerAuth.validPassword(input.password))
    return send(res, 400, { error: "Use uma senha com 10 a 256 caracteres." });
  await limit(req, "customer-set-password", 20);
  const passwordHash = await customerAuth.hashPassword(input.password);
  const customer = await transaction(async (tx) => {
    const used = await tx(
      `UPDATE skillmkt.access_tokens SET used_at=now()
       WHERE token_hash=$1 AND used_at IS NULL AND expires_at>now() RETURNING customer_id`,
      [customerAuth.hashToken(input.token)],
    );
    if (!used.rowCount) return null;
    const id = used.rows[0].customer_id;
    await tx(
      "UPDATE skillmkt.access_tokens SET used_at=now() WHERE customer_id=$1 AND used_at IS NULL",
      [id],
    );
    const updated = await tx(
      `UPDATE skillmkt.customers SET password_hash=$2,session_version=session_version+1,updated_at=now()
       WHERE id=$1 RETURNING id,session_version`,
      [id, passwordHash],
    );
    return updated.rows[0];
  });
  if (!customer)
    return send(res, 400, { error: "Este link expirou ou já foi usado. Peça um novo." });
  res.setHeader(
    "Set-Cookie",
    customerAuth.cookie(
      customerAuth.issue({ id: customer.id, sessionVersion: customer.session_version }),
    ),
  );
  return send(res, 200, { ok: true });
}

async function me(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Método não permitido." });
  const current = await access.resolveAccess(req);
  if (!current || current.kind !== "customer")
    return send(res, 401, { error: "Entre com o e-mail e a senha da sua compra." });
  return send(res, 200, {
    email: current.email,
    products: current.products
      .map((key) => catalog.get(key))
      .filter(Boolean)
      .map((p) => ({ key: p.key, title: p.title })),
    cards: current.skillIds.size,
  });
}

const routes = {
  webhook,
  "stripe-webhook": stripeWebhook,
  checkout,
  rate,
  login,
  "request-access": requestAccess,
  "set-password": setPassword,
  me,
};

// Sem leitor automático de JSON: o Stripe exige o corpo bruto para conferir a assinatura.
// As demais rotas leem o corpo pelo fluxo (lib/http.cjs).
const handler = async (req, res) => {
  initializeLocale(req, res);
  try {
    const route = new URL(req.url, "http://local.invalid").searchParams.get("route");
    const handler = Object.hasOwn(routes, route || "") ? routes[route] : null;
    if (!handler) return send(res, 404, { error: "Rota não encontrada." });
    return await handler(req, res);
  } catch (error) {
    if (!error.status) console.error("commerce.failure", error.message);
    return failure(res, error);
  }
};

module.exports = handler;
module.exports.config = { api: { bodyParser: false } };
