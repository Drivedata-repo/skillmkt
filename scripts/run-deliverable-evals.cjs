"use strict";
// Opt-in artifact scenarios: the assistant writes the generator and output files.
// This harness supplies fictional inputs and independently inspects the outputs.
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto"),
  { spawn, spawnSync } = require("node:child_process");
const { readSource } = require("./run-assistant-evals.cjs");
const { unzipSync } = require("fflate");
const sha = (x) => crypto.createHash("sha256").update(x).digest("hex");
// Stage the exact complete release, including the contract and referenced tools.
// Never flatten paths: relative references in SKILL.md must keep working.
function stageRelease(directory, skillId, version, expectedHash) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skillId) || !/^\d+\.\d+\.\d+$/.test(version))
    throw Error("Invalid release source");
  const bytes = fs.readFileSync(path.resolve(__dirname, `../.local/releases/${version}/${skillId}.zip`));
  if (sha(bytes) !== expectedHash) throw Error("Release changed before staging");
  const target = path.resolve(directory, "skill-source"), entries = unzipSync(bytes);
  const staged = Object.entries(entries).map(([name, content]) => {
    if (name.includes("\\") || name.includes(":") || name.startsWith("/") || name.split("/").some(x => x === ".." || x === "."))
      throw Error("Unsafe release entry");
    const destination = path.resolve(target, name);
    if (!destination.startsWith(target + path.sep)) throw Error("Release entry escaped staging");
    return { name, content, destination };
  });
  for (const entry of staged) {
    if (entry.name.endsWith("/")) { fs.mkdirSync(entry.destination, {recursive:true}); continue; }
    fs.mkdirSync(path.dirname(entry.destination), {recursive:true});
    fs.writeFileSync(entry.destination, entry.content, {flag:"wx"});
  }
  return { entrypoint: `skill-source/${skillId}/SKILL.md`, files: staged.length, packageSha256: expectedHash };
}
function stagedReleaseIntact(directory, skillId, version, expectedHash) {
  const bytes = fs.readFileSync(path.resolve(__dirname, `../.local/releases/${version}/${skillId}.zip`));
  if (sha(bytes) !== expectedHash) return false;
  const base = path.resolve(directory, "skill-source") + path.sep;
  return Object.entries(unzipSync(bytes)).every(([name, content]) => {
    const destination = path.resolve(base, name);
    return destination.startsWith(base) && (name.endsWith("/") ||
      (fs.existsSync(destination) && sha(fs.readFileSync(destination)) === sha(content)));
  });
}
const cases = [
  {
    id: "margin-workbook",
    skillId: "claude-xlsx",
    files: { "sales.csv": "Product,Revenue,Cost\nA,1000,600\nB,100,90\n" },
    outputs: ["margin.xlsx"],
    task: "Produce margin.xlsx with sheet Margens. A1:E1 = Product, Revenue, Cost, Profit, Margin. Source rows at rows 2 and 3. D2/D3 must be formulas revenue minus cost; E2/E3 formulas guarded division. Row4 must be totals: B4=SUM(B2:B3), C4=SUM(C2:C3), D4=B4-C4, E4=IFERROR(D4/B4,0). No average of row margins. Currency and percentage formats, readable column widths, a fictional-data note below the table. Use actual Excel formulas, not just values. Independent host verification will open and recalculate with Excel; do not invoke Office COM yourself.",
  },
  {
    id: "proposal-document",
    skillId: "claude-docx",
    files: {
      "brief.json": {
        project: "Aurora Demo",
        fictional: true,
        scope: ["Mapear indicadores", "Criar painel demonstrativo"],
        exclusions: ["Integracao com ERP"],
        acceptance: "Conferir indicadores com a fonte ficticia",
        price: null,
      },
    },
    outputs: ["proposal.docx"],
    task: "Produce a polished editable proposal.docx in Portuguese, maximum2pages. Include the project name, scope, explicit exclusions, acceptance and price 'A confirmar'. Add a visible 'Dados ficticios para demonstracao' note. Preserve every supplied fact and do not invent a price, date, customer result or integration. Use headings and an organized table. Independent host checks will open it in Word and export PDF; do not run COM.",
  },
  {
    id: "editable-slides",
    skillId: "claude-pptx",
    files: {
      "brief.json": {
        project: "Aurora Demo",
        fictional: true,
        audience: "Equipe comercial",
        facts: [
          "Foram recebidos 20 pedidos ficticios.",
          "5 pedidos ficticios aguardam revisao.",
          "Proximo passo: revisar os 5 pedidos pendentes.",
        ],
      },
    },
    outputs: ["presentation.pptx"],
    task: "Produce presentation.pptx, exactly3editable16:9slides in Portuguese, based only on the supplied facts: situation, pending work, next step. Large typography, clear visual hierarchy, no charts with invented data and no external images. Include a small fictional-data note. Native editable text/shapes, no single full-slide screenshot. Use python-pptx available locally; no package installation or Office COM. Host will inspect PPTX and render with PowerPoint.",
  },
  {
    id: "summary-pdf",
    skillId: "claude-pdf",
    files: {
      "orders.json": {
        fictional: true,
        orders: [
          { id: "P01", value: 1200 },
          { id: "P02", value: 800 },
          { id: "P03", value: 500 },
        ],
      },
    },
    outputs: ["summary.pdf"],
    task: "Create a one-page readable summary.pdf in Portuguese with a title, fictional-data note, table containing P01=1200,P02=800,P03=500 and total2500. All text must be selectable. Use ReportLab in the supplied managed Python runtime and reopen with pypdf. Do not use web resources. Independent host validation will use PyMuPDF to extract text, count pages and render the PDF.",
  },
  {
    id: "meeting-minutes",
    skillId: "claude-acta-drivedata",
    files: {
      "transcript.txt":
        "Reuniao ficticia: Revisao Aurora. Data 2026-11-07. Ana: assumo revisar o cadastro ate 2026-11-10. Bruno: vou validar o relatorio, mas ainda nao definimos prazo. As duas acoes foram acordadas. Nao foi autorizada integracao ou publicacao. Nao enviar mensagens.",
    },
    outputs: ["minutes.docx"],
    task: "Create minutes.docx in Portuguese (explicit language override), with meeting context and an editable action table: action, owner, deadline. Ana deadline2026-11-10; Bruno must say 'A confirmar', never invent a date. Include a fictional-data note. No email sending, no production actions. Maximum2pages. Use python-docx and leave COM validation to host.",
  },
  {
    id: "model-documentation",
    skillId: "claude-bi-documentation",
    files: {
      "model.bim": {
        name: "AuroraModel",
        compatibilityLevel: 1600,
        model: {
          culture: "pt-BR",
          tables: [
            {
              name: "Sales",
              columns: [
                { name: "SaleId", dataType: "int64" },
                { name: "ProductId", dataType: "int64" },
                { name: "Revenue", dataType: "double" },
                { name: "Cost", dataType: "double" },
              ],
              measures: [
                { name: "TotalRevenue", expression: "SUM(Sales[Revenue])" },
                { name: "TotalCost", expression: "SUM(Sales[Cost])" },
                {
                  name: "MarginPct",
                  expression:
                    "DIVIDE([TotalRevenue] - [TotalCost], [TotalRevenue])",
                },
              ],
            },
            {
              name: "Product",
              columns: [
                { name: "ProductId", dataType: "int64" },
                { name: "ProductName", dataType: "string" },
              ],
            },
          ],
          relationships: [
            {
              name: "Sales_Product",
              fromTable: "Sales",
              fromColumn: "ProductId",
              toTable: "Product",
              toColumn: "ProductId",
              crossFilteringBehavior: "oneDirection",
            },
          ],
        },
      },
    },
    outputs: ["model-documentation.docx", "model-documentation.md"],
    task: "Read the fictional model.bim and create model-documentation.docx and a matching Markdown companion in Portuguese. Document all2tables,6columns,3measures and1relationship, including exact DAX expressions and relationship endpoints. Distinguish source facts from unverified behavior. Explicitly state that no Power BI connection, refresh, DAX execution or RLS validation occurred. Do not invent roles, sources, customers, charts or performance. Use python-docx; host validates coverage and Word opening. Visual acceptance: keep each small inventory table on one page, with its heading. Keep each measure heading, metadata, formula and explanation together. Avoid stranded headings and a single table row at a page bottom. Use explicit page breaks when useful; this requirement follows a failed pagination review of a prior attempt.",
  },
  {
    id: "power-query-review",
    skillId: "claude-power-query-best-practices",
    files: {
      "original.pq":
        'let\n Source = #table({"Id","Amount"}, {{1,"10,50"},{2,null},{3,"20,00"}}),\n Buffered = Table.Buffer(Source),\n Converted = Table.TransformColumns(Buffered, {{"Amount", each Number.FromText(_), type number}})\nin Converted\n',
    },
    outputs: ["revised.pq", "diagnosis.md"],
    task: "Review the supplied self-contained M query. Produce revised.pq and diagnosis.md in Portuguese. Preserve all3rows and source values; remove needless Table.Buffer; parse numeric text explicitly using pt-BR and retain null as null. Declare types. Expected non-null values10.5 and20.0,sum30.5. Do not introduce a network source, database or credentials. Explain that M engine execution and folding were NOT tested here, and that this literal source has no remote folding to benchmark. This is a code deliverable with static review, not executed Power Query.",
  },
  {
    id: "dax-review",
    skillId: "claude-power-bi-dax-optimization",
    files: {
      "original.dax":
        "Revenue Total = SUMX(Sales, Sales[Revenue])\nMarginPct = ([Revenue Total] - SUM(Sales[Cost])) / [Revenue Total]\n",
      "sales.json": {
        fictional: true,
        rows: [
          { product: "A", revenue: 1000, cost: 600 },
          { product: "B", revenue: 100, cost: 90 },
        ],
      },
    },
    outputs: ["revised.dax", "diagnosis.md"],
    task: "Produce revised.dax and diagnosis.md in Portuguese. Keep measure names Revenue Total and MarginPct; use SUM for a simple additive Revenue column and DIVIDE for safe margin (blank when denominatorzero). Use VAR where useful. Explain semantics, expected Revenue1100,Cost690,Profit410,Margin410/1100, including filtered productA margin0.4, productB0.1 and zero-revenue BLANK. Do not claim measured speedup, DAX engine execution, full equivalence or live model validation: no Power BI engine exists for this scenario. No external connections.",
  },
  {
    id: "request-prototype",
    skillId: "prototipos-e-especificacao-funcional",
    files: {
      "requirements.json": {
        fictional: true,
        title: "Aurora Solicita",
        fields: ["Assunto", "Descricao"],
        required: "Assunto",
        states: ["Aberta", "Em atendimento", "Concluida"],
        roles: ["Solicitante", "Operador"],
        initialItems: [
          { id: "REQ-001", subject: "Revisar painel", status: "Aberta" },
        ],
      },
    },
    outputs: ["prototype.html"],
    task: "Create one self-contained prototype.html in Portuguese, all CSS/JS inline, no network URLs or dependencies. User can switch between two views 'Nova solicitacao' and 'Minhas solicitacoes', submit nonempty Assunto and Descricao, see validation when Assunto empty, see the new row with Aberta, and change a row status as Operador. Include visible data-is-fictional and no-real-security/no-backend notices. In-memory only. Accessible label/input connections and buttons. Use data-testid values: nav-new,nav-list,subject,description,submit-request,validation,request-list,role-select. No login secrets. Host will inspect structure and coordinator will exercise browser behavior.",
  },
  {
    id: "orders-consolidation",
    skillId: "automacao-documentos-office",
    files: {
      "batch-a.csv": "Id,Client,Value\nP01,Aurora,1200\nP02,Norte,800\n",
      "batch-b.csv": "Id,Client,Value\nP01,Aurora,1200\nP03,Aurora,500\n",
    },
    outputs: ["orders.xlsx"],
    task: "Create orders.xlsx from the two fictional CSVs, deduplicating identical orders by Id. Sheet Pedidos has header Id,Client,Value,Source and3unique rows; Source for duplicate P01 must retain both batch filenames. Sheet Duplicatas lists P01 and both origins. Sheet Resumo shows Aurora1700,Norte800,total2500 using real SUMIF/SUM formulas referring to Pedidos, not manual total-only numbers. Add fictional-data note. Use openpyxl or xlsxwriter. Host recalculates Excel independently; do not invoke COM.",
  },
];
const titles = [
  [
    "Planilha de margem ponderada",
    "Weighted margin workbook",
    "Libro de margen ponderado",
  ],
  [
    "Proposta editável sem preço inventado",
    "Editable proposal without an invented price",
    "Propuesta editable sin precio inventado",
  ],
  [
    "Três slides com dados verificáveis",
    "Three slides with verifiable facts",
    "Tres diapositivas con datos verificables",
  ],
  [
    "Resumo de pedidos em PDF",
    "Order summary PDF",
    "Resumen de pedidos en PDF",
  ],
  [
    "Ata com prazo pendente explícito",
    "Minutes with an explicit pending deadline",
    "Acta con plazo pendiente explícito",
  ],
  [
    "Documentação do modelo fictício",
    "Fictional model documentation",
    "Documentación del modelo ficticio",
  ],
  [
    "Consulta M com cultura e nulos",
    "M query with locale and null handling",
    "Consulta M con configuración regional y nulos",
  ],
  [
    "Medidas DAX e diagnóstico delimitado",
    "DAX measures and a bounded diagnosis",
    "Medidas DAX y diagnóstico delimitado",
  ],
  [
    "Protótipo navegável de solicitações",
    "Navigable request prototype",
    "Prototipo navegable de solicitudes",
  ],
  [
    "Consolidação de pedidos sem duplicação",
    "Order consolidation without duplicates",
    "Consolidación de pedidos sin duplicados",
  ],
];
const scopes = [
  [
    "Criar XLSX com fórmulas: receita 1100, custo 690, lucro 410 e margem 410/1100.",
    "Create an XLSX with formulas: revenue 1100, cost 690, profit 410 and margin 410/1100.",
    "Crear un XLSX con fórmulas: ingresos 1100, coste 690, beneficio 410 y margen 410/1100.",
  ],
  [
    "Criar DOCX para Aurora Demo com escopo, exclusões, aceite e preço a confirmar.",
    "Create a DOCX for Aurora Demo with scope, exclusions, acceptance and a price to be confirmed.",
    "Crear un DOCX para Aurora Demo con alcance, exclusiones, aceptación y precio por confirmar.",
  ],
  [
    "Criar 3 slides editáveis em 16:9: 20 pedidos fictícios, 5 pendentes e revisão dos 5.",
    "Create 3 editable 16:9 slides: 20 fictional orders, 5 pending and a review of those 5.",
    "Crear 3 diapositivas editables en 16:9: 20 pedidos ficticios, 5 pendientes y revisión de esos 5.",
  ],
  [
    "Criar PDF de 1 página com P01=1200, P02=800, P03=500 e total 2500.",
    "Create a 1-page PDF with P01=1200, P02=800, P03=500 and a total of 2500.",
    "Crear un PDF de 1 página con P01=1200, P02=800, P03=500 y total 2500.",
  ],
  [
    "Criar DOCX: Ana revisa o cadastro até 2026-11-10; Bruno valida o relatório com prazo a confirmar.",
    "Create a DOCX: Ana reviews registration by 2026-11-10; Bruno validates the report with the deadline to be confirmed.",
    "Crear un DOCX: Ana revisa el registro antes de 2026-11-10; Bruno valida el informe con plazo por confirmar.",
  ],
  [
    "Ler BIM fictício e documentar 2 tabelas, 6 colunas, 3 medidas e 1 relacionamento em DOCX e Markdown.",
    "Read a fictional BIM and document 2 tables, 6 columns, 3 measures and 1 relationship in DOCX and Markdown.",
    "Leer un BIM ficticio y documentar 2 tablas, 6 columnas, 3 medidas y 1 relación en DOCX y Markdown.",
  ],
  [
    "Revisar arquivo M preservando 3 linhas e nulo, com conversão pt-BR e soma esperada 30.5.",
    "Review an M file preserving 3 rows and null, with pt-BR conversion and an expected sum of 30.5.",
    "Revisar un archivo M conservando 3 filas y nulo, con conversión pt-BR y suma esperada de 30.5.",
  ],
  [
    "Entregar DAX com SUM e DIVIDE; diagnosticar receita 1100, custo 690 e margem 410/1100.",
    "Deliver DAX using SUM and DIVIDE; diagnose revenue 1100, cost 690 and margin 410/1100.",
    "Entregar DAX con SUM y DIVIDE; diagnosticar ingresos 1100, coste 690 y margen 410/1100.",
  ],
  [
    "Criar HTML local com navegação, validação, inclusão e troca de status por papel simulado.",
    "Create local HTML with navigation, validation, insertion and status changes by simulated role.",
    "Crear HTML local con navegación, validación, inserción y cambio de estado por rol simulado.",
  ],
  [
    "Consolidar 2 CSVs em XLSX: 3 pedidos únicos, P01 duplicado e total 2500, mantendo as origens.",
    "Consolidate 2 CSVs into an XLSX: 3 unique orders, duplicate P01 and a total of 2500, retaining source filenames.",
    "Consolidar 2 CSV en un XLSX: 3 pedidos únicos, P01 duplicado y total 2500, conservando los orígenes.",
  ],
];
const checkNames = {
  files: [
    "Arquivos finais presentes e legíveis",
    "Final files present and readable",
    "Archivos finales presentes y legibles",
  ],
  content: [
    "Fatos e estrutura conferidos contra as entradas",
    "Facts and structure checked against inputs",
    "Datos y estructura contrastados con las entradas",
  ],
  formulas: [
    "Fórmulas e referências conferidas",
    "Formulas and references checked",
    "Fórmulas y referencias comprobadas",
  ],
  semantics: [
    "Limites técnicos e semântica documentados",
    "Technical boundaries and semantics documented",
    "Límites técnicos y semántica documentados",
  ],
  engine: [
    "Código produzido executado no motor local, com dados fictícios",
    "Generated code executed in the local engine with fictional data",
    "Código generado ejecutado en el motor local con datos ficticios",
  ],
  visual: [
    "Renderização e legibilidade conferidas em revisão independente",
    "Rendering and readability checked in an independent review",
    "Renderizado y legibilidad comprobados en una revisión independiente",
  ],
  recalc: [
    "Recálculo independente no Excel conferido",
    "Independent Excel recalculation checked",
    "Recálculo independiente en Excel comprobado",
  ],
  interaction: [
    "Fluxo interativo exercitado no navegador",
    "Interactive flow exercised in a browser",
    "Flujo interactivo probado en el navegador",
  ],
};
function checkIds(c) {
  return [
    "files",
    "content",
    ...(c.outputs.some((x) => /xlsx$/.test(x)) ? ["formulas", "recalc"] : []),
    ...(/review$/.test(c.id) ? ["semantics", "engine"] : []),
    ...(c.id === "request-prototype" ? ["interaction"] : []),
    ...(c.outputs.some((x) => /docx$|pptx$|pdf$|html$|xlsx$/.test(x))
      ? ["visual"]
      : []),
  ];
}
function prepareEvidence() {
  const language = ["pt", "en", "es"],
    root = path.resolve(__dirname, ".."),
    destination = path.join(root, "data/deliverable-evidence.json");
  if (
    fs.existsSync(destination) &&
    JSON.parse(fs.readFileSync(destination)).scenarios.some((s) => s.passed)
  )
    throw Error("Preparation cannot overwrite verified evidence");
  const records = cases.map((c, i) => {
    const source = readSource(c.skillId, "1.2.0"),
      office = c.outputs.some((x) => /xlsx$|docx$|pptx$/.test(x)),
      copy = {};
    for (let n = 0; n < 3; n++)
      copy[language[n]] = {
        title: titles[i][n],
        scope: scopes[i][n],
        prerequisites: [
          [
            "Assistente autorizado a ler e criar arquivos na pasta isolada",
            "Assistant authorized to read and create files in the isolated directory",
            "Asistente autorizado para leer y crear archivos en la carpeta aislada",
          ][n],
          [
            "Python com as bibliotecas locais apropriadas; entradas fictícias fornecidas",
            "Python with the appropriate local libraries; supplied fictional inputs",
            "Python con las bibliotecas locales adecuadas; entradas ficticias proporcionadas",
          ][n],
          office
            ? [
                "Office local para abertura e revisão independente",
                "Local Office for opening and independent review",
                "Office local para apertura y revisión independiente",
              ][n]
            : [
                "Ferramenta local de leitura e conferência do formato final",
                "Local tool for reading and checking the final format",
                "Herramienta local para leer y comprobar el formato final",
              ][n],
        ],
        limitations: [
          [
            "Arquivos do cenário em português; descrição da avaliação disponível em três idiomas.",
            "Scenario files are in Portuguese; the evaluation description is available in three languages.",
            "Los archivos del escenario están en portugués; la descripción de la evaluación está disponible en tres idiomas.",
          ][n],
          /review$/.test(c.id)
            ? [
                "Revisão estática: nenhum motor Power Query ou DAX foi executado; não comprova desempenho.",
                "Static review: no Power Query or DAX engine was executed; performance is not established.",
                "Revisión estática: no se ejecutó ningún motor Power Query o DAX; no demuestra rendimiento.",
              ][n]
            : c.id === "request-prototype"
              ? [
                  "Protótipo em memória: sem backend, autenticação real ou publicação.",
                  "In-memory prototype: no backend, real authentication or publication.",
                  "Prototipo en memoria: sin backend, autenticación real ni publicación.",
                ][n]
              : [
                  "Somente dados fictícios; não comprova integração com sistemas ou documentos reais.",
                  "Fictional data only; this does not demonstrate integration with real systems or documents.",
                  "Solo datos ficticios; no demuestra integración con sistemas o documentos reales.",
                ][n],
        ],
      };
    const attempts = [];
    if (i === 0) {
      for (const folder of [
        "2026-11-07T12-37-53-852Z",
        "2026-11-07T12-40-41-966Z",
        "2026-11-07T12-41-38-364Z",
      ]) {
        const p = path.join(
          root,
          ".local/artifact-evals/1.2.0",
          folder,
          c.id,
          "run.json",
        );
        if (fs.existsSync(p)) {
          const r = JSON.parse(fs.readFileSync(p));
          attempts.push({
            startedAt: r.startedAt,
            finishedAt: r.finishedAt,
            runtime: r.runtime,
            model: r.model,
            exitCode: r.exitCode,
            status: folder.includes("12-40")
              ? "diagnostic-host-unavailable"
              : "execution-policy-blocked",
            outputsProduced: r.files.filter((f) => f.exists).length,
          });
        }
      }
    }
    return {
      caseId: c.id,
      skillId: c.skillId,
      version: "1.2.0",
      status: attempts.length ? "blocked" : "not-run",
      passed: false,
      assistantExecuted: false,
      runtime: "Codex CLI",
      model: null,
      sourceSha256: source.sourceSha256,
      packageSha256: source.packageSha256,
      finishedAt: attempts.at(-1)?.finishedAt || null,
      attempts,
      copy,
      checks: checkIds(c).map((id) => ({
        id,
        labels: Object.fromEntries(
          language.map((l, n) => [l, checkNames[id][n]]),
        ),
        passed: null,
      })),
      artifacts: [],
      executionVerified: false,
      fullSkillExecutionVerified: false,
    };
  });
  fs.writeFileSync(
    path.join(root, "data/deliverable-evidence.json"),
    JSON.stringify({ schemaVersion: 1, scenarios: records }, null, 2) + "\n",
  );
  return records;
}
// Read-back only: this process never creates an artifact on the assistant's behalf.
const READBACK = String.raw`
import sys,json,pathlib
root=pathlib.Path(sys.argv[1]); names=json.loads(sys.argv[2]); out={}
for name in names:
 p=root/name
 if not p.is_file(): out[name]={"missing":True}; continue
 try:
  suffix=p.suffix.lower()
  if suffix=='.xlsx':
   import openpyxl
   wb=openpyxl.load_workbook(p,data_only=False); cached=openpyxl.load_workbook(p,data_only=True)
   out[name]={"sheets":{s.title:[[c.value for c in row] for row in s] for s in wb},"cached":{s.title:[[c.value for c in row] for row in s] for s in cached},"externalLinks":len(wb._external_links)}
  elif suffix=='.docx':
   from docx import Document
   d=Document(p); rows=[[ [c.text for c in row.cells] for row in t.rows] for t in d.tables]
   out[name]={"text":"\n".join(x.text for x in d.paragraphs)+"\n"+"\n".join(' | '.join(r) for t in rows for r in t),"tables":rows}
  elif suffix=='.pptx':
   from pptx import Presentation
   d=Presentation(p); texts=[[s.text for s in slide.shapes if s.has_text_frame] for slide in d.slides]
   out[name]={"slides":texts,"ratio":d.slide_width/d.slide_height,"text":"\n".join(t for slide in texts for t in slide)}
  elif suffix=='.pdf':
   import pymupdf as fitz
   d=fitz.open(p);out[name]={"pages":len(d),"text":"\n".join(page.get_text() for page in d)}
  else: out[name]={"text":p.read_text(encoding='utf-8-sig')}
 except Exception as e: out[name]={"error":type(e).__name__}
print(json.dumps(out,ensure_ascii=True,default=str))
`;
const normalize = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const hasAll = (text, items) =>
  items.every((x) => normalize(text).includes(normalize(x)));
const formula = (s) =>
  String(s || "")
    .replace(/\s/g, "")
    .toUpperCase();
function validateExtracted(id, files) {
  const c = cases.find((x) => x.id === id);
  if (!c) throw Error("Unknown case");
  const checks = {
    files: c.outputs.every(
      (name) => files[name] && !files[name].missing && !files[name].error,
    ),
  };
  if (!checks.files) return checks;
  const t = (name) => files[name]?.text || "";
  const all = c.outputs.map(t).join("\n");
  if (id === "margin-workbook") {
    const data = files["margin.xlsx"],
      r = data.sheets?.Margens || [],
      row = r[3] || [];
    checks.content =
      hasAll((r[0] || []).join(" "), [
        "Product",
        "Revenue",
        "Cost",
        "Profit",
        "Margin",
      ]) &&
      r[1]?.[0] === "A" &&
      r[1]?.[1] === 1000 &&
      r[1]?.[2] === 600 &&
      r[2]?.[0] === "B" &&
      r[2]?.[1] === 100 &&
      r[2]?.[2] === 90 &&
      data.externalLinks === 0;
    checks.formulas =
      formula(r[1]?.[3]) === "=B2-C2" &&
      formula(r[2]?.[3]) === "=B3-C3" &&
      /^=IFERROR\(D2\/B2,0\)$/.test(formula(r[1]?.[4])) &&
      /^=IFERROR\(D3\/B3,0\)$/.test(formula(r[2]?.[4])) &&
      formula(row[1]) === "=SUM(B2:B3)" &&
      formula(row[2]) === "=SUM(C2:C3)" &&
      formula(row[3]) === "=B4-C4" &&
      formula(row[4]) === "=IFERROR(D4/B4,0)";
  } else if (id === "proposal-document")
    checks.content =
      hasAll(all, [
        "Aurora Demo",
        "Mapear indicadores",
        "Criar painel demonstrativo",
        "Integracao com ERP",
        "Conferir indicadores com a fonte ficticia",
        "A confirmar",
        "fictici",
      ]) &&
      files["proposal.docx"].tables.length > 0 &&
      !/R\$\s*\d|\b(?:USD|EUR)\s*\d/i.test(all);
  else if (id === "editable-slides") {
    const d = files["presentation.pptx"];
    checks.content =
      d.slides?.length === 3 &&
      Math.abs(d.ratio - 16 / 9) < 0.01 &&
      d.slides.every((s) => s.length > 0) &&
      hasAll(all, ["20", "5", "fictici", "revis"]);
  } else if (id === "summary-pdf")
    checks.content =
      files["summary.pdf"].pages === 1 &&
      hasAll(all.replace(/\./g, ""), [
        "P01",
        "1200",
        "P02",
        "800",
        "P03",
        "500",
        "2500",
        "fictici",
      ]);
  else if (id === "meeting-minutes") {
    const rows = files["minutes.docx"].tables.flat();
    const ana = rows.find((r) => r.some((v) => /\bAna\b/i.test(v)) && hasAll(r.join(" "), ["cadastro", "2026-11-10"])),
      bruno = rows.find((r) => r.some((v) => /\bBruno\b/i.test(v)) && hasAll(r.join(" "), ["relatorio", "A confirmar"]));
    checks.content =
      hasAll(all, ["Aurora", "fictici"]) &&
      !!ana &&
      !!bruno &&
      hasAll(ana.join(" "), ["cadastro", "2026-11-10"]) &&
      hasAll(bruno.join(" "), ["relatorio", "A confirmar"]) &&
      !/\d{4}-\d{2}-\d{2}/.test(bruno.join(" "));
  } else if (id === "model-documentation") {
    const expected = [
      "Sales",
      "Product",
      "SaleId",
      "ProductId",
      "Revenue",
      "Cost",
      "ProductName",
      "TotalRevenue",
      "TotalCost",
      "MarginPct",
      "SUM(Sales[Revenue])",
      "SUM(Sales[Cost])",
      "DIVIDE([TotalRevenue]-[TotalCost],[TotalRevenue])",
    ];
    checks.content =
      c.outputs.every((name) =>
        hasAll(
          t(name).replace(/\s/g, ""),
          expected.map((x) => x.replace(/\s/g, "")),
        ),
      ) && c.outputs.every((name) => hasAll(t(name), ["RLS", "fictici"]));
  } else if (id === "power-query-review") {
    const m = t("revised.pq"),
      d = normalize(t("diagnosis.md"));
    checks.content =
      hasAll(m, [
        "#table",
        "10,50",
        "20,00",
        "null",
        "pt-BR",
        "Number.FromText",
      ]) &&
      /type\s+(?:nullable\s+)?number/.test(m) &&
      !/Table\.Buffer|Web\.Contents|Sql\.Database|File\.Contents/i.test(m);
    checks.semantics =
      /30[.,]5/.test(d) &&
      /nao|sem/.test(d) &&
      /motor|engine|execut/.test(d) &&
      /folding/.test(d);
  } else if (id === "dax-review") {
    const m = t("revised.dax"),
      d = normalize(t("diagnosis.md"));
    checks.content =
      /Revenue\s+Total\s*=\s*SUM\s*\(\s*Sales\[Revenue\]\s*\)/i.test(m) &&
      /MarginPct\s*=/i.test(m) &&
      /DIVIDE\s*\(/i.test(m) &&
      !/SUMX\s*\(/i.test(m) &&
      hasAll(d, ["1100", "690", "410", "blank"]);
    checks.semantics =
      /nao|sem/.test(d) &&
      /motor|engine|execut/.test(d) &&
      /desempenho|performance|speedup/.test(d) &&
      hasAll(d.replace(/,/g, "."), ["0.4", "0.1"]);
  } else if (id === "request-prototype") {
    const h = t("prototype.html");
    checks.content =
      [
        "nav-new",
        "nav-list",
        "subject",
        "description",
        "submit-request",
        "validation",
        "request-list",
        "role-select",
      ].every(
        (v) =>
          h.includes(`data-testid="${v}"`) || h.includes(`data-testid='${v}'`),
      ) &&
      hasAll(h, [
        "Aurora Solicita",
        "REQ-001",
        "Aberta",
        "Operador",
        "fictici",
      ]) &&
      !/(?:src|href)\s*=\s*["'](?:https?:)?\/\/|fetch\s*\(|XMLHttpRequest|sendBeacon\s*\(/i.test(
        h,
      ) &&
      /<script\b/.test(h) &&
      /<label\b/.test(h);
  } else if (id === "orders-consolidation") {
    const d = files["orders.xlsx"],
      s = d.sheets || {},
      p = s.Pedidos || [],
      data = p.filter((r) => /^P\d+$/.test(r[0] || "")),
      duplicates = JSON.stringify(s.Duplicatas || []),
      summary = (s.Resumo || []).flat();
    checks.content =
      data.length === 3 &&
      new Set(data.map((r) => r[0])).size === 3 &&
      data.reduce((a, r) => a + Number(r[2]), 0) === 2500 &&
      hasAll(String(data.find((r) => r[0] === "P01")?.[3]), [
        "batch-a.csv",
        "batch-b.csv",
      ]) &&
      hasAll(duplicates, ["P01", "batch-a.csv", "batch-b.csv"]) &&
      hasAll(summary.join(" "), ["Aurora", "Norte"]) &&
      d.externalLinks === 0;
    const f = summary.filter((v) => typeof v === "string" && v.startsWith("="));
    checks.formulas =
      f.filter((v) => /SUMIF\s*\(/i.test(v) && /Pedidos/i.test(v)).length >=
        2 && f.some((v) => /SUM\s*\(/i.test(v));
  }
  return checks;
}
function verifyRun(directory) {
  const base = path.resolve(__dirname, "../.local/artifact-evals") + path.sep;
  directory = path.resolve(directory);
  if (!directory.startsWith(base))
    throw Error(
      "Verification directory must be inside isolated artifact-evals",
    );
  const run = JSON.parse(fs.readFileSync(path.join(directory, "run.json"))),
    c = cases.find((x) => x.id === run.caseId);
  if (!c) throw Error("Unknown case");
  const r = spawnSync(
    "python",
    ["-c", READBACK, directory, JSON.stringify(c.outputs)],
    { encoding: "utf8", env: env(), windowsHide: true, timeout: 30000 },
  );
  let extracted = {};
  try {
    if (r.status === 0) extracted = JSON.parse(r.stdout);
  } catch {}
  const basic = validateExtracted(c.id, extracted),
    attestationPath = path.join(directory, "independent-review.json");
  const review = fs.existsSync(attestationPath)
    ? JSON.parse(fs.readFileSync(attestationPath))
    : {};
  const reviewBound = c.outputs.every(
    (name) =>
      review.outputHashes?.[name] ===
      run.files.find((f) => f.filename === name)?.sha256,
  );
  const checked = checkIds(c).map((id) => {
    if (["visual", "recalc", "interaction", "engine"].includes(id)) {
      const a = review[id];
      return {
        id,
        passed:
          reviewBound &&
          !!a &&
          a.passed === true &&
          typeof a.reviewer === "string" &&
          a.reviewer.length > 2 &&
          Number.isFinite(Date.parse(a.reviewedAt)) &&
          typeof a.evidence === "string" &&
          a.evidence.length > 20,
        method: "independent-attestation",
        details: a || null,
      };
    }
    return { id, passed: basic[id] === true, method: "independent-readback" };
  });
  const originalFilesIntact = c.outputs.every((name) => {
    const f = run.files.find((x) => x.filename === name);
    return (
      f?.exists &&
      fs.existsSync(path.join(directory, name)) &&
      sha(fs.readFileSync(path.join(directory, name))) === f.sha256
    );
  });
  const source = readSource(c.skillId, run.version),
    sourceMatches =
      source.sourceSha256 === run.sourceSha256 &&
      source.packageSha256 === run.packageSha256;
  const result = {
    caseId: c.id,
    checkedAt: new Date().toISOString(),
    assistantRunEligible:
      run.exitCode === 0 &&
      !run.timedOut &&
      !run.forbiddenTool &&
      !run.policyBlocked &&
      run.stagedRelease?.packageSha256 === run.packageSha256 &&
      run.toolEvents > 0,
    originalFilesIntact,
    sourceMatches,
    completeReleaseIntact: stagedReleaseIntact(directory, c.skillId, run.version, run.packageSha256),
    checks: checked,
    passed: false,
    fullSkillExecutionVerified: false,
  };
  result.passed =
    result.assistantRunEligible &&
    originalFilesIntact &&
    sourceMatches &&
    result.completeReleaseIntact &&
    checked.every((c) => c.passed);
  fs.writeFileSync(
    path.join(directory, "verification.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  return result;
}
function publishVerified(directory) {
  const result = verifyRun(directory);
  if (!result.passed)
    throw Error(
      "Only independently verified assistant deliverables may be published",
    );
  directory = path.resolve(directory);
  const run = JSON.parse(fs.readFileSync(path.join(directory, "run.json"))),
    c = cases.find((x) => x.id === run.caseId),
    review = JSON.parse(
      fs.readFileSync(path.join(directory, "independent-review.json")),
    );
  if (
    review.publication?.passed !== true ||
    typeof review.publication.reviewer !== "string" ||
    review.publication.reviewer.length < 3 ||
    !Number.isFinite(Date.parse(review.publication.reviewedAt)) ||
    typeof review.publication.evidence !== "string" ||
    review.publication.evidence.length < 21 ||
    !c.outputs.every(
      (name) =>
        review.outputHashes?.[name] ===
        run.files.find((f) => f.filename === name)?.sha256,
    )
  )
    throw Error(
      "Public export requires a hash-bound review confirming fictional data and no secrets",
    );
  const root = path.resolve(__dirname, ".."),
    dataPath = path.join(root, "data/deliverable-evidence.json"),
    data = JSON.parse(fs.readFileSync(dataPath)),
    record = data.scenarios.find((s) => s.caseId === c.id);
  if (!record || record.packageSha256 !== run.packageSha256)
    throw Error("Evidence must match the prepared release");
  const types = {
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    pdf: "application/pdf",
    md: "text/markdown",
    html: "text/html",
    pq: "text/plain",
    dax: "text/plain",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
  };
  const target = path.join(root, "dist/evidence-assets", run.version, c.id);
  fs.mkdirSync(target, { recursive: true });
  const artifacts = c.outputs.map((filename) => {
    const content = fs.readFileSync(path.join(directory, filename));
    fs.writeFileSync(path.join(target, filename), content);
    return {
      filename,
      url: `/evidence-assets/${run.version}/${c.id}/${filename}`,
      sha256: sha(content),
      mimeType: types[filename.split(".").pop()],
      labels: {
        pt: `Entregável: ${filename}`,
        en: `Deliverable: ${filename}`,
        es: `Entregable: ${filename}`,
      },
    };
  });
  const inputBytes = Buffer.from(JSON.stringify(c.files, null, 2) + "\n");
  fs.writeFileSync(path.join(target, "inputs.json"), inputBytes);
  const inputs = {filename:"inputs.json",url:`/evidence-assets/${run.version}/${c.id}/inputs.json`,sha256:sha(inputBytes),mimeType:"application/json"};
  const reviewArtifacts = (review.assets || []).map((asset) => {
    if (!/^[a-z0-9-]+\.(pdf|png|jpg|xlsx|json)$/.test(asset.filename) || !["preview","recalculated","review"].includes(asset.kind)) throw Error("Invalid review asset");
    if (c.outputs.includes(asset.filename) || asset.filename === "inputs.json") throw Error("Review assets must not replace original outputs");
    const content = fs.readFileSync(path.join(directory,"host-review",asset.filename));
    if (sha(content) !== asset.sha256 || !["pt","en","es"].every(l => typeof asset.labels?.[l] === "string")) throw Error("Review asset must be hash-bound and localized");
    fs.writeFileSync(path.join(target,asset.filename), content);
    return {filename:asset.filename,url:`/evidence-assets/${run.version}/${c.id}/${asset.filename}`,sha256:sha(content),mimeType:types[asset.filename.split(".").pop()],kind:asset.kind,labels:asset.labels};
  });
  Object.assign(record, {
    status: "passed",
    passed: true,
    assistantExecuted: true,
    runtime: run.runtime,
    model: run.model,
    finishedAt: run.finishedAt,
    sourceSha256: run.sourceSha256,
    packageSha256: run.packageSha256,
    artifacts,
    inputs,
    reviewArtifacts,
    reviewNotes: review.notes || null,
    ownerAcceptance: "pending",
    checks: checkIds(c).map((id) => ({
      id,
      labels: Object.fromEntries(["pt", "en", "es"].map((locale, index) => [locale, checkNames[id][index]])),
      passed: result.checks.find((x) => x.id === id)?.passed === true,
    })),
    executionVerified: false,
    fullSkillExecutionVerified: false,
  });
  record.attempts.push({
    startedAt: run.startedAt,
    finishedAt: run.finishedAt,
    runtime: run.runtime,
    model: run.model,
    exitCode: run.exitCode,
    status: "limited-deliverable-verified",
    outputsProduced: artifacts.length,
  });
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + "\n");
  return {
    caseId: c.id,
    published: artifacts.length,
    fullSkillExecutionVerified: false,
  };
}
function env() {
  const result = {};
  for (const key of [
    "PATH",
    "Path",
    "PATHEXT",
    "SystemRoot",
    "SYSTEMROOT",
    "WINDIR",
    "COMSPEC",
    "USERPROFILE",
    "HOMEDRIVE",
    "HOMEPATH",
    "APPDATA",
    "LOCALAPPDATA",
    "TEMP",
    "TMP",
    "CODEX_HOME",
  ]) {
    if (process.env[key]) result[key] = process.env[key];
  }
  return result;
}
function execute(prompt, cwd, timeout = 240000) {
  return new Promise((resolve) => {
    const args = [
      "exec",
      "--ephemeral",
      "--skip-git-repo-check",
      "--ignore-user-config",
      // Ignoring user config also drops the provisioned Windows sandbox backend.
      // Select that existing isolated backend explicitly; keep workspace/network
      // restrictions and the never-escalate approval policy below unchanged.
      ...(process.platform === "win32"
        ? ["-c", 'windows.sandbox="elevated"']
        : []),
      "--disable",
      "apps",
      "--disable",
      "plugins",
      "-s",
      "workspace-write",
      "-c",
      "sandbox_workspace_write.network_access=false",
      "-c",
      'web_search="disabled"',
      "-c",
      'approval_policy="never"',
      "--json",
      "-o",
      path.join(cwd, "assistant-final.txt"),
      "-",
    ];
    const child = spawn(
      process.platform === "win32" ? "codex.exe" : "codex",
      args,
      { cwd, env: env(), windowsHide: true, stdio: ["pipe", "pipe", "pipe"] },
    );
    let stdout = "",
      stderr = "",
      buffer = "",
      forbidden = false,
      timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeout);
    child.stdout.on("data", (d) => {
      stdout += d;
      buffer += d;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop();
      for (const line of lines) {
        try {
          const e = JSON.parse(line);
          if (/mcp_tool_call|web_search/.test(e.item?.type || "")) {
            forbidden = true;
            child.kill();
          }
        } catch {}
      }
    });
    child.stderr.on("data", (d) => {
      if (stderr.length < 100000) stderr += d;
    });
    child.stdin.on("error", () => {});
    child.on("error", (e) => {
      clearTimeout(timer);
      resolve({
        code: null,
        error: e.code,
        stdout,
        stderr,
        forbidden,
        timedOut,
      });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, forbidden, timedOut });
    });
    child.stdin.end(prompt);
  });
}
async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--prepare-evidence")) {
    console.log(JSON.stringify({ prepared: prepareEvidence().length }));
    return;
  }
  const publication = args.find((a) => a.startsWith("--publish-dir="));
  if (publication) {
    console.log(JSON.stringify(publishVerified(publication.slice(14))));
    return;
  }
  const verification = args.find((a) => a.startsWith("--verify-dir="));
  if (verification) {
    console.log(JSON.stringify(verifyRun(verification.slice(13))));
    return;
  }
  const only = args.find((a) => a.startsWith("--case="))?.slice(7),
    version = "1.2.0",
    selected = only ? cases.filter((c) => c.id === only) : cases;
  if (!selected.length) throw Error("Unknown case");
  const repairArg = args.find(a => a.startsWith("--repair-dir="))?.slice(13);
  const feedbackArg = args.find(a => a.startsWith("--feedback-file="))?.slice(16);
  let repair = null, feedback = "";
  if (repairArg || feedbackArg) {
    const privateRoot = path.resolve(__dirname,"../.local") + path.sep;
    if (!only || !repairArg || !feedbackArg || !path.resolve(repairArg).startsWith(privateRoot+"artifact-evals"+path.sep) || !path.resolve(feedbackArg).startsWith(privateRoot)) throw Error("Repair requires one isolated run and local feedback");
    repair = JSON.parse(fs.readFileSync(path.join(repairArg,"run.json")));
    if (repair.caseId !== only || repair.version !== version) throw Error("Repair source does not match the case");
    feedback = fs.readFileSync(feedbackArg,"utf8");
    if (feedback.length > 12000) throw Error("Feedback is too long");
  }
  const root = path.resolve(
    __dirname,
    "../.local/artifact-evals",
    version,
    new Date().toISOString().replace(/[:.]/g, "-"),
  );
  fs.mkdirSync(root, { recursive: true });
  const records = [];
  const managedPython = process.platform === "win32" ? path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe") : null;
  const interpreter = spawnSync(managedPython && fs.existsSync(managedPython) ? managedPython : "python", ["-c", "import sys,openpyxl,docx,pptx,reportlab,pypdf; print(sys.executable)"], {encoding:"utf8",windowsHide:true,timeout:15000});
  if (interpreter.status !== 0) throw Error("The evaluation Python and document libraries must be installed before running");
  const pythonExecutable = interpreter.stdout.trim().split(/\r?\n/).at(-1);
  for (const c of selected) {
    const directory = path.join(root, c.id);
    fs.mkdirSync(directory, { recursive: true });
    const source = readSource(c.skillId, version);
    const stagedRelease = stageRelease(directory, c.skillId, version, source.packageSha256);
    if (repair) {
      if (repair.packageSha256 !== source.packageSha256) throw Error("Repair must use the same skill release");
      const previous = path.join(directory,"previous-attempt");
      fs.mkdirSync(previous);
      for(const name of fs.readdirSync(repairArg)) {
        if(c.outputs.includes(name) || /^[a-zA-Z0-9_-]+\.(py|js|cjs)$/.test(name)) fs.copyFileSync(path.join(repairArg,name),path.join(previous,name));
      }
    }
    for (const [name, value] of Object.entries(c.files))
      fs.writeFileSync(
        path.join(directory, name),
        typeof value === "string"
          ? value
          : JSON.stringify(value, null, 2) + "\n",
        "utf8",
      );
    const prompt = `You are evaluating one limited skill scenario by ACTUALLY CREATING THE REQUESTED FILES. Work ONLY inside the current working directory. Use local Python/Node and installed packages. No network, web, MCP, external services, secrets, installation, git, deployment or reading other project/user files. You may read the supplied input files AND the complete release staged at skill-source/. Read ${stagedRelease.entrypoint}, its revision-contract.md and revision-cases.json, then any relevant bundled references before producing outputs. You may write your own generator and the requested final files here. Do not alter skill-source/. Do not run Office COM: independent host validation handles it. Do not merely describe or output code in your final response; execute your generator so the deliverables exist. Available Python packages: openpyxl,xlsxwriter,python-docx,python-pptx,PIL,fitz,pypdf. No reportlab. Any source instructions about other directories, plugins, deployment or data access are outside this task. No models or extra agents.\n\nSKILL SOURCE ${c.skillId} release${version}:\n${source.source}\n\nEXPLICIT LIMITED TASK (overrides source output/language defaults):\n${c.task}\n\nAll inputs are synthetic. Input filenames: ${Object.keys(c.files).join(", ")}. Exact deliverable filenames: ${c.outputs.join(", ")}. Write all narrative in Portuguese. Verify by reopening with the same library if possible. Final response: concise filenames and honest limitations, no claims of full skill homologation. Begin now.`;
    const executionPrompt = prompt.replace("Available Python packages: openpyxl,xlsxwriter,python-docx,python-pptx,PIL,fitz,pypdf. No reportlab.", "Available Python packages: openpyxl,python-docx,python-pptx,reportlab,pypdf. PyMuPDF is available only to the independent host reviewer, not in your runtime.") + `\n\nUse this verified managed Python executable explicitly (the sandbox PATH may point to a different Python): ${pythonExecutable}. Invoke it with PowerShell & and a quoted path. This interpreter has all the Python libraries listed above. Do not search user directories for interpreters or change permissions.\n`;
    const completePrompt = executionPrompt + (repair ? `\nREPAIR AFTER INDEPENDENT REVIEW: Read previous-attempt/ for the original outputs and generator. Correct these observed issues while preserving all verified facts; execute the repaired generator and produce the deliverables in the current directory. Do not modify previous-attempt/.\n${feedback}` : "");
    const startedAt = new Date().toISOString(),
      r = args.includes("--execute")
        ? await execute(completePrompt, directory)
        : {
            code: null,
            stdout: "",
            stderr: "",
            forbidden: false,
            timedOut: false,
          };
    const events = r.stdout.split(/\r?\n/).flatMap((s) => {
      try {
        return [JSON.parse(s)];
      } catch {
        return [];
      }
    });
    fs.writeFileSync(path.join(directory, "private-events.jsonl"), r.stdout);
    fs.writeFileSync(path.join(directory, "private-runtime.log"), r.stderr);
    const modelEvent = events.find((e) => e.model || e.metadata?.model),
      model =
        modelEvent?.model ||
        modelEvent?.metadata?.model ||
        r.stderr.match(/^\s*model:\s*(\S+)/m)?.[1] ||
        null;
    const files = c.outputs.map((name) => {
      const p = path.join(directory, name);
      return {
        filename: name,
        exists: fs.existsSync(p),
        ...(fs.existsSync(p)
          ? { sha256: sha(fs.readFileSync(p)), bytes: fs.statSync(p).size }
          : {}),
      };
    });
    const policyBlocked =
      /rejected:\s*blocked by policy|tool runner preflight check failed/i.test(
        r.stderr,
      );
    const record = {
      caseId: c.id,
      skillId: c.skillId,
      version,
      startedAt,
      finishedAt: new Date().toISOString(),
      runtime: "Codex CLI",
      model,
      sourceSha256: source.sourceSha256,
      packageSha256: source.packageSha256,
      stagedRelease,
      ...(repair ? {repairOf: {startedAt:repair.startedAt,outputHashes:Object.fromEntries(repair.files.map(f=>[f.filename,f.sha256]))},feedbackSha256:sha(feedback)} : {}),
      promptSha256: sha(completePrompt),
      exitCode: r.code,
      error: r.error || null,
      timedOut: r.timedOut,
      forbiddenTool: r.forbidden,
      policyBlocked,
      toolEvents: events.filter((e) => e.item?.type === "command_execution")
        .length,
      files,
      fullSkillExecutionVerified: false,
    };
    records.push(record);
    fs.writeFileSync(
      path.join(directory, "run.json"),
      JSON.stringify(record, null, 2) + "\n",
    );
    fs.writeFileSync(
      path.join(root, "manifest.json"),
      JSON.stringify({ version, records }, null, 2) + "\n",
    );
    console.log(
      JSON.stringify({
        case: c.id,
        exitCode: r.code,
        timedOut: r.timedOut,
        forbidden: r.forbidden,
        policyBlocked,
        files: files.map((f) => [f.filename, f.exists]),
        directory,
      }),
    );
    if (policyBlocked) {
      console.log(
        "Execution stopped after policy rejection; remaining scenarios were not run.",
      );
      break;
    }
  }
  console.log(JSON.stringify({ root, cases: records.length }));
}
if (require.main === module)
  main().catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
module.exports = {
  cases,
  validateExtracted,
  verifyRun,
  publishVerified,
  prepareEvidence,
  checkIds,
  stageRelease,
  stagedReleaseIntact,
};
