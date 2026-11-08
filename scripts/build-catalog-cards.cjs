"use strict";
// Empacota cartas a partir de .local/skill-sources (fora do Git) e grava os metadados em data/.
// Uso: node scripts/build-catalog-cards.cjs CARDS.json
// Cada item: { id, code, requirements, license?, sourceDir?, policy?, upstream?, note }.
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const { zipSync, strToU8 } = require("fflate");

const ROOT = path.join(__dirname, "..");
const VERSION = "1.2.1", DATE = "2026-11-08";
const digest = (b) => crypto.createHash("sha256").update(b).digest("hex");
const PRIVATE = /joaol|silvestrim|[A-Z]:\\Users\\/i;
const TERMS = `LICENÇA DRIVEDATA DECK
Copyright (c) 2026 DriveData. Esta licença cobre todo o conteúdo deste pacote.

O que o comprador pode fazer
Usar, copiar e adaptar o material nas próprias atividades e nas da empresa em que trabalha.

O que o comprador não pode fazer
Revender, sublicenciar ou redistribuir o material a terceiros, isolado ou dentro de outro produto.

Sem garantia
O material é fornecido no estado em que se encontra, sem garantia de resultado. O comprador deve conferir cada entrega antes de usá-la.
`;

function walk(dir, base = dir, out = {}) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, base, out);
    else out[path.relative(base, full).split(path.sep).join("/")] = new Uint8Array(fs.readFileSync(full));
  }
  return out;
}

function build(card) {
  const { id, code } = card;
  const open = Boolean(card.upstream);
  const source = card.sourceDir || path.join(ROOT, ".local/skill-sources", id);
  const files = walk(source);
  if (!files["SKILL.md"]) throw Error("SKILL.md ausente: " + id);
  const entries = {};
  for (const [name, bytes] of Object.entries(files)) entries[`${id}/${name}`] = bytes;
  entries["COMO-USAR.md"] = strToU8(`# ${code}\n\nEdição ${VERSION}. Coleção DriveData Deck.\n\n## Instale\n\nCopie a pasta \`${id}\` para a pasta de skills do seu assistente (no Claude Code, \`~/.claude/skills/\`) e abra um novo chat.\n\n## Confira\n\nDescreva uma tarefa real e veja se a skill foi reconhecida. Confira cada entrega antes de usá-la.\n`);
  entries["REVISAO.md"] = strToU8(`# Revisão aplicada ${VERSION}\n\n${card.note}\n\nExecução integral por IA: não testada.\n\nTermos: ${open ? `Apache License 2.0 (${id}/LICENSE.txt), obra de ${card.upstream}.` : "Licença DriveData (LICENCA-DRIVEDATA.txt)."}\n`);
  if (!open) entries["LICENCA-DRIVEDATA.txt"] = strToU8(TERMS);
  for (const [name, bytes] of Object.entries(entries))
    if (/\.(md|txt|json|py)$/i.test(name) && PRIVATE.test(Buffer.from(bytes).toString("utf8"))) throw Error("Dado pessoal no pacote: " + name);
  const sourceSha256 = digest(entries[`${id}/SKILL.md`]);
  const previous = require(path.join(ROOT, "data/releases.cjs"))[id] || {};
  const { upstream: _upstream, baselineVersion, baselinePackageSha256, baselineSourceSha256, patchSetSha256, sha256, bytes, fileCount, ...kept } = previous;
  const manifest = {
    schemaVersion: 1, id, code, format: "SKILL.md", review: "structure-checked", tools: [], normalizedFiles: 0,
    example: null, sourceReview: "applied-specific-static-checked", ...kept,
    requirements: card.requirements || kept.requirements, version: VERSION, date: DATE, executionTested: false, commercialCleared: false,
    distribution: "authenticated-demo", license: open ? "Licença Apache 2.0 oficial" : "Termos DriveData", licenseFiles: open ? ["LICENSE.txt"] : [],
    sourceSha256, sourcePolicy: card.policy || "specific-amendments", changes: [],
  };
  entries["MANIFEST.json"] = strToU8(JSON.stringify(manifest, null, 2) + "\n");
  const hashes = Object.fromEntries(Object.entries(entries).map(([n, b]) => [n, digest(b)]));
  entries["INTEGRIDADE.json"] = strToU8(JSON.stringify(hashes, null, 2) + "\n");
  const zip = Buffer.from(zipSync(entries, { level: 6, mtime: new Date("2026-11-08T12:00:00Z") }));
  if (zip.length >= 4000000) throw Error("Pacote grande demais: " + id);
  return { zip, metadata: { ...manifest, sha256: digest(zip), bytes: zip.length, fileCount: Object.keys(entries).length } };
}

const cards = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const out = path.join(ROOT, ".local/releases", VERSION);
const releasesPath = path.join(ROOT, "data/releases.cjs"), reviewPath = path.join(ROOT, "data/pricing-review.json");
const releases = require(releasesPath);
const review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
const { assessments } = require(path.join(ROOT, "data/skill-pricing.cjs"));
const { priceFor } = require(path.join(ROOT, "lib/pricing.cjs"));
const built = cards.map((card) => [card, build(card)]);
for (const [card, { zip, metadata }] of built) {
  fs.writeFileSync(path.join(out, card.id + ".zip"), zip);
  fs.writeFileSync(path.join(out, card.id + ".json"), JSON.stringify(metadata, null, 2) + "\n");
  releases[card.id] = metadata;
  const a = assessments[card.id];
  const record = {
    id: card.id, code: card.code, version: VERSION, packageSha256: metadata.sha256, sourceSha256: metadata.sourceSha256,
    contractSha256: metadata.sourceSha256, priceCents: priceFor(a.scores), scores: a.scores, family: a.family, rationale: a.rationale,
    assessmentType: "documentary", executionVerified: false,
  };
  const at = review.records.findIndex((r) => r.id === card.id);
  if (at >= 0) review.records[at] = record; else review.records.push(record);
  console.log(`${card.code} ${card.id}: ${metadata.fileCount} arquivos, ${Math.round(metadata.bytes / 1024)} KB, US$ ${record.priceCents / 100}`);
}
fs.writeFileSync(releasesPath, "// Generated package metadata; no source contents or credentials.\nmodule.exports = " + JSON.stringify(releases, null, 2) + ";\n");
fs.writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");
