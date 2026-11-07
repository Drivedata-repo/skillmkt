"use strict";
// Local helpers only. No networking, subprocesses, secret display, or agent execution.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!m) throw Error('Missing frontmatter');
  const result = {};
  for (const name of ['name','description']) {
    const values = [...m[1].matchAll(new RegExp('^'+name+':\\s*(.+)$','gm'))];
    if (values.length !== 1 || !values[0][1].trim()) throw Error('Missing or duplicate '+name);
    result[name] = values[0][1].trim();
  }
  return { ...result, validation:'structural-only', yamlSchemaValidated:false };
}
function demo(argument) {
  if (typeof argument !== 'string' || !argument.trim()) throw Error('A nonempty text argument is required');
  const text = argument.trim().normalize('NFC');
  return {text, characters:Array.from(text).length};
}
function decimalId(value, signed=false) {
  if (typeof value !== 'string' || !(signed ? /^-?[1-9]\d*$/ : /^[1-9]\d*$/).test(value)) throw Error('Expected exact decimal ID string');
  return value; // Do not round a platform ID through Number.
}
function inventory(root, declared=[]) {
  root = fs.realpathSync(root);
  const files = [], cases = new Map();
  function visit(dir) {
    for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
      const full = path.join(dir,entry.name), rel = path.relative(root,full).replaceAll('\\','/');
      if (entry.isSymbolicLink()) throw Error('Symlink requires explicit review');
      const key = rel.toLowerCase();
      if (cases.has(key)) throw Error('Case collision');
      cases.set(key,rel);
      if (entry.isDirectory()) visit(full); else files.push(rel);
    }
  }
  visit(root);
  for (const rel of declared) {
    if (path.isAbsolute(rel) || rel.replaceAll('\\','/').split('/').includes('..')) throw Error('Path outside package');
    if (!files.includes(rel.replaceAll('\\','/'))) throw Error('Missing declared file');
  }
  return {files, declaredVerified:declared.length};
}
function transcript(text) {
  const records=[], errors=[];
  text.split(/\r?\n/).forEach((line,i)=>{
    if (!line.trim()) return;
    try { const item=JSON.parse(line); if (!item || typeof item!=='object' || Array.isArray(item)) throw Error(); records.push(item); }
    catch { errors.push({line:i+1,reason:'invalid-json-record'}); }
  });
  const timestamps=records.map(r=>r.timestamp||r.time).filter(v=>typeof v==='string');
  return {records, coverage:{read:records.length,ignored:errors.length,errors,timestampsPreserved:timestamps,completionInferred:false}};
}
function updateAccessFile(file, expectedHash, mutate, options={}) {
  // This helper cannot lock a non-cooperating server. Caller MUST first stop it.
  if (options.writerStopped !== true) throw Error('Stop the external writer or use its transactional API');
  if (typeof mutate !== 'function') throw Error('Mutation function required');
  const resolved=path.resolve(file), lock=resolved+'.revision-lock';
  let lockFd, temporary;
  try {
    lockFd=fs.openSync(lock,'wx',0o600);
    const before=fs.readFileSync(resolved);
    if (hash(before)!==expectedHash) throw Error('State conflict');
    const original=JSON.parse(before.toString('utf8'));
    const next=mutate(structuredClone(original));
    if (!next || typeof next!=='object' || Array.isArray(next)) throw Error('State must remain an object');
    const after=Buffer.from(JSON.stringify(next,null,2)+'\n');
    const backup=resolved+'.backup-'+crypto.randomUUID();
    fs.writeFileSync(backup,before,{flag:'wx',mode:0o600});
    temporary=resolved+'.tmp-'+crypto.randomUUID();
    const fd=fs.openSync(temporary,'wx',0o600);
    try {fs.writeFileSync(fd,after);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
    if (hash(fs.readFileSync(resolved))!==expectedHash) throw Error('State conflict before replace');
    fs.renameSync(temporary,resolved);temporary=null;
    if(hash(fs.readFileSync(resolved))!==hash(after))throw Error('Write verification failed; restore verified backup');
    return {sha256:hash(after),backup};
  } finally {
    if(temporary && fs.existsSync(temporary)) fs.unlinkSync(temporary);
    if(lockFd!==undefined){fs.closeSync(lockFd);fs.unlinkSync(lock);}
  }
}
module.exports={hash,frontmatter,demo,decimalId,inventory,transcript,updateAccessFile};
if(require.main===module){
  const [command,arg]=process.argv.slice(2);
  let result;
  if(command==='demo')result=demo(arg);
  else if(command==='frontmatter')result=frontmatter(fs.readFileSync(arg,'utf8'));
  else if(command==='inventory')result=inventory(arg);
  else if(command==='transcript')result=transcript(fs.readFileSync(arg,'utf8')).coverage; // no prompt text in CLI output
  else throw Error('Usage: revision-tools.cjs demo TEXT | frontmatter FILE | inventory DIR | transcript FILE');
  console.log(JSON.stringify(result,null,2));
}
