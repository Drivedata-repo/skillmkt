// Gera dist/tema-papel.css: a paleta da home-fable aplicada às telas do app.
// Lê as folhas do app e reescreve SÓ as cores das regras de fora da carta
// (fundo escuro vira papel, texto claro vira tinta, na mesma ordem de contraste).
// Tudo o que é da carta, do foil e da invocação fica como está.
// Rode com: node scripts/build-tema-papel.cjs
const fs = require("node:fs");

const SOURCES = [
  "deck.css",
  "experience.css",
  "evolution.css",
  "universes.css",
  "i18n.css",
  "work.css",
  "collection-extras.css",
  "invocation.css",
  "nexo.css",
];
// Palcos escuros: a carta, o disco da invocação (inteiro ou em miniatura) e o teatro.
// Nada dentro deles é convertido, nem os botões e textos comuns.
const STAGES = ".holo-card, .summon-stage, .summon-emblem, .invocation-theater";
const PSEUDO =
  /(::?(?:before|after|placeholder|backdrop|marker|selection|file-selector-button|-webkit-[\w-]+))+$/;
function outsideStages(selector) {
  const guard = `:where(:not(${STAGES}, :is(${STAGES}) *))`;
  const m = selector.match(PSEUDO);
  return m ? selector.slice(0, m.index) + guard + m[0] : selector + guard;
}
// Seletores que pertencem à carta ou ao palco dela: nunca são convertidos.
const CARD =
  /\.holo-card|\.card-(face|edge|heading|rank|visual|info|type|bottom|battle|price|codename)|\.premium-|\.finish-|\.foil-|\.holo-shine|\.edition-seal|\.visual-(label|stars)|\.rank-stars|\.skill-scene|\.scene-|\.back-|\.back\b|\.front\b|\.featured-card|\.free-card|\.summon|\.theater|\.invocation|\.is-invoked|\.ring-|\.is-spinning|\.flipped/;
const COLOR_PROPS =
  /^(color|background|background-color|background-image|border|border-(top|right|bottom|left|color|block|inline)(-color)?|outline|outline-color|box-shadow|text-shadow|filter|fill|stroke|caret-color|accent-color|text-decoration|text-decoration-color|column-rule|scrollbar-color)$/;
const SHADOW_PROPS = /^(box-shadow|text-shadow|filter)$/;
const TEXT_PROPS = /^(color|caret-color|text-decoration|text-decoration-color|fill|stroke)$/;

// ---------- cor
const NAMED = { white: "#ffffff", black: "#000000" };
function parseColor(token) {
  let t = token.toLowerCase();
  if (NAMED[t]) t = NAMED[t];
  if (t[0] === "#") {
    let h = t.slice(1);
    if (h.length === 3 || h.length === 4)
      h = [...h].map((c) => c + c).join("");
    if (h.length !== 6 && h.length !== 8) return null;
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  const m = t.match(/^rgba?\(([^)]+)\)$/);
  if (!m || /var\(|calc\(/.test(m[1])) return null;
  const p = m[1].split(/[\s,/]+/).filter(Boolean);
  if (p.length < 3) return null;
  const ch = (v) => (v.endsWith("%") ? parseFloat(v) * 2.55 : parseFloat(v));
  const a = p[3] == null ? 1 : p[3].endsWith("%") ? parseFloat(p[3]) / 100 : parseFloat(p[3]);
  const c = [ch(p[0]), ch(p[1]), ch(p[2]), a];
  return c.some(Number.isNaN) ? null : c;
}
function toHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min,
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}
function fromHsl(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r, g, b].map((v) => Math.round((v + m) * 255));
}
// Claridade antiga -> nova. Monótona e decrescente: quem contrastava continua contrastando.
const CURVE = [
  [0, 0.945],
  [0.03, 0.935],
  [0.08, 0.905],
  [0.15, 0.86],
  [0.25, 0.775],
  [0.5, 0.52],
  [0.7, 0.34],
  [0.85, 0.22],
  [1, 0.14],
];
function relight(l) {
  for (let i = 1; i < CURVE.length; i++)
    if (l <= CURVE[i][0]) {
      const [a, A] = CURVE[i - 1],
        [b, B] = CURVE[i];
      return A + ((l - a) / (b - a)) * (B - A);
    }
  return 0.14;
}
function out([r, g, b], a) {
  if (a >= 0.995)
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  return `rgb(${r} ${g} ${b} / ${Math.round(a * 100) / 100})`;
}
function convert(token, prop) {
  const c = parseColor(token);
  if (!c) return token;
  const [h, s, l] = toHsl(c);
  const a = c[3];
  if (SHADOW_PROPS.test(prop)) {
    // sombra escura continua sombra, mais leve; brilho colorido some quase todo
    if (l < 0.3) return out([20, 36, 58], Math.min(0.28, a * 0.34));
    return out(fromHsl(h, Math.min(s, 0.5), Math.min(l, 0.42)), a * 0.3);
  }
  const L = relight(l);
  // cinzas e azuis frios do tema escuro são a "tinta" dele: viram a tinta do papel
  const cool = h >= 185 && h <= 250 && s < 0.62;
  const neutral = s < 0.26 || l < 0.2 || (l > 0.86 && s < 0.5) || cool;
  if (neutral) {
    if (L >= 0.8) return out(fromHsl(38, 0.24, L), a); // papel quente
    if (L <= 0.26)
      // tinta azul-marinho; quanto mais clara, menos azul, para não virar texto colorido
      return out(fromHsl(215, 0.46 - 0.2 * Math.min(1, Math.max(0, (L - 0.15) / 0.11)), L), a);
    if (L <= 0.45) return out(fromHsl(215, 0.24, Math.min(L, 0.34)), a); // tinta secundária
    return out(fromHsl(215, 0.14, L), a);
  }
  // cor de verdade (verde, âmbar, erro): mantém o matiz, escura o bastante para ler
  if (TEXT_PROPS.test(prop) || L < 0.5)
    return out(fromHsl(h, Math.min(s, 0.74), Math.min(L, 0.235)), a);
  return out(fromHsl(h, Math.min(s, 0.6), Math.max(L, 0.8)), a);
}
const COLOR_TOKEN = /#[0-9a-fA-F]{3,8}\b|rgba?\([^()]*\)|\b(?:white|black)\b/g;

// ---------- leitor de CSS (regras, @media e @supports; ignora @keyframes e @font-face)
function strip(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}
function blocks(css) {
  const list = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open < 0) break;
    const prelude = css.slice(i, open).trim();
    let depth = 1,
      j = open + 1;
    while (j < css.length && depth) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }
    list.push([prelude, css.slice(open + 1, j - 1)]);
    i = j;
  }
  return list;
}
function splitTop(text, sep) {
  const parts = [];
  let depth = 0,
    last = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === sep && !depth) {
      parts.push(text.slice(last, i));
      last = i + 1;
    }
  }
  parts.push(text.slice(last));
  return parts.map((p) => p.trim()).filter(Boolean);
}
let converted = 0;
function compile(css) {
  let result = "";
  for (const [prelude, body] of blocks(css)) {
    if (/^@(media|supports)/.test(prelude)) {
      const inner = compile(body);
      if (inner) result += `${prelude}{${inner}}\n`;
      continue;
    }
    if (prelude[0] === "@") continue;
    const selectors = splitTop(prelude, ",").filter(
      (s) => !CARD.test(s) && !/^(:root|html)$/.test(s),
    );
    if (!selectors.length) continue;
    const decls = [];
    for (const decl of splitTop(body, ";")) {
      const at = decl.indexOf(":");
      if (at < 0) continue;
      const prop = decl.slice(0, at).trim().toLowerCase(),
        value = decl.slice(at + 1).trim();
      if (!COLOR_PROPS.test(prop) || /var\(--(hue|foil)/.test(value)) continue;
      const next = value.replace(COLOR_TOKEN, (t) => convert(t, prop));
      if (next !== value) {
        decls.push(`${prop}:${next}`);
        converted++;
      }
    }
    if (decls.length)
      result += `${selectors.map(outsideStages).join(",")}{${decls.join(";")}}\n`;
  }
  return result;
}

const HEAD = `/* Tema Papel: a paleta da home-fable aplicada ao Deck.
   Gerado por scripts/build-tema-papel.cjs. Não edite à mão.
   Camada opcional, carregada depois das folhas do app. Nenhuma página usa ainda.
   Regra de ouro: o que está DENTRO da carta não muda. Só muda a mesa em volta. */
:root {
  color-scheme: light;
  --bg: #dcd8d1;
  --panel: #f4f1ea;
  --text: #14243a;
  --muted: #3e4e64;
  --mint: #0a6a4c;
  --line: rgb(20 36 58 / 0.2);
  --tp-ground: #dcd8d1;
  --tp-paper: #f4f1ea;
  --tp-ink: #14243a;
  --tp-ink-2: #3e4e64;
  --tp-green: #34d59a;
  --tp-green-ink: #0a6a4c;
}
/* As cartas e os palcos de carta continuam no escuro original, com todo o efeito. */
.holo-card,
.summon-stage,
.summon-emblem,
.invocation-theater {
  color-scheme: dark;
  --bg: #050709;
  --panel: #0c1015;
  --text: #f1f5f6;
  --muted: #a3adb8;
  --mint: #65ecc1;
  --line: #29333e;
  color: #f1f5f6;
}
`;
// Lê sempre com quebra de linha LF: o resultado sai igual no Windows e na Vercel.
const read = (file) => fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const TAIL = fs.existsSync("scripts/tema-papel-ajustes.css")
  ? "\n/* Ajustes feitos à mão (scripts/tema-papel-ajustes.css) */\n" +
    read("scripts/tema-papel-ajustes.css")
  : "";
let css = HEAD;
for (const name of SOURCES) {
  const part = compile(strip(read("dist/" + name)));
  css += `\n/* ${name} */\n${part}`;
}
fs.writeFileSync("dist/tema-papel.css", css + TAIL);
console.log(
  `tema-papel.css: ${converted} declarações convertidas, ${(Buffer.byteLength(css + TAIL) / 1024).toFixed(1)} KB.`,
);
