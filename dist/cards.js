"use strict";
const selectedSkills = new Set();
const roleLabels = {
  offer: "Aplicação em projetos",
  support: "Apoio técnico",
  "platform-specific": "Requer plataforma",
};
const groupNames = [...new Set(SKILLS.map((s) => s.category))].sort((a, b) =>
  a.localeCompare(b, "pt-BR"),
);
let skillQuery = "",
  skillGroup = "all",
  skillRole = "all",
  skillLimit = 12,
  showcaseIndex = 0;
const highlights = [
  "power-bi-modelagem-dax-performance",
  "ia-aplicada-a-produtos",
  "automacao-documentos-office",
  ...SKILLS.map((s) => s.id),
]
  .filter((s, i, a) => a.indexOf(s) === i)
  .map((id) => SKILLS.find((s) => s.id === id))
  .filter(Boolean);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let motionPaused = reducedMotion.matches;
function hue(s) {
  return [164, 193, 212, 260, 36, 320][groupNames.indexOf(s.category) % 6];
}
function art(s) {
  const n = Number(s.code.slice(3));
  const variant = n % 4;
  let shapes = "";
  if (variant === 0) {
    for (let i = 0; i < 5; i++)
      shapes += `<ellipse cx="150" cy="93" rx="${38 + i * 16}" ry="${17 + i * 9}" transform="rotate(${i * 18 - 35} 150 93)"/>`;
  } else if (variant === 1) {
    for (let i = 0; i < 4; i++)
      shapes += `<path d="M150 ${18 + i * 17} L${255 - i * 18} 91 L150 ${164 - i * 15} L${45 + i * 18} 91 Z"/>`;
  } else if (variant === 2) {
    for (let i = 0; i < 7; i++) {
      const a = (i * Math.PI * 2) / 7,
        x = 150 + 88 * Math.cos(a),
        y = 93 + 65 * Math.sin(a);
      shapes += `<path d="M150 93 L${x} ${y}"/><circle cx="${x}" cy="${y}" r="9"/>`;
    }
    shapes += '<circle cx="150" cy="93" r="50"/>';
  } else {
    for (let i = 0; i < 6; i++)
      shapes += `<path d="M${48 + i * 19} ${54 + i * 6} L${148 + i * 17} ${22 + i * 9} L${252 - i * 10} ${106 + i * 7} L${147 - i * 17} ${161 - i * 6} Z"/>`;
  }
  return `<svg viewBox="0 0 300 185" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".8" opacity=".55">${shapes}<path d="M15 15h25M15 15v20M285 15h-25M285 15v20M15 170h25M285 170h-25"/></g></svg><img class="art-logo" src="assets/drivedata-logo.png" alt="" loading="lazy"><span class="art-code">${esc(s.code)} / CAPABILITY</span>`;
}
function cardMarkup(s, spin = false) {
  return `<div class="skill-card ${spin ? "showcase-spin" : ""}" style="--hue:${hue(s)}" data-card="${esc(s.id)}"><div class="card-face card-front"><div class="card-head"><img src="assets/drivedata-logo.png" alt=""><span>${esc(s.code)}</span><span class="edition">HOLO / 01</span></div><div class="card-art">${art(s)}</div><div class="card-caption"><span class="card-type">${esc(s.category)}</span><h3>${esc(s.title)}</h3><p>${esc(s.deliverables[0] || s.pain)}</p></div><div class="card-serial"><span>${esc(roleLabels[s.role])}</span><span>DRIVEDATA ◆</span></div></div><div class="card-face card-back" aria-hidden="true"><img src="assets/drivedata-logo.png" alt=""><strong>${esc(s.code)}</strong><ul>${s.deliverables
    .slice(0, 3)
    .map((x) => `<li>${esc(x)}</li>`)
    .join("")}</ul><small>DRIVEDATA / SKILL COLLECTION</small></div></div>`;
}
function bindTilt(container) {
  container
    .querySelectorAll(".skill-card:not(.showcase-spin)")
    .forEach((card) => {
      card.onpointermove = (e) => {
        if (
          reducedMotion.matches ||
          e.pointerType !== "mouse" ||
          card.classList.contains("flipped")
        )
          return;
        const r = card.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width,
          y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--rx", (0.5 - y) * 14 + "deg");
        card.style.setProperty("--ry", (x - 0.5) * 20 + "deg");
        card.style.setProperty("--mx", x * 100 + "%");
        card.style.setProperty("--my", y * 100 + "%");
      };
      card.onpointerleave = () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      };
    });
}
function renderSkills() {
  const q = normalize(skillQuery);
  const filtered = SKILLS.filter(
    (s) =>
      (skillGroup === "all" || s.category === skillGroup) &&
      (skillRole === "all" || s.role === skillRole) &&
      normalize(
        [s.code, s.id, s.title, s.pain, s.category, ...s.deliverables].join(
          " ",
        ),
      ).includes(q),
  );
  $("#skill-count").textContent = filtered.length + " / 137 cartas";
  $("#skill-empty").hidden = !!filtered.length;
  $("#more-skills").hidden = filtered.length <= skillLimit;
  $("#skill-cards").innerHTML = filtered
    .slice(0, skillLimit)
    .map(
      (s) =>
        `<article class="skill-slot">${cardMarkup(s)}<div class="skill-actions"><button data-skill-detail="${esc(s.id)}" aria-label="Explorar ${esc(s.code)} ${esc(s.title)}">Explorar carta ↗</button><button class="flip" data-flip="${esc(s.id)}" aria-label="Virar ${esc(s.code)}" aria-pressed="false">Virar</button><button class="collect" data-collect="${esc(s.id)}" aria-label="${selectedSkills.has(s.id) ? "Remover" : "Selecionar"} ${esc(s.code)}" aria-pressed="${selectedSkills.has(s.id)}">${selectedSkills.has(s.id) ? "✓" : "+"}</button></div></article>`,
    )
    .join("");
  bindTilt($("#skill-cards"));
}
function toggleSkill(id) {
  if (selectedSkills.has(id)) selectedSkills.delete(id);
  else selectedSkills.add(id);
  updateCount();
  renderSkills();
  toast(
    selectedSkills.has(id)
      ? "Carta incluída no briefing."
      : "Carta removida do briefing.",
  );
}
const originalUpdateCount = updateCount;
updateCount = () => {
  $("#count").textContent = state.selected.size + selectedSkills.size;
};
function showSkill(id) {
  const s = SKILLS.find((s) => s.id === id);
  if (!s) return;
  $("#skill-detail").innerHTML =
    `<div class="dialog-kicker mono">${esc(s.code)} / Coleção holográfica</div><h2 id="skill-title">${esc(s.title)}</h2><div class="skill-detail-layout"><div>${cardMarkup(s)}<button class="text-link detail-flip" style="margin-top:15px" aria-pressed="false">Virar carta</button></div><div><h3>Para que serve</h3><p>${esc(s.pain)}</p><h3>Capacidades</h3><ul>${s.deliverables.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><h3>O que precisa estar disponível</h3><ul>${s.dependencies.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><p class="fine">${esc(roleLabels[s.role])}. Uso sujeito à avaliação de escopo e compatibilidade.${s.variantOf ? " Variante de outra skill da coleção." : ""}</p></div></div><div class="dialog-actions"><button id="collect-detail" class="btn primary">${selectedSkills.has(id) ? "Remover do briefing" : "Incluir no briefing"}</button><button id="skill-to-brief" class="btn secondary">Ver meu briefing</button></div>${s.offers.length ? `<h3>Soluções relacionadas</h3><div class="tags">${s.offers.map((o) => `<button class="tag" data-skill-offer="${esc(o)}">${esc(SOLUTIONS.find((x) => x.id === o)?.title || o)} ↗</button>`).join("")}</div>` : ""}`;
  $("#collect-detail").onclick = () => {
    toggleSkill(id);
    $("#collect-detail").textContent = selectedSkills.has(id)
      ? "Remover do briefing"
      : "Incluir no briefing";
  };
  $("#skill-to-brief").onclick = showBrief;
  $("#skill-detail .detail-flip").onclick = (e) => {
    const c = $("#skill-detail .skill-card"),
      on = c.classList.toggle("flipped");
    e.target.setAttribute("aria-pressed", on);
    e.target.textContent = on ? "Ver frente" : "Virar carta";
  };
  $$("[data-skill-offer]").forEach(
    (b) => (b.onclick = () => showDetail(b.dataset.skillOffer)),
  );
  bindTilt($("#skill-detail"));
  openDialog("#skill-dialog");
}
function showcase() {
  const s = highlights[showcaseIndex];
  $("#showcase-card").innerHTML = cardMarkup(s, true);
  $("#showcase-code").textContent =
    s.code + " / " + String(showcaseIndex + 1).padStart(2, "0");
  $("#showcase-card").setAttribute("role", "button");
  $("#showcase-card").tabIndex = 0;
  $("#showcase-card").setAttribute("aria-label", "Explorar carta " + s.title);
  $("#showcase-card").onclick = () => showSkill(s.id);
  $("#showcase-card").onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      showSkill(s.id);
    }
  };
}
function motionUI() {
  document.body.classList.toggle("motion-paused", motionPaused);
  $("#motion-toggle").textContent = motionPaused
    ? "Ativar giro"
    : "Pausar giro";
  $("#motion-toggle").setAttribute("aria-pressed", String(motionPaused));
}
$("#motion-toggle").onclick = () => {
  motionPaused = !motionPaused;
  motionUI();
};
reducedMotion.onchange = (e) => {
  motionPaused = e.matches;
  motionUI();
};
document.addEventListener("visibilitychange", () => {
  document.body.classList.toggle(
    "motion-paused",
    motionPaused || document.hidden,
  );
});
$("#previous-card").onclick = () => {
  showcaseIndex = (showcaseIndex + highlights.length - 1) % highlights.length;
  showcase();
};
$("#next-card").onclick = () => {
  showcaseIndex = (showcaseIndex + 1) % highlights.length;
  showcase();
};
$("#skill-group").insertAdjacentHTML(
  "beforeend",
  groupNames
    .map((g) => `<option value="${esc(g)}">${esc(g)}</option>`)
    .join(""),
);
$("#skill-search").oninput = (e) => {
  skillQuery = e.target.value;
  skillLimit = 12;
  renderSkills();
};
$("#skill-group").onchange = (e) => {
  skillGroup = e.target.value;
  skillLimit = 12;
  renderSkills();
};
$("#skill-role").onchange = (e) => {
  skillRole = e.target.value;
  skillLimit = 12;
  renderSkills();
};
$("#more-skills").onclick = () => {
  skillLimit += 12;
  renderSkills();
};
$("#skill-cards").onclick = (e) => {
  const detail = e.target.closest("[data-skill-detail]"),
    collect = e.target.closest("[data-collect]"),
    flip = e.target.closest("[data-flip]");
  if (detail) showSkill(detail.dataset.skillDetail);
  if (collect) {
    toggleSkill(collect.dataset.collect);
    $(`[data-collect="${collect.dataset.collect}"]`)?.focus();
  }
  if (flip) {
    const c = flip.closest("article").querySelector(".skill-card"),
      on = c.classList.toggle("flipped");
    flip.setAttribute("aria-pressed", on);
    flip.textContent = on ? "Frente" : "Virar";
  }
};
const oldDetail = showDetail;
showDetail = (id) => {
  oldDetail(id);
  const related = SKILLS.filter((s) => s.offers.includes(id));
  if (related.length) {
    $("#detail-body").insertAdjacentHTML(
      "beforeend",
      `<h3>Cartas desta solução</h3><div class="tags">${related.map((s) => `<button class="tag" data-related-skill="${esc(s.id)}">${esc(s.code)} · ${esc(s.title)}</button>`).join("")}</div>`,
    );
    $$("[data-related-skill]").forEach(
      (b) => (b.onclick = () => showSkill(b.dataset.relatedSkill)),
    );
  }
};
renderSkills();
showcase();
motionUI();
