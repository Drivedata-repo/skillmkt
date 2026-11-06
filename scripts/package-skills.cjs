// Administrative preparation only: never run against originals during a public build.
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const { zipSync, strToU8, unzipSync } = require("fflate");
const skills = require("../data/skills.cjs"),
  examples = require("../data/examples.cjs");
const { run } = require("../lib/example-reference.cjs");
const source = process.argv[2];
if (!source) throw new Error("Pass the installed skills directory");
const version = "1.1.0",
  date = "2026-11-06",
  out = path.resolve(".local/releases", version);
fs.mkdirSync(out, { recursive: true });
const releases = {},
  report = [];
const hash = (b) => crypto.createHash("sha256").update(b).digest("hex");
const toolsMap = {
  Python: /\bpython|openpyxl|pandas\b/i,
  "Node.js": /\bnode\b|npm|npx/i,
  "Power BI": /power bi|powerbi|\bdax\b|\btmdl\b/i,
  Figma: /figma/i,
  "Conector MCP": /mcp__|MCP server|servidor MCP/i,
  "Claude específico": /claude\.ai|cowork|claude code|computer_use|use_figma/i,
  "LibreOffice / Office": /libreoffice|soffice|win32com|Word COM/i,
};
const forbidden =
  /\b(?:sk-[a-zA-Z0-9_-]{24,}|gsk_[a-zA-Z0-9]{20,}|gh[pousr]_[a-zA-Z0-9]{20,})\b|postgres(?:ql)?:\/\/[^\s:]+:[^\s@]+@|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/;
function portable(text) {
  return text
    .replace(/[A-Z]:\\+Users\\+[^\\/\s`"<>]+/gi, "<USER_HOME>")
    .replace(/\/(?:Users|home)\/[^/\s`"<>]+/g, "<USER_HOME>")
    .replace(/D:\\+CODEX\b/gi, "<WORKSPACE>");
}
for (const skill of skills) {
  const root = path.resolve(source, skill.id),
    entries = {},
    originalHashes = {},
    normalized = [];
  let sourceText = "";
  const licenses = [];
  function walk(dir) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, item.name),
        relative = path.relative(root, file).replaceAll("\\", "/");
      if (item.isSymbolicLink())
        throw new Error("Symlink requires review: " + skill.id);
      if (item.isDirectory()) {
        if (!["node_modules", ".git", "__pycache__"].includes(item.name))
          walk(file);
        continue;
      }
      if (/(^\.env|\.pem$|\.key$|credentials|\.pyc$)/i.test(item.name))
        throw new Error("Sensitive filename: " + skill.id);
      let content = fs.readFileSync(file);
      if (forbidden.test(content.toString("utf8")))
        throw new Error("Credential pattern: " + skill.id);
      originalHashes[relative] = hash(content);
      if (/licen[sc]e|notice|copyright/i.test(item.name))
        licenses.push(relative);
      if (/\.(md|txt|json|py|js|cjs|mjs|sh|yaml|yml)$/i.test(item.name)) {
        sourceText += "\n" + content.toString("utf8");
        if (
          /\.md$/i.test(item.name) &&
          !/licen[sc]e|notice|copyright/i.test(item.name)
        ) {
          const next = portable(content.toString("utf8"));
          if (next !== content.toString("utf8")) {
            normalized.push(relative);
            content = Buffer.from(next);
          }
        }
      }
      entries[skill.id + "/" + relative] = content;
    }
  }
  walk(root);
  const entry = entries[skill.id + "/SKILL.md"];
  if (
    !entry ||
    !/^---\r?\n[\s\S]+?\r?\n---/.test(entry.toString("utf8")) ||
    !/^name:\s*\S+/m.test(entry.toString("utf8")) ||
    !/^description:/m.test(entry.toString("utf8"))
  )
    throw new Error("Invalid skill frontmatter: " + skill.id);
  const tools = Object.keys(toolsMap).filter((k) =>
    toolsMap[k].test(sourceText),
  );
  const declaration =
    entry.toString("utf8").match(/^license:\s*(.+)$/m)?.[1] || null;
  const license = /proprietary|all rights reserved/i.test(declaration || "")
    ? "Termos restritivos identificados"
    : licenses.length || declaration
      ? "Termos encontrados; revisar distribuição"
      : "Licença de distribuição não identificada";
  const example = examples.find((x) => x.skillId === skill.id);
  const manifest = {
    schemaVersion: 1,
    id: skill.id,
    code: skill.code,
    version,
    date,
    format: "SKILL.md",
    review: "structure-checked",
    executionTested: false,
    license,
    licenseFiles: licenses,
    tools,
    requirements: skill.dependencies,
    normalizedFiles: normalized.length,
    commercialCleared: false,
    example: example
      ? { title: example.title, kind: example.kind, referenceVerified: true }
      : null,
  };
  entries["MANIFEST.json"] = strToU8(JSON.stringify(manifest, null, 2));
  entries["COMO-USAR.md"] = strToU8(
    `# ${skill.code} — ${skill.title}\n\nEdição ${version}. Coleção interna DriveData.\n\n## 1. Prepare seu ambiente\n\nEste pacote contém instruções para um assistente. O download não executa tarefas nem instala ferramentas.\n\n${skill.dependencies.map((x) => "- " + x).join("\n")}\n\nReferências de ferramentas encontradas: ${tools.join(", ") || "Confira o SKILL.md"}. São referências, não um teste de disponibilidade.\n\n## 2. Instale\n\n- Extraia o ZIP e localize a pasta ${skill.id}.\n- Codex: copie essa pasta para a pasta de skills do usuário. Nesta instalação foi validado ~/.codex/skills; respeite CODEX_HOME se configurado.\n- Claude Code: copie para ~/.claude/skills/${skill.id}. Recursos específicos do Claude ou de plugins exigem esses recursos instalados.\n- Outros assistentes: confirme primeiro suporte ao formato e às ferramentas.\n- Preserve versões existentes e abra um novo chat.\n\n## 3. Comece\n\nUse a skill ${skill.id} para me ajudar com [sua tarefa]. Quero ${skill.deliverables[0].toLowerCase()}. Confirme os arquivos e ferramentas necessários antes de executar. Entregue o resultado e uma forma de conferi-lo.\n\n## 4. Confira\n\n- A entrega atende à tarefa e usa os dados fornecidos?\n- As fontes e fórmulas estão claras?\n- O que não foi testado está identificado?\n\n${example ? "## Exemplo reproduzível\n\nA pasta exemplo contém dados fictícios, resultado de referência e um script Node.js sem dependências. Execute node exemplo/run.cjs após inspecioná-lo. Isso reproduz a referência, não executa a skill nem um modelo de IA.\n\n" : ""}## Portabilidade e atribuições\n\n${normalized.length} arquivos de documentação tiveram referências pessoais de caminhos substituídas por <USER_HOME> ou <WORKSPACE>. Ajuste esses marcadores ao ambiente. Scripts originais não foram reescritos automaticamente. Consulte REVISAO.md.\n\n${license}. Licenças e atribuições originais foram preservadas. Distribuição comercial ainda não foi liberada por esta revisão técnica.\n`,
  );
  entries["REVISAO.md"] = strToU8(
    `# Revisão técnica ${version}\n\n- Entrada SKILL.md e frontmatter: verificados.\n- Hash SHA-256: individual por arquivo no manifesto de integridade.\n- Checagem de padrões de credenciais: executada; não substitui revisão de conteúdo.\n- Execução integral da skill: não homologada.\n- Licenças: ${license}.\n- Arquivos de licença: ${licenses.join(", ") || "Nenhum arquivo identificado"}.\n- Documentação com caminhos normalizados: ${normalized.length}.\n- Declaração comercial: pendente de revisão dos termos de cada origem.\n\n## Mudanças\n\nGuia de primeiro uso, manifesto de versão, requisitos e critérios de conferência adicionados. ${example ? "Exemplo fictício reproduzível incluído." : ""}\n`,
  );
  if (example) {
    entries["exemplo/input.json"] = strToU8(
      JSON.stringify(example.input, null, 2),
    );
    entries["exemplo/result.json"] = strToU8(
      JSON.stringify(run(example.kind, example.input), null, 2),
    );
    entries["exemplo/reference.cjs"] = fs.readFileSync(
      "lib/example-reference.cjs",
    );
    entries["exemplo/run.cjs"] = strToU8(
      `const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');\nconst {run}=require('./reference.cjs');\nconst input=JSON.parse(fs.readFileSync(path.join(__dirname,'input.json'),'utf8'));\nconst expected=JSON.parse(fs.readFileSync(path.join(__dirname,'result.json'),'utf8'));\nconst output=run(${JSON.stringify(example.kind)},input);assert.deepEqual(output,expected);console.log(JSON.stringify(output,null,2));console.log('Referência conferida. Não é uma execução de IA.');\n`,
    );
    entries["exemplo/LEIA-ME.md"] = strToU8(
      `# ${example.title}\n\n${example.before}\n\n## Comando sugerido\n\n${example.task}\n\n## Resultado esperado\n\n${example.expected}\n\n${example.checks.map((x) => "- " + x).join("\n")}\n\n${example.limitation}\n`,
    );
  }
  const fileHashes = Object.fromEntries(
    Object.entries(entries).map(([k, v]) => [k, hash(v)]),
  );
  entries["INTEGRIDADE.json"] = strToU8(JSON.stringify(fileHashes, null, 2));
  const zip = Buffer.from(zipSync(entries, { level: 6 }));
  if (zip.length >= 4000000) throw new Error("Package too large");
  const unpacked = unzipSync(zip);
  for (const [name, digest] of Object.entries(fileHashes))
    if (hash(unpacked[name]) !== digest) throw new Error("Integrity mismatch");
  const meta = {
    ...manifest,
    sha256: hash(zip),
    bytes: zip.length,
    fileCount: Object.keys(entries).length,
  };
  fs.writeFileSync(path.join(out, skill.id + ".zip"), zip);
  fs.writeFileSync(
    path.join(out, skill.id + ".json"),
    JSON.stringify(meta, null, 2),
  );
  releases[skill.id] = meta;
  report.push({ id: skill.id, normalized, originalHashes, license, tools });
}
fs.writeFileSync(
  "data/releases.cjs",
  "// Generated package metadata; no archives or credentials.\nmodule.exports = " +
    JSON.stringify(releases, null, 2) +
    ";\n",
);
fs.writeFileSync(".local/package-review.json", JSON.stringify(report, null, 2));
console.log(
  JSON.stringify({
    packages: skills.length,
    examples: examples.length,
    version,
    normalizedFiles: report.reduce((n, r) => n + r.normalized.length, 0),
    licenseReviewRequired: report.length,
    bytes: Object.values(releases).reduce((n, r) => n + r.bytes, 0),
  }),
);
