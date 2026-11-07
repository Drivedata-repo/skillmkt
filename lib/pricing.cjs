"use strict";
const policy = require("../data/skill-pricing.cjs");
const recipes = require("../data/combos.cjs");
const skills = require("../data/skills.cjs");
const releases = require("../data/releases.cjs");
const text = require("../data/i18n/catalog-text.json");
const localeOf = locale => ["en","es"].includes(locale) ? locale : "pt";
const copy = {
  pt:{label:"Preço proposto",demo:"Grátis na demo",notice:"Valor planejado em dólares americanos. Nenhuma compra ou cobrança está ativa.",basis:"Avaliação documental do escopo; não é uma nota de qualidade nem comprovação de ganho.",delivery:"Entrega de referência",dimensions:{depth:"Profundidade técnica",scope:"Abrangência da entrega",verification:"Esforço de conferência",reuse:"Reutilização"},levels:["Essencial","Intermediária","Avançada","Especializada"],variant:"Variante de outra skill, com a mesma finalidade e preço. Escolha a edição compatível com seu ambiente."},
  en:{label:"Proposed price",demo:"Free in the demo",notice:"Planned value in US dollars. No purchase or billing is active.",basis:"Documentary assessment of scope; not a quality rating or proof of improvement.",delivery:"Reference deliverable",dimensions:{depth:"Technical depth",scope:"Deliverable scope",verification:"Verification effort",reuse:"Reuse"},levels:["Essential","Intermediate","Advanced","Specialist"],variant:"A variant of another skill with the same purpose and price. Choose the edition compatible with your environment."},
  es:{label:"Precio propuesto",demo:"Gratis en la demo",notice:"Valor previsto en dólares estadounidenses. No hay compras ni cobros activos.",basis:"Evaluación documental del alcance; no es una nota de calidad ni una prueba de mejora.",delivery:"Entrega de referencia",dimensions:{depth:"Profundidad técnica",scope:"Alcance de la entrega",verification:"Esfuerzo de revisión",reuse:"Reutilización"},levels:["Esencial","Intermedia","Avanzada","Especializada"],variant:"Variante de otra skill, con la misma finalidad y precio. Elige la edición compatible con tu entorno."},
};
function priceFor(scores) {
  if (!scores || !policy.dimensions.every(key=>Number.isInteger(scores[key]) && scores[key]>=1 && scores[key]<=5)) throw Error("Invalid pricing scores");
  const weighted = policy.dimensions.reduce((sum,key)=>sum+scores[key]*policy.weights[key],0);
  return (7 + 5 * Math.round((weighted-100)/50)) * 100;
}
function getSkillPricing(id, language="pt") {
  const assessment = policy.assessments[id], s=skills.find(s=>s.id===id);
  if (!assessment || !s) return null;
  const locale=localeOf(language), w=copy[locale], scores=assessment.scores;
  const complexity=(scores.depth+scores.scope+scores.verification)/3;
  const delivery=locale==="pt"?s.deliverables[0]:text[s.deliverables[0]]?.[locale==="en"?0:1] || s.deliverables[0];
  return {currency:"USD",priceCents:priceFor(scores),demoPriceCents:0,purchasable:false,status:policy.mode,revision:policy.revision,assessedVersion:releases[id].version,label:w.label,demoLabel:w.demo,notice:w.notice,basis:w.basis,complexityLabel:w.levels[complexity<=2?0:complexity<=3?1:complexity<=4?2:3],dimensions:policy.dimensions.map(key=>({key,label:w.dimensions[key],score:scores[key],max:5,weight:policy.weights[key]})),reason:`${w.delivery}: ${delivery}.`,variantNote:assessment.family?w.variant:null};
}
function getCombo(id, language="pt") {
  const recipe=recipes.find(c=>c.id===id);
  if (!recipe) return null;
  const locale=localeOf(language);
  const unique=[...new Set(recipe.skillIds)];
  if (unique.length!==recipe.skillIds.length || new Set(unique.map(id=>policy.assessments[id]?.family || id)).size!==unique.length) throw Error("Duplicate skill family in combo");
  const items=unique.map(id=>{const pricing=getSkillPricing(id,locale);if(!pricing)throw Error("Unknown combo skill");return {id,priceCents:pricing.priceCents}});
  const individualTotalCents=items.reduce((sum,s)=>sum+s.priceCents,0);
  const priceCents=Math.round(individualTotalCents*(100-recipe.discountPercent)/100);
  return {id,packId:recipe.packId,title:recipe.title[locale],purpose:recipe.purpose[locale],skillIds:unique,items,currency:"USD",individualTotalCents,priceCents,savingsCents:individualTotalCents-priceCents,discountPercent:recipe.discountPercent,demoPriceCents:0,purchasable:false,status:policy.mode};
}
function getCombos(locale="pt") { return recipes.map(c=>getCombo(c.id,locale)); }
module.exports={priceFor,getSkillPricing,getCombo,getCombos};
