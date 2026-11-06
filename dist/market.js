"use strict";
const $ = (s) => document.querySelector(s),
  esc = DeckArt.esc;
let skills = [],
  audience = "business",
  limit = 12,
  selected = null,
  requestVersion = 0;
let toastTimer;
function toast(t) {
  $("#toast").textContent = t;
  $("#toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("#toast").hidden = true), 4000);
}
const normalize = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
async function api(url, options) {
  const r = await fetch(url, options);
  if (r.status === 401) {
    location.assign("/");
    throw new Error("Sua sessão expirou. Entre novamente.");
  }
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Não foi possível concluir.");
  return data;
}
function render() {
  const q = normalize($("#search").value),
    group = $("#group").value,
    role = $("#role").value;
  const filtered = skills.filter(
    (s) =>
      (group === "all" || s.category === group) &&
      (role === "all" || s.role === role) &&
      normalize(
        [s.code, s.id, s.title, s.pain, ...s.deliverables].join(" "),
      ).includes(q),
  );
  $("#skill-count").textContent =
    filtered.length + " / " + skills.length + " cartas";
  $("#skill-grid").innerHTML = filtered
    .slice(0, limit)
    .map(
      (s) =>
        `<article class="skill-slot"><button class="card-open" data-open="${esc(s.id)}" aria-label="Explorar ${esc(s.code)}: ${esc(s.title)}">${DeckArt.card(s)}</button><div class="skill-actions"><button class="text-button" data-open="${esc(s.id)}">Explorar carta</button><button class="download" data-download="${esc(s.id)}" aria-label="Baixar ${esc(s.code)}">Baixar skill ↓</button></div></article>`,
    )
    .join("");
  $("#empty").hidden = filtered.length > 0;
  $("#load-more").hidden = filtered.length <= limit;
  DeckArt.tilt($("#skill-grid"));
}
function openSkill(id) {
  const s = skills.find((x) => x.id === id);
  if (!s) return;
  selected = s;
  $("#skill-detail").innerHTML =
    `<div class="detail-layout"><div class="detail-card">${DeckArt.card(s, { spin: true })}<div class="detail-controls"><button class="text-button" id="turn-card" aria-pressed="false">Ver verso</button><button class="text-button" id="spin-card" aria-pressed="true">Pausar giro</button></div></div><div class="detail-content"><p class="code">${esc(s.code)} / ${esc(s.category)}</p><h2 id="detail-title">${esc(s.title)}</h2><p>${esc(s.pain)}</p><h3>O que esta skill ajuda a fazer</h3><ul>${s.deliverables.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><h3>Antes de usar</h3><ul>${s.dependencies.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><button class="btn download-main" id="download-detail">Baixar esta skill <span aria-hidden="true">↓</span></button><p class="availability">Download liberado nesta demonstração</p><p id="download-status" class="download-status" role="status"></p><details class="install-guide"><summary>Como instalar e começar</summary><ol><li>Baixe e extraia o ZIP.</li><li>No Codex, coloque a pasta da skill em <code>~/.codex/skills</code> (pasta do seu usuário). Preserve versões existentes.</li><li>Abra um novo chat e peça: “Use a skill <code>${esc(s.id)}</code> para [sua tarefa]”.</li></ol><p>O pacote inclui SKILL.md, materiais auxiliares e um guia. Plugins e ferramentas exigidos precisam estar disponíveis no seu ambiente.</p></details></div></div>`;
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
  $("#download-detail").onclick = (e) => download(s.id, e.currentTarget);
  DeckArt.tilt($("#skill-detail"));
  $("#skill-dialog").showModal();
}
async function download(id, button) {
  if (button.disabled) return;
  const label = button.innerHTML;
  button.disabled = true;
  button.textContent = "Preparando ZIP…";
  const status = $("#download-status");
  if (status) status.textContent = "";
  try {
    const r = await fetch("/api/download?id=" + encodeURIComponent(id), {
      signal: AbortSignal.timeout(30000),
    });
    if (r.status === 401) {
      location.assign("/");
      return;
    }
    if (!r.ok) {
      const data = await r.json();
      throw new Error(data.error || "Download indisponível.");
    }
    const blob = await r.blob();
    if (!String(r.headers.get("content-type")).includes("application/zip"))
      throw new Error("O servidor não retornou um pacote válido.");
    const s = skills.find((x) => x.id === id),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `${s.code}-${id}.zip`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    toast("Skill pronta. Confira os downloads do navegador.");
    if (status)
      status.textContent =
        "Pacote baixado. Extraia o ZIP e siga o arquivo COMO-USAR.md.";
  } catch (e) {
    const message =
      e.name === "TimeoutError"
        ? "O download demorou. Tente novamente."
        : e.message;
    if (status) status.textContent = message;
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
      "Conte um pouco mais sobre o problema (mínimo de 12 caracteres).";
    $("#problem").focus();
    return;
  }
  const version = ++requestVersion;
  $("#finder-error").textContent = "";
  $("#find-skills").disabled = true;
  $("#find-skills").textContent = "Encontrando capacidades…";
  try {
    const result = await api("/api/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem, audience, useAI: $("#use-ai").checked }),
      signal: AbortSignal.timeout(20000),
    });
    if (version !== requestVersion) return;
    $("#matches").hidden = false;
    $("#match-summary").textContent =
      result.summary +
      (result.mode === "ai"
        ? " Indicação assistida por IA."
        : " Correspondência por capacidades do catálogo.") +
      (result.notice ? " " + result.notice : "");
    $("#match-grid").innerHTML = result.matches
      .map((m, i) => {
        const s = skills.find((x) => x.id === m.id);
        if (!s) return "";
        return `<article class="match-item"><p class="mini-heading">${esc(s.code)} / ${i === 0 ? "Comece por aqui" : "Também pode ajudar"}</p><h3>${esc(s.title)}</h3><p>${esc(m.reason)}</p><p><strong>Primeiro passo:</strong> ${esc(m.nextStep)}</p><div class="match-actions"><button class="btn" data-download="${esc(s.id)}">Baixar skill ↓</button><button class="btn secondary" data-open="${esc(s.id)}">Ver carta ↗</button></div></article>`;
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
      $("#find-skills").innerHTML =
        'Encontrar minha skill <span aria-hidden="true">↗</span>';
    }
  }
}
document.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open]"),
    down = e.target.closest("[data-download]");
  if (open) openSkill(open.dataset.open);
  if (down) download(down.dataset.download, down);
});
$("#close-detail").onclick = () => $("#skill-dialog").close();
$("#skill-dialog").addEventListener("click", (e) => {
  if (e.target === $("#skill-dialog")) {
    const r = e.target.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      e.target.close();
  }
});
$("#finder").onsubmit = (e) => {
  e.preventDefault();
  find();
};
document.querySelectorAll("[data-example]").forEach(
  (b) =>
    (b.onclick = () => {
      $("#problem").value = b.dataset.example;
      find();
    }),
);
document.querySelectorAll("[data-audience]").forEach(
  (b) =>
    (b.onclick = () => {
      audience = b.dataset.audience;
      document
        .querySelectorAll("[data-audience]")
        .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    }),
);
$("#search").oninput = () => {
  limit = 12;
  render();
};
$("#group").onchange = $("#role").onchange = () => {
  limit = 12;
  render();
};
$("#load-more").onclick = () => {
  limit += 12;
  render();
};
$("#clear-matches").onclick = () => {
  $("#matches").hidden = true;
  $("#problem").focus();
};
$("#logout").onclick = async () => {
  try {
    await api("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    location.assign("/");
  } catch {
    toast("Não foi possível sair. Tente novamente.");
  }
};
(async () => {
  try {
    const data = await api("/api/catalog");
    skills = data.skills;
    $("#group").insertAdjacentHTML(
      "beforeend",
      [...new Set(skills.map((s) => s.category))]
        .sort()
        .map((g) => `<option value="${esc(g)}">${esc(g)}</option>`)
        .join(""),
    );
    render();
    const status = await api("/api/status");
    $("#ai-choice").hidden = !status.aiConfigured;
  } catch (e) {
    $("#load-error").textContent = e.message;
  }
})();
