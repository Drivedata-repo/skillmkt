"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const base = require("../data/skills.cjs");
const art = require("../dist/skill-art.js");

test("all 137 skills have an individual composition with valid objects", () => {
  assert.equal(art.scenes.length, 183);
  assert.deepEqual(
    art.scenes.map((s) => s.id).sort(),
    base.map((s) => s.id).sort(),
  );
  const objectSets = new Set(),
    bodies = new Set();
  for (const scene of art.scenes) {
    assert.ok(scene.title.length > 15, scene.id);
    assert.ok(scene.objects.length >= 3 && scene.objects.length <= 4, scene.id);
    for (const [
      type,
      x,
      y,
      scale,
      rotation = 0,
      motion = "",
    ] of scene.objects) {
      assert.ok(art.primitiveNames.includes(type), scene.id + ": " + type);
      assert.ok([x, y, scale, rotation].every(Number.isFinite));
      assert.ok(
        x >= 0 && x < 320 && y >= 0 && y < 260 && scale > 0 && scale < 2,
      );
      assert.ok(["", "lift", "turn", "trace", "breathe"].includes(motion));
    }
    // Ignore style/motion: geometry must differ without relying on IDs or colors.
    bodies.add(
      art.body(scene.id).replace(/\s(?:class|id|fill|stroke)="[^"]*"/g, ""),
    );
    // A stronger editorial check: no two cards merely reposition the same objects.
    objectSets.add(
      scene.objects
        .map((o) => o[0])
        .sort()
        .join("|"),
    );
  }
  assert.equal(bodies.size, 183);
  assert.equal(objectSets.size, 183);
});

test("SVG artwork is bounded, deterministic and contains no active or external content", () => {
  for (const { id } of base) {
    const svg = art.render(id);
    assert.equal(svg, art.render(id));
    assert.ok(Buffer.byteLength(svg) < 4096, id);
    assert.match(svg, /aria-hidden="true" focusable="false"/);
    assert.doesNotMatch(
      svg,
      /<(?:script|foreignObject|image|text)\b|\bon\w+\s*=|\bhref\s*=|url\(/i,
    );
    assert.doesNotMatch(svg, /undefined|NaN|Infinity/);
  }
  const hostile = '\"><script>alert(1)</script>';
  assert.equal(art.render(hostile), art.render("unknown-skill"));
  assert.ok(!art.render(hostile).includes(hostile));
  assert.ok(fs.statSync(require.resolve("../dist/skill-art.js")).size < 80000);
});

test("browser cards use the same authored scene in every locale and escape metadata", () => {
  const context = vm.createContext({});
  vm.runInContext(
    fs.readFileSync(require.resolve("../dist/skill-art.js"), "utf8"),
    context,
  );
  vm.runInContext(
    fs.readFileSync(require.resolve("../dist/deck-art.js"), "utf8"),
    context,
  );
  for (const skill of base) {
    context.skill = {
      ...skill,
      title: '<img src=x onerror="alert(1)">',
      universe: { alias: "<unsafe>", tagline: "<b>test</b>" },
    };
    const card = vm.runInContext("DeckArt.card(skill)", context);
    assert.ok(card.includes(art.render(skill.id)), skill.id);
    assert.ok(card.includes("&lt;unsafe&gt;"));
    assert.ok(!card.includes("<img src=x"));
    context.skill.title = "Título / Title / Título";
    assert.ok(
      vm
        .runInContext("DeckArt.card(skill)", context)
        .includes(art.render(skill.id)),
    );
  }
});
