"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const catalog = require("../lib/catalog.cjs");
const translations = require("../data/i18n/catalog-text.json");
const { localizeCatalog } = require("../lib/catalog-i18n.cjs");
const { run } = require("../lib/example-reference.cjs");

function walk(value, visit, path = "catalog") {
  visit(value, path);
  if (Array.isArray(value))
    value.forEach((child, index) => walk(child, visit, `${path}.${index}`));
  else if (value && typeof value === "object")
    Object.entries(value).forEach(([key, child]) =>
      walk(child, visit, `${path}.${key}`),
    );
}

function deepFreeze(value) {
  if (value && typeof value === "object") {
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
  }
  return value;
}

// Exemptions describe data contracts, not arbitrary untranslated prose. New text
// fields fail coverage unless an authored pair is supplied. Proper names and
// intentionally untidy product codes in the cleanup fixture remain unchanged.
const fixtureIdentifiers = new Set([
  "Aurora",
  "Norte",
  "Ana",
  "Bruno",
  "A",
  "B",
  "  alfa ",
  "ALFA",
  "beta ",
  "BETA",
]);
const toolNames = new Set([
  "Python",
  "Node.js",
  "Power BI",
  "Figma",
  "LibreOffice / Office",
  "H1",
]);

function technicalString(value, path) {
  return (
    value === "" ||
    // The passport is a language-neutral data contract, tested independently.
    /^catalog\.skills\.\d+\.identity\./.test(path) ||
    /\.(?:id|skillId|kind|code|variantOf|version|sha256)$/.test(path) ||
    /\.release\.(?:format|review)$/.test(path) ||
    /\.release\.(?:sourceReview|distribution|sourcePolicy)$/.test(path) ||
    /\.release\.changes\.\d+\.path$/.test(path) ||
    /^[a-f0-9]{64}$/.test(value) ||
    /^catalog\.skills\.\d+\.(?:role|audience)$/.test(path) ||
    /^catalog\.journeys\.\d+\.audience$/.test(path) ||
    /\.(?:offers|licenseFiles)\.\d+$/.test(path) ||
    /^(?:https?:\/\/|=)/.test(value) ||
    /^\d{4}-\d{2}-\d{2}$/.test(value) ||
    /^\d+(?:[.,]\d+)*$/.test(value) ||
    /^P\d+$/.test(value) ||
    /^[^\s]+\.(?:png|svg|json|md|txt|csv|xlsx|docx|pptx|pdf)$/i.test(value) ||
    fixtureIdentifiers.has(value) ||
    toolNames.has(value)
  );
}

function generatedString(path) {
  // Universe narratives have a dedicated, exhaustive path/locale contract test.
  return (
    /^catalog\.skills\.\d+\.(?:firstPrompt|acceptance\.\d+)$/.test(path) ||
    /^catalog\.skills\.\d+\.universe\./.test(path)
    // Pricing and collectible attributes have exhaustive locale/number tests.
    || /^catalog\.skills\.\d+\.(?:pricing|game)\./.test(path)
  );
}

function assertSameContract(source, localized, path = "catalog") {
  if (Array.isArray(source)) {
    assert.ok(Array.isArray(localized), `${path} must remain an array`);
    assert.equal(
      localized.length,
      source.length,
      `${path} array length changed`,
    );
    source.forEach((item, index) =>
      assertSameContract(item, localized[index], `${path}.${index}`),
    );
    return;
  }
  if (source && typeof source === "object") {
    const expected = Object.keys(source).sort();
    const actual = Object.keys(localized)
      .filter(
        (key) =>
          !(key === "categoryKey" && /^catalog\.skills\.\d+$/.test(path)),
      )
      .sort();
    assert.deepEqual(actual, expected, `${path} schema keys changed`);
    for (const [key, value] of Object.entries(source))
      assertSameContract(value, localized[key], `${path}.${key}`);
    return;
  }
  assert.equal(typeof localized, typeof source, `${path} type changed`);
  if (typeof source !== "string" || technicalString(source, path))
    assert.equal(
      localized,
      source,
      `${path} identifier, numeric fact or executable value changed`,
    );
}

test("every catalog translation has exactly two nonempty language entries", () => {
  assert.ok(Object.keys(translations).length >= 1080);
  for (const [source, pair] of Object.entries(translations)) {
    assert.ok(source.trim(), "Empty source phrase");
    assert.ok(Array.isArray(pair), source);
    assert.equal(pair.length, 2, source);
    for (const [index, translated] of pair.entries()) {
      assert.equal(typeof translated, "string", `${source} language ${index}`);
      assert.ok(translated.trim(), `${source} language ${index} is blank`);
      assert.doesNotMatch(
        translated,
        /^(?:TODO|TRANSLATE|__MISSING__)$/i,
        source,
      );
      const numbers = (text) =>
        (text.match(/\d+(?:[.,]\d+)*/g) || []).map((number) =>
          number.replaceAll(",", "."),
        );
      assert.deepEqual(
        numbers(translated),
        numbers(source),
        `${source} language ${index} changed a numerical claim`,
      );
    }
  }
});

test("all catalog prose is covered, including new fields in examples, releases and journeys", () => {
  let checked = 0;
  walk(catalog, (value, path) => {
    if (
      typeof value !== "string" ||
      technicalString(value, path) ||
      generatedString(path)
    )
      return;
    assert.ok(
      Object.hasOwn(translations, value),
      `${path}: missing authored translation for ${JSON.stringify(value)}`,
    );
    checked++;
  });
  assert.ok(
    checked > 2000,
    "The coverage check must include the complete catalog, not just titles",
  );
  for (const [locale, index] of [
    ["en", 0],
    ["es", 1],
  ]) {
    const localized = localizeCatalog(catalog, locale);
    const leaves = new Map();
    walk(localized, (value, path) => {
      if (typeof value === "string") leaves.set(path, value);
    });
    walk(catalog, (value, path) => {
      if (
        typeof value !== "string" ||
        technicalString(value, path) ||
        generatedString(path)
      )
        return;
      assert.equal(
        leaves.get(path),
        translations[value][index],
        `${locale} ${path} fell back or selected the wrong translation`,
      );
      // January has the same abbreviation in Portuguese and English.
      if (locale === "en" && !(value === "Jan" && /\.month$/.test(path)))
        assert.notEqual(
          leaves.get(path),
          value,
          `${path} left Portuguese display copy unchanged`,
        );
    });
  }
});

test("localization preserves schema, all identities and numerical facts without mutating its source", () => {
  const source = deepFreeze(structuredClone(catalog));
  const before = JSON.stringify(source);
  assert.strictEqual(localizeCatalog(source, "pt"), source);
  assert.strictEqual(localizeCatalog(source, "pt-BR"), source);
  assert.strictEqual(localizeCatalog(source, "unsupported"), source);
  for (const locale of ["en", "es"]) {
    const localized = localizeCatalog(source, locale);
    assert.equal(localized.skills.length, 147);
    assert.equal(localized.journeys.length, 5);
    assertSameContract(source, localized);
    assert.deepEqual(
      localized,
      localizeCatalog(source, locale === "en" ? "en-US" : "es-ES"),
    );
    localized.skills.forEach((skill, index) => {
      assert.equal(skill.categoryKey, source.skills[index].category);
      assert.equal(skill.release.sha256, source.skills[index].release.sha256);
      assert.equal(skill.release.executionTested, false);
      assert.equal(skill.release.commercialCleared, false);
    });
    // The consumer may change its localized view without corrupting the next
    // request or the other language's shared catalog.
    localized.skills[0].deliverables[0] = "consumer-only edit";
    localized.journeys[0].steps[0].action = "consumer-only edit";
    assert.equal(JSON.stringify(source), before);
    assert.notEqual(
      localizeCatalog(source, locale).skills[0].deliverables[0],
      "consumer-only edit",
    );
  }
});

test("localized prompts and acceptance criteria retain the skill and requested deliverable", () => {
  for (const locale of ["en", "es"]) {
    for (const skill of localizeCatalog(catalog, locale).skills) {
      assert.ok(skill.firstPrompt.includes(skill.id));
      assert.ok(skill.firstPrompt.includes(skill.deliverables[0]));
      assert.ok(skill.acceptance[0].includes(skill.deliverables[0]));
      assert.equal(skill.acceptance.length, 3);
      assert.doesNotMatch(
        skill.firstPrompt + skill.acceptance.join(" "),
        /descreva sua tarefa|Materiais disponíveis|Antes de começar|A entrega contempla|têm origem identificada|estão explícitas/,
      );
      assert.match(
        skill.firstPrompt,
        locale === "en" ? /without my authorization/ : /sin mi autorización/,
      );
      assert.match(
        skill.firstPrompt,
        locale === "en" ? /how I can check it/ : /cómo puedo comprobarlo/,
      );
    }
  }
});

for (const locale of ["en", "es"]) {
  test(`${locale}: fictional input and output narratives stay consistent while reference arithmetic remains reproducible`, () => {
    const examples = new Map(
      localizeCatalog(catalog, locale)
        .skills.filter((s) => s.example)
        .map((s) => [s.example.kind, s.example]),
    );
    assert.equal(examples.size, 10);
    const minutes = examples.get("minutes");
    assert.equal(minutes.input.meeting, minutes.result.meeting);
    minutes.input.decisions.forEach((decision, i) => {
      assert.equal(minutes.result.actions[i].action, decision.action);
      assert.equal(minutes.result.actions[i].owner, decision.owner);
    });
    assert.equal(
      minutes.result.actions[1].due,
      locale === "en" ? "To be confirmed" : "Por confirmar",
    );
    assert.match(minutes.task, locale === "en" ? /in English/ : /en español/);

    const document = examples.get("document");
    assert.equal(document.input.title, document.result.title);
    assert.deepEqual(document.input.scope, document.result.sections[1].items);
    assert.deepEqual(
      document.input.exclusions,
      document.result.sections[2].items,
    );
    assert.equal(document.input.acceptance, document.result.sections[3].text);

    const slides = examples.get("slides");
    assert.equal(slides.input.audience, slides.result.audience);
    assert.equal(slides.input.objective, slides.result.objective);
    assert.deepEqual(
      slides.input.facts,
      slides.result.slides.map((slide) => slide.body),
    );

    const requirements = examples.get("requirements");
    assert.equal(requirements.input.need, requirements.result.need);
    assert.deepEqual(
      requirements.result.flows.map((flow) => flow.role),
      [
        requirements.input.roles[0],
        requirements.input.roles[0],
        requirements.input.roles[1],
      ],
    );
    assert.ok(
      requirements.result.flows[0].acceptance.includes(
        requirements.input.states[0],
      ),
    );
    for (const state of requirements.input.states)
      assert.ok(requirements.result.flows[2].acceptance.includes(state));

    const content = examples.get("content");
    assert.ok(content.result.draft.startsWith(content.input.audience));
    assert.ok(content.result.draft.includes(content.input.cta));
    assert.equal(
      content.result.status,
      locale === "en" ? "Draft for approval" : "Borrador para aprobación",
    );
    const seo = examples.get("seo");
    assert.equal(seo.input.title, seo.result.title);
    assert.equal(seo.input.images[0].file, seo.result.issues[2].item);
    assert.equal(seo.result.issues.length, 3);

    for (const kind of ["orders", "cleanup", "margin"]) {
      const example = examples.get(kind);
      assert.deepEqual(
        run(kind, example.input),
        example.result,
        `${kind} arithmetic or cleanup semantics changed`,
      );
    }
    const margin = examples.get("margin");
    assert.equal(margin.result.profit, 410);
    assert.equal(margin.result.margin, 410 / 1100);
    assert.equal(
      margin.result.formula,
      "=IFERROR((SUM(B2:B3)-SUM(C2:C3))/SUM(B2:B3),0)",
    );
    const cleanup = examples.get("cleanup");
    assert.equal(cleanup.input.rows[0].amount, "120,50");
    assert.equal(cleanup.input.rows[1].amount, "79,50");
    assert.match(cleanup.task, /pt-BR/);
    const reconcile = examples.get("reconcile");
    assert.deepEqual(
      reconcile.input.source.map((row) => row.month),
      reconcile.result.rows.map((row) => row.month),
    );
    assert.deepEqual(
      run("reconcile", reconcile.input).rows,
      reconcile.result.rows,
    );
    assert.equal(reconcile.result.totalDifference, 300);
  });
}
