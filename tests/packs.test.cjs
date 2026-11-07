"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  os = require("node:os");
const { spawnSync } = require("node:child_process");
const { unzipSync, strFromU8 } = require("fflate");
const { packs, sourceReleases } = require("../data/packs.cjs");
const {
  getPacks,
  getPack,
  calculateReference,
  loadPackArchives,
  buildPackArchive,
  validatePackQuery,
  sha256,
  MAX_SOURCE_BYTES,
} = require("../lib/packs.cjs");
const constROOT = path.resolve(__dirname, "..");
function archivesFor(pack) {
  return new Map(
    pack.steps.map((s) => [
      s.skillId,
      fs.readFileSync(
        path.join(constROOT, ".local/releases/1.2.0", s.skillId + ".zip"),
      ),
    ]),
  );
}
const available = fs.existsSync(path.join(constROOT, ".local/releases/1.2.0"));
const privateOptions = {
  skip: available
    ? false
    : "Private 1.2.0 archives required for archive integration checks.",
};
function cleanup(dir) {
  const root = path.resolve(os.tmpdir()),
    target = path.resolve(dir),
    relative = path.relative(root, target);
  assert.ok(
    relative && !relative.startsWith("..") && !path.isAbsolute(relative),
  );
  assert.match(path.basename(target), /^deck-pack-/);
  fs.rmSync(target, { recursive: true, force: true });
}
test("two authored packs retain schema and ordered IDs across all languages", () => {
  const before = JSON.stringify(packs);
  for (const locale of ["pt", "en", "es"]) {
    const result = getPacks(locale);
    assert.equal(result.length, 2);
    for (let i = 0; i < result.length; i++) {
      const pack = result[i];
      assert.equal(pack.locale, locale);
      assert.equal(pack.version, "1.0.0");
      assert.equal(pack.mode, "free-demo");
      assert.deepEqual(
        pack.steps.map((x) => x.skillId),
        packs[i].steps.map((x) => x.skillId),
      );
      assert.ok(pack.steps.length >= 3 && pack.steps.length <= 5);
      for (const field of [
        "title",
        "tagline",
        "description",
        "audience",
        "outcome",
        "rights",
        "originalsNotice",
      ])
        assert.ok(pack[field].length > 10);
      for (const s of pack.steps) {
        for (const field of [
          "id",
          "skillId",
          "title",
          "input",
          "output",
          "prompt",
        ])
          assert.ok(s[field]);
        assert.ok(s.checks.length);
      }
      for (const f of [...pack.sample.input, ...pack.sample.reference])
        assert.ok(f.filename && f.mimeType && f.content);
    }
  }
  assert.equal(JSON.stringify(packs), before);
  const en = getPacks("en"),
    es = getPacks("es"),
    pt = getPacks("pt");
  for (let i = 0; i < 2; i++) {
    assert.notEqual(en[i].title, pt[i].title);
    assert.notEqual(es[i].description, pt[i].description);
    assert.notEqual(en[i].sample.notice, pt[i].sample.notice);
  }
  assert.equal(getPack("unknown"), null);
});
test("localized fictional inputs independently reproduce the authored reference numbers", () => {
  for (const lang of ["pt", "en", "es"])
    for (let i = 0; i < 2; i++) {
      const pack = getPacks(lang)[i];
      assert.deepEqual(
        calculateReference(packs[i].kind, pack.sample.input[0].content),
        JSON.parse(pack.sample.reference[0].content),
      );
      for (const c of pack.sample.checks)
        assert.equal(
          JSON.parse(pack.sample.reference[0].content)[c.id],
          c.expected,
        );
    }
  assert.deepEqual(
    JSON.parse(getPack("power-bi-sob-controle").sample.reference[0].content)
      .months["2026-02"],
    { Sales: 200, Cost: 130, Margin: 70, MarginPct: 0.35 },
  );
});
test("reference calculation rejects conflicting duplicate rows, bad keys and invalid dates", () => {
  const csv = getPack("planilhas-confiaveis").sample.input[0].content;
  assert.throws(
    () =>
      calculateReference(
        "orders",
        csv.replace(/P-002,L-01,C,Pasta,1,80\n/, "P-002,L-01,C,Pasta,1,81\n"),
      ),
    /conflicting/,
  );
  const input = JSON.parse(
    getPack("power-bi-sob-controle").sample.input[0].content,
  );
  const badDate = structuredClone(input);
  badDate.sales[0].date = "2026-02-30";
  assert.throws(() => calculateReference("sales", JSON.stringify(badDate)));
  const duplicate = structuredClone(input);
  duplicate.sales[1].sale_id = duplicate.sales[0].sale_id;
  assert.throws(() => calculateReference("sales", JSON.stringify(duplicate)));
  const badCategory = structuredClone(input);
  badCategory.categories[0].category_id = "__proto__";
  assert.throws(() => calculateReference("sales", JSON.stringify(badCategory)));
  assert.equal(Object.prototype.Sales, undefined);
});
test("query validation blocks path tricks, unsupported languages, duplicate and extra parameters", () => {
  for (const url of [
    "/api/pack-download?id=../../x",
    "/api/pack-download?id=a&id=b",
    "/api/pack-download?id=a&lang=fr",
    "/api/pack-download?id=a&admin=true",
    "/api/pack-download?lang=en",
  ])
    assert.equal(validatePackQuery({ url }, true), false);
  assert.equal(
    validatePackQuery(
      { url: "/api/pack-download?id=planilhas-confiaveis&lang=es" },
      true,
    ),
    true,
  );
});
test(
  "database retrieval pins version and role and hashes actual bytes",
  privateOptions,
  async () => {
    const pack = getPack("planilhas-confiaveis"),
      sources = archivesFor(pack);
    const rows = [...sources].map(([skill_id, archive]) => ({
      skill_id,
      archive,
      version: "1.2.0",
      sha256: sourceReleases[skill_id],
    }));
    const found = await loadPackArchives(pack, async (sql, args) => {
      assert.match(sql, /skillmkt\.package_releases/);
      assert.match(sql, /octet_length/);
      assert.deepEqual(args, [
        pack.steps.map((x) => x.skillId),
        "1.2.0",
        MAX_SOURCE_BYTES,
        "skillmkt_app",
      ]);
      return { rows };
    });
    assert.equal(found.size, 3);
    const corrupted = rows.map((r) => ({
      ...r,
      archive: Buffer.from(r.archive),
    }));
    corrupted[0].archive[0] ^= 1;
    await assert.rejects(
      loadPackArchives(pack, async () => ({ rows: corrupted })),
      /integrity/,
    );
    await assert.rejects(
      loadPackArchives(pack, async () => ({ rows: rows.slice(1) })),
      /Missing/,
    );
    await assert.rejects(
      loadPackArchives(pack, async () => ({
        rows: rows.map((r, i) => (i ? r : { ...r, version: "1.3.0" })),
      })),
      /Invalid/,
    );
  },
);
test(
  "localized archives preserve immutable sources, validate every checksum and run the reference verifier",
  privateOptions,
  () => {
    for (const lang of ["pt", "en", "es"])
      for (const pack of getPacks(lang)) {
        const sources = archivesFor(pack),
          result = buildPackArchive(pack, sources),
          again = buildPackArchive(pack, sources);
        assert.equal(result.sha256, sha256(result.archive));
        assert.equal(result.sha256, again.sha256);
        assert.ok(result.archive.length < 4000000);
        const zip = unzipSync(result.archive),
          integrity = JSON.parse(strFromU8(zip["INTEGRITY.json"])),
          manifest = JSON.parse(strFromU8(zip["MANIFEST.json"]));
        assert.equal(manifest.locale, lang);
        assert.equal(manifest.aiExecutionTested, false);
        for (const [n, h] of Object.entries(integrity))
          assert.equal(sha256(zip[n]), h);
        assert.equal(
          Object.keys(integrity).length,
          Object.keys(zip).length - 1,
        );
        for (const s of manifest.sources)
          assert.equal(sha256(zip[s.filename]), sourceReleases[s.id]);
        assert.ok(strFromU8(zip["README.md"]).includes(pack.steps[0].prompt));
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), "deck-pack-"));
        try {
          for (const name of [
            "verify.cjs",
            ...Object.keys(zip).filter((n) => n.startsWith("sample/")),
          ]) {
            assert.ok(!name.includes(".."));
            const dest = path.join(dir, name);
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.writeFileSync(dest, zip[name]);
          }
          const ran = spawnSync(
            process.execPath,
            [path.join(dir, "verify.cjs")],
            { encoding: "utf8" },
          );
          assert.equal(ran.status, 0, ran.stderr);
          const bad = JSON.parse(
            fs.readFileSync(path.join(dir, "sample/reference.json")),
          );
          bad.total = 999;
          fs.writeFileSync(
            path.join(dir, "sample/reference.json"),
            JSON.stringify(bad),
          );
          assert.notEqual(
            spawnSync(process.execPath, [path.join(dir, "verify.cjs")], {
              encoding: "utf8",
            }).status,
            0,
          );
        } finally {
          cleanup(dir);
        }
      }
  },
);
