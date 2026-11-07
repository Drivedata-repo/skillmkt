"use strict";
// Fictional collection attributes. Deliberately independent of pricing and QA.
const schools = {
  "Dados & inteligência": ["Oráculo", "Oracle", "Oráculo", "Decifra o que está escondido entre os números.", "Deciphers what lies hidden between the numbers.", "Descifra lo que se esconde entre los números."],
  "Automação & IA": ["Invocador", "Summoner", "Invocador", "Conecta pequenas ações em uma grande sequência.", "Connects small actions into one great sequence.", "Conecta pequeñas acciones en una gran secuencia."],
  "Sistemas & integrações": ["Arquiteto", "Architect", "Arquitecto", "Abre passagens entre mundos que não se falavam.", "Opens passages between worlds that never spoke.", "Abre caminos entre mundos que no se hablaban."],
  "Design & experiência": ["Ilusionista", "Illusionist", "Ilusionista", "Dá forma ao que antes só existia na imaginação.", "Gives shape to what once existed only in imagination.", "Da forma a lo que antes solo existía en la imaginación."],
  "Vendas & conteúdo": ["Embaixador", "Envoy", "Embajador", "Transforma uma ideia em uma mensagem que encontra seu destino.", "Turns an idea into a message that finds its destination.", "Convierte una idea en un mensaje que encuentra su destino."],
  "Documentos & operação": ["Escriba", "Scribe", "Escriba", "Preserva os detalhes que sustentam toda a missão.", "Preserves the details that hold the mission together.", "Preserva los detalles que sostienen toda la misión."],
  "Qualidade & engenharia": ["Sentinela", "Sentinel", "Centinela", "Enxerga a fissura antes de a muralha ceder.", "Spots the crack before the wall gives way.", "Detecta la grieta antes de que el muro ceda."],
  "Pesquisa & estratégia": ["Explorador", "Explorer", "Explorador", "Segue pistas, cruza fronteiras e volta com novas perguntas.", "Follows clues, crosses borders and returns with new questions.", "Sigue pistas, cruza fronteras y vuelve con nuevas preguntas."],
  "Inovação & experimentação": ["Alquimista", "Alchemist", "Alquimista", "Faz do laboratório o início de uma nova possibilidade.", "Makes the laboratory the start of a new possibility.", "Hace del laboratorio el inicio de una nueva posibilidad."],
  "Apoio interno": ["Guardião", "Guardian", "Guardián", "Sustenta o Deck quando a missão exige precisão.", "Holds the Deck together when the mission calls for precision.", "Sostiene el Deck cuando la misión exige precisión."],
};
function getCardGame(skill, locale="pt") {
  const index=locale==="en"?1:locale==="es"?2:0;
  const code=Number(skill.code.slice(3)), level=2+((code*7+3)%8);
  const school=schools[skill.categoryKey || skill.category] || schools["Apoio interno"];
  const defensive=skill.role==="support" || skill.category==="Qualidade & engenharia";
  return {edition:"arcana-1",fictional:true,level,attack:700+level*220+((code*13)%11)*50+(defensive?0:250),defense:900+(10-level)*160+((code*17)%13)*50+(defensive?400:0),school:school[index],flavor:school[index+3],notice:["Níveis, ATQ e DEF são atributos fictícios de coleção. Não medem qualidade, preço ou resultado da skill.","Levels, ATK and DEF are fictional collection attributes. They do not measure skill quality, price or results.","Los niveles, ATQ y DEF son atributos ficticios de colección. No miden la calidad, el precio ni los resultados de la skill."][index]};
}
module.exports={getCardGame};
