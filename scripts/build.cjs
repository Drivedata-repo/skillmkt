const fs = require("node:fs");
const cards = require("../data/skills.cjs");
require("./build-i18n.cjs");
require("./build-preview.cjs");
if (cards.length !== 137 || new Set(cards.map((s) => s.code)).size !== 137)
  throw new Error("Invalid card collection");
for (const file of [
  "index.html",
  "login.html",
  "landing.js",
  "landing.css",
  "landing-motion.css",
  "landing-motion.js",
  "public-preview.js",
  "privacy.html",
  "experience.css",
  "universes.css",
  "evolution.css",
  "evolution.js",
  "skill-art.js",
  "deck-store.js",
  "deck-sound.js",
  "login.js",
  "market.js",
  "deck-art.js",
  "deck.css",
  "i18n.css",
  "i18n.js",
  "i18n-core.js",
  "translations.js",
  "assets/flag-pt.svg",
  "assets/flag-en.svg",
  "assets/flag-es.svg",
  "assets/drivedata-logo.png",
  "fonts/archivo-700.ttf",
  "fonts/archivo-LICENSE.txt",
])
  if (!fs.existsSync("dist/" + file)) throw new Error("Missing asset: " + file);
console.log(
  "137 unique cards and site assets verified. CSS 3D needs no WebGL runtime.",
);
