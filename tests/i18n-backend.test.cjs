const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { getLocale, translateError } = require("../lib/locale.cjs");
const { findSkills } = require("../lib/match.cjs");
const auth = require("../lib/auth.cjs");

const salt = crypto.randomBytes(16).toString("hex");
process.env.DEMO_PASSWORD_HASH = `${salt}:${crypto.scryptSync(crypto.randomUUID(), salt, 64).toString("hex")}`;
process.env.DEMO_SESSION_SECRET = crypto.randomBytes(32).toString("hex");

function response() {
  return {
    status: 0,
    headers: {},
    writeHead(status, headers) {
      this.status = status;
      Object.assign(this.headers, headers);
    },
    setHeader(key, value) {
      this.headers[key] = value;
    },
    end(body) {
      this.body = body;
    },
  };
}
function request(
  locale,
  { authenticated = false, body, method = "GET", path = "/" } = {},
) {
  return {
    url: `${path}?lang=${locale}`,
    method,
    headers: {
      "content-type": "application/json",
      ...(authenticated
        ? { cookie: auth.cookie(auth.issue()).split(";")[0] }
        : {}),
    },
    ...(body === undefined ? {} : { body }),
  };
}

test("locale selection is allowlisted, explicit and isolated per request", () => {
  assert.equal(
    getLocale({
      url: "/?lang=en",
      headers: { "x-deck-language": "es", cookie: "deck_locale=pt" },
    }),
    "en",
  );
  assert.equal(
    getLocale({
      url: "/",
      headers: { "x-deck-language": "es", cookie: "deck_locale=en" },
    }),
    "es",
  );
  assert.equal(
    getLocale({ headers: { cookie: "other=x; deck_locale=en; last=y" } }),
    "en",
  );
  assert.equal(getLocale({ headers: { cookie: "deck_locale=%ZZ" } }), "pt");
  assert.equal(
    getLocale({ url: "/?lang=invalid", headers: { "x-deck-language": "en" } }),
    "pt",
  );
  assert.equal(
    getLocale({ headers: { "x-deck-language": ["en", "es"] } }),
    "pt",
  );
  assert.equal(getLocale({}), "pt");
});

test("protected APIs keep authentication requirements and localize failures", async () => {
  for (const locale of ["en", "es"]) {
    for (const name of ["catalog", "download", "triage", "status"]) {
      const res = response();
      await require(`../api/${name}.js`)(request(locale), res);
      assert.equal(res.status, 401);
      assert.equal(res.headers["Content-Language"], locale);
      assert.equal(
        JSON.parse(res.body).error,
        translateError("Entre com a senha da demonstração.", locale),
      );
    }
  }
  const res = response();
  await require("../api/status.js")(request("pt"), res);
  assert.equal(
    JSON.parse(res.body).error,
    "Entre com a senha da demonstração.",
  );
});

test("waitlist validation and non-persisted bot response use the selected language", async () => {
  const handler = require("../api/waitlist.js");
  const input = {
    name: "QA test",
    email: "qa@example.invalid",
    audience: "business",
    interest: "explore",
    consent: false,
  };
  for (const locale of ["en", "es"]) {
    const bad = response();
    await handler(request(locale, { method: "POST", body: input }), bad);
    assert.equal(bad.status, 400);
    assert.equal(
      JSON.parse(bad.body).error,
      translateError("Confira os campos obrigatórios e seus limites.", locale),
    );
    const bot = response();
    await handler(
      request(locale, {
        method: "POST",
        body: { ...input, consent: true, website: "test" },
      }),
      bot,
    );
    assert.equal(bot.status, 202);
    assert.equal(
      JSON.parse(bot.body).message,
      translateError("Recebemos sua solicitação.", locale),
    );
  }
});

test("localized catalogs preserve IDs, checksums and permissions metadata", async () => {
  const original = require("../lib/catalog.cjs");
  for (const locale of ["en", "es"]) {
    const res = response();
    await require("../api/catalog.js")(
      request(locale, { authenticated: true }),
      res,
    );
    assert.equal(res.status, 200);
    const result = JSON.parse(res.body);
    assert.equal(result.locale, locale);
    assert.equal(result.skills.length, 184);
    assert.deepEqual(
      result.skills.map((skill) => skill.id),
      original.skills.map((skill) => skill.id),
    );
    assert.notEqual(result.skills[0].title, original.skills[0].title);
    result.skills.forEach((skill, i) => {
      assert.equal(skill.release.sha256, original.skills[i].release.sha256);
      assert.equal(skill.release.executionTested, false);
      assert.equal(skill.release.commercialCleared, false);
    });
  }
});

test("English and Spanish tasks recommend relevant skills without an AI provider", () => {
  const cases = [
    [
      "en",
      "My Power BI report is slow and I need to optimize DAX measures",
      "power-bi-modelagem-dax-performance",
    ],
    [
      "es",
      "Mi informe de Power BI es lento y necesito optimizar las medidas DAX",
      "power-bi-modelagem-dax-performance",
    ],
    [
      "en",
      "I need to automate repetitive Excel spreadsheets and documents",
      "automacao-documentos-office",
    ],
    [
      "es",
      "Necesito automatizar hojas de cálculo Excel y documentos repetitivos",
      "automacao-documentos-office",
    ],
    [
      "en",
      "I need an interactive prototype to validate my idea and screens",
      "prototipos-e-especificacao-funcional",
    ],
    [
      "es",
      "Quiero un prototipo navegable para validar mi idea y las pantallas",
      "prototipos-e-especificacao-funcional",
    ],
  ];
  for (const [locale, text, id] of cases) {
    const result = findSkills(text, "business", null, locale);
    assert.equal(result.clarification, null, text);
    assert.equal(result.matches[0]?.id, id, text);
    assert.equal(
      result.summary,
      translateError(
        "Estas skills têm capacidades relacionadas à sua tarefa. Confira os requisitos antes de começar.",
        locale,
      ),
    );
    assert.match(
      result.matches[0].nextStep,
      locale === "en" ? /^Start with:/ : /^Empieza con:/,
    );
  }
  assert.equal(
    findSkills("I want to plant flowers on my balcony", "business", null, "en")
      .matches.length,
    0,
  );
  assert.equal(
    findSkills("Quiero plantar flores en mi balcón", "business", null, "es")
      .matches.length,
    0,
  );
});

test("localized clarifications preserve stable refinement IDs and refine the answer", () => {
  for (const [locale, text] of [
    ["en", "I need help with my spreadsheets"],
    ["es", "Necesito ayuda con mis hojas de cálculo"],
  ]) {
    const vague = findSkills(text, "business", null, locale);
    assert.equal(vague.clarification.id, "spreadsheets");
    assert.equal(vague.matches.length, 0);
    assert.notEqual(
      vague.clarification.question,
      "Qual parte das planilhas você quer resolver primeiro?",
    );
    const result = findSkills(
      text,
      "business",
      { questionId: "spreadsheets", optionId: "formulas" },
      locale,
    );
    assert.equal(result.clarification, null);
    assert.equal(result.matches[0].id, "claude-xlsx");
  }
});

test("invalid localized refinement returns an actionable translated API error", async () => {
  const res = response();
  await require("../api/triage.js")(
    request("es", {
      method: "POST",
      authenticated: true,
      body: {
        problem: "Necesito ayuda con mis hojas de cálculo",
        audience: "business",
        refinement: { questionId: "bi", optionId: "numbers" },
      },
    }),
    res,
  );
  assert.equal(res.status, 400);
  assert.equal(
    JSON.parse(res.body).error,
    "Elige una de las opciones sugeridas para este problema.",
  );
});
