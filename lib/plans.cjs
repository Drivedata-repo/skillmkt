"use strict";
const { assessCompatibility } = require("./compatibility.cjs");
const norm = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const negativeStage = (t, words) =>
  new RegExp(
    "\\b(?:sem|without|sin|nao quero|do not want|don't want|no quiero)\\b[^.;,]{0,30}\\b(?:" +
      words +
      ")",
  ).test(t);
const wantsSlides = (t) =>
  /slides|powerpoint|pptx|diapositiv/.test(t) &&
  !negativeStage(t, "slides|powerpoint|pptx|diapositiv");
const rules = [
  {
    id: "proposal-presentation",
    when: (t) =>
      /proposta comercial|commercial proposal|business proposal|propuesta comercial/.test(
        t,
      ) &&
      wantsSlides(t) &&
      !negativeStage(t, "proposta|proposal|propuesta"),
    ids: () => ["propostas-comerciais-e-estimativas", "claude-pptx"],
    title: [
      "Da proposta à apresentação",
      "From proposal to presentation",
      "De la propuesta a la presentación",
    ],
    why: [
      "Defina escopo, premissas e condições para revisão comercial antes de transformar a proposta em slides. Não invente preços nem resultados.",
      "Define scope, assumptions and terms for commercial review before turning the proposal into slides. Do not invent prices or outcomes.",
      "Define alcance, supuestos y condiciones para revisión comercial antes de convertir la propuesta en diapositivas. No inventes precios ni resultados.",
    ],
  },
  {
    id: "pdf-calculation",
    when: (t) =>
      /\bpdf\b/.test(t) &&
      /extrair|extract|extraer|ocr/.test(t) &&
      /calcul|margem|margin|margen|formula/.test(t) &&
      !negativeStage(t, "calcul|formula|margem|margin|margen"),
    ids: (t) => [
      "claude-pdf",
      "claude-xlsx",
      ...(wantsSlides(t) ? ["claude-pptx"] : []),
    ],
    title: [
      "Do PDF aos números conferidos",
      "From PDF to checked calculations",
      "Del PDF a cálculos comprobados",
    ],
    why: [
      "Extraia a tabela antes de calcular; apresente somente valores conferidos.",
      "Extract the table before calculating; present only checked values.",
      "Extrae la tabla antes de calcular; presenta solo valores comprobados.",
    ],
  },
  {
    id: "prototype-build",
    when: (t) =>
      /prototip|prototype/.test(t) &&
      /desenvolv|develop|implement|desarroll|next[. ]?js/.test(t) &&
      !/antes de (?:desenvolv|program)|before (?:develop|coding)|antes del desarrollo/.test(
        t,
      ),
    ids: (t) => [
      "prototipos-e-especificacao-funcional",
      "fullstack-nextjs-vercel",
      ...(/seguranca|security|seguridad/.test(t)
        ? ["security-and-hardening"]
        : []),
    ],
    title: [
      "Da ideia à implementação revisável",
      "From idea to reviewable implementation",
      "De la idea a una implementación revisable",
    ],
    why: [
      "Valide telas e regras, implemente o escopo aprovado e revise os controles quando solicitado.",
      "Validate screens and rules, implement the approved scope and review controls when requested.",
      "Valida pantallas y reglas, implementa el alcance aprobado y revisa controles cuando se solicite.",
    ],
  },
  {
    id: "data-presentation",
    when: (t) => /power bi|dax|reconcil|divergen/.test(t) && wantsSlides(t),
    ids: () => ["power-bi-modelagem-dax-performance", "claude-pptx"],
    title: [
      "Dos indicadores à apresentação",
      "From metrics to presentation",
      "De indicadores a presentación",
    ],
    why: [
      "Confira os indicadores e só então prepare a narrativa para apresentação.",
      "Check the metrics before preparing the presentation narrative.",
      "Comprueba los indicadores antes de preparar la narración de la presentación.",
    ],
  },
  {
    id: "minutes-presentation",
    when: (t) => /transcri|transcript/.test(t) && wantsSlides(t),
    ids: () => ["claude-acta-drivedata", "claude-pptx"],
    title: [
      "Da reunião à apresentação",
      "From meeting to presentation",
      "De la reunión a la presentación",
    ],
    why: [
      "Organize decisões e pendências antes de apresentá-las, sem inventar responsáveis ou datas.",
      "Organize decisions and gaps before presenting them, without inventing owners or dates.",
      "Organiza decisiones y pendientes antes de presentarlos, sin inventar responsables ni fechas.",
    ],
  },
  {
    id: "content-website",
    when: (t) =>
      /conteudo|content|contenido|editorial/.test(t) &&
      /site|website|landing page|sitio web/.test(t) &&
      /oferta|offer|servic|servic|servico|b2b/.test(t) &&
      !/content.type|\bhttp\b/.test(t),
    ids: () => ["marketing-de-conteudo-b2b", "sites-institucionais-e-seo"],
    title: [
      "Da oferta ao site",
      "From offer to website",
      "De la oferta al sitio",
    ],
    why: [
      "Defina a mensagem com fatos aprovados e aplique-a à estrutura do site.",
      "Define messaging from approved facts and apply it to the website structure.",
      "Define el mensaje con hechos aprobados y aplícalo a la estructura del sitio.",
    ],
  },
];
const stepText = {
  "propostas-comerciais-e-estimativas": [
    [
      "Necessidade do cliente, escopo, premissas e parâmetros comerciais autorizados",
      "Customer need, scope, assumptions and authorized commercial parameters",
      "Necesidad del cliente, alcance, supuestos y parámetros comerciales autorizados",
    ],
    [
      "Proposta com escopo, estimativas e condições para aprovação comercial",
      "Proposal with scope, estimates and terms for commercial approval",
      "Propuesta con alcance, estimaciones y condiciones para aprobación comercial",
    ],
  ],
  "claude-pdf": [
    [
      "PDF fornecido e tabela desejada",
      "Supplied PDF and target table",
      "PDF proporcionado y tabla deseada",
    ],
    [
      "Tabela extraída com páginas de origem e dúvidas de leitura",
      "Extracted table with source pages and reading uncertainties",
      "Tabla extraída con páginas de origen y dudas de lectura",
    ],
  ],
  "claude-xlsx": [
    [
      "Tabela conferida e regras de cálculo aprovadas",
      "Checked table and approved calculation rules",
      "Tabla comprobada y reglas de cálculo aprobadas",
    ],
    [
      "Planilha com fórmulas e totais conferidos",
      "Spreadsheet with formulas and checked totals",
      "Hoja con fórmulas y totales comprobados",
    ],
  ],
  "claude-pptx": [
    [
      "Resultados conferidos, público e objetivo da apresentação",
      "Checked results, audience and presentation objective",
      "Resultados comprobados, público y objetivo de presentación",
    ],
    [
      "Slides editáveis com narrativa sustentada pelos dados",
      "Editable slides with a narrative supported by the data",
      "Diapositivas editables con narración sustentada por los datos",
    ],
  ],
  "prototipos-e-especificacao-funcional": [
    [
      "Objetivo, usuários e regras a validar",
      "Goal, users and rules to validate",
      "Objetivo, usuarios y reglas por validar",
    ],
    [
      "Protótipo e requisitos para aprovação",
      "Prototype and requirements for approval",
      "Prototipo y requisitos para aprobación",
    ],
  ],
  "fullstack-nextjs-vercel": [
    [
      "Escopo aprovado, repositório e ambiente autorizado",
      "Approved scope, repository and authorized environment",
      "Alcance aprobado, repositorio y entorno autorizado",
    ],
    [
      "Implementação revisável com verificação dos fluxos",
      "Reviewable implementation with workflow checks",
      "Implementación revisable con comprobación de flujos",
    ],
  ],
  "security-and-hardening": [
    [
      "Código, fluxos de dados e acessos autorizados",
      "Code, data flows and authorized access",
      "Código, flujos de datos y accesos autorizados",
    ],
    [
      "Controles revisados e evidência dos testes de segurança",
      "Reviewed controls and security test evidence",
      "Controles revisados y evidencia de pruebas de seguridad",
    ],
  ],
  "power-bi-modelagem-dax-performance": [
    [
      "Modelo e fonte de conferência dos indicadores",
      "Model and a reference source for the metrics",
      "Modelo y fuente de comprobación de indicadores",
    ],
    [
      "Indicadores conferidos e divergências documentadas",
      "Checked metrics and documented discrepancies",
      "Indicadores comprobados y diferencias documentadas",
    ],
  ],
  "claude-acta-drivedata": [
    [
      "Transcrição autorizada e contexto da reunião",
      "Authorized transcript and meeting context",
      "Transcripción autorizada y contexto de la reunión",
    ],
    [
      "Ata com decisões, responsáveis e pendências explícitas",
      "Minutes with decisions, owners and explicit gaps",
      "Acta con decisiones, responsables y pendientes explícitos",
    ],
  ],
  "marketing-de-conteudo-b2b": [
    [
      "Oferta, público e fatos aprovados",
      "Offer, audience and approved facts",
      "Oferta, público y hechos aprobados",
    ],
    [
      "Mensagem e conteúdo para revisão",
      "Messaging and content for review",
      "Mensaje y contenido para revisión",
    ],
  ],
  "sites-institucionais-e-seo": [
    [
      "Conteúdo aprovado, identidade e objetivo do site",
      "Approved content, identity and website goal",
      "Contenido aprobado, identidad y objetivo del sitio",
    ],
    [
      "Estrutura e conteúdo do site com checklist técnico",
      "Website structure and content with technical checklist",
      "Estructura y contenido del sitio con comprobación técnica",
    ],
  ],
};
function buildPlan(problem, eligibleSkills, profile = {}, locale = "pt") {
  const n = norm(problem),
    rule = rules.find((r) => r.when(n));
  if (!rule) return null;
  const ids = rule.ids(n),
    byId = new Map(eligibleSkills.map((s) => [s.id, s]));
  if (
    ids.some(
      (id) =>
        !byId.has(id) ||
        assessCompatibility(byId.get(id), profile, locale).blocking,
    )
  )
    return null;
  const i = { pt: 0, en: 1, es: 2 }[locale] || 0;
  return {
    id: rule.id,
    title: rule.title[i],
    rationale: rule.why[i],
    steps: ids.map((id, k) => ({
      order: k + 1,
      skillId: id,
      input: stepText[id][0][i],
      output: stepText[id][1][i],
      rationale:
        k === 0
          ? rule.why[i]
          : [
              "Revise a saída anterior e confirme os materiais exigidos por esta etapa.",
              "Review the previous output and confirm the materials required by this step.",
              "Revisa la salida anterior y confirma los materiales exigidos por esta etapa.",
            ][i],
      compatibility: assessCompatibility(byId.get(id), profile, locale),
    })),
    notice: [
      "Plano sugerido, sem execução automática. Revise cada saída e ajuste formatos antes da próxima etapa.",
      "Suggested plan, with no automatic execution. Review each output and adapt formats before the next step.",
      "Plan sugerido, sin ejecución automática. Revisa cada salida y adapta formatos antes de continuar.",
    ][i],
  };
}
module.exports = { buildPlan };
