"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {unzipSync}=require('fflate');
const evidence=require('../data/deliverable-evidence.json');
const {stageRelease,stagedReleaseIntact,verifyRun}=require('../scripts/run-deliverable-evals.cjs');
const root=path.resolve(__dirname,'..'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
test('review bundle preserves original files, synthetic inputs and pending owner acceptance',()=>{
 const archive=unzipSync(fs.readFileSync(path.join(root,'dist/ensaios/deck-ensaios.zip')));
 for(const s of evidence.scenarios){for(const a of [...s.artifacts,s.inputs,...s.reviewArtifacts]){
  const bytes=archive[`files/${s.version}/${s.caseId}/${a.filename}`];assert.ok(bytes);assert.equal(hash(bytes),a.sha256);
 }}
 const manifest=JSON.parse(Buffer.from(archive['evidence.json']).toString());assert.equal(manifest.ownerAcceptance,'pending');
 const html=Buffer.from(archive['CONFERENCIA.html']).toString();assert.doesNotMatch(html,/src="\/|href="\/|href="deck-ensaios\.zip"/);assert.equal((html.match(/data-owner-review/g)||[]).length>=10,true);
 assert.ok(!Object.keys(archive).some(n=>/SKILL\.md|private-|\.env|generator|skill-source/.test(n)));
 for(const locale of ['index','en','es']){const page=fs.readFileSync(path.join(root,`dist/ensaios/${locale}.html`),'utf8');assert.equal((page.match(/<article /g)||[]).length,10);assert.equal((page.match(/type="checkbox"/g)||[]).length,10);assert.doesNotMatch(page,/type="checkbox"[^>]*\bchecked\b/);}
});
test('complete release staging detects changed references and excludes blocked assistant runs',t=>{
 const s=evidence.scenarios[0],archive=path.join(root,`.local/releases/${s.version}/${s.skillId}.zip`);
 if(!fs.existsSync(archive))return t.skip('Private release archive is not available in this environment');
 const allowed=path.join(root,'.local/artifact-evals');fs.mkdirSync(allowed,{recursive:true});const dir=fs.mkdtempSync(path.join(allowed,'staging-test-'));
 try{
  assert.throws(()=>stageRelease(dir,s.skillId,s.version,'0'.repeat(64)),/changed/);
  const staged=stageRelease(dir,s.skillId,s.version,s.packageSha256);assert.ok(staged.files>1);assert.equal(stagedReleaseIntact(dir,s.skillId,s.version,s.packageSha256),true);
  const reference=path.join(dir,`skill-source/${s.skillId}/revision-contract.md`);fs.appendFileSync(reference,'\nTEST MUTATION\n');assert.equal(stagedReleaseIntact(dir,s.skillId,s.version,s.packageSha256),false);
  const files=s.artifacts.map(a=>{fs.copyFileSync(path.join(root,'dist',a.url.slice(1)),path.join(dir,a.filename));return {filename:a.filename,exists:true,sha256:a.sha256};});
  fs.writeFileSync(path.join(dir,'run.json'),JSON.stringify({caseId:s.caseId,version:s.version,sourceSha256:s.sourceSha256,packageSha256:s.packageSha256,stagedRelease:staged,exitCode:0,timedOut:false,forbiddenTool:false,policyBlocked:true,toolEvents:1,files,runtime:'Synthetic regression fixture'}));
  const result=verifyRun(dir);assert.equal(result.assistantRunEligible,false);assert.equal(result.completeReleaseIntact,false);assert.equal(result.passed,false);
 }finally{if(!path.resolve(dir).startsWith(path.resolve(allowed)+path.sep))throw Error('Unsafe cleanup path');fs.rmSync(dir,{recursive:true,force:true});}
});
