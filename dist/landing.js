"use strict";
const $ = (s) => document.querySelector(s),
  esc = DeckArt.esc;
document.querySelectorAll("[data-public-problem]").forEach((a) => {
  a.href =
    "/problemas/" +
    a.dataset.publicProblem +
    "/" +
    (DeckI18n.locale === "pt" ? "" : DeckI18n.locale + "/") +
    "?lang=" +
    DeckI18n.locale;
});
document.querySelectorAll("[data-work-pack]").forEach((a) => {
  a.href = DeckI18n.url(
    "/app?mode=work&pack=" + encodeURIComponent(a.dataset.workPack),
  );
});
let active = 0,
  paused = matchMedia("(prefers-reduced-motion: reduce)").matches,
  sound = false;
function play() {
  if (sound) {
    DeckSound.set(true);
    DeckSound.play();
  }
}
function reveal(index) {
  active = index;
  const m = PublicPreview[index];
  $("#fan-main").innerHTML = DeckArt.card(m.card);
  $("#fan-left").innerHTML = DeckArt.card(
    PublicPreview[(index + 1) % PublicPreview.length].card,
  );
  $("#fan-right").innerHTML = DeckArt.card(
    PublicPreview[(index + 2) % PublicPreview.length].card,
  );
  $("#fan-main").setAttribute(
    "aria-label",
    DeckI18n.t("Virar {code}: {title}", {
      code: m.card.code,
      title: m.card.title,
    }),
  );
  $("#mission-code").textContent = m.card.code + " / " + m.card.category;
  $("#mission-title").textContent = m.example.title;
  $("#mission-before").textContent = m.example.before;
  $("#selected-skill-name").textContent = m.card.title;
  $("#example-file").textContent = taskLabels[index].file;
  $("#output-preview").innerHTML = renderExample(m.example);
  $("#fan-main").setAttribute("aria-pressed", "false");
  document
    .querySelectorAll("[data-mission]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", Number(b.dataset.mission) === index),
    );
  $("#wait-interest").value = m.id;
  const story = $(".example-content");
  story.classList.remove("changing");
  requestAnimationFrame(() => story.classList.add("changing"));
  DeckI18n.apply();
}
const taskLabels = [
  {
    short: "Conferir uma planilha",
    pain: "Minha planilha não fecha.",
    file: "Conferência de margem",
  },
  {
    short: "Revisar um Power BI",
    pain: "Meu indicador não bate.",
    file: "Conciliação do indicador",
  },
  {
    short: "Prototipar uma ideia",
    pain: "Minha ideia ainda está solta.",
    file: "Escopo do portal",
  },
  {
    short: "Organizar meu conteúdo",
    pain: "Minha oferta precisa ficar clara.",
    file: "Rascunho de publicação",
  },
];
const number = (n) =>
  new Intl.NumberFormat(DeckI18n.intlLocale, {
    maximumFractionDigits: 2,
  }).format(n);
const percent = (n) =>
  new Intl.NumberFormat(DeckI18n.intlLocale, {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(n);
function renderExample(e) {
  const r = e.result;
  if (e.kind === "margin")
    return `<table><caption>Valores de uma amostra de vendas</caption><thead><tr><th scope="col">Produto</th><th scope="col">Receita</th><th scope="col">Custo</th><th scope="col">Lucro</th></tr></thead><tbody>${e.input.rows.map((row) => `<tr><th scope="row">${esc(row.product)}</th><td>${number(row.revenue)}</td><td>${number(row.cost)}</td><td>${number(row.revenue - row.cost)}</td></tr>`).join("")}</tbody><tfoot><tr><th scope="row">Total</th><td>${number(r.revenue)}</td><td>${number(r.cost)}</td><td>${number(r.profit)}</td></tr></tfoot></table><div class="calculation-result"><div><span>Margem consolidada</span><strong>${percent(r.margin)}</strong></div><p>${esc(DeckI18n.t("{profit} de lucro ÷ {revenue} de receita.", { profit: number(r.profit), revenue: number(r.revenue) }))}<br>A margem é calculada pelos totais.</p></div>`;
  if (e.kind === "reconcile")
    return `<table><caption>Receita por mês: fonte e relatório</caption><thead><tr><th scope="col">Mês</th><th scope="col">Fonte</th><th scope="col">Relatório</th><th scope="col">Diferença</th></tr></thead><tbody>${r.rows.map((row) => `<tr><th scope="row">${esc(row.month)}</th><td>${number(row.source)}</td><td>${number(row.report)}</td><td class="${row.difference ? "difference" : ""}">${row.difference > 0 ? "+" : ""}${number(row.difference)}</td></tr>`).join("")}</tbody></table><div class="calculation-result"><div><span>Diferença localizada em Fev</span><strong>+${number(r.totalDifference)}</strong></div><p>O desvio foi localizado. A causa ainda precisa ser investigada.</p></div><p class="result-note">Próxima conferência: filtros, duplicidades e regra de reconhecimento em fevereiro.</p>`;
  if (e.kind === "requirements")
    return `<ol class="spec-flows">${r.flows.map((f) => `<li><span>${esc(f.role)}</span><strong>${esc(f.screen)}</strong><p>${esc(f.acceptance)}</p></li>`).join("")}</ol><p class="result-note">Ainda a definir: permissões, persistência e integrações.</p>`;
  if (e.kind === "content")
    return `<blockquote class="content-draft">${esc(r.draft)}</blockquote><p class="content-status">Rascunho para revisão. Sem clientes, depoimentos ou números inventados.</p>`;
  return `<p>${esc(e.expected)}</p>`;
}
$("#mission-tabs").innerHTML = PublicPreview.map(
  (m, i) =>
    `<button data-mission="${i}" aria-pressed="${i === 0}" aria-controls="output-preview">${esc(taskLabels[i].pain)}</button>`,
).join("");
$("#hero-tasks").innerHTML = PublicPreview.map(
  (m, i) =>
    `<button data-mission="${i}" aria-pressed="${i === 0}" aria-controls="fan-main">${esc(taskLabels[i].short)}</button>`,
).join("");
document.querySelectorAll("[data-mission]").forEach(
  (b) =>
    (b.onclick = () => {
      reveal(Number(b.dataset.mission));
      play();
    }),
);
function flip() {
  const c = $("#fan-main .holo-card"),
    on = c.classList.toggle("flipped");
  $("#fan-main").setAttribute("aria-pressed", on);
  $("#fan-main").setAttribute(
    "aria-label",
    DeckI18n.t(on ? "Ver frente de {code}: {title}" : "Virar {code}: {title}", {
      code: PublicPreview[active].card.code,
      title: PublicPreview[active].card.title,
    }),
  );
  play();
}
$("#fan-main").onclick = flip;
$("#landing-sound").onclick = () => {
  sound = !sound;
  DeckSound.set(sound);
  $("#landing-sound").textContent = sound ? "Som ativado" : "Ativar som";
  DeckI18n.apply($("#landing-sound"));
  $("#landing-sound").setAttribute("aria-pressed", sound);
  if (sound) play();
};
function motion() {
  document.body.classList.toggle("motion-off", paused);
  $("#landing-motion").textContent = paused
    ? "Ativar movimento"
    : "Pausar movimento";
  DeckI18n.apply($("#landing-motion"));
  $("#landing-motion").setAttribute("aria-pressed", paused);
}
$("#landing-motion").onclick = () => {
  paused = !paused;
  motion();
};
matchMedia("(prefers-reduced-motion: reduce)").addEventListener(
  "change",
  (e) => {
    paused = e.matches;
    motion();
  },
);
document.addEventListener("visibilitychange", () =>
  document.body.classList.toggle("motion-off", paused || document.hidden),
);
$("#universe").onpointermove = (e) => {
  if (paused || e.pointerType !== "mouse") return;
  const r = e.currentTarget.getBoundingClientRect(),
    x = (e.clientX - r.left) / r.width,
    y = (e.clientY - r.top) / r.height;
  e.currentTarget.style.setProperty("--ux", `${(0.5 - y) * 7}deg`);
  e.currentTarget.style.setProperty("--uy", `${(x - 0.5) * 10}deg`);
};
$("#universe").onpointerleave = () => {
  $("#universe").style.setProperty("--ux", "0deg");
  $("#universe").style.setProperty("--uy", "0deg");
};
$("#preview-details").onclick = () => {
  const m = PublicPreview[active];
  $("#preview-title").textContent = m.example.title;
  $("#preview-prompt").textContent = DeckI18n.t("Use a skill {id}. {task}", {
    id: m.card.id,
    task: m.example.task,
  });
  $("#preview-limits").textContent = m.example.limitation;
  $("#preview-checks").innerHTML = m.example.checks
    .map((c) => `<li>${esc(c)}</li>`)
    .join("");
  DeckI18n.apply($("#preview-dialog"));
  $("#preview-dialog").showModal();
};
$("#close-preview").onclick = () => $("#preview-dialog").close();
$("#preview-join").onclick = () => $("#preview-dialog").close();
document.querySelectorAll("[data-join-audience]").forEach(
  (b) =>
    (b.onclick = () => {
      $("#wait-audience").value = b.dataset.joinAudience;
      $("#waitlist").scrollIntoView({
        behavior: paused ? "instant" : "smooth",
        block: "start",
      });
      $("#wait-name").focus({ preventScroll: true });
    }),
);
$("#waitlist-form").onsubmit = async (e) => {
  e.preventDefault();
  const button = $("#join-waitlist");
  if (button.disabled) return;
  button.disabled = true;
  button.textContent = "Registrando seu interesse…";
  DeckI18n.apply(button);
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
      headers: DeckI18n.headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(15000),
    });
    const data = await r.json();
    if (!r.ok)
      throw new Error(data.error || "Não foi possível concluir o cadastro.");
    $("#waitlist-form").reset();
    $("#waitlist-form").hidden = true;
    $("#waitlist-success").hidden = false;
    $("#waitlist-success").focus();
    play();
  } catch (error) {
    $("#waitlist-error").textContent =
      error.name === "TimeoutError"
        ? "A conexão demorou. Seu cadastro pode ter sido recebido; tentar de novo não cria duplicatas."
        : error.name === "TypeError"
          ? "Não foi possível conectar. Confira sua conexão e tente novamente."
          : error.name === "SyntaxError"
            ? "Não foi possível concluir o cadastro."
            : error.message;
    button.disabled = false;
    button.innerHTML =
      'Entrar na lista de espera <span aria-hidden="true">↗</span>';
    DeckI18n.apply($("#waitlist-form"));
  }
};
reveal(0);
$("#wait-interest").value = "explore";
motion();
