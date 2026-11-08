"use strict";
const $ = (s) => document.querySelector(s),
  esc = DeckArt.esc,
  t = DeckI18n.t,
  motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
let skills = [],
  combos = [],
  comboFilter = null,
  journeys = [],
  deck = DeckStore.empty(),
  audience = "business",
  view = "discover",
  deckFilter = "all",
  limit = 12,
  selected = null,
  detailTab = "universe",
  detailSpin = !motionPreference.matches,
  detailFlipped = false,
  detailOrigin = null,
  wizardStep = 0,
  requestVersion = 0,
  refinement = null,
  lastTriageRequest = null,
  lastMatch = null,
  helpIssue = "recognition",
  currentPlan = null,
  capabilityOptions = [],
  compatibilityVersion = 0,
  toastTimer;
const feedbackStates = new Map();
const downloadStates = new Map();
let queuedFind = false,
  insightsVersion = 0,
  collectionRevision = 0;
const norm = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const byId = (id) => skills.find((s) => s.id === id);
const deckStorage = {
  getItem(key) {
    return localStorage.getItem(key);
  },
  setItem(key, value) {
    localStorage.setItem(key, value);
  },
};
const favorite = (id) => deck.favorites.includes(id);
const progress = (id) =>
  deck.progress[id] || {
    platform: "codex",
    installed: false,
    promptCopied: false,
    tested: false,
  };
function toast(text, options = {}) {
  const target = $("#skill-dialog").open ? $("#detail-toast") : $("#toast");
  for (const region of [$("#toast"), $("#detail-toast")]) {
    region.hidden = region !== target;
    if (region !== target) region.textContent = "";
  }
  target.hidden = false;
  target.classList.toggle("download-confirmation", options.kind === "download");
  target.textContent = t(text);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (target.hidden = true), options.duration || 5000);
}
function confirmDownload(code = "") {
  toast(code ? t("{code} · ZIP conferido. Download iniciado.", {code}) : "ZIP conferido. Download iniciado.", {kind:"download", duration:2200});
  // A download finishing in the background must not cut a collection ceremony short.
  if (!DeckInvocation.running) DeckSound.play("download");
}
function errorText(error, fallback = "Não foi possível concluir.") {
  if (error?.name === "TypeError")
    return t(
      "Não foi possível conectar. Confira sua conexão e tente novamente.",
    );
  if (error?.name === "SyntaxError" || error instanceof DOMException)
    return t(fallback);
  return t(error?.message || fallback);
}
function save() {
  const stored = DeckStore.load(deckStorage, skills.map(s => s.id), journeys.map(j => j.id));
  deck.collectionHistory = [...new Set([...(deck.collectionHistory || []), ...stored.collectionHistory])];
  const ok = DeckStore.save(deckStorage, deck);
  $("#storage-error").textContent = ok
    ? ""
    : "O navegador não permitiu salvar. Exporte seu Deck para preservar o progresso.";
  DeckI18n.apply($("#storage-error"));
  $("#deck-count").textContent = new Set([
    ...deck.favorites,
    ...deck.downloads.map((x) => x.id),
  ]).size;
  return ok;
}
function deckLoginPath() {
  try {
    if (localStorage.getItem("deck-account") === "customer") return "/acesso";
  } catch {}
  return "/login";
}
async function api(url, options) {
  const r = await fetch(DeckI18n.url(url), {
    ...options,
    headers: DeckI18n.headers(options?.headers),
  });
  if (r.status === 401) {
    location.assign(DeckI18n.url(deckLoginPath()));
    throw new Error("Sua sessão expirou. Entre novamente.");
  }
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Não foi possível concluir.");
  return data;
}
function persistProgress(id, values) {
  deck.progress[id] = { ...progress(id), ...values };
  save();
}
function latest(id) {
  return DeckStore.latest(deck, id);
}
function needsUpdate(s) {
  const d = latest(s.id);
  return !!d && d.version !== s.version;
}
function badge(s) {
  return s.example
    ? "Exemplo reproduzível"
    : s.compatibility.platformSpecific
      ? "Requer conexão específica"
      : "Formato revisado";
}
function slot(s) {
  const d = latest(s.id);
  if (window.DeckWork?.mode === "work")
    return `<article class="work-skill"><div class="work-skill-heading"><span>${esc(s.code)}</span><button class="favorite" data-favorite="${esc(s.id)}" aria-pressed="${favorite(s.id)}" aria-label="${esc(t(favorite(s.id) ? "Remover {code} do Meu Deck" : "Salvar {code} no Meu Deck", { code: s.code }))}">${favorite(s.id) ? "♥" : "♡"}</button></div><h3>${esc(s.title)}</h3><p>${esc(s.universe.purpose)}</p><dl><dt>${esc(t("Sua entrega"))}</dt><dd>${esc(s.deliverables[0])}</dd><dt>${esc(t("Requisitos principais"))}</dt><dd>${esc(s.dependencies.slice(0, 2).join("; "))}</dd></dl><p class="work-evidence">${esc(t(s.lab?.deliverableSamples?.some((x) => x.passed && x.currentVersion) ? "Cenário com entregável conferido" : "Confira o cenário e os limites"))}</p>${DeckCommerce.stamp(s.pricing)}<div class="work-actions"><button class="btn secondary" data-start="${esc(s.id)}">${esc(t("Começar"))} ↗</button><button class="text-button" data-open="${esc(s.id)}">${esc(t("Ver detalhes"))}</button></div></article>`;
  return `<article class="skill-slot"><div class="slot-top"><span class="quality-badge">${esc(badge(s))}</span><button class="favorite" data-favorite="${esc(s.id)}" aria-pressed="${favorite(s.id)}" aria-label="${esc(t(favorite(s.id) ? "Remover {code} do Meu Deck" : "Salvar {code} no Meu Deck", { code: s.code }))}">${favorite(s.id) ? "♥" : "♡"}</button></div><button class="card-open" data-open="${esc(s.id)}" aria-label="${esc(t("Explorar {code}: {title}", { code: s.code, title: s.title }))}">${DeckArt.card(s)}</button><p class="slot-context">${audience === "technical" ? esc(s.id) : esc(s.universe.tagline)}</p><p class="slot-state">${needsUpdate(s) ? "Nova versão disponível" : progress(s.id).tested ? "Conferido por você" : d ? esc(t("Baixado · v{version}", { version: d.version })) : esc(s.setup)}</p><div class="skill-actions"><button class="text-button" data-open="${esc(s.id)}">Explorar universo</button><button class="download" data-start="${esc(s.id)}">Começar ↗</button></div></article>`;
}
function render() {
  const q = norm($("#search").value),
    group = $("#group").value,
    role = $("#role").value;
  let filtered = skills.filter(
    (s) =>
      (audience === "technical" ||
        $("#show-all").checked ||
        (s.audience !== "technical" && s.role !== "support")) &&
      (group === "all" || (s.categoryKey || s.category) === group) &&
      (!comboFilter || combos.find(c=>c.id===comboFilter)?.skillIds.includes(s.id)) &&
      ($("#price-ceiling").value === "all" || ($("#price-ceiling").value === "free" ? s.free : !s.free && s.pricing.priceCents <= Number($("#price-ceiling").value))) &&
      (role === "all" || s.role === role) &&
      (!$("#examples-only").checked || s.example) &&
      norm(
        [
          s.code,
          s.id,
          s.identity?.id,
          s.identity?.serial,
          s.title,
          s.pain,
          s.universe?.alias,
          s.universe?.purpose,
          ...(s.universe?.useCases || []),
          ...s.deliverables,
          ...s.compatibility.tools,
        ].join(" "),
      ).includes(q),
  );
  const sort = $("#sort").value;
  filtered.sort(
    sort === "price-asc" || sort === "price-desc"
      ? (a,b) => (a.pricing.priceCents-b.pricing.priceCents)*(sort==="price-asc"?1:-1) || a.code.localeCompare(b.code)
      : sort === "name"
      ? (a, b) => a.title.localeCompare(b.title, DeckI18n.intlLocale)
      : sort === "code"
        ? (a, b) => a.code.localeCompare(b.code)
        : (a, b) =>
            Number(b.featured) - Number(a.featured) ||
            a.code.localeCompare(b.code),
  );
  $("#skill-count").textContent = t("{count} de {total} cartas", {
    count: filtered.length,
    total: skills.length,
  });
  $("#skill-grid").innerHTML = filtered.slice(0, limit).map(slot).join("");
  $("#empty").hidden = filtered.length > 0;
  $("#load-more").hidden = filtered.length <= limit;
  $("#combo-focus").hidden = !comboFilter;
  if (comboFilter) $("#combo-focus span").textContent = t("Combo em foco: {title}",{title:combos.find(c=>c.id===comboFilter)?.title || ""});
  DeckArt.tilt($("#skill-grid"));
  DeckI18n.apply($("#collection"));
}
function renderDeck() {
  const selectedIds = new Set([
    ...deck.favorites,
    ...deck.downloads.map((d) => d.id),
  ]);
  const items = skills.filter(
    (s) =>
      selectedIds.has(s.id) &&
      (deckFilter === "all" ||
        (deckFilter === "favorites" && favorite(s.id)) ||
        (deckFilter === "downloads" && latest(s.id)) ||
        (deckFilter === "updates" && needsUpdate(s))),
  );
  $("#deck-summary").innerHTML = [
    ["Favoritos", deck.favorites.length],
    ["Skills baixadas", new Set(deck.downloads.map((d) => d.id)).size],
    ["Novas versões", skills.filter(needsUpdate).length],
    [
      "Conferidas por você",
      Object.values(deck.progress).filter((p) => p.tested).length,
    ],
  ]
    .map(
      ([label, value]) =>
        `<div><strong>${value}</strong><span>${label}</span></div>`,
    )
    .join("");
  $("#my-deck-grid").innerHTML = items.map(slot).join("");
  $("#deck-empty").hidden = items.length > 0;
  $("#history-section").hidden = !deck.downloads.length;
  $("#download-history").innerHTML = deck.downloads
    .slice(-12)
    .reverse()
    .map(
      (d) =>
        `<div class="history-row"><span>${esc(byId(d.id)?.title || d.id)}<small>${esc(byId(d.id)?.code)} · v${esc(d.version)} · ${new Date(d.at).toLocaleDateString(DeckI18n.intlLocale)}</small></span><button class="text-button" data-download="${esc(d.id)}">Baixar versão atual</button></div>`,
    )
    .join("");
  DeckArt.tilt($("#my-deck-grid"));
  $("#saved-plans-section").hidden = !(deck.plans || []).length;
  $("#saved-plans").innerHTML = (deck.plans || [])
    .map(
      (p) =>
        `<article class="saved-plan"><h3>${esc(
          p.skillIds
            .map((id) => byId(id)?.title)
            .filter(Boolean)
            .join(" → "),
        )}</h3><ol>${p.skillIds
          .map((id) => byId(id))
          .filter(Boolean)
          .map(
            (s) =>
              `<li><button class="text-button" data-start="${esc(s.id)}">${esc(s.title)}</button></li>`,
          )
          .join(
            "",
          )}</ol><button class="text-button" data-remove-plan="${esc(p.id)}">${esc(t("Remover plano"))}</button></article>`,
    )
    .join("");
  restoreDownloadState();
  DeckI18n.apply($("#deck-view"));
}
function renderJourneys() {
  $("#journey-grid").innerHTML = journeys
    .filter((j) => audience === "technical" || j.audience !== "technical")
    .map((j) => {
      const completed = j.steps.filter((s) => progress(s.id).tested).length;
      return `<article class="journey"><div class="journey-header"><p class="edition-line">${esc(t("{count} etapas · {done} conferidas", { count: j.steps.length, done: completed }))}</p><h2>${esc(j.title)}</h2><p>${esc(j.description)}</p></div><ol>${j.steps
        .map((step, i) => {
          const s = byId(step.id);
          return `<li class="${progress(s.id).tested ? "step-complete" : ""}"><span class="step-number">${progress(s.id).tested ? "✓" : i + 1}</span><div><span class="code">${esc(s.code)}</span><h3>${esc(step.action)}</h3><p>${esc(step.handoff)}</p><button class="text-button" data-start="${esc(s.id)}">Abrir etapa</button></div></li>`;
        })
        .join(
          "",
        )}</ol><div class="journey-actions"><button class="btn secondary" data-save-journey="${j.id}">${deck.journeys.includes(j.id) ? "Jornada no meu Deck" : "Adicionar ao meu Deck"}</button><button class="text-button" data-export-journey="${j.id}">Baixar roteiro</button></div></article>`;
    })
    .join("");
  DeckI18n.apply($("#journeys-view"));
}
function setView(next) {
  if (!["discover", "deck", "journeys"].includes(next)) return;
  view = next;
  const viewURL = new URL(location.href);
  if (next === "discover") viewURL.searchParams.delete("view");
  else viewURL.searchParams.set("view", next);
  history.replaceState(
    null,
    "",
    viewURL.pathname + viewURL.search + viewURL.hash,
  );
  for (const name of ["discover", "deck", "journeys"])
    $("#" + name + "-view").hidden = name !== next;
  document
    .querySelectorAll(".view-switch [data-view]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.view === next)),
    );
  if (next === "deck") renderDeck();
  if (next === "journeys") renderJourneys();
  window.scrollTo({
    top: 0,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
}
function setAudience(next) {
  audience = next;
  document.body.dataset.audience = next;
  document
    .querySelectorAll("[data-audience]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.audience === next)),
    );
  $("#path-title").innerHTML =
    next === "technical"
      ? "Sua próxima implementação.<br>Contexto para executar."
      : "Sua próxima tarefa.<br>Uma carta para começar.";
  $("#path-description").textContent =
    next === "technical"
      ? "Compare requisitos, inspecione a versão e leve o primeiro comando para o seu ambiente."
      : "Veja o que cada skill ajuda a produzir, experimente um exemplo e leve um roteiro para o primeiro uso.";
  $("#path-hint").textContent =
    next === "technical"
      ? "Inclua ferramenta, formato de entrada e restrição técnica."
      : "Descreva a tarefa e o resultado que você precisa.";
  $("#all-skills-label").hidden = next === "technical";
  refinement = null;
  ++requestVersion;
  $("#matches").hidden = true;
  $("#find-skills").disabled = false;
  $("#find-skills").textContent = t("Encontrar minha skill ↗");
  render();
  renderDeck();
  renderJourneys();
  try {
    localStorage.setItem("drivedata-audience", next);
  } catch {}
  DeckI18n.apply();
}
const list = (items) =>
  `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
function missionPrompt(s) {
  const x = s.universe.scenario;
  return [
    t("Cenário fictício para praticar; substitua pelos seus dados ao aplicar."),
    t("Use a skill {id}. {task}", { id: s.id, task: x.request }),
    `${t("Contexto da missão")}\n${x.context}`,
    `${t("Entrega esperada")}\n${x.output}`,
    `${t("Como conferir")}\n${x.check}`,
    `${t("Antes de usar")}\n${s.universe.boundary}`,
  ].join("\n\n");
}
function universeView(s) {
  const u = s.universe;
  const neighbors = skills
    .filter((x) => x.category === s.category && x.id !== s.id)
    .sort(
      (a, b) =>
        Number(a.role !== s.role) - Number(b.role !== s.role) ||
        a.code.localeCompare(b.code),
    )
    .slice(0, 3);
  return `<section class="universe-story"><div class="story-heading"><span class="story-index" aria-hidden="true">${esc(s.code.slice(3))}<span>/ 161</span></span><div><p class="universe-label">Uma cena possível</p><h3>${esc(u.alias)}</h3></div></div><p class="universe-tagline">${esc(u.tagline)}</p><p class="story-prose">${esc(u.story)}</p><p class="story-caption">Narrativa ilustrativa inspirada no uso da skill.</p><div class="universe-turn"><span aria-hidden="true">↳</span><div><h4>O problema que ela enfrenta</h4><p>${esc(s.pain)}</p></div></div><div class="universe-actions"><button class="btn" data-detail-tab="example">Entrar na missão ↗</button><button class="text-button" data-detail-tab="overview">Ver aplicações reais</button></div></section><section class="universe-route"><h3>Da carta ao trabalho</h3><ol>${u.steps.map((step, i) => `<li><span aria-hidden="true">0${i + 1}</span><p>${esc(step)}</p></li>`).join("")}</ol></section>${neighbors.length ? `<section class="universe-neighbors"><h3>Outras cartas deste universo</h3>${neighbors.map((x) => `<button data-open="${esc(x.id)}"><span class="code">${esc(x.code)}</span><span><strong>${esc(x.universe.alias)}</strong><small>${esc(x.title)}</small></span><span aria-hidden="true">↗</span></button>`).join("")}</section>` : ""}`;
}
function missionView(s) {
  const u = s.universe,
    x = u.scenario;
  return `<section class="mission"><p class="mission-notice">Cenário fictício para praticar; substitua pelos seus dados ao aplicar.</p><h3 class="mission-title">${esc(x.title)}</h3><div class="mission-section"><span class="mission-number" aria-hidden="true">01</span><div><h4>Contexto da missão</h4><p>${esc(x.context)}</p></div></div><div class="mission-section"><span class="mission-number" aria-hidden="true">02</span><div><h4>Seu comando de partida</h4><p>${esc(x.request)}</p><button class="btn secondary" data-copy-mission="${esc(s.id)}">Copiar missão completa</button><details class="mission-command"><summary>Inspecionar comando completo</summary><pre>${esc(missionPrompt(s))}</pre></details></div></div><div class="mission-section"><span class="mission-number" aria-hidden="true">03</span><div><h4>Entrega esperada</h4><p>${esc(x.output)}</p></div></div><div class="mission-section"><span class="mission-number" aria-hidden="true">04</span><div><h4>Como conferir</h4><p>${esc(x.check)}</p></div></div><p class="scope-note">${esc(u.boundary)}</p><p class="fine">Esta missão é um roteiro ilustrativo. Não representa uma execução ou um resultado já validado.</p><div class="universe-actions"><button class="btn" data-detail-tab="start">Preparar meu ambiente ↗</button><button class="text-button" data-guide="${esc(s.id)}">Levar o universo em Markdown</button></div></section>${s.example ? `<details class="verified-reference"><summary>Também há um exemplo reproduzível nesta carta</summary>${exampleView(s)}</details>` : ""}`;
}
function overview(s) {
  return `<p class="application-purpose">${esc(s.universe.purpose)}</p><h3>Quando tirar esta carta do Deck</h3><ol class="use-case-list">${s.universe.useCases.map((x) => `<li>${esc(x)}</li>`).join("")}</ol><h3>${audience === "technical" ? "Entregas e escopo" : "O que você pode produzir"}</h3>${list(s.deliverables)}<h3>O que você precisa ter</h3>${list(s.dependencies)}${DeckEvolution.compatibility(s)}<h3>Antes de usar</h3><p>${esc(s.universe.boundary)}</p><div class="detail-primary"><button class="btn" data-detail-tab="start">Começar com esta skill ↗</button>${s.officialGuide && !s.officialGuide.packaged ? officialLink(s) : `<button class="text-button" data-download="${esc(s.id)}">Baixar ZIP direto</button>`}<button class="text-button" data-guide="${esc(s.id)}">Baixar guia no meu idioma</button></div><p class="fine">Downloads liberados na demo. O pacote será usado no seu assistente.</p><p class="fine">Os arquivos originais da skill mantêm o idioma de origem. A interface, os exemplos e o guia de primeiro uso acompanham o idioma escolhido.</p>`;
}
function exampleView(s) {
  if (!s.example)
    return `<div class="empty"><h3>Monte seu primeiro teste.</h3><p>Esta carta ainda não tem um exemplo reproduzível. Use uma amostra pequena e confira os critérios abaixo antes de aplicar a dados reais.</p>${list(s.acceptance)}<button class="btn" data-detail-tab="start">Abrir primeiro uso</button></div>`;
  const x = s.example;
  return `<div class="example-intro"><span class="quality-badge">Dados fictícios · referência conferida</span><h3>${esc(x.title)}</h3><p>${esc(x.before)}</p></div><div class="sample-columns"><section><h4>Entrada</h4><pre>${esc(JSON.stringify(x.input, null, 2))}</pre></section><section><h4>Resultado de referência</h4><p>${esc(x.expected)}</p><details><summary>Inspecionar o resultado completo</summary><pre>${esc(JSON.stringify(x.result, null, 2))}</pre></details></section></div><h4>Peça assim ao seu assistente</h4><pre class="prompt-block">${esc(t("Use a skill {id}. {task}", { id: s.id, task: x.task }))}</pre><div class="sample-actions"><button class="btn secondary" data-copy-example="${s.id}">Copiar comando do exemplo</button><button class="text-button" data-sample="${s.id}">Baixar dados de exemplo</button></div><h4>Como conferir</h4>${list(x.checks)}<p class="scope-note">${esc(x.limitation)} ${esc(x.verification)}</p><button class="btn" data-detail-tab="start">Usar esta skill no meu ambiente</button>`;
}
function technical(s) {
  return `${DeckIdentity.panel(s)}${DeckCommerce.assessment(s)}<dl class="spec-sheet"><div><dt>Identificador</dt><dd>${esc(s.code)} / ${esc(s.id)}</dd></div><div><dt>Versão</dt><dd>${esc(s.version)} · ${esc(new Date(s.release.date + "T12:00:00Z").toLocaleDateString(DeckI18n.intlLocale, { timeZone: "UTC" }))}</dd></div><div><dt>Pacote</dt><dd>${esc(t("{count} arquivos · {size} KB", { count: s.release.fileCount, size: DeckI18n.number(s.release.bytes / 1024, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }))}</dd></div><div><dt>Formato</dt><dd>${esc(s.compatibility.format)}</dd></div><div><dt>Execução</dt><dd>${esc(s.compatibility.execution)}</dd></div><div><dt>Ferramentas citadas</dt><dd>${esc(s.compatibility.tools.join(", ") || "Confira os requisitos da skill")}</dd></div><div><dt>Integridade SHA-256</dt><dd class="digest">${esc(s.release.sha256)}</dd></div></dl><details class="release-notes"><summary>O que mudou nesta versão</summary>${s.changelog.map((c) => `<h4>v${esc(c.version)}</h4>${list(c.changes)}`).join("")}</details><details class="release-notes"><summary>Origem, compatibilidade e condições de distribuição</summary><p>${esc(s.release.license)}. ${esc(t("A revisão técnica não libera distribuição comercial. Atribuições e termos originais estão no ZIP."))}</p><p>${esc(t("{count} arquivos de documentação tiveram caminhos pessoais substituídos por marcadores. Scripts e integrações ainda precisam ser conferidos no ambiente de destino.", { count: s.release.normalizedFiles }))}</p><p>O formato foi revisado; ferramentas específicas de Claude, Figma, Office ou outros serviços não são instaladas pelo pacote.</p></details>`;
}
function wizard(s) {
  const p = progress(s.id);
  const platform = p.platform;
  const folder =
    platform === "codex"
      ? "~/.codex/skills/" + s.id
      : platform === "claude"
        ? "~/.claude/skills/" + s.id
        : "Pasta de skills indicada pelo seu assistente";
  let content = "";
  if (wizardStep === 0)
    content = `<h3>Onde você vai usar?</h3><div class="platform-picker">${[
      ["codex", "Codex"],
      ["claude", "Claude Code"],
      ["other", "Outro assistente"],
    ]
      .map(
        ([id, label]) =>
          `<button data-platform="${id}" aria-pressed="${platform === id}">${label}</button>`,
      )
      .join(
        "",
      )}</div><p>${platform === "other" ? "Confirme se o assistente aceita SKILL.md e tem as ferramentas citadas. Um chat comum pode não executar os scripts." : platform === "claude" ? "Instale como skill pessoal do Claude Code. Extensões e ferramentas mencionadas continuam sendo requisitos separados." : "Instale na pasta de skills do usuário. Nesta instalação, ~/.codex/skills foi reconhecida; respeite CODEX_HOME se ele estiver configurado."}</p>${s.compatibility.platformSpecific ? '<p class="scope-note">Esta skill depende de uma plataforma ou conector específico. Confirme o acesso antes de prosseguir.</p>' : ""}<h4>Prepare estes materiais</h4>${list(s.dependencies)}<button class="btn" data-wizard-step="1">Ver instalação</button>`;
  if (wizardStep === 1)
    content = s.officialGuide && !s.officialGuide.packaged ? officialStart(s) : `<h3>Baixe e instale a pasta da skill.</h3><ol><li>Baixe o ZIP e extraia os arquivos.</li><li>Localize a pasta <code>${esc(s.id)}</code>.</li><li>Copie a pasta completa para <code>${esc(t(folder))}</code>. Preserve uma cópia da versão anterior, se houver.</li><li>Abra um novo chat e confira se a skill foi reconhecida.</li></ol><button class="btn secondary" data-download="${s.id}">${esc(t("Baixar v{version} ↓", { version: s.version }))}</button><label class="check-line"><input id="installed-check" type="checkbox" ${p.installed ? "checked" : ""}>Já extraí, copiei a pasta e conferi o reconhecimento.</label><button class="btn" id="next-prompt">Preparar meu comando</button>`;
  if (wizardStep === 2)
    content = `<h3>Leve um comando claro.</h3><p>Substitua os campos entre colchetes pelos seus dados. Anexe apenas arquivos autorizados no assistente escolhido.</p><pre class="prompt-block" id="first-prompt">${esc(s.firstPrompt)}</pre><button class="btn" id="copy-prompt">${p.promptCopied ? "Copiar novamente" : "Copiar primeiro comando"}</button><p class="fine">A execução acontece no seu assistente. O site não envia seus arquivos ou executa a skill.</p><button class="text-button" data-wizard-step="3">Já executei; quero conferir o resultado</button>`;
  if (wizardStep === 3)
    content = `<h3>Confira antes de considerar pronto.</h3><p>Registre sua própria conferência. Isso não altera o selo de homologação da skill.</p>${s.acceptance.map((c, i) => `<label class="check-line"><input class="result-check" type="checkbox" ${p.tested ? "checked" : ""}>${esc(c)}</label>`).join("")}<button class="btn" id="mark-tested">${p.tested ? "Atualizar minha conferência" : "Marcar como conferido por mim"}</button><p class="fine">Se algo falhou, volte ao comando e informe a diferença entre o esperado e o observado.</p><button class="text-button" data-wizard-step="2">Rever meu comando</button>`;
  return `<div class="wizard"><ol class="wizard-steps">${["Ambiente", "Instalação", "Primeiro comando", "Conferência"].map((x, i) => `<li><button data-wizard-step="${i}" aria-current="${wizardStep === i ? "step" : "false"}"><span>${i + 1}</span>${x}</button></li>`).join("")}</ol><div class="wizard-body">${wizardStep === 0 ? DeckEvolution.compatibility(s) : ""}${content}<button class="text-button" data-detail-tab="help">Preciso de ajuda para usar</button>${wizardStep === 3 ? DeckEvolution.feedback(s) : ""}</div></div>`;
}
function renderDetail(focusTarget) {
  const s = selected;
  if (!s) return;
  DeckInvocation.cancel();
  const active = document.activeElement;
  const restoreFocus = $("#skill-detail").contains(active);
  if (!focusTarget && restoreFocus) {
    if (active.id) focusTarget = "#" + CSS.escape(active.id);
    else
      for (const attr of [
        "data-wizard-step",
        "data-platform",
        "data-detail-tab",
      ])
        if (active.hasAttribute(attr)) {
          focusTarget = `[${attr}="${CSS.escape(active.getAttribute(attr))}"]`;
          break;
        }
  }
  if (motionPreference.matches) detailSpin = false;
  $("#skill-detail").innerHTML =
    `<div class="detail-layout" style="--universe-hue:${DeckArt.hue(s)}"><aside class="detail-card">${DeckInvocation.stage(s, DeckArt.card(s, { spin: detailSpin }))}${s.identity ? `<button class="card-identity-link" data-detail-tab="technical"><span>${esc(t("ID da carta"))}</span>${esc(s.identity.serial)}</button>` : ""}<div class="detail-controls"><button class="text-button" id="turn-card" aria-pressed="${detailFlipped}">${detailFlipped ? "Ver frente" : "Ver verso"}</button><button class="text-button" id="spin-card" aria-pressed="${detailSpin}" ${motionPreference.matches ? "disabled" : ""}>${motionPreference.matches ? "Giro desativado: movimento reduzido" : detailSpin ? "Pausar giro" : "Ativar giro"}</button></div><button class="save-detail" data-favorite="${s.id}" aria-pressed="${favorite(s.id)}">${favorite(s.id) ? "♥ Salva no Meu Deck" : "♡ Salvar no Meu Deck"}</button><span class="quality-badge">${esc(badge(s))}</span></aside><div class="detail-content"><p class="code">${esc(s.code)} · v${s.version} · ${esc(s.category)}</p><h2 id="detail-title" tabindex="-1">${esc(s.title)}</h2>${DeckCommerce.stamp(s.pricing)}<div class="detail-tabs" aria-label="Detalhes da skill">${[
      ["universe", "Universo"],
      ["power", "Poder da carta"],
      ["overview", "Aplicações"],
      ["example", "Missão prática"],
      ["start", "Primeiro uso"],
      ["technical", "Ficha técnica"],
      ["lab", "Laboratório"],
      ["help", "Ajuda"],
    ]
      .map(
        ([id, label]) =>
          `<button data-detail-tab="${id}" aria-pressed="${detailTab === id}">${label}</button>`,
      )
      .join(
        "",
      )}</div><div class="detail-tab-body">${detailTab === "power" ? DeckCommerce.power(s) : detailTab === "universe" ? universeView(s) : detailTab === "overview" ? overview(s) : detailTab === "example" ? missionView(s) : detailTab === "technical" ? technical(s) : detailTab === "lab" ? DeckEvolution.lab(s) : detailTab === "help" ? DeckEvolution.support(s, helpIssue) : wizard(s)}</div><p id="download-status" class="download-status" role="status"></p></div></div>`;
  DeckArt.tilt($("#skill-detail"));
  restoreFeedbackState();
  restoreDownloadState();
  DeckI18n.apply($("#skill-detail"));
  $("#skill-detail .holo-card").classList.toggle("flipped", detailFlipped);
  if (restoreFocus || focusTarget)
    ($(focusTarget || "#detail-title") || $("#detail-title")).focus({
      preventScroll: true,
    });
  $("#turn-card").onclick = () => {
    DeckInvocation.cancel();
    detailSpin = false;
    const c = $("#skill-detail .holo-card");
    c.classList.remove("is-spinning");
    const on = c.classList.toggle("flipped");
    detailFlipped = on;
    $("#turn-card").textContent = t(on ? "Ver frente" : "Ver verso");
    $("#turn-card").setAttribute("aria-pressed", on);
    $("#spin-card").textContent = t(
      motionPreference.matches
        ? "Giro desativado: movimento reduzido"
        : "Ativar giro",
    );
    $("#spin-card").setAttribute("aria-pressed", "false");
    syncDetailURL();
  };
  $("#spin-card").onclick = () => {
    DeckInvocation.cancel();
    if (motionPreference.matches) return;
    const c = $("#skill-detail .holo-card");
    c.classList.remove("flipped");
    detailFlipped = false;
    const on = c.classList.toggle("is-spinning");
    detailSpin = on;
    $("#spin-card").textContent = t(on ? "Pausar giro" : "Ativar giro");
    $("#spin-card").setAttribute("aria-pressed", on);
    $("#turn-card").textContent = t("Ver verso");
    $("#turn-card").setAttribute("aria-pressed", "false");
    syncDetailURL();
  };
}
function openSkill(id, tab, state = {}) {
  const s = byId(id);
  if (!s) return;
  const wasOpen = $("#skill-dialog").open;
  if (!wasOpen) {
    const opener = state.opener || document.activeElement;
    const attr = ["data-open", "data-start", "data-mission", "data-favorite", "data-save-combo", "data-save-journey", "data-save-plan"].find((key) =>
      opener?.hasAttribute?.(key),
    );
    detailOrigin = attr
      ? {
          node: opener,
          scope: opener.closest(
            "#skill-grid,#my-deck-grid,#match-grid,#journey-grid",
          )?.id,
          selector: `[${attr}="${CSS.escape(opener.getAttribute(attr))}"]`,
        }
      : null;
  }
  selected = s;
  detailTab =
    tab || (window.DeckWork?.mode === "work" ? "overview" : "universe");
  if (window.DeckWork?.mode === "work") detailSpin = false;
  wizardStep = /^[0-3]$/.test(String(state.step)) ? Number(state.step) : 0;
  if (["on", "off"].includes(state.spin)) detailSpin = state.spin === "on";
  detailFlipped = state.face === "back";
  if (detailFlipped || motionPreference.matches) detailSpin = false;
  $("#detail-toast").hidden = true;
  $("#detail-toast").textContent = "";
  renderDetail(wasOpen ? "#detail-title" : undefined);
  if (!wasOpen) $("#skill-dialog").showModal();
  $("#skill-dialog").scrollTop = 0;
  if (!state.silent) DeckSound.play("reveal");
  syncDetailURL();
}
function syncDetailURL() {
  const url = new URL(location.href);
  if (selected) {
    url.searchParams.set("skill", selected.code);
    url.searchParams.set("chapter", detailTab);
    if (detailTab === "start") url.searchParams.set("step", String(wizardStep));
    else url.searchParams.delete("step");
    url.searchParams.set("spin", detailSpin ? "on" : "off");
    url.searchParams.set("face", detailFlipped ? "back" : "front");
  } else {
    url.searchParams.delete("skill");
    url.searchParams.delete("chapter");
    for (const key of ["step", "spin", "face"]) url.searchParams.delete(key);
  }
  history.replaceState(null, "", url.pathname + url.search + url.hash);
}
function environmentContext() {
  return {
    runtime: $("#need-runtime")?.value || "any",
    availability: Object.fromEntries(
      [...document.querySelectorAll("[data-capability]")]
        .filter((e) => e.value !== "unknown")
        .map((e) => [e.dataset.capability, e.value]),
    ),
  };
}
function triageProfile() {
  return {
    ...Object.fromEntries(
      ["goal", "tool", "environment"].map((key) => [
        key,
        $("#need-" + key).value,
      ]),
    ),
    ...environmentContext(),
  };
}
function catalogURL(locale = DeckI18n.locale) {
  const params = new URLSearchParams({ lang: locale });
  const context = environmentContext();
  params.set("runtime", context.runtime);
  params.set("availability", JSON.stringify(context.availability));
  return "/api/catalog?" + params;
}
function applyCatalog(data) {
  const group = $("#group").value;
  skills = data.skills;
  journeys = data.journeys;
  combos = data.combos || [];
  $("#combo-tiles").innerHTML = combos.filter(c=>!c.packId).map(c=>DeckCommerce.combo(c,skills)).join("");
  const context = environmentContext();
  $("#need-runtime").innerHTML = (data.runtimeOptions || [])
    .map((o) => `<option value="${esc(o.id)}">${esc(o.label)}</option>`)
    .join("");
  $("#need-runtime").value = context.runtime;
  capabilityOptions = data.capabilityOptions || [];
  $("#capability-options").innerHTML = capabilityOptions
    .map(
      (o) =>
        `<label>${esc(o.label)}<select data-capability="${esc(o.id)}">${[
          ["unknown", "Não sei ainda"],
          ["available", "Tenho acesso"],
          ["unavailable", "Não tenho acesso"],
        ]
          .map(
            ([v, label]) =>
              `<option value="${v}" ${context.availability[o.id] === v ? "selected" : ""}>${esc(t(label))}</option>`,
          )
          .join("")}</select></label>`,
    )
    .join("");
  for (const key of ["goal", "tool", "environment"]) {
    const field = $("#need-" + key),
      value = field.value;
    field.innerHTML = data.triageOptions[key]
      .map((o) => `<option value="${esc(o.id)}">${esc(o.label)}</option>`)
      .join("");
    field.value = [...field.options].some((o) => o.value === value)
      ? value
      : "any";
  }
  const groups = [
    ...new Map(
      skills.map((s) => [s.categoryKey || s.category, s.category]),
    ).entries(),
  ];
  $("#group").innerHTML =
    `<option value="all">${esc(t("Todos os grupos"))}</option>` +
    groups
      .sort((a, b) => a[1].localeCompare(b[1], DeckI18n.intlLocale))
      .map(
        ([key, label]) => `<option value="${esc(key)}">${esc(label)}</option>`,
      )
      .join("");
  $("#group").value = groups.some(([key]) => key === group) ? group : "all";
  if (window.DeckWork?.ready) DeckWork.update(data);
}
DeckI18n.onChange(async (next) => {
  $("#find-skills").disabled = true;
  const queryRevision = ++requestVersion;
  const catalogRevision = ++compatibilityVersion;
  const response = await fetch(catalogURL(next), {
    headers: { "x-deck-language": next },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok)
    throw new Error("Não foi possível trocar o idioma. Tente novamente.");
  const data = await response.json();
  if (!Array.isArray(data.skills) || data.skills.length !== skills.length)
    throw new Error("Não foi possível trocar o idioma. Tente novamente.");
  if (catalogRevision !== compatibilityVersion)
    throw new Error("Não foi possível trocar o idioma. Tente novamente.");
  let translatedMatch = null;
  if (!$("#matches").hidden && lastTriageRequest) {
    const response = await fetch("/api/triage?lang=" + next, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-deck-language": next },
      body: JSON.stringify({ ...lastTriageRequest, useAI: false }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok)
      throw new Error("Não foi possível trocar o idioma. Tente novamente.");
    translatedMatch = await response.json();
  }
  if (catalogRevision !== compatibilityVersion)
    throw new Error("Não foi possível trocar o idioma. Tente novamente.");
  if (queryRevision !== requestVersion) translatedMatch = null;
  const dialog = $("#skill-dialog"),
    scroll = dialog.scrollTop,
    pageScroll = scrollY;
  const id = selected?.id;
  const expanded = [...dialog.querySelectorAll("details")].map((d) => d.open);
  const checks = [...dialog.querySelectorAll('input[type="checkbox"]')].map(
    (c) => c.checked,
  );
  const formValues = [
    ...dialog.querySelectorAll(
      'select[name],textarea[name],input[name]:not([type="checkbox"])',
    ),
  ].map((e) => ({ name: e.name, value: e.value }));
  const nodes = [
    ...dialog.querySelectorAll(
      ".detail-tab-body h3,.detail-tab-body h4,.detail-tab-body p",
    ),
  ];
  const toolbarBottom = dialog
    .querySelector(".detail-toolbar")
    .getBoundingClientRect().bottom;
  const anchorIndex = nodes.findIndex(
    (n) => n.getBoundingClientRect().bottom > toolbarBottom,
  );
  const anchorOffset =
    nodes[anchorIndex]?.getBoundingClientRect().top - toolbarBottom;
  return () => {
    ++requestVersion;
    applyCatalog(data);
    render();
    renderDeck();
    renderJourneys();
    if (insightsRows) renderInsights(insightsRows);
    if (translatedMatch) renderMatches(translatedMatch, false);
    else if (queryRevision !== requestVersion - 1) $("#matches").hidden = true;
    if (id && dialog.open) {
      selected = byId(id);
      renderDetail();
      dialog.querySelector(".detail-tab-body").style.animation = "none";
      [...dialog.querySelectorAll("details")].forEach(
        (d, i) => (d.open = expanded[i] || false),
      );
      [...dialog.querySelectorAll('input[type="checkbox"]')].forEach(
        (c, i) => (c.checked = checks[i] || false),
      );
      formValues.forEach(({ name, value }) => {
        const field = dialog.querySelector(`[name="${CSS.escape(name)}"]`);
        if (field) field.value = value;
      });
    }
    DeckI18n.apply();
    $("#find-skills").disabled = false;
    $("#find-skills").textContent = t("Encontrar minha skill ↗");
    window.scrollTo({ top: pageScroll, behavior: "instant" });
    dialog.scrollTop = scroll;
    const newAnchor = [
      ...dialog.querySelectorAll(
        ".detail-tab-body h3,.detail-tab-body h4,.detail-tab-body p",
      ),
    ][anchorIndex];
    if (newAnchor && Number.isFinite(anchorOffset))
      dialog.scrollTop +=
        newAnchor.getBoundingClientRect().top -
        dialog.querySelector(".detail-toolbar").getBoundingClientRect().bottom -
        anchorOffset;
    const scope = dialog.open ? dialog : document;
    scope
      .querySelector(`.language-option[data-locale="${next}"]`)
      ?.focus({ preventScroll: true });
  };
});
document.addEventListener("deck:locale-error", () => {
  $("#find-skills").disabled = false;
  $("#find-skills").textContent = t("Encontrar minha skill ↗");
  toast("Não foi possível trocar o idioma. Tente novamente.");
});
for (const eventName of ["deck:locale-changed", "deck:locale-error"])
  document.addEventListener(eventName, () =>
    queueMicrotask(() => {
      if (queuedFind) {
        queuedFind = false;
        find();
      }
    }),
  );
motionPreference.addEventListener("change", () => {
  if (motionPreference.matches) detailSpin = false;
  if (selected) {
    renderDetail();
    syncDetailURL();
  }
});
function claimCollection(ids) {
  // Merge first-arrival history from another open tab before claiming these cards.
  const stored = DeckStore.load(deckStorage, skills.map(s => s.id), journeys.map(j => j.id));
  deck.collectionHistory = [...new Set([...(deck.collectionHistory || []), ...stored.collectionHistory])];
  return DeckStore.collect(deck, [...new Set(ids)].filter(id => byId(id)));
}
function refreshFavorites() {
  render(); renderDeck();
  document.querySelectorAll("[data-favorite]").forEach(b => {
    const id = b.dataset.favorite, s = byId(id); if (!s) return;
    b.setAttribute("aria-pressed", favorite(id));
    if (b.classList.contains("save-detail")) b.textContent = t(favorite(id) ? "♥ Salva no Meu Deck" : "♡ Salvar no Meu Deck");
    else b.setAttribute("aria-label", t(favorite(id) ? "Remover {code} do Meu Deck" : "Salvar {code} no Meu Deck", {code:s.code}));
  });
}
function invokeSelected(button, options = {}) {
  const card = $("#skill-detail .holo-card");
  if (!selected || !card || !button) return;
  detailSpin = false; detailFlipped = false; syncDetailURL();
  card.classList.remove("is-spinning", "flipped");
  $("#spin-card").setAttribute("aria-pressed", "false");
  $("#spin-card").textContent = t(motionPreference.matches ? "Giro desativado: movimento reduzido" : "Ativar giro");
  $("#turn-card").setAttribute("aria-pressed", "false"); $("#turn-card").textContent = t("Ver verso");
  DeckInvocation.start(selected, $("#skill-detail"), button, options);
}
function celebrateCollection(ids, message, opener) {
  if (!ids.length) { toast(message); return; }
  DeckInvocation.cancel();
  const revision = ++collectionRevision;
  function next(index) {
    if (revision !== collectionRevision) return;
    const s = byId(ids[index]); if (!s) return;
    if (!$("#skill-dialog").open || selected?.id !== s.id)
      openSkill(s.id, "power", {spin:"off", face:"front", silent:true, opener});
    const button = $("#skill-detail [data-summon]") || $("#skill-detail .save-detail");
    invokeSelected(button, {
      kind:"collection", index:index + 1, count:ids.length,
      onCancel:() => { if (revision === collectionRevision) collectionRevision++; },
      onComplete:() => {
        if (revision !== collectionRevision) return;
        if (index + 1 < ids.length) next(index + 1);
        else toast(message);
      },
    });
  }
  next(0);
}
function addFavorites(ids, message, opener) {
  const valid = [...new Set(ids)].filter(id => byId(id));
  const firstArrivals = claimCollection(valid);
  deck.favorites = [...new Set([...deck.favorites, ...valid])];
  save(); refreshFavorites();
  celebrateCollection(firstArrivals, message, opener);
}
function toggleFavorite(id, opener) {
  if (!byId(id)) return;
  if (!favorite(id)) { addFavorites([id], "Carta salva no Meu Deck.", opener); return; }
  // Keep the historical claim so removing and re-adding cannot replay the first arrival.
  claimCollection([id]);
  deck.favorites = deck.favorites.filter(x => x !== id);
  save(); refreshFavorites(); toast("Carta removida dos favoritos.");
}
function saveFile(name, text, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type })),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
function downloadGuide(s) {
  const lines = [
    `# ${t("Guia de primeiro uso")} — ${s.title}`,
    t("Guia para {code} · versão {version}", {
      code: s.code,
      version: s.version,
    }),
    t(
      "Os arquivos originais da skill mantêm o idioma de origem. A interface, os exemplos e o guia de primeiro uso acompanham o idioma escolhido.",
    ),
    `## ${s.universe.alias}`,
    s.universe.tagline,
    t("Narrativa ilustrativa inspirada no uso da skill."),
    s.universe.story,
    `## ${t("Para que serve")}`,
    s.universe.purpose,
    `## ${t("Quando tirar esta carta do Deck")}`,
    s.universe.useCases.map((x) => `- ${x}`).join("\n"),
    `## ${t("Da carta ao trabalho")}`,
    s.universe.steps.map((x, i) => `${i + 1}. ${x}`).join("\n"),
    `## ${t("Missão prática")} — ${s.universe.scenario.title}`,
    missionPrompt(s),
    t(
      "Esta missão é um roteiro ilustrativo. Não representa uma execução ou um resultado já validado.",
    ),
    `## ${t("Materiais e requisitos")}`,
    s.dependencies.map((item) => `- ${item}`).join("\n"),
    `## ${t("Como instalar")}`,
    t(
      "Extraia o ZIP e copie a pasta completa da skill para a pasta de skills do seu assistente. Preserve a versão anterior. Abra um novo chat e confirme se a skill foi reconhecida.",
    ),
    `- Codex: ~/.codex/skills/${s.id}\n- Claude Code: ~/.claude/skills/${s.id}`,
    t(
      "Para outros assistentes, confira o suporte a SKILL.md e as ferramentas necessárias antes de instalar.",
    ),
    `## ${t("Primeiro comando")}`,
    s.firstPrompt,
    `## ${t("Como conferir")}`,
    s.acceptance.map((item) => `- [ ] ${item}`).join("\n"),
    t(
      "A execução acontece no seu assistente. O site não envia seus arquivos ou executa a skill.",
    ),
  ];
  saveFile(
    `${s.code}-guide-${DeckI18n.locale}.md`,
    lines.join("\n\n") + "\n",
    "text/markdown",
  );
}
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Comando copiado. Cole no seu assistente.");
    return true;
  } catch {
    toast(
      "Não foi possível copiar automaticamente. Selecione e copie o comando exibido.",
    );
    return false;
  }
}
function officialLink(s) {
  return `<a class="text-button" href="${esc(s.officialGuide.url)}" target="_blank" rel="noopener noreferrer">${esc(t("Abrir fonte oficial: {publisher} ↗", { publisher: s.officialGuide.publisher }))}</a>`;
}
function officialStart(s) {
  const g = s.officialGuide;
  return `<h3>${esc(t("Ative pela fonte oficial."))}</h3><p>${esc(g.note)}</p>${g.command ? `<p><code>${esc(g.command)}</code></p>` : ""}<p>${officialLink(s)}</p>`;
}
function restoreDownloadState() {
  document.querySelectorAll("[data-download]").forEach((button) => {
    const state = downloadStates.get(button.dataset.download);
    if (!state) return;
    button.disabled = state.pending;
    button.textContent = t(
      state.pending ? "Verificando pacote…" : "Baixar v{version} ↓",
      { version: byId(button.dataset.download)?.version },
    );
  });
  if ($("#download-status"))
    $("#download-status").textContent = t(
      downloadStates.get(selected?.id)?.message || "",
    );
}
async function download(id, button) {
  if (button.disabled || downloadStates.get(id)?.pending) return;
  downloadStates.set(id, { pending: true, message: "" });
  restoreDownloadState();
  const s = byId(id);
  try {
    const r = await fetch(
      DeckI18n.url("/api/download?id=" + encodeURIComponent(id)),
      {
        headers: DeckI18n.headers(),
        signal: AbortSignal.timeout(30000),
      },
    );
    if (r.status === 401) {
      location.assign(DeckI18n.url(deckLoginPath()));
      return;
    }
    if (!r.ok) {
      const data = await r.json();
      throw new Error(data.error || "Download indisponível.");
    }
    if (!String(r.headers.get("content-type")).includes("application/zip"))
      throw new Error("Pacote inválido.");
    const buffer = await r.arrayBuffer();
    if (buffer.byteLength > 4000000)
      throw new Error("Pacote acima do tamanho permitido.");
    const digest = [
      ...new Uint8Array(await crypto.subtle.digest("SHA-256", buffer)),
    ]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("");
    if (
      digest !== s.release.sha256 ||
      r.headers.get("x-package-version") !== s.version
    )
      throw new Error(
        "A versão do pacote mudou. Atualize a página antes de baixar.",
      );
    const url = URL.createObjectURL(
        new Blob([buffer], { type: "application/zip" }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download = `${s.code}-${id}-v${s.version}.zip`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    claimCollection([id]);
    deck.downloads.push({
      id,
      version: s.version,
      at: new Date().toISOString(),
    });
    deck.downloads = deck.downloads.slice(-300);
    recordUsage("download", id, "downloaded");
    save();
    renderDeck();
    downloadStates.set(id, {
      pending: false,
      message: "ZIP conferido. Continue pelo Primeiro uso.",
    });
    confirmDownload(s.code);
  } catch (e) {
    const message =
      e.name === "TimeoutError"
        ? "O download demorou. Tente novamente."
        : errorText(e);
    downloadStates.set(id, {
      pending: false,
      message:
        e.name === "TimeoutError"
          ? "O download demorou. Tente novamente."
          : "Download indisponível.",
    });
    toast(message);
  } finally {
    const state = downloadStates.get(id);
    if (state) state.pending = false;
    restoreDownloadState();
  }
}
function renderMatches(result, focus = true) {
  lastMatch = result;
  currentPlan = result.plan || null;
  $("#personal-plan").innerHTML = DeckEvolution.plan(currentPlan, skills);
  $("#matches").hidden = false;
  $("#match-summary").textContent =
    result.summary +
    (result.mode === "ai"
      ? " " + t("Indicação assistida por IA.")
      : " " + t("Correspondência pelo catálogo.")) +
    (result.notice ? " " + result.notice : "");
  if (result.filterLabels?.length)
    $("#match-summary").textContent +=
      " " +
      t("Filtros aplicados: {filters}.", {
        filters: result.filterLabels.join(" · "),
      });
  const excludedToolLabels = [
    ...new Set(
      (result.excludedTools || [])
        .map(
          (id) =>
            [...$("#need-tool").options].find((option) => option.value === id)
              ?.textContent,
        )
        .filter(Boolean),
    ),
  ];
  if (excludedToolLabels.length)
    $("#match-summary").textContent +=
      " " +
      t("Ferramentas excluídas do pedido: {tools}.", {
        tools: excludedToolLabels.join(" · "),
      });
  $("#clarification").hidden = !result.clarification;
  $("#clarification").innerHTML = result.clarification
    ? `<p class="fine">${esc(t("Pergunta {step} de até {total}", { step: result.clarification.step || 1, total: 2 }))}</p><h3>${esc(result.clarification.question)}</h3><div>${result.clarification.options.map((o) => `<button class="btn secondary" data-refine="${esc(o.id)}" data-question="${esc(result.clarification.id)}">${esc(o.label)}</button>`).join("")}</div>`
    : "";
  $("#match-grid").innerHTML = result.matches
    .map((m, i) => {
      const s = byId(m.id);
      return s
        ? `<article class="match-item"><p class="mini-heading">${esc(s.code)} / ${esc(t(i === 0 ? "Comece por aqui" : "Também pode ajudar"))}</p><h3>${esc(s.title)}</h3><p>${esc(m.reason)}</p>${s.role === "support" ? `<p class="scope-note">Skill de apoio: orienta esta etapa e pode precisar de outras ferramentas para concluir a entrega.</p>` : ""}<dl class="match-evidence"><div><dt>Entrega sugerida</dt><dd>${esc(m.deliverable || s.deliverables[0])}</dd></div><div><dt>Verifique antes</dt><dd>${esc(m.consideration || s.universe.boundary)}</dd></div></dl><p class="fine">${esc(m.nextStep)}</p><span class="quality-badge">${esc(badge(s))}</span><div class="match-actions"><button class="btn" data-start="${s.id}">Começar</button><button class="btn secondary" data-mission="${s.id}">Experimentar a missão</button></div></article>`
        : "";
    })
    .join("");
  if (focus) {
    $("#matches-title").focus();
    $("#matches").scrollIntoView({ block: "start" });
  }
  DeckI18n.apply($("#matches"));
}
async function find() {
  if (DeckI18n.changing) {
    queuedFind = true;
    return;
  }
  const problem = $("#problem").value.trim();
  if (problem.length < 12) {
    $("#finder-error").textContent = t(
      "Descreva a tarefa com pelo menos 12 caracteres.",
    );
    return;
  }
  const version = ++requestVersion;
  $("#finder-error").textContent = "";
  $("#find-skills").disabled = true;
  $("#find-skills").textContent = t("Comparando capacidades…");
  try {
    lastTriageRequest = {
      problem,
      audience,
      refinement,
      profile: triageProfile(),
    };
    const result = await api("/api/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problem,
        audience,
        refinement,
        profile: triageProfile(),
        useAI: $("#use-ai").checked,
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (version !== requestVersion) return;
    renderMatches(result);
    if (!result.clarification)
      recordUsage(
        "recommendation",
        null,
        result.matches.length ? "matches" : "no-match",
      );
  } catch (e) {
    if (version !== requestVersion) return;
    $("#finder-error").textContent =
      e.name === "TimeoutError"
        ? "A análise demorou. Tente novamente."
        : errorText(e);
    DeckI18n.apply($("#finder-error"));
  } finally {
    if (version === requestVersion) {
      $("#find-skills").disabled = false;
      $("#find-skills").textContent = t("Encontrar minha skill ↗");
    }
  }
}
document.addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.hasAttribute("data-invocation-motion")) { DeckInvocation.toggleMotion($("#skill-detail")); return; }
  if (b.hasAttribute("data-invocation-sound")) {
    DeckSound.set(!DeckSound.enabled);
    for (const button of document.querySelectorAll("#market-sound,[data-invocation-sound]")) {
      button.textContent = t(DeckSound.enabled ? "Som ativado" : "Som desativado");
      button.setAttribute("aria-pressed", String(DeckSound.enabled));
    }
    return;
  }
  if (b.dataset.copyIdentity && selected?.id === b.dataset.copyIdentity) {
    try { await navigator.clipboard.writeText(selected.identity.id); toast("ID da carta copiado."); }
    catch { toast("Não foi possível copiar. Selecione o ID completo na ficha técnica."); }
    return;
  }
  if (b.dataset.passport && selected?.id === b.dataset.passport) {
    saveFile(`${selected.code}-passport-v${selected.version}.json`, JSON.stringify(DeckIdentity.manifest(selected), null, 2) + "\n");
    return;
  }
  if (b.dataset.verifyIdentity && selected?.id === b.dataset.verifyIdentity) {
    const status = $("#skill-detail .identity-result"), skill = selected;
    b.disabled = true; status.textContent = t("Conferindo identidade…");
    const valid = await DeckIdentity.verify(skill);
    if (status.isConnected) status.textContent = t(valid ? "ID e edição conferidos por SHA-256. Isso não certifica compra ou propriedade." : "Não foi possível conferir esta identidade. Atualize a página e tente novamente.");
    if (b.isConnected) b.disabled = false;
    return;
  }
  if (b.hasAttribute("data-save-plan") && currentPlan) {
    deck.plans = [
      ...(deck.plans || []).filter((p) => p.id !== currentPlan.id),
      {
        id: currentPlan.id,
        title: currentPlan.title,
        skillIds: currentPlan.steps.map((s) => s.skillId),
      },
    ].slice(-20);
    addFavorites(currentPlan.steps.map(s => s.skillId), "Plano e cartas adicionados ao Meu Deck.", b);
  }
  if (b.dataset.removePlan) {
    deck.plans = (deck.plans || []).filter(
      (p) => p.id !== b.dataset.removePlan,
    );
    save();
    renderDeck();
  }
  if (b.hasAttribute("data-export-plan") && currentPlan)
    saveFile(
      "DriveData-plano.md",
      `# ${currentPlan.title}\n\n${currentPlan.rationale}\n\n` +
        currentPlan.steps
          .map(
            (step) =>
              `## ${step.order}. ${byId(step.skillId).title}\n\n${step.input}\n\n${step.output}\n\n${step.rationale}\n`,
          )
          .join("\n") +
        currentPlan.notice,
      "text/markdown",
    );
  if (b.dataset.helpIssue) {
    helpIssue = b.dataset.helpIssue;
    renderDetail(`[data-help-issue="${helpIssue}"]`);
  }
  if (b.dataset.copyHelp)
    await copy(
      DeckEvolution.helpPrompt(byId(b.dataset.copyHelp), b.dataset.issue),
    );
  if (b.dataset.labArtifact) {
    const a = byId(b.dataset.labArtifact)?.lab?.reference?.artifacts?.[
      Number(b.dataset.artifactIndex)
    ];
    if (a) saveFile(a.filename, a.content, a.mimeType);
  }
  if (b.dataset.assistantArtifact) {
    const a = byId(b.dataset.assistantArtifact)?.lab?.assistantSamples?.[
      Number(b.dataset.sampleIndex)
    ]?.artifacts?.[Number(b.dataset.artifactIndex)];
    if (a) saveFile(a.filename, a.content, a.mimeType);
  }
  if (b.dataset.evalKit) {
    const s = byId(b.dataset.evalKit);
    saveFile(
      s.code + "-avaliacao-" + DeckI18n.locale + ".md",
      `# ${s.title}\n\n${s.lab.notice}\n\n${missionPrompt(s)}\n\n${t("Execução por assistente")}: ${s.lab.executionLabel}\n\n${t("Requisitos desta carta")}: ${s.dependencies.join("; ")}\n`,
      "text/markdown",
    );
  }
  if (b.dataset.view) setView(b.dataset.view);
  if (b.dataset.audience) setAudience(b.dataset.audience);
  if (b.dataset.open) openSkill(b.dataset.open, undefined, { opener: b });
  if (b.dataset.start) openSkill(b.dataset.start, "start", { opener: b });
  if (b.dataset.mission) openSkill(b.dataset.mission, "example", { opener: b });
  if (b.dataset.favorite) toggleFavorite(b.dataset.favorite, b);
  if (b.dataset.download) download(b.dataset.download, b);
  if (b.dataset.guide) downloadGuide(byId(b.dataset.guide));
  if (b.dataset.copyMission)
    await copy(missionPrompt(byId(b.dataset.copyMission)));
  if (b.dataset.example) {
    $("#problem").value = b.dataset.example;
    $("#problem").setCustomValidity("");
    refinement = null;
    find();
  }
  if (b.dataset.refine) {
    refinement = [
      ...(Array.isArray(refinement)
        ? refinement
        : refinement
          ? [refinement]
          : []),
      { questionId: b.dataset.question, optionId: b.dataset.refine },
    ].slice(-2);
    find();
  }
  if (b.dataset.viewCombo) {
    const combo=combos.find(c=>c.id===b.dataset.viewCombo);
    if (combo) {
      comboFilter=combo.id;
      $("#search").value=""; $("#group").value="all"; $("#role").value="all";
      $("#examples-only").checked=false; $("#show-all").checked=true; $("#price-ceiling").value="all";
      limit=12; DeckWork.switchMode("explore"); setView("discover"); render();
      $("#collection").scrollIntoView({behavior:motionPreference.matches?"instant":"smooth"});
      $("#clear-combo").focus({preventScroll:true});
    }
  }
  if (b.id === "clear-combo") { comboFilter=null; render(); $("#search").focus({preventScroll:true}); }
  if (b.dataset.saveCombo) {
    const combo=combos.find(c=>c.id===b.dataset.saveCombo);
    if (combo) addFavorites(combo.skillIds, "As cartas do combo estão no seu Deck.", b);
  }
  if (b.dataset.summon && selected?.id===b.dataset.summon) {
    invokeSelected(b);
  }
  if (b.dataset.detailTab) {
    detailTab = b.dataset.detailTab;
    renderDetail();
    syncDetailURL();
    document
      .querySelector(`[data-detail-tab="${detailTab}"][aria-pressed]`)
      ?.focus({ preventScroll: true });
    $("#skill-dialog").scrollTop = 0;
  }
  if (b.dataset.wizardStep !== undefined) {
    if (!/^[0-3]$/.test(b.dataset.wizardStep)) return;
    wizardStep = Number(b.dataset.wizardStep);
    renderDetail(`[data-wizard-step="${wizardStep}"]`);
    syncDetailURL();
    $("#skill-dialog").scrollTop = 0;
  }
  if (b.dataset.platform) {
    persistProgress(selected.id, {
      platform: b.dataset.platform,
      installed: false,
      promptCopied: false,
      tested: false,
    });
    renderDetail();
  }
  if (b.id === "next-prompt") {
    if (!$("#installed-check").checked) {
      toast("Confirme a instalação antes de avançar.");
      return;
    }
    persistProgress(selected.id, { installed: true });
    wizardStep = 2;
    renderDetail('[data-wizard-step="2"]');
    syncDetailURL();
  }
  if (b.id === "copy-prompt") {
    const sourceSkill = selected;
    if (sourceSkill && (await copy(sourceSkill.firstPrompt))) {
      persistProgress(sourceSkill.id, { promptCopied: true });
      b.textContent = t("Copiar novamente");
    }
  }
  if (b.id === "mark-tested") {
    if (
      [...document.querySelectorAll(".result-check")].some((x) => !x.checked)
    ) {
      toast("Confira todos os critérios antes de marcar esta etapa.");
      return;
    }
    persistProgress(selected.id, { tested: true });
    renderJourneys();
    b.textContent = t("Conferido por você ✓");
    addFavorites([selected.id], "Sua conferência foi registrada no Meu Deck.", b);
  }
  if (b.dataset.copyExample) {
    const s = byId(b.dataset.copyExample);
    await copy(
      t("Use a skill {id}. {task}", { id: s.id, task: s.example.task }),
    );
  }
  if (b.dataset.sample) {
    const s = byId(b.dataset.sample);
    saveFile(
      s.code + "-exemplo.json",
      JSON.stringify(
        {
          notice: t("Dados fictícios de demonstração"),
          locale: DeckI18n.locale,
          input: s.example.input,
          result: s.example.result,
          checks: s.example.checks,
        },
        null,
        2,
      ),
    );
  }
  if (b.dataset.deckFilter) {
    deckFilter = b.dataset.deckFilter;
    document
      .querySelectorAll("[data-deck-filter]")
      .forEach((x) => x.setAttribute("aria-pressed", x === b));
    renderDeck();
  }
  if (b.dataset.saveJourney) {
    const j = journeys.find((j) => j.id === b.dataset.saveJourney);
    deck.journeys = [...new Set([...deck.journeys, j.id])];
    renderJourneys();
    addFavorites(j.steps.map(s => s.id), "As cartas da jornada estão no seu Deck.", b);
  }
  if (b.dataset.exportJourney) {
    const j = journeys.find((j) => j.id === b.dataset.exportJourney);
    saveFile(
      "DriveData-" + j.id + ".md",
      `# ${j.title}\n\n${j.description}\n\n` +
        j.steps
          .map(
            (step, i) =>
              `## ${i + 1}. ${step.action}\n\nSkill: ${step.id}\n\n${t("Entrega para a próxima etapa:")} ${step.handoff}\n\n${byId(step.id).firstPrompt}\n`,
          )
          .join("\n"),
      "text/markdown",
    );
  }
});
$("#close-detail").onclick = () => $("#skill-dialog").close();
$("#skill-dialog").addEventListener("cancel", e => {
  if (DeckInvocation.running) { e.preventDefault(); DeckInvocation.cancel(); }
});
document.addEventListener("change", async e => {
  const input = e.target;
  if (!input.matches("[data-verify-zip]") || selected?.id !== input.dataset.verifyZip) return;
  const file = input.files?.[0], skill = selected, status = input.closest("details").querySelector(".zip-result");
  if (!file) { status.textContent = ""; return; }
  if (file.size > 4000000) { status.textContent = t("Selecione um ZIP de até 4 MB, como os arquivos deste catálogo."); return; }
  status.textContent = t("Conferindo arquivo no seu navegador…");
  try {
    const digest = await DeckIdentity.sha256(await file.arrayBuffer());
    if (!status.isConnected || input.files[0] !== file) return;
    status.textContent = t(digest === skill.release.sha256 ? "Arquivo íntegro: corresponde exatamente ao ZIP desta edição." : "Este arquivo não corresponde à edição exibida. Pode ser outra versão ou ter sido alterado.");
  } catch { if (status.isConnected && input.files[0] === file) status.textContent = t("Não foi possível ler o arquivo. Selecione o ZIP novamente."); }
});
$("#skill-dialog").addEventListener("close", () => {
  DeckInvocation.cancel();
  selected = null;
  syncDetailURL();
  render();
  if (view === "deck") renderDeck();
  $("#detail-toast").hidden = true;
  const scope = detailOrigin?.scope ? $("#" + detailOrigin.scope) : document;
  const origin = detailOrigin?.node?.isConnected
    ? detailOrigin.node
    : detailOrigin?.selector
      ? scope?.querySelector(detailOrigin.selector)
      : null;
  const fallback = $(
    view === "deck"
      ? "#my-deck-title"
      : view === "journeys"
        ? "#journeys-title"
        : "#collection-title",
  );
  if (!origin && fallback) fallback.tabIndex = -1;
  (origin || fallback)?.focus({ preventScroll: true });
  detailOrigin = null;
});
$("#finder").onsubmit = (e) => {
  e.preventDefault();
  find();
};
function resetIndication() {
  refinement = null;
  ++requestVersion;
  $("#matches").hidden = true;
  $("#finder-error").textContent = "";
  $("#find-skills").disabled = false;
  $("#find-skills").textContent = t("Encontrar minha skill ↗");
}
async function refreshCompatibility() {
  const revision = ++compatibilityVersion;
  resetIndication();
  $("#find-skills").disabled = true;
  try {
    const data = await api(catalogURL(), {
      signal: AbortSignal.timeout(20000),
    });
    if (revision !== compatibilityVersion) return;
    const id = selected?.id,
      scroll = $("#skill-dialog").scrollTop;
    applyCatalog(data);
    render();
    renderDeck();
    if (id) {
      selected = byId(id);
      renderDetail();
      DeckI18n.apply();
      $("#skill-dialog").scrollTop = scroll;
    }
  } catch (error) {
    if (revision === compatibilityVersion)
      $("#finder-error").textContent = errorText(error);
  } finally {
    if (revision === compatibilityVersion) $("#find-skills").disabled = false;
  }
}
$("#need-runtime").onchange = refreshCompatibility;
$("#capability-options").addEventListener("change", refreshCompatibility);
async function recordUsage(kind, skillId, outcome) {
  if (!$("#usage-consent").checked) return;
  try {
    await api("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        skillId,
        outcome,
        reason: "none",
        ...feedbackContext(),
        consent: true,
      }),
    });
  } catch {}
}
function feedbackContext() {
  return {
    runtime: environmentContext().runtime,
    goal: $("#need-goal").value,
    tool: $("#need-tool").value,
  };
}
document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!form.matches("[data-feedback-form]")) return;
  event.preventDefault();
  const button = form.querySelector('[type="submit"]'),
    status = form.querySelector(".feedback-status");
  if (button.disabled) return;
  feedbackStates.set(form.dataset.feedbackForm, { pending: true, message: "" });
  button.disabled = true;
  const fields = new FormData(form);
  try {
    const result = await api("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "feedback",
        skillId: form.dataset.feedbackForm,
        outcome: fields.get("outcome"),
        reason: fields.get("reason"),
        consent: fields.get("consent") === "on",
        ...feedbackContext(),
      }),
    });
    feedbackStates.set(form.dataset.feedbackForm, {
      pending: false,
      sent: true,
      message: "Avaliação recebida. Obrigado por ajudar a melhorar o Deck.",
    });
  } catch {
    feedbackStates.set(form.dataset.feedbackForm, {
      pending: false,
      message:
        "Não foi possível enviar a avaliação. Confira os campos e sua conexão antes de tentar novamente.",
    });
  }
  restoreFeedbackState();
});
function restoreFeedbackState() {
  document.querySelectorAll("[data-feedback-form]").forEach((form) => {
    const state = feedbackStates.get(form.dataset.feedbackForm);
    if (!state) return;
    form.querySelector('[type="submit"]').disabled = !!(
      state.pending || state.sent
    );
    form.querySelector(".feedback-status").textContent = t(
      state.pending ? "Enviando avaliação…" : state.message,
    );
  });
}
$("#open-insights").onclick = () => {
  $("#insights-panel").hidden = false;
  $("#insights-title").focus();
  $("#insights-panel").scrollIntoView({ block: "start" });
};
$("#close-insights").onclick = () => {
  ++insightsVersion;
  $("#insights-panel").hidden = true;
  $("#insights-key").value = "";
  $("#insights-results").innerHTML = "";
  $("#insights-error").textContent = "";
  insightsRows = null;
  $("#open-insights").focus();
};
$("#insights-access").onsubmit = async (event) => {
  event.preventDefault();
  const revision = ++insightsVersion;
  $("#insights-error").textContent = "";
  const button = event.target.querySelector("button");
  button.disabled = true;
  try {
    const result = await api("/api/feedback", {
      headers: { "x-insights-key": $("#insights-key").value },
      signal: AbortSignal.timeout(20000),
    });
    if (revision !== insightsVersion || $("#insights-panel").hidden) return;
    renderInsights(result.rows);
  } catch (error) {
    if (revision === insightsVersion && !$("#insights-panel").hidden)
      $("#insights-error").textContent = errorText(error);
  } finally {
    button.disabled = false;
  }
};
let insightsRows = null;
function renderInsights(rows) {
  insightsRows = rows;
  const count = (kind, outcome) =>
    rows
      .filter((r) => r.kind === kind && (!outcome || r.outcome === outcome))
      .reduce((a, r) => a + Number(r.total), 0);
  const labels = {
    resolved: "Resolvi minha tarefa",
    partial: "Ajudou parcialmente",
    "not-fit": "Não serviu para esta tarefa",
    matches: "Com indicação",
    "no-match": "Sem indicação",
    downloaded: "Download concluído",
    blocked: "Uso bloqueado",
  };
  $("#insights-results").innerHTML =
    `<p class="fine">${esc(t("Últimos 90 dias. Resultados declarados pelos usuários; a mesma sessão conta uma vez por carta e tipo de evento."))}</p><div class="insights-kpis">${[
      ["Consultas de triagem", count("recommendation")],
      ["Necessidades sem indicação", count("recommendation", "no-match")],
      ["Avaliações recebidas", count("feedback")],
      ["Tarefas resolvidas declaradas", count("feedback", "resolved")],
    ]
      .map(
        ([label, n]) =>
          `<div><strong>${n}</strong><span>${esc(t(label))}</span></div>`,
      )
      .join("")}</div>${
      rows.length
        ? `<div class="insights-scroll"><table class="insights-table"><thead><tr><th>${esc(t("Carta ou necessidade"))}</th><th>${esc(t("Resultado"))}</th><th>${esc(t("Principal dificuldade"))}</th><th>${esc(t("Sessões"))}</th></tr></thead><tbody>${rows
            .map((r) => {
              const goal = [...$("#need-goal").options].find(
                (o) => o.value === r.goal,
              )?.textContent;
              const tool = [...$("#need-tool").options].find(
                (o) => o.value === r.tool,
              )?.textContent;
              const reason = {
                none: "Nenhuma",
                recognition: "A skill não apareceu",
                dependency: "Falta uma ferramenta",
                "different-result": "O resultado saiu diferente",
                unclear: "Não sei como começar",
                incompatible: "Meu assistente não é compatível",
                "out-of-scope": "A tarefa ficou fora do escopo",
              }[r.reason];
              return `<tr><td>${esc(byId(r.skill_id)?.title || [goal, tool].filter(Boolean).join(" · "))}<small>${esc(r.runtime)} · ${esc(r.locale)}</small></td><td>${esc(t(labels[r.outcome] || r.outcome))}</td><td>${esc(t(reason || "Nenhuma"))}</td><td>${Number(r.total)}</td></tr>`;
            })
            .join("")}</tbody></table></div>`
        : `<p class="evidence-empty">${esc(t("Ainda não há dados. As primeiras avaliações voluntárias aparecerão aqui."))}</p>`
    }`;
}
for (const key of ["goal", "tool", "environment"])
  $("#need-" + key).onchange = resetIndication;
$("#reset-profile").onclick = () => {
  for (const key of ["goal", "tool", "environment"])
    $("#need-" + key).value = "any";
  $("#need-runtime").value = "any";
  document.querySelectorAll("#capability-options select").forEach((select) => {
    select.value = "unknown";
  });
  refreshCompatibility();
};
$("#problem").oninput = () => {
  refinement = null;
  ++requestVersion;
  $("#find-skills").disabled = DeckI18n.changing;
  $("#find-skills").textContent = t("Encontrar minha skill ↗");
  $("#matches").hidden = true;
};
for (const id of ["group", "role", "examples-only", "show-all", "sort", "price-ceiling"])
  $("#" + id).onchange = () => {
    limit = 12;
    render();
  };
$("#search").oninput = () => {
  limit = 12;
  render();
};
$("#load-more").onclick = () => {
  limit += 12;
  render();
};
$("#clear-matches").onclick = () => {
  ++requestVersion;
  refinement = null;
  $("#matches").hidden = true;
  $("#find-skills").disabled = false;
  $("#find-skills").textContent = t("Encontrar minha skill ↗");
  $("#problem").focus();
};
$("#market-sound").onclick = () => {
  DeckSound.set(!DeckSound.enabled);
  $("#market-sound").textContent = DeckSound.enabled
    ? "Som ativado"
    : "Som desativado";
  DeckI18n.apply($("#market-sound"));
  $("#market-sound").setAttribute("aria-pressed", DeckSound.enabled);
  if (DeckSound.enabled) DeckSound.play();
};
$("#export-deck").onclick = () =>
  saveFile(
    "meu-drivedata-deck.json",
    JSON.stringify({ ...deck, exportedAt: new Date().toISOString() }, null, 2),
  );
$("#import-deck").onclick = () => $("#import-file").click();
$("#import-file").onchange = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 200000)
      throw new Error("O arquivo do Deck deve ter até 200 KB.");
    const incoming = DeckStore.clean(
      JSON.parse(await file.text()),
      skills.map((s) => s.id),
      journeys.map((j) => j.id),
    );
    const downloads = [...deck.downloads, ...incoming.downloads];
    deck = DeckStore.clean(
      {
        schema: 1,
        collectionHistory: [...(deck.collectionHistory || []), ...incoming.collectionHistory],
        favorites: [...deck.favorites, ...incoming.favorites],
        journeys: [...deck.journeys, ...incoming.journeys],
        plans: [...(deck.plans || []), ...(incoming.plans || [])],
        progress: { ...deck.progress, ...incoming.progress },
        work: DeckWorkStore.merge(deck.work, incoming.work),
        downloads: [
          ...new Map(
            downloads.map((d) => [d.id + ":" + d.version + ":" + d.at, d]),
          ).values(),
        ].sort((a, b) => Date.parse(a.at) - Date.parse(b.at)),
      },
      skills.map((s) => s.id),
      journeys.map((j) => j.id),
    );
    save();
    renderDeck();
    toast("Deck importado e combinado com esta coleção.");
    DeckWork.render();
  } catch (error) {
    toast(
      error instanceof SyntaxError
        ? "Arquivo JSON inválido. Exporte um Deck pelo site."
        : errorText(
            error,
            "Não foi possível ler o arquivo. Tente exportar seu Deck novamente.",
          ),
    );
  } finally {
    e.target.value = "";
  }
};
$("#logout").onclick = async () => {
  try {
    await api("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    location.assign(DeckI18n.url(deckLoginPath()));
  } catch {
    toast("Não foi possível sair. Tente novamente.");
  }
};
(async () => {
  try {
    const data = await api(catalogURL());
    applyCatalog(data);
    deck = DeckStore.load(
      deckStorage,
      skills.map((s) => s.id),
      journeys.map((j) => j.id),
    );
    save();
    DeckWork.start(
      {
        deck: () => deck,
        save,
        copy,
        openSkill,
        setView,
        renderCollection: () => {
          render();
          renderDeck();
        },
        setRuntime: (value) => {
          $("#need-runtime").value = value;
          refreshCompatibility();
        },
        packDownloaded: (pack) => {
          const at = new Date().toISOString();
          claimCollection(pack.steps.map(s => s.skillId));
          deck.downloads.push(
            ...pack.steps.map((s) => ({
              id: s.skillId,
              version: pack.skillVersion,
              at,
            })),
          );
          deck.downloads = deck.downloads.slice(-300);
          save();
          renderDeck();
          confirmDownload();
        },
      },
      data,
    );
    try {
      audience =
        localStorage.getItem("drivedata-audience") === "technical"
          ? "technical"
          : "business";
    } catch {}
    setAudience(audience);
    const initialView = new URL(location.href).searchParams.get("view");
    if (["deck", "journeys"].includes(initialView)) setView(initialView);
    const initialParams = new URL(location.href).searchParams;
    const initialSkill = skills.find(
      (s) => s.code === initialParams.get("skill"),
    );
    const initialChapter = initialParams.get("chapter");
    if (initialSkill)
      openSkill(
        initialSkill.id,
        [
          "universe",
          "power",
          "overview",
          "example",
          "start",
          "technical",
          "lab",
          "help",
        ].includes(initialChapter)
          ? initialChapter
          : "universe",
        {
          step: initialParams.get("step"),
          spin: initialParams.get("spin"),
          face: initialParams.get("face"),
        },
      );
    $("#market-sound").textContent = DeckSound.enabled
      ? "Som ativado"
      : "Som desativado";
    DeckI18n.apply($("#market-sound"));
    $("#market-sound").setAttribute("aria-pressed", DeckSound.enabled);
    const status = await api("/api/status");
    $("#ai-choice").hidden = !status.aiConfigured;
  } catch (e) {
    $("#load-error").textContent = errorText(e);
  }
})();
