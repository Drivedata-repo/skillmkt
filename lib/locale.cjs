"use strict";

const LOCALES = Object.freeze(["pt", "en", "es"]);
function normalizeLocale(value) {
  return typeof value === "string" && LOCALES.includes(value) ? value : "pt";
}
function getLocale(req = {}) {
  const headers = req.headers || {};
  try {
    const query = new URL(req.url || "/", "https://local.invalid").searchParams;
    if (query.has("lang")) return normalizeLocale(query.get("lang"));
  } catch {
    return "pt";
  }
  if (headers["x-deck-language"] !== undefined)
    return normalizeLocale(headers["x-deck-language"]);
  const cookie = String(headers.cookie || "")
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith("deck_locale="));
  if (cookie) {
    try {
      return normalizeLocale(decodeURIComponent(cookie.slice(12)));
    } catch {
      return "pt";
    }
  }
  return "pt";
}

const messages = {
  "Esta coleção não inclui uma skill de agendamento no Google Calendar ou Outlook. Preparar uma reunião é uma tarefa diferente de criar o evento.":
    [
      "This collection does not include a scheduling skill for Google Calendar or Outlook. Preparing for a meeting is different from creating the event.",
      "Esta colección no incluye una skill de programación de eventos en Google Calendar u Outlook. Preparar una reunión es distinto de crear el evento.",
    ],
  "Escolha filtros válidos para refinar sua necessidade.": [
    "Choose valid filters to refine your need.",
    "Elige filtros válidos para precisar tu necesidad.",
  ],
  "Não há uma indicação clara com estas restrições. Ajuste os filtros ou detalhe a entrega; nenhuma skill foi indicada à força.":
    [
      "There is no clear recommendation within these constraints. Adjust the filters or describe the deliverable; no skill was forced into the results.",
      "No hay una recomendación clara con estas restricciones. Ajusta los filtros o detalla la entrega; no se ha forzado ninguna skill en los resultados.",
    ],
  "Qual é a tarefa com o documento jurídico?": [
    "What do you need to do with the legal document?",
    "¿Qué necesitas hacer con el documento jurídico?",
  ],
  "Triar um acordo de confidencialidade": [
    "Triage a non-disclosure agreement",
    "Evaluar inicialmente un acuerdo de confidencialidad",
  ],
  "Revisar cláusulas de um contrato": [
    "Review contract clauses",
    "Revisar cláusulas de un contrato",
  ],
  "Classificar riscos e encaminhamentos": [
    "Classify risks and escalation needs",
    "Clasificar riesgos y derivaciones",
  ],
  "O que precisa se conectar?": [
    "What needs to connect?",
    "¿Qué necesitas conectar?",
  ],
  "ERP e dados financeiros": [
    "ERP and financial data",
    "ERP y datos financieros",
  ],
  "Cobranças e pagamentos": ["Billing and payments", "Cobros y pagos"],
  "Aplicação e banco de dados": [
    "Application and database",
    "Aplicación y base de datos",
  ],
  "Qual parte do trabalho comercial precisa avançar?": [
    "Which part of your sales work needs to move forward?",
    "¿Qué parte del trabajo comercial necesita avanzar?",
  ],
  "Explicar a oferta em conteúdo": [
    "Explain the offering through content",
    "Explicar la oferta mediante contenido",
  ],
  "Preparar prospecção no LinkedIn": [
    "Prepare LinkedIn prospecting",
    "Preparar prospección en LinkedIn",
  ],
  "Organizar a oferta em um site": [
    "Present the offering on a website",
    "Organizar la oferta en un sitio web",
  ],
  "Qual entrega de design você precisa?": [
    "Which design deliverable do you need?",
    "¿Qué entrega de diseño necesitas?",
  ],
  "Criar telas e um protótipo": [
    "Create screens and a prototype",
    "Crear pantallas y un prototipo",
  ],
  "Organizar uma biblioteca de componentes": [
    "Organize a component library",
    "Organizar una biblioteca de componentes",
  ],
  "Transformar design em código": [
    "Turn design into code",
    "Convertir diseño en código",
  ],
  "Qual arquivo deve sair pronto?": [
    "Which file needs to be ready?",
    "¿Qué archivo necesitas tener listo?",
  ],
  "Um documento Word editável": [
    "An editable Word document",
    "Un documento Word editable",
  ],
  "Um PDF ou dados extraídos dele": [
    "A PDF or data extracted from it",
    "Un PDF o datos extraídos de él",
  ],
  "Uma apresentação em slides": [
    "A slide presentation",
    "Una presentación de diapositivas",
  ],
  "Método não permitido.": ["Method not allowed.", "Método no permitido."],
  "Origem não permitida.": ["Origin not allowed.", "Origen no permitido."],
  "Envie JSON.": ["Send JSON data.", "Envía datos JSON."],
  "Dados muito longos.": [
    "The submitted data is too long.",
    "Los datos enviados son demasiado largos.",
  ],
  "JSON inválido.": ["Invalid JSON.", "JSON no válido."],
  "Confira os campos obrigatórios e seus limites.": [
    "Check the required fields and their limits.",
    "Revisa los campos obligatorios y sus límites.",
  ],
  "Serviço temporariamente indisponível. Tente novamente em instantes.": [
    "Service temporarily unavailable. Please try again shortly.",
    "Servicio temporalmente no disponible. Inténtalo de nuevo en unos instantes.",
  ],
  "Entre ou crie a sua conta.": [
    "Sign in or create your account.",
    "Inicia sesión o crea tu cuenta.",
  ],
  "Entre ou crie a sua conta para comprar.": [
    "Sign in or create your account to buy.",
    "Inicia sesión o crea tu cuenta para comprar.",
  ],
  "Informe um e-mail válido.": [
    "Enter a valid email address.",
    "Introduce un correo válido.",
  ],
  "Use uma senha com 10 a 256 caracteres.": [
    "Use a password with 10 to 256 characters.",
    "Usa una contraseña de 10 a 256 caracteres.",
  ],
  "Este e-mail já tem conta. Entre ou peça a troca da senha.": [
    "This email already has an account. Sign in or ask for a password reset.",
    "Este correo ya tiene cuenta. Inicia sesión o pide cambiar la contraseña.",
  ],
  "Enviamos um link para o seu e-mail criar a senha.": [
    "We sent a link to your email to create the password.",
    "Enviamos un enlace a tu correo para crear la contraseña.",
  ],
  "Se houver uma conta com este e-mail, enviamos um link para criar ou trocar a senha.": [
    "If an account exists for this email, we sent a link to create or change the password.",
    "Si existe una cuenta con este correo, enviamos un enlace para crear o cambiar la contraseña.",
  ],
  "E-mail ou senha incorretos.": [
    "Incorrect email or password.",
    "Correo o contraseña incorrectos.",
  ],
  "Esta carta não faz parte das suas compras.": [
    "This card is not part of your purchases.",
    "Esta carta no forma parte de tus compras.",
  ],
  "Entre com a senha da demonstração.": [
    "Sign in with the demo password.",
    "Accede con la contraseña de la demo.",
  ],
  "O acesso à demonstração ainda não foi configurado.": [
    "Demo access has not been configured yet.",
    "El acceso a la demo aún no está configurado.",
  ],
  "Informe a senha da demonstração.": [
    "Enter the demo password.",
    "Introduce la contraseña de la demo.",
  ],
  "Senha incorreta. Confira a senha compartilhada com você.": [
    "Incorrect password. Check the password shared with you.",
    "Contraseña incorrecta. Revisa la contraseña que te compartieron.",
  ],
  "Limite de tentativas atingido. Tente novamente em uma hora.": [
    "Attempt limit reached. Try again in one hour.",
    "Has alcanzado el límite de intentos. Vuelve a intentarlo dentro de una hora.",
  ],
  "Recebemos sua solicitação.": [
    "We received your request.",
    "Hemos recibido tu solicitud.",
  ],
  "Você está na lista. Seu interesse foi registrado; não há cobrança nem reserva de compra.":
    [
      "You're on the list. Your interest has been recorded; there is no charge or purchase reservation.",
      "Ya estás en la lista. Hemos registrado tu interés; no hay ningún cobro ni reserva de compra.",
    ],
  "Esta carta é entregue pela fonte oficial. Use o link indicado na carta.": ["This card is delivered by its official source. Use the link on the card.", "Esta carta se entrega desde su fuente oficial. Usa el enlace indicado en la carta."],
  "Skill não encontrada.": ["Skill not found.", "Skill no encontrada."],
  "Este pacote ainda não está disponível. Tente novamente mais tarde.": [
    "This package is not available yet. Please try again later.",
    "Este paquete aún no está disponible. Inténtalo de nuevo más tarde.",
  ],
  "O envio de briefings foi encerrado. Escolha e baixe uma skill na coleção.": [
    "Brief submissions are no longer available. Choose and download a skill from the collection.",
    "El envío de briefs ya no está disponible. Elige y descarga una skill de la colección.",
  ],
  "Descreva seu problema com 12 a 2.000 caracteres.": [
    "Describe your problem using 12 to 2,000 characters.",
    "Describe tu problema con entre 12 y 2.000 caracteres.",
  ],
  "Escolha uma das opções sugeridas para este problema.": [
    "Choose one of the suggested options for this problem.",
    "Elige una de las opciones sugeridas para este problema.",
  ],
  "A IA não respondeu. As indicações usam as capacidades do catálogo.": [
    "The AI did not respond. These recommendations use the catalog's capabilities.",
    "La IA no respondió. Estas recomendaciones se basan en las capacidades del catálogo.",
  ],
  "Qual parte das planilhas você quer resolver primeiro?": [
    "Which spreadsheet task would you like to tackle first?",
    "¿Qué tarea de las hojas de cálculo quieres resolver primero?",
  ],
  "Juntar e limpar dados": [
    "Combine and clean data",
    "Combinar y limpiar datos",
  ],
  "Conferir fórmulas e cálculos": [
    "Check formulas and calculations",
    "Revisar fórmulas y cálculos",
  ],
  "Automatizar arquivos repetitivos": [
    "Automate repetitive file tasks",
    "Automatizar tareas repetitivas con archivos",
  ],
  "O que precisa melhorar no seu Power BI?": [
    "What needs improving in your Power BI?",
    "¿Qué necesitas mejorar en tu Power BI?",
  ],
  "Lentidão e atualização": [
    "Performance and refresh",
    "Rendimiento y actualización",
  ],
  "Números que não conferem": [
    "Numbers that don't match",
    "Cifras que no coinciden",
  ],
  "Layout e navegação": ["Layout and navigation", "Diseño y navegación"],
  "Em que etapa está sua ideia?": [
    "What stage is your idea at?",
    "¿En qué etapa está tu idea?",
  ],
  "Validar a ideia e as telas": [
    "Validate the idea and screens",
    "Validar la idea y las pantallas",
  ],
  "Desenvolver a aplicação": [
    "Develop the application",
    "Desarrollar la aplicación",
  ],
  "Apresentar minha oferta em um site": [
    "Present my offering on a website",
    "Presentar mi oferta en un sitio web",
  ],
  "Primeira opção": ["First choice", "Primera opción"],
  "Alternativa complementar": [
    "Complementary option",
    "Alternativa complementaria",
  ],
  "Uma escolha rápida ajuda a indicar a carta certa.": [
    "One quick choice helps us recommend the right card.",
    "Una elección rápida nos ayuda a recomendar la carta adecuada.",
  ],
  "Estas skills têm capacidades relacionadas à sua tarefa. Confira os requisitos antes de começar.":
    [
      "These skills have capabilities related to your task. Check the requirements before you start.",
      "Estas skills tienen capacidades relacionadas con tu tarea. Revisa los requisitos antes de empezar.",
    ],
  "Não encontrei uma relação clara. Informe a tarefa e a ferramenta que você usa; você também pode explorar a coleção.":
    [
      "I couldn't find a clear match. Describe the task and the tool you use, or explore the collection.",
      "No encontré una relación clara. Indica la tarea y la herramienta que utilizas; también puedes explorar la colección.",
    ],
};
Object.assign(messages,{
 "Qual etapa do relatório precisa de ajuda?":["Which part of the report needs help?","¿Qué etapa del informe necesita ayuda?"],
 "Coletar e organizar os dados":["Collect and organize data","Recopilar y organizar datos"],
 "Calcular e conferir os números":["Calculate and check the numbers","Calcular y comprobar los números"],
 "Apresentar os resultados":["Present the results","Presentar los resultados"],
 "De onde vêm os dados do relatório?":["Where does the report data come from?","¿De dónde vienen los datos del informe?"],
 "Tabelas em arquivos PDF":["Tables in PDF files","Tablas en archivos PDF"],
 "Planilhas para juntar e limpar":["Spreadsheets to combine and clean","Hojas de cálculo para combinar y limpiar"],
 "ERP ou API financeira":["ERP or financial API","ERP o API financiera"],
 "Onde os cálculos serão conferidos?":["Where will the calculations be checked?","¿Dónde se comprobarán los cálculos?"],
 "Fórmulas de uma planilha":["Spreadsheet formulas","Fórmulas de una hoja de cálculo"],
 "Medidas de um modelo Power BI":["Measures in a Power BI model","Medidas de un modelo Power BI"],
 "Qual formato deve apresentar os resultados?":["Which format should present the results?","¿Qué formato debe presentar los resultados?"],
 "Relatório Word editável":["Editable Word report","Informe Word editable"],
 "Slides para uma apresentação":["Slides for a presentation","Diapositivas para una presentación"],
 "Páginas de um relatório Power BI":["Power BI report pages","Páginas de un informe Power BI"],
});
Object.assign(messages, require('../data/i18n-evolution.cjs'));
Object.assign(messages, require('../data/i18n-nexo-chat.cjs'));
function translateError(message, locale = "pt") {
  const index = { en: 0, es: 1 }[normalizeLocale(locale)];
  return index === undefined ? message : messages[message]?.[index] || message;
}
module.exports = {
  LOCALES,
  normalizeLocale,
  getLocale,
  translateError,
  messages,
};
