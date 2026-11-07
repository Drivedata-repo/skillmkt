"use strict";
const { options } = require("../data/triage-options.cjs");
const base = require("../data/skills.cjs");
const { validateContext, assessCompatibility } = require("./compatibility.cjs");
const goalRules = {
  spreadsheets:
    /^(automacao-documentos-office|claude-xlsx(?:-staging)?|claude-power-query-best-practices)$/,
  bi: /power-bi|powerbi|^claude-(bi-documentation|pbip|pbir|tmdl|oraculo)/,
  documents:
    /^(automacao-documentos-office|claude-docx|claude-pdf|claude-pptx|claude-docs|claude-google-workspace|figma-use-slides(?:-figquery)?)$/,
  meetings:
    /^(claude-acta-drivedata|meeting-briefing|claude-morning|generate-project-plan|gestao-de-entregas-e-homologacao|project-artifact)$/,
  design:
    /^figma-|^(frontend-design|design-de-interface-autoral|prototipos-e-especificacao-funcional|playground|video-interaction-mapper)$/,
  product:
    /^(fullstack-nextjs-vercel|saas-multi-tenant-supabase|power-platform-code-first|prototipos-e-especificacao-funcional|sites-institucionais-e-seo|plataformas-de-ensino-online|power-bi-embedded-portais|ia-aplicada-a-produtos|claude-cloud-code-architecture|frontend-design|design-de-interface-autoral|playground)$/,
  integration:
    /^(integracoes-erp-fiscal-financeiro|claude-protheus-expert|pagamentos-recorrentes-asaas|saas-multi-tenant-supabase|power-bi-embedded-portais|claude-google-workspace|build-mcp-app|build-mcp-server|build-mcpb|mcp-integration)$/,
  automation:
    /automacao|automation|^build-mcp|mcp-integration|^agent-development|^hook-development|^command-development|^writing-hookify-rules|^power-platform|^ia-aplicada|^cowork-plugin|^create-cowork/,
  sales:
    /^(marketing-de-conteudo-b2b|prospeccao-b2b-linkedin|prospeccao-drivedata|propostas-comerciais-e-estimativas|sites-institucionais-e-seo|video-programatico-reels|claude-messi-knowledge-ingest|portfolio-de-projetos)$/,
  quality:
    /^(debugging-and-error-recovery|code-review-and-quality|security-and-hardening|security-audit|claude-security|git-workflow-and-versioning|shipping-and-launch|claude-cloud-code-architecture)$/,
  research:
    /^(claude-deep-research|claude-oraculo|claude-power-bi-data-analysis|meeting-briefing|brief|vendor-check)$/,
  legal:
    /^(brief|legal-response|legal-risk-assessment|review-contract|triage-nda|vendor-check|compliance-check|signature-request)$/,
};
const toolRules = {
  excel:
    /^(automacao-documentos-office|claude-xlsx(?:-staging)?|claude-power-query-best-practices|claude-oraculo)$/,
  powerbi: /power-bi|powerbi|^claude-(bi-documentation|pbip|pbir|tmdl|oraculo)/,
  office:
    /^(automacao-documentos-office|claude-docx|claude-pdf|claude-pptx|claude-acta-drivedata)$/,
  figma: /^figma-|^(generate-project-plan|video-interaction-mapper)$/,
  web: /^(fullstack-nextjs-vercel|frontend-design|design-de-interface-autoral|prototipos-e-especificacao-funcional|sites-institucionais-e-seo|saas-multi-tenant-supabase|power-bi-embedded-portais|plataformas-de-ensino-online|playground|ia-aplicada-a-produtos|security-and-hardening|security-audit|code-review-and-quality|debugging-and-error-recovery|claude-cloud-code-architecture)$/,
  supabase:
    /^(saas-multi-tenant-supabase|fullstack-nextjs-vercel|power-bi-embedded-portais)$/,
  protheus: /^(claude-protheus-expert|integracoes-erp-fiscal-financeiro)$/,
  asaas: /^(pagamentos-recorrentes-asaas|integracoes-erp-fiscal-financeiro)$/,
  google: /^claude-google-workspace$/,
  claude:
    /^(agent-development|claude-automation-recommender|claude-md-improver|claude-skill-creator|claude-marketplace-skill-creator|claude-security|command-development|cowork-plugin-customizer|create-cowork-plugin|hook-development|mcp-integration|skill-development|writing-hookify-rules)$/,
};
function validateProfile(input) {
  if (input === undefined || input === null)
    return {
      goal: "any",
      tool: "any",
      environment: "any",
      runtime: "any",
      availability: {},
    };
  const allowed = options();
  if (
    typeof input !== "object" ||
    Array.isArray(input) ||
    Object.keys(input).some(
      (key) => key !== "availability" && !Object.hasOwn(allowed, key),
    )
  )
    throw invalid();
  const result = {};
  for (const [key, rows] of Object.entries(allowed)) {
    const value = input[key] ?? "any";
    if (!rows.some((row) => row.id === value)) throw invalid();
    result[key] = value;
  }
  return {
    ...result,
    ...validateContext(result.runtime, input.availability ?? {}),
  };
}
function invalid() {
  return Object.assign(
    new Error("Escolha filtros válidos para refinar sua necessidade."),
    { status: 400 },
  );
}
function classify(skill) {
  return {
    goals: Object.keys(goalRules).filter((k) => goalRules[k].test(skill.id)),
    tools: Object.keys(toolRules).filter((k) => toolRules[k].test(skill.id)),
    connector:
      skill.role === "platform-specific" ||
      /^figma-|^generate-project-plan$|^claude-google-workspace$/.test(
        skill.id,
      ),
  };
}
const profiles = new Map(base.map((s) => [s.id, classify(s)]));
function eligible(skill, profile) {
  const p = profiles.get(skill.id);
  return (
    !!p &&
    (profile.goal === "any" || p.goals.includes(profile.goal)) &&
    (profile.tool === "any" || p.tools.includes(profile.tool)) &&
    (profile.environment !== "general" || !p.connector) &&
    !assessCompatibility(skill, profile).blocking
  );
}
function canRecommend(skill, audience, text) {
  if (audience !== "technical" && skill.audience === "technical") return false;
  if (skill.role !== "support") return true;
  // Internal context, templates and staging copies are not standalone solutions.
  // A few support skills are useful when the task explicitly calls for them.
  const supportNeeds = {
    "ambiente-dev-windows": /\bwindows\b/,
    "claude-pbir-format":
      /\bpbir\b.*\b(?:schema|format|formato|referencia|reference)\b/,
    "claude-tmdl": /\btmdl\b/,
    "git-workflow-and-versioning":
      /\b(?:git|branches|branch|merge|versionamento|versioning)\b/,
    "plugin-settings":
      /\bplugin\b.*\b(?:config|settings|configuracao|configuracion)\b/,
    "plugin-structure": /\bplugin\b.*\b(?:estrutura|structure|estructura)\b/,
    "propostas-comerciais-e-estimativas":
      /\b(?:orcamento|estimativa|estimate|quotation|quote|proposta comercial|commercial proposal|propuesta comercial|presupuesto)\b/,
    "shipping-and-launch": /\b(?:launch|lancamento|lanzamiento)\b/,
  };
  return !!supportNeeds[skill.id]?.test(text);
}
// Recognize explicit exclusions without treating every mention of a tool as interest.
// Scope ends at punctuation or a contrast; this deliberately avoids semantic guesses.
function excludeTools(problem, locale = "pt") {
  const tools = [
    ["powerbi", "power\\s*bi"],
    ["figma", "figma"],
    ["excel", "excel"],
    ["protheus", "protheus"],
    ["asaas", "asaas"],
    ["supabase", "supabase"],
  ];
  const text = String(problem)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const toolAhead =
    "(?=\\s+(?:power\\s*bi|figma|excel|protheus|asaas|supabase)\\b)";
  const starts = [
    "nao (?:uso|usamos|tenho|temos|quero usar|quero|preciso de)",
    "nao(?=\\s+(?:power\\s*bi|figma|excel|protheus|asaas|supabase))",
    "sem(?: usar)?" + toolAhead,
    "without(?: using)?" + toolAhead,
    "do not (?:use|have|want)",
    "don't (?:use|have|want)",
    "not" + toolAhead,
    "sin(?: usar)?" + toolAhead,
    ...(locale === "es"
      ? ["no (?:uso|usamos|tengo|tenemos|quiero usar|quiero)", "no" + toolAhead]
      : []),
  ];
  const negation = new RegExp(
    "\\b(?:" + starts.join("|") + ")\\b[^.;,!\\n]{0,90}",
    "g",
  );
  const excluded = new Set();
  let cleaned = text;
  for (const match of text.matchAll(negation)) {
    const clause = match[0].split(
      /\b(?:mas|but|pero|(?:e|and|y)\s+(?:(?:eu|i|yo)\s+)?(?:quero|preciso|uso|tenho|want|need|use|have|quiero|necesito|uso|tengo))\b/,
    )[0];
    let cleanClause = clause;
    for (const [id, name] of tools)
      if (new RegExp("\\b" + name + "\\b").test(clause)) {
        excluded.add(id);
        // Remove the excluded tool, not the rest of the user's task.
        cleanClause = cleanClause.replace(
          new RegExp("\\b" + name + "\\b", "g"),
          " ",
        );
      }
    cleaned = cleaned.replace(clause, cleanClause);
  }
  return { excluded: [...excluded], cleaned };
}
module.exports = {
  options,
  profiles,
  validateProfile,
  eligible,
  excludeTools,
  canRecommend,
};
