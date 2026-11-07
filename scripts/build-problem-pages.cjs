"use strict";
const fs = require("node:fs"),
  path = require("node:path");
const pages = require("../data/problem-pages.cjs");
const dictionary = {
  ...require("../data/i18n-public.cjs"),
  ...require("../data/i18n-problems.cjs"),
};
const art = require("../dist/skill-art.js");
const origin = "https://deck.drivedata.com.br";
const locales = { pt: "pt-BR", en: "en", es: "es" };
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const route = (slug, locale) =>
  "/problemas/" + slug + "/" + (locale === "pt" ? "" : locale + "/");
function render(page, locale) {
  const c = page.content[locale],
    t = (s) =>
      locale === "pt" ? s : dictionary[s]?.[locale === "en" ? 0 : 1] || s;
  const url = origin + route(page.slug, locale);
  const illustration = {
    orders: "claude-xlsx",
    reconcile: "claude-power-bi-data-analysis",
    performance: "claude-power-bi-dax-optimization",
  }[page.kind];
  const guide = "/app?mode=work&pack=" + page.pack + "&lang=" + locale;
  return `<!doctype html>
<html lang="${locales[locale]}" data-problem-locale="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#070c13">
<title>${esc(c.title)} | DriveData Deck</title><meta name="description" content="${esc(c.description)}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(c.title)}"><meta property="og:description" content="${esc(c.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}/assets/drivedata-logo.png">
<link rel="canonical" href="${url}">${Object.entries(locales)
    .map(
      ([l, tag]) =>
        `<link rel="alternate" hreflang="${tag}" href="${origin + route(page.slug, l)}">`,
    )
    .join(
      "",
    )}<link rel="alternate" hreflang="x-default" href="${origin + route(page.slug, "pt")}">
<link rel="icon" href="/assets/drivedata-logo.png"><link rel="stylesheet" href="/deck.css"><link rel="stylesheet" href="/landing.css"><link rel="stylesheet" href="/i18n.css"><link rel="stylesheet" href="/problems.css">
<script src="/translations.js"></script><script src="/i18n-core.js"></script><script src="/i18n.js"></script><script src="/problems.js" defer></script></head>
<body class="landing problem-page"><a class="skip-link" href="#main">${esc(t("Pular para o conteúdo"))}</a>
<header class="landing-header wrap"><a class="deck-brand" href="/?lang=${locale}"><img src="/assets/drivedata-logo.png" alt="" width="37" height="37"><span>DriveData <strong>Deck</strong></span></a><nav aria-label="${esc(t("Principal"))}"><a href="/?lang=${locale}#public-tasks">${esc(t("Voltar ao Deck"))}</a><a class="demo-link" href="/login?lang=${locale}">${esc(t("Entrar na demo"))} ↗</a></nav></header>
<main id="main" data-problem-kind="${page.kind}" data-problem-slug="${page.slug}">
<section class="problem-hero wrap"><div><p class="problem-index">${page.code} / ${esc(t("Demonstração pública gratuita"))}</p><h1>${esc(c.title)}</h1><p class="problem-lead">${esc(c.intro)}</p><a class="button button-mint" href="#experiment">${esc(t("Experimente a conferência"))} ↓</a><p class="fine">${esc(t("Dados fictícios. Cálculo local no navegador, sem execução por IA."))}</p></div><div class="problem-illustration" aria-hidden="true"><div class="problem-art">${art.render(illustration)}</div><span>DriveData Deck / ${page.code}</span></div></section>
<section class="problem-outcome wrap"><h2>${esc(t("O que você leva desta tarefa"))}</h2><p>${esc(c.outcome)}</p></section>
<section class="experiment-section light" id="experiment" aria-labelledby="experiment-title"><div class="wrap"><div class="section-heading"><h2 id="experiment-title">${esc(t("Experimente a conferência"))}</h2><p>${esc(t("Troque a amostra e confira como a saída muda. Nenhum arquivo seu é solicitado ou enviado."))}</p></div>
<form id="demo-form" class="demo-controls"><label for="sample">${esc(t("Amostra"))}<select id="sample" name="sample">${c.scenarios.map((s, i) => `<option value="${i}">${esc(s)}</option>`).join("")}</select></label>${page.kind !== "orders" ? `<label for="limit">${esc(t(page.kind === "reconcile" ? "Tolerância em unidades monetárias" : "Limite para investigar (ms)"))}<input id="limit" name="limit" type="number" min="0" max="10000" step="any" value="${page.kind === "performance" ? 1000 : 0}"></label>` : ""}<button class="button button-dark" type="submit">${esc(t("Conferir amostra"))} ↗</button></form>
<div class="demo-flow"><section aria-labelledby="input-title"><h3 id="input-title"><span>01</span> ${esc(t("Entrada"))}</h3><div id="demo-input" class="demo-table" tabindex="0" role="region" aria-labelledby="input-title"></div></section><section class="demo-rule" aria-labelledby="rule-title"><h3 id="rule-title"><span>02</span> ${esc(t("Transformação"))}</h3><h4>${esc(t("Regra aplicada"))}</h4><p>${esc(c.rule)}</p><div class="rule-path" aria-hidden="true">→</div></section><section class="demo-output" aria-labelledby="output-title"><h3 id="output-title"><span>03</span> ${esc(t("Saída"))}</h3><dl id="demo-metrics"></dl><div id="demo-output" class="demo-table" tabindex="0" role="region" aria-labelledby="output-title"></div></section></div>
<p id="demo-status" role="status" class="demo-status"></p><div class="demo-downloads"><button id="download-json" class="text-link" type="button">${esc(t("Baixar referência JSON"))} ↓</button><button id="download-csv" class="text-link" type="button">${esc(t("Baixar saída CSV"))} ↓</button></div><details class="reference-note"><summary>${esc(t("Referência da amostra inicial"))}</summary><p>${esc(c.reference)}</p></details><noscript><p>${esc(t("Ative o JavaScript para alterar a amostra. A regra e a referência inicial continuam disponíveis nesta página."))}</p></noscript></div></section>
<section class="problem-next wrap"><div><h2>${esc(t("Leve a tarefa para o seu assistente"))}</h2><p>${esc(c.boundary)}</p><h3>${esc(t("Próximos passos no seu ambiente"))}</h3><ol>${c.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol><a class="button button-mint" href="${esc(guide)}">${esc(t("Abrir guia gratuito"))} ↗</a><p class="fine">${esc(t("O guia e os pacotes originais fazem parte da demo gratuita com senha. Se necessário, você será levado ao login e depois à tarefa escolhida."))}</p></div><div class="task-panel"><h3>${esc(t("Comando para seu assistente"))}</h3><pre id="task-text" tabindex="0">${esc(c.task)}</pre><button id="copy-task" class="button button-outline" type="button">${esc(t("Copiar pedido"))}</button><p id="copy-status" role="status"></p></div></section>
<section class="problem-related light"><div class="wrap"><h2>${esc(t("Outras tarefas para experimentar"))}</h2><div>${pages
    .filter((p) => p.slug !== page.slug)
    .map(
      (p) =>
        `<a href="${route(p.slug, locale)}?lang=${locale}" data-problem-link="${p.slug}"><span>${p.code}</span><strong>${esc(p.content[locale].title)}</strong><span aria-hidden="true">↗</span></a>`,
    )
    .join("")}</div></div></section>
</main><footer class="landing-footer wrap"><a class="deck-brand" href="/?lang=${locale}"><img src="/assets/drivedata-logo.png" width="30" height="30" alt=""><span>DriveData <strong>Deck</strong></span></a><p>${esc(t("Sem senha para experimentar. Sem promessa de resultado no seu arquivo."))}</p><a href="/privacidade?lang=${locale}">${esc(t("Privacidade"))}</a></footer></body></html>`;
}
function build() {
  const base = path.join(__dirname, "../dist");
  for (const page of pages)
    for (const locale of Object.keys(locales)) {
      const dir = path.join(base, route(page.slug, locale));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), render(page, locale));
    }
  const urls = [
    "/",
    ...pages.flatMap((p) => Object.keys(locales).map((l) => route(p.slug, l))),
  ];
  fs.writeFileSync(
    path.join(base, "sitemap.xml"),
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map((u) => `  <url><loc>${origin + u}</loc></url>`).join("\n") +
      "\n</urlset>\n",
  );
  fs.writeFileSync(
    path.join(base, "robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /app\nDisallow: /login\nSitemap: ${origin}/sitemap.xml\n`,
  );
  console.log("9 localized public problem pages and sitemap generated.");
}
build();
module.exports = { build, render, route };
