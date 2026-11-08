/* Original, gesture-triggered sounds. One cancellable voice bus prevents stacking. */
const DeckSound = (() => {
  let enabled = true, ctx, current, revision = 0;
  try { enabled = localStorage.getItem("drivedeck-sound") !== "off"; } catch {}
  function stop() {
    revision++;
    if (!current) return;
    const {master, compressor, nodes, timer} = current;
    clearTimeout(timer);
    try { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(0, ctx.currentTime); } catch {}
    for (const n of nodes) { try { n.stop(); } catch {} try { n.disconnect(); } catch {} }
    try { master.disconnect(); compressor.disconnect(); } catch {}
    current = null;
  }
  function set(value) {
    enabled = !!value;
    if (!enabled) stop();
    try { localStorage.setItem("drivedeck-sound", enabled ? "on" : "off"); } catch {}
  }
  function schedule(context, destination, events, start) {
    const nodes = [];
    for (const e of events) {
      const noise = e.type === "noise";
      const o = noise ? context.createBufferSource() : context.createOscillator(), g = context.createGain(), p = context.createStereoPanner();
      const at = start + e.at, end = at + e.duration;
      let filter;
      if (noise) {
        const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * (e.duration + .05)), context.sampleRate), data = buffer.getChannelData(0);
        let seed = 0x1a2b3c4d;
        for (let i = 0; i < data.length; i++) { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; data[i] = (seed >>> 0) / 2147483648 - 1; }
        o.buffer = buffer; filter = context.createBiquadFilter(); filter.type = "bandpass"; filter.Q.value = .65;
        filter.frequency.setValueAtTime(e.hz, at);
        filter.frequency.exponentialRampToValueAtTime(e.hz * 2 ** (e.slide / 12), end);
        o.connect(filter); filter.connect(g); nodes.push(filter);
      } else {
        o.type = e.type; o.frequency.setValueAtTime(e.hz, at);
        if (e.slide) o.frequency.exponentialRampToValueAtTime(e.hz * 2 ** (e.slide / 12), end);
        o.connect(g);
      }
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(e.gain, at + Math.min(.035, e.duration / 5));
      g.gain.exponentialRampToValueAtTime(.0001, end);
      p.pan.value = e.pan || 0;
      g.connect(p); p.connect(destination);
      o.onended = () => { o.disconnect(); filter?.disconnect(); g.disconnect(); p.disconnect(); };
      o.start(at); o.stop(end + .025); nodes.push(o, g, p);
    }
    return nodes;
  }
  async function play(kind = "reveal", profile = null) {
    if (!enabled) return false;
    stop(); const ticket = revision;
    try {
      ctx ??= new (window.AudioContext || window.webkitAudioContext)();
      await ctx.resume();
      if (!enabled || ticket !== revision) return false;
      const events = kind === "summon" && profile && typeof DeckInvocationProfiles !== "undefined"
        ? DeckInvocationProfiles.score(profile)
        : kind === "download"
        ? [{hz:783.99,at:0,duration:.14,gain:.35,type:"sine"},{hz:1046.5,at:.09,duration:.22,gain:.3,type:"sine"}]
        : (kind === "save" ? [523.25, 783.99] : [164.8, 329.6, 493.9]).map((hz, i) => ({hz, at: i * .07, duration: .3, gain: .5, type: "sine"}));
      if (!events.length) return false;
      const master = ctx.createGain(), compressor = ctx.createDynamicsCompressor();
      master.gain.value = kind === "summon" ? .16 : .035;
      compressor.threshold.value = -16; compressor.knee.value = 14; compressor.ratio.value = 6;
      compressor.attack.value = .005; compressor.release.value = .16;
      master.connect(compressor); compressor.connect(ctx.destination);
      const nodes = schedule(ctx, master, events, ctx.currentTime + .015);
      const duration = Math.max(...events.map(e => e.at + e.duration)) + .1;
      current = {master, compressor, nodes, timer: setTimeout(() => { if (ticket === revision) stop(); }, duration * 1000)};
      return true;
    } catch { if (ticket === revision) stop(); return false; }
  }
  return { get enabled() { return enabled; }, set, play, stop, schedule };
})();
