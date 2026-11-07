/* One score for each proposed USD price band. No collectible power or price promises. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DeckInvocationProfiles = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const rows = [
    [700, "pulse", "Pulso inicial", "Um pulso de luz e duas notas cristalinas.", 1200, "163 211 231", "#a3d3e7", [60, 72], "sine"],
    [1200, "echo", "Eco vetorial", "Anéis concêntricos respondem a um eco digital.", 1500, "129 187 255", "#81bbff", [62, 69, 74], "sine"],
    [1700, "verdant", "Fluxo esmeralda", "Duas hélices verdes acompanham uma sequência de marimba sintética.", 1800, "100 242 181", "#64f2b5", [64, 67, 71, 76], "triangle"],
    [2200, "ember", "Ignição âmbar", "Um reator geométrico desperta com um impacto grave e sinos de âmbar.", 2100, "255 171 104", "#ffab68", [45, 57, 64, 69], "triangle"],
    [2700, "rift", "Fenda azul", "Um portal se abre ao som de um sintetizador ascendente.", 2400, "113 151 255", "#7197ff", [50, 57, 62, 69, 74], "sine"],
    [3200, "ion", "Tempestade iônica", "Arcos elétricos, partículas ciano e um arpejo de energia.", 2800, "83 240 255", "#53f0ff", [54, 61, 66, 73, 78, 85], "triangle"],
    [3700, "prism", "Ascensão prismática", "Fragmentos violeta refratam a luz em uma cascata de cristais.", 3100, "220 138 255", "#dc8aff", [60, 67, 74, 79, 84, 91, 86], "sine"],
    [4200, "orbital", "Convergência orbital", "Três órbitas de platina convergem em um acorde espacial.", 3500, "213 245 255", "#d5f5ff", [48, 55, 62, 67, 74, 79, 86, 91], "sine"],
    [4700, "solar", "Coroação solar", "Carga dourada, coroa de luz, constelação de partículas e um acorde de celebração.", 4200, "255 210 96", "#ffd260", [48, 55, 60, 67, 72, 79, 84, 88, 91], "triangle"],
  ];
  const all = rows.map(([minCents, key, name, description, durationMs, rgb, color, notes, voice], i) => Object.freeze({
    minCents, key, name, description, durationMs, rgb, color, notes: Object.freeze(notes), voice,
    rank: i + 1, impact: i < 3 ? .16 : i < 6 ? .42 : i === 8 ? .98 : .64,
    particles: 4 + i * 3,
  }));
  function forPrice(pricing) {
    if (pricing?.currency !== "USD" || !Number.isSafeInteger(pricing.priceCents) || pricing.priceCents < 700) return null;
    return all.findLast(p => pricing.priceCents >= p.minCents) || null;
  }
  function byKey(key) { return all.find(p => p.key === key) || null; }
  // A bounded, original musical score; renderable with both real-time and OfflineAudioContext.
  function score(profile) {
    if (!all.includes(profile)) return [];
    const {rank, notes, voice, impact} = profile;
    const events = [];
    const note = (midi, at, duration, gain, type = voice, slide = 0, pan = 0) =>
      events.push({hz: 440 * 2 ** ((midi - 69) / 12), at, duration, gain, type, slide, pan});
    if (rank >= 4) note(notes[0] - 12, .02, impact + .65, .42, "sine", -12);
    if (rank >= 5) note(notes[0], .06, impact, .11, "sine", 19, -.25);
    if (rank >= 5) events.push({hz:260 + rank * 20, at:.02, duration:impact + .18, gain:rank === 9 ? .085 : .045, type:"noise", slide:30, pan:0});
    if (rank === 9) events.push({hz:1900, at:impact, duration:.55, gain:.08, type:"noise", slide:-24, pan:0});
    notes.forEach((midi, i) => {
      const at = impact + i * (rank >= 7 ? .105 : .095);
      note(midi, at, rank >= 7 ? .8 : .33 + rank * .04, .29, voice, 0, (i % 2 ? 1 : -1) * .45);
      if (rank >= 6) note(midi + 12, at + .035, .4, .055, "sine", 0, i % 2 ? -.6 : .6);
      if (rank === 2) note(midi, at + .18, .27, .085, "sine", 0, .4);
    });
    if (rank >= 7) [0, 7, 12, ...(rank === 9 ? [16, 19, 24] : [])].forEach((step, i) =>
      note(notes[0] + step, impact + .28 + i * .025, rank === 9 ? 1.75 : 1.25, .075, "sine", 0, (i % 3 - 1) * .55));
    if (rank === 9) [96, 91, 88, 84].forEach((midi, i) => note(midi, 2.16 + i * .17, .8, .09, "sine", 0, (i % 2 ? 1 : -1) * .65));
    return events;
  }
  return Object.freeze({all: Object.freeze(all), forPrice, byKey, score});
});
