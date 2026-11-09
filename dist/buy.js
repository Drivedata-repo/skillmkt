"use strict";
// Abre o pagamento: o navegador só informa o que quer comprar. Quem decide o valor é o servidor.
window.DeckBuy = (() => {
  // Cotação para quem está no Brasil. Fora do Brasil, ou sem cotação, só o dólar.
  let pending;
  function info() {
    pending ||= fetch("/api/account/rate", { signal: AbortSignal.timeout(8000) })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
    return pending;
  }
  const quote = () => info().then((q) => (q && q.currency === "brl" && q.rate > 0 ? q : null));
  // Mesma conta do servidor (lib/fx.cjs): reais inteiros, sempre para cima.
  const reais = (priceUsd, q) =>
    q && q.rate > 0 ? Math.ceil((Math.round(priceUsd * 100) * q.rate) / 100) : null;
  const reaisText = (n) => "R$ " + new Intl.NumberFormat("pt-BR").format(n);
  const rateText = (q) =>
    "US$ 1 = R$ " + new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(q.rate);

  async function start(keys, back) {
    const response = await fetch("/api/account/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: keys, back }),
      signal: AbortSignal.timeout(20000),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || typeof result.url !== "string")
      throw new Error(result.error || "Não foi possível abrir o pagamento. Tente novamente.");
    const url = new URL(result.url);
    if (url.protocol !== "https:" || !url.hostname.endsWith("stripe.com"))
      throw new Error("Endereço de pagamento inesperado.");
    location.assign(url.href);
  }

  // Liga um botão ao pagamento, com o estado de espera e a mensagem de erro.
  function bind(button, statusNode, keys, back) {
    const label = button.textContent;
    // Pagamento ainda não configurado no servidor: nada de botão que só dá erro.
    info().then((i) => {
      if (i && i.payments === false) {
        button.disabled = true;
        button.textContent = "Em breve";
      }
    });
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      if (button.disabled) return;
      button.disabled = true;
      button.textContent = "Abrindo o pagamento...";
      if (statusNode) statusNode.textContent = "";
      try {
        await start(typeof keys === "function" ? keys() : keys, back);
      } catch (error) {
        button.disabled = false;
        button.textContent = label;
        const message =
          error.name === "TimeoutError" || error.name === "TypeError"
            ? "Não foi possível conectar. Confira sua conexão e tente de novo."
            : error.message;
        if (statusNode) statusNode.textContent = message;
      }
    });
  }
  return { start, bind, quote, reais, reaisText, rateText };
})();
