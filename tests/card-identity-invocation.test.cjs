"use strict";
const test = require("node:test"), assert = require("node:assert/strict"), fs = require("node:fs"), vm = require("node:vm");
const {createHash} = require("node:crypto");
const catalog = require("../lib/catalog.cjs"), {localizeCatalog} = require("../lib/catalog-i18n.cjs");
const {getCardIdentity} = require("../lib/card-identity.cjs"), identity = require("../dist/card-identity.js");
const profiles = require("../dist/invocation-profiles.js"), dictionary = require("../data/i18n-market.cjs");
const hash = value => createHash("sha256").update(value).digest("hex");

test("137 card identities are unique, reproducible and independent of price, prose and version", async () => {
  assert.equal(new Set(catalog.skills.map(s => s.identity.id)).size, 161);
  assert.equal(new Set(catalog.skills.map(s => s.identity.serial)).size, 161);
  for (const s of catalog.skills) {
    assert.equal(s.identity.id, "ddk_" + hash("drivedata:deck:card:v1\n" + s.code));
    assert.ok(await identity.verify(s), s.code);
    assert.deepEqual(getCardIdentity({...s, id: "new-title-slug", title: "Updated", pricing: {priceCents: 700}}, s.release), s.identity);
    const next = getCardIdentity(s, {...s.release, version: "1.3.0", sha256: hash("new package bytes")});
    assert.equal(next.id, s.identity.id); assert.equal(next.serial, s.identity.serial);
    assert.notEqual(next.edition.id, s.identity.edition.id);
    assert.notEqual(getCardIdentity({...s, code: "DD-999"}, s.release).id, s.identity.id);
  }
  for (const locale of ["en", "es"]) localizeCatalog(catalog, locale).skills.forEach((s, i) => assert.deepEqual(s.identity, catalog.skills[i].identity));
});

test("identity verification rejects changed IDs, editions, serials and unissued ownership claims", async () => {
  const original = catalog.skills[0];
  const changes = [s => s.identity.id = "ddk_" + "0".repeat(64), s => s.identity.serial += "X",
    s => s.identity.edition.id = "dde_" + "0".repeat(64), s => s.identity.edition.packageSha256 = hash("tampered"),
    s => s.release.sha256 = hash("tampered"), s => s.code = "DD-999", s => s.identity.blockchain.status = "minted",
    s => s.identity.blockchain.contract = "0x123", s => s.identity.namespace = "someone-else"];
  for (const change of changes) { const s = structuredClone(original); change(s); assert.equal(await identity.verify(s), false); }
  const manifest = identity.manifest(original);
  assert.equal(hash(manifest.canonicalCardInput), original.identity.digest);
  assert.equal(hash(manifest.canonicalEditionInput), original.identity.edition.digest);
  assert.equal(manifest.identity.blockchain.tokenId, null);
  assert.match(manifest.scope, /not a unique purchased copy/);
  assert.equal(await identity.sha256(Buffer.from("abc")), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.throws(() => identity.cardInput("DD-001\nanything"));
});

test("all nine USD bands have distinct bounded audio scores and increasing ceremonies", () => {
  assert.deepEqual(profiles.all.map(p => p.minCents), [700,1200,1700,2200,2700,3200,3700,4200,4700]);
  assert.equal(new Set(profiles.all.map(p => JSON.stringify(profiles.score(p)))).size, 9);
  for (const [i, p] of profiles.all.entries()) {
    assert.equal(profiles.forPrice({currency:"USD",priceCents:p.minCents}), p);
    if (i) assert.equal(profiles.forPrice({currency:"USD",priceCents:p.minCents - 1}), profiles.all[i-1]);
    const events = profiles.score(p);
    assert.ok(events.length <= 40); assert.ok(p.durationMs <= 4500);
    for (const e of events) { assert.ok(e.hz >= 30 && e.hz <= 4500); assert.ok(e.gain > 0 && e.gain <= .5); assert.ok(e.at >= 0); assert.ok((e.at+e.duration)*1000 < p.durationMs); assert.ok(Math.abs(e.pan) <= 1); }
    if (i) assert.ok(p.durationMs > profiles.all[i-1].durationMs);
    for (const key of [p.name, p.description]) assert.equal(dictionary[key]?.length, 2, key);
  }
  for (const p of [null,{}, {currency:"BRL",priceCents:4700},{currency:"USD",priceCents:699},{currency:"USD",priceCents:NaN}]) assert.equal(profiles.forPrice(p), null);
  assert.ok(catalog.skills.every(s => profiles.forPrice(s.pricing)));
});

function audioHarness(resume = () => Promise.resolve()) {
  const contexts = [], timers = new Map(); let timerID = 0;
  function param(){return {value:0, setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},cancelScheduledValues(){}};}
  class Context {
    constructor(){this.currentTime=0;this.sampleRate=48000;this.nodes=[];this.destination={};contexts.push(this);}
    resume(){return resume();}
    node(extra={}){const n={connected:false,stopped:false,connect(){this.connected=true;},disconnect(){this.connected=false;},...extra};this.nodes.push(n);return n;}
    createGain(){return this.node({gain:param()});}
    createDynamicsCompressor(){return this.node({threshold:param(),knee:param(),ratio:param(),attack:param(),release:param()});}
    createStereoPanner(){return this.node({pan:param()});}
    createOscillator(){return this.node({frequency:param(),start(){this.started=true;},stop(){this.stopped=true;}});}
    createBufferSource(){return this.createOscillator();}
    createBuffer(channels,length){return {getChannelData:()=>new Float32Array(length)};}
    createBiquadFilter(){return this.node({frequency:param(),Q:param()});}
  }
  const sandbox={window:{AudioContext:Context},localStorage:{getItem(){return "on";},setItem(){}},DeckInvocationProfiles:profiles,
    setTimeout(fn){timers.set(++timerID,fn);return timerID;},clearTimeout(id){timers.delete(id);}};
  vm.createContext(sandbox);vm.runInContext(fs.readFileSync("dist/deck-sound.js","utf8")+";this.sound=DeckSound",sandbox);
  return {...sandbox,contexts,timers};
}
test("muting or cancelling immediately disconnects active sound and prevents resumed ghost audio", async () => {
  const h=audioHarness(); assert.equal(await h.sound.play("summon", profiles.all[8]), true);
  assert.ok(h.contexts[0].nodes.some(n=>n.connected));h.sound.set(false);
  assert.ok(h.contexts[0].nodes.every(n=>!n.connected));assert.equal(h.timers.size,0);
  assert.equal(await h.sound.play("summon",profiles.all[8]),false);
  let resume;const pending=audioHarness(()=>new Promise(resolve=>resume=resolve));
  const call=pending.sound.play("summon",profiles.all[8]);pending.sound.stop();resume();
  assert.equal(await call,false);assert.equal(pending.contexts[0].nodes.length,0);
});
test("repeated invocations share one audio context and release the previous sound graph", async () => {
  const h=audioHarness();await h.sound.play("summon",profiles.all[8]);const old=[...h.contexts[0].nodes];
  await h.sound.play("summon",profiles.all[0]);assert.equal(h.contexts.length,1);
  assert.ok(old.every(n=>!n.connected));assert.equal(h.timers.size,1);h.sound.stop();
});

test("closing or re-rendering an invocation cancels timers and restores its controls", async () => {
  const timers=new Map();let serial=0,stops=0;
  const node=()=>({classList:{values:new Set(),add(x){this.values.add(x)},remove(x){this.values.delete(x)},toggle(x,on){on?this.values.add(x):this.values.delete(x)}}});
  const targets=[node(),node()],button={isConnected:true,disabled:false},status={isConnected:true,textContent:""};
  const root={querySelectorAll:()=>targets,querySelector:()=>status};
  const ctx={DeckInvocationProfiles:profiles,DeckI18n:{t:(s,p)=>s.replace(/\{(\w+)\}/g,(_,k)=>p?.[k]??k)},
    DeckSound:{enabled:false,stop(){stops++},async play(){return false}},localStorage:{getItem(){return "reduced"}},
    matchMedia:()=>({matches:false}),document:{body:{classList:{contains(){return false}}},addEventListener(){}},
    setTimeout(fn){timers.set(++serial,fn);return serial},clearTimeout(id){timers.delete(id)}};
  vm.createContext(ctx);vm.runInContext(fs.readFileSync("dist/deck-invocation.js","utf8")+";this.invocation=DeckInvocation",ctx);
  ctx.invocation.start(catalog.skills.find(s=>s.pricing.priceCents===4700),root,button);
  assert.equal(button.disabled,true);assert.ok(targets.every(n=>n.classList.values.has("is-invoked")));
  assert.ok(targets.every(n=>n.classList.values.has("invocation-reduced")));
  await Promise.resolve();assert.doesNotMatch(status.textContent,/não está disponível/);
  ctx.invocation.cancel();assert.equal(button.disabled,false);assert.equal(timers.size,0);
  assert.ok(targets.every(n=>!n.classList.values.has("is-invoked")));assert.ok(stops>=2);
});
