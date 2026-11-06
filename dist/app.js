"use strict";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const state = {
  audience: "business",
  category: "all",
  query: "",
  selected: new Set(),
  step: 1,
  triage: {
    pain: "",
    area: "",
    systems: "",
    impact: "",
    urgency: "Explorando possibilidades",
    size: "",
    budget: "",
  },
};
const category = (id) => CATEGORIES.find((c) => c.id === id);
const title = (s) => (state.audience === "technical" ? s.tech : s.title);
let toastTimer;
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 2600);
}
function openDialog(id) {
  $$("dialog[open]").forEach((d) => d.close());
  $(id).showModal();
}
function updateCount() {
  $("#count").textContent = state.selected.size;
}
function toggleSolution(id) {
  if (state.selected.has(id)) {
    state.selected.delete(id);
    toast("Solução removida do briefing.");
  } else {
    state.selected.add(id);
    toast("Solução adicionada ao seu briefing.");
  }
  updateCount();
  renderCatalog();
  return state.selected.has(id);
}
function renderCategories() {
  const relevant = SOLUTIONS.filter(
    (s) => state.audience === "technical" || s.audience !== "technical",
  );
  $("#categories").innerHTML = [
    { id: "all", name: "Todas as soluções" },
    ...CATEGORIES,
  ]
    .map(
      (c) =>
        `<button data-category="${c.id}" class="${state.category === c.id ? "active" : ""}" aria-pressed="${state.category === c.id}"><span class="category-name">${esc(c.name)}</span><small>${c.id === "all" ? relevant.length : relevant.filter((s) => s.category === c.id).length}</small></button>`,
    )
    .join("");
}
function renderCatalog() {
  renderCategories();
  const terms = normalize(state.query).split(/\s+/).filter(Boolean);
  const filtered = SOLUTIONS.filter(
    (s) =>
      (state.audience === "technical" || s.audience !== "technical") &&
      (state.category === "all" || s.category === state.category) &&
      terms.every((t) =>
        normalize(
          [s.title, s.tech, s.summary, s.pain, ...s.tags, ...s.keywords].join(
            " ",
          ),
        ).includes(t),
      ),
  );
  $("#result-count").textContent =
    `${filtered.length} ${filtered.length === 1 ? "solução" : "soluções"}`;
  $("#active-filter").textContent =
    state.category === "all" ? "" : category(state.category).description;
  $("#cards").innerHTML = filtered
    .map(
      (s) =>
        `<article class="card"><div class="card-top"><span class="card-index mono">${String(SOLUTIONS.indexOf(s) + 1).padStart(2, "0")} /</span><span class="card-category mono">${esc(category(s.category).short)}</span></div><h3>${esc(title(s))}</h3><p>${esc(s.summary)}</p><div class="tags">${s.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div><div class="card-foot"><button class="details" data-detail="${s.id}">Conhecer solução <span aria-hidden="true">↗</span></button><button class="add" data-add="${s.id}" aria-pressed="${state.selected.has(s.id)}" aria-label="${state.selected.has(s.id) ? "Remover" : "Adicionar"} ${esc(title(s))} ${state.selected.has(s.id) ? "do" : "ao"} briefing">${state.selected.has(s.id) ? "✓" : "+"}</button></div></article>`,
    )
    .join("");
  $("#empty").hidden = filtered.length > 0;
  $("#catalog-subtitle").innerHTML =
    state.audience === "technical"
      ? "Capacidades para implementar,<br>integrar e evoluir seu produto."
      : "Soluções organizadas pelo que<br>elas podem fazer por você.";
}
function setAudience(a) {
  state.audience = a;
  $$("[data-audience]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.audience === a)),
  );
  $("#quick-pain").placeholder =
    a === "technical"
      ? "Ex.: preciso integrar meu SaaS ao Asaas e tratar webhooks de assinatura..."
      : "Ex.: minha equipe perde horas consolidando planilhas para fechar o mês...";
  renderCatalog();
}
function showDetail(id) {
  const s = SOLUTIONS.find((s) => s.id === id);
  if (!s) return;
  $("#detail-body").innerHTML =
    `<div class="detail-top mono">${esc(category(s.category).name)}</div><h2 id="detail-title">${esc(title(s))}</h2><p>${esc(s.summary)}</p><div class="scope-note"><p><strong>Este pode ser seu cenário</strong><br>${esc(s.pain)}</p></div><div class="detail-columns"><section><h3>O que pode ser entregue</h3><ul>${s.deliverables.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section><section><h3>O que precisamos entender</h3><ul>${s.needs.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section></div><div class="tags">${s.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>${state.audience === "technical" ? `<details class="technical-detail"><summary>Capacidades relacionadas (${s.skills.length})</summary><ul>${s.skills.map((t) => `<li>${esc(t)}</li>`).join("")}</ul><p class="fine">Referências de implementação. Ferramentas e integrações precisam ser validadas no ambiente do projeto.</p></details>` : ""}<div class="dialog-actions"><button class="btn primary" id="detail-add">${state.selected.has(s.id) ? "Remover do briefing" : "Adicionar ao briefing"} ${state.selected.has(s.id) ? "−" : "+"}</button><button class="text-link" id="detail-triage">Explorar meu cenário ↗</button></div><p class="fine" style="margin-top:22px">Escopo sob consulta. Preços, prazos e viabilidade definidos após avaliação.</p>`;
  $("#detail-add").onclick = () => {
    const chosen = toggleSolution(s.id);
    $("#detail-add").textContent = chosen
      ? "Remover do briefing −"
      : "Adicionar ao briefing +";
  };
  $("#detail-triage").onclick = () => {
    state.triage.area = s.category;
    startTriage();
  };
  openDialog("#detail-dialog");
}
function startTriage(pain) {
  if (typeof pain === "string" && pain.trim()) state.triage.pain = pain.trim();
  state.aiResult = null;
  state.step = 1;
  renderTriage();
  openDialog("#triage-dialog");
}
function progress() {
  return `<div class="progress" aria-label="Etapa ${state.step} de 3">${[1, 2, 3].map((n) => `<span class="${n <= state.step ? "done" : ""}"></span>`).join("")}</div>`;
}
function areaOptions() {
  return `<option value="">Ainda não sei</option>${CATEGORIES.map((c) => `<option value="${c.id}" ${state.triage.area === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}`;
}
function inputField(id, label, value, placeholder = "", max = 200) {
  return `<div class="field"><label for="${id}">${label}</label><input id="${id}" maxlength="${max}" value="${esc(value)}" placeholder="${esc(placeholder)}"></div>`;
}
function renderTriage() {
  const t = state.triage;
  if (state.step === 1) {
    $("#triage-body").innerHTML =
      progress() +
      `<h2 id="triage-title">O que você quer destravar?</h2><p>Descreva o problema com suas palavras. Não é preciso saber qual tecnologia usar.</p><form id="triage-step-one"><div class="field"><span class="label">Você está buscando uma solução para</span><div class="choices"><button type="button" data-role="business" aria-pressed="${state.audience === "business"}">Minha empresa</button><button type="button" data-role="technical" aria-pressed="${state.audience === "technical"}">Minha equipe técnica</button></div></div><div class="field"><label for="triage-pain">Qual é o desafio? <span aria-hidden="true">*</span></label><textarea id="triage-pain" required minlength="20" maxlength="2000" placeholder="O que acontece hoje, quem é afetado e o que você gostaria de mudar?">${esc(t.pain)}</textarea><p class="hint">Mínimo de 20 caracteres. Evite senhas e dados sensíveis.</p></div><div class="field"><label for="triage-area">Qual área parece mais próxima?</label><select id="triage-area">${areaOptions()}</select></div><div class="validation" id="triage-error" role="alert"></div><div class="dialog-actions"><span class="fine">01 / Contexto</span><button class="btn primary" type="submit">Continuar →</button></div></form>`;
    $("#triage-pain").oninput = (e) => {
      t.pain = e.target.value;
    };
    $("#triage-area").onchange = (e) => {
      t.area = e.target.value;
    };
    $$("[data-role]").forEach(
      (b) =>
        (b.onclick = () => {
          setAudience(b.dataset.role);
          $$("[data-role]").forEach((x) =>
            x.setAttribute("aria-pressed", String(x === b)),
          );
        }),
    );
    $("#triage-step-one").onsubmit = (e) => {
      e.preventDefault();
      t.pain = $("#triage-pain").value.trim();
      if (t.pain.length < 20) {
        $("#triage-error").textContent =
          "Conte um pouco mais sobre o cenário (pelo menos 20 caracteres).";
        $("#triage-pain").focus();
        return;
      }
      state.step = 2;
      renderTriage();
    };
  } else if (state.step === 2) {
    $("#triage-body").innerHTML =
      progress() +
      `<h2 id="triage-title">Um pouco mais de contexto.</h2><p>Esses detalhes ajudam a preparar a conversa de escopo. Preencha o que já souber.</p><form id="triage-step-two">${inputField("triage-systems", "Quais ferramentas ou sistemas vocês usam?", t.systems, "Ex.: Excel, Power BI, Protheus, CRM", 300)}${inputField("triage-impact", "O que mudaria se esse problema fosse resolvido?", t.impact, "Ex.: fechar o relatório sem consolidar cinco arquivos", 500)}<div class="field-grid"><div class="field"><label for="triage-urgency">Momento do projeto</label><select id="triage-urgency">${["Explorando possibilidades", "Quero começar neste mês", "Planejando os próximos 3 meses", "Tenho um prazo a alinhar"].map((x) => `<option ${t.urgency === x ? "selected" : ""}>${esc(x)}</option>`).join("")}</select></div><div class="field"><label for="triage-size">Pessoas envolvidas</label><select id="triage-size">${["Ainda não sei", "1 a 5", "6 a 20", "21 a 100", "Mais de 100"].map((x) => `<option ${t.size === x ? "selected" : ""}>${x}</option>`).join("")}</select></div></div>${inputField("triage-budget", "Investimento previsto (opcional)", t.budget, "Pode informar uma faixa ou deixar para avaliar", 150)}<div class="dialog-actions"><button class="btn secondary" type="button" id="back-one">← Voltar</button><button class="btn primary" type="submit">Ver caminhos sugeridos ↗</button></div><p class="fine" style="margin-top:18px">Você poderá revisar as sugestões e escolher enviar ou baixar seu briefing.</p></form>`;
    const save = () => {
      t.systems = $("#triage-systems").value.trim();
      t.impact = $("#triage-impact").value.trim();
      t.urgency = $("#triage-urgency").value;
      t.size = $("#triage-size").value;
      t.budget = $("#triage-budget").value.trim();
    };
    $("#back-one").onclick = () => {
      save();
      state.step = 1;
      renderTriage();
    };
    $("#triage-step-two").onsubmit = (e) => {
      e.preventDefault();
      save();
      state.step = 3;
      renderTriage();
    };
  } else {
    const suggestions = state.aiResult
      ? state.aiResult.recommendations
          .map((r) => ({
            solution: SOLUTIONS.find((s) => s.id === r.solutionId),
            reason: r.reason,
            hits: [],
            area: false,
          }))
          .filter((r) => r.solution)
      : recommend({ ...t, audience: state.audience });
    $("#triage-body").innerHTML =
      progress() +
      `<h2 id="triage-title">${suggestions.length ? "Estes caminhos merecem uma conversa." : "Vamos entender melhor seu cenário."}</h2><p>${suggestions.length ? "Selecionamos soluções relacionadas ao que você descreveu. Adicione ao briefing as que fazem sentido para você." : "Não encontramos uma correspondência clara no catálogo. Seu contexto pode ser levado para uma avaliação de escopo."}</p><p class="fine">${state.aiResult?.mode === "ai" ? "Sugestão assistida por IA." : "Sugestão por temas do catálogo."} Sem avaliação de viabilidade. Não representa orçamento ou diagnóstico concluído.${state.aiResult?.notice ? " " + esc(state.aiResult.notice) : ""}</p>${suggestions.map((r, i) => `<article class="recommendation"><div class="mono">${String(i + 1).padStart(2, "0")} / ${esc(category(r.solution.category).name)}</div><h3>${esc(title(r.solution))}</h3><p>${esc(r.solution.summary)}</p><p><strong>Por que apareceu:</strong> ${r.reason ? esc(r.reason) : ""}${r.area ? "a área que você selecionou se relaciona a esta solução. " : ""}${r.hits.length ? "Seu texto menciona temas como " + esc(r.hits.slice(0, 3).join(", ")) + "." : ""}</p><div class="rec-foot"><button class="text-link" data-rec-detail="${r.solution.id}">Ver entregas e requisitos</button><button class="btn ${state.selected.has(r.solution.id) ? "secondary" : "primary"}" data-rec-add="${r.solution.id}">${state.selected.has(r.solution.id) ? "Adicionado ✓" : "Adicionar ao briefing +"}</button></div><div id="rec-detail-${r.solution.id}" hidden><h3>Entregas possíveis</h3><ul>${r.solution.deliverables.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><h3>Para avaliar</h3><ul>${r.solution.needs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></article>`).join("")}<div class="dialog-actions"><button class="btn secondary" id="back-two">← Ajustar contexto</button><button class="btn primary" id="finish-triage">Ver meu briefing ↗</button></div>`;
    $$("[data-rec-add]").forEach(
      (b) =>
        (b.onclick = () => {
          toggleSolution(b.dataset.recAdd);
          renderTriage();
        }),
    );
    $$("[data-rec-detail]").forEach(
      (b) =>
        (b.onclick = () => {
          const el = $("#rec-detail-" + b.dataset.recDetail);
          el.hidden = !el.hidden;
          b.textContent = el.hidden
            ? "Ver entregas e requisitos"
            : "Ocultar entregas e requisitos";
          b.setAttribute("aria-expanded", String(!el.hidden));
        }),
    );
    $("#back-two").onclick = () => {
      state.step = 2;
      renderTriage();
    };
    $("#finish-triage").onclick = showBrief;
  }
  $("#triage-dialog").scrollTop = 0;
  if ($("#triage-dialog").open) {
    $("#triage-title").tabIndex = -1;
    $("#triage-title").focus();
  }
}
function buildBrief() {
  const t = state.triage;
  const chosen = SOLUTIONS.filter((s) => state.selected.has(s.id));
  return [
    "DRIVEDATA | BRIEFING INICIAL",
    "Gerado em " + new Date().toLocaleDateString("pt-BR"),
    "Perfil: " +
      (state.audience === "technical" ? "Equipe técnica" : "Empresa"),
    "",
    "DESAFIO",
    t.pain || "A detalhar",
    "Área: " + (category(t.area)?.name || "A definir"),
    "Ferramentas: " + (t.systems || "A informar"),
    "Resultado desejado: " + (t.impact || "A informar"),
    "Momento: " + t.urgency,
    "Pessoas envolvidas: " + (t.size || "A informar"),
    "Investimento: " + (t.budget || "A avaliar"),
    "",
    "SOLUÇÕES DE INTERESSE",
    ...(chosen.length
      ? chosen.flatMap((s) => [
          s.title,
          "Capacidade: " + s.tech,
          "Possíveis entregas: " + s.deliverables.join("; "),
          "Para avaliar: " + s.needs.join("; "),
          "",
        ])
      : ["Nenhuma selecionada. Avaliar o contexto com a equipe."]),
    "PRÓXIMO PASSO",
    "Validar necessidade, fontes, acessos e critérios de aceite com a equipe comercial. Confirmar viabilidade, escopo, prazo, preço e responsáveis antes da contratação.",
    "",
    "Este briefing é exploratório. Não é orçamento, proposta ou confirmação de execução. O download não envia este documento. O envio pelo site é confirmado separadamente com um protocolo.",
  ].join("\n");
}
function showBrief() {
  const t = state.triage,
    chosen = SOLUTIONS.filter((s) => state.selected.has(s.id));
  $("#brief-body").innerHTML =
    `<div class="dialog-kicker mono">Seu ponto de partida</div><h2 id="brief-title">Vamos organizar o próximo passo.</h2><p>Um resumo do que você precisa e das soluções que deseja explorar.</p>${t.pain ? `<div class="brief-context"><p><strong>Seu desafio</strong></p><p>${esc(t.pain)}</p><p class="fine">${esc(t.systems || "Ferramentas a informar")} · ${esc(t.urgency)}</p>${t.impact ? `<p class="fine">Resultado desejado: ${esc(t.impact)}</p>` : ""}<p class="fine">Área: ${esc(category(t.area)?.name || "A definir")} · Pessoas: ${esc(t.size || "A informar")}</p><p class="fine">Investimento: ${esc(t.budget || "A avaliar")}</p></div>` : '<div class="brief-context"><p>Seu desafio ainda não foi descrito.</p><button class="text-link" id="brief-start">Completar minha triagem ↗</button></div>'}<h3>Soluções de interesse (${chosen.length})</h3>${chosen.length ? chosen.map((s) => `<div class="brief-item"><div><strong>${esc(title(s))}</strong><small>${esc(category(s.category).name)}</small></div><button data-remove="${s.id}" aria-label="Remover ${esc(title(s))}">Remover</button></div>`).join("") : "<p>Nenhuma solução selecionada. Você pode explorar o catálogo ou baixar apenas o contexto da sua necessidade.</p>"}<h3>Na conversa de escopo</h3><p>Vamos precisar validar fontes, acessos, entregas esperadas e critérios de aceite. O orçamento depende dessa avaliação.</p><div class="dialog-actions"><button class="btn primary" id="download-brief" ${!chosen.length && !t.pain ? "disabled" : ""}>Baixar briefing ↓</button><button class="btn secondary" id="print-brief" ${!chosen.length && !t.pain ? "disabled" : ""}>Imprimir / PDF</button><button class="text-link" id="edit-brief">${t.pain ? "Editar contexto" : "Fazer triagem"}</button></div><p class="fine" style="margin-top:22px">Baixar ou imprimir não realiza envio. Para compartilhar com a DriveData, preencha o formulário abaixo. Dados ainda não enviados são apagados ao recarregar esta página.</p>`;
  $$("[data-remove]").forEach(
    (b) =>
      (b.onclick = () => {
        toggleSolution(b.dataset.remove);
        showBrief();
      }),
  );
  if ($("#brief-start")) $("#brief-start").onclick = () => startTriage();
  $("#edit-brief").onclick = () => startTriage();
  $("#download-brief").onclick = () =>
    download(
      "DriveData-briefing.txt",
      buildBrief(),
      "text/plain;charset=utf-8",
    );
  $("#print-brief").onclick = () => window.print();
  openDialog("#brief-dialog");
}
function download(name, text, type) {
  const url = URL.createObjectURL(new Blob(["\ufeff" + text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Briefing gerado. Confira os downloads do navegador.");
}
$$("[data-close]").forEach(
  (b) => (b.onclick = () => b.closest("dialog").close()),
);
$$("dialog").forEach((d) =>
  d.addEventListener("click", (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        d.close();
    }
  }),
);
$$("[data-start]").forEach(
  (b) => (b.onclick = () => startTriage($("#quick-pain").value)),
);
$$("[data-audience]").forEach(
  (b) => (b.onclick = () => setAudience(b.dataset.audience)),
);
$$("[data-example]").forEach(
  (b) =>
    (b.onclick = () => {
      $("#quick-pain").value = b.dataset.example;
      startTriage(b.dataset.example);
    }),
);
$("#quick-form").onsubmit = (e) => {
  e.preventDefault();
  startTriage($("#quick-pain").value);
};
$("#categories").onclick = (e) => {
  const b = e.target.closest("[data-category]");
  if (b) {
    state.category = b.dataset.category;
    renderCatalog();
  }
};
$("#cards").onclick = (e) => {
  const d = e.target.closest("[data-detail]"),
    a = e.target.closest("[data-add]");
  if (d) showDetail(d.dataset.detail);
  if (a) {
    const id = a.dataset.add;
    toggleSolution(id);
    $(`[data-add="${id}"]`)?.focus();
  }
};
$("#search").oninput = (e) => {
  state.query = e.target.value;
  renderCatalog();
};
$("#clear-search").onclick = () => {
  state.query = "";
  state.category = "all";
  $("#search").value = "";
  renderCatalog();
  $("#search").focus();
};
$("#briefing-nav").onclick = showBrief;
$("#privacy").onclick = () => openDialog("#info-dialog");
$("#signal-bars").innerHTML = Array.from({ length: 161 }, (_, i) => {
  const x = (i - 80) / 80;
  const h = Math.round(
    12 + 60 * Math.pow(Math.abs(x), 1.1) + 32 * Math.pow(Math.sin(i * 1.81), 2),
  );
  return `<i style="height:${h}px"></i>`;
}).join("");
renderCatalog();
