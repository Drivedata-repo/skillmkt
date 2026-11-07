(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  else root.DeckNavigation = value;
})(typeof window === "object" ? window : this, () => {
  function appPath(value) {
    if (
      typeof value !== "string" ||
      value.length > 1500 ||
      !/^\/app(?:[?#]|$)/.test(value) ||
      /[\\\u0000-\u001f\u007f]/.test(value)
    )
      return "/app";
    let url;
    try {
      url = new URL(value, "https://deck.invalid");
    } catch {
      return "/app";
    }
    if (url.origin !== "https://deck.invalid" || url.pathname !== "/app")
      return "/app";
    const allowed = {
      mode: ["work", "explore"],
      pack: ["planilhas-confiaveis", "power-bi-sob-controle"],
      lang: ["pt", "en", "es"],
      view: ["discover", "deck", "journeys"],
      chapter: [
        "universe",
        "overview",
        "example",
        "start",
        "technical",
        "lab",
        "help",
        "power",
      ],
      step: ["0", "1", "2", "3"],
      spin: ["on", "off"],
      face: ["front", "back"],
    };
    const params = new URLSearchParams();
    for (const [key, options] of Object.entries(allowed)) {
      const v = url.searchParams.get(key);
      if (options.includes(v)) params.set(key, v);
    }
    const skill = url.searchParams.get("skill");
    if (/^DD-\d{3}$/.test(skill || "")) params.set("skill", skill);
    return "/app" + (params.size ? "?" + params.toString() : "");
  }
  return { appPath };
});
