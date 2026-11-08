"use strict";
const test = require("node:test"), assert = require("node:assert/strict"), fs = require("node:fs"), vm = require("node:vm");
const {webcrypto, createHash} = require("node:crypto");
const store = require("../dist/deck-store.js"), profiles = require("../dist/invocation-profiles.js");
const dictionary = require("../data/i18n-market.cjs");
const ids = ["alpha", "beta", "gamma"];

test("a card is celebrated once across removal, reload and backup restore", () => {
  let deck = store.empty();
  assert.deepEqual(store.collect(deck, [ids[0]]), [ids[0]]);
  deck.favorites.push(ids[0]);
  assert.deepEqual(store.collect(deck, [ids[0]]), []);
  deck.favorites = [];
  const storage = {getItem(){return this.value;}, setItem(key, value){this.value = value;}};
  store.save(storage, deck);
  deck = store.load(storage, ids);
  assert.deepEqual(store.collect(deck, [ids[0]]), []);
  deck = store.clean(JSON.parse(JSON.stringify(deck)), ids);
  assert.deepEqual(store.collect(deck, [ids[0]]), []);
});

test("legacy favorites and previous downloads migrate without replaying an arrival", () => {
  const deck = store.clean({schema:1, favorites:[ids[0]], downloads:[{id:ids[1],version:"1.2.0",at:"2026-11-07T12:00:00Z"}]}, ids);
  assert.deepEqual(store.collect(deck, ids), [ids[2]]);
  assert.deepEqual(deck.collectionHistory, ids);
});

test("bulk collection only claims new cards, once, in selection order", () => {
  const deck = store.empty(); store.collect(deck, [ids[1]]);
  assert.deepEqual(store.collect(deck, [ids[2], ids[1], ids[0], ids[2]]), [ids[2], ids[0]]);
  assert.deepEqual(store.collect(deck, ids), []);
});

test("imports retain removed cards' history but discard invalid and duplicated IDs", () => {
  const deck = store.clean({...store.empty(), collectionHistory:[ids[1], ids[1], "unknown", null, {}]}, ids);
  assert.deepEqual(deck.collectionHistory, [ids[1]]);
  assert.deepEqual(store.collect(deck, [ids[1]]), []);
});

function invocationHarness() {
  const timers = new Map(), sounds = []; let serial = 0;
  const node = {classList:{add(){},remove(){},toggle(){}}};
  const button = {textContent:"♥ Salva no Meu Deck", disabled:false, isConnected:true};
  const status = {textContent:"", isConnected:true};
  const root = {querySelectorAll:()=>[node],querySelector:()=>status};
  const ctx = {DeckInvocationProfiles:profiles, DeckI18n:{t:(s,p)=>s.replace(/\{(\w+)\}/g,(_,k)=>p?.[k]??k)},
    DeckSound:{enabled:true,stop(){},async play(kind,p){sounds.push([kind,p.key]);return true;}},
    localStorage:{getItem:()=>"reduced"}, matchMedia:()=>({matches:false}),
    document:{body:{classList:{contains:()=>false}},addEventListener(){}},
    setTimeout(fn){timers.set(++serial,fn);return serial;},clearTimeout(id){timers.delete(id);}};
  vm.createContext(ctx);vm.runInContext(fs.readFileSync("dist/deck-invocation.js","utf8")+";this.invocation=DeckInvocation;",ctx);
  const skill = {pricing:{currency:"USD",priceCents:4700}};
  return {...ctx,root,button,status,sounds,timers,skill,finish(){const [id,fn]=timers.entries().next().value;timers.delete(id);fn();}};
}

test("automatic arrival uses its tier sound, restores the save button and completes once", () => {
  const h = invocationHarness(); let complete=0,cancelled=0;
  h.invocation.start(h.skill,h.root,h.button,{kind:"collection",onComplete:()=>complete++,onCancel:()=>cancelled++});
  assert.equal(h.button.textContent,"♥ Salva no Meu Deck"); assert.equal(h.button.disabled,true);
  assert.deepEqual(h.sounds,[["summon","solar"]]);
  h.finish(); h.invocation.cancel();
  assert.equal(complete,1); assert.equal(cancelled,0); assert.equal(h.button.disabled,false);
  assert.match(h.status.textContent,/Carta adicionada ao Meu Deck/);
});

test("cancelling an arrival stops the sequence without invoking its completion callback", () => {
  const h=invocationHarness();let complete=0,cancelled=0;
  h.invocation.start(h.skill,h.root,h.button,{kind:"collection",onComplete:()=>complete++,onCancel:()=>cancelled++});
  h.invocation.cancel();h.invocation.cancel();
  assert.equal(complete,0);assert.equal(cancelled,1);assert.equal(h.timers.size,0);
  assert.equal(h.button.textContent,"♥ Salva no Meu Deck");assert.equal(h.button.disabled,false);
});

test("manual Invoke remains repeatable after an automatic collection ceremony", () => {
  const h=invocationHarness();h.invocation.start(h.skill,h.root,h.button,{kind:"collection"});h.finish();
  h.button.textContent="Invocar carta";
  for(let i=0;i<2;i++) {
    h.invocation.start(h.skill,h.root,h.button);
    assert.equal(h.button.textContent,"Invocando…");h.finish();
    assert.equal(h.button.textContent,"Invocar carta");assert.equal(h.invocation.running,false);
  }
  assert.equal(h.sounds.length,3);
});

function downloadHarness({badHash=false,badVersion=false,status=200}={}) {
  const source=fs.readFileSync("dist/market.js","utf8"), bytes=Buffer.from("a test package"), events=[];
  const skill={id:ids[0],code:"DD-001",version:"1.2.0",release:{sha256:createHash("sha256").update(bytes).digest("hex")}};
  const deck=store.empty();
  const ctx={deck,downloadStates:new Map(),restoreDownloadState(){},byId:()=>skill,Blob,URL:{createObjectURL:()=>"blob:verified",revokeObjectURL(){}},
    crypto:webcrypto,AbortSignal,location:{assign(url){events.push(["redirect",url]);}},
    DeckI18n:{url:s=>s,headers:()=>({})},
    fetch:async()=>({status,ok:status===200,json:async()=>({error:"Unavailable"}),
      headers:{get:key=>key==="content-type"?"application/zip":badVersion?"9.0.0":"1.2.0"},
      arrayBuffer:async()=>Uint8Array.from(badHash?Buffer.from("modified"):bytes).buffer}),
    document:{body:{append(){}},createElement:()=>({click(){events.push(["file"]);},remove(){}})},
    setTimeout(){},claimCollection:list=>{events.push(["claim"]);return store.collect(deck,list);},
    recordUsage(){},save(){events.push(["save"]);},renderDeck(){},confirmDownload:code=>events.push(["confirmed",code]),
    toast:message=>events.push(["error",message]),errorText:e=>e.message};
  vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf("async function download(id, button)"),source.indexOf("function renderMatches("))+";this.download=download;",ctx);
  return {...ctx,events,skill};
}

test("a verified download uses only short confirmation and records the first entry", async () => {
  const h=downloadHarness();await h.download(ids[0],{disabled:false});
  assert.deepEqual(h.events.map(e=>e[0]),["file","claim","save","confirmed"]);
  assert.equal(h.deck.downloads.length,1);assert.deepEqual(store.collect(h.deck,[ids[0]]),[]);
  assert.equal(h.downloadStates.get(ids[0]).pending,false);
});

for(const [name,options] of [["hash mismatch",{badHash:true}],["version mismatch",{badVersion:true}],["HTTP failure",{status:500}]])
  test(`${name} never reports a successful download or claims collection history`,async()=>{
    const h=downloadHarness(options);await h.download(ids[0],{disabled:false});
    assert.deepEqual(h.events.map(e=>e[0]),["error"]);assert.equal(h.deck.downloads.length,0);
    assert.deepEqual(h.deck.collectionHistory,[]);assert.equal(h.downloadStates.get(ids[0]).pending,false);
  });

test("download feedback lasts 2.2 seconds and never interrupts an active ceremony",()=>{
  const source=fs.readFileSync("dist/market.js","utf8"),events=[];
  const ctx={t:(s,p)=>s.replace("{code}",p.code),toast:(text,options)=>events.push({text,options}),DeckSound:{play:kind=>events.push(kind)},DeckInvocation:{running:false}};
  vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf("function confirmDownload("),source.indexOf("function errorText("))+";this.confirm=confirmDownload",ctx);
  ctx.confirm("DD-001");assert.equal(events[0].options.duration,2200);assert.equal(events[0].options.kind,"download");assert.equal(events[1],"download");
  ctx.DeckInvocation.running=true;ctx.confirm();assert.equal(events.length,3);
});

test("new arrival and download feedback is available in both additional languages",()=>{
  for(const key of ["Nova carta no Meu Deck","{index} de {count}","Encerrar apresentação","Carta adicionada ao Meu Deck. Use Invocar carta para repetir.","ZIP conferido. Continue pelo Primeiro uso.","ZIP conferido. Download iniciado.","{code} · ZIP conferido. Download iniciado."]) {
    assert.equal(dictionary[key]?.length,2,key);assert.ok(dictionary[key].every(s=>typeof s==="string"&&s.length));
  }
});
