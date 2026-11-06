"use strict";
const $ = (s) => document.querySelector(s),
  esc = DeckArt.esc;
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
  $("#mission-card").innerHTML = DeckArt.card(m.card);
  $("#mission-card").setAttribute(
    "aria-label",
    "Virar " + m.card.code + ": " + m.card.title,
  );
  $("#mission-code").textContent = m.card.code + " / " + m.card.category;
  $("#mission-title").textContent = m.example.title;
  $("#mission-before").textContent = m.example.before;
  $("#mission-after").textContent = m.example.expected;
  $("#flip-preview").textContent = "Ver verso da carta";
  $("#flip-preview").setAttribute("aria-pressed", "false");
  document
    .querySelectorAll("[data-mission]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", Number(b.dataset.mission) === index),
    );
  $("#wait-interest").value = m.id;
  const story = $(".mission-story");
  story.classList.remove("revealing");
  requestAnimationFrame(() => story.classList.add("revealing"));
  DeckArt.tilt($("#mission-card"));
  DeckArt.tilt($("#fan-main"));
}
$("#mission-tabs").innerHTML = PublicPreview.map(
  (m, i) =>
    `<button data-mission="${i}" aria-pressed="${i === 0}">${esc(m.short)}</button>`,
).join("");
document.querySelectorAll("[data-mission]").forEach(
  (b) =>
    (b.onclick = () => {
      reveal(Number(b.dataset.mission));
      play();
    }),
);
function flip() {
  const c = $("#mission-card .holo-card"),
    on = c.classList.toggle("flipped");
  $("#flip-preview").setAttribute("aria-pressed", on);
  $("#flip-preview").textContent = on
    ? "Ver frente da carta"
    : "Ver verso da carta";
  play();
}
$("#flip-preview").onclick = flip;
$("#mission-card").onclick = flip;
$("#fan-main").onclick = () => {
  reveal((active + 1) % PublicPreview.length);
  play();
  $("#missions").scrollIntoView({
    behavior: paused ? "instant" : "smooth",
    block: "start",
  });
};
$("#landing-sound").onclick = () => {
  sound = !sound;
  DeckSound.set(sound);
  $("#landing-sound").textContent = sound ? "Som ativado" : "Ativar som";
  $("#landing-sound").setAttribute("aria-pressed", sound);
  if (sound) play();
};
function motion() {
  document.body.classList.toggle("motion-off", paused);
  $("#landing-motion").textContent = paused
    ? "Ativar movimento"
    : "Pausar movimento";
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
  $("#preview-prompt").textContent =
    "Use a skill " + m.card.id + ". " + m.example.task;
  $("#preview-limits").textContent = m.example.limitation;
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
    }),
);
$("#waitlist-form").onsubmit = async (e) => {
  e.preventDefault();
  const button = $("#join-waitlist");
  if (button.disabled) return;
  button.disabled = true;
  button.textContent = "Registrando seu interesse…";
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
      headers: { "Content-Type": "application/json" },
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
        : error.message;
    button.disabled = false;
    button.innerHTML = "Entrar na lista de espera <span>↗</span>";
  }
};
reveal(0);
$("#wait-interest").value = "explore";
motion();
