"use strict";
(() => {
  const articles=[...document.querySelectorAll('[data-case-id]')], storageKey='deck-artifact-owner-review-v1';
  let stored={};try{stored=JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{}
  if(!stored||typeof stored!=='object'||Array.isArray(stored))stored={};
  function identity(a){return JSON.stringify([a.dataset.packageHash,a.dataset.outputHashes])}
  function update(){document.querySelector('#review-count').textContent=`${articles.filter(a=>a.querySelector('input').checked).length} / ${articles.length}`}
  for(const a of articles){const input=a.querySelector('[data-owner-review]'),id=a.dataset.caseId;input.checked=stored[id]?.identity===identity(a)&&stored[id]?.reviewed===true;input.addEventListener('change',()=>{stored[id]={identity:identity(a),reviewed:input.checked,reviewedAt:new Date().toISOString()};try{localStorage.setItem(storageKey,JSON.stringify(stored))}catch{}update()})}
  document.querySelector('#export-review').addEventListener('click',()=>{
    const report={kind:'owner-file-review',exportedAt:new Date().toISOString(),language:document.documentElement.lang,localOnly:true,scenarios:articles.map(a=>({caseId:a.dataset.caseId,version:a.dataset.version,packageSha256:a.dataset.packageHash,outputHashes:JSON.parse(a.dataset.outputHashes),reviewed:a.querySelector('input').checked,reviewedAt:stored[a.dataset.caseId]?.reviewedAt||null}))};
    const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='deck-minha-conferencia.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });update();
})();
