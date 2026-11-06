// Run locally against the installed skills. Never commit generated archives.
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const { zipSync, strToU8, unzipSync } = require("fflate");
const skills = require("../data/skills.cjs");
const source = process.argv[2];
if (!source) throw new Error("Pass the installed skills directory");
const out = path.resolve(".local/packages");
fs.mkdirSync(out, { recursive: true });
let total = 0,
  largest = 0;
for (const skill of skills) {
  const root = path.resolve(source, skill.id),
    entries = {};
  function walk(dir) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, item.name);
      if (item.isSymbolicLink()) throw new Error("Symlink requires review");
      if (item.isDirectory()) {
        if (!["node_modules", ".git", "__pycache__"].includes(item.name))
          walk(file);
      } else {
        if (/(^\.env|\.pem$|\.key$|credentials|\.pyc$)/i.test(item.name))
          throw new Error("Sensitive file requires review in " + skill.id);
        const content = fs.readFileSync(file);
        if (
          /\b(?:sk-[a-zA-Z0-9_-]{24,}|gsk_[a-zA-Z0-9]{20,}|gh[pousr]_[a-zA-Z0-9]{20,})\b|postgres(?:ql)?:\/\/[^\s:]+:[^\s@]+@|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(
            content.toString("utf8"),
          )
        )
          throw new Error("Credential pattern requires review in " + skill.id);
        entries[
          skill.id + "/" + path.relative(root, file).replaceAll("\\", "/")
        ] = content;
      }
    }
  }
  walk(root);
  if (!entries[skill.id + "/SKILL.md"])
    throw new Error("Missing SKILL.md: " + skill.id);
  entries["COMO-USAR.md"] = strToU8(
    `# ${skill.code} — ${skill.title}\n\nPacote da coleção interna DriveData. Contém os arquivos da skill instalada e seus materiais auxiliares.\n\n## Instalar\n\n1. Extraia o ZIP.\n2. No Codex, copie a pasta ${skill.id} para a pasta skills do seu usuário Codex (normalmente ~/.codex/skills). Não substitua uma versão existente sem fazer backup.\n3. Abra um novo chat e peça para usar a skill pelo nome.\n4. Em outro assistente, verifique a compatibilidade do formato e das ferramentas antes de usar.\n\n## Começar\n\nUse a skill ${skill.id} para me ajudar com: [descreva seu problema]. Primeiro confirme os dados e as ferramentas necessários.\n\n## Dependências\n\n${skill.dependencies.map((x) => "- " + x).join("\n")}\n\nAs instruções podem conter caminhos e ferramentas do ambiente de origem. Ajuste-os ao seu ambiente. O pacote não instala plugins, programas, modelos ou credenciais e não executa ações ao ser baixado. Licenças e atribuições presentes nos arquivos originais são preservadas. Esta é uma demonstração interna, sem compra ou liberação comercial automática.\n`,
  );
  const zip = Buffer.from(zipSync(entries, { level: 6 }));
  if (zip.length >= 4000000)
    throw new Error("Package exceeds download limit: " + skill.id);
  const unpacked = unzipSync(zip);
  if (!unpacked[skill.id + "/SKILL.md"]) throw new Error("Invalid ZIP");
  const sha256 = crypto.createHash("sha256").update(zip).digest("hex");
  fs.writeFileSync(path.join(out, skill.id + ".zip"), zip);
  fs.writeFileSync(
    path.join(out, skill.id + ".json"),
    JSON.stringify({
      id: skill.id,
      sha256,
      fileCount: Object.keys(entries).length,
      bytes: zip.length,
    }),
  );
  total += zip.length;
  largest = Math.max(largest, zip.length);
}
console.log(
  JSON.stringify({
    packages: skills.length,
    totalBytes: total,
    largestBytes: largest,
    verified: true,
  }),
);
