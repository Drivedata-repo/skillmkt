(function (root, factory) {
  const core = factory();
  if (typeof module === "object" && module.exports) module.exports = core;
  else root.DeckLocaleCore = core;
})(typeof window === "object" ? window : this, () => {
  const locales = ["pt", "en", "es"];
  const normalize = (value) =>
    String(value ?? "")
      .trim()
      .replace(/\s+/g, " ");
  function resolveLocale(query, stored, cookie) {
    if (query != null) return locales.includes(query) ? query : "pt";
    for (const value of [stored, cookie]) {
      if (value == null || value === "") continue;
      return locales.includes(value) ? value : "pt";
    }
    return "pt";
  }
  function translate(dictionary, locale, source, params = {}) {
    const key = normalize(source);
    const translated =
      locale === "pt"
        ? source
        : (dictionary[key]?.[locale === "en" ? 0 : 1] ?? source);
    return String(translated).replace(
      /\{([a-zA-Z][a-zA-Z0-9_]*)\}/g,
      (match, name) =>
        Object.prototype.hasOwnProperty.call(params, name)
          ? String(params[name])
          : match,
    );
  }
  function localizedURL(path, locale, origin) {
    const url = new URL(path, origin);
    if (url.origin !== new URL(origin).origin) return path;
    url.searchParams.set("lang", locales.includes(locale) ? locale : "pt");
    return url.pathname + url.search + url.hash;
  }
  return { locales, normalize, resolveLocale, translate, localizedURL };
});
