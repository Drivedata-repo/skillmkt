"use strict";
const DeckInvocation = (() => {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const t = (s, p) => DeckI18n.t(s, p);
  let active = null, soft = false;
  try { soft = localStorage.getItem("drivedeck-invocation-motion") === "reduced"; } catch {}
  const reduced = () => soft || matchMedia("(prefers-reduced-motion: reduce)").matches || document.body.classList.contains("motion-off");
  const profile = s => DeckInvocationProfiles.forPrice(s.pricing);
  function style(p) { return `--summon-rgb:${p.rgb};--summon-color:${p.color};--summon-duration:${p.durationMs}ms`; }
  function field(p) {
    const rays = Array.from({length: p.rank === 9 ? 24 : 12}, (_, i) => `<path d="M180 20v${i % 2 ? 24 : 45}" transform="rotate(${i * (p.rank === 9 ? 15 : 30)} 180 180)"/>`).join("");
    const stars = Array.from({length: p.particles}, (_, i) => {
      const angle = i * 2.39996, r = 126 + (i % 4) * 11;
      return `<i class="summon-particle" style="--px:${Math.round(Math.cos(angle) * r)}px;--py:${Math.round(Math.sin(angle) * r)}px;--spark-delay:${(i % 7) * .04}s;--spark-size:${i % 4 ? 2 : 4}px"></i>`;
    }).join("");
    return `<div class="summon-field" aria-hidden="true"><div class="summon-nebula"></div><div class="summon-beam"></div><div class="summon-disc"><svg viewBox="0 0 360 360" focusable="false"><g class="summon-rays">${rays}</g><g class="summon-ring ring-a"><circle cx="180" cy="180" r="139"/><circle cx="180" cy="180" r="132" stroke-dasharray="2 13"/><path d="M180 32 308 106v148L180 328 52 254V106Z"/></g><g class="summon-ring ring-b"><circle cx="180" cy="180" r="114"/><path d="M180 61 299 180 180 299 61 180Z"/><circle cx="180" cy="66" r="4"/></g><g class="summon-ring ring-c"><ellipse cx="180" cy="180" rx="151" ry="68"/><ellipse cx="180" cy="180" rx="151" ry="68" transform="rotate(60 180 180)"/><ellipse cx="180" cy="180" rx="151" ry="68" transform="rotate(120 180 180)"/></g><g class="summon-crystal"><path d="m180 54 49 126-49 126-49-126Z M54 180l126-49 126 49-126 49Z M180 54v252M54 180h252"/></g><g class="summon-arcs"><path d="m58 80 26 65-32 35 50 61-8 39M302 80l-26 65 32 35-50 61 8 39M115 38l35 31 30-17 32 17 35-31"/></g><g class="summon-crown"><path d="m139 70-7-34 26 17 22-32 22 32 26-17-7 34ZM139 79h82"/><circle cx="180" cy="13" r="3"/></g></svg>${stars}</div><div class="summon-floor"></div></div>`;
  }
  function stage(s, card) {
    const p = profile(s);
    return p ? `<div class="summon-stage summon-${p.key}${reduced() ? " invocation-reduced" : ""}" data-invocation="${p.key}" style="${style(p)}">${field(p)}<div class="summon-card-shell">${card}</div></div>` : card;
  }
  function controls(s) {
    const p = profile(s); if (!p) return "";
    return `<div class="summon-console summon-${p.key}${reduced() ? " invocation-reduced" : ""}" data-invocation="${p.key}" style="${style(p)}"><div class="summon-emblem">${field(p)}<span aria-hidden="true">${String(p.rank).padStart(2, "0")}</span></div><div class="summon-description"><p class="summon-label">${esc(t("Invocação desta carta"))} · ${esc(DeckCommerce.money(s.pricing.priceCents))}</p><h4>${esc(t(p.name))}</h4><p>${esc(t(p.description))}</p></div></div><div class="summon-preferences"><button class="text-button" data-invocation-sound aria-pressed="${DeckSound.enabled}">${esc(t(DeckSound.enabled ? "Som ativado" : "Som desativado"))}</button><button class="text-button" data-invocation-motion aria-pressed="${reduced()}" ${matchMedia("(prefers-reduced-motion: reduce)").matches ? "disabled" : ""}>${esc(t(reduced() ? "Efeitos suaves" : "Efeitos completos"))}</button></div>`;
  }
  function cancel() {
    if (active) { clearTimeout(active.timer); active.cleanup(false); active = null; }
    DeckSound.stop();
  }
  function theater(s, p, root) {
    const dialog = root.closest?.("dialog");
    if (reduced() || !dialog) return null;
    const rect = dialog.getBoundingClientRect(), toolbar = dialog.querySelector(".detail-toolbar").getBoundingClientRect();
    const top = Math.max(rect.top + 8, toolbar.bottom + 1), height = Math.max(220, rect.bottom - top - 1);
    const el = document.createElement("section");
    el.className = `invocation-theater summon-stage summon-${p.key} is-invoked`;
    el.setAttribute("aria-label", t(p.name));
    el.setAttribute("style", `${style(p)};--theater-height:${height}px;top:${top}px;left:${rect.left + 1}px;width:${rect.width - 2}px;height:${height}px`);
    el.innerHTML = `${field(p)}<header class="theater-title"><p>${esc(s.code)} · ${esc(DeckCommerce.money(s.pricing.priceCents))}</p><h3>${esc(t(p.name))}</h3></header><div class="theater-card summon-card-shell" aria-hidden="true">${DeckArt.card(s)}</div><footer class="theater-footer"><p>${esc(s.universe.alias)}</p><span>${esc(s.identity?.serial || s.code)}</span><div><button type="button" class="text-button" data-invocation-sound aria-pressed="${DeckSound.enabled}">${esc(t(DeckSound.enabled ? "Som ativado" : "Som desativado"))}</button><button type="button" class="text-button" data-cancel-invocation>${esc(t("Voltar à carta"))}</button></div></footer>`;
    root.inert = true; dialog.append(el);
    el.querySelector("[data-cancel-invocation]").onclick = cancel;
    el.querySelector("[data-cancel-invocation]").focus({preventScroll:true});
    return el;
  }
  function start(s, root, button) {
    const p = profile(s); if (!p) return;
    cancel();
    const targets = [...root.querySelectorAll(".summon-stage,.summon-console")];
    const cinematic = theater(s, p, root);
    const status = root.querySelector(".power-announcement");
    for (const target of targets) { target.classList.toggle("invocation-reduced", reduced()); target.classList.add("is-invoked"); }
    button.disabled = true; button.textContent = t("Invocando…");
    if (status) status.textContent = t("{name} em formação…", {name: t(p.name)});
    const run = {timer: null, cleanup(done) {
      const restoreFocus = cinematic?.contains(document.activeElement);
      cinematic?.remove(); root.inert = false;
      targets.forEach(target => target.classList.remove("is-invoked"));
      if (button.isConnected) { button.disabled = false; button.textContent = "✦ " + t("Invocar carta"); }
      if (restoreFocus && button.isConnected) button.focus({preventScroll:true});
      if (status?.isConnected) status.textContent = done ? t("{name} concluída. Leve esta carta para sua próxima missão.", {name: t(p.name)}) : "";
    }};
    active = run;
    DeckSound.play("summon", p).then(played => {
      if (!played && active === run && DeckSound.enabled && status?.isConnected) status.textContent = t("Invocação visual ativa. O áudio não está disponível neste navegador.");
    });
    run.timer = setTimeout(() => { if (active !== run) return; run.cleanup(true); active = null; }, p.durationMs);
  }
  function toggleMotion(root) {
    cancel(); soft = !soft;
    try { localStorage.setItem("drivedeck-invocation-motion", soft ? "reduced" : "full"); } catch {}
    root.querySelectorAll(".summon-stage,.summon-console").forEach(el => el.classList.toggle("invocation-reduced", reduced()));
    const button = root.querySelector("[data-invocation-motion]");
    if (button) { button.setAttribute("aria-pressed", String(reduced())); button.textContent = t(reduced() ? "Efeitos suaves" : "Efeitos completos"); }
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden) cancel(); });
  if (typeof window !== "undefined") window.addEventListener("resize", cancel);
  return {profile, field, style, stage, controls, start, cancel, toggleMotion, get running() {return !!active;}};
})();
