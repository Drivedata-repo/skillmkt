const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const examples = require("../data/examples.cjs"),
  { run } = require("../lib/example-reference.cjs");
const { findSkills } = require("../lib/match.cjs"),
  { skills, journeys } = require("../lib/catalog.cjs");
const store = require("../dist/deck-store.js"),
  { validateWaitlist } = require("../lib/waitlist.cjs");
test("all ten reference examples preserve the declared facts", () => {
  const output = (id) => {
    const x = examples.find((x) => x.kind === id);
    return run(x.kind, x.input);
  };
  assert.equal(examples.length, 10);
  assert.equal(new Set(examples.map((x) => x.skillId)).size, 10);
  assert.deepEqual(output("orders"), {
    uniqueOrders: 3,
    duplicates: ["P01"],
    byClient: { Aurora: 1700, Norte: 800 },
    total: 2500,
  });
  assert.equal(output("minutes").actions[1].due, "A confirmar");
  assert.deepEqual(output("document").sections[2].items, [
    "Integração com ERP",
  ]);
  assert.equal(output("cleanup").totals.ALFA, 200);
  assert.equal(output("cleanup").errors.length, 1);
  assert.equal(output("slides").slides.length, 3);
  assert.match(output("slides").slides[2].body, /20 pedidos/);
  assert.equal(output("margin").profit, 410);
  assert.ok(Math.abs(output("margin").margin - 410 / 1100) < 1e-10);
  assert.equal(run("margin", { rows: [] }).margin, null);
  assert.equal(output("reconcile").rows[1].difference, 300);
  assert.equal(output("reconcile").totalDifference, 300);
  assert.equal(output("requirements").flows.length, 3);
  assert.equal(output("requirements").openDecisions.length, 2);
  assert.match(output("content").draft, /Revisão de regras/);
  assert.equal(output("content").status, "Rascunho para aprovação");
  assert.equal(output("seo").issues.length, 3);
  assert.throws(
    () =>
      run("orders", {
        orders: [
          { id: "1", value: 10 },
          { id: "1", value: 20 },
        ],
      }),
    /conflitante/,
  );
});
test("catalog metadata is complete and does not claim untested execution or sales clearance", () => {
  assert.equal(skills.length, 138);
  for (const s of skills) {
    assert.ok(["1.2.0", "1.2.1"].includes(s.version));
    assert.equal(s.release.review, "structure-checked");
    assert.equal(s.release.executionTested, false);
    assert.equal(s.release.commercialCleared, false);
    assert.match(s.release.sha256, /^[a-f0-9]{64}$/);
    assert.ok(s.firstPrompt.includes(s.id));
    assert.ok(s.acceptance.length);
    assert.ok(s.release.fileCount > 0);
  }
  for (const j of journeys) {
    assert.ok(j.steps.length >= 3);
    for (const step of j.steps) assert.ok(skills.some((s) => s.id === step.id));
  }
});
test("unclear needs get one useful question and a refinement changes the ranking", () => {
  const vague = findSkills("Preciso de ajuda com minhas planilhas", "business");
  assert.equal(vague.clarification.id, "spreadsheets");
  assert.equal(vague.matches.length, 0);
  const clear = findSkills(
    "Preciso de ajuda com minhas planilhas",
    "business",
    { questionId: "spreadsheets", optionId: "formulas" },
  );
  assert.equal(clear.clarification, null);
  assert.equal(clear.matches[0].id, "claude-xlsx");
  assert.throws(
    () =>
      findSkills("Preciso de ajuda com minhas planilhas", "business", {
        questionId: "bi",
        optionId: "numbers",
      }),
    /opções/,
  );
  assert.equal(
    findSkills("Quero um protótipo navegável para validar minha ideia")
      .matches[0].id,
    "prototipos-e-especificacao-funcional",
  );
  const wide = findSkills(
    "Criar e revisar uma aplicação web com código, design, dados e documentação",
    "technical",
  );
  assert.ok(wide.candidateIds.length > 3);
  assert.ok(wide.candidateIds.length <= 20);
  assert.equal(
    findSkills("Preciso plantar flores na varanda").matches.length,
    0,
  );
});
test("personal deck import validates IDs, versions, size-independent shape and progress", () => {
  const id = skills[0].id,
    raw = {
      schema: 1,
      favorites: [id, id, "not-a-skill"],
      downloads: [
        { id, version: "1.0.0", at: "2026-11-01T00:00:00Z" },
        { id, version: "<script>", at: "yesterday" },
      ],
      journeys: [journeys[0].id, "x"],
      plans: [
        {
          id: "valid-plan",
          title: "Sequência",
          skillIds: [skills[0].id, skills[1].id],
          privateField: "discard",
        },
        { id: "duplicates", title: "Inválido", skillIds: [id, id] },
        { id: "unknown", title: "Inválido", skillIds: [id, "not-a-skill"] },
        {
          id: "<script>",
          title: "Inválido",
          skillIds: [skills[0].id, skills[1].id],
        },
      ],
      progress: { [id]: { platform: "other", tested: "yes", installed: true } },
    };
  const clean = store.clean(
    raw,
    skills.map((s) => s.id),
    journeys.map((j) => j.id),
  );
  assert.deepEqual(clean.favorites, [id]);
  assert.equal(clean.downloads.length, 1);
  assert.equal(clean.progress[id].tested, false);
  assert.equal(clean.progress[id].installed, true);
  assert.equal(clean.journeys.length, 1);
  assert.deepEqual(clean.plans, [
    {
      id: "valid-plan",
      title: "Sequência",
      skillIds: [skills[0].id, skills[1].id],
    },
  ]);
  const plans = Array.from({ length: 20 }, (_, i) => ({
    id: "plan-" + i,
    title: "Plano " + i,
    skillIds: [skills[0].id, skills[1].id],
  }));
  assert.deepEqual(
    store.clean(
      { schema: 1, plans: [...plans, plans[19]] },
      skills.map((s) => s.id),
    ).plans,
    plans,
  );
  assert.equal(store.latest(clean, id).version, "1.0.0");
  assert.throws(() => store.clean({ schema: 900 }, []));
  assert.deepEqual(
    store.load(
      {
        getItem() {
          throw new Error();
        },
      },
      [],
      [],
    ),
    store.empty(),
  );
  assert.equal(
    store.save(
      {
        setItem() {
          throw new Error();
        },
      },
      clean,
    ),
    false,
  );
});
test("waitlist requires valid consent, bounded inputs and allowed interests", () => {
  const input = {
    name: "Teste da demo",
    email: "QA-Deck-Release@example.invalid",
    audience: "business",
    interest: "explore",
    consent: true,
  };
  assert.equal(
    validateWaitlist(input).email,
    "qa-deck-release@example.invalid",
  );
  for (const patch of [
    { consent: false },
    { email: "invalid" },
    { interest: "sql" },
    { name: "x" },
    { name: "x".repeat(101) },
  ])
    assert.throws(() => validateWaitlist({ ...input, ...patch }));
});
test(
  "current release ZIPs and waitlist database privileges are enforced",
  { skip: !process.env.DATABASE_URL },
  async () => {
    const { db } = require("../lib/db.cjs"),
      { unzipSync } = require("fflate");
    const pool = db();
    try {
      const releases = await pool.query(
        "SELECT skill_id,version,archive,sha256 FROM skillmkt.package_releases WHERE version IN ('1.2.0','1.2.1')",
      );
      const current = releases.rows.filter(
        (row) =>
          row.version === skills.find((s) => s.id === row.skill_id).release.version,
      );
      assert.equal(current.length, 138);
      for (const row of current) {
        const s = skills.find((s) => s.id === row.skill_id);
        assert.equal(row.sha256, s.release.sha256);
        assert.equal(
          crypto.createHash("sha256").update(row.archive).digest("hex"),
          row.sha256,
        );
        const files = unzipSync(row.archive),
          manifest = JSON.parse(Buffer.from(files["MANIFEST.json"]));
        assert.equal(manifest.version, row.version);
        assert.ok(files["COMO-USAR.md"]);
        const hashes = JSON.parse(Buffer.from(files["INTEGRIDADE.json"]));
        for (const [name, digest] of Object.entries(hashes))
          assert.equal(
            crypto.createHash("sha256").update(files[name]).digest("hex"),
            digest,
          );
        if (s.example) assert.ok(files["exemplo/run.cjs"]);
      }
      const rights = await pool.query(
        "SELECT has_table_privilege(current_user,'skillmkt.waitlist','SELECT') AS can_read,has_table_privilege('anon','skillmkt.waitlist','INSERT') AS anon_write,has_table_privilege(current_user,'skillmkt.package_releases','UPDATE') AS edit_release",
      );
      assert.deepEqual(rights.rows[0], {
        can_read: false,
        anon_write: false,
        edit_release: false,
      });
      const c = await pool.connect();
      try {
        await c.query("BEGIN");
        const params = [
          "Teste da demo",
          "qa-deck-release@example.invalid",
          "business",
          "explore",
        ];
        const sql =
          "INSERT INTO skillmkt.waitlist(name,email,audience,interest,consent_version) VALUES($1,$2,$3,$4,'2026-11-06') ON CONFLICT DO NOTHING";
        const first = await c.query(sql, params);
        const duplicate = await c.query(sql, params);
        assert.ok(first.rowCount <= 1);
        assert.equal(duplicate.rowCount, 0);
        await c.query("ROLLBACK");
      } finally {
        c.release();
      }
    } finally {
      await pool.end();
    }
  },
);
