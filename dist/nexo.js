"use strict";
window.DeckNexo=(()=>{
  const $=s=>document.querySelector(s),t=(s,p)=>DeckI18n.t(s,p),esc=s=>DeckArt.esc(s);
  const canonical=DeckNexoCore.canonicalizer(window.DeckTranslations);
  const MAX_AI=8;
  let bridge,entries=[],busy=false,revision=0,controller,opener,lastClarification=null,serial=0,aiCount=0;
  const context=()=>bridge.context(),skill=id=>context().skills.find(s=>s.id===id);
  const art=s=>`<div class="nexo-result-art" aria-hidden="true">${DeckArt.card(s)}</div>`;
  const action=(label,attr,id,extra="")=>`<button type="button" ${attr}="${esc(id)}" ${extra}>${esc(t(label))}</button>`;
  function card(id,index,comparison=false){
    const s=skill(id);if(!s)return "";
    const saved=context().favoriteIds.includes(id);
    const purpose=s.universe.purpose.split(/(?<=[.!?])\s+/)[0];
    return `<article class="nexo-result">${art(s)}<div class="nexo-result-copy"><p class="nexo-card-code">${esc(s.code)} · ${esc(comparison?t("Comparação"):t(index?"Também pode ajudar":"Comece por aqui"))}</p><h3>${esc(s.title)}</h3><p>${esc(purpose)}</p><dl><div><dt>${esc(t("Entrega sugerida"))}</dt><dd>${esc(s.deliverables[0])}</dd></div></dl><details class="nexo-requirements" data-nexo-alternative="${esc(id)}-requirements"><summary>${esc(t("Requisitos e limites"))}</summary><dl><dt>${esc(t("Prepare antes"))}</dt><dd>${esc(s.dependencies.join(" · "))}</dd></dl><p>${esc(s.universe.purpose)}</p><p class="nexo-boundary">${esc(s.universe.boundary)}</p></details><p class="nexo-card-price">${esc(t(s.pricing?.officialGuide?"Carta grátis":"Preço proposto"))} · ${esc(DeckCommerce.money(s.pricing?.priceCents||0))}</p><div class="nexo-card-actions">${action("Ver carta","data-nexo-card",id)}${action("Primeiro uso","data-nexo-start",id)}${action(saved?"No Meu Deck":"Adicionar ao Meu Deck","data-nexo-save",id,saved?'disabled':"")}</div><p class="nexo-source">${esc(t("Fonte: carta {code} · v{version}",{code:s.code,version:s.version}))}</p></div></article>`;
  }
  function reply(entry){
    const r=entry.reply;
    if(r.type==="ai")return `<p>${esc(r.answer)}</p>${r.licenseNote?`<aside class="nexo-license"><strong>${esc(t("Sobre a licença"))}</strong><p>${esc(r.licenseNote)}</p></aside>`:""}${(r.cardIds||[]).map((id,i)=>card(id,i)).join("")}${r.inScope===false?"":`<p class="nexo-ai-note">${esc(t("Resposta gerada por IA a partir do catálogo e da ajuda do Deck. Confira a licença no pacote."))}</p>`}`;
    if(r.type==="blocked")return `<p>${esc(r.answer)}</p>`;
    if(r.type==="notice")return `<p>${esc(t(r.message))}</p>`;
    if(r.type==="guide"){
      const body=(DeckNexoCore.guides[r.topic]||[]).map(p=>`<p>${esc(t(p))}</p>`).join("");
      const target=skill(r.id);
      return body+(target&&["install","download","downloadError"].includes(r.topic)?`<div class="nexo-card-actions">${action(r.topic==="downloadError"?"Abrir ajuda da carta":"Abrir Primeiro uso",r.topic==="downloadError"?"data-nexo-help":"data-nexo-start",target.id)}</div>`:"");
    }
    if(r.type==="unavailable")return `<p>${esc(t("Não encontrei {codes} no catálogo disponível nesta sessão. Confira o código; não vou indicar uma carta que você não pode abrir.",{codes:r.codes.join(", ")}))}</p>`;
    if(r.type==="error")return `<p>${esc(t(r.message))}</p>${entry.request?action("Tentar novamente","data-nexo-retry",entry.id):""}`;
    const heading=r.type==="compare"?t("A diferença está na entrega que você precisa."):r.type==="cards"?t("Esta é a função desta carta no seu trabalho."):t(r.summary);
    const clarify=r.clarification?`<p class="nexo-followup">${esc(t(r.clarification.question))}</p><div class="nexo-choices">${r.clarification.options.map(o=>action(o.label,"data-nexo-refine",o.id,`data-nexo-entry="${entry.id}" ${lastClarification!==entry||busy?'disabled':""}`)).join("")}</div>`:"";
    const plan=r.plan?`<section class="nexo-plan"><h3>${esc(t("Um caminho para esta entrega"))}</h3><ol>${r.plan.ids.map(id=>`<li>${esc(skill(id)?.title||"")}</li>`).join("")}</ol><p>${esc(t("Confira a saída de cada etapa antes de seguir para a próxima."))}</p>${action("Adicionar as cartas ao Meu Deck","data-nexo-plan",entry.id)}</section>`:"";
    return `<p>${esc(heading)}</p>${clarify}${plan}${(r.ids||[]).map((id,i)=>r.type==="matches"&&i>0?`<details class="nexo-alternative" data-nexo-alternative="${esc(id)}"><summary>${esc(t("Também pode ajudar"))}: ${esc(skill(id)?.title||"")}</summary>${card(id,i)}</details>`:card(id,i,r.type==="compare")).join("")}`;
  }
  function render(preserveScroll=false){
    if(!bridge)return;
    const oldScroll=$("#nexo-scroll").scrollTop;
    const expanded=[...$("#nexo-conversation").querySelectorAll("[data-nexo-alternative][open]")].map(e=>e.dataset.nexoAlternative);
    const active=$("#nexo-dialog").contains(document.activeElement)?document.activeElement:null;
    const focusKey=active?.dataset.nexoEntry,focusChoice=active?.dataset.nexoRefine;
    $("#nexo-welcome").hidden=entries.length>0;
    $("#nexo-conversation").innerHTML=entries.map(e=>`<article class="nexo-message nexo-${e.role}">${e.role==="user"?`<p>${esc(e.text)}</p>`:`<span class="nexo-speaker">NEXO</span>${reply(e)}`}</article>`).join("");
    $("#nexo-conversation").setAttribute("aria-label",t("Conversa com NEXO"));
    for(const id of expanded)$("#nexo-conversation").querySelector(`[data-nexo-alternative="${CSS.escape(id)}"]`)?.setAttribute("open","");
    $("#nexo-busy").hidden=!busy;
    $("#nexo-form").setAttribute("aria-busy",String(busy));
    $("#nexo-send").disabled=busy;
    $("#nexo-dialog").classList.toggle("nexo-thinking",busy);
    $("#nexo-prompt-context").hidden=!context().selectedId;
    $("#nexo-footnote").hidden=Boolean(context().ai);
    $("#nexo-ai-footnote").hidden=!context().ai;
    $("#nexo-status").textContent=busy?t("Estou comparando sua tarefa com o catálogo…"):"";
    if(focusKey&&focusChoice)$("#nexo-conversation").querySelector(`[data-nexo-entry="${CSS.escape(focusKey)}"][data-nexo-refine="${CSS.escape(focusChoice)}"]`)?.focus({preventScroll:true});
    const scroller=$("#nexo-scroll"),last=$("#nexo-conversation").lastElementChild;
    scroller.scrollTop=preserveScroll?oldScroll:last?scroller.scrollTop+last.getBoundingClientRect().top-scroller.getBoundingClientRect().top-18:0;
  }
  function append(role,fields){const e={id:++serial,role,...fields};entries.push(e);if(entries.length>20)entries=entries.slice(-20);return e;}
  async function search(request){
    const ticket=++revision;busy=true;lastClarification=null;controller=new AbortController();render();
    try{
      const result=await bridge.find({...request,useAI:false},AbortSignal.any([controller.signal,AbortSignal.timeout(20000)]));
      if(ticket!==revision)return;
      const entry=append("assistant",{reply:DeckNexoCore.result(result,context().skills,canonical),request});
      if(entry.reply.clarification)lastClarification=entry;
    }catch(error){
      if(ticket!==revision)return;
      append("assistant",{reply:{type:"error",message:error.name==="TimeoutError"?"A busca demorou mais que o esperado. Tente novamente.":"Não consegui consultar o catálogo agora. Tente novamente; as orientações de instalação continuam disponíveis."},request});
    }finally{if(ticket===revision){busy=false;render();}}
  }
  const history=()=>entries.slice(0,-1).filter(e=>e.role==="user").map(e=>({role:"user",text:e.text})).slice(-4);
  async function ask(message,request){
    const ticket=++revision;busy=true;lastClarification=null;controller=new AbortController();render();
    let outcome=null;
    try{outcome=await bridge.chat({message,history:history(),selectedId:context().selectedId||null,locale:DeckI18n.locale},AbortSignal.any([controller.signal,AbortSignal.timeout(25000)]));}catch{outcome=null;}
    if(ticket!==revision)return;
    const data=outcome?.data;
    if(outcome?.status===200&&data?.mode==="ai"){aiCount+=1;append("assistant",{reply:{type:"ai",...data}});busy=false;render();return;}
    if(outcome?.status===200&&data?.mode==="blocked"){const at=entries.findLastIndex(e=>e.role==="user"&&e.text===message);if(at>=0)entries.splice(at,1);append("assistant",{reply:{type:"blocked",answer:data.answer}});busy=false;render();return;}
    if(outcome?.status===429)append("assistant",{reply:{type:"notice",message:"Você atingiu o limite de mensagens com IA por agora. O guia do catálogo continua disponível."}});
    busy=false;
    return search(request);
  }
  function submit(text){
    const message=text.trim();if(!message||busy)return;
    if(message.length>2000){$("#nexo-status").textContent=t("Use até 2.000 caracteres por mensagem.");return;}
    lastClarification=null;append("user",{text:message});$("#nexo-message").value="";
    const response=DeckNexoCore.resolve(message,context());
    const toAI=context().ai&&DeckNexoCore.wantsAI(message,response)&&aiCount<MAX_AI&&message.length<=800;
    if(response.type!=="search"&&!toAI){append("assistant",{reply:response});render();return;}
    const request={problem:message,audience:context().audience,profile:context().profile,refinement:null};
    if(context().ai&&message.length>800){append("assistant",{reply:{type:"notice",message:"Para a resposta com IA, use até 800 caracteres. Usei o guia do catálogo."}});render();search(request);return;}
    if(context().ai&&aiCount<MAX_AI){ask(message,request);return;}
    if(context().ai){append("assistant",{reply:{type:"notice",message:"Chegamos ao limite de respostas com IA desta conversa. Comece uma nova conversa para continuar; o guia do catálogo continua disponível."}});render();}
    search(request);
  }
  function open(source){
    if(!bridge)return;opener=source;DeckInvocation.cancel();
    render(true);if(!$("#nexo-dialog").open)$("#nexo-dialog").showModal();
    if(source?.closest("#skill-dialog")&&context().selectedId&&!busy){const draft=$("#nexo-message").value;submit(t("Me explique esta carta"));$("#nexo-message").value=draft;}
    $("#nexo-message").focus({preventScroll:true});
  }
  function close(){if($("#nexo-dialog").open)$("#nexo-dialog").close();}
  function start(callbacks){
    if(bridge)return;bridge=callbacks;
    document.querySelectorAll("[data-nexo-launch]").forEach(b=>{b.hidden=false;b.onclick=()=>open(b);});
    $("#nexo-close").onclick=close;
    $("#nexo-dialog").addEventListener("close",()=>{if(opener?.isConnected)opener.focus({preventScroll:true});});
    $("#nexo-clear").onclick=()=>{revision++;controller?.abort();busy=false;aiCount=0;entries=[];lastClarification=null;render();$("#nexo-message").focus();};
    $("#nexo-form").onsubmit=e=>{e.preventDefault();submit($("#nexo-message").value);};
    $("#nexo-message").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();submit(e.currentTarget.value);}});
    $("#nexo-dialog").addEventListener("click",e=>{
      const b=e.target.closest("button");if(!b)return;
      if(b.dataset.nexoPrompt){submit(t(b.dataset.nexoPrompt));return;}
      if(b.dataset.nexoRefine){
        const entry=entries.find(x=>String(x.id)===b.dataset.nexoEntry);
        const choice=entry?.reply.clarification?.options.find(x=>x.id===b.dataset.nexoRefine);
        if(!choice||lastClarification!==entry||busy)return;
        append("user",{text:t(choice.label)});
        search({...entry.request,refinement:[...(entry.request.refinement||[]),{questionId:entry.reply.clarification.id,optionId:choice.id}]});return;
      }
      if(b.dataset.nexoRetry){const entry=entries.find(x=>String(x.id)===b.dataset.nexoRetry);if(entry?.request&&!busy)search(entry.request);return;}
      if(b.dataset.nexoPlan){const plan=entries.find(x=>String(x.id)===b.dataset.nexoPlan)?.reply.plan;if(plan?.ids.every(id=>skill(id))){opener=null;close();bridge.saveSkills(plan.ids);}return;}
      for(const [key,chapter] of [["nexoCard","overview"],["nexoStart","start"],["nexoHelp","help"]]){
        if(b.dataset[key]&&skill(b.dataset[key])){const id=b.dataset[key];opener=null;close();bridge.openSkill(id,chapter);return;}
      }
      if(b.dataset.nexoSave&&skill(b.dataset.nexoSave)){const id=b.dataset.nexoSave;opener=null;close();bridge.saveSkill(id);}
    });
    document.addEventListener("deck:locale-changed",()=>render(true));
    render();
  }
  return {start,open};
})();
