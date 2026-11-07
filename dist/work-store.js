(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  else root.DeckWorkStore = value;
})(typeof window === "object" ? window : this, () => {
  const packIds = ["planilhas-confiaveis", "power-bi-sob-controle"];
  const empty = () => ({
    mode: "explore",
    activePack: packIds[0],
    packs: {},
    history: [],
  });
  const date = (v) =>
    typeof v === "string" && Number.isFinite(Date.parse(v))
      ? new Date(v).toISOString()
      : null;
  function run(raw = {}) {
    return {
      phase:
        Number.isInteger(raw.phase) && raw.phase >= 0 && raw.phase < 4
          ? raw.phase
          : 0,
      context: raw.context === "own" ? "own" : "sample",
      platform: ["any", "codex", "claude", "other"].includes(raw.platform)
        ? raw.platform
        : "any",
      checks: [
        ...new Set(
          (Array.isArray(raw.checks) ? raw.checks : []).filter(
            (x) => typeof x === "string" && /^[a-zA-Z0-9_.:-]{1,110}$/.test(x),
          ),
        ),
      ].slice(0, 80),
      startedAt: date(raw.startedAt),
      updatedAt: date(raw.updatedAt) || date(raw.startedAt),
      completedAt: raw.outcome === "completed" ? date(raw.completedAt) : null,
      activityDates: [
        ...new Set(
          (Array.isArray(raw.activityDates) ? raw.activityDates : []).filter(
            (x) =>
              typeof x === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(x) &&
              Number.isFinite(Date.parse(x)),
          ),
        ),
      ].slice(-30),
      outcome:
        raw.outcome === "completed" && date(raw.completedAt)
          ? "completed"
          : raw.outcome === "blocked"
            ? "blocked"
            : "partial",
      outcomeChoice: ["completed", "partial", "blocked"].includes(
        raw.outcomeChoice,
      )
        ? raw.outcomeChoice
        : ["completed", "partial", "blocked"].includes(raw.outcome)
          ? raw.outcome
          : "partial",
      help: ["none", "guide", "person"].includes(raw.help) ? raw.help : "none",
      minutes:
        Number.isFinite(raw.minutes) && raw.minutes >= 0 && raw.minutes <= 1440
          ? raw.minutes
          : null,
    };
  }
  function clean(raw) {
    const out = empty();
    if (!raw || typeof raw !== "object") return out;
    if (raw.mode === "work") out.mode = "work";
    if (packIds.includes(raw.activePack)) out.activePack = raw.activePack;
    for (const id of packIds)
      if (raw.packs?.[id]) out.packs[id] = run(raw.packs[id]);
    out.history = (Array.isArray(raw.history) ? raw.history : [])
      .filter((x) => x && packIds.includes(x.packId) && date(x.startedAt))
      .slice(-30)
      .map((x) => ({ packId: x.packId, ...run(x) }));
    return out;
  }
  function touch(raw, now = new Date()) {
    const out = run(raw),
      iso = now.toISOString(),
      day = iso.slice(0, 10);
    out.startedAt ||= iso;
    out.updatedAt = iso;
    out.activityDates = [...new Set([...out.activityDates, day])].slice(-30);
    return out;
  }
  function merge(a, b) {
    a = clean(a);
    b = clean(b);
    for (const id of packIds) {
      const incoming = b.packs[id],
        old = a.packs[id];
      if (
        incoming?.startedAt &&
        (!old?.updatedAt || incoming.updatedAt > old.updatedAt)
      )
        a.packs[id] = incoming;
    }
    a.history = [
      ...new Map(
        [...a.history, ...b.history].map((r) => [
          r.packId + ":" + r.startedAt,
          r,
        ]),
      ).values(),
    ].slice(-30);
    return a;
  }
  return { packIds, empty, clean, run, touch, merge };
});
