"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
  const message = $("message");
  const forms = ["register", "login", "request", "create"];

  function show(id) {
    for (const form of forms) $(form).hidden = form !== id;
    say("");
  }
  function say(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error", isError);
  }

  async function post(route, payload) {
    const response = await fetch("/api/account/" + route, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Não foi possível concluir.");
    return result;
  }

  function enterDeck() {
    try {
      localStorage.setItem("deck-account", "customer");
    } catch {}
    const next = new URL(location.href).searchParams.get("next") || "/app";
    location.assign(window.DeckNavigation ? DeckNavigation.appPath(next) : "/app");
  }

  async function submit(form, work) {
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    say("Aguarde...");
    try {
      await work();
    } catch (error) {
      say(
        error.name === "TimeoutError" || error.name === "TypeError"
          ? "Não foi possível conectar. Confira sua conexão e tente novamente."
          : error.message,
        true,
      );
    } finally {
      button.disabled = false;
    }
  }

  let token = null;
  function readToken() {
    const found = new URLSearchParams(location.hash.slice(1)).get("t");
    if (!found) return;
    token = found;
    // Tira o token da barra de endereço e do histórico.
    history.replaceState(null, "", location.pathname);
    show("create");
  }

  // Quem já criou conta neste aparelho vê a entrada; quem chega pela primeira vez vê o cadastro.
  function firstView() {
    const params = new URLSearchParams(location.search);
    if (params.has("entrar")) return "login";
    if (params.has("cadastro")) return "register";
    try {
      return localStorage.getItem("deck-account") === "customer" ? "login" : "register";
    } catch {
      return "register";
    }
  }
  show(firstView());
  readToken();
  // O link pode ser aberto com esta página já na mesma aba.
  addEventListener("hashchange", readToken);

  $("go-register").onclick = () => show("register");
  $("go-login-from-register").onclick = () => show("login");
  $("go-request").onclick = () => show("request");
  $("go-login").onclick = () => show("login");

  $("register").onsubmit = (event) => {
    event.preventDefault();
    submit($("register"), async () => {
      const result = await post("register", {
        name: $("reg-name").value,
        email: $("reg-email").value,
        password: $("reg-password").value,
      });
      // Conta antiga sem senha: o dono recebe um link no e-mail em vez de entrar direto.
      if (result.emailed) return say(result.message);
      enterDeck();
    });
  };
  $("login").onsubmit = (event) => {
    event.preventDefault();
    submit($("login"), async () => {
      await post("login", { email: $("email").value, password: $("password").value });
      enterDeck();
    });
  };
  $("request").onsubmit = (event) => {
    event.preventDefault();
    submit($("request"), async () => {
      const result = await post("request-access", { email: $("request-email").value });
      say(result.message);
    });
  };
  $("create").onsubmit = (event) => {
    event.preventDefault();
    submit($("create"), async () => {
      await post("set-password", { token, password: $("new-password").value });
      enterDeck();
    });
  };
})();
