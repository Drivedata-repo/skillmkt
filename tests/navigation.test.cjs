"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  vm = require("node:vm");
const { appPath } = require("../dist/navigation.js");
const app = require("../api/app.js");

test("safe next defaults to app for missing, oversized and non-string input", () => {
  for (const value of [
    undefined,
    null,
    "",
    0,
    false,
    {},
    [],
    new URL("https://deck.invalid/app"),
    "/app?x=" + "a".repeat(1500),
  ])
    assert.equal(appPath(value), "/app");
  assert.equal(appPath("/app"), "/app");
  assert.equal(appPath("/app?"), "/app");
});

test("safe next never accepts external URLs, alternate paths or path normalization tricks", () => {
  const attacks = [
    "https://evil.example/app?mode=work",
    "https://deck.invalid/app?mode=work",
    "//evil.example/app?mode=work",
    "///evil.example/app?mode=work",
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "/login?next=/app",
    "/application?mode=work",
    "/app/other?mode=work",
    "/app/../app?mode=work",
    "/app/%2e%2e/app?mode=work",
    "/app/./?mode=work",
    "/app%2f..%2fapp?mode=work",
    "/%61pp?mode=work",
    "/app%3Fmode=work",
    "/app\\evil?mode=work",
    "/app\t?mode=work",
    "/app?mo\tde=work",
    "/app?mode=work\r\nLocation: https://evil.example",
    "/app?mode=work\0",
    "/app?mode=work\x7f",
    " /app?mode=work",
  ];
  for (const attack of attacks)
    assert.equal(appPath(attack), "/app", JSON.stringify(attack));
});

test("safe next preserves the complete supported work and card context", () => {
  const safe = appPath(
    "/app?pack=power-bi-sob-controle&lang=es&mode=work&view=deck&skill=DD-092&chapter=start&step=3&spin=off&face=back#ignored",
  );
  assert.deepEqual(
    Object.fromEntries(new URL(safe, "https://deck.invalid").searchParams),
    {
      mode: "work",
      pack: "power-bi-sob-controle",
      lang: "es",
      view: "deck",
      chapter: "start",
      step: "3",
      spin: "off",
      face: "back",
      skill: "DD-092",
    },
  );
  assert.equal(
    appPath("/app?mode=explore&pack=planilhas-confiaveis&lang=pt"),
    "/app?mode=explore&pack=planilhas-confiaveis&lang=pt",
  );
  assert.equal(appPath(safe), safe, "normalization is idempotent");
});

test("only explicit parameter values survive; unknown destinations and injected fragments are dropped", () => {
  const cases = {
    "/app?mode=admin&pack=unknown&lang=fr&view=admin&chapter=secret&step=4&spin=true&face=side&skill=../../x":
      "/app",
    "/app?mode=work&redirect=https://evil.example&next=//evil.example&token=private&__proto__=x":
      "/app?mode=work",
    "/app?lang=en%0D%0ALocation%3A%20https%3A%2F%2Fevil.example": "/app",
    "/app?pack=planilhas-confiaveis%26next%3Dhttps%3A%2F%2Fevil.example&lang=es":
      "/app?lang=es",
    "/app?skill=dd-001&lang=EN": "/app",
    "/app?skill=DD-1&step=-1": "/app",
    "/app?skill=DD-001%22%20onclick%3Dalert(1)": "/app",
    "/app?%6dode=%77ork&lang=%65n": "/app?mode=work&lang=en",
    "/app?mode=work&mode=explore&lang=es&lang=en": "/app?mode=work&lang=es",
    "/app?mode=bad&mode=work": "/app",
    "/app#https://evil.example?mode=work": "/app",
  };
  for (const [input, expected] of Object.entries(cases))
    assert.equal(appPath(input), expected, input);
});

test("browser and Node use the same safe next behavior", () => {
  const context = vm.createContext({ window: {}, URL, URLSearchParams });
  vm.runInContext(
    fs.readFileSync(require.resolve("../dist/navigation.js"), "utf8"),
    context,
  );
  for (const value of [
    "/app?mode=work&pack=planilhas-confiaveis&lang=en",
    "//evil.example",
    "/app?view=journeys&chapter=lab",
    "/app?face=front&spin=on",
  ])
    assert.equal(context.window.DeckNavigation.appPath(value), appPath(value));
});

function responseFor(url, headers = {}) {
  const response = {
    writeHead(status, headers) {
      this.status = status;
      this.headers = headers;
    },
    end(body) {
      this.ended = true;
      this.body = body;
    },
  };
  app({ url, headers }, response);
  return response;
}

test("unauthenticated app redirects preserve the work destination and language through login", () => {
  for (const lang of ["pt", "en", "es"])
    for (const pack of ["planilhas-confiaveis", "power-bi-sob-controle"]) {
      const response = responseFor(
        `/app?mode=work&pack=${pack}&lang=${lang}&skill=DD-042&chapter=start&step=2`,
      );
      assert.equal(response.status, 303);
      assert.equal(response.headers["Cache-Control"], "no-store");
      assert.ok(response.ended);
      const login = new URL(response.headers.Location, "https://deck.invalid");
      assert.equal(login.origin, "https://deck.invalid");
      assert.equal(login.pathname, "/acesso");
      assert.equal(login.searchParams.get("lang"), lang === "pt" ? null : lang);
      const next = new URL(
        appPath(login.searchParams.get("next")),
        "https://deck.invalid",
      );
      assert.equal(next.pathname, "/app");
      assert.equal(next.searchParams.get("mode"), "work");
      assert.equal(next.searchParams.get("pack"), pack);
      assert.equal(next.searchParams.get("lang"), lang);
      assert.equal(next.searchParams.get("skill"), "DD-042");
      assert.equal(next.searchParams.get("step"), "2");
    }
});

test("default app login redirect is minimal and cookie locale remains available without a next destination", () => {
  assert.equal(responseFor("/app").headers.Location, "/acesso");
  assert.equal(
    responseFor("/app?next=https://evil.example&token=private").headers
      .Location,
    "/acesso",
  );
  assert.equal(
    responseFor("/app", { cookie: "deck_locale=es" }).headers.Location,
    "/acesso?lang=es",
  );
  const response = responseFor(
    "/app?mode=work&lang=en&next=https://evil.example",
    { cookie: "deck_locale=es" },
  );
  const target = new URL(response.headers.Location, "https://deck.invalid");
  assert.equal(target.searchParams.get("lang"), "en");
  assert.equal(target.searchParams.get("next"), "/app?mode=work&lang=en");
});
