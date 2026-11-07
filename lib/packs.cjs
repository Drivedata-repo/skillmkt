"use strict";
const crypto = require("node:crypto");
const { zipSync, strToU8 } = require("fflate");
const { packs, sourceReleases } = require("../data/packs.cjs");
const translations = require("../data/i18n-packs.cjs");
const { normalizeLocale } = require("./locale.cjs");
const MAX_SOURCE_BYTES = 3500000,
  MAX_ZIP_BYTES = 4000000;
const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");
function localize(value, locale) {
  if (Array.isArray(value)) return value.map((x) => localize(x, locale));
  if (value && typeof value === "object") {
    if (
      Object.keys(value).length === 3 &&
      ["pt", "en", "es"].every((k) => typeof value[k] === "string")
    )
      return value[locale];
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, localize(v, locale)]),
    );
  }
  return value;
}
function packMessage(key, locale) {
  return localize(translations.common, normalizeLocale(locale))[key];
}
function sampleInput(recipe, common) {
  if (recipe.kind === "orders") {
    const [a, b, c] = common.products;
    return {
      filename: "orders.csv",
      mimeType: "text/csv",
      content:
        "order_id,line_id,product_id,product,quantity,unit_price\n" +
        [
          ["P-001", "L-01", "A", a, 2, 50],
          ["P-001", "L-02", "B", b, 3, 20],
          ["P-002", "L-01", "C", c, 1, 80],
          ["P-002", "L-01", "C", c, 1, 80],
          ["P-003", "L-01", "B", b, 2, 20],
          ["P-004", "L-01", "A", a, 1, 50],
        ]
          .map((row) => row.join(","))
          .join("\n") +
        "\n",
    };
  }
  return {
    filename: "sales.json",
    mimeType: "application/json",
    content:
      JSON.stringify(
        {
          categories: [
            { category_id: "A", name: common.categories[0] },
            { category_id: "B", name: common.categories[1] },
          ],
          sales: [
            {
              sale_id: "S-01",
              date: "2026-01-10",
              category_id: "A",
              amount: 100,
              cost: 60,
            },
            {
              sale_id: "S-02",
              date: "2026-01-20",
              category_id: "B",
              amount: 200,
              cost: 120,
            },
            {
              sale_id: "S-03",
              date: "2026-02-05",
              category_id: "A",
              amount: 150,
              cost: 90,
            },
            {
              sale_id: "S-04",
              date: "2026-02-15",
              category_id: "B",
              amount: 50,
              cost: 40,
            },
          ],
        },
        null,
        2,
      ) + "\n",
  };
}
function getPack(id, language = "pt") {
  const recipe = packs.find((p) => p.id === id);
  if (!recipe) return null;
  const locale = normalizeLocale(language),
    copy = localize(translations[recipe.copyKey], locale),
    common = localize(translations.common, locale);
  return {
    id: recipe.id,
    title: copy.title,
    tagline: copy.tagline,
    description: copy.description,
    audience: copy.audience,
    outcome: copy.outcome,
    requirements: copy.requirements,
    limitations: copy.limitations,
    steps: recipe.steps.map((s, i) => ({ ...s, ...copy.steps[i] })),
    sample: {
      input: [sampleInput(recipe, common)],
      reference: [
        {
          filename: "reference.json",
          mimeType: "application/json",
          content: JSON.stringify(recipe.reference, null, 2) + "\n",
        },
      ],
      checks: recipe.checks.map((c, i) => ({ ...c, label: copy.checks[i] })),
      notice: common.notice,
    },
    version: recipe.version,
    skillVersion: recipe.skillVersion,
    locale,
    mode: "free-demo",
    rights: common.rights,
    originalsLanguage: "mixed",
    originalsNotice: common.originalLanguage,
  };
}
function getPacks(locale = "pt") {
  return packs.map((p) => getPack(p.id, locale));
}
// Standalone pure calculator, also embedded verbatim in verify.cjs. Not an AI run.
function calculateReference(kind, content) {
  const fail = () => {
    throw Error("Invalid or conflicting sample data");
  };
  if (typeof content !== "string" || content.length > 64000) fail();
  if (kind === "orders") {
    const rows = content.trim().split(/\r?\n/),
      header = rows.shift();
    if (header !== "order_id,line_id,product_id,product,quantity,unit_price")
      fail();
    const unique = new Map(),
      orders = {};
    let duplicatesRemoved = 0,
      total = 0;
    for (const row of rows) {
      const a = row.split(",");
      if (
        a.length !== 6 ||
        a.some((x) => !x) ||
        !/^\d+$/.test(a[4]) ||
        !/^\d+(?:\.\d{1,2})?$/.test(a[5])
      )
        fail();
      if (
        !/^P-\d{3}$/.test(a[0]) ||
        !/^L-\d{2}$/.test(a[1]) ||
        !Number.isSafeInteger(Number(a[4]))
      )
        fail();
      const key = a[0] + "|" + a[1];
      if (unique.has(key)) {
        if (unique.get(key) !== row) fail();
        duplicatesRemoved++;
        continue;
      }
      unique.set(key, row);
      const amount = Number(a[4]) * Number(a[5]);
      if (!Number.isFinite(amount)) fail();
      total += amount;
      orders[a[0]] = (orders[a[0]] || 0) + amount;
    }
    return {
      inputRows: rows.length,
      uniqueRows: unique.size,
      duplicatesRemoved,
      total,
      orders,
    };
  }
  if (kind !== "sales") fail();
  const input = JSON.parse(content),
    ids = new Set(),
    categoryIds = new Set();
  if (!Array.isArray(input.sales) || !Array.isArray(input.categories)) fail();
  for (const c of input.categories) {
    if (
      typeof c.category_id !== "string" ||
      !/^[A-Z][A-Z0-9_-]*$/.test(c.category_id) ||
      categoryIds.has(c.category_id)
    )
      fail();
    categoryIds.add(c.category_id);
  }
  const result = {
    salesCount: input.sales.length,
    Sales: 0,
    Cost: 0,
    Margin: 0,
    MarginPct: null,
    months: {},
    categories: {},
  };
  const add = (target, s) => {
    target.Sales += s.amount;
    target.Cost += s.cost;
    target.Margin = target.Sales - target.Cost;
    target.MarginPct = target.Sales ? target.Margin / target.Sales : null;
  };
  const fresh = () => ({ Sales: 0, Cost: 0, Margin: 0, MarginPct: null });
  for (const s of input.sales) {
    if (
      typeof s.sale_id !== "string" ||
      ids.has(s.sale_id) ||
      !categoryIds.has(s.category_id) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(s.date) ||
      !Number.isFinite(s.amount) ||
      !Number.isFinite(s.cost)
    )
      fail();
    const date = new Date(s.date + "T00:00:00Z");
    if (
      !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== s.date
    )
      fail();
    ids.add(s.sale_id);
    const month = s.date.slice(0, 7);
    add(result, s);
    add((result.months[month] ??= fresh()), s);
    add((result.categories[s.category_id] ??= fresh()), s);
  }
  return result;
}
function assertKnownPack(pack) {
  const recipe = packs.find((p) => p.id === pack?.id);
  if (
    !recipe ||
    pack.version !== recipe.version ||
    pack.skillVersion !== recipe.skillVersion ||
    JSON.stringify(pack.steps.map((s) => s.skillId)) !==
      JSON.stringify(recipe.steps.map((s) => s.skillId))
  )
    throw Error("Unknown pack recipe");
  return recipe;
}
async function loadPackArchives(pack, query) {
  const recipe = assertKnownPack(pack),
    ids = recipe.steps.map((s) => s.skillId);
  // Restrict to the existing non-admin app role; no key or privileged fallback.
  const result = await query(
    "SELECT skill_id,version,archive,sha256 FROM skillmkt.package_releases WHERE skill_id=ANY($1::text[]) AND version=$2 AND octet_length(archive)<=$3 AND current_user=$4",
    [ids, recipe.skillVersion, MAX_SOURCE_BYTES, "skillmkt_app"],
  );
  if (result.rows.length !== ids.length)
    throw Error("Missing or oversized immutable source archive");
  const archives = new Map();
  let total = 0;
  for (const row of result.rows) {
    if (
      !ids.includes(row.skill_id) ||
      archives.has(row.skill_id) ||
      row.version !== recipe.skillVersion ||
      !Buffer.isBuffer(row.archive)
    )
      throw Error("Invalid source archive row");
    const actual = sha256(row.archive);
    if (actual !== row.sha256 || actual !== sourceReleases[row.skill_id])
      throw Error("Source archive integrity mismatch");
    total += row.archive.length;
    if (total > MAX_SOURCE_BYTES) throw Error("Source archive size limit");
    archives.set(row.skill_id, row.archive);
  }
  return archives;
}
function buildPackArchive(pack, archives) {
  const recipe = assertKnownPack(pack),
    common = localize(translations.common, pack.locale),
    entries = {},
    sources = [];
  let total = 0;
  for (const step of recipe.steps) {
    const archive = archives.get(step.skillId);
    if (
      !Buffer.isBuffer(archive) ||
      sha256(archive) !== sourceReleases[step.skillId]
    )
      throw Error("Source archive integrity mismatch");
    total += archive.length;
    if (total > MAX_SOURCE_BYTES) throw Error("Source archive size limit");
    const filename = `SKILLS/${step.skillId}-${recipe.skillVersion}.zip`;
    entries[filename] = archive;
    sources.push({
      id: step.skillId,
      version: recipe.skillVersion,
      filename,
      sha256: sha256(archive),
      bytes: archive.length,
    });
  }
  for (const file of [...pack.sample.input, ...pack.sample.reference]) {
    if (
      !/^[a-z0-9-]+\.(?:csv|json)$/.test(file.filename) ||
      typeof file.content !== "string" ||
      Buffer.byteLength(file.content) > 64000
    )
      throw Error("Invalid sample artifact");
    entries["sample/" + file.filename] = strToU8(file.content);
  }
  const workflow = `# ${pack.title}\n\n${pack.tagline}\n\n${pack.description}\n\n${pack.outcome}\n\n## ${common.requirements}\n\n${pack.requirements.map((x) => "- " + x).join("\n")}\n\n## ${common.limits}\n\n${pack.limitations.map((x) => "- " + x).join("\n")}\n\n${pack.sample.notice}\n\n## ${common.installTitle}\n\n${common.install}\n\n## ${common.steps}\n\n${pack.steps.map((s, i) => `### ${i + 1}. ${s.title}\n\nSkill: ${s.skillId} (${pack.skillVersion})\n\n**${common.input}:** ${s.input}\n\n**${common.output}:** ${s.output}\n\n**${common.prompt}**\n\n${s.prompt}\n\n${s.checks.map((c) => "- [ ] " + c).join("\n")}`).join("\n\n")}\n\n## ${common.verify}\n\n${common.verifyInstruction}\n\n${pack.originalsNotice}\n\n${pack.rights}\n`;
  entries["README.md"] = strToU8(workflow);
  entries["CHECKLIST.md"] = strToU8(
    `# ${common.checks}\n\n${pack.steps.map((s, i) => `## ${i + 1}. ${s.title}\n\n${s.checks.map((c) => "- [ ] " + c).join("\n")}`).join("\n\n")}\n\n${pack.sample.notice}\n`,
  );
  entries["verify.cjs"] = strToU8(
    `"use strict";\nconst fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');\n${calculateReference.toString()}\nconst input=fs.readFileSync(path.join(__dirname,'sample',${JSON.stringify(pack.sample.input[0].filename)}),'utf8');\nconst expected=JSON.parse(fs.readFileSync(path.join(__dirname,'sample/reference.json'),'utf8'));\nconst actual=calculateReference(${JSON.stringify(recipe.kind)},input);\nassert.deepEqual(actual,expected);\nconsole.log(JSON.stringify(actual,null,2));\nconsole.log(${JSON.stringify(common.verifySuccess)});\n`,
  );
  entries["MANIFEST.json"] = strToU8(
    JSON.stringify(
      {
        schemaVersion: 1,
        id: pack.id,
        version: pack.version,
        locale: pack.locale,
        mode: pack.mode,
        sources,
        referenceKind: "deterministic-local-calculation",
        aiExecutionTested: false,
        notice: pack.sample.notice,
        rights: pack.rights,
      },
      null,
      2,
    ) + "\n",
  );
  entries["INTEGRITY.json"] = strToU8(
    JSON.stringify(
      Object.fromEntries(
        Object.entries(entries).map(([name, bytes]) => [name, sha256(bytes)]),
      ),
      null,
      2,
    ) + "\n",
  );
  const archive = Buffer.from(
    zipSync(entries, { level: 6, mtime: new Date("2026-11-07T12:00:00Z") }),
  );
  if (archive.length > MAX_ZIP_BYTES) throw Error("Pack archive size limit");
  return {
    archive,
    sha256: sha256(archive),
    version: pack.version,
    filename: `${pack.id}-${pack.version}-${pack.locale}.zip`,
  };
}
function validatePackQuery(req, download = false) {
  const params = new URL(req.url, "https://local.invalid").searchParams;
  const allowed = download ? ["id", "lang"] : ["lang"];
  if (
    [...params.keys()].some((k) => !allowed.includes(k)) ||
    allowed.some((k) => params.getAll(k).length > 1) ||
    (params.has("lang") && !["pt", "en", "es"].includes(params.get("lang"))) ||
    (download &&
      (!params.has("id") || !/^[a-z0-9-]{1,64}$/.test(params.get("id"))))
  )
    return false;
  return true;
}
module.exports = {
  getPacks,
  getPack,
  loadPackArchives,
  buildPackArchive,
  calculateReference,
  packMessage,
  validatePackQuery,
  sha256,
  MAX_SOURCE_BYTES,
  MAX_ZIP_BYTES,
};
