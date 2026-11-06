const DeckSound = (() => {
  let enabled = true,
    ctx;
  try {
    enabled = localStorage.getItem("drivedeck-sound") !== "off";
  } catch {}
  function set(value) {
    enabled = value;
    try {
      localStorage.setItem("drivedeck-sound", value ? "on" : "off");
    } catch {}
  }
  async function play(kind = "reveal") {
    if (!enabled) return;
    try {
      ctx ??= new (window.AudioContext || window.webkitAudioContext)();
      await ctx.resume();
      const now = ctx.currentTime,
        master = ctx.createGain();
      master.gain.value = 0.035;
      master.connect(ctx.destination);
      (kind === "save" ? [523.25, 783.99] : [164.8, 329.6, 493.9]).forEach(
        (hz, i) => {
          const o = ctx.createOscillator(),
            g = ctx.createGain(),
            t = now + i * 0.07;
          o.type = "sine";
          o.frequency.setValueAtTime(hz, t);
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.6, t + 0.015);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          o.connect(g);
          g.connect(master);
          o.start(t);
          o.stop(t + 0.35);
        },
      );
      setTimeout(() => master.disconnect(), 1000);
    } catch {}
  }
  return {
    get enabled() {
      return enabled;
    },
    set,
    play,
  };
})();
