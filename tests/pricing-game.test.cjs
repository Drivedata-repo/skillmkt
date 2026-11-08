"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const base=require("../data/skills.cjs"),releases=require("../data/releases.cjs"),policy=require("../data/skill-pricing.cjs");
const {priceFor,getSkillPricing,getCombo,getCombos}=require("../lib/pricing.cjs");
const review=require("../data/pricing-review.json"),{localizeCatalog}=require("../lib/catalog-i18n.cjs"),catalog=require("../lib/catalog.cjs");
const {getCardGame}=require("../lib/card-game.cjs");
test("all 137 editorial prices are bounded, tied to the current source, and never enable billing",()=>{
  assert.equal(review.records.length,169);assert.equal(Object.keys(policy.assessments).length,169);
  assert.equal(new Set(review.records.map(r=>r.id)).size,169);
  const values=[];
  for(const s of base){const p=getSkillPricing(s.id),record=review.records.find(r=>r.id===s.id),release=releases[s.id];
    assert.ok(record,s.id);assert.equal(record.packageSha256,release.sha256,s.id);assert.equal(record.sourceSha256,release.sourceSha256,s.id);
    assert.equal(record.version,release.version);assert.equal(record.priceCents,p.priceCents);assert.deepEqual(record.scores,policy.assessments[s.id].scores);
    assert.match(record.contractSha256,/^[a-f0-9]{64}$/);assert.ok(record.rationale.length>45);assert.equal(record.executionVerified,false);
    assert.ok(p.priceCents>=700&&p.priceCents<=4700,s.id);assert.ok(Number.isSafeInteger(p.priceCents));assert.equal(p.currency,"USD");
    assert.equal(p.demoPriceCents,0);assert.equal(p.purchasable,false);assert.equal(p.status,"proposed-free-demo");values.push(p.priceCents);
    if(s.variantOf)assert.equal(p.priceCents,getSkillPricing(s.variantOf).priceCents,s.id);
  }
  assert.equal(Math.min(...values),700);assert.equal(Math.max(...values),4700);
  assert.equal(priceFor({depth:1,scope:1,verification:1,reuse:1}),700);
  assert.equal(priceFor({depth:5,scope:5,verification:5,reuse:5}),4700);
  for(const invalid of [null,{}, {depth:6,scope:2,verification:2,reuse:2},{depth:2.5,scope:2,verification:2,reuse:2}])assert.throws(()=>priceFor(invalid));
});
test("five coherent combos discount unique skill families using exact cent arithmetic",()=>{
  for(const locale of ["pt","en","es"]){const combos=getCombos(locale);assert.equal(combos.length,5);
    for(const c of combos){assert.equal(c.items.length,c.skillIds.length);assert.equal(new Set(c.skillIds).size,c.skillIds.length);
      assert.equal(new Set(c.skillIds.map(id=>policy.assessments[id].family||id)).size,c.skillIds.length);
      const total=c.skillIds.reduce((n,id)=>n+getSkillPricing(id).priceCents,0);
      assert.equal(c.individualTotalCents,total);assert.equal(c.priceCents,Math.round(total*(100-c.discountPercent)/100));assert.equal(c.savingsCents,total-c.priceCents);
      assert.equal(c.currency,"USD");assert.equal(c.demoPriceCents,0);assert.equal(c.purchasable,false);assert.ok(c.priceCents<total);
    }
  }
  assert.equal(getCombo("unknown"),null);
  assert.equal(getCombo("planilhas-confiaveis").priceCents,9075);
  assert.equal(getCombo("power-bi-sob-controle").priceCents,11060);
});
test("price and game metadata are authored in all three locales without changing numerical facts",()=>{
  for(const locale of ["en","es"]){const localized=localizeCatalog(catalog,locale);
    for(const s of localized.skills){const original=catalog.skills.find(x=>x.id===s.id);
      assert.equal(s.pricing.priceCents,original.pricing.priceCents);assert.equal(s.pricing.currency,"USD");
      for(const key of ["label","demoLabel","notice","basis","reason"])assert.notEqual(s.pricing[key],original.pricing[key],s.id+" "+key);
      assert.equal(s.pricing.dimensions.length,4);
      s.pricing.dimensions.forEach((d,i)=>{assert.notEqual(d.label,original.pricing.dimensions[i].label);assert.equal(d.score,original.pricing.dimensions[i].score)});
      for(const key of ["level","attack","defense","fictional","edition"])assert.equal(s.game[key],original.game[key]);
      assert.notEqual(s.game.flavor,original.game.flavor);assert.notEqual(s.game.notice,original.game.notice);
    }
  }
});
test("fictional card powers stay stable and independent of price and test status",()=>{
  for(const s of base){const g=getCardGame(s);assert.equal(g.fictional,true);assert.ok(g.level>=2&&g.level<=9);assert.ok(g.attack>0&&g.attack<=4000);assert.ok(g.defense>0&&g.defense<=4000);
    assert.deepEqual(getCardGame({...s,pricing:{priceCents:999999},executionVerified:true}),g);
    assert.deepEqual(getCardGame(s),g);
  }
});
test("UI prices remain USD, escape content and clearly retain the free demo",()=>{
  const ctx={window:{},Intl,DeckI18n:{intlLocale:"en-US",t:(s,p)=>s.replace(/\{(\w+)\}/g,(_,k)=>p?.[k]??"")}};
  vm.runInNewContext(fs.readFileSync("dist/commerce.js","utf8"),ctx);
  const c=ctx.window.DeckCommerce;
  assert.equal(c.money(4700),"US$ 47");assert.equal(c.money(9075),"US$ 90.75");assert.equal(c.money(-1),"");
  const markup=c.stamp(getSkillPricing("claude-xlsx"));assert.match(markup,/US\$ 42/);assert.match(markup,/Grátis na demo/);assert.doesNotMatch(markup,/checkout|payment|Comprar/);
  const bundle=c.combo({...getCombo("documentos-que-convencem"),title:'<img onerror="alert(1)">'},catalog.skills);
  assert.doesNotMatch(bundle,/<img onerror/);assert.match(bundle,/&lt;img/);
});
test("all 137 collectible faces render their own price, level and stats in every locale",()=>{
  const core=require("../dist/i18n-core.js"),dictionary=require("../data/i18n-market.cjs");
  for(const locale of ["pt","en","es"]){
    const context={DeckI18n:{t:s=>core.translate(dictionary,locale,s)}};vm.createContext(context);
    vm.runInContext(fs.readFileSync("dist/deck-art.js","utf8"),context);
    const art=vm.runInContext("DeckArt",context);
    for(const s of localizeCatalog(catalog,locale).skills){const html=art.card(s);
      assert.ok(html.includes(`data-card-id="${s.id}"`));assert.ok(html.includes(`US$ ${s.pricing.priceCents/100}`));
      assert.ok(html.includes(`LV ${s.game.level}`));assert.ok(html.includes(`<b>${s.game.attack}</b>`));assert.ok(html.includes(`<b>${s.game.defense}</b>`));
      assert.ok(html.includes(core.translate(dictionary,locale,"Grátis na demo")));assert.doesNotMatch(html,/NaN|undefined|null/);
    }
  }
});
