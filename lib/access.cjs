"use strict";
const customerAuth = require("./customer-auth.cjs");
const { skillsForProducts } = require("./commerce.cjs");
const saleCatalog = require("./sale-catalog.cjs");
const { officialGuide } = require("./official-guides.cjs");

const LOGIN_MESSAGE = "Entre ou crie a sua conta.";
const NOT_OWNED = "Esta carta não faz parte das suas compras.";

// Só a assinatura do cookie, sem banco. Serve para decidir o redirecionamento.
const hasSignedSession = (req) => Boolean(customerAuth.fromRequest(req));

function defaultRun() {
  const { db } = require("./db.cjs");
  return (sql, values) => db().query(sql, values);
}

// Quem tem conta entra, mesmo sem ter comprado. O que cada um pode usar vem das compras.
async function resolveAccess(req, run) {
  const claims = customerAuth.fromRequest(req);
  if (!claims) return null;
  const result = await (run || defaultRun())(
    `SELECT c.email,c.name,c.session_version,
       COALESCE(array_agg(e.product_key) FILTER (WHERE e.product_key IS NOT NULL),'{}') AS products
     FROM skillmkt.customers c
     LEFT JOIN skillmkt.entitlements e ON e.customer_id=c.id AND e.revoked_at IS NULL
     WHERE c.id=$1 GROUP BY c.email,c.name,c.session_version`,
    [claims.customerId],
  );
  const row = result.rows[0];
  // Trocar a senha muda session_version e derruba as sessões antigas.
  if (!row || row.session_version !== claims.sessionVersion) return null;
  return {
    kind: "customer",
    customerId: claims.customerId,
    email: row.email,
    name: row.name || "",
    products: row.products,
    skillIds: skillsForProducts(row.products),
  };
}

async function requireAccess(req, run) {
  const access = await resolveAccess(req, run);
  if (!access) throw Object.assign(new Error(LOGIN_MESSAGE), { status: 401 });
  return access;
}

const allowsSkill = (access, id) => access.skillIds.has(id);
// Ver não é usar: toda conta enxerga o que tem e o que está à venda.
const canSee = (access, id) =>
  access.skillIds.has(id) || saleCatalog.sellable("card:" + id) || Boolean(officialGuide(id));

function requireSkill(access, id) {
  if (!allowsSkill(access, id))
    throw Object.assign(new Error(NOT_OWNED), { status: 403 });
}

function requireSkills(access, ids) {
  for (const id of ids) requireSkill(access, id);
}

const COPY = {
  pt: {
    included: "Incluída na sua compra",
    available: "Disponível para compra",
    value: "Valor da carta",
    combo: "Valor do combo",
    notice: "Valor em dólares americanos.",
  },
  en: {
    included: "Included in your purchase",
    available: "Available to buy",
    value: "Card value",
    combo: "Combo value",
    notice: "Value in US dollars.",
  },
  es: {
    included: "Incluida en tu compra",
    available: "Disponible para comprar",
    value: "Valor de la carta",
    combo: "Valor del combo",
    notice: "Valor en dólares estadounidenses.",
  },
};

// Antes de comprar a pessoa vê o que a carta faz e quanto custa, mas não o que usa para trabalhar.
function lockedCopy(skill) {
  const scenario = skill.universe?.scenario;
  return {
    ...skill,
    firstPrompt: "",
    acceptance: [],
    example: null,
    universe: scenario
      ? {
          ...skill.universe,
          scenario: Object.fromEntries(
            Object.entries(scenario).map(([key, value]) => [
              key,
              key === "title" || key === "context" ? value : Array.isArray(value) ? [] : typeof value === "string" ? "" : value,
            ]),
          ),
        }
      : skill.universe,
  };
}

const sellableCard = (id) => saleCatalog.sellable("card:" + id);

function restrictCatalog(catalog, access, locale) {
  const owned = (id) => access.skillIds.has(id);
  const visible = (skill) => Boolean(skill.officialGuide) || sellableCard(skill.id);
  const copy = COPY[locale] || COPY.pt;
  return {
    ...catalog,
    mode: "customer",
    skills: catalog.skills.filter(visible).map((skill) => {
      if (skill.officialGuide) return { ...skill, owned: true };
      const mine = owned(skill.id);
      const base = mine ? skill : lockedCopy(skill);
      return {
        ...base,
        owned: mine,
        pricing: skill.pricing
          ? { ...skill.pricing, label: copy.value, demoLabel: mine ? copy.included : copy.available, notice: copy.notice, basis: "" }
          : skill.pricing,
      };
    }),
    journeys: catalog.journeys.filter((j) => j.steps.every((step) => visible({ id: step.id }) || sellableCard(step.id))),
    combos: catalog.combos
      .filter((c) => saleCatalog.sellable("combo:" + c.id))
      .map((c) => {
        const mine = c.skillIds.every(owned);
        return { ...c, owned: mine, buyKey: "combo:" + c.id, label: copy.combo, demoLabel: mine ? copy.included : copy.available };
      }),
    packs: catalog.packs.filter((p) => p.steps.every((step) => owned(step.skillId))),
  };
}

function restrictPacks(packs, access) {
  return packs.filter((p) => p.steps.every((step) => access.skillIds.has(step.skillId)));
}

// A triagem ajuda a escolher o que comprar: indica só o que está à venda ou é grátis.
function restrictTriage(result, access) {
  const ok = (id) => canSee(access, id);
  return {
    ...result,
    matches: (result.matches || []).filter((m) => ok(m.id)),
    candidateIds: (result.candidateIds || []).filter(ok),
    plan: result.plan?.steps?.every((step) => ok(step.skillId)) ? result.plan : null,
  };
}

module.exports = {
  hasSignedSession,
  resolveAccess,
  requireAccess,
  allowsSkill,
  canSee,
  requireSkill,
  requireSkills,
  restrictCatalog,
  restrictPacks,
  restrictTriage,
};
