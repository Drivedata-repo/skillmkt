"use strict";
(() => {
  const config = window.DeckOffer;
  const $ = (id) => document.getElementById(id);
  const video = $("video"),
    cover = $("cover"),
    toggle = $("toggle"),
    player = $("player"),
    status = $("status");
  const STORE = "deck-oferta-v1";
  const PAUSE = "M6 4h4v16H6zM14 4h4v16h-4z",
    PLAY = "M7 4.5v15l13-7.5z";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORE)) || {};
    } catch {
      return {};
    }
  }
  function save(state) {
    try {
      localStorage.setItem(STORE, JSON.stringify(state));
    } catch {}
  }
  const state = load();

  function checkoutLink() {
    if (!config.checkoutUrl) return null;
    let url;
    try {
      url = new URL(config.checkoutUrl);
    } catch {
      return null;
    }
    if (url.protocol !== "https:" || url.hostname !== "pay.hotmart.com") return null;
    const from = new URLSearchParams(location.search);
    for (const key of ["src", "sck", "xcod", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"])
      if (from.get(key)) url.searchParams.set(key, from.get(key));
    return url.href;
  }

  function buildOffer() {
    $("offer-title").textContent = config.deckTitle + ": o que vem nele";
    for (const card of config.cards) {
      const li = document.createElement("li"),
        code = document.createElement("span");
      code.textContent = card.code;
      li.append(code, card.title);
      $("cards").append(li);
    }
    $("price").textContent = config.priceLabel;
    const parts = ["Pagamento processado pela Hotmart."];
    if (config.guaranteeDays) parts.push(`Garantia de ${config.guaranteeDays} dias.`);
    $("note").textContent = parts.join(" ");
    const link = checkoutLink(),
      cta = $("cta");
    if (link) cta.href = link;
    else {
      cta.setAttribute("aria-disabled", "true");
      cta.textContent = "Checkout ainda não configurado";
    }
    for (const item of config.faq) {
      const dt = document.createElement("dt"),
        dd = document.createElement("dd");
      dt.textContent = item.q;
      dd.textContent = item.a;
      $("faq").append(dt, dd);
    }
  }

  function buildProofs() {
    if (!config.proofs.length) return;
    for (const proof of config.proofs) {
      const quote = document.createElement("blockquote"),
        author = document.createElement("cite");
      quote.textContent = proof.text;
      author.textContent = proof.author;
      quote.append(author);
      $("proofs").append(quote);
    }
    $("proofs").hidden = false;
  }

  let revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    $("offer").hidden = false;
    state.revealed = true;
    save(state);
  }

  function showIcon() {
    const playing = !video.paused;
    $("toggle-icon").setAttribute("d", playing ? PAUSE : PLAY);
    toggle.setAttribute("aria-label", playing ? "Pausar o vídeo" : "Reproduzir o vídeo");
    player.classList.toggle("paused", !playing);
  }

  function start() {
    if (!config.videoSrc) {
      status.textContent = "O vídeo entra aqui assim que for publicado.";
      return;
    }
    if (!video.src) video.src = config.videoSrc;
    cover.hidden = true;
    cover.style.display = "none";
    toggle.hidden = false;
    video.play().catch(() => {
      status.textContent = "Não foi possível iniciar o vídeo. Toque para tentar de novo.";
      cover.hidden = false;
      cover.style.display = "";
      toggle.hidden = true;
    });
  }

  function flip() {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  // Voltar para a página retoma do ponto em que parou; não há como avançar.
  video.addEventListener("loadedmetadata", () => {
    if (state.position > 1 && state.position < video.duration - 2)
      video.currentTime = state.position;
  });
  let lastSaved = 0;
  video.addEventListener("timeupdate", () => {
    const t = video.currentTime;
    if (t >= config.revealAt) reveal();
    if (Math.abs(t - lastSaved) >= 5) {
      lastSaved = t;
      state.position = t;
      save(state);
    }
  });
  video.addEventListener("play", showIcon);
  video.addEventListener("pause", showIcon);
  video.addEventListener("click", flip);
  toggle.addEventListener("click", flip);
  cover.addEventListener("click", start);

  if (config.poster) {
    cover.classList.add("has-poster");
    cover.style.backgroundImage = `url("${encodeURI(config.poster)}")`;
  }
  buildOffer();
  buildProofs();
  const local = ["127.0.0.1", "localhost"].includes(location.hostname);
  if (state.revealed || (local && new URLSearchParams(location.search).has("previa"))) reveal();
})();
