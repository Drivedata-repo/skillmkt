const DeckArt = (() => {
  let artSequence = 0;
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
  function illustration(s) {
    const gradientId = `deck-gradient-${++artSequence}`;
    const n = Number(s.code?.slice(3) || 111),
      h = tones[s.categoryKey || s.category] || 190;
    const art =
      {
        "Dados & inteligência":
          '<ellipse cx="160" cy="62" rx="70" ry="23"/><path d="M90 62v110c0 31 140 31 140 0V62M90 98c0 31 140 31 140 0M90 135c0 31 140 31 140 0"/><path class="art-flow" d="M45 198v-45h30m170-55h30v100h-30"/><path d="M115 161v-23m30 36v-48m30 49v-62m30 49v-30" stroke-width="8"/>',
        "Automação & IA":
          '<rect x="104" y="66" width="112" height="112" rx="19"/><rect x="126" y="87" width="68" height="68" rx="12"/><path d="M141 117h38m-19-19v38M120 45v21m27-21v21m27-21v21m27-21v21M120 178v24m27-24v24m27-24v24m27-24v24M81 85h23m-23 27h23m-23 27h23m-23 27h23M216 85h23m-23 27h23m-23 27h23m-23 27h23"/><circle class="art-flow" cx="160" cy="122" r="91" stroke-dasharray="3 12"/>',
        "Sistemas & integrações":
          '<path class="art-flow" d="M91 83l69 48 70-48M160 131v75M91 83v92l69 31 70-31V83"/><rect x="63" y="55" width="56" height="56" rx="10"/><rect x="202" y="55" width="56" height="56" rx="10"/><rect x="132" y="107" width="56" height="56" rx="10"/><path d="M80 82h22m116 0h22m-91 53h22"/>',
        "Design & experiência":
          '<rect x="65" y="45" width="178" height="149" rx="10"/><path d="M65 75h178M84 60h4m12 0h4m12 0h4"/><rect x="83" y="93" width="65" height="80" rx="4"/><path d="M165 96h58m-58 17h44m-44 17h52"/><rect x="165" y="147" width="58" height="25" rx="12"/><path class="art-float" d="M219 159l44 31-24 5-9 24z" fill="currentColor" fill-opacity=".25"/>',
        "Vendas & conteúdo":
          '<path d="M77 52h166l-62 83v61l-42 21v-82z"/><path d="M102 88h116M130 124h60"/><circle cx="160" cy="67" r="6"/><path class="art-flow" d="M57 162h40m-10-10 12 10-12 10M222 162h40m-10-10 12 10-12 10"/><circle cx="160" cy="165" r="9" fill="currentColor" fill-opacity=".2"/>',
        "Documentos & operação":
          '<path d="M96 40h101l32 35v137H96z"/><path d="M197 40v35h32M96 58H78v170h131v-16M117 100h91m-91 20h72m-72 20h91m-91 20h45"/><path class="art-float" d="m172 181 12 12 27-29" stroke-width="5"/>',
        "Qualidade & engenharia":
          '<path d="M160 35 83 66v58c0 51 77 93 77 93s77-42 77-93V66z"/><path d="m119 107-20 18 20 18m82-36 20 18-20 18m-26-47-30 77"/><path class="art-flow" d="M160 51 99 76v49c0 37 61 73 61 73s61-36 61-73V76z" stroke-dasharray="5 8"/>',
        "Pesquisa & estratégia":
          '<circle cx="148" cy="108" r="65"/><circle cx="148" cy="108" r="45"/><path d="m192 158 55 55m-43-68 55 55" stroke-width="8"/><path class="art-float" d="m148 69 15 39-15 39-15-39z" fill="currentColor" fill-opacity=".2"/><path d="M114 108h68"/>',
        "Inovação & experimentação":
          '<path d="M135 43h50m-40 0v57l-55 92c-8 16 4 25 18 25h104c14 0 26-9 18-25l-55-92V43M111 165h98"/><circle class="art-float" cx="145" cy="143" r="9"/><circle cx="175" cy="186" r="12"/><circle cx="155" cy="65" r="3"/><path d="M87 65h-22m11-11v22M230 105h22m-11-11v22"/>',
        "Apoio interno":
          '<circle cx="160" cy="130" r="72"/><circle cx="160" cy="130" r="35"/><path d="M160 39v20m0 142v20M69 130h20m142 0h20M96 66l14 14m100 100 14 14M96 194l14-14M210 80l14-14" stroke-width="12"/><path d="m147 130 10 10 19-23"/>',
      }[s.categoryKey || s.category] || '<circle cx="160" cy="130" r="70"/>';
    const dots = Array.from({ length: 8 }, (_, i) => {
      const a = ((n * 17 + i * 45) * Math.PI) / 180;
      return `<circle cx="${160 + 118 * Math.cos(a)}" cy="${130 + 105 * Math.sin(a)}" r="${(i % 3) + 1}"/>`;
    }).join("");
    return `<svg viewBox="0 0 320 260" aria-hidden="true"><defs><radialGradient id="${gradientId}"><stop stop-color="hsl(${h} 80% 60%)" stop-opacity=".23"/><stop offset="1" stop-color="hsl(${h} 80% 60%)" stop-opacity="0"/></radialGradient></defs><circle cx="160" cy="130" r="128" fill="url(#${gradientId})"/><g class="art-symbol" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linejoin="round">${art}</g><g fill="currentColor" opacity=".6">${dots}</g><path d="M20 35V20h25M275 20h25v15M20 225v15h25M275 240h25v-15" stroke="currentColor" fill="none" opacity=".4"/></svg>`;
  }
  function card(s, opts = {}) {
    return `<div class="holo-card ${opts.spin ? "is-spinning " : ""}${s.featured ? "featured-card" : ""}" style="--hue:${tones[s.categoryKey || s.category] || 190}" data-card-id="${esc(s.id)}"><div class="card-face front"><div class="card-edge"></div><div class="card-heading"><img src="/assets/drivedata-logo.png" alt="" width="22" height="22"><span>${esc(s.code)}</span><b>${s.featured ? "EXAMPLE EDITION" : "HOLO SERIES"}</b></div><div class="card-visual">${illustration(s)}<span class="visual-label">${esc(translated(s.category))}</span><span class="visual-stars" aria-hidden="true">${s.featured ? "◈ ◈ ◈" : "✧ ✦ ✧"}</span></div><div class="card-info"><span class="card-type">${s.role === "platform-specific" ? "Conexão de plataforma" : s.role === "support" ? "Especialidade de apoio" : "Skill de aplicação"}</span><h3>${esc(s.title)}</h3><p>${esc(s.deliverables?.[0] || "Conhecimento para a sua próxima tarefa.")}</p></div><div class="card-bottom"><span>DRIVEDATA DECK</span><span>${esc(s.code)} · v${esc(s.version || "1.1.0")}</span></div><div class="holo-shine"></div></div><div class="card-face back" aria-hidden="true"><div class="back-orbit"></div><img src="/assets/drivedata-logo.png" alt=""><strong>DriveData Deck</strong><span>${esc(s.code)} · ${esc(translated(s.category))}</span><p>Uma capacidade.<br>Seu próximo resultado.</p><small>${s.featured ? "EXEMPLO REPRODUZÍVEL INCLUÍDO" : "CONHECIMENTO PARA COLOCAR EM PRÁTICA"}</small></div></div>`;
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
  return { esc, card, tilt };
})();
