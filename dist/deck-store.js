(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  else root.DeckStore = value;
})(typeof window === "object" ? window : this, () => {
  const KEY = "drivedata-deck-v1";
  const empty = () => ({
    schema: 1,
    favorites: [],
    downloads: [],
    progress: {},
    journeys: [],
    plans: [],
  });
  function clean(raw, ids, journeyIds = []) {
    if (!raw || raw.schema !== 1)
      throw new Error("Arquivo de Deck incompatível.");
    const allowed = new Set(ids),
      allowedJourneys = new Set(journeyIds),
      out = empty();
    out.favorites = [
      ...new Set(
        (Array.isArray(raw.favorites) ? raw.favorites : []).filter((id) =>
          allowed.has(id),
        ),
      ),
    ];
    out.journeys = [
      ...new Set(
        (Array.isArray(raw.journeys) ? raw.journeys : []).filter((id) =>
          allowedJourneys.has(id),
        ),
      ),
    ];
    out.plans = [
      ...new Map(
        (Array.isArray(raw.plans) ? raw.plans : [])
          .filter(
            (p) =>
              p &&
              typeof p.id === "string" &&
              /^[a-z0-9-]{1,80}$/.test(p.id) &&
              typeof p.title === "string" &&
              p.title.length <= 180 &&
              Array.isArray(p.skillIds) &&
              p.skillIds.length >= 2 &&
              p.skillIds.length <= 3 &&
              new Set(p.skillIds).size === p.skillIds.length &&
              p.skillIds.every((id) => allowed.has(id)),
          )
          .map((p) => [
            p.id,
            { id: p.id, title: p.title, skillIds: [...p.skillIds] },
          ]),
      ).values(),
    ].slice(-20);
    out.downloads = (Array.isArray(raw.downloads) ? raw.downloads : [])
      .filter(
        (x) =>
          x &&
          allowed.has(x.id) &&
          /^\d+\.\d+\.\d+$/.test(x.version) &&
          Number.isFinite(Date.parse(x.at)),
      )
      .slice(-300)
      .map((x) => ({
        id: x.id,
        version: x.version,
        at: new Date(x.at).toISOString(),
      }));
    for (const id of ids) {
      const p = raw.progress?.[id];
      if (!p || typeof p !== "object") continue;
      out.progress[id] = {
        platform: ["codex", "claude", "other"].includes(p.platform)
          ? p.platform
          : "codex",
        installed: p.installed === true,
        promptCopied: p.promptCopied === true,
        tested: p.tested === true,
      };
    }
    return out;
  }
  function load(storage, ids, journeyIds) {
    try {
      const raw = storage.getItem(KEY);
      return raw ? clean(JSON.parse(raw), ids, journeyIds) : empty();
    } catch {
      return empty();
    }
  }
  function save(storage, state) {
    try {
      storage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }
  function latest(state, id) {
    return (
      state.downloads
        .filter((x) => x.id === id)
        .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0] || null
    );
  }
  return { KEY, empty, clean, load, save, latest };
});
