const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../dist/i18n-core.js");
const dictionary = {
  ...require("../lib/locale.cjs").messages,
  ...require("../data/i18n-market.cjs"),
  ...require("../data/i18n-public.cjs"),
};
test("browser language selection is explicit, persistent and allowlisted", () => {
  assert.equal(core.resolveLocale("es", "en", "pt"), "es");
  assert.equal(core.resolveLocale(null, "en", "pt"), "en");
  assert.equal(core.resolveLocale(null, null, "es"), "es");
  for (const invalid of ["", "fr", "../en", "<script>"])
    assert.equal(core.resolveLocale(invalid, "es", "en"), "pt");
  assert.equal(core.resolveLocale(null, null, null), "pt");
});
test("localized navigation preserves query/hash and never changes external URLs", () => {
  assert.equal(
    core.localizedURL(
      "/app?skill=DD-042#deck",
      "es",
      "https://deck.drivedata.com.br",
    ),
    "/app?skill=DD-042&lang=es#deck",
  );
  assert.equal(
    core.localizedURL(
      "https://example.com/path",
      "es",
      "https://deck.drivedata.com.br",
    ),
    "https://example.com/path",
  );
  assert.equal(
    core.localizedURL("/login?lang=en", "pt", "https://deck.drivedata.com.br"),
    "/login?lang=pt",
  );
});
test("every authored UI message has both languages and the same interpolation fields", () => {
  const fields = (s) =>
    [...new Set(s.match(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g) || [])].sort();
  for (const [source, values] of Object.entries(dictionary)) {
    assert.equal(source, core.normalize(source));
    assert.equal(values.length, 2, source);
    for (const value of values) {
      assert.ok(value.trim(), source);
      assert.deepEqual(fields(value), fields(source), source);
    }
  }
  assert.equal(
    core.translate(dictionary, "en", "{count} de {total} cartas", {
      count: 12,
      total: 137,
    }),
    "12 of 137 cards",
  );
  assert.equal(
    core.translate(dictionary, "es", "Use a skill {id}. {task}", {
      id: "claude-xlsx",
      task: "Comprueba el margen.",
    }),
    "Usa la skill claude-xlsx. Comprueba el margen.",
  );
  assert.equal(
    core.translate(dictionary, "en", "Unknown user text <b>data</b>"),
    "Unknown user text <b>data</b>",
  );
});
test("public and authenticated HTML text and accessible labels are covered", () => {
  const exempt = new Set([
    "DriveData Deck",
    "DriveData",
    "Deck",
    "Deck.",
    "DD / 01",
    "← DriveData Deck",
    "×",
  ]);
  const norm = (s) =>
    core.normalize(
      s
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'"),
    );
  const files = [
    "views/market.html",
    "dist/index.html",
    "dist/login.html",
    "dist/privacy.html",
  ];
  for (const file of files) {
    const source = fs
      .readFileSync(path.join(__dirname, "..", file), "utf8")
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, "");
    const texts = [
      ...source.matchAll(/>([^<]+)</g),
      ...source.matchAll(
        /(?:aria-label|placeholder|title|alt|data-example)="([^"]+)"/g,
      ),
    ].map((m) => norm(m[1]));
    for (const text of texts)
      if (/[A-Za-zÀ-ÿ]/.test(text) && !exempt.has(text))
        assert.ok(dictionary[text], `${file}: ${text}`);
    for (const asset of [
      "/i18n.css",
      "/translations.js",
      "/i18n-core.js",
      "/i18n.js",
    ])
      assert.ok(
        source.includes(asset) ||
          fs
            .readFileSync(path.join(__dirname, "..", file), "utf8")
            .includes(asset),
        `${file}: ${asset}`,
      );
  }
});
