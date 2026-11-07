const DeckArt = (() => {
  const translated = (value) =>
    typeof DeckI18n === "undefined" ? value : DeckI18n.t(value);
  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const tones = {
    "Dados & inteligência": 190,
    "Automação & IA": 160,
    "Sistemas & integrações": 218,
    "Design & experiência": 275,
    "Vendas & conteúdo": 32,
    "Documentos & operação": 175,
    "Qualidade & engenharia": 245,
    "Pesquisa & estratégia": 320,
    "Inovação & experimentação": 45,
    "Apoio interno": 205,
  };
  const hue = (s) =>
    (tones[s.categoryKey || s.category] || 190) +
    ((Number(s.code?.slice(3) || 0) % 7) - 3) * 2;
  // A reproducible edition mark, not a score or a claim of scarcity.
  function signature(code) {
    const seed = (Number(String(code).slice(3)) || 1) * 4051;
    return Array.from({ length: 20 }, (_, i) => (seed >>> (i % 16)) & 1).join(
      "",
    );
  }
  function seal(s) {
    return `<svg class="edition-seal" viewBox="0 0 38 30" aria-hidden="true">${[...signature(s.code)].map((bit, i) => `<rect x="${(i % 5) * 8}" y="${Math.floor(i / 5) * 8}" width="5" height="5" rx="1" fill="currentColor" opacity="${bit === "1" ? ".9" : ".18"}"/>`).join("")}</svg>`;
  }
  function illustration(s) {
    if (typeof DeckSkillArt !== "undefined") return DeckSkillArt.render(s.id);
    // Neutral loading fallback; never assign another skill's illustration.
    return '<svg class="skill-scene" viewBox="0 0 320 260" aria-hidden="true" focusable="false"><path d="M70 62H250V202H70ZM70 88H250M92 111H228M92 134H187M92 157H209" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  }
  // Finish follows the proposed USD price; game power and technical evidence stay independent.
  function finish(s) {
    const cents = s.pricing?.currency === "USD" ? s.pricing.priceCents : 0;
    if (!Number.isSafeInteger(cents) || cents < 3000) return null;
    if (cents >= 4700) return { key: "gold", label: "Ouro solar" };
    if (cents >= 4200) return { key: "platinum", label: "Platina orbital" };
    if (cents >= 3700) return { key: "prism", label: "Prisma violeta" };
    return { key: "ion", label: "Ciano iônico" };
  }
  function card(s, opts = {}) {
    const g=s.game, p=s.pricing, foil=finish(s);
    const money=p ? (typeof DeckCommerce!=="undefined" ? DeckCommerce.money(p.priceCents) : `US$ ${p.priceCents/100}`) : "";
    const level=g ? translated("Nível de coleção {level}").replace("{level}",g.level) : "";
    return `<div class="holo-card ${g ? "has-game " : ""}${opts.spin ? "is-spinning " : ""}${foil ? `premium-card finish-${foil.key} ` : ""}${s.featured ? "featured-card" : ""}" style="--hue:${hue(s)};--foil-delay:-${(Number(s.code?.slice(3)) || 0)%9}s" data-card-id="${esc(s.id)}"${foil ? ` data-finish="${foil.key}"` : ""}>
      <div class="card-face front"><div class="card-edge"></div>
        <div class="card-heading"><img src="/assets/drivedata-logo.png" alt="" width="22" height="22"><span>${esc(s.code)}</span><b>${foil ? esc(translated(foil.label)) : s.featured ? "EXAMPLE EDITION" : "HOLO SERIES"}</b></div>
        ${g?`<div class="card-rank"><span>${esc(g.school)}</span><span class="rank-stars" aria-label="${esc(level)}"><em>LV ${g.level}</em><span aria-hidden="true">${"✦".repeat(g.level)}</span></span></div>`:""}
        <div class="card-visual">${foil ? '<div class="premium-fx" aria-hidden="true"><i class="foil-orbit"></i><i class="foil-sparks"></i><i class="foil-sweep"></i></div>' : ''}${illustration(s)}${seal(s)}<span class="visual-label">${esc(translated(s.category))}</span>${s.universe ? `<span class="card-codename">${esc(s.universe.alias)}</span>` : ""}<span class="visual-stars" aria-hidden="true">${s.featured ? "◈ ◈ ◈" : "✧ ✦ ✧"}</span></div>
        <div class="card-info"><span class="card-type">${s.role === "platform-specific" ? "Conexão de plataforma" : s.role === "support" ? "Especialidade de apoio" : "Skill de aplicação"}</span><h3>${esc(s.title)}</h3><p>${esc(s.universe?.tagline || s.deliverables?.[0] || "Conhecimento para a sua próxima tarefa.")}</p></div>
        ${g?`<div class="card-battle-stats" title="${esc(g.notice)}"><span>${esc(translated("ATQ"))} <b>${g.attack}</b></span><i aria-hidden="true">◆</i><span>${esc(translated("DEF"))} <b>${g.defense}</b></span></div>`:""}
        <div class="card-bottom"><span>${esc(s.code)} · v${esc(s.version || "1.2.0")}${p?`<small>${esc(translated("Grátis na demo"))}</small>`:""}</span>${p?`<span class="card-price"><small>${esc(translated("Preço proposto"))}</small><b>${esc(money)}</b></span>`:"<span>DRIVEDATA DECK</span>"}</div><div class="holo-shine"></div>
      </div>
      <div class="card-face back" aria-hidden="true"><div class="back-orbit"></div><img src="/assets/drivedata-logo.png" alt=""><strong>DriveData Deck</strong><span>${esc(s.code)} · ${esc(translated(s.category))}</span>${s.universe ? `<p class="back-alias">${esc(s.universe.alias)}</p><p class="back-tagline">${esc(s.universe.tagline)}</p>` : "<p>Uma capacidade.<br>Seu próximo resultado.</p>"}<small>${s.featured ? "EXEMPLO REPRODUZÍVEL INCLUÍDO" : "CONHECIMENTO PARA COLOCAR EM PRÁTICA"}</small></div>
    </div>`;
  }
  function tilt(root) {
    root.querySelectorAll(".holo-card").forEach((c) => {
      c.onpointermove = (e) => {
        if (
          matchMedia("(prefers-reduced-motion: reduce)").matches ||
          e.pointerType !== "mouse"
        )
          return;
        const r = c.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width,
          y = (e.clientY - r.top) / r.height;
        c.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
        c.style.setProperty("--ry", `${(x - 0.5) * 18}deg`);
        c.style.setProperty("--mx", `${x * 100}%`);
        c.style.setProperty("--my", `${y * 100}%`);
      };
      c.onpointerleave = () => {
        c.style.setProperty("--rx", "0deg");
        c.style.setProperty("--ry", "0deg");
      };
    });
  }
  return { esc, card, tilt, hue, signature, finish };
})();
