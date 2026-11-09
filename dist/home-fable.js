"use strict";
// Home Fable: uma cena só, feita de cartas. Canvas 2D com câmera ortográfica e
// projeção própria, sem biblioteca. O mesmo desenho serve a cena presa (computador)
// e os quadros estáticos (celular, efeitos desligados).
(() => {
  const DATA = window.HomeFableData;
  if (!DATA || !DATA.cards) return;
  const PREVIEW =
    typeof PublicPreview !== "undefined" && Array.isArray(PublicPreview)
      ? PublicPreview
      : [];
  const SKILL_ART = typeof DeckSkillArt !== "undefined" ? DeckSkillArt : null;
  const DECK_ART = typeof DeckArt !== "undefined" ? DeckArt : null;

  // ---------------------------------------------------------------- textos
  // Toda a copy em pt-BR por chave, para virar EN e ES depois. O HTML traz o mesmo
  // texto já escrito (aparece antes do JavaScript); aqui ficam as chaves e os
  // textos montados em tempo de execução.
  const TEXTOS = {
    skip: "Pular para o conteúdo",
    "nav.catalog": "Catálogo",
    "nav.task": "Tarefa",
    "nav.pack": "Pacote",
    "nav.faq": "Perguntas",
    "nav.demo": "Entrar na demo",
    "inst.scroll": "Role",
    "hero.title.a": "Um baralho com",
    "hero.title.b": "manuais de trabalho",
    "hero.title.c": "para a sua IA.",
    "hero.lead":
      "Cada carta do Deck é uma skill: as instruções, as referências e os critérios de conferência que o seu assistente segue para entregar uma planilha conferida, um indicador conciliado ou um protótipo.",
    "hero.cta": "Escolher pela tarefa",
    "hero.secondary": "Ver o catálogo",
    "catalog.title": "Cada casa desta grade é uma carta do catálogo.",
    "catalog.lead.a": "São",
    "catalog.lead.b": "skills em",
    "catalog.lead.c":
      "grupos de especialidade. Aponte para uma casa para levantar a carta, ou destaque um grupo.",
    "catalog.all": "Ver a lista completa",
    "catalog.all.label": "Lista completa das cartas",
    "catalog.prev": "Carta anterior",
    "catalog.next": "Próxima carta",
    "catalog.legend": "Cor da carta = acabamento",
    "catalog.group": "{name}, {count} cartas",
    "task.title": "Qual tarefa está na sua mesa?",
    "task.lead":
      "Escolha uma e três cartas do catálogo pousam na bandeja, na ordem em que entram no trabalho.",
    "task.spreadsheets": "Minha planilha não fecha.",
    "task.bi": "Meu indicador não bate.",
    "task.product": "Minha ideia ainda está solta.",
    "task.content": "Minha oferta precisa ficar clara.",
    "task.sample": "Abrir a amostra interativa",
    "task.demo": "Abrir estas cartas na demo",
    "tray.label": "TAREFA",
    "pack.title": "A carta é a entrada, e o método vai com você em um ZIP.",
    "pack.lead":
      "Depois de escolher, você baixa a pasta da skill e um roteiro para começar. Os arquivos ficam com você, para usar em um assistente compatível.",
    "pack.item1.t": "Instruções da especialidade",
    "pack.item1.d":
      "O que considerar, como conduzir a tarefa e quais cuidados tomar.",
    "pack.item2.t": "Guia para o primeiro uso",
    "pack.item2.d":
      "Onde instalar, quais materiais preparar e como fazer o primeiro pedido.",
    "pack.item3.t": "Versão e revisão do pacote",
    "pack.item3.d":
      "Identificação dos arquivos, dependências e limites conhecidos.",
    "pack.example": "Exemplo de referência da carta {code}:",
    "pack.note":
      "Os exemplos desta página usam dados fictícios e resultados de referência já conferidos. Nada aqui é executado por IA. O download não instala programas nem conecta contas, e algumas skills exigem ferramentas ou permissões específicas.",
    "sheet.result": "Resultado de referência",
    "sheet.revenue": "Receita",
    "sheet.cost": "Custo",
    "sheet.profit": "Lucro",
    "sheet.margin": "Margem consolidada",
    "sheet.source": "Fonte",
    "sheet.report": "Relatório",
    "sheet.diff": "Diferença localizada",
    "sheet.flows": "Fluxos descritos",
    "rail.0": "Baralho",
    "rail.1": "Catálogo",
    "rail.2": "Tarefa",
    "rail.3": "Pacote",
    "wait.title": "Entre na lista de espera do lançamento.",
    "wait.lead":
      "O Deck está em demonstração. Deixe seu contato e o seu interesse para a DriveData avisar quando abrir. O cadastro é gratuito e não é uma compra nem uma reserva paga.",
    "wait.demo": "Já recebeu a senha? Entre na demo",
    "wait.ok.title": "Você está na lista.",
    "wait.ok.text":
      "Seu interesse foi registrado. A DriveData poderá entrar em contato pelo e-mail informado sobre o lançamento do Deck. Nenhuma compra ou cobrança foi feita.",
    "form.name": "Seu nome",
    "form.email": "E-mail para contato",
    "form.audience": "Meu perfil",
    "form.aud.business": "Negócio e operação",
    "form.aud.technical": "Desenvolvimento e tecnologia",
    "form.interest": "Meu interesse",
    "form.int.explore": "Explorar a coleção",
    "form.int.spreadsheets": "Planilhas e documentos",
    "form.int.bi": "Dados e Power BI",
    "form.int.product": "Interfaces e produtos",
    "form.int.content": "Conteúdo e presença digital",
    "form.consent":
      "Quero receber contato da DriveData sobre o lançamento do Deck e li o",
    "form.privacy": "aviso de privacidade",
    "form.submit": "Entrar na lista de espera",
    "form.sending": "Registrando seu interesse…",
    "form.err.timeout":
      "A conexão demorou. Seu cadastro pode ter sido recebido; tentar de novo não cria duplicatas.",
    "form.err.network":
      "Não foi possível conectar. Confira sua conexão e tente novamente.",
    "form.err.generic": "Não foi possível concluir o cadastro.",
    "faq.title": "Perguntas frequentes",
    "faq.1.q": "Preciso saber programar?",
    "faq.1.a":
      "Depende da skill. Há aplicações para documentos, planilhas e conteúdo, além de especialidades técnicas. Cada carta informa os materiais e as ferramentas necessários.",
    "faq.2.q": "Qual é a diferença entre uma skill e um prompt?",
    "faq.2.a":
      "Um prompt faz um pedido. Uma skill pode reunir instruções reutilizáveis, referências e arquivos auxiliares para orientar a forma de trabalhar. A estrutura varia por especialidade.",
    "faq.3.q": "Funciona com qualquer assistente de IA?",
    "faq.3.a":
      "Não automaticamente. O guia traz caminhos para Codex, Claude Code e adaptação a outros assistentes. Algumas skills dependem de integrações específicas do ambiente de origem.",
    "faq.4.q": "A demo é gratuita? Para que serve a lista?",
    "faq.4.a":
      "Sim. Na demonstração atual, quem tem a senha pode escolher e baixar os pacotes gratuitamente. A lista registra seu interesse no lançamento, não libera a senha automaticamente e não gera cobrança.",
    "faq.5.q": "O que acontece com os dados do cadastro?",
    "faq.5.a":
      "Nome, e-mail, perfil e interesse ficam registrados para contato sobre o lançamento. A lista não é pública. O aviso de privacidade explica o tratamento e como pedir a remoção.",
    "footer.line": "Conhecimento organizado para quem tem trabalho a fazer.",
    "footer.privacy": "Privacidade",
    "footer.demo": "Entrar na demo",
    "footer.site": "Conheça a DriveData",
    "motion.pause": "Pausar efeitos",
    "motion.play": "Ativar efeitos",
    "finish.paper": "Papel",
    "finish.ion": "Ciano iônico",
    "finish.prism": "Prisma violeta",
    "finish.platinum": "Platina orbital",
    "finish.gold": "Ouro solar",
  };
  const t = (key, vars) =>
    String(TEXTOS[key] ?? key).replace(/\{(\w+)\}/g, (m, n) =>
      vars && n in vars ? vars[n] : m,
    );

  // ---------------------------------------------------------------- utilidades
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
          c
        ],
    );
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const lerp = (a, b, k) => a + (b - a) * k;
  const smooth = (a, b, x) => {
    const k = clamp((x - a) / (b - a));
    return k * k * (3 - 2 * k);
  };
  const easeIO = (k) =>
    k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const easeOut = (k) => 1 - Math.pow(1 - k, 4);
  const hash = (i) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const pad3 = (n) => String(n).padStart(3, "0");
  const HALF_PI = Math.PI / 2;
  const num = (n, opts) => new Intl.NumberFormat("pt-BR", opts).format(n);

  // ---------------------------------------------------------------- dados
  const N = DATA.total;
  const CARDS = DATA.cards.map(([code, title, group, finish, id], i) => ({
    i,
    code,
    title,
    group,
    finish,
    id,
    category: DATA.groups[group].name,
    finishLabel: t("finish." + finish),
  }));
  const byCode = new Map(CARDS.map((c) => [c.code, c]));
  const TASKS = DATA.tasks.map((task) => ({
    ...task,
    label: t("task." + task.id),
    preview: PREVIEW.find((p) => p.id === task.id) || null,
    cards: task.cards.map((c) => ({ ...c, i: byCode.get(c.code).i })),
  }));

  const state = {
    task: 0,
    group: -1,
    current: 0, // carta mostrada na leitura
    lifted: -1, // carta levantada na grade
    liftedBy: "",
    motionOff: matchMedia("(prefers-reduced-motion: reduce)").matches,
    pinned: false,
  };
  const params = new URLSearchParams(location.search);
  if (params.has("static")) state.motionOff = true;
  if (params.has("task"))
    state.task = clamp(Number(params.get("task")) | 0, 0, TASKS.length - 1);
  const forcedP = params.has("p") ? Number(params.get("p")) : null;

  // ---------------------------------------------------------------- interface
  $$("[data-total]").forEach((el) => (el.textContent = String(N)));
  $$("[data-groups]").forEach(
    (el) => (el.textContent = String(DATA.groups.length)),
  );
  // Confere se o HTML e o objeto de textos continuam iguais.
  $$("[data-t]").forEach((el) => {
    const key = el.dataset.t;
    const want = TEXTOS[key];
    if (want == null) return console.warn("home-fable: chave sem texto", key);
    const got = el.textContent.replace(/\s+/g, " ").trim();
    if (got !== want) el.textContent = want;
  });

  const STOCK = {
    paper: { rgb: [244, 240, 232], dark: false },
    ion: { rgb: [84, 122, 142], dark: true },
    prism: { rgb: [140, 76, 124], dark: true },
    platinum: { rgb: [176, 187, 199], dark: false },
    gold: { rgb: [206, 162, 78], dark: false },
  };
  const INK = [20, 36, 58];
  const CREAM = [248, 243, 234];
  const BACK = [28, 44, 69];
  const EDGE = [243, 238, 228];
  const GROUND = [216, 212, 205];
  const css = (c, a = 1) =>
    a >= 1
      ? `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`
      : `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

  const groupsEl = $("#groups");
  groupsEl.innerHTML = DATA.groups
    .map(
      (g, i) =>
        `<li><button type="button" data-group="${i}" aria-pressed="false" aria-label="${esc(t("catalog.group", g))}"><span>${esc(g.name)}</span><span class="hf-num">${pad3(g.count)}</span></button></li>`,
    )
    .join("");
  $("#legend").innerHTML =
    `<span>${esc(t("catalog.legend"))}</span>` +
    Object.keys(STOCK)
      .map(
        (k) =>
          `<span><i style="background:${css(STOCK[k].rgb)}"></i>${esc(t("finish." + k))} ${pad3(CARDS.filter((c) => c.finish === k).length)}</span>`,
      )
      .join("");
  const allEl = $("#all-cards");
  allEl.setAttribute("aria-label", t("catalog.all.label"));
  allEl.tabIndex = 0;
  $(".hf-all").addEventListener("toggle", (e) => {
    const col = e.target.closest(".hf-col");
    col.classList.toggle("is-listing", e.target.open);
    allEl.style.maxHeight = "";
    if (e.target.open && state.pinned) {
      const room = window.innerHeight - allEl.getBoundingClientRect().top - 28;
      allEl.style.maxHeight = Math.max(120, room) + "px";
    }
  });
  $(".hf-all").addEventListener(
    "toggle",
    () => {
      if (allEl.childElementCount) return;
      allEl.innerHTML = CARDS.map(
        (c) =>
          `<li><span class="hf-num">${esc(c.code)}</span><span>${esc(c.title)}<small>${esc(c.category)}</small></span></li>`,
      ).join("");
    },
    { once: true },
  );

  function showCurrent() {
    const c = CARDS[state.current];
    $("#ro-n").textContent = pad3(c.i + 1);
    $("#ro-title").textContent = c.title;
    $("#ro-meta").textContent = `${c.code} · ${c.category} · ${c.finishLabel}`;
  }
  function setCurrent(i, by) {
    state.current = (i + N) % N;
    lift(state.current, by);
    showCurrent();
  }
  $("#ro-prev").onclick = () => setCurrent(state.current - 1, "step");
  $("#ro-next").onclick = () => setCurrent(state.current + 1, "step");
  groupsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-group]");
    if (!b) return;
    const g = Number(b.dataset.group);
    state.group = state.group === g ? -1 : g;
    $$("[data-group]", groupsEl).forEach((x) =>
      x.setAttribute("aria-pressed", Number(x.dataset.group) === state.group),
    );
    applyGroup();
  });

  const tasksEl = $("#tasks");
  tasksEl.innerHTML = TASKS.map(
    (task, i) =>
      `<button type="button" data-task="${i}" aria-pressed="${i === state.task}"><span>${esc(task.label)}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>`,
  ).join("");
  tasksEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-task]");
    if (b) setTask(Number(b.dataset.task));
  });

  function exampleLine(task) {
    const p = task.preview;
    if (!p) return "";
    return `<b>${esc(t("pack.example", { code: p.card.code }))}</b> ${esc(p.example.title)}. <span class="hf-num">${esc(p.example.expected)}</span>`;
  }
  function showTask(animate) {
    const task = TASKS[state.task];
    $$("[data-task]", tasksEl).forEach((b) =>
      b.setAttribute("aria-pressed", Number(b.dataset.task) === state.task),
    );
    const hand = $("#hand");
    hand.innerHTML = task.cards
      .map(
        (c) =>
          `<li><span class="hf-num">${esc(c.code)}</span><span><strong>${esc(c.title)}</strong><small>${esc(c.action)}: ${esc(c.handoff)}</small></span></li>`,
      )
      .join("");
    if (animate && !state.motionOff) {
      hand.classList.remove("is-changing");
      void hand.offsetWidth;
      hand.classList.add("is-changing");
    }
    const link = $("#task-link");
    link.href = task.sample ? `/problemas/${task.sample}/` : "/login";
    link.innerHTML = `<span>${esc(t(task.sample ? "task.sample" : "task.demo"))}</span> <span aria-hidden="true">↗</span>`;
    $("#example").innerHTML = exampleLine(task);
    const interest = $("#wait-interest");
    if (interest && [...interest.options].some((o) => o.value === task.id))
      interest.dataset.suggest = task.id;
  }

  // Lista de espera: mesmo contrato do formulário atual (/api/waitlist).
  const form = $("#waitlist-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = $("#join-waitlist");
    if (button.disabled) return;
    button.disabled = true;
    button.firstElementChild.textContent = t("form.sending");
    $("#waitlist-error").textContent = "";
    const input = {
      name: $("#wait-name").value.trim(),
      email: $("#wait-email").value.trim(),
      audience: $("#wait-audience").value,
      interest: $("#wait-interest").value,
      consent: $("#wait-consent").checked,
      website: $("#wait-website").value,
    };
    try {
      const r = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-deck-language": "pt" },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(15000),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || t("form.err.generic"));
      form.reset();
      form.hidden = true;
      $("#waitlist-success").hidden = false;
      $("#waitlist-success").focus();
    } catch (error) {
      $("#waitlist-error").textContent =
        error.name === "TimeoutError"
          ? t("form.err.timeout")
          : error.name === "TypeError"
            ? t("form.err.network")
            : error.name === "SyntaxError"
              ? t("form.err.generic")
              : error.message;
      button.disabled = false;
      button.firstElementChild.textContent = t("form.submit");
    }
  });

  // ---------------------------------------------------------------- cena: constantes
  const CW = 0.63,
    CH = 1,
    CT = 0.017;
  const SHEET_W = 0.74,
    SHEET_H = 0.98,
    SHEET_T = 0.006;
  const LIGHT = (() => {
    const v = [-0.46, 0.8, -0.38];
    const l = Math.hypot(...v);
    return v.map((x) => x / l);
  })();
  const SHEETS = 4;
  const TOTAL_OBJ = N + SHEETS;
  const SLOT_ROLL = [-0.07, 0.035, -0.025];
  const SLOT_DZ = [0.03, -0.04, 0.02];
  const SLOT_DX = 0.9;

  const path = (w, h, r, inset = 0) => {
    const p = new Path2D();
    const x = inset,
      y = inset,
      ww = w - inset * 2,
      hh = h - inset * 2,
      rr = Math.max(0, r - inset * 0.6);
    if (p.roundRect) p.roundRect(x, y, ww, hh, rr);
    else p.rect(x, y, ww, hh);
    return p;
  };
  const CARD_PATH = path(63, 100, 4.4);
  const CARD_FRAME = path(63, 100, 4.4, 3);
  const CARD_WINDOW = (() => {
    const p = new Path2D();
    if (p.roundRect) p.roundRect(6, 13.5, 51, 36, 2.2);
    else p.rect(6, 13.5, 51, 36);
    return p;
  })();
  const SHEET_PATH = path(74, 98, 1.6);

  // Canais animados por carta: valor atual segue o alvo, com atraso opcional.
  let clock = performance.now();
  function channel(n, opts) {
    return {
      cur: new Float32Array(n),
      tgt: new Float32Array(n),
      pend: new Float32Array(n),
      at: new Float64Array(n),
      has: new Uint8Array(n),
      active: false,
      ...opts,
    };
  }
  function chSet(ch, i, value, delay = 0) {
    if (state.motionOff) {
      ch.cur[i] = ch.tgt[i] = value;
      ch.has[i] = 0;
      return;
    }
    ch.pend[i] = value;
    ch.at[i] = clock + delay;
    ch.has[i] = 1;
    ch.active = true;
  }
  function chStep(ch, dt) {
    if (!ch.active) return false;
    let busy = false;
    const k = ch.tau ? 1 - Math.exp(-dt / ch.tau) : 0;
    const step = ch.dur ? dt / ch.dur : 0;
    for (let i = 0; i < ch.cur.length; i++) {
      if (ch.has[i]) {
        if (clock >= ch.at[i]) {
          ch.tgt[i] = ch.pend[i];
          ch.has[i] = 0;
        } else busy = true;
      }
      const d = ch.tgt[i] - ch.cur[i];
      if (d === 0) continue;
      if (ch.dur) {
        ch.cur[i] = Math.abs(d) <= step ? ch.tgt[i] : ch.cur[i] + Math.sign(d) * step;
      } else {
        ch.cur[i] = Math.abs(d) < 0.002 ? ch.tgt[i] : ch.cur[i] + d * k;
      }
      if (ch.cur[i] !== ch.tgt[i]) busy = true;
    }
    ch.active = busy;
    return true;
  }
  const chLift = channel(N, { tau: 120 });
  const chRaise = channel(N, { tau: 150 });
  const chDim = channel(N, { tau: 170 });
  const chFeat = channel(N, { dur: 980 });
  const chPres = channel(N, { dur: 900 });
  const slotOf = new Int8Array(N).fill(-1);

  function lift(i, by) {
    if (state.lifted === i) return;
    if (state.lifted >= 0) chSet(chLift, state.lifted, 0);
    state.lifted = i;
    state.liftedBy = by || "";
    if (i >= 0) chSet(chLift, i, 1);
    wake();
  }
  function applyGroup() {
    const L = views[0] ? views[0].layout : null;
    CARDS.forEach((c) => {
      const on = state.group >= 0 && c.group === state.group;
      const col = L ? c.i % L.cols : 0,
        row = L ? (c.i / L.cols) | 0 : 0;
      const delay = (col + row * 1.6) * 16;
      chSet(chRaise, c.i, on ? 1 : 0, delay);
      chSet(chDim, c.i, state.group >= 0 && !on ? 1 : 0, delay);
    });
    wake();
  }
  function setTask(index, instant) {
    if (index === state.task && !instant) return;
    const prev = TASKS[state.task];
    state.task = index;
    const next = TASKS[index];
    const keep = new Set(next.cards.map((c) => c.i));
    if (!instant)
      prev.cards.forEach((c, j) => {
        if (keep.has(c.i)) return;
        chSet(chFeat, c.i, 0, j * 90);
        chSet(chPres, c.i, 0, 0);
      });
    next.cards.forEach((c, j) => {
      slotOf[c.i] = j;
      chSet(chFeat, c.i, 1, instant ? 0 : 260 + j * 150);
      chSet(chPres, c.i, j === 0 ? 1 : 0, instant ? 0 : 700);
    });
    if (instant)
      next.cards.forEach((c, j) => {
        chFeat.cur[c.i] = chFeat.tgt[c.i] = 1;
        chPres.cur[c.i] = chPres.tgt[c.i] = j === 0 ? 1 : 0;
        chFeat.has[c.i] = chPres.has[c.i] = 0;
      });
    faces.sheets = null;
    showTask(!instant);
    wake();
  }

  // ---------------------------------------------------------------- faces em bitmap
  const logo = new Image();
  logo.src = "/assets/drivedata-logo.png";
  let warmTimer = 0;
  const warmSoon = () => {
    clearTimeout(warmTimer);
    warmTimer = setTimeout(() => typeof warm === "function" && warm(), 350);
  };
  logo.onload = () => {
    faces.cache.clear();
    faces.sheets = null;
    wake();
    warmSoon();
  };
  const faces = { cache: new Map(), sheets: null, fonts: false };
  if (document.fonts && document.fonts.load)
    Promise.all([
      document.fonts.load("700 20px Archivo"),
      document.fonts.load("500 12px GeistMono"),
      document.fonts.load("400 12px Inter"),
      document.fonts.load("600 12px Inter"),
    ])
      .catch(() => {})
      .then(() => {
        faces.fonts = true;
        faces.cache.clear();
        faces.sheets = null;
        wake();
        warmSoon();
      });

  function wrap(g, text, maxWidth, maxLines) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (g.measureText(test).width <= maxWidth || !line) line = test;
      else {
        lines.push(line);
        line = w;
      }
    }
    if (line) lines.push(line);
    if (lines.length > maxLines) {
      lines.length = maxLines;
      let last = lines[maxLines - 1];
      while (g.measureText(last + "…").width > maxWidth && last.length > 3)
        last = last.slice(0, -1);
      lines[maxLines - 1] = last.replace(/[\s,.;:]+$/, "") + "…";
    }
    return lines;
  }
  function spaced(g, px) {
    if ("letterSpacing" in g) g.letterSpacing = px + "px";
  }
  function artImage(id, ink, solid, tint, lightFill, done) {
    if (!SKILL_ART) return;
    let svg = SKILL_ART.render(id);
    const style = `<style>.scene-solid{fill:${solid}}.scene-tint{fill:${tint}}.scene-light{fill:${lightFill};stroke:${ink}}.scene-floor{fill:${solid};stroke:${ink};stroke-width:1}.scene-room{stroke:${ink};stroke-width:1;opacity:.5}</style>`;
    svg = svg.replace(
      /^<svg /,
      `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="520" color="${ink}" `,
    );
    svg = svg.replace(/>/, ">" + style);
    const img = new Image();
    img.onload = () => done(img);
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function grain(g, w, h, seed, alpha) {
    for (let k = 0; k < 520; k++) {
      const x = hash(seed + k * 1.7) * w,
        y = hash(seed + k * 3.1 + 9) * h;
      g.fillStyle = k % 2 ? `rgba(255,255,255,${alpha})` : `rgba(10,20,40,${alpha})`;
      g.fillRect(x, y, 1.1, 1.1);
    }
  }
  // Frente da carta: papel fosco na cor do acabamento, impressão em uma tinta.
  function cardFace(card, extra) {
    const key = card.code + (extra ? "+" : "");
    const hit = faces.cache.get(key);
    if (hit) return hit;
    if (faces.cache.size > 40) faces.cache.delete(faces.cache.keys().next().value);
    const cv = document.createElement("canvas");
    cv.width = 504;
    cv.height = 800;
    const g = cv.getContext("2d");
    g.scale(2, 2);
    const stock = STOCK[card.finish];
    const ink = stock.dark ? CREAM : INK;
    const inkCss = css(ink);
    g.save();
    g.beginPath();
    if (g.roundRect) g.roundRect(0, 0, 252, 400, 17.6);
    else g.rect(0, 0, 252, 400);
    g.clip();
    g.fillStyle = css(stock.rgb);
    g.fillRect(0, 0, 252, 400);
    grain(g, 252, 400, card.i, 0.045);
    g.strokeStyle = css(ink, 0.3);
    g.lineWidth = 1;
    g.beginPath();
    if (g.roundRect) g.roundRect(10, 10, 232, 380, 10);
    else g.rect(10, 10, 232, 380);
    g.stroke();
    if (logo.complete && logo.naturalWidth) g.drawImage(logo, 22, 22, 20, 20);
    g.fillStyle = inkCss;
    g.textBaseline = "alphabetic";
    g.font = "600 13px GeistMono, monospace";
    g.fillText(card.code, 49, 37);
    g.font = "500 7.6px GeistMono, monospace";
    spaced(g, 0.7);
    g.textAlign = "right";
    g.fillText(card.finishLabel.toUpperCase(), 230, 36);
    g.textAlign = "left";
    spaced(g, 0);
    // janela da ilustração
    const wx = 22,
      wy = 52,
      ww = 208,
      wh = 150;
    g.fillStyle = stock.dark ? "rgba(8,18,32,.24)" : "rgba(20,36,58,.075)";
    g.beginPath();
    if (g.roundRect) g.roundRect(wx, wy, ww, wh, 8);
    else g.rect(wx, wy, ww, wh);
    g.fill();
    g.font = "500 8.4px Inter, sans-serif";
    g.fillStyle = css(ink, 0.82);
    g.fillText(card.category, wx + 10, wy + 17);
    // marca de edição: mesma assinatura de 20 pontos das cartas da coleção
    const bits = DECK_ART ? DECK_ART.signature(card.code) : "10110100101101001011";
    for (let b = 0; b < 20; b++) {
      g.fillStyle = css(ink, bits[b] === "1" ? 0.85 : 0.2);
      g.fillRect(wx + ww - 38 + (b % 5) * 6, wy + wh - 30 + ((b / 5) | 0) * 6, 4, 4);
    }
    const label = (extra && extra.alias) || t("finish." + card.finish);
    g.font = "500 7.4px GeistMono, monospace";
    spaced(g, 0.8);
    g.fillStyle = css(ink, 0.7);
    g.fillText(String(label).toUpperCase(), 22, 222);
    spaced(g, 0);
    g.fillStyle = inkCss;
    let size = 20;
    g.font = `700 ${size}px Archivo, Inter, sans-serif`;
    let lines = wrap(g, card.title, 208, 5);
    if (lines.length > 3) {
      size = 17;
      g.font = `700 ${size}px Archivo, Inter, sans-serif`;
      lines = wrap(g, card.title, 208, 4);
    }
    let y = 246;
    lines.forEach((ln) => {
      g.fillText(ln, 22, y);
      y += size * 1.1;
    });
    if (extra && extra.tagline) {
      g.font = "400 10px Inter, sans-serif";
      g.fillStyle = css(ink, 0.8);
      y += 3;
      wrap(g, extra.tagline, 208, y > 320 ? 2 : 3).forEach((ln) => {
        g.fillText(ln, 22, y);
        y += 13.6;
      });
    }
    g.strokeStyle = css(ink, 0.3);
    g.beginPath();
    g.moveTo(22, 362.5);
    g.lineTo(230, 362.5);
    g.stroke();
    g.font = "500 7.6px GeistMono, monospace";
    spaced(g, 0.5);
    g.fillStyle = css(ink, 0.82);
    g.fillText(
      `${card.code} · ${pad3(card.i + 1)}/${N}${extra && extra.version ? " · v" + extra.version : ""}`,
      22,
      377,
    );
    g.textAlign = "right";
    g.fillText("DRIVEDATA DECK", 230, 377);
    g.textAlign = "left";
    spaced(g, 0);
    g.restore();
    artImage(
      card.id,
      inkCss,
      stock.dark ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.5)",
      css(ink, 0.16),
      stock.dark ? css(CREAM, 0.9) : css(stock.rgb),
      (img) => {
        g.drawImage(img, wx + 16, wy + 9, 176, 143);
        wake();
      },
    );
    faces.cache.set(key, cv);
    return cv;
  }
  function sheetBase(file, title, body) {
    const cv = document.createElement("canvas");
    cv.width = 592;
    cv.height = 784;
    const g = cv.getContext("2d");
    g.scale(2, 2);
    g.beginPath();
    if (g.roundRect) g.roundRect(0, 0, 296, 392, 6.4);
    else g.rect(0, 0, 296, 392);
    g.clip();
    g.fillStyle = "#f8f5ee";
    g.fillRect(0, 0, 296, 392);
    grain(g, 296, 392, title.length * 7, 0.03);
    g.fillStyle = css(INK, 0.7);
    g.font = "500 8.6px GeistMono, monospace";
    spaced(g, 0.4);
    g.fillText(file, 24, 34);
    spaced(g, 0);
    g.strokeStyle = css(INK, 0.22);
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(24, 46.5);
    g.lineTo(272, 46.5);
    g.stroke();
    g.fillStyle = css(INK);
    g.font = "700 19px Archivo, Inter, sans-serif";
    let y = 76;
    wrap(g, title, 240, 2).forEach((ln) => {
      g.fillText(ln, 24, y);
      y += 21;
    });
    body(g, y + 6);
    return cv;
  }
  function paragraph(g, text, y, lines = 4) {
    g.font = "400 10.4px Inter, sans-serif";
    g.fillStyle = css(INK, 0.78);
    wrap(g, text, 244, lines).forEach((ln) => {
      g.fillText(ln, 24, y);
      y += 15;
    });
    return y;
  }
  function textBars(g, y, rows, seed) {
    g.fillStyle = css(INK, 0.13);
    for (let r = 0; r < rows; r++) {
      const w = 130 + hash(seed + r) * 114;
      g.fillRect(24, y, r % 5 === 4 ? w * 0.5 : w, 5);
      y += r % 5 === 4 ? 22 : 12.5;
    }
  }
  function resultSheet(task) {
    const p = task.preview;
    const e = p ? p.example : null;
    return sheetBase(
      "exemplo/result.json",
      t("sheet.result"),
      (g, y) => {
        if (!e) return textBars(g, y, 12, 3);
        const r = e.result;
        const big = (text) => {
          g.fillStyle = css(INK);
          g.font = "600 46px GeistMono, monospace";
          spaced(g, -2.4);
          g.fillText(text, 22, y + 46);
          spaced(g, 0);
        };
        const row = (label, value, ry, frac) => {
          g.font = "400 10.4px Inter, sans-serif";
          g.fillStyle = css(INK, 0.8);
          g.fillText(label, 24, ry);
          g.font = "500 10.4px GeistMono, monospace";
          g.textAlign = "right";
          g.fillStyle = css(INK);
          g.fillText(value, 272, ry);
          g.textAlign = "left";
          g.fillStyle = css(INK, 0.12);
          g.fillRect(24, ry + 7, 248, 3);
          if (frac != null) {
            g.fillStyle = css(INK, 0.78);
            g.fillRect(24, ry + 7, 248 * clamp(frac), 3);
          }
        };
        if (e.kind === "margin") {
          big(num(r.margin * 100, { maximumFractionDigits: 2 }) + "%");
          g.font = "400 10.4px Inter, sans-serif";
          g.fillStyle = css(INK, 0.78);
          g.fillText(t("sheet.margin"), 24, y + 68);
          row(t("sheet.revenue"), num(r.revenue), y + 104, 1);
          row(t("sheet.cost"), num(r.cost), y + 134, r.cost / r.revenue);
          row(t("sheet.profit"), num(r.profit), y + 164, r.profit / r.revenue);
          g.font = "500 10px GeistMono, monospace";
          g.fillStyle = css(INK, 0.8);
          g.fillText(`${num(r.profit)} ÷ ${num(r.revenue)}`, 24, y + 204);
        } else if (e.kind === "reconcile") {
          big("+" + num(r.totalDifference));
          g.font = "400 10.4px Inter, sans-serif";
          g.fillStyle = css(INK, 0.78);
          const where = r.rows.find((x) => x.difference);
          g.fillText(
            t("sheet.diff") + (where ? " · " + where.month : ""),
            24,
            y + 68,
          );
          let ry = y + 104;
          const max = Math.max(...r.rows.map((x) => Math.max(x.source, x.report)));
          r.rows.forEach((x) => {
            row(`${x.month} · ${t("sheet.source")}`, num(x.source), ry, x.source / max);
            row(`${x.month} · ${t("sheet.report")}`, num(x.report), ry + 28, x.report / max);
            ry += 64;
          });
        } else if (e.kind === "requirements") {
          big(pad3(r.flows.length).slice(1));
          g.font = "400 10.4px Inter, sans-serif";
          g.fillStyle = css(INK, 0.78);
          g.fillText(t("sheet.flows"), 24, y + 68);
          let ry = y + 100;
          r.flows.forEach((f) => {
            g.font = "500 8px GeistMono, monospace";
            g.fillStyle = css(INK, 0.7);
            g.fillText(f.role.toUpperCase(), 24, ry);
            g.font = "600 11px Inter, sans-serif";
            g.fillStyle = css(INK);
            g.fillText(f.screen, 24, ry + 15);
            g.fillStyle = css(INK, 0.14);
            g.fillRect(24, ry + 24, 248, 1);
            ry += 42;
          });
        } else if (e.kind === "content") {
          let ry = y + 8;
          String(r.draft)
            .split(/\n+/)
            .slice(0, 3)
            .forEach((para) => {
              ry = paragraph(g, para, ry, 4) + 9;
            });
          g.font = "500 8.4px GeistMono, monospace";
          g.fillStyle = css(INK, 0.7);
          g.fillText(String(r.status || "").toUpperCase(), 24, ry + 10);
        }
      },
    );
  }
  function sheetFaces() {
    if (faces.sheets) return faces.sheets;
    const task = TASKS[state.task];
    const c = task.cards[0];
    faces.sheets = [
      sheetBase("SKILL.md", t("pack.item1.t"), (g, y) => {
        const yy = paragraph(g, t("pack.item1.d"), y);
        textBars(g, yy + 10, 17, 11);
      }),
      sheetBase("COMO-USAR.md", t("pack.item2.t"), (g, y) => {
        const yy = paragraph(g, t("pack.item2.d"), y);
        textBars(g, yy + 10, 17, 29);
      }),
      sheetBase("MANIFEST.json", t("pack.item3.t"), (g, y) => {
        const yy = paragraph(g, t("pack.item3.d"), y) + 10;
        [
          ["code", c.code],
          ["version", c.version],
          ["format", "SKILL.md"],
        ].forEach(([k, v], r) => {
          const ry = yy + 8 + r * 27;
          g.font = "500 9px GeistMono, monospace";
          g.fillStyle = css(INK, 0.7);
          g.fillText(k, 24, ry);
          g.fillStyle = css(INK);
          g.textAlign = "right";
          g.fillText(v, 272, ry);
          g.textAlign = "left";
          g.fillStyle = css(INK, 0.14);
          g.fillRect(24, ry + 9, 248, 1);
        });
        textBars(g, yy + 104, 8, 5);
      }),
      resultSheet(task),
    ];
    return faces.sheets;
  }

  // ---------------------------------------------------------------- luz de persiana e sombras
  const BLIND_E = 22; // meia largura do chão coberto pela textura, em unidades do mundo
  const blinds = (() => {
    const S = 512;
    const cv = document.createElement("canvas");
    cv.width = cv.height = S;
    const g = cv.getContext("2d");
    const img = g.createImageData(S, S);
    const ang = 1.24,
      ca = Math.cos(ang),
      sa = Math.sin(ang);
    const period = 4.3;
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const wx = (x / S - 0.5) * 2 * BLIND_E,
          wz = (y / S - 0.5) * 2 * BLIND_E;
        const u = (wx * sa - wz * ca) / period + 0.18, // através das lâminas
          along = wx * ca + wz * sa; // ao longo delas
        const cell = Math.floor(u),
          f = u - cell;
        // cada lâmina abre um pouco diferente; a janela termina dos dois lados
        const open = 0.46 + hash(cell + 3) * 0.14;
        const soft = 0.22;
        const band = smooth(0, soft, f) * (1 - smooth(open, open + soft, f));
        const windowAcross = 1 - smooth(1.7, 2.6, Math.abs(u - 0.4));
        const windowAlong = 1 - smooth(13, 20, Math.abs(along - 3));
        const o = (y * S + x) * 4;
        img.data[o] = 255;
        img.data[o + 1] = 250;
        img.data[o + 2] = 238;
        img.data[o + 3] = 255 * band * windowAcross * windowAlong;
      }
    g.putImageData(img, 0, 0);
    return cv;
  })();
  // O inverso da persiana: escurece, por multiplicação, o que a luz não alcança.
  const SHADE = [219, 216, 212];
  const blindShade = (() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 512;
    const g = cv.getContext("2d");
    g.drawImage(blinds, 0, 0);
    const img = g.getImageData(0, 0, 512, 512);
    for (let o = 0; o < img.data.length; o += 4) {
      const a = img.data[o + 3] / 255;
      img.data[o] = lerp(SHADE[0], 255, a);
      img.data[o + 1] = lerp(SHADE[1], 255, a);
      img.data[o + 2] = lerp(SHADE[2], 255, a);
      img.data[o + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return cv;
  })();
  const shadowSprites = [0.1, 0.26, 0.5].map((softness) => {
    const S = 96,
      inner = 48,
      m = 24;
    const cv = document.createElement("canvas");
    cv.width = cv.height = S;
    const g = cv.getContext("2d");
    const img = g.createImageData(S, S);
    const edge = softness * inner;
    const f = (v) =>
      smooth(m - edge, m + edge, v) * (1 - smooth(m + inner - edge, m + inner + edge, v));
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const o = (y * S + x) * 4;
        img.data[o] = 26;
        img.data[o + 1] = 30;
        img.data[o + 2] = 44;
        img.data[o + 3] = 255 * f(x + 0.5) * f(y + 0.5);
      }
    g.putImageData(img, 0, 0);
    return cv;
  });

  // ---------------------------------------------------------------- vistas e câmeras
  function makeLayout(narrow) {
    const cols = narrow ? 11 : 21;
    const rows = Math.ceil(N / cols);
    const px = 0.78,
      pz = 1.16;
    const gw = cols * px,
      gd = rows * pz;
    const tray = { x: narrow ? 0 : 1.4, z: gd / 2 + 2.5, w: 3.0, d: 1.56, t: 0.085 };
    return {
      cols,
      rows,
      px,
      pz,
      gw,
      gd,
      tray,
      flat: { x: tray.x, z: tray.z + 2.3 },
    };
  }
  function makeCam(yaw, pitch, zoom, target, ax, ay) {
    return { yaw, pitch, zoom, tx: target[0], ty: target[1], tz: target[2], ax, ay };
  }
  function extent(w, d, yaw, pitch) {
    const c = Math.abs(Math.cos(yaw)),
      s = Math.abs(Math.sin(yaw));
    return [w * c + d * s, (w * s + d * c) * Math.sin(pitch)];
  }
  function camerasFor(v) {
    const L = v.layout,
      w = v.w,
      h = v.h;
    const pin = v.mode === "pinned";
    const S = Math.min(w / 1440, h / 880);
    const cams = [];
    // 0: fita
    cams[0] = pin
      ? makeCam(0.4, 0.26, 150 * S, [0, 0.66, 0], w * 0.5, h * (0.7 + 0.04 * clamp((900 - h) / 250)))
      : makeCam(0.4, 0.26, Math.max(86, w / 8.6), [0, 0.66, 0], w * 0.5, h * 0.56);
    // 1: grade
    {
      const yaw = L.cols > L.rows ? -0.5 : -0.3,
        pitch = 0.93;
      const [ex, ey] = extent(L.gw + 2.2, L.gd + 1.2, yaw, pitch);
      const zoom = pin
        ? Math.min((w * 0.575) / ex, (h * 0.8) / ey)
        : Math.min((w * 0.94) / ex, (h * 0.92) / ey);
      cams[1] = makeCam(
        yaw,
        pitch,
        zoom,
        [0, 0, 0],
        pin ? w * 0.64 : w * 0.5,
        pin ? h * 0.54 : h * 0.5,
      );
    }
    // 2: bandeja
    {
      const yaw = -0.34,
        pitch = 1.04;
      const [ex, ey] = extent(L.tray.w + 0.3, L.tray.d + 0.3, yaw, pitch);
      const zoom = pin
        ? Math.min((w * 0.52) / ex, (h * 0.62) / ey)
        : Math.min((w * 0.92) / ex, (h * 0.84) / ey);
      cams[2] = makeCam(
        yaw,
        pitch,
        zoom,
        [L.tray.x, L.tray.t, L.tray.z],
        pin ? w * 0.66 : w * 0.5,
        pin ? h * 0.55 : h * 0.52,
      );
    }
    // 3: pacote aberto sobre a mesa
    {
      const yaw = -0.2,
        pitch = 1.1;
      const [ex, ey] = extent(3.05, 1.15, yaw, pitch);
      const zoom = pin
        ? Math.min((w * 0.49) / ex, (h * 0.5) / ey)
        : Math.min((w * 0.95) / ex, (h * 0.7) / ey);
      cams[3] = makeCam(
        yaw,
        pitch,
        zoom,
        [L.flat.x - 0.08, 0, L.flat.z - (pin ? 0.3 : -0.12)],
        pin ? w * 0.635 : w * 0.5,
        pin ? h * 0.56 : h * 0.56,
      );
    }
    return cams;
  }
  function lerpCam(a, b, k) {
    return {
      yaw: lerp(a.yaw, b.yaw, k),
      pitch: lerp(a.pitch, b.pitch, k),
      zoom: Math.exp(lerp(Math.log(a.zoom), Math.log(b.zoom), k)),
      tx: lerp(a.tx, b.tx, k),
      ty: lerp(a.ty, b.ty, k),
      tz: lerp(a.tz, b.tz, k),
      ax: lerp(a.ax, b.ax, k),
      ay: lerp(a.ay, b.ay, k),
    };
  }
  function prepCam(c) {
    c.cy = Math.cos(c.yaw);
    c.sy = Math.sin(c.yaw);
    c.cp = Math.cos(c.pitch);
    c.sp = Math.sin(c.pitch);
    return c;
  }
  // direção do mundo -> tela (x, y em px por unidade) e profundidade
  function dir(c, x, y, z, out) {
    const x1 = x * c.cy + z * c.sy,
      z1 = -x * c.sy + z * c.cy;
    out[0] = c.zoom * x1;
    out[1] = -c.zoom * (y * c.cp - z1 * c.sp);
    out[2] = y * c.sp + z1 * c.cp;
    return out;
  }
  function pt(c, x, y, z, out) {
    dir(c, x - c.tx, y - c.ty, z - c.tz, out);
    out[0] += c.ax;
    out[1] += c.ay;
    return out;
  }

  // ---------------------------------------------------------------- poses
  const env = { intro: 0, introE: 0, phase: 0, rifS: 0, rifA: 0, px: 0, py: 0 };
  const RIB_LEN = N * 0.118;
  function poseRibbon(i, o) {
    const k = N > 1 ? i / (N - 1) : 0.5;
    const e = env.introE;
    const s = (k - 0.5) * RIB_LEN * lerp(0.08, 1, e);
    const ph = env.phase;
    let roll = (0.5 * s + 2.1 * Math.tanh(s / 1.5)) * e + ph;
    if (env.rifA > 0.001) {
      const d = (s - env.rifS) / 0.55;
      roll += env.rifA * 0.5 * Math.exp(-d * d);
    }
    o.x = s;
    o.y = 0.66 + 0.11 * Math.sin(s * 0.82 + ph * 0.5) * e;
    o.z = 0.32 * Math.sin(s * 0.46 + 1.1) * e;
    o.yaw = -HALF_PI + (0.3 * Math.sin(s * 0.62 + 0.4 + ph * 0.3) + 0.5 / (1 + s * s * 0.5)) * e;
    o.pitch = 0.14 * Math.sin(s * 0.5 + 2) * e;
    o.roll = roll;
    o.scale = 1;
    o.floor = 0;
    o.alpha = 1;
    o.layer = 0;
    return o;
  }
  function poseGrid(i, o, v) {
    const L = v.layout;
    const c = i % L.cols,
      r = (i / L.cols) | 0;
    o.x = (c - (L.cols - 1) / 2) * L.px;
    o.z = (r - (L.rows - 1) / 2) * L.pz;
    o.y = CT / 2 + 0.014 + chRaise.cur[i] * 0.26;
    o.yaw = 0;
    o.pitch = -HALF_PI;
    o.roll = 0;
    o.scale = 1;
    o.floor = 0;
    o.alpha = 1;
    o.layer = 0;
    const lf = chLift.cur[i];
    if (lf > 0.002) {
      const cam = v.cams[1];
      const spec = clamp((v.mode === "pinned" ? 250 : 150) / cam.zoom, 1.4, 7);
      o.y += lf * (0.5 + spec * 0.44);
      o.yaw = lerp(0, -cam.yaw + 0.1, lf);
      o.pitch = lerp(-HALF_PI, -cam.pitch + 0.1, lf);
      o.roll = lf * -0.04;
      o.scale = 1 + lf * (spec - 1);
    }
    return o;
  }
  function poseTask(i, o, v) {
    poseGrid(i, o, v);
    const f = chFeat.cur[i];
    if (f <= 0) return o;
    const tr = v.layout.tray,
      s = Math.max(0, slotOf[i]);
    const e = easeIO(f);
    const hop = Math.sin(Math.PI * f);
    o.x = lerp(o.x, tr.x + (s - 1) * SLOT_DX, e);
    o.z = lerp(o.z, tr.z - 0.04 + SLOT_DZ[s], e);
    o.y = lerp(o.y, tr.t + CT / 2 + 0.03, e) + hop * 1.5;
    o.roll = lerp(o.roll, SLOT_ROLL[s], e);
    o.yaw = lerp(o.yaw, 0, e) + hop * 0.5;
    o.pitch = lerp(o.pitch, -HALF_PI, e) + hop * 0.3;
    o.scale = lerp(o.scale, 1, e);
    o.floor = e > 0.6 ? tr.t : 0;
    return o;
  }
  const SHEET_X = [-0.66, -0.1, 0.46, 1.02];
  const SHEET_Z = [0.05, -0.05, 0.06, -0.02];
  const SHEET_ROLL = [0.045, -0.03, 0.05, -0.018];
  function posePack(i, o, v) {
    poseTask(i, o, v);
    const p = chPres.cur[i] * (chFeat.cur[i] >= 1 ? 1 : 0);
    if (p <= 0) return o;
    const F = v.layout.flat,
      e = easeIO(p);
    o.x = lerp(o.x, F.x - 1.2, e);
    o.y = lerp(o.y, 0.062, e) + Math.sin(Math.PI * p) * 0.6;
    o.z = lerp(o.z, F.z + 0.02, e);
    o.roll = lerp(o.roll, -0.07, e);
    o.floor = e > 0.5 ? 0.034 : v.layout.tray.t;
    o.layer = e > 0.5 ? 6 : 0;
    return o;
  }
  // Folhas do pacote: guardadas sob a carta na bandeja, abertas em leque na mesa.
  function poseSheet(j, o, v, k) {
    const L = v.layout,
      tr = L.tray;
    o.yaw = 0;
    o.pitch = -HALF_PI;
    if (k < 3) {
      o.x = tr.x - SLOT_DX;
      o.z = tr.z - 0.02;
      o.y = tr.t + 0.004 + j * 0.002;
      o.roll = SLOT_ROLL[0];
      o.scale = 0.84;
      o.alpha = 0;
      o.floor = tr.t;
      o.layer = 0;
      return o;
    }
    o.x = L.flat.x + SHEET_X[j];
    o.z = L.flat.z + SHEET_Z[j];
    o.y = 0.008 + j * 0.011;
    o.roll = SHEET_ROLL[j];
    o.scale = 1;
    o.alpha = 1;
    o.floor = o.y - 0.011;
    o.layer = 1 + j;
    return o;
  }
  function poseAt(k, idx, o, v) {
    if (idx >= N) return poseSheet(idx - N, o, v, k);
    if (k <= 0) return poseRibbon(idx, o);
    if (k === 1) return poseGrid(idx, o, v);
    if (k === 2) return poseTask(idx, o, v);
    return posePack(idx, o, v);
  }
  // atraso de cada objeto dentro da transição k -> k+1
  function stagger(k, idx, f) {
    if (k === 0) {
      const d = 0.52 * (idx / N);
      return clamp((f - d) / 0.48);
    }
    if (k === 1) {
      if (idx < N && chFeat.cur[idx] > 0)
        return clamp((f - 0.16 - 0.11 * Math.max(0, slotOf[idx])) / 0.6);
      return f;
    }
    if (idx >= N) return clamp((f - 0.24 - 0.09 * (idx - N)) / 0.5);
    return clamp(f / 0.72);
  }
  const wrapPi = (a) => a - Math.round(a / (2 * Math.PI)) * 2 * Math.PI;

  // ---------------------------------------------------------------- desenho
  const objs = Array.from({ length: TOTAL_OBJ }, (_, idx) => ({ idx }));
  const order = [];
  const A = {},
    B = {};
  const v3 = [0, 0, 0],
    w3 = [0, 0, 0];
  const colorCache = new Map();
  function shade(rgb, lit, fog) {
    const q = Math.round(lit * 40),
      fq = Math.round(fog * 16);
    const key = rgb[0] * 65536 + rgb[1] * 256 + rgb[2] + q * 16777216 + fq * 0.01;
    let out = colorCache.get(key);
    if (out) return out;
    const l = q / 40,
      f = fq / 16;
    out = css([
      Math.min(255, lerp(rgb[0] * l, GROUND[0], f)),
      Math.min(255, lerp(rgb[1] * l, GROUND[1], f)),
      Math.min(255, lerp(rgb[2] * l, GROUND[2], f)),
    ]);
    if (colorCache.size > 4000) colorCache.clear();
    colorCache.set(key, out);
    return out;
  }

  function render(v) {
    const g = v.ctx,
      w = v.w,
      h = v.h,
      d = v.dpr;
    if (!w || !h) return;
    const P = clamp(v.P, 0, 3);
    const k = Math.min(2, Math.floor(P)),
      f = P - k;
    const cam = prepCam(lerpCam(v.cams[k], v.cams[k + 1], easeIO(f)));
    if (v.mode === "pinned") {
      cam.yaw += env.px * 0.045;
      cam.pitch += env.py * -0.026;
      prepCam(cam);
    }
    v.cam = cam;
    const L = v.layout;
    const T = (a, b, c, dd, e, ff) =>
      g.setTransform(a * d, b * d, c * d, dd * d, e * d, ff * d);

    // chão e luz de persiana
    T(1, 0, 0, 1, 0, 0);
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
    // perto da bandeja a sombra da persiana cai também sobre os objetos; o chão
    // é pintado um pouco mais claro para terminar no mesmo tom da página
    const shadeA = 0.78 * smooth(1.1, 1.8, P) * (v.mode === "pinned" ? 1 : 0.4);
    g.fillStyle = css([
      GROUND[0] / (1 - shadeA * (1 - SHADE[0] / 255)),
      GROUND[1] / (1 - shadeA * (1 - SHADE[1] / 255)),
      GROUND[2] / (1 - shadeA * (1 - SHADE[2] / 255)),
    ]);
    g.fillRect(0, 0, w, h);
    const gx = dir(cam, 1, 0, 0, [0, 0, 0]),
      gz = dir(cam, 0, 0, 1, [0, 0, 0]),
      g0 = pt(cam, -BLIND_E, 0, -BLIND_E, [0, 0, 0]);
    const u = (2 * BLIND_E) / 512;
    const drawBlinds = () => {
      T(gx[0] * u, gx[1] * u, gz[0] * u, gz[1] * u, g0[0], g0[1]);
      g.drawImage(blinds, 0, 0);
    };
    // a mesma janela, mais perto: lâminas finas sobre a bandeja e a mesa
    const nearA = smooth(1.05, 1.7, P);
    const NEAR = 0.36;
    const n0 = pt(
      cam,
      L.tray.x + 0.5 - BLIND_E * NEAR,
      0,
      L.tray.z + 0.9 - BLIND_E * NEAR,
      [0, 0, 0],
    );
    const drawNear = () => {
      T(gx[0] * u * NEAR, gx[1] * u * NEAR, gz[0] * u * NEAR, gz[1] * u * NEAR, n0[0], n0[1]);
      g.drawImage(blinds, 0, 0);
    };
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = "low";
    const figK = v.mode === "pinned" ? 1 : 0.4; // nos quadros pequenos a luz fica só sugerida
    const farA = (1 - 0.7 * nearA) * figK;
    g.globalAlpha = lerp(0.5, 0.74, smooth(0.1, 1, P)) * farA;
    drawBlinds();
    if (nearA > 0.01) {
      g.globalAlpha = 0.5 * nearA * figK;
      drawNear();
    }
    g.globalAlpha = 1;

    // pontos e réguas da grade (chão)
    const gridA = smooth(0.42, 0.95, P) * (1 - 0.72 * smooth(1.25, 1.9, P));
    if (gridA > 0.01) {
      const o0 = pt(cam, 0, 0, 0, [0, 0, 0]);
      T(gx[0] / 100, gx[1] / 100, gz[0] / 100, gz[1] / 100, o0[0], o0[1]);
      g.fillStyle = css(INK, 0.3 * gridA);
      const ext = 3;
      const r = clamp(1.25 / (cam.zoom / 100), 1.2, 4.5);
      g.beginPath();
      for (let cc = -ext; cc <= L.cols + ext; cc++)
        for (let rr = -ext; rr <= L.rows + ext; rr++) {
          const inside = cc >= 0 && cc <= L.cols && rr >= 0 && rr <= L.rows;
          if (!inside && (cc + rr) % 2) continue;
          const x = (cc - L.cols / 2) * L.px * 100,
            z = (rr - L.rows / 2) * L.pz * 100;
          g.rect(x - r, z - r, r * 2, r * 2);
        }
      g.fill();
      if (cam.zoom * 0.3 > 9.5) {
        g.font = "500 27px GeistMono, monospace";
        g.textBaseline = "middle";
        g.fillStyle = css(INK, 0.62 * gridA);
        g.textAlign = "right";
        for (let rr = 0; rr < L.rows; rr++) {
          const first = rr * L.cols + 1;
          if (first > N) break;
          g.fillText(
            pad3(first),
            (-L.cols / 2) * L.px * 100 - 26,
            (rr - (L.rows - 1) / 2) * L.pz * 100,
          );
        }
        g.textAlign = "left";
        g.textBaseline = "alphabetic";
      }
    }

    // poses e projeção
    order.length = 0;
    const fogAmt = smooth(1.05, 1.9, P);
    const tr = L.tray;
    const margin = 120;
    for (let idx = 0; idx < TOTAL_OBJ; idx++) {
      const o = objs[idx];
      const tt = stagger(k, idx, f);
      if (tt <= 0) poseAt(k, idx, o, v);
      else if (tt >= 1) poseAt(k + 1, idx, o, v);
      else {
        poseAt(k, idx, A, v);
        poseAt(k + 1, idx, B, v);
        const e = easeIO(tt);
        o.x = lerp(A.x, B.x, e);
        o.y = lerp(A.y, B.y, e);
        o.z = lerp(A.z, B.z, e);
        o.yaw = lerp(A.yaw, B.yaw, e);
        o.pitch = lerp(A.pitch, B.pitch, e);
        o.roll = k === 0 ? lerp(wrapPi(A.roll), B.roll, e) : lerp(A.roll, B.roll, e);
        o.scale = lerp(A.scale, B.scale, e);
        o.alpha = idx >= N ? clamp(tt / 0.3) * B.alpha : lerp(A.alpha, B.alpha, e);
        o.floor = e > 0.6 ? B.floor : A.floor;
        o.layer = e > 0.5 ? B.layer : A.layer;
        const arc = Math.sin(Math.PI * tt);
        if (k === 0) o.y += arc * (0.5 + 0.9 * hash(idx));
        else if (k === 1 && idx < N && chFeat.cur[idx] > 0)
          o.y += arc * 1.25 * chFeat.cur[idx];
        else if (k === 2 && (idx >= N || chPres.cur[idx] > 0)) o.y += arc * (idx >= N ? 0.12 : 0.55);
      }
      if (idx < N && P > 2 && chFeat.cur[idx] <= 0) o.alpha *= 1 - smooth(2.05, 2.55, P);
      if (o.alpha <= 0.004) {
        o.vis = false;
        continue;
      }
      const sheet = idx >= N;
      o.w = sheet ? SHEET_W : CW;
      o.h = sheet ? SHEET_H : CH;
      o.t = sheet ? SHEET_T : CT;
      const cyw = Math.cos(o.yaw),
        syw = Math.sin(o.yaw),
        cpt = Math.cos(o.pitch),
        spt = Math.sin(o.pitch),
        cr = Math.cos(o.roll),
        sr = Math.sin(o.roll);
      // colunas da rotação Ry(yaw)·Rx(pitch)·Rz(roll)
      o.c0x = cyw * cr + syw * sr * spt;
      o.c0y = sr * cpt;
      o.c0z = -syw * cr + cyw * sr * spt;
      o.c1x = -cyw * sr + syw * cr * spt;
      o.c1y = cr * cpt;
      o.c1z = syw * sr + cyw * cr * spt;
      o.c2x = syw * cpt;
      o.c2y = -spt;
      o.c2z = cyw * cpt;
      pt(cam, o.x, o.y, o.z, v3);
      o.sx = v3[0];
      o.sy = v3[1];
      o.depth = v3[2] + (o.layer || 0) * 40;
      const reach = cam.zoom * o.scale * 0.72;
      o.vis =
        o.sx > -margin - reach &&
        o.sx < w + margin + reach &&
        o.sy > -margin - reach &&
        o.sy < h + margin + reach;
      if (!o.vis) continue;
      dir(cam, o.c0x, o.c0y, o.c0z, v3);
      o.Xx = v3[0] * o.scale;
      o.Xy = v3[1] * o.scale;
      const z0 = v3[2];
      dir(cam, o.c1x, o.c1y, o.c1z, v3);
      o.Yx = v3[0] * o.scale;
      o.Yy = v3[1] * o.scale;
      const z1 = v3[2];
      dir(cam, o.c2x, o.c2y, o.c2z, v3);
      o.Zx = v3[0] * o.scale;
      o.Zy = v3[1] * o.scale;
      o.nz = v3[2];
      const front = o.nz >= 0 ? 1 : -1;
      const dl = (o.c2x * LIGHT[0] + o.c2y * LIGHT[1] + o.c2z * LIGHT[2]) * front;
      const dc = Math.abs(o.nz);
      o.lit = 0.67 + 0.24 * Math.max(0, dl) + 0.2 * dc - 0.04 * Math.max(0, -dl);
      const s0 = z0 >= 0 ? 1 : -1,
        s1 = z1 >= 0 ? 1 : -1;
      const l0 = Math.max(0, (o.c0x * LIGHT[0] + o.c0y * LIGHT[1] + o.c0z * LIGHT[2]) * s0),
        l1 = Math.max(0, (o.c1x * LIGHT[0] + o.c1y * LIGHT[1] + o.c1z * LIGHT[2]) * s1);
      o.edgeLit = 0.74 + 0.28 * Math.max(l0, l1);
      o.sh = k === 0 && !sheet ? lerp(0.2, 1, tt) : 1;
      o.fog = 0;
      if (!sheet && fogAmt > 0) {
        const dist = Math.hypot(o.x - tr.x, o.z - tr.z);
        o.fog = fogAmt * smooth(2.4, 7.5, dist) * 0.82 * (1 - chFeat.cur[idx]);
      }
      if (!sheet && chDim.cur[idx] > 0)
        o.fog = Math.max(
          o.fog,
          chDim.cur[idx] * 0.46 * (1 - fogAmt) * (1 - chLift.cur[idx]),
        );
      order.push(o);
    }

    // sombras
    const lx = LIGHT[0] / LIGHT[1],
      lz = LIGHT[2] / LIGHT[1];
    const shadow = (o, floor) => {
      const hgt = Math.max(0, o.y - floor);
      if (hgt > 3.2) return;
      const a = o.alpha * (1 - o.fog) * o.sh;
      // eixos da carta projetados no plano do chão, na direção da luz
      const ax = (o.c0x - o.c0y * lx) * o.w * o.scale,
        az = (o.c0z - o.c0y * lz) * o.w * o.scale;
      const bx = (o.c1x - o.c1y * lx) * o.h * o.scale,
        bz = (o.c1z - o.c1y * lz) * o.h * o.scale;
      const cx = o.x - hgt * lx,
        cz = o.z - hgt * lz;
      dir(cam, ax, 0, az, v3);
      dir(cam, bx, 0, bz, w3);
      const Ax = v3[0],
        Ay = v3[1],
        Bx = w3[0],
        By = w3[1];
      const area = Math.abs(Ax * By - Ay * Bx);
      if (area < 6) return;
      pt(cam, cx, floor, cz, v3);
      const sprite = shadowSprites[hgt < 0.12 ? 0 : hgt < 0.7 ? 1 : 2];
      g.globalAlpha = (a * 0.46) / (1 + hgt * 1.5);
      T(Ax / 48, Ay / 48, Bx / 48, By / 48, v3[0] - Ax - Bx, v3[1] - Ay - By);
      g.drawImage(sprite, 0, 0);
      // oclusão de contato, logo abaixo
      if (hgt < 0.5) {
        dir(cam, o.c0x * o.w * o.scale, 0, o.c0z * o.w * o.scale, v3);
        dir(cam, o.c1x * o.h * o.scale, 0, o.c1z * o.h * o.scale, w3);
        const Cx = v3[0] * 1.06,
          Cy = v3[1] * 1.06,
          Dx = w3[0] * 1.06,
          Dy = w3[1] * 1.06;
        if (Math.abs(Cx * Dy - Cy * Dx) > 6) {
          pt(cam, o.x, floor, o.z, v3);
          g.globalAlpha = (a * 0.3) / (1 + hgt * 9);
          T(Cx / 48, Cy / 48, Dx / 48, Dy / 48, v3[0] - Cx - Dx, v3[1] - Cy - Dy);
          g.drawImage(shadowSprites[1], 0, 0);
        }
      }
    };

    // bandeja
    const trayA = smooth(1.02, 1.4, P);
    if (trayA > 0.01) {
      const slide = (1 - easeOut(clamp((P - 1.02) / 0.7))) * 2.6;
      const tz = tr.z + slide;
      const W100 = tr.w * 100,
        D100 = tr.d * 100;
      const pathTray = v.trayPath || (v.trayPath = path(W100, D100, 13));
      const lip = v.trayLip || (v.trayLip = path(W100, D100, 13, 7));
      const o0 = pt(cam, tr.x - tr.w / 2, 0, tz - tr.d / 2, [0, 0, 0]);
      const up = dir(cam, 0, 1, 0, [0, 0, 0]);
      const base = (yy) =>
        T(
          gx[0] / 100,
          gx[1] / 100,
          gz[0] / 100,
          gz[1] / 100,
          o0[0] + up[0] * yy,
          o0[1] + up[1] * yy,
        );
      // sombra da bandeja: uma projetada, firme, e uma ambiente, bem leve
      {
        const ax = dir(cam, tr.w, 0, 0, [0, 0, 0]),
          bz = dir(cam, 0, 0, tr.d, [0, 0, 0]);
        const cast = (sprite, grow, shift, alpha) => {
          const c = pt(cam, tr.x - tr.t * lx * shift, 0, tz - tr.t * lz * shift, [0, 0, 0]);
          g.globalAlpha = trayA * alpha;
          T(
            (ax[0] * grow) / 48,
            (ax[1] * grow) / 48,
            (bz[0] * grow) / 48,
            (bz[1] * grow) / 48,
            c[0] - (ax[0] + bz[0]) * grow,
            c[1] - (ax[1] + bz[1]) * grow,
          );
          g.drawImage(sprite, 0, 0);
        };
        cast(shadowSprites[1], 1.04, 1.4, 0.2);
        cast(shadowSprites[0], 1.0, 2.6, 0.5);
      }
      g.globalAlpha = trayA;
      const rise = Math.hypot(up[0], up[1]) * tr.t;
      const steps = Math.max(2, Math.min(26, Math.ceil(rise / 0.9)));
      for (let s = 0; s < steps; s++) {
        base((tr.t * s) / steps);
        g.fillStyle = shade([226, 221, 211], 0.8 + 0.14 * (s / steps), 0);
        g.fill(pathTray);
      }
      base(tr.t);
      g.fillStyle = css([250, 248, 243]);
      g.fill(pathTray);
      g.strokeStyle = css(INK, 0.12);
      g.lineWidth = 0.8;
      g.stroke(pathTray);
      // leito rebaixado: um tom abaixo da borda, com a aresta de dentro em sombra
      g.fillStyle = css([238, 234, 226]);
      g.fill(lip);
      g.save();
      g.clip(lip);
      g.strokeStyle = css(INK, 0.16);
      g.lineWidth = 5;
      g.translate(1.6, 2.2);
      g.stroke(lip);
      g.restore();
      g.strokeStyle = "rgba(255,255,255,.95)";
      g.lineWidth = 0.9;
      g.stroke(lip);
      // encaixes rebaixados e gravação
      for (let s = 0; s < 3; s++) {
        const sx = (tr.w / 2 + (s - 1) * SLOT_DX - CW / 2 - 0.03) * 100,
          sz = (tr.d / 2 - 0.04 - CH / 2 - 0.03) * 100;
        g.beginPath();
        if (g.roundRect) g.roundRect(sx, sz, (CW + 0.06) * 100, (CH + 0.06) * 100, 6);
        else g.rect(sx, sz, (CW + 0.06) * 100, (CH + 0.06) * 100);
        g.strokeStyle = css(INK, 0.22);
        g.lineWidth = 0.7;
        g.setLineDash([2.2, 2.2]);
        g.stroke();
        g.setLineDash([]);
      }
      if (cam.zoom * 0.075 > 6) {
        g.font = "500 7.4px GeistMono, monospace";
        spaced(g, 0.9);
        g.fillStyle = css(INK, 0.62);
        const task = TASKS[state.task];
        g.fillText(task.journey.toUpperCase(), 19, D100 - 14);
        g.textAlign = "right";
        g.fillText(`${pad3(task.cards.length)} / ${pad3(N)}`, W100 - 19, D100 - 14);
        g.textAlign = "left";
        spaced(g, 0);
      }
      g.globalAlpha = 1;
    }

    // objetos, do fundo para a frente
    order.sort((a, b) => a.depth - b.depth);
    const sheetsBmp = P > 2.02 ? sheetFaces() : null;
    for (const o of order) {
      shadow(o, o.floor);
      const sheet = o.idx >= N;
      const front = o.nz >= 0;
      const sgn = front ? 1 : -1;
      const fw = o.w * 100,
        fh = o.h * 100;
      const ma = (front ? o.Xx : -o.Xx) / 100,
        mb = (front ? o.Xy : -o.Xy) / 100,
        mc = -o.Yx / 100,
        md = -o.Yy / 100;
      const ox = o.sx - ma * fw * 0.5 - mc * fh * 0.5,
        oy = o.sy - mb * fw * 0.5 - md * fh * 0.5;
      const px = Math.hypot(o.Yx, o.Yy) * o.h; // altura da carta na tela
      const thick = Math.hypot(o.Zx, o.Zy) * o.t;
      g.globalAlpha = o.alpha;
      const steps = Math.max(1, Math.min(10, Math.ceil(thick / 1.05)));
      g.fillStyle = shade(sheet ? [236, 231, 221] : EDGE, o.edgeLit, o.fog);
      for (let s = 0; s < steps; s++) {
        const off = sgn * o.t * (-0.5 + s / steps);
        T(ma, mb, mc, md, ox + o.Zx * off, oy + o.Zy * off);
        g.fill(sheet ? SHEET_PATH : CARD_PATH);
      }
      T(ma, mb, mc, md, ox + o.Zx * sgn * o.t * 0.5, oy + o.Zy * sgn * o.t * 0.5);
      if (sheet) {
        if (sheetsBmp) {
          g.imageSmoothingQuality = "high";
          g.drawImage(sheetsBmp[o.idx - N], 0, 0, fw, fh);
          g.imageSmoothingQuality = "low";
        }
        else {
          g.fillStyle = "#f8f5ee";
          g.fill(SHEET_PATH);
        }
        if (o.lit < 1) {
          g.fillStyle = `rgba(18,24,40,${(1 - o.lit) * 0.6})`;
          g.fill(SHEET_PATH);
        }
        continue;
      }
      const card = CARDS[o.idx];
      const stock = STOCK[card.finish];
      if (!front) {
        g.fillStyle = shade(BACK, o.lit + 0.06, o.fog);
        g.fill(CARD_PATH);
        if (px > 30) {
          g.strokeStyle = css(CREAM, 0.34 * (1 - o.fog));
          g.lineWidth = Math.max(0.8, 80 / px);
          g.stroke(CARD_FRAME);
        }
        if (px > 70) {
          g.beginPath();
          g.arc(31.5, 50, 9, 0, Math.PI * 2);
          g.stroke();
        }
        continue;
      }
      const useBmp =
        px > 58 && (chFeat.cur[o.idx] > 0 || chLift.cur[o.idx] > 0.02);
      if (useBmp) {
        const feat = TASKS[state.task].cards.find((c) => c.i === o.idx);
        g.imageSmoothingQuality = "high";
        g.drawImage(cardFace(card, feat || null), 0, 0, 63, 100);
        g.imageSmoothingQuality = "low";
        if (o.lit < 0.99) {
          g.fillStyle = `rgba(18,24,40,${(0.99 - o.lit) * 0.7})`;
          g.fill(CARD_PATH);
        }
        if (o.fog > 0.01) {
          g.fillStyle = css(GROUND, o.fog);
          g.fill(CARD_PATH);
        }
        continue;
      }
      g.fillStyle = shade(stock.rgb, o.lit, o.fog);
      g.fill(CARD_PATH);
      if (px > 20) {
        const ink = stock.dark ? CREAM : INK;
        const fade = 1 - o.fog;
        g.strokeStyle = css(ink, 0.3 * fade);
        g.lineWidth = Math.max(0.8, 78 / px);
        g.stroke(CARD_FRAME);
        if (px > 34) {
          g.fillStyle = stock.dark
            ? `rgba(8,18,32,${0.22 * fade})`
            : `rgba(20,36,58,${0.085 * fade})`;
          g.fill(CARD_WINDOW);
          g.fillStyle = css(ink, 0.62 * fade);
          g.fillRect(6, 57, 30 + hash(o.idx) * 18, 3.6);
          g.fillRect(6, 64, 18 + hash(o.idx + 7) * 20, 3.6);
          g.fillStyle = css(ink, 0.3 * fade);
          g.fillRect(6, 89, 51, 0.8);
        }
        if (px > 64) {
          g.font = "600 5.2px GeistMono, monospace";
          g.fillStyle = css(ink, 0.9 * fade);
          g.fillText(card.code, 6, 10);
        }
      }
    }
    g.globalAlpha = 1;

    // régua do baralho: números sob a fita, a cada vinte cartas
    const rulerA = (1 - smooth(0.04, 0.3, P)) * env.introE;
    if (rulerA > 0.02) {
      T(1, 0, 0, 1, 0, 0);
      g.font = "500 10px GeistMono, monospace";
      g.textAlign = "center";
      g.fillStyle = css(INK, 0.6 * rulerA);
      g.strokeStyle = css(INK, 0.4 * rulerA);
      g.lineWidth = 1;
      for (let i = 0; i < N; i += 1) {
        const mark = i === 0 || (i + 1) % 20 === 0 || i === N - 1;
        if (!mark) continue;
        if (i === N - 1 && N % 20 < 6 && N % 20 !== 0) continue;
        const o = objs[i];
        if (!o.vis) continue;
        const ground = pt(cam, o.x, 0, o.z, v3);
        const bx = ground[0],
          by = ground[1] + 22;
        g.beginPath();
        g.moveTo(bx + 0.5, by);
        g.lineTo(bx + 0.5, by + 9);
        g.stroke();
        g.fillText(pad3(i + 1), bx, by + 23);
      }
      g.textAlign = "left";
    }

    // a mesma luz, agora sobre os objetos
    g.globalCompositeOperation = "soft-light";
    g.globalAlpha = lerp(0.3, 0.44, smooth(0.2, 1.2, P)) * farA;
    drawBlinds();
    if (nearA > 0.01) {
      g.globalAlpha = 0.3 * nearA;
      drawNear();
    }
    if (shadeA > 0.01) {
      g.globalCompositeOperation = "multiply";
      g.globalAlpha = shadeA;
      const span = 2 * BLIND_E * NEAR;
      const q0 = n0,
        q1 = [n0[0] + gx[0] * span, n0[1] + gx[1] * span],
        q3 = [n0[0] + gz[0] * span, n0[1] + gz[1] * span],
        q2 = [q1[0] + gz[0] * span, q1[1] + gz[1] * span];
      T(1, 0, 0, 1, 0, 0);
      g.beginPath();
      g.rect(0, 0, w, h);
      g.moveTo(q0[0], q0[1]);
      g.lineTo(q1[0], q1[1]);
      g.lineTo(q2[0], q2[1]);
      g.lineTo(q3[0], q3[1]);
      g.closePath();
      g.fillStyle = css(SHADE);
      g.fill("evenodd");
      T(gx[0] * u * NEAR, gx[1] * u * NEAR, gz[0] * u * NEAR, gz[1] * u * NEAR, n0[0], n0[1]);
      g.drawImage(blindShade, 0, 0);
    }
    g.globalCompositeOperation = "source-over";
    g.globalAlpha = 1;
    T(1, 0, 0, 1, 0, 0);
  }

  // ---------------------------------------------------------------- vistas, modos e laço
  const stageEl = $("#stage"),
    storyEl = $("#story");
  const chapterEls = $$(".hf-ch");
  const views = [];
  function makeView(canvas, mode, k) {
    return {
      canvas,
      ctx: canvas.getContext("2d", { alpha: false }),
      mode,
      k,
      P: k,
      w: 0,
      h: 0,
      dpr: 1,
      layout: makeLayout(false),
      cams: [],
      visible: mode === "pinned",
      played: false,
    };
  }
  function sizeView(v) {
    const r = v.canvas.getBoundingClientRect();
    v.w = Math.round(r.width);
    v.h = Math.round(r.height);
    if (!v.w || !v.h) return;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (v.w * v.h * dpr * dpr > 5.2e6) dpr = Math.sqrt(5.2e6 / (v.w * v.h));
    v.dpr = dpr;
    const cw = Math.round(v.w * dpr),
      ch = Math.round(v.h * dpr);
    if (v.canvas.width !== cw || v.canvas.height !== ch) {
      v.canvas.width = cw;
      v.canvas.height = ch;
    }
    v.layout = makeLayout(v.w < 560);
    v.trayPath = v.trayLip = null;
    v.cams = camerasFor(v);
  }
  const pinQuery = matchMedia("(min-width: 1080px) and (min-height: 600px)");
  // A coluna de texto fica presa: se não couber na altura da janela, o fim dela
  // nunca apareceria. Tenta o modo compacto e, se ainda não couber, usa os quadros.
  function columnsFit() {
    return chapterEls.every((ch, i) => {
      if (i === 0) return true;
      const col = $(".hf-col", ch);
      const top = parseFloat(getComputedStyle(col).top) || 0;
      return col.offsetHeight <= window.innerHeight - top - 4;
    });
  }
  function choosePinned() {
    const cl = document.body.classList;
    if (!pinQuery.matches || state.motionOff) return [false, false];
    const before = [cl.contains("hf-pinned"), cl.contains("hf-figures"), cl.contains("hf-tight")];
    cl.add("hf-pinned");
    cl.remove("hf-figures", "hf-tight");
    let pinned = columnsFit(),
      tight = false;
    if (!pinned) {
      cl.add("hf-tight");
      pinned = tight = columnsFit();
    }
    cl.toggle("hf-pinned", before[0]);
    cl.toggle("hf-figures", before[1]);
    cl.toggle("hf-tight", before[2]);
    return [pinned, tight];
  }
  const figureObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              const v = views.find((x) => x.canvas === en.target);
              if (!v) return;
              v.visible = en.isIntersecting;
              if (v.visible && !v.played) {
                v.played = true;
                if (!state.motionOff && v.k > 0) {
                  v.P = v.k - 1;
                  v.playFrom = clock + 150;
                }
              }
            });
            wake();
          },
          { rootMargin: "80px 0px", threshold: 0.3 },
        )
      : null;
  function setMode() {
    const [pinned, tight] = choosePinned();
    state.pinned = pinned;
    state.tight = tight;
    document.body.classList.toggle("hf-tight", tight);
    document.body.classList.toggle("hf-pinned", pinned);
    document.body.classList.toggle("hf-figures", !pinned);
    document.body.classList.toggle("motion-off", state.motionOff);
    views.forEach((v) => figureObserver && figureObserver.unobserve(v.canvas));
    views.length = 0;
    if (pinned) views.push(makeView($("#scene"), "pinned", 0));
    else
      $$("[data-figure]").forEach((cv) => {
        const v = makeView(cv, "figure", Number(cv.dataset.figure));
        if (!figureObserver) v.visible = true;
        views.push(v);
        if (figureObserver) figureObserver.observe(cv);
      });
    views.forEach(sizeView);
    if (state.motionOff) {
      env.intro = env.introE = 1;
      views.forEach((v) => {
        v.P = v.mode === "pinned" ? v.P : v.k;
        v.played = true;
      });
    }
    measure();
    applyGroup();
    wake();
  }

  // progresso da história a partir da rolagem (cena presa)
  let tops = [],
    stick = 100,
    Ptarget = 0,
    phaseTarget = 0;
  function measure() {
    const y0 = window.scrollY;
    tops = chapterEls.map((el) => el.getBoundingClientRect().top + y0);
    const col = chapterEls[1] && $(".hf-col", chapterEls[1]);
    stick = col ? parseFloat(getComputedStyle(col).top) || 100 : 100;
  }
  function readScroll() {
    if (!state.pinned) return;
    const vh = window.innerHeight,
      y = window.scrollY;
    let P = 0;
    for (let k = 1; k < tops.length; k++) {
      const a = tops[k] - vh * 0.96,
        b = tops[k] - stick - vh * 0.03;
      P += clamp((y - a) / (b - a));
    }
    Ptarget = forcedP != null ? forcedP : P;
    phaseTarget = clamp((y - tops[0]) / Math.max(1, tops[1] - vh * 0.96 - tops[0]), 0, 1);
    const story = storyEl.getBoundingClientRect();
    $("#rail").classList.toggle(
      "is-on",
      y > tops[1] - vh * 0.7 && story.bottom > vh * 0.6,
    );
    $("#scroll-hint").classList.toggle("is-off", y > 40);
  }
  let lastSec = -1,
    lastVeil = "";
  function chrome(P) {
    const sec = Math.round(clamp(P, 0, 3));
    if (sec !== lastSec) {
      lastSec = sec;
      $("#sec-now").textContent = pad3(sec + 1);
      $$("#rail a").forEach((a, i) =>
        i === sec ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"),
      );
    }
    $("#rail").style.setProperty("--fill", (clamp(P, 0, 3) / 3).toFixed(3));
    const veil = smooth(0.3, 0.8, P).toFixed(2);
    if (veil !== lastVeil) stageEl.style.setProperty("--veil", (lastVeil = veil));
  }

  let raf = 0,
    timer = 0,
    last = 0,
    dirty = true,
    stageOn = true,
    introAt = 0;
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  function wake() {
    dirty = true;
    if (raf || document.hidden) return;
    raf = requestAnimationFrame(tick);
    // painel escondido ou aba em segundo plano podem segurar o rAF
    timer = setTimeout(() => tick(performance.now()), 180);
  }
  // Rede de segurança: se o navegador não conseguir desenhar a cena, a página
  // volta a ser texto corrido, com tudo legível, em vez de ficar com um palco vazio.
  let broken = false;
  function draw(v) {
    if (broken) return;
    try {
      render(v);
    } catch (error) {
      broken = true;
      console.error("home-fable: cena desligada", error);
      document.body.classList.remove("hf-pinned", "hf-figures", "hf-tight");
      views.length = 0;
    }
  }
  function tick(now) {
    if (broken) return;
    cancelAnimationFrame(raf);
    clearTimeout(timer);
    raf = 0;
    const dt = Math.min(64, Math.max(1, now - (last || now - 16)));
    last = now;
    clock = now;
    let busy = false;

    if (!introAt) introAt = now;
    if (env.intro < 1 && !state.motionOff) {
      env.intro = params.has("nointro") ? 1 : clamp((now - introAt - 250) / 2100);
      env.introE = easeOut(env.intro);
      busy = true;
    } else if (env.intro < 1) env.intro = env.introE = 1;

    for (const ch of [chLift, chRaise, chDim, chFeat, chPres])
      if (ch.active) {
        chStep(ch, dt);
        busy = true;
      }

    const k = 1 - Math.exp(-dt / 140);
    for (const key of ["x", "y"]) {
      const target = key === "x" ? ptr.tx : ptr.ty;
      const d = target - ptr[key];
      if (Math.abs(d) > 0.0015) {
        ptr[key] += d * k;
        busy = true;
      }
    }
    env.px = ptr.x;
    env.py = ptr.y;
    const rifT = env.rifT || 0;
    if (Math.abs(rifT - env.rifA) > 0.004) {
      env.rifA += (rifT - env.rifA) * k;
      busy = true;
    }
    if (Math.abs((env.rifST || 0) - env.rifS) > 0.004) {
      env.rifS += ((env.rifST || 0) - env.rifS) * (1 - Math.exp(-dt / 90));
      busy = true;
    }

    for (const v of views) {
      if (v.mode === "pinned") {
        const d = Ptarget - v.P;
        if (Math.abs(d) > 0.0006) {
          v.P += state.motionOff ? d : d * (1 - Math.exp(-dt / 95));
          busy = true;
        } else v.P = Ptarget;
        const dp = phaseTarget * 1.9 - env.phase;
        if (Math.abs(dp) > 0.0008) {
          env.phase += dp * (1 - Math.exp(-dt / 110));
          busy = true;
        }
        chrome(v.P);
        if (stageOn) draw(v);
      } else {
        if (v.playFrom) {
          const kk = clamp((now - v.playFrom) / 1700);
          v.P = v.k - 1 + kk;
          if (kk >= 1) {
            v.P = v.k;
            v.playFrom = 0;
          } else busy = true;
        }
        if (v.visible && (dirty || busy)) draw(v);
      }
      if (broken) return;
    }
    dirty = false;
    if (busy && !document.hidden) {
      raf = requestAnimationFrame(tick);
      timer = setTimeout(() => tick(performance.now()), 180);
    }
  }

  // ponteiro: paralaxe leve, folhear a fita e levantar a carta da grade
  function cellAt(v, clientX, clientY) {
    const cam = v.cam;
    if (!cam) return -1;
    const r = v.canvas.getBoundingClientRect();
    const sx = clientX - r.left,
      sy = clientY - r.top;
    if (sx < 0 || sy < 0 || sx > r.width || sy > r.height) return -1;
    const gx = dir(cam, 1, 0, 0, [0, 0, 0]),
      gz = dir(cam, 0, 0, 1, [0, 0, 0]),
      o = pt(cam, 0, CT, 0, [0, 0, 0]);
    const det = gx[0] * gz[1] - gx[1] * gz[0];
    if (Math.abs(det) < 1e-6) return -1;
    const dx = sx - o[0],
      dy = sy - o[1];
    const wx = (dx * gz[1] - dy * gz[0]) / det,
      wz = (gx[0] * dy - gx[1] * dx) / det;
    const L = v.layout;
    const c = Math.round(wx / L.px + (L.cols - 1) / 2),
      rr = Math.round(wz / L.pz + (L.rows - 1) / 2);
    if (c < 0 || rr < 0 || c >= L.cols || rr >= L.rows) return -1;
    const i = rr * L.cols + c;
    return i < N ? i : -1;
  }
  function onPointer(e, v, tap) {
    if (!v) return;
    const inGrid = Math.abs(v.P - 1) < 0.22;
    if (v.mode === "pinned") {
      ptr.tx = clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1);
      ptr.ty = clamp((e.clientY / window.innerHeight) * 2 - 1, -1, 1);
      if (v.P < 0.25 && v.cam) {
        const cam = v.cam;
        const sy = e.clientY - v.canvas.getBoundingClientRect().top;
        env.rifT = Math.abs(sy - cam.ay) < cam.zoom * 0.95 ? 1 : 0;
        env.rifST = (e.clientX - cam.ax) / (cam.zoom * Math.cos(cam.yaw));
      } else env.rifT = 0;
    }
    if (inGrid && (e.pointerType === "mouse" || tap)) {
      const over = state.pinned && e.target.closest && e.target.closest(".hf-col > *");
      const i = over ? -1 : cellAt(v, e.clientX, e.clientY);
      if (i >= 0) {
        if (i !== state.lifted) setCurrent(i, "pointer");
      } else if (state.liftedBy === "pointer") lift(-1);
    } else if (!inGrid && state.lifted >= 0 && state.liftedBy === "pointer") lift(-1);
    wake();
  }
  window.addEventListener(
    "pointermove",
    (e) => {
      const v = state.pinned ? views[0] : views.find((x) => x.canvas === e.target);
      if (v) onPointer(e, v, false);
    },
    { passive: true },
  );
  window.addEventListener("click", (e) => {
    if (e.target.closest("a,button,summary,input,select,label")) return;
    const v = state.pinned ? views[0] : views.find((x) => x.canvas === e.target);
    if (v) onPointer(e, v, true);
  });
  document.addEventListener("pointerleave", () => {
    ptr.tx = ptr.ty = 0;
    env.rifT = 0;
    wake();
  });

  window.addEventListener(
    "scroll",
    () => {
      readScroll();
      wake();
    },
    { passive: true },
  );
  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const [pinned, tight] = choosePinned();
      if (pinned !== state.pinned || tight !== state.tight) setMode();
      views.forEach(sizeView);
      measure();
      readScroll();
      wake();
    }, 80);
  });
  pinQuery.addEventListener("change", () => {
    setMode();
    readScroll();
  });
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
    state.motionOff = e.matches;
    syncMotion();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      last = 0;
      wake();
    }
  });
  if ("IntersectionObserver" in window)
    new IntersectionObserver((en) => {
      stageOn = en[0].isIntersecting;
      if (stageOn) wake();
    }).observe(stageEl);

  const motionButton = $("#motion-toggle");
  function syncMotion() {
    motionButton.firstElementChild.textContent = t(
      state.motionOff ? "motion.play" : "motion.pause",
    );
    motionButton.setAttribute("aria-pressed", String(state.motionOff));
    const y = window.scrollY;
    setMode();
    window.scrollTo(0, y);
    readScroll();
    if (state.motionOff && views[0] && views[0].mode === "pinned") views[0].P = Ptarget;
  }
  motionButton.hidden = false;
  motionButton.onclick = () => {
    state.motionOff = !state.motionOff;
    syncMotion();
  };

  // ---------------------------------------------------------------- início
  setTask(state.task, true);
  showCurrent();
  syncMotion();
  if (params.has("card")) setCurrent(Number(params.get("card")) - 1, "step");
  if (params.has("group")) {
    const b = $(`[data-group="${Number(params.get("group"))}"]`);
    if (b) b.click();
  }
  if (forcedP != null && views[0]) views[0].P = forcedP;
  window.addEventListener("load", () => {
    views.forEach(sizeView);
    measure();
    readScroll();
    wake();
  });
  // Aquece fontes, caminhos e faces impressas antes da primeira rolagem precisar
  // deles: sem isso o primeiro quadro de cada estado custa bem mais que os outros.
  function warm() {
    const v = views[0];
    if (!v || v.mode !== "pinned" || document.hidden || !v.w) return;
    const keep = v.P;
    for (const P of [0.5, 1, 1.5, 2, 2.5, 3]) {
      v.P = P;
      draw(v);
    }
    v.P = keep;
    draw(v);
  }
  window.addEventListener("load", () => {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 700));
    idle(warm);
  });
  // Atalhos de revisão: ?p=1.5 fixa o estado, ?task=2, ?card=37, ?group=0, ?static, ?nointro.
  window.HomeFable = { state, views, wake, render, setTask, setCurrent };
  wake();
})();
