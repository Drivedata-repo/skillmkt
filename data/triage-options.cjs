"use strict";
// User-facing outcomes, not commercial packages or promises of compatibility.
const goals = [
  [
    "any",
    "Ainda estou descobrindo",
    "I'm still exploring",
    "Aún estoy explorando",
  ],
  [
    "spreadsheets",
    "Organizar ou calcular planilhas",
    "Organize or calculate spreadsheets",
    "Organizar o calcular hojas de cálculo",
  ],
  [
    "bi",
    "Confiar nos dados e indicadores",
    "Trust data and metrics",
    "Confiar en los datos e indicadores",
  ],
  [
    "documents",
    "Preparar documentos e apresentações",
    "Prepare documents and presentations",
    "Preparar documentos y presentaciones",
  ],
  [
    "meetings",
    "Organizar reuniões e entregas",
    "Organize meetings and delivery",
    "Organizar reuniones y entregas",
  ],
  [
    "design",
    "Desenhar interfaces e experiências",
    "Design interfaces and experiences",
    "Diseñar interfaces y experiencias",
  ],
  [
    "product",
    "Construir um produto ou site",
    "Build a product or website",
    "Construir un producto o sitio web",
  ],
  [
    "integration",
    "Conectar sistemas e pagamentos",
    "Connect systems and payments",
    "Conectar sistemas y pagos",
  ],
  [
    "automation",
    "Automatizar uma rotina",
    "Automate a routine",
    "Automatizar una rutina",
  ],
  [
    "sales",
    "Melhorar conteúdo e vendas",
    "Improve content and sales",
    "Mejorar contenido y ventas",
  ],
  [
    "quality",
    "Revisar código e segurança",
    "Review code and security",
    "Revisar código y seguridad",
  ],
  [
    "research",
    "Pesquisar e fundamentar decisões",
    "Research and support decisions",
    "Investigar y fundamentar decisiones",
  ],
  [
    "legal",
    "Revisar contratos e riscos",
    "Review contracts and risks",
    "Revisar contratos y riesgos",
  ],
];
const tools = [
  ["any", "Sem preferência", "No preference", "Sin preferencia"],
  [
    "excel",
    "Excel / planilhas",
    "Excel / spreadsheets",
    "Excel / hojas de cálculo",
  ],
  [
    "powerbi",
    "Power BI / Power Query",
    "Power BI / Power Query",
    "Power BI / Power Query",
  ],
  [
    "office",
    "Word / PDF / PowerPoint",
    "Word / PDF / PowerPoint",
    "Word / PDF / PowerPoint",
  ],
  ["figma", "Figma / FigJam", "Figma / FigJam", "Figma / FigJam"],
  ["web", "Web / código", "Web / code", "Web / código"],
  [
    "supabase",
    "Supabase / PostgreSQL",
    "Supabase / PostgreSQL",
    "Supabase / PostgreSQL",
  ],
  [
    "protheus",
    "TOTVS Protheus / ERP",
    "TOTVS Protheus / ERP",
    "TOTVS Protheus / ERP",
  ],
  ["asaas", "Asaas / pagamentos", "Asaas / payments", "Asaas / pagos"],
  ["google", "Google Workspace", "Google Workspace", "Google Workspace"],
  [
    "claude",
    "Claude Code / Cowork",
    "Claude Code / Cowork",
    "Claude Code / Cowork",
  ],
];
const environments = [
  [
    "any",
    "Posso avaliar os requisitos",
    "I can review the requirements",
    "Puedo revisar los requisitos",
  ],
  [
    "general",
    "Evitar conectores específicos",
    "Avoid specific connectors",
    "Evitar conectores específicos",
  ],
];
function options(locale = "pt") {
  const index = { pt: 1, en: 2, es: 3 }[locale] || 1;
  return Object.fromEntries(
    Object.entries({ goal: goals, tool: tools, environment: environments }).map(
      ([key, rows]) => [
        key,
        rows.map((row) => ({ id: row[0], label: row[index] })),
      ],
    ),
  );
}
module.exports = { goals, tools, environments, options };
