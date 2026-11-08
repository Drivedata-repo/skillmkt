"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const base = require("../data/skills.cjs");
const { records, getUniverse } = require("../lib/universes.cjs");
const catalog = require("../lib/catalog.cjs");
const { localizeCatalog } = require("../lib/catalog-i18n.cjs");
function leaves(value, prefix = "") {
  return typeof value === "string"
    ? [[prefix, value]]
    : Object.entries(value).flatMap(([key, child]) =>
        leaves(child, `${prefix}.${key}`),
      );
}
test("all 137 skills have individually authored universes in all three languages", () => {
  assert.equal(records.length, 173);
  assert.deepEqual(
    records.map((r) => r.id).sort(),
    base.map((s) => s.id).sort(),
  );
  for (const locale of ["pt", "en", "es"]) {
    const identities = new Set(),
      stories = new Set(),
      missions = new Set();
    for (const skill of base) {
      const u = getUniverse(skill.id, locale);
      assert.ok(
        u.alias.length >= 4 && u.alias.length <= 85,
        skill.id + " alias",
      );
      assert.ok(u.tagline.length <= 130, skill.id + " tagline");
      assert.ok(u.story.length >= 180, skill.id + " substantive story");
      assert.ok(u.purpose.length >= 80, skill.id + " purpose");
      assert.ok(
        u.scenario.request.length >= 150,
        skill.id + " actionable prompt",
      );
      assert.ok(
        u.scenario.context.length >= 45,
        skill.id + " concrete context",
      );
      assert.ok(u.scenario.check.length >= 30, skill.id + " verification");
      assert.ok(u.boundary.length >= 35, skill.id + " constraints");
      for (const [path, text] of leaves(u)) {
        assert.doesNotMatch(
          text,
          /\b(?:TODO|TBD|TRANSLATE|__MISSING__)\b|[A-Z]:\\Users\\|<script\b/,
          `${skill.id}/${locale}${path}`,
        );
        assert.equal(
          text,
          text.trim(),
          `${skill.id}/${locale}${path} whitespace`,
        );
      }
      assert.ok(!identities.has(u.alias), "Duplicate alias: " + u.alias);
      identities.add(u.alias);
      stories.add(u.story);
      missions.add(u.scenario.request);
    }
    assert.equal(stories.size, 173, locale + " unique stories");
    assert.equal(missions.size, 173, locale + " unique missions");
  }
});
test("localized universe paths and numerical facts match, with no silent PT fallback", () => {
  const numbers = (text) =>
    (text.match(/\d+(?:[.,]\d+)*/g) || []).map((n) => n.replaceAll(",", "."));
  for (const locale of ["en", "es"]) {
    const localized = localizeCatalog(catalog, locale);
    for (let i = 0; i < base.length; i++) {
      const source = catalog.skills[i].universe;
      const target = localized.skills[i].universe;
      assert.deepEqual(target, getUniverse(base[i].id, locale));
      assert.notEqual(target, getUniverse(base[i].id, locale), "Return a copy");
      const targetLeaves = new Map(leaves(target));
      assert.deepEqual(
        [...targetLeaves.keys()],
        leaves(source).map(([path]) => path),
      );
      for (const [path, text] of leaves(source)) {
        assert.deepEqual(
          numbers(targetLeaves.get(path)),
          numbers(text),
          `${base[i].id}/${locale}${path} numerical drift`,
        );
        if (path !== ".alias" && text.length > 80)
          assert.notEqual(
            targetLeaves.get(path),
            text,
            `${base[i].id}/${locale}${path} untranslated`,
          );
      }
    }
  }
});
test("edition signatures are unique, stable across locales and escape authored content", () => {
  const context = vm.createContext({});
  vm.runInContext(
    fs.readFileSync(require.resolve("../dist/deck-art.js"), "utf8") +
      "\nthis.art = DeckArt;",
    context,
  );
  const marks = base.map((s) => context.art.signature(s.code));
  assert.equal(new Set(marks).size, 173);
  for (const s of catalog.skills) {
    const html = context.art.card(s);
    assert.ok(html.includes('class="card-codename"'));
    assert.ok(html.includes(context.art.esc(s.universe.alias)));
  }
  const hostile = {
    ...catalog.skills[0],
    universe: {
      alias: '<img src=x onerror="bad()">',
      tagline: "<script>bad()</script>",
    },
  };
  const html = context.art.card(hostile);
  assert.ok(html.includes("&lt;img"));
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes("<img src=x"));
});
