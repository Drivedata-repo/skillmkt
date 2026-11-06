"use strict";
const $ = (s) => document.querySelector(s);
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const demoCards = [
  {
    id: "power-bi-modelagem-dax-performance",
    code: "DD-111",
    category: "Dados & inteligência",
    title: "Indicadores confiáveis e Power BI mais eficiente",
    role: "offer",
    deliverables: ["Diagnóstico do modelo e medidas"],
  },
  {
    id: "ia-aplicada-a-produtos",
    code: "DD-092",
    category: "Automação & IA",
    title: "Assistentes e copilotos com contexto do negócio",
    role: "offer",
    deliverables: ["Assistente integrado ao produto"],
  },
  {
    id: "design-de-interface-autoral",
    code: "DD-050",
    category: "Design & experiência",
    title: "Interfaces claras e com identidade",
    role: "offer",
    deliverables: ["Diagnóstico de experiência e interface"],
  },
];
$("#scene-main").innerHTML = DeckArt.card(demoCards[0], { spin: true });
$("#scene-left").innerHTML = DeckArt.card(demoCards[1]);
$("#scene-right").innerHTML = DeckArt.card(demoCards[2]);
DeckArt.tilt(document.querySelector(".login-scene"));
let sound = true,
  audioCtx,
  paused = reduced.matches;
try {
  sound = localStorage.getItem("drivedeck-sound") !== "off";
} catch {}
function updateSound() {
  $("#sound").setAttribute("aria-pressed", String(sound));
  $("#sound-label").textContent = sound ? "Som ativado" : "Som desativado";
}
function prepareAudio() {
  if (!sound) return;
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  } catch {}
}
function tone(kind = "tap") {
  if (!sound || !audioCtx || audioCtx.state !== "running") return;
  const now = audioCtx.currentTime;
  const master = audioCtx.createGain();
  master.gain.value = 0.065;
  master.connect(audioCtx.destination);
  const notes =
    kind === "unlock"
      ? [220, 440, 659.25, 880, 1318.5]
      : kind === "error"
        ? [196, 164.8]
        : [523.25, 783.99];
  notes.forEach((hz, i) => {
    const o = audioCtx.createOscillator(),
      g = audioCtx.createGain();
    o.type = i === 0 ? "sine" : "triangle";
    o.frequency.setValueAtTime(hz * 0.98, now + i * 0.09);
    o.frequency.exponentialRampToValueAtTime(hz, now + i * 0.09 + 0.035);
    g.gain.setValueAtTime(0, now + i * 0.09);
    g.gain.linearRampToValueAtTime(0.45, now + i * 0.09 + 0.018);
    g.gain.exponentialRampToValueAtTime(
      0.001,
      now + i * 0.09 + (kind === "unlock" ? 0.7 : 0.25),
    );
    o.connect(g);
    g.connect(master);
    o.start(now + i * 0.09);
    o.stop(now + i * 0.09 + 0.8);
  });
  setTimeout(() => master.disconnect(), 2000);
}
$("#sound").onclick = () => {
  sound = !sound;
  try {
    localStorage.setItem("drivedeck-sound", sound ? "on" : "off");
  } catch {}
  updateSound();
  prepareAudio();
  if (sound) setTimeout(() => tone(), 70);
};
$("#show-password").onclick = () => {
  const show = $("#password").type === "password";
  $("#password").type = show ? "text" : "password";
  $("#show-password").textContent = show ? "Ocultar" : "Mostrar";
  $("#show-password").setAttribute("aria-pressed", String(show));
};
function motionUI() {
  document.body.classList.toggle("motion-off", paused);
  $("#motion").textContent = paused ? "Ativar movimento" : "Pausar movimento";
  $("#motion").setAttribute("aria-pressed", String(paused));
}
$("#motion").onclick = () => {
  paused = !paused;
  motionUI();
};
reduced.onchange = (e) => {
  paused = e.matches;
  motionUI();
};
document.addEventListener("visibilitychange", () =>
  document.body.classList.toggle("motion-off", paused || document.hidden),
);
$("#access-form").onsubmit = async (e) => {
  e.preventDefault();
  prepareAudio();
  const button = $("#enter");
  button.disabled = true;
  button.innerHTML = 'Verificando acesso <span aria-hidden="true">↗</span>';
  $("#login-error").textContent = "";
  try {
    const response = await fetch("/api/session", {
      method: "POST",
      headers: DeckI18n.headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ password: $("#password").value }),
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Não foi possível entrar.");
    $("#password").value = "";
    tone("unlock");
    document.body.classList.add("entering");
    $("#entry-status").textContent = "ACESSO LIBERADO";
    setTimeout(
      () => location.assign(DeckI18n.url("/app")),
      reduced.matches ? 0 : 900,
    );
  } catch (error) {
    tone("error");
    $("#login-error").textContent =
      error.name === "TimeoutError"
        ? "A conexão demorou. Tente novamente."
        : error.name === "TypeError"
          ? "Não foi possível conectar. Confira sua conexão e tente novamente."
          : error.name === "SyntaxError"
            ? "Não foi possível entrar."
            : error.message;
    button.disabled = false;
    button.innerHTML =
      'Desbloquear minha próxima capacidade <span aria-hidden="true">↗</span>';
    $("#password").focus();
  }
};
updateSound();
motionUI();
