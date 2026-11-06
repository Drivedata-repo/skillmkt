/* Shared visual language. Rendering uses only escaped catalog values. */
const DeckArt = (() => {
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
    const h = tones[s.category] || 190,
      n = Number(s.code?.slice(3) || 111),
      kind = n % 4;
    let shape = "";
    if (kind === 0) {
      for (let i = 0; i < 7; i++) {
        const y = 30 + i * 18;
        shape += `<path d="M160 ${y}l83 40-83 43-83-43z" fill="hsl(${h} 75% ${20 + i * 5}%)" fill-opacity=".18"/><path d="M77 ${y + 40}l83 43 83-43"/>`;
      }
    }
    if (kind === 1) {
      for (let i = 0; i < 8; i++)
        shape += `<ellipse cx="160" cy="130" rx="${28 + i * 10}" ry="95" transform="rotate(${i * 23} 160 130)"/>`;
      shape +=
        '<circle cx="160" cy="130" r="25" fill="currentColor" fill-opacity=".1"/>';
    }
    if (kind === 2) {
      shape =
        '<path d="M160 26l88 74-36 95-52 42-54-42-33-95zM160 26v211M73 100h175M106 195l54-95 52 95M160 26l-54 169M160 26l52 169M73 100l87 137 88-137" fill="currentColor" fill-opacity=".08"/>';
    }
    if (kind === 3) {
      for (let i = 0; i < 10; i++) {
        const a = (i * Math.PI) / 5,
          x = 160 + 94 * Math.cos(a),
          y = 130 + 85 * Math.sin(a);
        shape += `<path d="M160 130L${x} ${y}"/><circle cx="${x}" cy="${y}" r="${i % 2 ? 8 : 14}" fill="currentColor" fill-opacity=".12"/>`;
      }
      shape +=
        '<circle cx="160" cy="130" r="54"/><path d="M106 130h108M160 76v108"/>';
    }
    return `<svg viewBox="0 0 320 260" aria-hidden="true"><defs><radialGradient id="g-${esc(s.code)}"><stop stop-color="hsl(${h} 80% 60%)" stop-opacity=".25"/><stop offset="1" stop-color="hsl(${h} 80% 60%)" stop-opacity="0"/></radialGradient></defs><circle cx="160" cy="130" r="125" fill="url(#g-${esc(s.code)})"/><g stroke="currentColor" stroke-width="1" fill="none">${shape}</g><g fill="currentColor"><circle cx="160" cy="26" r="3"/><circle cx="70" cy="135" r="2"/><circle cx="242" cy="80" r="2"/></g><path d="M20 35V20h25M275 20h25v15M20 225v15h25M275 240h25v-15" stroke="currentColor" fill="none" opacity=".4"/></svg>`;
  }
  function card(s, opts = {}) {
    return `<div class="holo-card ${opts.spin ? "is-spinning" : ""}" style="--hue:${tones[s.category] || 190}" data-card-id="${esc(s.id)}"><div class="card-face front"><div class="card-edge"></div><div class="card-heading"><img src="/assets/drivedata-logo.png" alt="" width="22" height="22"><span>${esc(s.code)}</span><b>HOLO SERIES</b></div><div class="card-visual">${illustration(s)}<span class="visual-label">${esc(s.category)}</span><span class="visual-stars" aria-hidden="true">✧ ✦ ✧</span></div><div class="card-info"><span class="card-type">${s.role === "platform-specific" ? "Conexão de plataforma" : s.role === "support" ? "Especialidade de apoio" : "Skill de aplicação"}</span><h3>${esc(s.title)}</h3><p>${esc(s.deliverables?.[0] || "Uma nova capacidade para o seu próximo desafio.")}</p></div><div class="card-bottom"><span>DRIVEDATA DECK</span><span>◆ ${esc(s.code)} / 137</span></div><div class="holo-shine"></div></div><div class="card-face back" aria-hidden="true"><div class="back-orbit"></div><img src="/assets/drivedata-logo.png" alt=""><strong>DriveData Deck</strong><span>${esc(s.code)}</span><p>Conhecimento.<br>Em suas mãos.</p><small>DRIVEDATA · FOUNDERS EDITION</small></div></div>`;
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
        c.style.setProperty("--rx", `${(0.5 - y) * 16}deg`);
        c.style.setProperty("--ry", `${(x - 0.5) * 23}deg`);
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
