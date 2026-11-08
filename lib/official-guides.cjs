"use strict";
// Cartas de outros fabricantes sem permissão de redistribuição: o Deck não entrega o arquivo.
// A carta vira um guia gratuito que leva à fonte oficial.
const rights = require("../data/sale-rights.cjs");

const blocked = new Set([...rights.freeOffice, ...rights.proprietary, ...rights.noLicense]);
const FIGMA_SOURCE = "https://github.com/figma/mcp-server-guide";
const OFFICIAL_MARKETPLACE = "https://github.com/anthropics/claude-plugins-official";
const OFFICE = new Set(["claude-docx", "claude-pdf", "claude-pptx", "claude-xlsx", "claude-xlsx-staging"]);

const notes = {
  office: {
    pt: "Skill oficial e gratuita da Anthropic. No Claude Code, adicione o marketplace com /plugin marketplace add anthropics/skills e instale com o comando abaixo.",
    en: "Official free skill from Anthropic. In Claude Code, add the marketplace with /plugin marketplace add anthropics/skills and install with the command below.",
    es: "Skill oficial y gratuita de Anthropic. En Claude Code, agrega el marketplace con /plugin marketplace add anthropics/skills e instala con el siguiente comando.",
  },
  figma: {
    pt: "Skill oficial do plugin gratuito da Figma. No Claude Code, instale o plugin com o comando abaixo.",
    en: "Official skill from the free Figma plugin. In Claude Code, install the plugin with the command below.",
    es: "Skill oficial del plugin gratuito de Figma. En Claude Code, instala el plugin con el siguiente comando.",
  },
  security: {
    pt: "Plugin oficial da Anthropic. No Claude Code, instale com o comando abaixo.",
    en: "Official plugin from Anthropic. In Claude Code, install it with the command below.",
    es: "Plugin oficial de Anthropic. En Claude Code, instálalo con el siguiente comando.",
  },
  native: {
    pt: "Recurso do próprio aplicativo Claude, ativado nas configurações do aplicativo.",
    en: "A feature of the Claude app itself, enabled in the app settings.",
    es: "Función de la propia aplicación Claude, que se activa en su configuración.",
  },
};

function officialGuide(id, locale = "pt") {
  if (!blocked.has(id) || rights.authorizations[id]) return null;
  const lang = ["en", "es"].includes(locale) ? locale : "pt";
  if (OFFICE.has(id))
    return { publisher: "Anthropic", url: "https://github.com/anthropics/skills", command: "/plugin install document-skills@anthropic-agent-skills", note: notes.office[lang], packaged: rights.freeOffice.includes(id) };
  if (rights.noLicense.includes(id))
    return { publisher: "Figma", url: FIGMA_SOURCE, command: "/plugin install figma@claude-plugins-official", note: notes.figma[lang] };
  if (id === "claude-security")
    return { publisher: "Anthropic", url: OFFICIAL_MARKETPLACE, command: "/plugin install claude-security@claude-plugins-official", note: notes.security[lang] };
  return { publisher: "Anthropic", url: "https://claude.ai", command: null, note: notes.native[lang] };
}

module.exports = { officialGuide };
