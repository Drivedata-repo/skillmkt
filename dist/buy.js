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
    // Comprar exige conta: quem ainda não tem vai criar a dele e volta para comprar.
    if (response.status === 401) {
      location.assign("/acesso?cadastro=1");
      return new Promise(() => {});
    }
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
  // Volta do pagamento para dentro do app: o acesso chega por webhook, então espera e recarrega.
  function afterReturn() {
    const params = new URLSearchParams(location.search);
    if (params.get("compra") !== "ok") return;
    // Tira só o aviso da URL; a carta aberta e o modo continuam onde estavam.
    params.delete("compra");
    history.replaceState(null, "", location.pathname + (params.size ? "?" + params : "") + location.hash);
    const bar = document.createElement("p");
    bar.className = "buy-return";
    bar.setAttribute("role", "status");
    bar.textContent = "Pagamento recebido. Estamos liberando a sua compra. No Pix, a liberação acontece quando o banco confirmar.";
    document.body.prepend(bar);
    const count = () =>
      fetch("/api/account/me")
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => (j ? j.cards : null))
        .catch(() => null);
    count().then(async (before) => {
      for (let i = 0; i < 15; i += 1) {
        await new Promise((done) => setTimeout(done, 4000));
        const now = await count();
        if (now !== null && before !== null && now > before) return location.reload();
      }
      bar.textContent = "Ainda confirmando o pagamento. Atualize esta página em alguns instantes.";
    });
  }
  document.addEventListener("DOMContentLoaded", afterReturn);

  return { start, bind, quote, reais, reaisText, rateText };
})();
