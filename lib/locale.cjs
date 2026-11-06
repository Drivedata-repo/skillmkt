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
