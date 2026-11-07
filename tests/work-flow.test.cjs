"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  vm = require("node:vm");
const store = require("../dist/work-store.js");
const core = require("../dist/i18n-core.js");
const { getPacks } = require("../lib/packs.cjs");
const dictionary = require("../data/i18n-work.cjs");
const source = fs.readFileSync(require.resolve("../dist/work.js"), "utf8");
const ids = store.packIds;
const plain = (value) => JSON.parse(JSON.stringify(value));
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

// A DOM boundary adapter, not a second implementation of Work behavior.
// It supports only the form/detail/focus operations used by the actual module.
// Layout, browser validation and rendering remain browser QA responsibilities.
function harness({
  url = "http://localhost/app",
  initial = store.empty(),
  copy = async () => true,
} = {}) {
  const events = new Map(),
    roots = new Map(),
    downloads = [],
    saved = [];
  let document,
    locale = "pt";
  class Element {
    constructor(tag = "DIV", attrs = {}, parent = null) {
      Object.assign(
        this,
        {
          tagName: tag.toUpperCase(),
          id: "",
          name: "",
          value: "",
          dataset: {},
          parent,
          children: [],
          open: false,
          hidden: false,
          disabled: false,
          textContent: "",
        },
        attrs,
      );
    }
    setAttribute(name, value) {
      this[name] = String(value);
    }
    hasAttribute(name) {
      return name.startsWith("data-")
        ? Object.hasOwn(
            this.dataset,
            name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
          )
        : Object.hasOwn(this, name);
    }
    closest(selector) {
      if (selector === "button" && this.tagName === "BUTTON") return this;
      if (selector === "#work-evaluation" && this.id === "work-evaluation")
        return this;
      return this.parent?.closest(selector) || null;
    }
    contains(node) {
      return (
        node === this || this.children.some((child) => child.contains(node))
      );
    }
    focus() {
      document.activeElement = this;
    }
    querySelectorAll(selector) {
      return this.children.flatMap((child) => [
        ...(selector === "details" && child.tagName === "DETAILS"
          ? [child]
          : []),
        ...child.querySelectorAll(selector),
      ]);
    }
    querySelector(selector) {
      const name = selector.match(/^\[name="([^"]+)"\]$/)?.[1];
      const find = (node) =>
        node.children.flatMap((child) => [child, ...find(child)]);
      return (
        find(this).find((node) =>
          name
            ? node.name === name
            : selector.startsWith("#") && node.id === selector.slice(1),
        ) || null
      );
    }
    set innerHTML(html) {
      this._html = String(html);
      this.children = [];
      if (this.id !== "work-stage") return;
      for (const match of html.matchAll(/<details(?:\s[^>]*)?>/g))
        this.children.push(
          new Element("details", { open: /\bopen\b/.test(match[0]) }, this),
        );
      const formBody = html.match(
        /<form id="work-evaluation">([\s\S]*?)<\/form>/,
      )?.[1];
      if (formBody) {
        const form = new Element(
          "form",
          { id: "work-evaluation", elements: {} },
          this,
        );
        this.children.push(form);
        for (const match of formBody.matchAll(
          /<select name="([^"]+)">([\s\S]*?)<\/select>/g,
        )) {
          const options = [
              ...match[2].matchAll(/<option value="([^"]*)"([^>]*)>/g),
            ],
            selected =
              options.find((o) => /\bselected\b/.test(o[2])) || options[0];
          const field = new Element(
            "select",
            { name: match[1], value: selected?.[1] || "" },
            form,
          );
          form.children.push(field);
          form.elements[field.name] = field;
        }
        const input = formBody.match(
          /<input type="number" name="minutes"[^>]*value="([^"]*)"/,
        );
        if (input) {
          const field = new Element(
            "input",
            { name: "minutes", value: input[1] },
            form,
          );
          form.children.push(field);
          form.elements.minutes = field;
        }
      }
      for (const match of html.matchAll(
        /<input[^>]*data-work-check="([^"]+)"([^>]*)>/g,
      ))
        this.children.push(
          new Element(
            "input",
            {
              dataset: { workCheck: match[1] },
              checked: /\bchecked\b/.test(match[2]),
            },
            this,
          ),
        );
    }
    get innerHTML() {
      return this._html || "";
    }
    click() {
      if (this.tagName === "A")
        downloads.push({ name: this.download, blob: blobs.get(this.href) });
    }
    remove() {}
  }
  const root = (id) => {
    if (!roots.has(id)) roots.set(id, new Element("div", { id }));
    return roots.get(id);
  };
  const stage = root("work-stage"),
    blobs = new Map();
  document = {
    body: new Element("body"),
    activeElement: null,
    addEventListener(type, fn) {
      if (!events.has(type)) events.set(type, []);
      events.get(type).push(fn);
    },
    querySelector(selector) {
      if (selector === "#work-evaluation") return stage.querySelector(selector);
      if (selector.startsWith("[data-work-check=")) {
        const key = selector.match(/"([^"]+)"/)?.[1];
        return stage.children.find((e) => e.dataset.workCheck === key) || null;
      }
      return selector.startsWith("#") ? root(selector.slice(1)) : null;
    },
    querySelectorAll() {
      return [];
    },
    createElement: (tag) => new Element(tag),
  };
  document.body.append = () => {};
  document.activeElement = document.body;
  const location = { href: url };
  const testURL = class extends URL {};
  testURL.createObjectURL = (blob) => {
    const key = "blob:test-" + blobs.size;
    blobs.set(key, blob);
    return key;
  };
  testURL.revokeObjectURL = (key) => blobs.delete(key);
  const state = { work: store.clean(initial) };
  const context = {
    deck: () => state,
    save: () => saved.push(plain(state.work)),
    copy,
    renderCollection() {},
    setView() {},
    setRuntime() {},
    openSkill() {},
  };
  const data = (lang) => {
    const packs = getPacks(lang);
    return {
      packs,
      skills: [
        ...new Set(packs.flatMap((p) => p.steps.map((s) => s.skillId))),
      ].map((id, i) => ({ id, code: "DD-" + String(i + 1).padStart(3, "0") })),
    };
  };
  const sandbox = {
    window: {},
    document,
    location,
    URL: testURL,
    Blob,
    history: {
      replaceState(_, __, next) {
        location.href = new URL(next, location.href).href;
      },
    },
    DeckI18n: {
      get locale() {
        return locale;
      },
      t: (s, p) => core.translate(dictionary, locale, s, p),
      apply() {},
      url: (path) => core.localizedURL(path, locale, location.href),
    },
    DeckArt: { esc: escape },
    DeckWorkStore: store,
    CSS: { escape: (s) => s },
    setTimeout() {},
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync("dist/commerce.js", "utf8"), sandbox);
  sandbox.DeckCommerce = sandbox.window.DeckCommerce;
  vm.runInContext(source, sandbox);
  const work = sandbox.window.DeckWork;
  work.start(context, data(locale));
  const dispatch = async (type, target) => {
    for (const fn of events.get(type) || [])
      await fn({ target, preventDefault() {} });
  };
  const click = (dataset) =>
    dispatch("click", new Element("button", { dataset }));
  return {
    work,
    state,
    saved,
    root,
    stage,
    document,
    downloads,
    location,
    dispatch,
    click,
    async phase(number) {
      await click({ workPhase: String(number) });
    },
    async check(key, value = true) {
      await dispatch(
        "change",
        new Element("input", { dataset: { workCheck: key }, checked: value }),
      );
    },
    async context(value) {
      await dispatch(
        "change",
        new Element("select", { id: "work-context", value }),
      );
    },
    async evaluation(values, type = "input") {
      const form = document.querySelector("#work-evaluation");
      for (const [key, value] of Object.entries(values))
        form.elements[key].value = String(value);
      const field = form.elements[Object.keys(values)[0]];
      field.focus();
      await dispatch(type, field);
    },
    async submit() {
      await dispatch("submit", document.querySelector("#work-evaluation"));
    },
    language(next) {
      locale = next;
      work.update(data(next));
    },
    current() {
      return state.work.packs[state.work.activePack];
    },
  };
}

test("Work deep link is saved and the selected mode/pack survive a new visit without URL hints", () => {
  const h = harness({
    url: "http://localhost/app?mode=work&pack=power-bi-sob-controle&lang=es",
  });
  assert.ok(h.saved.length > 0);
  assert.equal(h.saved.at(-1).mode, "work");
  assert.equal(h.saved.at(-1).activePack, ids[1]);
  const restored = harness({ initial: h.saved.at(-1) });
  assert.equal(restored.work.mode, "work");
  assert.equal(restored.state.work.activePack, ids[1]);
  assert.equal(
    new URL(restored.location.href).searchParams.get("pack"),
    ids[1],
  );
});

test("pending copy records activity for the source pack even if another pack is selected", async () => {
  let resolveCopy;
  const copied = [];
  const h = harness({
    copy: (prompt) => {
      copied.push(prompt);
      return new Promise((resolve) => (resolveCopy = resolve));
    },
  });
  const pending = h.click({ workPrompt: "0" });
  h.work.choose(ids[1]);
  resolveCopy(true);
  await pending;
  assert.equal(copied[0], getPacks("pt")[0].steps[0].prompt);
  assert.ok(h.state.work.packs[ids[0]].startedAt);
  assert.equal(h.state.work.packs[ids[1]], undefined);
});

test("changing language preserves open instructions and the entered minutes before blur", async () => {
  const h = harness();
  await h.phase(2);
  assert.ok(h.stage.querySelectorAll("details").length > 1);
  h.stage.querySelectorAll("details")[1].open = true;
  h.language("en");
  assert.equal(h.stage.querySelectorAll("details")[1].open, true);
  assert.equal(h.stage.querySelectorAll("details")[0].open, false);
  await h.phase(3);
  await h.evaluation({ minutes: 37 });
  h.language("es");
  const field = h.document.querySelector("#work-evaluation").elements.minutes;
  assert.equal(field.value, "37");
  assert.equal(h.current().minutes, 37);
  assert.equal(h.document.activeElement, field);
  assert.match(h.root("work-title").textContent, /Hojas/);
});

test("a requested but invalid completion remains a draft and is never exported as completed", async () => {
  const h = harness();
  await h.phase(3);
  await h.evaluation({ outcome: "completed" });
  await h.submit();
  assert.equal(h.current().outcomeChoice, "completed");
  assert.equal(h.current().outcome, "partial");
  assert.equal(h.current().completedAt, null);
  await h.click({ exportWork: "" });
  const report = JSON.parse(await h.downloads[0].blob.text());
  assert.equal(report.containsUserFiles, false);
  assert.equal(report.source, "self-reported-local-demo");
  assert.equal(report.runs[0].outcome, "partial");
  assert.equal(report.runs[0].completedAt, null);
});

test("valid completion needs every step and acceptance check; returning to partial clears completion immediately", async () => {
  const h = harness(),
    p = getPacks("pt")[0];
  for (const s of p.steps) await h.check("step:" + s.id);
  for (const c of p.sample.checks) await h.check("accept:" + c.id);
  await h.phase(3);
  await h.evaluation({ outcome: "completed", help: "guide", minutes: 24 });
  await h.submit();
  assert.equal(h.current().outcome, "completed");
  assert.ok(Number.isFinite(Date.parse(h.current().completedAt)));
  await h.evaluation({ outcome: "partial" });
  assert.equal(h.current().outcome, "partial");
  assert.equal(h.current().completedAt, null);
  const restored = store.clean(h.saved.at(-1));
  assert.equal(restored.packs[ids[0]].completedAt, null);
});

test("switching to own materials resets sample checks and a new task archives the previous context", async () => {
  const h = harness();
  await h.check("accept:sample-check");
  await h.context("own");
  assert.equal(h.current().context, "own");
  assert.deepEqual(plain(h.current().checks), []);
  await h.phase(2);
  assert.ok(
    h.stage.innerHTML.includes(
      "Não reutilize os valores, caminhos ou resultados da amostra fictícia.",
    ),
  );
  await h.click({ newWork: "" });
  assert.equal(h.state.work.history.length, 1);
  assert.equal(h.state.work.history[0].context, "own");
  assert.equal(h.current().context, "own");
  assert.equal(h.current().phase, 0);
});

test("WorkStore sanitizes context, enums and incomplete completion claims without retaining extra fields", () => {
  const clean = store.clean({
    mode: "admin",
    activePack: "unknown",
    packs: {
      [ids[0]]: {
        context: "<script>",
        phase: 99,
        platform: "shell",
        checks: ["step:one", "step:one", "<img>"],
        outcome: "completed",
        completedAt: "invalid",
        outcomeChoice: "hacked",
        minutes: -10,
        help: "root",
        userFiles: ["secret"],
      },
      unknown: { context: "own" },
    },
    history: [{ packId: "unknown", startedAt: "2026-11-07T10:00:00Z" }],
  });
  assert.equal(clean.mode, "explore");
  assert.equal(clean.activePack, ids[0]);
  assert.deepEqual(Object.keys(clean.packs), [ids[0]]);
  const r = clean.packs[ids[0]];
  assert.equal(r.context, "sample");
  assert.equal(r.phase, 0);
  assert.equal(r.platform, "any");
  assert.deepEqual(r.checks, ["step:one"]);
  assert.equal(r.outcome, "partial");
  assert.equal(r.completedAt, null);
  assert.equal(r.minutes, null);
  assert.equal(r.help, "none");
  assert.ok(!("userFiles" in r));
  assert.equal(clean.history.length, 0);
  assert.equal(store.run({ context: "own" }).context, "own");
  assert.equal(
    store.run({ outcome: "partial", completedAt: "2026-11-07T10:00:00Z" })
      .completedAt,
    null,
  );
});

test("WorkStore merge retains newer progress, imports missing packs and deduplicates archived runs", () => {
  const early = store.touch(
    { context: "sample", phase: 1 },
    new Date("2026-11-06T10:00:00Z"),
  );
  const late = store.touch(
    { context: "own", phase: 3, minutes: 45 },
    new Date("2026-11-07T10:00:00Z"),
  );
  const archived = { packId: ids[0], ...early };
  const local = {
    ...store.empty(),
    mode: "work",
    activePack: ids[1],
    packs: { [ids[0]]: late },
    history: [archived],
  };
  const backup = {
    ...store.empty(),
    packs: { [ids[0]]: early, [ids[1]]: late },
    history: [archived],
  };
  const before = JSON.stringify(local),
    merged = store.merge(local, backup);
  assert.equal(
    JSON.stringify(local),
    before,
    "merge must not mutate the live input",
  );
  assert.equal(merged.mode, "work");
  assert.equal(merged.activePack, ids[1]);
  assert.equal(merged.packs[ids[0]].phase, 3);
  assert.equal(merged.packs[ids[0]].context, "own");
  assert.equal(merged.packs[ids[1]].minutes, 45);
  assert.equal(merged.history.length, 1);
  const next = store.merge(backup, local);
  assert.equal(next.packs[ids[0]].updatedAt, late.updatedAt);
  assert.equal(next.packs[ids[0]].context, "own");
});
