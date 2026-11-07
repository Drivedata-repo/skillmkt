"use strict";
window.DeckWork = (() => {
  const $ = (s) => document.querySelector(s),
    t = (s, p) => DeckI18n.t(s, p),
    esc = DeckArt.esc;
  let ctx = null,
    packs = [],
    items = [],
    pendingDownloads = new Set(),
    notices = {};
  const state = () => ctx.deck().work;
  const active = () =>
    packs.find((p) => p.id === state().activePack) || packs[0];
  const current = () => state().packs[active().id] || DeckWorkStore.run();
  function persist() {
    ctx.save();
  }
  function updateRun(patch) {
    const id = active().id;
    state().packs[id] = { ...DeckWorkStore.touch(current()), ...patch };
    persist();
  }
  function setNotice(value, id = active().id) {
    notices[id] = value;
  }
  function criteria(p, r) {
    if (r.context !== "own")
      return p.sample.checks.map((c) => ({
        ...c,
        label:
          c.label +
          " — " +
          t("Esperado: {value}", {
            value: new Intl.NumberFormat(
              DeckI18n.intlLocale,
              c.id === "MarginPct"
                ? { style: "percent", maximumFractionDigits: 2 }
                : {},
            ).format(c.expected),
          }),
      }));
    return (
      p.id === "planilhas-confiaveis"
        ? [
            "Conferi contagens, chaves e duplicatas contra meus arquivos de origem.",
            "Conferi os totais e testei as fórmulas alterando uma entrada em uma cópia.",
            "O documento de conferência identifica resultados, exceções e verificações pendentes.",
          ]
        : [
            "Conferi granularidade, tipos, chaves e relações no meu modelo.",
            "Conferi medidas no total e em pelo menos dois filtros contra a fonte.",
            "A auditoria e o inventário documentam evidências, exceções e regras não avaliadas.",
          ]
    ).map((label, i) => ({ id: "own-" + i, label: t(label) }));
  }
  function adaptedStep(p, step, r) {
    if (r.context !== "own") return step;
    const instructions = {
      "planilhas-confiaveis:organize":
        "Identifique a granularidade e confirme a chave antes de tratar duplicatas. Preserve conflitos e proponha transformações M rastreáveis, informando quais foram realmente executadas.",
      "planilhas-confiaveis:calculate":
        "Confirme as regras de cálculo antes de criar a planilha. Separe entradas, fórmulas e resumo. Reconcilie os totais com a fonte e teste uma alteração em uma cópia com recálculo real.",
      "planilhas-confiaveis:document":
        "Documente a conferência da planilha: fontes, regras, resultados e pendências. Diferencie arquivo gerado, aberto, renderizado e recalculado. Não declare homologação sem aceite.",
      "power-bi-sob-controle:prepare":
        "Confirme granularidade, tipos, chaves e relações a partir do projeto fornecido. Preserve os registros e valores. Diferencie consultas propostas de atualizações realmente executadas.",
      "power-bi-sob-controle:model":
        "Confirme a definição das medidas e os filtros esperados. Revise relações e DAX, compare com a fonte no total e em dois contextos e registre o comportamento sem dados. Não estime ganho de desempenho sem medição.",
      "power-bi-sob-controle:audit":
        "Revise as regras aplicáveis à versão do projeto. Registre achados, localização, evidências, exceções e regras não avaliadas. Proponha correções preservando as definições e os resultados conferidos.",
      "power-bi-sob-controle:document":
        "Documente tabelas, colunas, relações e medidas do projeto fornecido. Compare inventário extraído e documentado. Registre testes e pendências e informe abertura e inspeção do documento produzido.",
    };
    return {
      ...step,
      input: t(
        "Seus materiais e a entrega conferida da etapa anterior, quando houver.",
      ),
      output: t(
        "A entrega desta etapa, adaptada às regras confirmadas dos seus materiais.",
      ),
      checks: criteria(p, r).map((c) => c.label),
      prompt: [
        t("Use a skill {id} nos arquivos que eu fornecer.", {
          id: step.skillId,
        }),
        t(instructions[p.id + ":" + step.id]),
        t(
          "Peça os arquivos e as regras que estiverem faltando. Trabalhe em cópias. Não reutilize os valores, caminhos ou resultados da amostra fictícia. Registre evidência de cada verificação e separe o que não foi executado.",
        ),
      ].join("\n\n"),
    };
  }
  function file(name, content, mime = "text/plain") {
    const url = URL.createObjectURL(new Blob([content], { type: mime })),
      a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  function start(context, data) {
    ctx = context;
    packs = data.packs || [];
    items = data.skills;
    const params = new URL(location.href).searchParams;
    if (["explore", "work"].includes(params.get("mode")))
      state().mode = params.get("mode");
    if (packs.some((p) => p.id === params.get("pack"))) {
      state().activePack = params.get("pack");
      state().mode = "work";
    }
    applyMode();
    render();
  }
  function update(data) {
    packs = data.packs || packs;
    items = data.skills;
    render();
  }
  function applyMode(save = true) {
    const mode = state().mode;
    document.body.dataset.experience = mode;
    document
      .querySelectorAll("[data-experience]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.experience === mode)),
      );
    $("#work-space").hidden = mode !== "work";
    $("#explore-packs").hidden = mode !== "explore";
    const url = new URL(location.href);
    url.searchParams.set("mode", mode);
    if (mode === "work") url.searchParams.set("pack", state().activePack);
    else url.searchParams.delete("pack");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
    if (save) persist();
  }
  function switchMode(mode) {
    if (!ctx || !["explore", "work"].includes(mode)) return;
    state().mode = mode;
    applyMode();
    ctx.renderCollection();
    render();
    $("#experience-title")?.focus({ preventScroll: true });
  }
  function choose(id) {
    if (!packs.some((p) => p.id === id)) return;
    state().activePack = id;
    state().mode = "work";
    applyMode();
    ctx.setView("discover");
    ctx.renderCollection();
    render();
    $("#work-title")?.focus();
  }
  function packTile(p) {
    const count = p.steps.length;
    return `<article class="pack-tile"><div class="pack-number">${p.id === "planilhas-confiaveis" ? "01" : "02"}<span>${esc(t("Pacote gratuito"))}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.tagline)}</p><p class="pack-outcome"><span>${esc(t("Sua entrega"))}</span>${esc(p.outcome)}</p><div class="pack-signatures" aria-hidden="true">${p.steps
      .map((x) => {
        const s = items.find((s) => s.id === x.skillId);
        return `<span>${esc(s?.code || "")}</span>`;
      })
      .join(
        "",
      )}</div>${DeckCommerce.bundlePrice(p.pricing)}<button class="btn secondary" data-choose-pack="${p.id}">${esc(t("Abrir meu percurso"))}<span aria-hidden="true">↗</span></button><small>${esc(t("{count} especialidades em uma sequência", { count }))}</small></article>`;
  }
  function render() {
    if (!ctx || !packs.length) return;
    $("#pack-tiles").innerHTML = packs.map(packTile).join("");
    const p = active(),
      r = current(),
      stage = $("#work-stage"),
      same = stage.dataset.run === p.id + ":" + r.phase,
      opened = same
        ? [...stage.querySelectorAll("details")].map((d) => d.open)
        : [],
      focused =
        same && stage.contains(document.activeElement)
          ? document.activeElement
          : null,
      focusName = focused?.name,
      focusId = focused?.id;
    $("#work-title").textContent = p.title;
    $("#work-description").textContent = p.description;
    $("#work-bundle-price").innerHTML = DeckCommerce.bundlePrice(p.pricing);
    $("#work-pack-tabs").innerHTML = packs
      .map(
        (x) =>
          `<button data-choose-pack="${x.id}" aria-pressed="${x.id === p.id}">${esc(x.title)}</button>`,
      )
      .join("");
    $("#work-progress").innerHTML = [
      "Preparar",
      "Praticar",
      "Aplicar",
      "Conferir",
    ]
      .map(
        (label, i) =>
          `<li><button data-work-phase="${i}" aria-current="${r.phase === i ? "step" : "false"}"><span>${i + 1}</span>${esc(t(label))}</button></li>`,
      )
      .join("");
    $("#work-stage").innerHTML = [prepare, practice, execute, verify][r.phase](
      p,
      r,
    );
    stage.dataset.run = p.id + ":" + r.phase;
    stage
      .querySelectorAll("details")
      .forEach((d, i) => (d.open = opened[i] || false));
    if (focusName)
      stage
        .querySelector(`[name="${CSS.escape(focusName)}"]`)
        ?.focus({ preventScroll: true });
    else if (focusId)
      $("#" + CSS.escape(focusId))?.focus({ preventScroll: true });
    const notice = notices[p.id] || "";
    $("#work-status").textContent = t(notice);
    $("#work-return").textContent = r.startedAt
      ? t(
          r.completedAt
            ? "Percurso concluído por você. Você pode rever cada etapa ou iniciar outra tarefa."
            : "Seu percurso está salvo neste navegador. Continue de onde parou.",
        )
      : t(
          "Comece com a amostra. Depois, aplique o método aos seus próprios materiais.",
        );
    $("#work-status").hidden = !notice;
    $("#work-download-pack").disabled = pendingDownloads.has(p.id);
    $("#work-download-pack").textContent = t(
      pendingDownloads.has(p.id)
        ? "Conferindo pacote…"
        : "Baixar pacote completo",
    );
    $("#work-download-guide").textContent = t("Baixar meu roteiro");
    renderPilot();
    DeckI18n.apply($("#work-space"));
    DeckI18n.apply($("#explore-packs"));
  }
  function prepare(p, r) {
    const blocked = p.steps
      .map((x) => items.find((s) => s.id === x.skillId))
      .filter((s) => s?.compatibilityAssessment?.blocking);
    return `<div class="work-stage-head"><span>01</span><div><h3>${esc(t("Prepare o seu ambiente."))}</h3><p>${esc(p.outcome)}</p></div></div><label class="work-platform">${esc(t("Nesta tarefa vou usar"))}<select id="work-context">${[
      ["sample", "A amostra fictícia do pacote"],
      ["own", "Meus próprios materiais"],
    ]
      .map(
        ([id, label]) =>
          `<option value="${id}" ${r.context === id ? "selected" : ""}>${esc(t(label))}</option>`,
      )
      .join(
        "",
      )}</select></label><label class="work-platform">${esc(t("Meu assistente"))}<select id="work-platform">${[
      ["any", "Ainda não escolhi"],
      ["codex", "Codex"],
      ["claude", "Claude / Claude Code"],
      ["other", "Outro assistente"],
    ]
      .map(
        ([id, label]) =>
          `<option value="${id}" ${r.platform === id ? "selected" : ""}>${esc(t(label))}</option>`,
      )
      .join(
        "",
      )}</select></label><h4>${esc(t("Materiais e requisitos"))}</h4><ul>${p.requirements.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>${blocked.length ? `<p class="work-warning" role="status">${esc(t("Há ferramentas informadas como indisponíveis. Confira os requisitos destas cartas antes de executar."))} ${blocked.map((s) => esc(s.code)).join(", ")}</p>` : ""}<p class="fine">${esc(t("O pacote orienta seu assistente. A execução acontece no seu ambiente e depende das ferramentas disponíveis."))}</p><details><summary>${esc(t("Ver limites deste percurso"))}</summary><ul>${p.limitations.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details><div class="work-actions"><button class="btn" data-work-phase="1">${esc(t(r.context === "own" ? "Ver o exemplo antes de aplicar" : "Preparar minha amostra"))} ↗</button><button class="text-button" data-open-work-skill="${esc(p.steps[0].skillId)}">${esc(t("Ver como instalar a primeira skill"))}</button></div>`;
  }
  function practice(p, r) {
    const source = p.sample.input[0],
      ref = p.sample.reference[0];
    return `<div class="work-stage-head"><span>02</span><div><h3>${esc(t("Veja a entrada e uma saída de referência."))}</h3><p>${esc(p.sample.notice)}</p></div></div>${r.context === "own" ? `<p class="work-warning">${esc(t("Você escolheu seus próprios materiais. A amostra abaixo explica o método; seus comandos e critérios serão adaptados na próxima etapa."))}</p>` : ""}<div class="work-before-after"><section><h4>${esc(t("Entrada da amostra"))}</h4><pre>${esc(source?.content || "")}</pre>${p.sample.input.map((f, i) => `<button class="text-button" data-work-file="input:${i}">${esc(t("Baixar"))} ${esc(f.filename)}</button>`).join("")}</section><section><h4>${esc(t("Saída de referência"))}</h4><pre>${esc(ref?.content || "")}</pre>${p.sample.reference.map((f, i) => `<button class="text-button" data-work-file="reference:${i}">${esc(t("Baixar"))} ${esc(f.filename)}</button>`).join("")}</section></div><p class="fine">${esc(t("Esta comparação usa uma referência determinística. Ao executar, confira o arquivo produzido pelo seu assistente."))}</p><div class="work-actions"><button class="btn" data-work-phase="2">${esc(t("Executar a primeira tarefa"))} ↗</button><a class="text-button" href="${DeckI18n.url("/problemas/" + (p.id === "planilhas-confiaveis" ? "conferir-planilhas" : "conciliar-indicadores-power-bi") + "/" + (DeckI18n.locale === "pt" ? "" : DeckI18n.locale + "/"))}">${esc(t("Explorar a demonstração interativa"))}</a></div>`;
  }
  function execute(p, r) {
    return `<div class="work-stage-head"><span>03</span><div><h3>${esc(t("Leve uma etapa por vez ao seu assistente."))}</h3><p>${esc(t(r.context === "own" ? "Use cópias dos seus materiais. Confirme as regras e confira cada saída antes de continuar." : "Use os arquivos fictícios para praticar. Confira cada saída antes de continuar."))}</p></div></div><ol class="work-task-list">${p.steps
      .map((original, i) => {
        const step = adaptedStep(p, original, r);
        const s = items.find((s) => s.id === step.skillId),
          checked = r.checks.includes("step:" + step.id);
        return `<li><div class="work-task-id">${i + 1}<small>${esc(s?.code || "")}</small></div><div><h4>${esc(step.title)}</h4><dl><dt>${esc(t("Recebe"))}</dt><dd>${esc(step.input)}</dd><dt>${esc(t("Sua entrega"))}</dt><dd>${esc(step.output)}</dd></dl><details><summary>${esc(t("Ver comando e critérios"))}</summary><pre class="work-prompt">${esc(step.prompt)}</pre><ul>${step.checks.map((c) => `<li>${esc(typeof c === "string" ? c : c.label)}</li>`).join("")}</ul></details><div class="work-actions"><button class="btn secondary" data-work-prompt="${i}">${esc(t("Copiar comando desta etapa"))}</button><button class="text-button" data-open-work-skill="${esc(step.skillId)}">${esc(t("Instalação e ajuda"))}</button></div><label class="check-line"><input type="checkbox" data-work-check="step:${esc(step.id)}" ${checked ? "checked" : ""}>${esc(t("Executei esta etapa e conferi a entrega."))}</label></div></li>`;
      })
      .join(
        "",
      )}</ol><button class="btn" data-work-phase="3">${esc(t("Conferir meu resultado"))} ↗</button>`;
  }
  function verify(p, r) {
    const allChecks = criteria(p, r);
    const complete =
      p.steps.every((s) => r.checks.includes("step:" + s.id)) &&
      allChecks.every((c) => r.checks.includes("accept:" + c.id));
    return `<div class="work-stage-head"><span>04</span><div><h3>${esc(t("O resultado atende à tarefa?"))}</h3><p>${esc(t("Marque apenas o que você conferiu no arquivo produzido. Estas respostas são declarações suas, não uma validação automática."))}</p></div></div><div class="work-checklist">${allChecks.map((c) => `<label class="check-line"><input type="checkbox" data-work-check="accept:${esc(c.id)}" ${r.checks.includes("accept:" + c.id) ? "checked" : ""}>${esc(c.label)}</label>`).join("")}</div><p class="fine">${esc(t("{done} de {total} etapas marcadas como conferidas.", { done: p.steps.filter((s) => r.checks.includes("step:" + s.id)).length, total: p.steps.length }))}</p><form id="work-evaluation"><div class="work-evaluation-grid"><label>${esc(t("Resultado do percurso"))}<select name="outcome">${[
      ["partial", "Ainda estou trabalhando"],
      ["completed", "Concluí e conferi minha tarefa"],
      ["blocked", "Preciso de ajuda para continuar"],
    ]
      .map(
        ([v, label]) =>
          `<option value="${v}" ${r.outcomeChoice === v ? "selected" : ""}>${esc(t(label))}</option>`,
      )
      .join(
        "",
      )}</select></label><label>${esc(t("Ajuda necessária"))}<select name="help">${[
      ["none", "Consegui sem ajuda"],
      ["guide", "Usei os guias do Deck"],
      ["person", "Precisei de outra pessoa"],
    ]
      .map(
        ([v, label]) =>
          `<option value="${v}" ${r.help === v ? "selected" : ""}>${esc(t(label))}</option>`,
      )
      .join(
        "",
      )}</select></label><label>${esc(t("Minutos dedicados (opcional)"))}<input type="number" name="minutes" min="0" max="1440" value="${r.minutes ?? ""}"></label></div><p class="fine">${esc(t("Salvo somente neste navegador. Nenhum arquivo seu ou resposta deste percurso é enviado ao servidor."))}</p><button class="btn" type="submit">${esc(t("Salvar minha avaliação"))}</button></form><p class="work-readiness">${esc(t(complete ? "Os critérios e as etapas estão marcados. Registre sua avaliação." : "Para marcar como concluído, confira todas as etapas e os critérios da tarefa."))}</p><div class="work-actions"><button class="text-button" data-export-work>${esc(t("Exportar meu registro"))}</button><button class="text-button" data-new-work>${esc(t("Iniciar outra tarefa"))}</button></div>`;
  }
  function guide(p) {
    const r = current();
    return (
      `# ${p.title}\n\n${p.description}\n\n## ${t("Sua entrega")}\n${p.outcome}\n\n## ${t("Materiais e requisitos")}\n${p.requirements.map((x) => "- " + x).join("\n")}\n\n` +
      p.steps
        .map((original) => adaptedStep(p, original, r))
        .map(
          (s, i) =>
            `## ${i + 1}. ${s.title}\n\n${s.skillId}\n\n${t("Recebe")}: ${s.input}\n\n${t("Sua entrega")}: ${s.output}\n\n${s.prompt}\n\n${s.checks.map((x) => "- [ ] " + (typeof x === "string" ? x : x.label)).join("\n")}`,
        )
        .join("\n\n") +
      `\n\n## ${t("Como conferir")}\n${criteria(p, r)
        .map((c) => "- [ ] " + c.label)
        .join("\n")}\n\n${p.sample.notice}\n\n${p.limitations.join("\n")}`
    );
  }

  async function downloadPack() {
    const p = active(),
      locale = DeckI18n.locale,
      url = DeckI18n.url("/api/pack-download?id=" + encodeURIComponent(p.id)),
      headers = DeckI18n.headers();
    if (pendingDownloads.has(p.id)) return;
    pendingDownloads.add(p.id);
    setNotice("", p.id);
    render();
    try {
      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(30000),
      });
      if (response.status === 401) {
        location.assign(
          DeckI18n.url(
            "/login?next=" +
              encodeURIComponent(location.pathname + location.search),
          ),
        );
        return;
      }
      if (!response.ok) throw Error("Download failed");
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength > 4000000) throw Error("Oversize");
      const digest = [
        ...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
      ]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");
      if (
        digest !== response.headers.get("x-package-sha256") ||
        response.headers.get("x-package-version") !== p.version
      )
        throw Error("Hash mismatch");
      file(
        "DriveData-" + p.id + "-v" + p.version + "-" + locale + ".zip",
        bytes,
        "application/zip",
      );
      ctx.packDownloaded?.(p);
      setNotice("Pacote completo conferido e baixado.", p.id);
    } catch {
      setNotice("Não foi possível baixar o pacote. Tente novamente.", p.id);
    } finally {
      pendingDownloads.delete(p.id);
      render();
    }
  }
  function renderPilot() {
    const rows = record().runs;
    $("#pilot-progress").textContent = t(
      "{runs} percursos registrados neste navegador; {completed} marcados como concluídos.",
      {
        runs: rows.length,
        completed: rows.filter(
          (r) => r.completedAt && r.outcome === "completed",
        ).length,
      },
    );
  }
  function record() {
    return {
      schema: 1,
      exportedAt: new Date().toISOString(),
      source: "self-reported-local-demo",
      containsUserFiles: false,
      runs: [
        ...state().history,
        ...Object.entries(state().packs)
          .filter(([, r]) => r.startedAt)
          .map(([packId, r]) => ({ packId, ...r })),
      ],
    };
  }
  document.addEventListener("click", async (event) => {
    const b = event.target.closest("button");
    if (!b || !ctx) return;
    if (b.dataset.experience) switchMode(b.dataset.experience);
    if (b.dataset.choosePack) choose(b.dataset.choosePack);
    if (b.hasAttribute("data-work-phase")) {
      updateRun({ phase: Number(b.dataset.workPhase) });
      setNotice("");
      render();
      $("#work-stage").focus({ preventScroll: true });
    }
    if (b.dataset.openWorkSkill)
      ctx.openSkill(b.dataset.openWorkSkill, "start", { opener: b });
    if (b.dataset.workFile) {
      const [kind, index] = b.dataset.workFile.split(":"),
        f = active().sample[kind]?.[Number(index)];
      if (f) file(f.filename, f.content, f.mimeType);
    }
    if (b.hasAttribute("data-work-prompt")) {
      const p = active(),
        step = p.steps[Number(b.dataset.workPrompt)];
      if (step) {
        const prompt = adaptedStep(p, step, current()).prompt;
        updateRun({});
        await ctx.copy(prompt);
      }
    }
    if (b.id === "work-download-pack") downloadPack();
    if (b.id === "work-download-guide")
      file(
        active().id + "-" + DeckI18n.locale + ".md",
        guide(active()),
        "text/markdown",
      );
    if (b.hasAttribute("data-export-work"))
      file(
        "DriveData-meu-percurso.json",
        JSON.stringify(record(), null, 2),
        "application/json",
      );
    if (b.hasAttribute("data-new-work")) {
      const r = current();
      if (r.startedAt)
        state().history = [
          ...state().history,
          { packId: active().id, ...r },
        ].slice(-30);
      state().packs[active().id] = DeckWorkStore.touch({
        context: "own",
        platform: r.platform,
      });
      persist();
      setNotice("Novo percurso iniciado. O anterior continua no seu registro.");
      render();
    }
  });
  document.addEventListener("change", (event) => {
    if (!ctx) return;
    const e = event.target;
    if (e.dataset.workCheck) {
      const checks = new Set(current().checks);
      e.checked
        ? checks.add(e.dataset.workCheck)
        : checks.delete(e.dataset.workCheck);
      updateRun({
        checks: [...checks],
        completedAt: null,
        outcome: "partial",
        outcomeChoice: "partial",
      });
      const keep = e.dataset.workCheck;
      render();
      $('[data-work-check="' + CSS.escape(keep) + '"]')?.focus({
        preventScroll: true,
      });
    }
    if (e.id === "work-context") {
      updateRun({
        context: e.value === "own" ? "own" : "sample",
        checks: [],
        completedAt: null,
        outcome: "partial",
        outcomeChoice: "partial",
      });
      render();
    }
    if (e.id === "work-platform") {
      updateRun({ platform: e.value });
      ctx.setRuntime(e.value);
    }
  });
  function captureEvaluation(event) {
    if (!ctx || !event.target.closest("#work-evaluation")) return;
    const form = $("#work-evaluation"),
      choice = form.elements.outcome.value;
    updateRun({
      outcomeChoice: choice,
      help: form.elements.help.value,
      minutes:
        form.elements.minutes.value === ""
          ? null
          : Number(form.elements.minutes.value),
      ...(choice !== current().outcome
        ? { outcome: "partial", completedAt: null }
        : {}),
    });
  }
  document.addEventListener("input", captureEvaluation);
  document.addEventListener("change", captureEvaluation);
  document.addEventListener("submit", (event) => {
    if (event.target.id !== "work-evaluation") return;
    event.preventDefault();
    captureEvaluation(event);
    const p = active(),
      r = current(),
      complete =
        p.steps.every((s) => r.checks.includes("step:" + s.id)) &&
        criteria(p, r).every((c) => r.checks.includes("accept:" + c.id));
    if (r.outcomeChoice === "completed" && !complete) {
      setNotice(
        "Confira todas as etapas e critérios antes de marcar o percurso como concluído.",
      );
      render();
      return;
    }
    updateRun({
      outcome: r.outcomeChoice,
      completedAt:
        r.outcomeChoice === "completed" ? new Date().toISOString() : null,
    });
    setNotice("Avaliação salva neste navegador.");
    render();
  });
  return {
    start,
    update,
    switchMode,
    choose,
    render,
    get ready() {
      return !!ctx;
    },
    get mode() {
      return ctx ? state().mode : "explore";
    },
  };
})();
