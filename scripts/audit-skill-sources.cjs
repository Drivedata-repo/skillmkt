"use strict";
// Read-only structural review of the exact packaged sources. Never executes them.
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const { unzipSync, strFromU8 } = require("fflate");
const skills = require("../data/skills.cjs"),
  releases = require("../data/releases.cjs");
const archiveRoot = path.resolve(process.argv[2] || ".local/releases/1.1.0");
const output = path.resolve(
  process.argv[3] || ".local/skill-source-audit.json",
);
const digest = (b) => crypto.createHash("sha256").update(b).digest("hex");
const reports = skills.map((s) => {
  const archive = fs.readFileSync(path.join(archiveRoot, s.id + ".zip"));
  if (digest(archive) !== releases[s.id].sha256)
    throw new Error("Release mismatch: " + s.id);
  const files = unzipSync(archive),
    entry = s.id + "/SKILL.md";
  if (!files[entry]) throw new Error("Missing SKILL.md: " + s.id);
  const source = strFromU8(files[entry]);
  const frontmatter = source.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  const text = source.replace(/^---\r?\n[\s\S]+?\r?\n---/, "");
  const brokenLinks = [],
    localLinks = [];
  for (const match of source.matchAll(/\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
    const raw = match[1]
      .trim()
      .replace(/^<|>$/g, "")
      .split(/\s+["']/)[0];
    if (/^(?:[a-z][\w+.-]*:|#|\/)/i.test(raw) || /[{}$<>]/.test(raw)) continue;
    const target = raw.split("#")[0];
    if (!target || !/\.[a-z0-9]{1,8}$/i.test(target)) continue;
    const normalized = path.posix.normalize(path.posix.join(s.id, target));
    localLinks.push(target);
    if (!Object.hasOwn(files, normalized)) brokenLinks.push(target);
  }
  return {
    id: s.id,
    code: s.code,
    version: releases[s.id].version,
    packageSha256: releases[s.id].sha256,
    sourceSha256: digest(files[entry]),
    sourceLines: source.split(/\r?\n/).length,
    bodyWords: text.trim().split(/\s+/).length,
    frontmatterValid:
      !!frontmatter &&
      /^name:\s*\S+/m.test(frontmatter[1]) &&
      /^description:\s*\S+/m.test(frontmatter[1]),
    markdownLinksChecked: localLinks.length,
    missingLocalLinks: [...new Set(brokenLinks)],
    scripts: Object.keys(files).filter((name) =>
      /\/(?:scripts|examples)\/.*\.(?:py|js|cjs|mjs|sh|ps1)$/.test(name),
    ).length,
    referenceFiles: Object.keys(files).filter((name) =>
      /\/references\//.test(name),
    ).length,
    platformToolNames: [
      ...new Set(source.match(/\bmcp__[a-z0-9_]+/gi) || []),
    ].sort(),
    termsStatus: releases[s.id].license,
    executionTested: false,
  };
});
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(reports, null, 2) + "\n");
console.log(
  JSON.stringify(
    {
      reviewed: reports.length,
      validFrontmatter: reports.filter((r) => r.frontmatterValid).length,
      skillsWithMissingLinks: reports
        .filter((r) => r.missingLocalLinks.length)
        .map((r) => ({ code: r.code, id: r.id, missing: r.missingLocalLinks })),
      longSources: reports
        .filter((r) => r.bodyWords > 5000)
        .map((r) => ({ code: r.code, words: r.bodyWords })),
      platformDependentSources: reports.filter(
        (r) => r.platformToolNames.length,
      ).length,
    },
    null,
    2,
  ),
);
