"use strict";
// Edição 1.2.1: mesmas skills da 1.2.0, agora com o que a Apache License 2.0 exige para
// redistribuir (cópia da licença e aviso de alteração) e os termos DriveData sobre o que
// a DriveData criou. Não reescreve a 1.2.0.
//
//   node scripts/build-license-edition.cjs           gera em .local/releases/1.2.1 e confere
//   node scripts/build-license-edition.cjs --check   só confere o que já foi gerado
//   node scripts/build-license-edition.cjs --apply   grava as versões em data/ (rodar antes da importação)
const fs = require("node:fs"), path = require("node:path"), os = require("node:os"), crypto = require("node:crypto");
const { zipSync, unzipSync, strFromU8, strToU8 } = require("fflate");

const ROOT = path.join(__dirname, "..");
const BASE = "1.2.0", VERSION = "1.2.1", DATE = "2026-11-08";
const baseDir = path.join(ROOT, ".local/releases", BASE), outDir = path.join(ROOT, ".local/releases", VERSION);
const pluginsRoot = process.env.PLUGIN_SOURCE_ROOT || path.join(os.homedir(), ".claude/plugins");
const LICENSE_LABEL = "Apache License 2.0 e termos DriveData";
const PACKAGE_LICENSE = "LICENCA-DRIVEDATA.txt", NOTICE = "ALTERACOES-E-AUTORIA.md";
const STAGED_LICENSE = /^\s*Apache License\s+Version 2\.0, January 2004/;

const LEGACY = [
  "brief", "compliance-check", "legal-response", "legal-risk-assessment", "meeting-briefing", "review-contract",
  "signature-request", "triage-nda", "vendor-check", "agent-development", "command-development", "hook-development",
  "mcp-integration", "plugin-settings", "plugin-structure", "skill-development", "build-mcp-app", "build-mcp-server",
  "build-mcpb", "cardputer-buddy", "m5-onboard", "discord-access", "discord-configure", "example-command", "example-skill",
  "imessage-access", "imessage-configure", "siege", "solo", "telegram-access", "telegram-configure",
  "claude-automation-recommender", "claude-md-improver", "create-cowork-plugin", "math-olympiad", "playground",
  "project-artifact", "receipts", "session-report", "writing-hookify-rules",
];
const WITH_LICENSE = ["claude-marketplace-skill-creator", "claude-skill-creator", "cowork-plugin-customizer", "frontend-design"];
const APACHE = [...LEGACY, ...WITH_LICENSE];
const { ownDeclared: OWN, mit: MIT } = require(path.join(ROOT, "data/sale-rights.cjs"));
const IDS = [...APACHE, ...OWN, ...MIT];
const kindOf = (id) => (MIT.includes(id) ? "mit" : OWN.includes(id) ? "own" : "apache");
const EXTERNAL = {
  "discord-access": "discord", "discord-configure": "discord", "telegram-access": "telegram", "telegram-configure": "telegram",
  "imessage-access": "imessage", "imessage-configure": "imessage", "writing-hookify-rules": "hookify",
};

const digest = (b) => crypto.createHash("sha256").update(b).digest("hex");
const text = (b) => strFromU8(b);

function indexSources() {
  const skills = {}, plugins = {};
  (function walk(dir, depth) {
    if (depth > 11) return;
    let items;
    try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of items) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, depth + 1);
      else if (e.name === "SKILL.md") (skills[path.basename(dir)] ??= []).push(dir);
      else if (e.name === "plugin.json" && path.basename(dir) === ".claude-plugin") plugins[path.basename(path.dirname(dir))] = path.dirname(dir);
    }
  })(pluginsRoot, 0);
  return { skills, plugins };
}
function findUp(dir, test) {
  let d = dir;
  for (let i = 0; i < 9 && d.length >= pluginsRoot.length; i++) {
    const hit = fs.readdirSync(d).find(test);
    if (hit) return path.join(d, hit);
    d = path.dirname(d);
  }
  return null;
}
function originOf(id, index) {
  const starts = [...(index.skills[id] || []), ...(index.skills[id.replace(/^claude-/, "")] || [])];
  if (id === "claude-marketplace-skill-creator") starts.push(...(index.skills["skill-creator"] || []));
  if (!starts.length && EXTERNAL[id] && index.plugins[EXTERNAL[id]]) starts.push(index.plugins[EXTERNAL[id]]);
  for (const start of starts) {
    const licenseFile = findUp(start, (n) => /^licen[cs]e/i.test(n));
    if (!licenseFile) continue;
    const license = fs.readFileSync(licenseFile);
    if (!STAGED_LICENSE.test(license.toString("utf8"))) continue;
    const manifestPath = findUp(start, (n) => n === ".claude-plugin");
    let plugin = path.basename(path.dirname(licenseFile)), author = "autores do plugin de origem";
    if (manifestPath) {
      try {
        const m = JSON.parse(fs.readFileSync(path.join(manifestPath, "plugin.json"), "utf8"));
        plugin = m.name || plugin;
        author = (m.author && (m.author.name || m.author)) || author;
      } catch { /* mantém o padrão */ }
    }
    return { license, plugin, author };
  }
  throw Error("Licença Apache de origem não encontrada: " + id);
}

const drivedataLicense = (id) => `LICENÇA DRIVEDATA DECK
Copyright (c) 2026 DriveData.

1. O que esta licença cobre
Somente o material criado pela DriveData neste pacote: guias de uso, roteiros, contratos operacionais, casos de validação, scripts de apoio e as alterações feitas nos arquivos originais, conforme ${id}/${NOTICE}.

2. O que esta licença não cobre
A obra original que serviu de base continua sob a Apache License 2.0, cujo texto está em ${id}/LICENSE.txt. Nada nesta licença limita os direitos que a Apache License 2.0 concede sobre essa obra.

3. O que o comprador pode fazer
Usar, copiar e adaptar o material da DriveData nas próprias atividades e nas da empresa em que trabalha.

4. O que o comprador não pode fazer
Revender, sublicenciar ou redistribuir o material da DriveData a terceiros, isolado ou dentro de outro produto.

5. Sem garantia
O material é fornecido no estado em que se encontra, sem garantia de resultado. O comprador deve conferir cada entrega antes de usá-la.
`;

const commonTerms = `O que o comprador pode fazer
Usar, copiar e adaptar o material nas próprias atividades e nas da empresa em que trabalha.

O que o comprador não pode fazer
Revender, sublicenciar ou redistribuir o material a terceiros, isolado ou dentro de outro produto.

Sem garantia
O material é fornecido no estado em que se encontra, sem garantia de resultado. O comprador deve conferir cada entrega antes de usá-la.
`;
const ownLicense = () => `LICENÇA DRIVEDATA DECK
Copyright (c) 2026 DriveData. Esta licença cobre todo o conteúdo deste pacote.

${commonTerms}`;
const mitLicense = (file) => `LICENÇA DRIVEDATA DECK
Copyright (c) 2026 DriveData.

Esta licença cobre somente o material criado pela DriveData neste pacote. A obra original continua sob a licença MIT, cujo texto e aviso de autoria estão em ${file}, e nada aqui limita os direitos que ela concede.

${commonTerms}`;

// Autoria própria e MIT: só acrescenta os termos e troca o aviso antigo. Skill e demais arquivos ficam iguais.
function buildTerms(id, kind) {
  const baseline = fs.readFileSync(path.join(baseDir, id + ".zip"));
  const baseMeta = JSON.parse(fs.readFileSync(path.join(baseDir, id + ".json"), "utf8"));
  const entries = { ...unzipSync(baseline) };
  const mitFile = kind === "mit" ? `${id}/${baseMeta.licenseFiles[0]}` : null;
  if (mitFile && !entries[mitFile]) throw Error("Licença MIT ausente: " + id);
  const before = Object.fromEntries(Object.entries(entries).map(([n, b]) => [n, digest(b)]));
  entries[PACKAGE_LICENSE] = strToU8(kind === "mit" ? mitLicense(mitFile) : ownLicense());
  const review = text(entries["REVISAO.md"]);
  const reviewNew = review.replace(/Termos: .*?Distribuição comercial não liberada por esta revisão técnica\./s, kind === "mit" ? `Termos: licença MIT sobre a obra original (${mitFile}) e Licença DriveData sobre o material novo (${PACKAGE_LICENSE}).` : `Termos: Licença DriveData (${PACKAGE_LICENSE}).`);
  if (reviewNew === review) throw Error("Trecho de termos não encontrado em REVISAO.md: " + id);
  entries["REVISAO.md"] = strToU8(reviewNew);
  if (entries["COMO-USAR.md"]) entries["COMO-USAR.md"] = strToU8(text(entries["COMO-USAR.md"]).replaceAll(`Edição ${BASE}`, `Edição ${VERSION}`));
  const changes = [];
  for (const name of Object.keys(entries).sort()) {
    if (["MANIFEST.json", "INTEGRIDADE.json", "REVISAO.md"].includes(name)) continue;
    const now = digest(entries[name]);
    if (before[name] !== now) changes.push({ path: name, kind: before[name] ? "modified" : "added", beforeSha256: before[name] || null, afterSha256: now });
  }
  const manifest = {
    ...JSON.parse(text(entries["MANIFEST.json"])), version: VERSION, date: DATE,
    license: kind === "mit" ? "MIT e termos DriveData" : "Termos DriveData",
    baselineVersion: BASE, baselinePackageSha256: digest(baseline), baselineSourceSha256: before[`${id}/SKILL.md`], changes,
  };
  entries["MANIFEST.json"] = strToU8(JSON.stringify(manifest, null, 2) + "\n");
  delete entries["INTEGRIDADE.json"];
  const hashes = Object.fromEntries(Object.entries(entries).map(([n, b]) => [n, digest(b)]));
  entries["INTEGRIDADE.json"] = strToU8(JSON.stringify(hashes, null, 2) + "\n");
  const zip = Buffer.from(zipSync(entries, { level: 6, mtime: new Date("2026-11-08T12:00:00Z") }));
  if (zip.length >= 4000000) throw Error("Pacote grande demais: " + id);
  return { zip, metadata: { ...manifest, sha256: digest(zip), bytes: zip.length, fileCount: Object.keys(entries).length } };
}

function noticeFile(id, origin, baseMeta) {
  const lines = (baseMeta.changes || []).map((c) => `- ${c.path}: ${{ modified: "alterado", added: "criado pela DriveData", "omitted-private-or-superseded": "removido ou substituído" }[c.kind] || c.kind}`);
  return `# Alterações e autoria

Obra original: plugin "${origin.plugin}", de ${origin.author}, distribuído sob a Apache License 2.0. O texto da licença está em LICENSE.txt, nesta pasta.

Este pacote é uma versão modificada dessa obra. A DriveData alterou os arquivos abaixo em novembro de 2026, além de normalizar caminhos e reorganizar a documentação de uso.

${lines.join("\n")}

O material criado pela DriveData segue os termos de LICENCA-DRIVEDATA.txt, na raiz do pacote. A obra original continua sob a Apache License 2.0.
`;
}

function build(id, index) {
  if (kindOf(id) !== "apache") return buildTerms(id, kindOf(id));
  const baseline = fs.readFileSync(path.join(baseDir, id + ".zip"));
  const baseMeta = JSON.parse(fs.readFileSync(path.join(baseDir, id + ".json"), "utf8"));
  const entries = { ...unzipSync(baseline) };
  const origin = originOf(id, index);
  const entry = `${id}/SKILL.md`, licenseKey = `${id}/LICENSE.txt`;
  if (!entries[entry]) throw Error("SKILL.md ausente: " + id);
  const before = Object.fromEntries(Object.entries(entries).map(([n, b]) => [n, digest(b)]));

  if (!entries[licenseKey]) entries[licenseKey] = new Uint8Array(origin.license);
  entries[`${id}/${NOTICE}`] = strToU8(noticeFile(id, origin, baseMeta));
  entries[PACKAGE_LICENSE] = strToU8(drivedataLicense(id));
  entries[entry] = strToU8(`${text(entries[entry]).replace(/\s*$/, "")}\n\n<!-- Arquivo alterado pela DriveData em novembro de 2026. Veja ${NOTICE}. -->\n`);

  const review = text(entries["REVISAO.md"]);
  const reviewNew = review.replace(/Termos: .*?Distribuição comercial não liberada por esta revisão técnica\./s, `Termos: Apache License 2.0 sobre a obra original (${licenseKey}) e Licença DriveData sobre o material novo (${PACKAGE_LICENSE}).`);
  if (reviewNew === review) throw Error("Trecho de termos não encontrado em REVISAO.md: " + id);
  entries["REVISAO.md"] = strToU8(reviewNew);
  if (entries["COMO-USAR.md"]) entries["COMO-USAR.md"] = strToU8(text(entries["COMO-USAR.md"]).replaceAll(`Edição ${BASE}`, `Edição ${VERSION}`));

  const changes = [];
  for (const name of Object.keys(entries).sort()) {
    if (["MANIFEST.json", "INTEGRIDADE.json", "REVISAO.md"].includes(name)) continue;
    const now = digest(entries[name]);
    if (before[name] !== now) changes.push({ path: name, kind: before[name] ? "modified" : "added", beforeSha256: before[name] || null, afterSha256: now });
  }
  const manifest = {
    ...JSON.parse(text(entries["MANIFEST.json"])), version: VERSION, date: DATE, license: LICENSE_LABEL,
    licenseFiles: ["LICENSE.txt"], baselineVersion: BASE, baselinePackageSha256: digest(baseline),
    baselineSourceSha256: before[entry], sourceSha256: digest(entries[entry]), changes,
  };
  entries["MANIFEST.json"] = strToU8(JSON.stringify(manifest, null, 2) + "\n");
  delete entries["INTEGRIDADE.json"];
  const hashes = Object.fromEntries(Object.entries(entries).map(([n, b]) => [n, digest(b)]));
  entries["INTEGRIDADE.json"] = strToU8(JSON.stringify(hashes, null, 2) + "\n");
  const zip = Buffer.from(zipSync(entries, { level: 6, mtime: new Date("2026-11-08T12:00:00Z") }));
  if (zip.length >= 4000000) throw Error("Pacote grande demais: " + id);
  return { zip, metadata: { ...manifest, sha256: digest(zip), bytes: zip.length, fileCount: Object.keys(entries).length } };
}

function check(id, index) {
  const zip = fs.readFileSync(path.join(outDir, id + ".zip"));
  const meta = JSON.parse(fs.readFileSync(path.join(outDir, id + ".json"), "utf8"));
  const baseZip = fs.readFileSync(path.join(baseDir, id + ".zip"));
  const baseMeta = JSON.parse(fs.readFileSync(path.join(baseDir, id + ".json"), "utf8"));
  const fail = (m) => { throw Error(`${id}: ${m}`); };
  if (digest(zip) !== meta.sha256 || zip.length !== meta.bytes) fail("hash ou tamanho do ZIP");
  if (digest(baseZip) !== baseMeta.sha256) fail("a 1.2.0 foi alterada");
  if (meta.version !== VERSION || meta.baselinePackageSha256 !== baseMeta.sha256) fail("versão ou base");
  const entries = unzipSync(zip), base = unzipSync(baseZip);
  if (Object.keys(entries).length !== meta.fileCount) fail("contagem de arquivos");
  const integrity = JSON.parse(text(entries["INTEGRIDADE.json"]));
  for (const [n, h] of Object.entries(integrity)) if (!entries[n] || digest(entries[n]) !== h) fail("integridade de " + n);
  for (const n of Object.keys(entries)) if (n !== "INTEGRIDADE.json" && !integrity[n]) fail("sem hash: " + n);
  const apache = kindOf(id) === "apache";
  if (apache) {
    const licenseKey = `${id}/LICENSE.txt`;
    if (!STAGED_LICENSE.test(text(entries[licenseKey]))) fail("LICENSE não é Apache 2.0");
    if (base[licenseKey] ? digest(base[licenseKey]) !== digest(entries[licenseKey]) : digest(originOf(id, index).license) !== digest(entries[licenseKey])) fail("LICENSE difere da origem");
    if (!entries[`${id}/${NOTICE}`]) fail("aviso de alteração ausente");
  }
  if (!entries[PACKAGE_LICENSE]) fail("termos ausentes");
  const allowed = new Set([...(apache ? [`${id}/SKILL.md`] : []), "COMO-USAR.md", "REVISAO.md", "MANIFEST.json", "INTEGRIDADE.json"]);
  for (const n of Object.keys(base)) {
    if (!entries[n]) fail("arquivo perdido: " + n);
    if (!allowed.has(n) && digest(base[n]) !== digest(entries[n])) fail("arquivo mudou sem previsão: " + n);
  }
  const skill = text(entries[`${id}/SKILL.md`]), original = text(base[`${id}/SKILL.md`]);
  if (!skill.startsWith(original.replace(/\s*$/, ""))) fail("corpo da SKILL.md mudou");
  if (/Distribuição comercial não liberada/.test(text(entries["REVISAO.md"]))) fail("aviso antigo em REVISAO.md");
}

function apply() {
  const releases = require(path.join(ROOT, "data/releases.cjs"));
  const reviewPath = path.join(ROOT, "data/pricing-review.json");
  const review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
  for (const id of IDS) {
    const meta = JSON.parse(fs.readFileSync(path.join(outDir, id + ".json"), "utf8"));
    releases[id] = meta;
    const record = review.records.find((r) => r.id === id);
    if (!record) throw Error("Sem avaliação de preço: " + id);
    Object.assign(record, { version: VERSION, packageSha256: meta.sha256, sourceSha256: meta.sourceSha256 });
  }
  fs.writeFileSync(path.join(ROOT, "data/releases.cjs"), "// Generated package metadata; no source contents or credentials.\nmodule.exports = " + JSON.stringify(releases, null, 2) + ";\n");
  fs.writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");
  console.log(`Catálogo apontando para ${VERSION} em ${IDS.length} cartas. Importe no banco antes de publicar.`);
}

function main() {
  if (APACHE.length !== 44 || IDS.length !== 95 || new Set(IDS).size !== 95) throw Error("Lista de cartas vendáveis inválida");
  if (process.argv.includes("--apply")) { for (const id of IDS) check(id, indexSources()); return apply(); }
  const index = indexSources();
  if (!process.argv.includes("--check")) {
    const built = IDS.map((id) => [id, build(id, index)]);
    fs.mkdirSync(outDir, { recursive: true });
    for (const [id, { zip, metadata }] of built) {
      const file = path.join(outDir, id + ".zip");
      if (fs.existsSync(file) && digest(fs.readFileSync(file)) !== metadata.sha256) throw Error("Versão imutável já existe com outro conteúdo: " + id);
      fs.writeFileSync(file, zip);
      fs.writeFileSync(path.join(outDir, id + ".json"), JSON.stringify(metadata, null, 2) + "\n");
    }
  }
  for (const id of IDS) check(id, index);
  console.log(`${IDS.length} pacotes ${VERSION} conferidos: licença, aviso, termos, hashes e 1.2.0 intacta.`);
}
main();
