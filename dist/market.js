"use strict";
const $ = (s) => document.querySelector(s),
  esc = DeckArt.esc;
let skills = [],
  journeys = [],
  deck = DeckStore.empty(),
  audience = "business",
  view = "discover",
  deckFilter = "all",
  limit = 12,
  selected = null,
  detailTab = "overview",
  wizardStep = 0,
  requestVersion = 0,
  refinement = null,
  toastTimer;
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
function toast(text) {
  $("#toast").textContent = text;
  $("#toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("#toast").hidden = true), 5000);
}
function save() {
  const ok = DeckStore.save(deckStorage, deck);
  $("#storage-error").textContent = ok
    ? ""
    : "O navegador não permitiu salvar. Exporte seu Deck para preservar o progresso.";
  $("#deck-count").textContent = new Set([
    ...deck.favorites,
    ...deck.downloads.map((x) => x.id),
  ]).size;
  return ok;
}
async function api(url, options) {
  const r = await fetch(url, options);
  if (r.status === 401) {
    location.assign("/login");
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
  return `<article class="skill-slot"><div class="slot-top"><span class="quality-badge">${esc(badge(s))}</span><button class="favorite" data-favorite="${esc(s.id)}" aria-pressed="${favorite(s.id)}" aria-label="${favorite(s.id) ? "Remover" : "Salvar"} ${esc(s.code)} no Meu Deck">${favorite(s.id) ? "♥" : "♡"}</button></div><button class="card-open" data-open="${esc(s.id)}" aria-label="Explorar ${esc(s.code)}: ${esc(s.title)}">${DeckArt.card(s)}</button><p class="slot-context">${audience === "technical" ? esc(s.id) : esc(s.deliverables[0])}</p><p class="slot-state">${needsUpdate(s) ? "Nova versão disponível" : progress(s.id).tested ? "Conferido por você" : d ? "Baixado · v" + esc(d.version) : esc(s.setup)}</p><div class="skill-actions"><button class="text-button" data-open="${esc(s.id)}">${s.example ? "Ver exemplo" : "Explorar carta"}</button><button class="download" data-start="${esc(s.id)}">Começar ↗</button></div></article>`;
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
      (group === "all" || s.category === group) &&
      (role === "all" || s.role === role) &&
      (!$("#examples-only").checked || s.example) &&
      norm(
        [
          s.code,
          s.id,
          s.title,
          s.pain,
          ...s.deliverables,
          ...s.compatibility.tools,
        ].join(" "),
      ).includes(q),
  );
  const sort = $("#sort").value;
  filtered.sort(
    sort === "name"
      ? (a, b) => a.title.localeCompare(b.title, "pt-BR")
      : sort === "code"
        ? (a, b) => a.code.localeCompare(b.code)
        : (a, b) =>
            Number(b.featured) - Number(a.featured) ||
            a.code.localeCompare(b.code),
  );
  $("#skill-count").textContent =
    `${filtered.length} de ${skills.length} cartas`;
  $("#skill-grid").innerHTML = filtered.slice(0, limit).map(slot).join("");
  $("#empty").hidden = filtered.length > 0;
  $("#load-more").hidden = filtered.length <= limit;
  DeckArt.tilt($("#skill-grid"));
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
        `<div class="history-row"><span>${esc(byId(d.id)?.title || d.id)}<small>${esc(byId(d.id)?.code)} · v${esc(d.version)} · ${new Date(d.at).toLocaleDateString("pt-BR")}</small></span><button class="text-button" data-download="${esc(d.id)}">Baixar versão atual</button></div>`,
    )
    .join("");
  DeckArt.tilt($("#my-deck-grid"));
}
function renderJourneys() {
  $("#journey-grid").innerHTML = journeys
    .filter((j) => audience === "technical" || j.audience !== "technical")
    .map((j) => {
      const completed = j.steps.filter((s) => progress(s.id).tested).length;
      return `<article class="journey"><div class="journey-header"><p class="edition-line">${j.steps.length} etapas · ${completed} conferidas</p><h2>${esc(j.title)}</h2><p>${esc(j.description)}</p></div><ol>${j.steps
        .map((step, i) => {
          const s = byId(step.id);
          return `<li class="${progress(s.id).tested ? "step-complete" : ""}"><span class="step-number">${progress(s.id).tested ? "✓" : i + 1}</span><div><span class="code">${esc(s.code)}</span><h3>${esc(step.action)}</h3><p>${esc(step.handoff)}</p><button class="text-button" data-start="${esc(s.id)}">Abrir etapa</button></div></li>`;
        })
        .join(
          "",
        )}</ol><div class="journey-actions"><button class="btn secondary" data-save-journey="${j.id}">${deck.journeys.includes(j.id) ? "Jornada no meu Deck" : "Adicionar ao meu Deck"}</button><button class="text-button" data-export-journey="${j.id}">Baixar roteiro</button></div></article>`;
    })
    .join("");
}
function setView(next) {
  if (!["discover", "deck", "journeys"].includes(next)) return;
  view = next;
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
  $("#find-skills").textContent = "Encontrar minha skill ↗";
  render();
  renderDeck();
  renderJourneys();
  try {
    localStorage.setItem("drivedata-audience", next);
  } catch {}
}
const list = (items) =>
  `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
function overview(s) {
  return `<p class="detail-pain">${esc(s.pain)}</p><h3>${audience === "technical" ? "Entregas e escopo" : "O que você pode produzir"}</h3>${list(s.deliverables)}<h3>O que você precisa ter</h3>${list(s.dependencies)}<div class="detail-primary"><button class="btn" data-detail-tab="start">Começar com esta skill ↗</button><button class="text-button" data-download="${esc(s.id)}">Baixar ZIP direto</button></div><p class="fine">Downloads liberados na demo. O pacote será usado no seu assistente.</p>`;
}
function exampleView(s) {
  if (!s.example)
    return `<div class="empty"><h3>Monte seu primeiro teste.</h3><p>Esta carta ainda não tem um exemplo reproduzível. Use uma amostra pequena e confira os critérios abaixo antes de aplicar a dados reais.</p>${list(s.acceptance)}<button class="btn" data-detail-tab="start">Abrir primeiro uso</button></div>`;
  const x = s.example;
  return `<div class="example-intro"><span class="quality-badge">Dados fictícios · referência conferida</span><h3>${esc(x.title)}</h3><p>${esc(x.before)}</p></div><div class="sample-columns"><section><h4>Entrada</h4><pre>${esc(JSON.stringify(x.input, null, 2))}</pre></section><section><h4>Resultado de referência</h4><p>${esc(x.expected)}</p><details><summary>Inspecionar o resultado completo</summary><pre>${esc(JSON.stringify(x.result, null, 2))}</pre></details></section></div><h4>Peça assim ao seu assistente</h4><pre class="prompt-block">${esc("Use a skill " + s.id + ". " + x.task)}</pre><div class="sample-actions"><button class="btn secondary" data-copy-example="${s.id}">Copiar comando do exemplo</button><button class="text-button" data-sample="${s.id}">Baixar dados de exemplo</button></div><h4>Como conferir</h4>${list(x.checks)}<p class="scope-note">${esc(x.limitation)} ${esc(x.verification)}</p><button class="btn" data-detail-tab="start">Usar esta skill no meu ambiente</button>`;
}
function technical(s) {
  return `<dl class="spec-sheet"><div><dt>Identificador</dt><dd>${esc(s.code)} / ${esc(s.id)}</dd></div><div><dt>Versão</dt><dd>${esc(s.version)} · ${esc(s.release.date)}</dd></div><div><dt>Pacote</dt><dd>${s.release.fileCount} arquivos · ${(s.release.bytes / 1024).toFixed(1)} KB</dd></div><div><dt>Formato</dt><dd>${esc(s.compatibility.format)}</dd></div><div><dt>Execução</dt><dd>${esc(s.compatibility.execution)}</dd></div><div><dt>Ferramentas citadas</dt><dd>${esc(s.compatibility.tools.join(", ") || "Confira os requisitos da skill")}</dd></div><div><dt>Integridade SHA-256</dt><dd class="digest">${esc(s.release.sha256)}</dd></div></dl><details class="release-notes"><summary>O que mudou nesta versão</summary>${s.changelog.map((c) => `<h4>v${esc(c.version)}</h4>${list(c.changes)}`).join("")}</details><details class="release-notes"><summary>Origem, compatibilidade e condições de distribuição</summary><p>${esc(s.release.license)}. A revisão técnica não libera distribuição comercial. Atribuições e termos originais estão no ZIP.</p><p>${s.release.normalizedFiles} arquivos de documentação tiveram caminhos pessoais substituídos por marcadores. Scripts e integrações ainda precisam ser conferidos no ambiente de destino.</p><p>O formato foi revisado; ferramentas específicas de Claude, Figma, Office ou outros serviços não são instaladas pelo pacote.</p></details>`;
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
    content = `<h3>Baixe e instale a pasta da skill.</h3><ol><li>Baixe o ZIP e extraia os arquivos.</li><li>Localize a pasta <code>${esc(s.id)}</code>.</li><li>Copie a pasta completa para <code>${esc(folder)}</code>. Preserve uma cópia da versão anterior, se houver.</li><li>Abra um novo chat e confira se a skill foi reconhecida.</li></ol><button class="btn secondary" data-download="${s.id}">Baixar v${s.version} ↓</button><label class="check-line"><input id="installed-check" type="checkbox" ${p.installed ? "checked" : ""}>Já extraí, copiei a pasta e conferi o reconhecimento.</label><button class="btn" id="next-prompt">Preparar meu comando</button>`;
  if (wizardStep === 2)
    content = `<h3>Leve um comando claro.</h3><p>Substitua os campos entre colchetes pelos seus dados. Anexe apenas arquivos autorizados no assistente escolhido.</p><pre class="prompt-block" id="first-prompt">${esc(s.firstPrompt)}</pre><button class="btn" id="copy-prompt">${p.promptCopied ? "Copiar novamente" : "Copiar primeiro comando"}</button><p class="fine">A execução acontece no seu assistente. O site não envia seus arquivos ou executa a skill.</p><button class="text-button" data-wizard-step="3">Já executei; quero conferir o resultado</button>`;
  if (wizardStep === 3)
    content = `<h3>Confira antes de considerar pronto.</h3><p>Registre sua própria conferência. Isso não altera o selo de homologação da skill.</p>${(s.example ? s.example.checks : s.acceptance).map((c, i) => `<label class="check-line"><input class="result-check" type="checkbox" ${p.tested ? "checked" : ""}>${esc(c)}</label>`).join("")}<button class="btn" id="mark-tested">${p.tested ? "Atualizar minha conferência" : "Marcar como conferido por mim"}</button><p class="fine">Se algo falhou, volte ao comando e informe a diferença entre o esperado e o observado.</p><button class="text-button" data-wizard-step="2">Rever meu comando</button>`;
  return `<div class="wizard"><ol class="wizard-steps">${["Ambiente", "Instalação", "Primeiro comando", "Conferência"].map((x, i) => `<li><button data-wizard-step="${i}" aria-current="${wizardStep === i ? "step" : "false"}"><span>${i + 1}</span>${x}</button></li>`).join("")}</ol><div class="wizard-body">${content}</div></div>`;
}
function renderDetail() {
  const s = selected;
  if (!s) return;
  $("#skill-detail").innerHTML =
    `<div class="detail-layout"><aside class="detail-card">${DeckArt.card(s, { spin: !matchMedia("(prefers-reduced-motion: reduce)").matches })}<div class="detail-controls"><button class="text-button" id="turn-card" aria-pressed="false">Ver verso</button><button class="text-button" id="spin-card" aria-pressed="true">Pausar giro</button></div><button class="save-detail" data-favorite="${s.id}" aria-pressed="${favorite(s.id)}">${favorite(s.id) ? "♥ Salva no Meu Deck" : "♡ Salvar no Meu Deck"}</button><span class="quality-badge">${esc(badge(s))}</span></aside><div class="detail-content"><p class="code">${esc(s.code)} · v${s.version} · ${esc(s.category)}</p><h2 id="detail-title">${esc(s.title)}</h2><div class="detail-tabs" aria-label="Detalhes da skill">${[
      ["overview", "Visão geral"],
      ["example", s.example ? "Ver exemplo" : "Como conferir"],
      ["start", "Primeiro uso"],
      ["technical", "Ficha técnica"],
    ]
      .map(
        ([id, label]) =>
          `<button data-detail-tab="${id}" aria-pressed="${detailTab === id}">${label}</button>`,
      )
      .join(
        "",
      )}</div><div class="detail-tab-body">${detailTab === "overview" ? overview(s) : detailTab === "example" ? exampleView(s) : detailTab === "technical" ? technical(s) : wizard(s)}</div><p id="download-status" class="download-status" role="status"></p></div></div>`;
  DeckArt.tilt($("#skill-detail"));
  $("#turn-card").onclick = () => {
    const c = $("#skill-detail .holo-card");
    c.classList.remove("is-spinning");
    const on = c.classList.toggle("flipped");
    $("#turn-card").textContent = on ? "Ver frente" : "Ver verso";
    $("#turn-card").setAttribute("aria-pressed", on);
    $("#spin-card").textContent = "Ativar giro";
    $("#spin-card").setAttribute("aria-pressed", "false");
  };
  $("#spin-card").onclick = () => {
    const c = $("#skill-detail .holo-card");
    c.classList.remove("flipped");
    const on = c.classList.toggle("is-spinning");
    $("#spin-card").textContent = on ? "Pausar giro" : "Ativar giro";
    $("#spin-card").setAttribute("aria-pressed", on);
    $("#turn-card").textContent = "Ver verso";
    $("#turn-card").setAttribute("aria-pressed", "false");
  };
}
function openSkill(id, tab) {
  const s = byId(id);
  if (!s) return;
  selected = s;
  detailTab = tab || (s.example ? "example" : "overview");
  wizardStep = 0;
  renderDetail();
  if (!$("#skill-dialog").open) $("#skill-dialog").showModal();
  $("#skill-dialog").scrollTop = 0;
  DeckSound.play("reveal");
}
function toggleFavorite(id) {
  deck.favorites = favorite(id)
    ? deck.favorites.filter((x) => x !== id)
    : [...deck.favorites, id];
  save();
  render();
  renderDeck();
  if (selected?.id === id)
    document.querySelectorAll(`[data-favorite="${id}"]`).forEach((b) => {
      b.setAttribute("aria-pressed", favorite(id));
      if (b.classList.contains("save-detail"))
        b.textContent = favorite(id)
          ? "♥ Salva no Meu Deck"
          : "♡ Salvar no Meu Deck";
    });
  toast(
    favorite(id) ? "Carta salva no Meu Deck." : "Carta removida dos favoritos.",
  );
  DeckSound.play("save");
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
async function download(id, button) {
  if (button.disabled) return;
  const label = button.innerHTML;
  button.disabled = true;
  button.textContent = "Verificando pacote…";
  const s = byId(id);
  try {
    const r = await fetch("/api/download?id=" + encodeURIComponent(id), {
      signal: AbortSignal.timeout(30000),
    });
    if (r.status === 401) {
      location.assign("/login");
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
    deck.downloads.push({
      id,
      version: s.version,
      at: new Date().toISOString(),
    });
    deck.downloads = deck.downloads.slice(-300);
    save();
    renderDeck();
    if ($("#download-status"))
      $("#download-status").textContent =
        "Pacote íntegro baixado. Continue pelo Primeiro uso.";
    toast("ZIP conferido e baixado. O histórico está no Meu Deck.");
    DeckSound.play("save");
  } catch (e) {
    const message =
      e.name === "TimeoutError"
        ? "O download demorou. Tente novamente."
        : e.message;
    if ($("#download-status")) $("#download-status").textContent = message;
    toast(message);
  } finally {
    button.disabled = false;
    button.innerHTML = label;
  }
}
async function find() {
  const problem = $("#problem").value.trim();
  if (problem.length < 12) {
    $("#finder-error").textContent =
      "Descreva a tarefa com pelo menos 12 caracteres.";
    return;
  }
  const version = ++requestVersion;
  $("#finder-error").textContent = "";
  $("#find-skills").disabled = true;
  $("#find-skills").textContent = "Comparando capacidades…";
  try {
    const result = await api("/api/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problem,
        audience,
        refinement,
        useAI: $("#use-ai").checked,
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (version !== requestVersion) return;
    $("#matches").hidden = false;
    $("#match-summary").textContent =
      result.summary +
      (result.mode === "ai"
        ? " Indicação assistida por IA."
        : " Correspondência pelo catálogo.") +
      (result.notice ? " " + result.notice : "");
    $("#clarification").hidden = !result.clarification;
    $("#clarification").innerHTML = result.clarification
      ? `<h3>${esc(result.clarification.question)}</h3><div>${result.clarification.options.map((o) => `<button class="btn secondary" data-refine="${esc(o.id)}" data-question="${esc(result.clarification.id)}">${esc(o.label)}</button>`).join("")}</div>`
      : "";
    $("#match-grid").innerHTML = result.matches
      .map((m, i) => {
        const s = byId(m.id);
        return s
          ? `<article class="match-item"><p class="mini-heading">${esc(s.code)} / ${i === 0 ? "Comece por aqui" : "Também pode ajudar"}</p><h3>${esc(s.title)}</h3><p>${esc(m.reason)}</p><p class="fine">${esc(m.nextStep)}</p><span class="quality-badge">${esc(badge(s))}</span><div class="match-actions"><button class="btn" data-start="${s.id}">Começar</button><button class="btn secondary" data-open="${s.id}">${s.example ? "Ver exemplo" : "Ver carta"}</button></div></article>`
          : "";
      })
      .join("");
    $("#matches-title").focus();
    $("#matches").scrollIntoView({ block: "start" });
  } catch (e) {
    $("#finder-error").textContent =
      e.name === "TimeoutError"
        ? "A análise demorou. Tente novamente."
        : e.message;
  } finally {
    if (version === requestVersion) {
      $("#find-skills").disabled = false;
      $("#find-skills").textContent = "Encontrar minha skill ↗";
    }
  }
}
document.addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.view) setView(b.dataset.view);
  if (b.dataset.audience) setAudience(b.dataset.audience);
  if (b.dataset.open) openSkill(b.dataset.open);
  if (b.dataset.start) openSkill(b.dataset.start, "start");
  if (b.dataset.favorite) toggleFavorite(b.dataset.favorite);
  if (b.dataset.download) download(b.dataset.download, b);
  if (b.dataset.example) {
    $("#problem").value = b.dataset.example;
    refinement = null;
    find();
  }
  if (b.dataset.refine) {
    refinement = { questionId: b.dataset.question, optionId: b.dataset.refine };
    find();
  }
  if (b.dataset.detailTab) {
    detailTab = b.dataset.detailTab;
    renderDetail();
    $("#skill-dialog").scrollTop = 0;
  }
  if (b.dataset.wizardStep !== undefined) {
    wizardStep = Number(b.dataset.wizardStep);
    renderDetail();
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
    renderDetail();
  }
  if (b.id === "copy-prompt") {
    if (await copy(selected.firstPrompt)) {
      persistProgress(selected.id, { promptCopied: true });
      b.textContent = "Copiar novamente";
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
    deck.favorites = [...new Set([...deck.favorites, selected.id])];
    save();
    renderDeck();
    renderJourneys();
    toast("Sua conferência foi registrada no Meu Deck.");
    b.textContent = "Conferido por você ✓";
  }
  if (b.dataset.copyExample) {
    const s = byId(b.dataset.copyExample);
    await copy("Use a skill " + s.id + ". " + s.example.task);
  }
  if (b.dataset.sample) {
    const s = byId(b.dataset.sample);
    saveFile(
      s.code + "-exemplo.json",
      JSON.stringify(
        {
          notice: "Dados fictícios de demonstração",
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
    deck.favorites = [
      ...new Set([...deck.favorites, ...j.steps.map((s) => s.id)]),
    ];
    save();
    renderJourneys();
    render();
    toast("As cartas da jornada estão no seu Deck.");
  }
  if (b.dataset.exportJourney) {
    const j = journeys.find((j) => j.id === b.dataset.exportJourney);
    saveFile(
      "DriveData-" + j.id + ".md",
      `# ${j.title}\n\n${j.description}\n\n` +
        j.steps
          .map(
            (step, i) =>
              `## ${i + 1}. ${step.action}\n\nSkill: ${step.id}\n\nEntrega para a próxima etapa: ${step.handoff}\n\n${byId(step.id).firstPrompt}\n`,
          )
          .join("\n"),
      "text/markdown",
    );
  }
});
$("#close-detail").onclick = () => $("#skill-dialog").close();
$("#skill-dialog").addEventListener("close", () => {
  selected = null;
  render();
  if (view === "deck") renderDeck();
});
$("#finder").onsubmit = (e) => {
  e.preventDefault();
  find();
};
$("#problem").oninput = () => {
  refinement = null;
  ++requestVersion;
  $("#find-skills").disabled = false;
  $("#find-skills").textContent = "Encontrar minha skill ↗";
  $("#matches").hidden = true;
};
for (const id of ["group", "role", "examples-only", "show-all", "sort"])
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
  $("#find-skills").textContent = "Encontrar minha skill ↗";
  $("#problem").focus();
};
$("#market-sound").onclick = () => {
  DeckSound.set(!DeckSound.enabled);
  $("#market-sound").textContent = DeckSound.enabled
    ? "Som ativado"
    : "Som desativado";
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
        favorites: [...deck.favorites, ...incoming.favorites],
        journeys: [...deck.journeys, ...incoming.journeys],
        progress: { ...deck.progress, ...incoming.progress },
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
  } catch (error) {
    toast(
      error instanceof SyntaxError
        ? "Arquivo JSON inválido. Exporte um Deck pelo site."
        : error.message,
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
    location.assign("/login");
  } catch {
    toast("Não foi possível sair. Tente novamente.");
  }
};
(async () => {
  try {
    const data = await api("/api/catalog");
    skills = data.skills;
    journeys = data.journeys;
    deck = DeckStore.load(
      deckStorage,
      skills.map((s) => s.id),
      journeys.map((j) => j.id),
    );
    save();
    $("#group").insertAdjacentHTML(
      "beforeend",
      [...new Set(skills.map((s) => s.category))]
        .sort()
        .map((g) => `<option value="${esc(g)}">${esc(g)}</option>`)
        .join(""),
    );
    try {
      audience =
        localStorage.getItem("drivedata-audience") === "technical"
          ? "technical"
          : "business";
    } catch {}
    setAudience(audience);
    $("#market-sound").textContent = DeckSound.enabled
      ? "Som ativado"
      : "Som desativado";
    $("#market-sound").setAttribute("aria-pressed", DeckSound.enabled);
    const status = await api("/api/status");
    $("#ai-choice").hidden = !status.aiConfigured;
  } catch (e) {
    $("#load-error").textContent = e.message;
  }
})();
