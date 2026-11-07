"use strict";
// Runs local, deterministic teaching references. It does not load or execute
// instructions from SKILL.md, call an AI provider, or contact external services.
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const {skills}=require("../lib/catalog.cjs");
const {localizeCatalog}=require("../lib/catalog-i18n.cjs");
const {getLab}=require("../lib/lab.cjs");
const root=path.resolve(__dirname,"../.local/lab-references");
const records=[];
for(const locale of ["pt","en","es"]){
 const directory=path.join(root,locale);fs.mkdirSync(directory,{recursive:true});
 for(const skill of localizeCatalog({skills,journeys:[]},locale).skills){
  if(!skill.example)continue;
  const lab=getLab(skill,locale),reference=lab.reference;
  for(const artifact of reference.artifacts){
   const target=path.join(directory,artifact.filename);
   fs.writeFileSync(target,artifact.content,"utf8");
   if(crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex")!==artifact.sha256)throw Error("Artifact integrity mismatch");
  }
  const record={skillId:skill.id,locale,method:reference.method,model:reference.model,runtime:reference.runtime,date:reference.executedAt,inputSha256:reference.inputSha256,outputSha256:reference.outputSha256,checks:reference.checks,passed:reference.passed,executionVerified:false,artifacts:reference.artifacts.map(({content,...metadata})=>metadata)};
  fs.writeFileSync(path.join(directory,`${skill.id}-verification.json`),JSON.stringify(record,null,2)+"\n");records.push(record);
 }
}
const summary={schemaVersion:1,method:"deterministic-reference",skills:new Set(records.map(r=>r.skillId)).size,runs:records.length,passed:records.filter(r=>r.passed).length,aiExecutions:0,records};
fs.writeFileSync(path.join(root,"manifest.json"),JSON.stringify(summary,null,2)+"\n");
console.log(JSON.stringify({directory:root,skills:summary.skills,runs:summary.runs,passed:summary.passed,aiExecutions:0}));
if(summary.passed!==summary.runs)process.exitCode=1;
