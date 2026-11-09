"use strict";
const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const demo = require("../dist/problems.js"),
  pages = require("../data/problem-pages.cjs"),
  dictionary = require("../data/i18n-problems.cjs");
const dist = path.join(__dirname, "../dist");
test("order sample preserves revenue accounting and quarantines ambiguous keys", () => {
  const input = demo.samples("orders", 0),
    snapshot = JSON.stringify(input),
    out = demo.calculate("orders", input);
  assert.equal(out.inputCount, 5);
  assert.equal(out.gross, 550);
  assert.equal(out.checked, 450);
  assert.equal(out.duplicates, 1);
  assert.equal(out.conflicts, 0);
  assert.equal(out.rows.find((r) => r.status === "duplicate").amount, 100);
  assert.equal(JSON.stringify(input), snapshot, "source is not mutated");
  const conflict = demo.calculate("orders", demo.samples("orders", 1));
  assert.equal(conflict.gross, 710);
  assert.equal(conflict.checked, 370);
  assert.equal(conflict.conflicts, 1);
  assert.deepEqual(
    conflict.rows.filter((r) => r.status === "review").map((r) => r.amount),
    [80, 160],
  );
  assert.equal(
    conflict.checked +
      conflict.rows
        .filter((r) => r.status !== "checked")
        .reduce((sum, r) => sum + r.amount, 0),
    conflict.gross,
  );
  const clean = demo.calculate("orders", demo.samples("orders", 2));
  assert.equal(clean.checked, 450);
  assert.equal(clean.duplicates, 0);
});
test("order keys include item and monetary multiplication uses cents", () => {
  const result = demo.calculate("orders", [
    { order: "P1", item: "A", quantity: 3, unitPrice: 0.1 },
    { order: "P1", item: "B", quantity: 2, unitPrice: 0.2 },
  ]);
  assert.equal(result.checked, 0.7);
  assert.equal(result.duplicates, 0);
  assert.equal(result.conflicts, 0);
});
test("reconciliation direction and tolerance boundaries have explicit independent oracles", () => {
  const initial = demo.calculate("reconcile", demo.samples("reconcile", 0), 0);
  assert.deepEqual(
    initial.rows.map((r) => r.difference),
    [0, 250, 0],
  );
  assert.equal(initial.difference, 250);
  assert.equal(initial.reviewCount, 1);
  const exact = demo.calculate("reconcile", demo.samples("reconcile", 0), 250);
  assert.equal(exact.reviewCount, 0);
  assert.equal(exact.difference, 250);
  assert.equal(
    demo.calculate("reconcile", demo.samples("reconcile", 0), 249.99)
      .reviewCount,
    1,
  );
  assert.equal(
    demo.calculate("reconcile", demo.samples("reconcile", 1), 0).difference,
    -250,
  );
  assert.equal(
    demo.calculate("reconcile", demo.samples("reconcile", 2), 0).reviewCount,
    0,
  );
});
test("performance prioritizes a measured component without claiming wall-clock page time", () => {
  const result = demo.calculate(
    "performance",
    demo.samples("performance", 0),
    1000,
  );
  assert.deepEqual(
    result.rows.map((r) => r.visual),
    ["V02", "V01", "V03"],
  );
  assert.equal(result.first, "V02");
  assert.equal(result.rows[0].duration, 2500);
  assert.deepEqual(result.rows[0].dominant, ["daxMs"]);
  assert.equal(result.reviewCount, 1);
  assert.deepEqual(
    demo.calculate("performance", demo.samples("performance", 1), 1000).rows[0]
      .dominant,
    ["displayMs"],
  );
  assert.equal(
    demo.calculate("performance", demo.samples("performance", 2), 1000).first,
    null,
  );
  assert.ok(!("pageLoadTime" in result));
});
test("invalid thresholds are rejected and CSV escapes delimiters and formulas", () => {
  for (const threshold of [-1, 10001, NaN, Infinity])
    assert.throws(() => demo.calculate("reconcile", [], threshold), RangeError);
  assert.throws(() => demo.samples("orders", 99), RangeError);
  const csv = demo.csv([{ name: "=SUM(A1)", note: 'a,"b"', amount: -250 }]);
  assert.equal(
    csv,
    '"name","note","amount"\r\n"\'=SUM(A1)","a,""b""","-250"\r\n',
  );
});
test("nine complete public documents have independent language metadata and canonical/hreflang links", () => {
  assert.equal(pages.length, 3);
  for (const page of pages)
    for (const [locale, tag] of Object.entries({
      pt: "pt-BR",
      en: "en",
      es: "es",
    })) {
      const suffix = locale === "pt" ? "" : locale + "/",
        route = "/problemas/" + page.slug + "/" + suffix;
      const html = fs.readFileSync(
        path.join(dist, route, "index.html"),
        "utf8",
      );
      assert.ok(html.includes(`lang="${tag}" data-problem-locale="${locale}"`));
      assert.ok(
        html.includes(
          `rel="canonical" href="https://deck.drivedata.com.br${route}"`,
        ),
      );
      for (const lang of ["pt-BR", "en", "es", "x-default"])
        assert.ok(html.includes(`hreflang="${lang}"`));
      assert.ok(html.includes(page.content[locale].title));
      assert.ok(html.includes(page.content[locale].boundary));
      for (const id of [
        "demo-form",
        "sample",
        "demo-input",
        "demo-output",
        "demo-status",
        "copy-task",
        "copy-status",
        "task-text",
      ])
        assert.ok(html.includes(`id="${id}"`));
      assert.ok(
        html.includes(
          `/app?mode=work&amp;pack=${page.pack}&amp;lang=${locale}`,
        ),
      );
      assert.ok(
        !html.includes("/api/"),
        "public examples have no data submission endpoint",
      );
      const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
      assert.equal(ids.length, new Set(ids).size);
      assert.ok(page.content[locale].task.length > 200);
    }
});
test("translated landing retains demo, art and waitlist contracts and links to three open samples", () => {
  // Desde a home nova, a landing traduzida (EN e ES) é dist/home-classica.html.
  const html = fs.readFileSync(path.join(dist, "home-classica.html"), "utf8");
  for (const id of [
    "fan-main",
    "fan-left",
    "fan-right",
    "lab-card",
    "waitlist-form",
    "wait-name",
    "wait-email",
    "wait-audience",
    "wait-interest",
    "wait-consent",
    "wait-website",
    "waitlist-success",
  ])
    assert.ok(html.includes(`id="${id}"`));
  for (const page of pages)
    assert.ok(html.includes(`data-public-problem="${page.slug}"`));
  for (const pack of ["planilhas-confiaveis", "power-bi-sob-controle"])
    assert.ok(html.includes(`data-work-pack="${pack}"`));
  for (const [key, values] of Object.entries(dictionary)) {
    assert.equal(values.length, 2, key);
    assert.ok(
      values.every((s) => typeof s === "string" && s.trim()),
      key,
    );
  }
  const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
  assert.equal((sitemap.match(/<loc>/g) || []).length, 10);
});
