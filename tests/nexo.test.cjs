"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const core=require("../dist/nexo-core.js"),dictionary={...require("../lib/locale.cjs").messages,...require("../data/i18n-market.cjs"),...require("../data/i18n-public.cjs")},locale=require("../dist/i18n-core.js");
const {skills}=require("../lib/catalog.cjs"),{findSkills}=require("../lib/match.cjs");
const context={skills,audience:"business",mode:"demo"};
test("NEXO resolves its welcome prompts in PT, EN and ES",()=>{
  for(const lang of ["pt","en","es"]){
    for(const [prompt,topic] of [["Encontrar uma skill","find"],["Como instalar uma skill?","install"],["Me explique esta carta","choose"],["Quero comparar cartas","compare"]]){
      const message=locale.translate(dictionary,lang,prompt);
      assert.equal(core.resolve(message,context).topic,topic,`${lang}: ${message}`);
    }
  }
});
test("card explanations and comparisons only use IDs present in this session's catalog",()=>{
  const available=[skills.find(s=>s.code==="DD-019"),skills.find(s=>s.code==="DD-042")],ctx={skills:available};
  assert.deepEqual(core.resolve("Compare DD-019 e DD-042",ctx),{type:"compare",ids:available.map(s=>s.id)});
  assert.deepEqual(core.resolve("DD-019 e DD-999",ctx),{type:"unavailable",codes:["DD-999"]});
  assert.deepEqual(core.resolve("Me explique esta carta",{...ctx,selectedId:available[0].id}),{type:"cards",ids:[available[0].id]});
  assert.equal(core.resolve("This card",{...ctx,selectedId:"not-owned"}).topic,"choose");
});
test("customer access questions never receive the demo's free-download claim",()=>{
  for(const question of ["Qual o preço das skills?","What is the price of a card?","¿Cuál es el precio de una carta?"]){
    assert.equal(core.resolve(question,context).topic,"pricingDemo");
    assert.equal(core.resolve(question,{...context,mode:"customer"}).topic,"pricingCustomer");
  }
});
test("download trouble gets recovery guidance, not an invented completed action",()=>{
  for(const question of ["Não consigo baixar esta carta","I cannot download this card","No puedo descargar esta carta"])
    assert.equal(core.resolve(question,context).topic,"downloadError");
  assert.ok(core.guides.downloadError.some(s=>s.includes("não abre um chamado")));
});
test("ordinary work requests use the existing catalog engine",()=>{
  for(const question of ["Preciso limpar uma planilha e conferir as fórmulas","My Power BI report is slow and I need to optimize DAX measures","Necesito preparar una presentación comercial editable"])
    assert.equal(core.resolve(question,context).type,"search");
});
test("all authored guidance has complete EN/ES translations and matching placeholders",()=>{
  const placeholders=s=>[...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
  for(const source of Object.values(core.guides).flat())assert.equal(dictionary[source]?.length,2,source);
  for(const [source,translations] of Object.entries(require("../data/i18n-nexo.cjs"))){
    for(const translated of translations)assert.deepEqual(placeholders(translated),placeholders(source),source);
  }
});
test("localized clarification remains translatable after switching language mid-conversation",()=>{
  const canonical=core.canonicalizer(dictionary);
  const responses=["pt","en","es"].map(lang=>core.result(findSkills("Preciso de ajuda com minhas planilhas","business",null,lang),skills,canonical));
  assert.ok(responses[0].clarification);
  for(const response of responses.slice(1))assert.deepEqual(response,responses[0]);
  for(const lang of ["en","es"]){
    const question=responses[0].clarification.question;
    assert.notEqual(locale.translate(dictionary,lang,question),question);
  }
});
test("recommendations discard unknown and duplicate cards even if a response contains them",()=>{
  const id=skills[0].id;
  const r=core.result({summary:"test",matches:[{id},{id},{id:"invented"},{id:skills[1].id}]},[skills[0]]);
  assert.deepEqual(r.ids,[id]);
  assert.equal(r.clarification,null);
});
test("unsupported tasks are left without a fabricated recommendation",()=>{
  const r=core.result(findSkills("Quero plantar flores na varanda","business"),skills);
  assert.deepEqual(r.ids,[]);assert.equal(r.clarification,null);
});
test("a multi-step task keeps the catalog's ordered plan, while inaccessible steps discard it",()=>{
  const raw=findSkills("Quero preparar uma proposta comercial e transformar em slides no PowerPoint","business");
  assert.ok(raw.plan);
  const response=core.result(raw,skills);
  assert.deepEqual(response.plan.ids,raw.plan.steps.map(s=>s.skillId));
  assert.equal(core.result(raw,skills.filter(s=>s.id!==response.plan.ids[0])).plan,null);
  assert.equal(core.result({...raw,plan:{steps:[raw.plan.steps[0],raw.plan.steps[0]]}},skills).plan,null);
});
