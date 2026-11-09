"use strict";
(() => {
  const items = (window.DeckStore && window.DeckStore.items) || [];
  const list = document.getElementById("list"),
    find = document.getElementById("find"),
    count = document.getElementById("count"),
    notice = document.getElementById("notice"),
    note = document.getElementById("fx");
  const groups = [
    ["deck", "Decks"],
    ["combo", "Combos"],
    ["card", "Cartas avulsas"],
  ];
  const money = (value) =>
    "US$ " +
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: value % 1 ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(value);
  const norm = (text) =>
    String(text)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
  let fxQuote = null;
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function row(item) {
    const box = el("div", "item"),
      what = el("div", "what"),
      name = el("div", "name");
    if (item.code) name.append(el("span", "code", item.code + " "));
    name.append(item.title);
    what.append(name);
    if (item.kind !== "card")
      what.append(
        el("div", "sub", item.cards.length + " cartas: " + item.cards.map((c) => c.code).join(", ")),
      );
    const buy = el("p", "buy"),
      price = el("span", "price", money(item.priceUsd));
    if (item.referenceUsd > item.priceUsd + 0.5)
      price.prepend(el("span", "was", "Avulso " + money(item.referenceUsd)), " ");
    const inReais = window.DeckBuy.reais(item.priceUsd, fxQuote);
    if (inReais) price.append(" ", el("span", "brl", window.DeckBuy.reaisText(inReais)));
    const button = el("button", "cta", "Comprar");
    button.type = "button";
    button.setAttribute("aria-label", "Comprar " + item.title);
    window.DeckBuy.bind(button, notice, [item.key], "/loja");
    buy.append(price, button);
    box.append(what, buy);
    return box;
  }

  function render() {
    const query = norm(find.value.trim());
    list.replaceChildren();
    let shown = 0;
    for (const [kind, label] of groups) {
      const found = items.filter(
        (item) =>
          item.kind === kind &&
          (!query || norm(item.title + " " + (item.code || "") + " " + item.cards.map((c) => c.code).join(" ")).includes(query)),
      );
      if (!found.length) continue;
      list.append(el("h2", "group", label));
      for (const item of found) list.append(row(item));
      shown += found.length;
    }
    if (!items.length) list.append(el("p", "empty", "As vendas abrem em breve."));
    else if (!shown) list.append(el("p", "empty", "Nada encontrado para essa busca."));
    count.textContent = items.length ? shown + " de " + items.length + " produtos" : "";
  }
  find.addEventListener("input", render);
  render();
  // No Brasil, o real aparece ao lado do dólar e é o que será cobrado.
  window.DeckBuy.quote().then((q) => {
    if (!q) return;
    fxQuote = q;
    note.textContent = "Cotação do dia: " + window.DeckBuy.rateText(q) + ". No Brasil você paga em reais.";
    render();
  });
})();
