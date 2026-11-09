"use strict";
// A página inicial nova (dist/index.html): contratos que não podem quebrar.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const catalog = require("../lib/catalog.cjs");
const journeys = require("../data/journeys.cjs");
const { validateWaitlist } = require("../lib/waitlist.cjs");

const html = read("dist/index.html");
const script = read("dist/home-fable.js");
const data = (() => {
  const window = {};
  vm.runInNewContext(read("dist/home-fable-data.js"), { window });
  return window.HomeFableData;
})();

test("home: sem script nem evento embutido, para valer o CSP de produção", () => {
  for (const tag of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    assert.match(tag[1], /\bsrc="\/[^"]+"/, "todo script vem de arquivo próprio");
    assert.equal(tag[2].trim(), "", "nenhum script embutido");
  }
  assert.doesNotMatch(html, /\son[a-z]+="/, "nenhum evento embutido");
  assert.doesNotMatch(html, /noindex/, "a página inicial pode ser indexada");
  assert.match(html, /<link rel="canonical" href="https:\/\/deck\.drivedata\.com\.br\/"/);
});

test("home: carrega os arquivos da cena e trata o idioma antes de desenhar", () => {
  const sources = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(sources[0], "/home-fable-idioma.js", "o idioma é decidido primeiro");
  for (const file of [
    "/home-fable-data.js",
    "/public-preview.js",
    "/skill-art.js",
    "/deck-art.js",
    "/home-fable.js",
  ])
    assert.ok(sources.includes(file), file);
  for (const source of sources)
    assert.ok(fs.existsSync(path.join(root, "dist", source)), source);
  assert.match(html, /href="\/home-classica\.html\?lang=en"/);
  assert.match(html, /href="\/home-classica\.html\?lang=es"/);
  assert.match(read("dist/home-classica.html"), /src="\/home-classica-idioma\.js"/);
});

test("home: lista de espera mantém o contrato do /api/waitlist", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size, "ids únicos");
  for (const id of [
    "waitlist-form",
    "wait-name",
    "wait-email",
    "wait-audience",
    "wait-interest",
    "wait-consent",
    "wait-website",
    "waitlist-success",
    "waitlist-error",
  ])
    assert.ok(ids.includes(id), id);
  const options = (id) => {
    const select = html.match(new RegExp(`<select id="${id}"[\\s\\S]*?</select>`))[0];
    return [...select.matchAll(/<option value="([^"]+)"/g)].map((m) => m[1]);
  };
  // Toda combinação que o formulário consegue enviar precisa passar na validação.
  for (const audience of options("wait-audience"))
    for (const interest of options("wait-interest"))
      assert.doesNotThrow(() =>
        validateWaitlist({
          name: "Pessoa de Teste",
          email: "teste@example.com",
          audience,
          interest,
          consent: true,
          website: "",
        }),
      );
  assert.match(script, /fetch\("\/api\/waitlist"/);
  assert.match(html, /href="\/privacidade"/);
  assert.match(html, /href="\/login"/);
});

test("home: o índice público acompanha o catálogo e as jornadas", () => {
  assert.equal(data.total, catalog.skills.length);
  assert.equal(data.cards.length, catalog.skills.length);
  const byCode = new Map(catalog.skills.map((s) => [s.code, s]));
  assert.equal(new Set(data.cards.map((c) => c[0])).size, data.cards.length);
  for (const [code, title, group, finish, id] of data.cards) {
    const skill = byCode.get(code);
    assert.ok(skill, code);
    assert.equal(title, skill.title);
    assert.equal(id, skill.id);
    assert.equal(data.groups[group].name, skill.category);
    assert.match(finish, /^(paper|ion|prism|platinum|gold)$/);
  }
  assert.equal(
    data.groups.reduce((sum, g) => sum + g.count, 0),
    catalog.skills.length,
  );
  // O índice público não leva preço, requisitos nem conteúdo do pacote.
  assert.doesNotMatch(read("dist/home-fable-data.js"), /priceCents|sha256|dependencies/);
  assert.equal(data.tasks.length, 4);
  for (const task of data.tasks) {
    assert.equal(task.cards.length, 3);
    const journey = journeys.find((j) => j.title === task.journey);
    assert.ok(journey, task.journey);
    assert.equal(
      task.cards.map((c) => c.id).join(" > "),
      journey.steps.map((s) => s.id).join(" > "),
    );
    if (task.sample)
      assert.ok(
        fs.existsSync(path.join(root, "dist/problemas", task.sample, "index.html")),
        task.sample,
      );
  }
});

test("home: todo texto marcado no HTML tem a mesma chave no objeto de textos", () => {
  const keys = [...html.matchAll(/data-t="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(keys.length > 40);
  for (const key of keys)
    assert.ok(script.includes(`"${key}":`) || script.includes(`${key}:`), key);
});
