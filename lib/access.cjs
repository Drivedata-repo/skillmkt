"use strict";
const auth = require("./auth.cjs");
const customerAuth = require("./customer-auth.cjs");
const { skillsForProducts } = require("./commerce.cjs");

const DEMO_MESSAGE = "Entre com a senha da demonstração.";
const CUSTOMER_MESSAGE = "Entre com o e-mail e a senha da sua compra.";
const NOT_OWNED = "Esta carta não faz parte das suas compras.";

// A demo continua igual até DEMO_ENABLED=false, no lançamento.
const demoEnabled = () => process.env.DEMO_ENABLED !== "false";
const demoSession = (req) => demoEnabled() && auth.authenticated(req);

// Só a assinatura do cookie, sem banco. Serve para decidir o redirecionamento.
const hasSignedSession = (req) => demoSession(req) || Boolean(customerAuth.fromRequest(req));

function defaultRun() {
  const { db } = require("./db.cjs");
  return (sql, values) => db().query(sql, values);
}

async function resolveAccess(req, run) {
  if (demoSession(req)) return { kind: "demo" };
  const claims = customerAuth.fromRequest(req);
  if (!claims) return null;
  const result = await (run || defaultRun())(
    `SELECT c.email,c.session_version,
       COALESCE(array_agg(e.product_key) FILTER (WHERE e.product_key IS NOT NULL),'{}') AS products
     FROM skillmkt.customers c
     LEFT JOIN skillmkt.entitlements e ON e.customer_id=c.id AND e.revoked_at IS NULL
     WHERE c.id=$1 GROUP BY c.email,c.session_version`,
    [claims.customerId],
  );
  const row = result.rows[0];
  // Trocar a senha muda session_version e derruba as sessões antigas.
  if (!row || row.session_version !== claims.sessionVersion) return null;
  return {
    kind: "customer",
    customerId: claims.customerId,
    email: row.email,
    products: row.products,
    skillIds: skillsForProducts(row.products),
  };
}

async function requireAccess(req, run) {
  const access = await resolveAccess(req, run);
  if (!access)
    throw Object.assign(new Error(demoEnabled() ? DEMO_MESSAGE : CUSTOMER_MESSAGE), {
      status: 401,
    });
  return access;
}

const allowsSkill = (access, id) => access.kind === "demo" || access.skillIds.has(id);

function requireSkill(access, id) {
  if (!allowsSkill(access, id))
    throw Object.assign(new Error(NOT_OWNED), { status: 403 });
}

function requireSkills(access, ids) {
  for (const id of ids) requireSkill(access, id);
}

const INCLUDED_LABEL = { pt: "Incluída na sua compra", en: "Included in your purchase", es: "Incluida en tu compra" };

function restrictCatalog(catalog, access, locale) {
  if (access.kind === "demo") return catalog;
  const owned = (id) => access.skillIds.has(id);
  const label = INCLUDED_LABEL[locale] || INCLUDED_LABEL.pt;
  return {
    ...catalog,
    mode: "customer",
    skills: catalog.skills
      .filter((skill) => owned(skill.id) || skill.officialGuide)
      .map((skill) => ({
        ...skill,
        pricing: skill.pricing && !skill.officialGuide ? { ...skill.pricing, demoLabel: label } : skill.pricing,
      })),
    journeys: catalog.journeys.filter((j) => j.steps.every((step) => owned(step.id))),
    combos: catalog.combos.filter((c) => c.skillIds.every(owned)),
    packs: catalog.packs.filter((p) => p.steps.every((step) => owned(step.skillId))),
  };
}

function restrictPacks(packs, access) {
  if (access.kind === "demo") return packs;
  return packs.filter((p) => p.steps.every((step) => access.skillIds.has(step.skillId)));
}

// Triagem de comprador só indica o que ele pode abrir.
function restrictTriage(result, access) {
  if (access.kind === "demo") return result;
  const owned = (id) => access.skillIds.has(id);
  return {
    ...result,
    matches: (result.matches || []).filter((m) => owned(m.id)),
    candidateIds: (result.candidateIds || []).filter(owned),
    plan: result.plan?.steps?.every((step) => owned(step.skillId)) ? result.plan : null,
  };
}

module.exports = {
  demoEnabled,
  demoSession,
  hasSignedSession,
  resolveAccess,
  requireAccess,
  allowsSkill,
  requireSkill,
  requireSkills,
  restrictCatalog,
  restrictPacks,
  restrictTriage,
};
