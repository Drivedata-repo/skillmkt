"use strict";
// Empacota cartas a partir de .local/skill-sources (fora do Git) e grava os metadados em data/.
// Uso: node scripts/build-catalog-cards.cjs CARDS.json
// Cada item: { id, code, requirements, license?, sourceDir?, policy?, upstream?, terceiros?, note }.
// terceiros: { rotulo, arquivos } para obra aberta com arquivos de licença e ALTERACOES-E-AUTORIA.md na fonte.
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const { zipSync, strToU8 } = require("fflate");

const ROOT = path.join(__dirname, "..");
const BASE_VERSION = "1.2.1", BASE_DATE = "2026-11-08";
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

const thirdPartyTerms = (id, t) => `LICENÇA DRIVEDATA DECK
Copyright (c) 2026 DriveData.

1. O que esta licença cobre
Somente o material criado pela DriveData neste pacote, conforme ${id}/ALTERACOES-E-AUTORIA.md.

2. O que esta licença não cobre
A obra original continua sob ${t.rotulo}, com os textos em ${t.arquivos.map((a) => id + "/" + a).join(", ")}. Nada nesta licença limita os direitos que essas licenças concedem sobre a obra original.

3. O que o comprador pode fazer
Usar, copiar e adaptar o material da DriveData nas próprias atividades e nas da empresa em que trabalha.

4. O que o comprador não pode fazer
Revender, sublicenciar ou redistribuir o material da DriveData a terceiros, isolado ou dentro de outro produto.

5. Sem garantia
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
  const VERSION = card.version || BASE_VERSION, DATE = card.date || BASE_DATE;
  const open = Boolean(card.upstream);
  const source = card.sourceDir || path.join(ROOT, ".local/skill-sources", id);
  const files = walk(source);
  if (!files["SKILL.md"]) throw Error("SKILL.md ausente: " + id);
  const third = card.terceiros;
  if (third) for (const a of [...third.arquivos, "ALTERACOES-E-AUTORIA.md"]) if (!files[a]) throw Error("Arquivo de licença ausente: " + id + "/" + a);
  const entries = {};
  for (const [name, bytes] of Object.entries(files)) entries[`${id}/${name}`] = bytes;
  entries["COMO-USAR.md"] = strToU8(`# ${code}\n\nEdição ${VERSION}. Coleção DriveData Deck.\n\n## Instale\n\nCopie a pasta \`${id}\` para a pasta de skills do seu assistente (no Claude Code, \`~/.claude/skills/\`) e abra um novo chat.\n\n## Confira\n\nDescreva uma tarefa real e veja se a skill foi reconhecida. Confira cada entrega antes de usá-la.\n`);
  entries["REVISAO.md"] = strToU8(`# Revisão aplicada ${VERSION}\n\n${card.note}\n\n${card.testNote || "Execução integral por IA: não testada."}\n\nTermos: ${open ? `Apache License 2.0 (${id}/LICENSE.txt), obra de ${card.upstream}.` : third ? `${third.rotulo} sobre a obra original (${third.arquivos.map((a) => id + "/" + a).join(", ")}) e Licença DriveData sobre o material novo (LICENCA-DRIVEDATA.txt). Autoria em ${id}/ALTERACOES-E-AUTORIA.md.` : "Licença DriveData (LICENCA-DRIVEDATA.txt)."}\n`);
  if (!open) entries["LICENCA-DRIVEDATA.txt"] = strToU8(third ? thirdPartyTerms(id, third) : TERMS);
  for (const [name, bytes] of Object.entries(entries))
    if (/\.(md|txt|json|py)$/i.test(name) && PRIVATE.test(Buffer.from(bytes).toString("utf8"))) throw Error("Dado pessoal no pacote: " + name);
  const sourceSha256 = digest(entries[`${id}/SKILL.md`]);
  const previous = require(path.join(ROOT, "data/releases.cjs"))[id] || {};
  const { upstream: _upstream, baselineVersion, baselinePackageSha256, baselineSourceSha256, patchSetSha256, sha256, bytes, fileCount, ...kept } = previous;
  const manifest = {
    schemaVersion: 1, id, code, format: "SKILL.md", review: "structure-checked", tools: [], normalizedFiles: 0,
    example: null, sourceReview: "applied-specific-static-checked", ...kept,
    requirements: card.requirements || kept.requirements, version: VERSION, date: DATE, executionTested: false, commercialCleared: false,
    distribution: "authenticated-demo", license: open ? "Licença Apache 2.0 oficial" : third ? third.selo || third.rotulo + " e termos DriveData" : "Termos DriveData", licenseFiles: open ? ["LICENSE.txt"] : third ? third.arquivos : [],
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

const releasesPath = path.join(ROOT, "data/releases.cjs"), reviewPath = path.join(ROOT, "data/pricing-review.json");
const releases = require(releasesPath);
const review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
const { assessments } = require(path.join(ROOT, "data/skill-pricing.cjs"));
const { priceFor } = require(path.join(ROOT, "lib/pricing.cjs"));
const built = cards.map((card) => [card, build(card)]);
for (const [card, { zip, metadata }] of built) {
  const out = path.join(ROOT, ".local/releases", metadata.version);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, card.id + ".zip"), zip);
  fs.writeFileSync(path.join(out, card.id + ".json"), JSON.stringify(metadata, null, 2) + "\n");
  releases[card.id] = metadata;
  const a = assessments[card.id];
  const record = {
    id: card.id, code: card.code, version: metadata.version, packageSha256: metadata.sha256, sourceSha256: metadata.sourceSha256,
    contractSha256: metadata.sourceSha256, priceCents: priceFor(a.scores), scores: a.scores, family: a.family, rationale: a.rationale,
    assessmentType: "documentary", executionVerified: false,
  };
  const at = review.records.findIndex((r) => r.id === card.id);
  if (at >= 0) review.records[at] = record; else review.records.push(record);
  console.log(`${card.code} ${card.id}: ${metadata.fileCount} arquivos, ${Math.round(metadata.bytes / 1024)} KB, US$ ${record.priceCents / 100}`);
}
fs.writeFileSync(releasesPath, "// Generated package metadata; no source contents or credentials.\nmodule.exports = " + JSON.stringify(releases, null, 2) + ";\n");
fs.writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");
