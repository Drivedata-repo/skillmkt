"use strict";
// A home nova existe só em português. Quem escolheu inglês ou espanhol (pelo
// endereço, pela escolha guardada ou pelo cookie, na mesma ordem do i18n-core.js)
// vai para a home traduzida, que continua em /home-classica.html.
(() => {
  const valid = ["pt", "en", "es"];
  let query = null,
    stored = null,
    cookie = null;
  try {
    query = new URL(location.href).searchParams.get("lang");
  } catch {}
  try {
    stored = localStorage.getItem("drivedata-language");
  } catch {}
  try {
    cookie =
      (document.cookie.match(/(?:^|;\s*)deck_locale=([^;]+)/) || [])[1] || null;
  } catch {}
  let locale = "pt";
  if (query != null) locale = valid.includes(query) ? query : "pt";
  else
    for (const value of [stored, cookie]) {
      if (value == null || value === "") continue;
      locale = valid.includes(value) ? value : "pt";
      break;
    }
  if (locale !== "pt") {
    location.replace("/home-classica.html?lang=" + locale + location.hash);
    return;
  }
  // Pedido explícito de português: guarda a escolha, como o seletor de idioma faz.
  if (query === "pt") {
    try {
      localStorage.setItem("drivedata-language", "pt");
    } catch {}
    document.cookie =
      "deck_locale=pt; Path=/; Max-Age=31536000; SameSite=Lax" +
      (location.protocol === "https:" ? "; Secure" : "");
  }
})();
