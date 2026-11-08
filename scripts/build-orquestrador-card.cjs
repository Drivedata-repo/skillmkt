"use strict";
// Carta DD-138: empacota a skill orquestrador-de-modelos, de autoria DriveData, a partir da instalação local.
// Gera .local/releases/1.2.1/orquestrador-de-modelos.{zip,json} e grava os metadados em data/.
const fs = require("node:fs"), path = require("node:path"), os = require("node:os"), crypto = require("node:crypto");
const { zipSync, strToU8 } = require("fflate");

const ROOT = path.join(__dirname, "..");
const ID = "orquestrador-de-modelos", CODE = "DD-138", VERSION = "1.2.1", DATE = "2026-11-08";
const home = process.env.SKILL_SOURCE_HOME || path.join(os.homedir(), ".claude");
const digest = (b) => crypto.createHash("sha256").update(b).digest("hex");
const PRIVATE = /joaol|silvestrim|drivedata\.com\.br|[A-Z]:\\Users\\/i;

const requirements = [
  "Claude Code com suporte a hooks e agentes",
  "Node.js disponível na máquina",
  "A troca do modelo principal continua manual",
];

const howTo = `# ${CODE}: Modelo certo para cada tarefa no Claude Code

Edição ${VERSION}. Coleção DriveData Deck.

## 1. Instale

1. Copie a pasta \`${ID}\` para \`~/.claude/skills/\`.
2. Copie os arquivos de \`${ID}/agents/\` para \`~/.claude/agents/\`.
3. Em \`~/.claude/settings.json\`, acrescente o hook abaixo e abra uma sessão nova.

\`\`\`json
{
  "hooks": {
    "UserPromptSubmit": [
      { "hooks": [ { "type": "command", "command": "node \\"$HOME/.claude/skills/${ID}/scripts/classificar.js\\"", "timeout": 5 } ] }
    ]
  }
}
\`\`\`

No Windows, se \`$HOME\` não for reconhecido, use o caminho completo da pasta.

## 2. Confira

Envie um pedido simples e um pedido de arquitetura. O aviso do orquestrador deve indicar níveis diferentes. Para ver o resumo:

\`\`\`bash
node ~/.claude/skills/${ID}/scripts/classificar.js --relatorio
\`\`\`

## 3. Ajuste

Modelos e preços ficam na constante \`NIVEIS\` de \`scripts/classificar.js\`, e as regras no objeto \`RE\`. Confira os preços atuais antes de confiar na tabela.

## Limites

A classificação usa regras de texto e pode errar. O modelo principal da sessão só muda pelo menu do aplicativo. O log guarda data, nível e se o aviso apareceu, nunca o texto do pedido.
`;

const review = `# Revisão aplicada ${VERSION}

Skill autoral da DriveData, empacotada com hook, script e três agentes auxiliares.

## Verificação

Classificação conferida localmente com pedidos de consulta, rotina, impacto e caso crítico, e confirmação curta sem aviso. Uso prolongado e economia real: não medidos.

Termos: Licença DriveData (LICENCA-DRIVEDATA.txt).
`;

const license = `LICENÇA DRIVEDATA DECK
Copyright (c) 2026 DriveData. Esta licença cobre todo o conteúdo deste pacote.

O que o comprador pode fazer
Usar, copiar e adaptar o material nas próprias atividades e nas da empresa em que trabalha.

O que o comprador não pode fazer
Revender, sublicenciar ou redistribuir o material a terceiros, isolado ou dentro de outro produto.

Sem garantia
O material é fornecido no estado em que se encontra, sem garantia de resultado. O comprador deve conferir cada entrega antes de usá-la.
`;

const skillDir = path.join(home, "skills", ID), agentsDir = path.join(home, "agents");
const entries = {
  [`${ID}/SKILL.md`]: new Uint8Array(fs.readFileSync(path.join(skillDir, "SKILL.md"))),
  [`${ID}/scripts/classificar.js`]: new Uint8Array(fs.readFileSync(path.join(skillDir, "scripts/classificar.js"))),
  "COMO-USAR.md": strToU8(howTo),
  "REVISAO.md": strToU8(review),
  "LICENCA-DRIVEDATA.txt": strToU8(license),
};
for (const name of fs.readdirSync(agentsDir).filter((n) => /^orq-.*\.md$/.test(n)).sort())
  entries[`${ID}/agents/${name}`] = new Uint8Array(fs.readFileSync(path.join(agentsDir, name)));
if (Object.keys(entries).filter((n) => n.includes("/agents/")).length !== 3) throw Error("Esperados 3 agentes orq-*");
for (const [name, bytes] of Object.entries(entries))
  if (PRIVATE.test(Buffer.from(bytes).toString("utf8"))) throw Error("Dado pessoal no pacote: " + name);

const sourceSha256 = digest(entries[`${ID}/SKILL.md`]);
const manifest = {
  schemaVersion: 1, id: ID, code: CODE, version: VERSION, date: DATE, format: "SKILL.md", review: "structure-checked",
  executionTested: false, license: "Termos DriveData", licenseFiles: [], tools: [], requirements, normalizedFiles: 0,
  commercialCleared: false, example: null, sourceReview: "applied-specific-static-checked", distribution: "authenticated-demo",
  sourceSha256, sourcePolicy: "specific-amendments", changes: [],
};
entries["MANIFEST.json"] = strToU8(JSON.stringify(manifest, null, 2) + "\n");
const hashes = Object.fromEntries(Object.entries(entries).map(([n, b]) => [n, digest(b)]));
entries["INTEGRIDADE.json"] = strToU8(JSON.stringify(hashes, null, 2) + "\n");
const zip = Buffer.from(zipSync(entries, { level: 6, mtime: new Date("2026-11-08T12:00:00Z") }));
const metadata = { ...manifest, sha256: digest(zip), bytes: zip.length, fileCount: Object.keys(entries).length };

const out = path.join(ROOT, ".local/releases", VERSION);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, ID + ".zip"), zip);
fs.writeFileSync(path.join(out, ID + ".json"), JSON.stringify(metadata, null, 2) + "\n");

const releases = require(path.join(ROOT, "data/releases.cjs"));
releases[ID] = metadata;
fs.writeFileSync(path.join(ROOT, "data/releases.cjs"), "// Generated package metadata; no source contents or credentials.\nmodule.exports = " + JSON.stringify(releases, null, 2) + ";\n");

const { assessments } = require(path.join(ROOT, "data/skill-pricing.cjs"));
const { priceFor } = require(path.join(ROOT, "lib/pricing.cjs"));
const reviewPath = path.join(ROOT, "data/pricing-review.json");
const pricing = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
const record = {
  id: ID, code: CODE, version: VERSION, packageSha256: metadata.sha256, sourceSha256, contractSha256: sourceSha256,
  priceCents: priceFor(assessments[ID].scores), scores: assessments[ID].scores, family: null, rationale: assessments[ID].rationale,
  assessmentType: "documentary", executionVerified: false,
};
pricing.records = pricing.records.filter((r) => r.id !== ID).concat(record);
fs.writeFileSync(reviewPath, JSON.stringify(pricing, null, 2) + "\n");
console.log(`${CODE} gerada: ${metadata.fileCount} arquivos, ${metadata.bytes} bytes, US$ ${record.priceCents / 100}.`);
