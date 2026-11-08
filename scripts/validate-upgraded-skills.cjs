"use strict";
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {unzipSync,strFromU8}=require('fflate');
const {digest,longEntries,connectorIds,privateEditions}=require('./upgrade-skills.cjs');
const ROOT=path.resolve(__dirname,'..');
const skills=require('../data/skills.cjs'), specs=require('../data/skill-improvements/index.cjs');
const audit=require('../reviews/skill-audit.json').records;
function localLinks(source,entry,files){
  const failures=[];
  for(const m of source.matchAll(/\[[^\]\n]*\]\(([^)\n]+)\)/g)){
    const raw=m[1].trim().replace(/^<|>$/g,'').split(/\s+["']/)[0];
    if(/^(?:[a-z][\w+.-]*:|#|\/)/i.test(raw)||/[{}$<>]/.test(raw))continue;
    const target=raw.split('#')[0];
    if(!target||!/\.[a-z0-9]{1,8}$/i.test(target))continue;
    const full=path.posix.normalize(path.posix.join(path.posix.dirname(entry),target));
    if(!files[full])failures.push({entry,target});
  }
  return failures;
}
function validateAll(){
  delete require.cache[require.resolve('../data/releases.cjs')];
  const releases=require('../data/releases.cjs'), failures=[], results=[];
  assert.deepEqual(specs.map(s=>s.id),skills.map(s=>s.id));
  for(const skill of skills){
    const id=skill.id,meta=JSON.parse(fs.readFileSync(path.join(ROOT,'.local/releases/1.2.0',id+'.json'),'utf8')),baseline=fs.readFileSync(path.join(ROOT,'.local/releases/1.1.0',id+'.zip'));
    assert.equal(digest(baseline),audit.find(r=>r.id===id).source.packageSha256,'original archive preserved');
    const bytes=fs.readFileSync(path.join(ROOT,'.local/releases/1.2.0',id+'.zip'));
    assert.equal(digest(bytes),meta.sha256,id+' package hash');assert.equal(bytes.length,meta.bytes);assert.equal(meta.version,'1.2.0');
    assert.equal(meta.executionTested,false);assert.equal(meta.commercialCleared,false);
    const files=unzipSync(bytes),manifest=JSON.parse(strFromU8(files['MANIFEST.json'])),hashes=JSON.parse(strFromU8(files['INTEGRIDADE.json']));
    assert.equal(Object.keys(files).length,meta.fileCount);
    assert.equal(Object.keys(hashes).length,Object.keys(files).length-1);
    for(const[n,h]of Object.entries(hashes)){assert.ok(files[n],id+' missing entry');assert.equal(digest(files[n]),h,id+' file integrity');}
    for(const[k,v]of Object.entries(manifest))assert.deepEqual(meta[k],v,id+' manifest metadata');
    const entry=id+'/SKILL.md',source=strFromU8(files[entry]);
    assert.match(source,/^---\r?\n[\s\S]+?\r?\n---/);assert.match(source,/^name:\s*\S+/m);assert.match(source,/^description:\s*\S+/m);
    assert.equal(digest(files[entry]),meta.sourceSha256);assert.notEqual(meta.sourceSha256,meta.baselineSourceSha256);
    assert.ok(files[id+'/revision-contract.md']);assert.ok(files[id+'/revision-cases.json']);
    const cases=JSON.parse(strFromU8(files[id+'/revision-cases.json']));assert.equal(cases.id,id);assert.equal(cases.executionTested,false);assert.ok(cases.positive.check);assert.ok(cases.negative.request);
    assert.ok(meta.changes.some(c=>c.path===entry&&c.kind==='modified'));
    const old=unzipSync(baseline);
    for(const license of meta.licenseFiles)assert.equal(digest(files[id+'/'+license]),digest(old[id+'/'+license]),id+' preserve license');
    failures.push(...localLinks(source,entry,files).map(x=>({id,...x})));
    if(longEntries.has(id)){
      assert.ok(source.split(/\s+/).length<5000,'shortened entry');
      const ref=id+'/references/revision-workflow.md';assert.ok(files[ref]);
      failures.push(...localLinks(strFromU8(files[ref]),ref,files).map(x=>({id,...x})));
    }
    if(connectorIds.has(id)){assert.ok(files[id+'/CONNECTORS.md']);assert.ok(!source.includes('../../CONNECTORS.md'));}
    if(privateEditions.has(id))assert.equal(meta.sourcePolicy,'sanitized-original-retained-privately');
    if(id.startsWith('figma-')||id==='generate-project-plan'){
      assert.ok(files[id+'/references/revision-runtime.md']);
      for(const[n,b]of Object.entries(files))if(n.startsWith(id+'/')&&n.endsWith('.md')){
        const s=strFromU8(b);
        assert.doesNotMatch(s,/NO 4th call|COMPLETE in 3 `use_figma` calls|failed scripts are atomic|atomic — no changes made|NEVER call `mcp__figma__get_design_context`/,'conflicting guidance removed '+n);
      }
    }
    results.push({id,integrity:true,frontmatter:true,sourceChanged:true,contractCases:true,executionTested:false});
  }
  assert.deepEqual(failures,[],'local entry/reorganized reference links');
  return {version:'1.2.0',packages:results.length,integrity:'pass',entryLinks:'pass',originalArchives:'preserved',sourceChanges:results.length,connectors:7,longEntries:4,executionTested:false};
}
module.exports={validateAll,localLinks};
if(require.main===module)console.log(JSON.stringify(validateAll(),null,2));
