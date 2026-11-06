const fs = require("node:fs");
const cards = require("../data/skills.cjs");
require("./build-preview.cjs");
if (cards.length !== 137 || new Set(cards.map((s) => s.code)).size !== 137)
  throw new Error("Invalid card collection");
for (const file of [
  "index.html",
  "login.html",
  "landing.js",
  "landing.css",
  "public-preview.js",
  "privacy.html",
  "experience.css",
  "deck-store.js",
  "deck-sound.js",
  "login.js",
  "market.js",
  "deck-art.js",
  "deck.css",
  "assets/drivedata-logo.png",
])
  if (!fs.existsSync("dist/" + file)) throw new Error("Missing asset: " + file);
console.log(
  "137 unique cards and site assets verified. CSS 3D needs no WebGL runtime.",
);
