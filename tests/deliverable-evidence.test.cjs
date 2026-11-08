"use strict";
const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const evidence = require("../data/deliverable-evidence.json"),
  catalog = require("../lib/catalog.cjs"),
  {
    cases,
    validateExtracted,
    checkIds,
  } = require("../scripts/run-deliverable-evals.cjs"),
  {
    getDeliverableSamples,
    getDeliverableReadiness,
    validArtifact,
  } = require("../lib/deliverable-evidence.cjs");
test("ten actual artifact scenarios remain distinct from full skill certification", () => {
  assert.equal(cases.length, 10);
  assert.equal(evidence.scenarios.length, 10);
  assert.equal(new Set(cases.map((c) => c.skillId)).size, 10);
  assert.equal(
    evidence.scenarios.filter((s) => s.status === "passed").length,
    10,
  );
  assert.equal(
    evidence.scenarios.reduce((n,s) => n+s.artifacts.length,0),
    13,
  );
  const blocked = evidence.scenarios.find((s) => s.caseId === "margin-workbook");
  assert.equal(blocked.caseId, "margin-workbook");
  assert.equal(blocked.attempts.filter(a => a.outputsProduced === 0).length, 3);
  assert.ok(blocked.attempts.some(a => a.status === "limited-deliverable-verified"));
  assert.equal(evidence.ownerAcceptance,"pending");
  for (const s of evidence.scenarios) {
    const skill = catalog.skills.find((x) => x.id === s.skillId);
    assert.ok(skill);
    const onBaseline = skill.release.version === "1.2.1";
    assert.equal(s.version, onBaseline ? skill.release.baselineVersion : skill.release.version);
    assert.equal(s.packageSha256, onBaseline ? skill.release.baselinePackageSha256 : skill.release.sha256);
    assert.match(s.sourceSha256, /^[a-f0-9]{64}$/);
    assert.equal(s.passed, true);
    assert.equal(s.assistantExecuted, true);
    assert.equal(s.executionVerified, false);
    assert.equal(s.fullSkillExecutionVerified, false);
    assert.equal(s.ownerAcceptance,"pending");
    assert.ok(s.artifacts.every(validArtifact));
    assert.ok(validArtifact(s.inputs));
    assert.ok(s.reviewArtifacts.length && s.reviewArtifacts.every(validArtifact));
    assert.ok(s.checks.every((c) => c.passed === true));
    assert.deepEqual(
      s.checks.map((c) => c.id),
      checkIds(cases.find((c) => c.id === s.caseId)),
    );
  }
});
for (const locale of ["pt", "en", "es"])
  test(`${locale}: only current verified files become downloadable samples`, () => {
    let count = 0;
    let samples = 0;
    for (const skill of catalog.skills) {
      for(const sample of getDeliverableSamples(skill,locale)){
        samples++;
        assert.ok(sample.artifacts.length && sample.artifacts.every(validArtifact));
        assert.ok(sample.reviewUrl.startsWith('/ensaios/') && sample.reviewLabel && sample.reviewNote);
        assert.equal(sample.fullSkillExecutionVerified,false);
      }
      for (const r of getDeliverableReadiness(skill, locale)) {
        count++;
        assert.ok(r.title.length > 10 && r.scope.length > 30);
        assert.ok(
          r.statusLabel &&
            r.prerequisites.length >= 3 &&
            r.limitations.length >= 3,
        );
        assert.ok(r.checks.every((c) => c.label && c.passed === true));
        assert.equal(r.currentVersion, true);
        assert.equal(r.passed, true);
        assert.equal(r.fullSkillExecutionVerified, false);
      }
    }
    assert.equal(count, 10);
    assert.equal(samples,10);
  });
test("failed or mismatched evidence never inherits an approval", () => {
  const record=evidence.scenarios[0], skill=catalog.skills.find(s=>s.id===record.skillId),original=structuredClone(record);
  try{
    record.status='blocked';assert.deepEqual(getDeliverableSamples(skill),[]);
    record.status='passed';record.packageSha256='0'.repeat(64);assert.deepEqual(getDeliverableSamples(skill),[]);
    record.packageSha256=original.packageSha256;record.checks[0].passed=false;assert.deepEqual(getDeliverableSamples(skill),[]);
    record.checks[0].passed=true;record.artifacts[0].sha256='0'.repeat(64);assert.deepEqual(getDeliverableSamples(skill),[]);
  }finally{Object.assign(record,original);}
});
test("locale data has translated evaluation copy and preserves numeric scenario facts", () => {
  for (const s of evidence.scenarios) {
    for (const lang of ["en", "es"]) {
      assert.notEqual(s.copy[lang].title, s.copy.pt.title);
      assert.notEqual(s.copy[lang].scope, s.copy.pt.scope);
      assert.deepEqual(
        s.copy[lang].scope.match(/\d+(?:[./-]\d+)*/g),
        s.copy.pt.scope.match(/\d+(?:[./-]\d+)*/g),
      );
    }
    assert.ok(
      s.checks.every((c) => Object.keys(c.labels).sort().join() === "en,es,pt"),
    );
  }
});
test("public evidence contains no private prompt, source text, local logs or credentials", () => {
  const raw = JSON.stringify(evidence);
  for (const bad of [
    /SKILL SOURCE/,
    /postgresql:\/\//,
    /private-events/,
    /private-runtime/,
    /[A-Z]:\\\\Users/i,
    /promptSha256/,
    /Drivedata@@/,
  ])
    assert.doesNotMatch(raw, bad);
  assert.equal(
    validArtifact({
      url: "/evidence-assets/../../private.txt",
      sha256: "a".repeat(64),
    }),
    false,
  );
  assert.equal(
    validArtifact({
      url: "https://example.com/file.pdf",
      sha256: "a".repeat(64),
    }),
    false,
  );
  assert.equal(
    validArtifact({
      url: "/evidence-assets/missing.pdf",
      sha256: "a".repeat(64),
    }),
    false,
  );
});
test("missing or unreadable outputs fail every scenario before content evaluation", () => {
  for (const c of cases) {
    assert.deepEqual(validateExtracted(c.id, {}), { files: false });
    const corrupt = Object.fromEntries(
      c.outputs.map((n) => [n, { error: "BadZipFile" }]),
    );
    assert.deepEqual(validateExtracted(c.id, corrupt), { files: false });
  }
});
const fixtures = {
  "margin-workbook": {
    "margin.xlsx": {
      externalLinks: 0,
      sheets: {
        Margens: [
          ["Product", "Revenue", "Cost", "Profit", "Margin"],
          ["A", 1000, 600, "=B2-C2", "=IFERROR(D2/B2,0)"],
          ["B", 100, 90, "=B3-C3", "=IFERROR(D3/B3,0)"],
          [
            "Total",
            "=SUM(B2:B3)",
            "=SUM(C2:C3)",
            "=B4-C4",
            "=IFERROR(D4/B4,0)",
          ],
        ],
      },
    },
  },
  "proposal-document": {
    "proposal.docx": {
      text: "Aurora Demo; Mapear indicadores; Criar painel demonstrativo; Exclusões: Integracao com ERP; Conferir indicadores com a fonte ficticia; A confirmar; Dados fictícios",
      tables: [[["Preço", "A confirmar"]]],
    },
  },
  "editable-slides": {
    "presentation.pptx": {
      slides: [["20 pedidos fictícios"], ["5 pendentes"], ["Revisar os 5"]],
      ratio: 16 / 9,
      text: "20 pedidos fictícios; 5 pendentes; Revisar os 5",
    },
  },
  "summary-pdf": {
    "summary.pdf": {
      pages: 1,
      text: "Dados fictícios P01 1200 P02 800 P03 500 Total 2500",
    },
  },
  "meeting-minutes": {
    "minutes.docx": {
      text: "Aurora. Dados fictícios",
      tables: [
        [
          ["Ana", "Revisar cadastro", "2026-11-10"],
          ["Bruno", "Validar relatorio", "A confirmar"],
        ],
      ],
    },
  },
  "model-documentation": Object.fromEntries(
    ["model-documentation.docx", "model-documentation.md"].map((n) => [
      n,
      {
        text: "Sales Product SaleId ProductId Revenue Cost ProductName TotalRevenue TotalCost MarginPct SUM(Sales[Revenue]) SUM(Sales[Cost]) DIVIDE([TotalRevenue]-[TotalCost],[TotalRevenue]) RLS não validado. Dados fictícios.",
      },
    ]),
  ),
  "power-query-review": {
    "revised.pq": {
      text: 'let Source=#table({"Id","Amount"},{{1,"10,50"},{2,null},{3,"20,00"}}), Converted=Table.TransformColumns(Source,{{"Amount",each if _ = null then null else Number.FromText(_,"pt-BR"),type number}}) in Converted',
    },
    "diagnosis.md": {
      text: "Soma 30.5. Motor não executado; folding não testado.",
    },
  },
  "dax-review": {
    "revised.dax": {
      text: "Revenue Total = SUM(Sales[Revenue])\nMarginPct = DIVIDE([Revenue Total]-SUM(Sales[Cost]),[Revenue Total])",
    },
    "diagnosis.md": {
      text: "1100 receita, 690 custo, lucro 410. BLANK em zero. A=0.4, B=0.1. Motor não executado; desempenho não medido.",
    },
  },
  "request-prototype": {
    "prototype.html": {
      text:
        "Aurora Solicita REQ-001 Aberta Operador Dados fictícios <label>Assunto</label><script>/* local */</script>" +
        [
          "nav-new",
          "nav-list",
          "subject",
          "description",
          "submit-request",
          "validation",
          "request-list",
          "role-select",
        ]
          .map((id) => `<div data-testid="${id}"></div>`)
          .join(""),
    },
  },
  "orders-consolidation": {
    "orders.xlsx": {
      externalLinks: 0,
      sheets: {
        Pedidos: [
          ["Id", "Client", "Value", "Source"],
          ["P01", "Aurora", 1200, "batch-a.csv batch-b.csv"],
          ["P02", "Norte", 800, "batch-a.csv"],
          ["P03", "Aurora", 500, "batch-b.csv"],
        ],
        Duplicatas: [["P01", "batch-a.csv batch-b.csv"]],
        Resumo: [
          ["Aurora", "=SUMIF(Pedidos!B2:B4,A1,Pedidos!C2:C4)"],
          ["Norte", "=SUMIF(Pedidos!B2:B4,A2,Pedidos!C2:C4)"],
          ["Total", "=SUM(B1:B2)"],
        ],
      },
    },
  },
};
for (const [id, fixture] of Object.entries(fixtures))
  test(`${id}: independent readback oracle accepts its bounded reference`, () => {
    const result = validateExtracted(id, fixture);
    assert.ok(Object.values(result).every(Boolean), JSON.stringify(result));
    assert.equal(result.visual, undefined);
    assert.equal(result.recalc, undefined);
    assert.equal(result.interaction, undefined);
  });
test("oracles reject misleading values, formulas, invented deadlines and missing editable content", () => {
  let f = structuredClone(fixtures["margin-workbook"]);
  f["margin.xlsx"].sheets.Margens[3][4] = "=AVERAGE(E2:E3)";
  assert.equal(validateExtracted("margin-workbook", f).formulas, false);
  f = structuredClone(fixtures["meeting-minutes"]);
  f["minutes.docx"].tables[0][1][2] = "A confirmar 2026-11-11";
  assert.equal(validateExtracted("meeting-minutes", f).content, false);
  f = structuredClone(fixtures["editable-slides"]);
  f["presentation.pptx"].slides[2] = [];
  assert.equal(validateExtracted("editable-slides", f).content, false);
  f = structuredClone(fixtures["summary-pdf"]);
  f["summary.pdf"].text = f["summary.pdf"].text.replace("2500", "2600");
  assert.equal(validateExtracted("summary-pdf", f).content, false);
  f = structuredClone(fixtures["proposal-document"]);
  f["proposal.docx"].text += " R$ 9000";
  assert.equal(validateExtracted("proposal-document", f).content, false);
  f = structuredClone(fixtures["orders-consolidation"]);
  f["orders.xlsx"].sheets.Pedidos.push(["P01", "Aurora", 1200, "batch-b.csv"]);
  assert.equal(validateExtracted("orders-consolidation", f).content, false);
  f = structuredClone(fixtures["request-prototype"]);
  f["prototype.html"].text +=
    '<script src="https://example.com/tracker.js"></script>';
  assert.equal(validateExtracted("request-prototype", f).content, false);
  f = structuredClone(fixtures["dax-review"]);
  f["revised.dax"].text = f["revised.dax"].text.replace("DIVIDE", "UNSAFE");
  assert.equal(validateExtracted("dax-review", f).content, false);
  f = structuredClone(fixtures["power-query-review"]);
  f["revised.pq"].text = f["revised.pq"].text.replace("pt-BR", "en-US");
  assert.equal(validateExtracted("power-query-review", f).content, false);
});
test("valid nullable M types and participant tables do not cause false rejections", () => {
  const m=structuredClone(fixtures['power-query-review']);
  m['revised.pq'].text=m['revised.pq'].text.replace('type number','type nullable number');
  assert.equal(validateExtracted('power-query-review',m).content,true);
  const minutes=structuredClone(fixtures['meeting-minutes']);
  minutes['minutes.docx'].tables.unshift([['Ana','Responsável pelo cadastro'],['Bruno','Responsável pelo relatório']]);
  assert.equal(validateExtracted('meeting-minutes',minutes).content,true);
});
