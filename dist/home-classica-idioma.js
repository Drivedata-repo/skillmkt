"use strict";
// Esta página é a home em inglês e espanhol. Em português a home é a página inicial.
// Roda depois do i18n.js, que já resolveu e guardou o idioma.
(() => {
  if (typeof DeckI18n !== "undefined" && DeckI18n.locale === "pt")
    location.replace("/?lang=pt" + location.hash);
})();
