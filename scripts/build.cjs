const fs = require("node:fs");
const cards = require("../data/skills.cjs");
const priceReview = require("../data/pricing-review.json");
const releases = require("../data/releases.cjs");
const {getSkillPricing} = require("../lib/pricing.cjs");
if(priceReview.records.length!==169) throw Error("Pricing review must cover the complete collection");
for(const s of cards){
  const r=priceReview.records.find(r=>r.id===s.id);
  if(!r || r.packageSha256!==releases[s.id].sha256 || r.priceCents!==getSkillPricing(s.id).priceCents) throw Error("Pricing assessment needs review: "+s.id);
}
require("./build-i18n.cjs");
require("./build-preview.cjs");
require("./build-problem-pages.cjs");
require("./build-deliverable-gallery.cjs");
if (cards.length !== 169 || new Set(cards.map((s) => s.code)).size !== 169)
  throw new Error("Invalid card collection");
const identities = require("../lib/catalog.cjs").skills.map(s => s.identity);
if (new Set(identities.map(i => i.id)).size !== 169 || new Set(identities.map(i => i.serial)).size !== 169)
  throw new Error("Card identities must be unique");
for (const file of [
  "index.html",
  "login.html",
  "acesso.html",
  "acesso.css",
  "acesso.js",
  "oferta.html",
  "oferta.css",
  "oferta.js",
  "oferta-config.js",
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
  "work-store.js",
  "work.js",
  "work.css",
  "commerce.js",
  "collection-extras.css",
  "navigation.js",
  "deck-store.js",
  "deck-sound.js",
  "invocation-profiles.js",
  "deck-invocation.js",
  "card-identity.js",
  "invocation.css",
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
  "169 unique cards and site assets verified. CSS 3D needs no WebGL runtime.",
);
