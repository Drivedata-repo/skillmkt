"use strict";
const { test } = require("node:test"), assert = require("node:assert/strict"), crypto = require("node:crypto");
const salt = crypto.randomBytes(16).toString("hex");
process.env.DEMO_PASSWORD_HASH = salt + ":" + crypto.scryptSync("guide-test", salt, 64).toString("hex");
process.env.DEMO_SESSION_SECRET = crypto.randomBytes(32).toString("hex");
const auth = require("../lib/auth.cjs");
const rights = require("../data/sale-rights.cjs");
const skills = require("../data/skills.cjs");
const { officialGuide } = require("../lib/official-guides.cjs");

function call(handler, url) {
  return new Promise((resolve) => {
    const res = {
      status: 0, headers: {}, setHeader(k, v) { this.headers[k] = v; },
      writeHead(s, h) { this.status = s; this.headers = h || {}; },
      end(b) { resolve({ status: this.status, body: String(b || "") }); },
    };
    handler({ method: "GET", url, headers: { cookie: "drive_demo=" + auth.issue() }, socket: {} }, res);
  });
}

test("as cartas sem permissão viram guia e as vendáveis não", () => {
  const blocked = [...rights.proprietary, ...rights.noLicense];
  assert.equal(blocked.length, 42);
  for (const id of blocked) {
    for (const locale of ["pt", "en", "es"]) {
      const guide = officialGuide(id, locale);
      assert.ok(guide, id);
      assert.match(guide.url, /^https:\/\//);
      assert.ok(guide.publisher && guide.note.length > 30);
    }
  }
  for (const s of skills) if (!blocked.includes(s.id)) assert.equal(officialGuide(s.id), null, s.id);
});

test("o download da demo não entrega carta sem permissão", async () => {
  const download = require("../api/download.js");
  for (const id of ["claude-xlsx", "figma-use", "claude-security"]) {
    const r = await call(download, "/api/download?id=" + id);
    assert.equal(r.status, 403, id);
    assert.match(r.body, /fonte oficial/);
  }
});

test("a carta 138 é autoria DriveData, está à venda e no catálogo", () => {
  const { skills: catalog } = require("../lib/catalog.cjs");
  const card = catalog.find((s) => s.id === "orquestrador-de-modelos");
  assert.equal(card.code, "DD-138");
  assert.equal(card.version, "1.2.1");
  assert.ok(require("../lib/sale-rights.cjs").canSell(card.id));
});
