"use strict";
(() => {
  const core = window.DeckLocaleCore;
  const dictionary = window.DeckTranslations || {};
  let stored;
  try {
    stored = localStorage.getItem("drivedata-language");
  } catch {}
  const cookie = document.cookie
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith("deck_locale="))
    ?.slice(12);
  const locale = core.resolveLocale(
    new URL(location.href).searchParams.get("lang"),
    stored,
    cookie,
  );
  const intlLocale = { pt: "pt-BR", en: "en-US", es: "es-ES" }[locale];
  const t = (source, params) =>
    core.translate(dictionary, locale, source, params);
  const url = (path) => core.localizedURL(path, locale, location.origin);
  const headers = (existing = {}) => {
    const out = new Headers(existing);
    out.set("x-deck-language", locale);
    return out;
  };
  function remember(next) {
    try {
      localStorage.setItem("drivedata-language", next);
    } catch {}
    document.cookie = `deck_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  }
  remember(locale);
  document.documentElement.lang = intlLocale;
  document.documentElement.dataset.locale = locale;
  const skip =
    "script,style,code,pre,textarea,[data-no-i18n],.language-switcher";
  const attrs = [
    "aria-label",
    "aria-description",
    "title",
    "placeholder",
    "alt",
    "data-example",
  ];
  function translateText(node) {
    if (!node.parentElement || node.parentElement.closest(skip)) return;
    const text = node.nodeValue;
    const key = core.normalize(text);
    if (!key || !dictionary[key] || locale === "pt") return;
    const translated = t(key);
    if (key === translated) return;
    node.nodeValue =
      (text.match(/^\s*/)?.[0] || "") +
      translated +
      (text.match(/\s*$/)?.[0] || "");
  }
  const routes = new Set([
    "/",
    "/app",
    "/login",
    "/privacidade",
    "/index.html",
    "/login.html",
    "/privacy.html",
  ]);
  function translateElement(element) {
    if (element.closest("script,style,[data-no-i18n],.language-switcher"))
      return;
    for (const attr of attrs) {
      const value = element.getAttribute(attr);
      if (value && dictionary[core.normalize(value)])
        element.setAttribute(attr, t(value));
    }
    if (
      element.matches(
        'meta[name="description"],meta[property="og:title"],meta[property="og:description"]',
      )
    ) {
      const value = element.getAttribute("content");
      if (value) element.setAttribute("content", t(value));
    }
    if (element.matches("a[href]")) {
      const href = element.getAttribute("href");
      if (href.startsWith("/") && !href.startsWith("//")) {
        const parsed = new URL(href, location.origin);
        if (routes.has(parsed.pathname))
          element.setAttribute("href", url(href));
      }
    }
  }
  function translateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) return translateText(root);
    if (
      root.nodeType !== Node.ELEMENT_NODE &&
      root.nodeType !== Node.DOCUMENT_NODE
    )
      return;
    if (root.nodeType === Node.ELEMENT_NODE) translateElement(root);
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    );
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) translateText(node);
      else translateElement(node);
    }
  }
  const observer = new MutationObserver((records) => {
    observer.disconnect();
    const nodes = new Set();
    for (const record of records) {
      if (record.type === "childList")
        for (const node of record.addedNodes) nodes.add(node);
      else nodes.add(record.target);
    }
    for (const node of nodes) translateTree(node);
    observe();
  });
  function observe() {
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...attrs, "content"],
    });
  }
  function apply(root = document) {
    observer.disconnect();
    translateTree(root);
    observe();
  }
  window.DeckI18n = Object.freeze({
    locale,
    intlLocale,
    t,
    url,
    headers,
    apply,
    number: (value, options = {}) =>
      new Intl.NumberFormat(intlLocale, options).format(value),
  });
  apply();
  document.addEventListener("DOMContentLoaded", () => {
    const target =
      document.querySelector(
        ".landing-header nav,.site-header nav,.login-header,[data-language-slot]",
      ) ||
      document.querySelector("header") ||
      document.querySelector("main");
    const switcher = document.createElement("div");
    switcher.className = "language-switcher";
    switcher.setAttribute("role", "group");
    switcher.setAttribute("aria-label", t("Idioma do site"));
    for (const [id, name, abbreviation] of [
      ["pt", "Português", "PT"],
      ["en", "English", "EN"],
      ["es", "Español", "ES"],
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "language-option";
      button.lang = { pt: "pt-BR", en: "en", es: "es" }[id];
      button.setAttribute("aria-label", name);
      button.setAttribute("aria-pressed", String(id === locale));
      button.title = name;
      button.dataset.locale = id;
      const flag = document.createElement("img");
      flag.src = `/assets/flag-${id}.svg`;
      flag.alt = "";
      flag.width = 28;
      flag.height = 20;
      const label = document.createElement("span");
      label.textContent = abbreviation;
      button.append(flag, label);
      button.addEventListener("click", () => {
        if (id === locale) return;
        remember(id);
        document.dispatchEvent(
          new CustomEvent("deck:before-locale", { detail: id }),
        );
        location.assign(core.localizedURL(location.href, id, location.origin));
      });
      switcher.append(button);
    }
    if (target?.tagName === "MAIN") target.prepend(switcher);
    else if (target) target.append(switcher);
    apply();
  });
  document.addEventListener(
    "invalid",
    (event) => {
      const field = event.target;
      if (!field.validity || field.validity.customError) return;
      let message = "";
      if (field.validity.valueMissing)
        message =
          field.type === "checkbox"
            ? t("Confirme esta opção para continuar.")
            : t("Preencha este campo.");
      else if (field.validity.typeMismatch && field.type === "email")
        message = t("Informe um endereço de e-mail válido.");
      else if (field.validity.tooShort)
        message = t("Use pelo menos {count} caracteres.", {
          count: field.minLength,
        });
      else if (field.validity.tooLong)
        message = t("Use no máximo {count} caracteres.", {
          count: field.maxLength,
        });
      if (message) field.setCustomValidity(message);
    },
    true,
  );
  for (const type of ["input", "change"])
    document.addEventListener(type, (event) =>
      event.target.setCustomValidity?.(""),
    );
})();
