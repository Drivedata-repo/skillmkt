(function(root,factory){const value=factory();if(typeof module==="object"&&module.exports)module.exports=value;else root.DeckNexoCore=value;})(typeof window==="object"?window:this,()=>{
  "use strict";
  const normalize=value=>String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/^[¿¡]+/,"");
  const guides={
    welcome:["Sou o NEXO. Me conte o que você precisa entregar. Eu ajudo a encontrar uma carta e a entender o primeiro passo."],
    find:["O que precisa sair pronto? Conte a tarefa, a ferramenta que você usa e o que está dificultando o trabalho."],
    choose:["Abra uma carta e converse comigo por ela, ou escreva seu código, como DD-042. Assim posso explicar aquela skill com precisão."],
    compare:["Escreva os códigos das cartas que quer comparar, por exemplo DD-019 e DD-042. Eu mostro a finalidade, a entrega e os requisitos de cada uma."],
    install:["Na carta, abra Primeiro uso e escolha o assistente em que vai usar a skill. Siga a etapa Instalação e preserve a pasta completa do pacote.","Depois, abra um novo chat no seu assistente, confira o reconhecimento e experimente o comando sugerido. Conectores e ferramentas continuam sendo requisitos separados."],
    download:["Abra Primeiro uso → Instalação para baixar o pacote. O Deck confere a versão e a integridade do ZIP antes de iniciar o download.","Se a carta for um guia oficial sem pacote, use a orientação e o link oficial apresentados nela."],
    downloadError:["Se a sessão expirou, entre novamente. Se o aviso disser que a versão mudou, atualize a página e tente baixar a edição atual.","Se continuar, me diga o código da carta e o texto do erro. Posso indicar o guia de ajuda dessa carta; esta conversa não abre um chamado automaticamente."],
    pricingDemo:["Você está na demonstração. Os preços e descontos exibidos nas cartas e combos são propostos; os downloads disponíveis nesta sessão estão liberados para experimentar."],
    pricingCustomer:["Este catálogo considera o acesso da sua sessão. Consulte a indicação de acesso e o preço exibidos na carta. Esta conversa não consulta pagamentos nem confirma novas compras."],
    invocation:["Ao salvar uma carta com invocação pela primeira vez no Meu Deck, ela apresenta o efeito e o som da sua faixa. Remover e recolocar a carta não repete a apresentação.","Para repetir, abra Poder da carta → Invocar carta. O download usa uma confirmação curta. Som e efeitos suaves podem ser ajustados na própria carta."],
    identity:["DD é o código da carta no catálogo. O passaporte reúne seu identificador permanente, a edição e a impressão do ZIP.","Ele identifica o registro do catálogo, não uma cópia exclusiva comprada. Não há token, carteira ou transação em blockchain nessa identidade."],
    about:["Eu sou o guia do catálogo do Deck. Uso as informações das cartas e os guias da interface para orientar suas escolhas. As skills são executadas no seu ambiente, com as ferramentas necessárias."],
    privacy:["O histórico desta conversa fica apenas na memória desta aba e desaparece ao recarregar. Buscas por skills consultam o servidor do Deck. Esta versão não envia a conversa a um modelo externo."],
    access:["Para acesso de comprador, use a página de acesso e o mesmo e-mail da compra. Para a demonstração, use o acesso de demonstração recebido. Eu não consulto contas, senhas ou pagamentos nesta conversa."],
  };
  function resolve(message,context={}){
    const text=normalize(message),skills=context.skills||[],selected=skills.find(s=>s.id===context.selectedId);
    const codes=[...new Set([...String(message).matchAll(/\bDD[-\s]?(\d{3})\b/gi)].map(m=>"DD-"+m[1]))];
    const listed=codes.map(code=>skills.find(s=>s.code===code)).filter(Boolean);
    if(codes.length&&listed.length!==codes.length)return {type:"unavailable",codes:codes.filter(code=>!listed.some(s=>s.code===code))};
    if(listed.length>1)return {type:"compare",ids:listed.slice(0,3).map(s=>s.id)};
    const id=listed[0]?.id||selected?.id;
    const guide=topic=>({type:"guide",topic,id});
    if(/^(oi|ola|bom dia|boa tarde|boa noite|hello|hi|hey|hola|buenos dias|buenas tardes)[!.\s]*$/.test(text))return guide("welcome");
    if(/quem (e|eh) voce|quem e o nexo|who are you|quien eres|voce (e|eh) (uma )?ia|are you (an? )?ai|eres (una )?ia/.test(text))return guide("about");
    if(/privacidade|privacy|privacidad|salva.*conversa|save.*chat|guarda.*conversa/.test(text))return guide("privacy");
    if(/(download|baixar|descargar).*(erro|error|falh|fail|nao funciona|doesn.t work|no funciona)|(nao consigo|cannot|can.t|no puedo).*(baixar|download|descargar)/.test(text))return guide("downloadError");
    if(/^(como|onde|how|where|como puedo|donde).*(baixar (a |uma |esta |essa )?skill|baixar (a |uma |esta |essa )?carta|download (a |the |this )?(skill|card)|descargar (una |la |esta )?(skill|carta))/.test(text)||/^(baixar|download|descargar)(\s+dd[- ]?\d{3})?[?.!]*$/.test(text))return guide("download");
    if(/^(como|onde|how|where|como puedo|donde).*(instal|install)|^instala[cç]ao|^installation|^instalacion/.test(text))return guide("install");
    if(/invoca[cç]ao|invocar|summon|invocacion|animacao.*carta|card.*animation|animacion.*carta/.test(text))return guide("invocation");
    if(/passaporte|passport|pasaporte|\bnft\b|blockchain|id da carta|card id|id de la carta/.test(text))return guide("identity");
    if(/(preco|custa|price|cost|precio|cuesta|comprar|buy).*(carta|card|skill|deck|combo)|^(precos|prices|precios|e gratis|is it free|es gratis)[?!.]*$/.test(text))return guide(context.mode==="customer"?"pricingCustomer":"pricingDemo");
    if(/(esqueci|forgot|olvide).*(senha|password|contrasena)|(nao consigo|can.t|cannot|no puedo).*(entrar|log in|sign in|acceder)/.test(text))return guide("access");
    if(listed.length)return {type:"cards",ids:listed.map(s=>s.id)};
    if(/esta carta|essa carta|esta skill|essa skill|this (card|skill)|esta (carta|skill)|primeiro passo|next step|siguiente paso/.test(text))return id?{type:"cards",ids:[id]}:guide("choose");
    if(/comparar|compare|comparacion|diferenca entre.*cartas|difference between.*cards/.test(text))return guide("compare");
    if(/^(ajuda|help|ayuda|encontrar uma skill|find a skill|encontrar una skill)[?!.]*$/.test(text)||text.length<12)return guide("find");
    return {type:"search"};
  }
  function canonicalizer(dictionary){
    const reverse=new Map();for(const [source,translations] of Object.entries(dictionary||{}))for(const s of translations)if(!reverse.has(s))reverse.set(s,source);
    return text=>Object.prototype.hasOwnProperty.call(dictionary||{},text)?text:reverse.get(text)||text;
  }
  function result(data,skills,canonical=s=>s){
    const ids=new Set(skills.map(s=>s.id));
    const steps=data.plan?.steps;
    const plan=Array.isArray(steps)&&steps.length>=2&&steps.length<=3&&steps.every(s=>ids.has(s.skillId))&&new Set(steps.map(s=>s.skillId)).size===steps.length?{ids:steps.map(s=>s.skillId)}:null;
    return {type:"matches",ids:[...new Set((data.matches||[]).map(m=>m.id).filter(id=>ids.has(id)))].slice(0,3),summary:canonical(data.summary||""),
      plan,
      clarification:data.clarification?{id:data.clarification.id,question:canonical(data.clarification.question),options:(data.clarification.options||[]).slice(0,8).map(o=>({id:o.id,label:canonical(o.label)}))}:null};
  }
  return {resolve,result,canonicalizer,guides,normalize};
});
