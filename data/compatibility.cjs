"use strict";
// Source-specific requirements, not an assertion that any assistant executed them.
// The authored catalog dependencies remain the detailed source of requirements.
const skills = require("./skills.cjs");
const capabilities = [
  ["terminal", "Terminal local", "Local terminal", "Terminal local"],
  [
    "python",
    "Python e bibliotecas",
    "Python and libraries",
    "Python y bibliotecas",
  ],
  [
    "spreadsheets",
    "Ferramentas de planilha e recálculo",
    "Spreadsheet and recalculation tools",
    "Herramientas de hojas de cálculo y recálculo",
  ],
  [
    "documents",
    "Ferramentas de documentos Office",
    "Office document tools",
    "Herramientas de documentos Office",
  ],
  [
    "pdf",
    "Extração e geração de PDF",
    "PDF extraction and generation",
    "Extracción y generación de PDF",
  ],
  [
    "node",
    "Node.js e dependências do projeto",
    "Node.js and project dependencies",
    "Node.js y dependencias del proyecto",
  ],
  [
    "browser",
    "Automação de navegador",
    "Browser automation",
    "Automatización del navegador",
  ],
  ["figma", "Conector Figma MCP", "Figma MCP connector", "Conector Figma MCP"],
  ["figquery", "Backend Figquery", "Figquery backend", "Backend Figquery"],
  [
    "google",
    "Conectores Google Workspace",
    "Google Workspace connectors",
    "Conectores Google Workspace",
  ],
  [
    "powerbi",
    "Power BI e ferramentas do modelo",
    "Power BI and model tools",
    "Power BI y herramientas del modelo",
  ],
  [
    "postgres",
    "PostgreSQL autorizado",
    "Authorized PostgreSQL access",
    "Acceso autorizado a PostgreSQL",
  ],
  ["erp", "API e ambiente ERP", "ERP API and environment", "API y entorno ERP"],
  [
    "asaas",
    "API Asaas configurada",
    "Configured Asaas API",
    "API Asaas configurada",
  ],
  [
    "claude_plugin",
    "Runtime de plugins Claude",
    "Claude plugin runtime",
    "Runtime de plugins Claude",
  ],
  [
    "channels",
    "Plugin de canal completo",
    "Complete channel plugin",
    "Plugin de canal completo",
  ],
  [
    "artifact",
    "Artifact e conta Claude",
    "Artifact and Claude account",
    "Artifact y cuenta Claude",
  ],
  [
    "magnitude",
    "Magnitude instalado",
    "Installed Magnitude",
    "Magnitude instalado",
  ],
  [
    "macos",
    "macOS com permissões locais",
    "macOS with local permissions",
    "macOS con permisos locales",
  ],
  [
    "usb",
    "Dispositivo e conexão USB",
    "Device and USB connection",
    "Dispositivo y conexión USB",
  ],
  ["ffmpeg", "ffmpeg e ffprobe", "ffmpeg and ffprobe", "ffmpeg y ffprobe"],
];
const rules = [
  [/^claude-xlsx(?:-staging)?$/, ["spreadsheets"], null],
  [
    /^claude-(docx|pptx)$|^automacao-documentos-office$|^claude-acta-drivedata$/,
    ["documents"],
    null,
  ],
  [/^claude-pdf$/, ["pdf"], null],
  [/^fullstack-nextjs-vercel$/, ["node", "terminal"], null],
  [/^figma-.*-figquery$/, ["figquery"], null],
  [/^figma-(?!.*-figquery$)|^generate-project-plan$/, ["figma"], null],
  [/^claude-google-workspace$/, ["google"], null],
  [
    /power-bi|powerbi|^claude-(pbip|pbir|tmdl|bi-documentation|power-query)/,
    ["powerbi"],
    null,
  ],
  [/^saas-multi-tenant-supabase$/, ["postgres"], null],
  [
    /^integracoes-erp-fiscal-financeiro$|^claude-protheus-expert$/,
    ["erp"],
    null,
  ],
  [/^pagamentos-recorrentes-asaas$/, ["asaas"], null],
  [
    /^(?:telegram|discord|imessage)-(?:access|configure)$/,
    ["channels", "claude_plugin"],
    "claude",
  ],
  [/^imessage-/, ["macos"], null],
  [
    /^(?:agent-development|command-development|hook-development|mcp-integration|plugin-settings|plugin-structure|skill-development|writing-hookify-rules|cowork-plugin-customizer|create-cowork-plugin)$/,
    ["claude_plugin"],
    null,
  ],
  [/^project-artifact$/, ["artifact"], "claude"],
  [/^orquestrador-de-modelos$/, ["terminal"], "claude"],
  [/^agent-builder$/, ["python","terminal"], null],
  [/^human-authentic-writing-audit$/, ["python"], null],
  [/^markdown-builder$/, ["python"], null],
  [/^master-prompt-generator$/, ["python"], null],
  [/^skill-builder$/, ["python","terminal"], null],
  [/^arquitetura-de-contexto-e-rag$/, [], null],
  [/^revisao-de-agentes-para-producao$/, [], null],
  [/^prontidao-de-sistemas-de-ia$/, [], null],
  [/^escolha-tecnica-de-modelos$/, [], null],
  [/^magnitude$/, ["magnitude", "terminal"], null],
  [/^(m5-onboard|cardputer-buddy)$/, ["usb", "python", "terminal"], null],
  [/^video-interaction-mapper$/, ["figma", "python", "ffmpeg"], null],
  [/^video-programatico-reels$/, ["browser", "python", "ffmpeg"], null],
  [/^(receipts|session-report)$/, ["terminal"], null],
  [
    /^claude-(built-in-browser|chrome-browser|computer-use(?:-staging)?)$/,
    ["browser"],
    null,
  ],
];
const entries = Object.fromEntries(
  skills.map((s) => {
    const matched = rules.filter(([pattern]) => pattern.test(s.id));
    return [
      s.id,
      {
        id: s.id,
        required: [...new Set(matched.flatMap((x) => x[1]))],
        runtime: matched.find((x) => x[2])?.[2] || null,
        source: "SKILL.md",
        sourceDependencies: [...s.dependencies],
        executionEvidence: [],
        installationEvidence: [],
      },
    ];
  }),
);
module.exports = { capabilities, entries };
