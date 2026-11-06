"use strict";
(() => {
  const lab = document.querySelector("#inside-skill");
  if (!lab || typeof PublicPreview === "undefined") return;
  document.querySelector("#lab-card").innerHTML = DeckArt.card(
    PublicPreview[0].card,
  );
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const tall = matchMedia("(min-width: 961px) and (min-height: 821px)");
  const mobile = matchMedia("(max-width: 640px)");
  const dock = document.querySelector("#motion-dock");
  const hero = document.querySelector(".hero");
  const example = document.querySelector(".example-content");
  const pack = document.querySelector(".package-section");
  const waitlist = document.querySelector(".waitlist-section");
  let pending = false;
  const clamp = (n, low = 0, high = 1) => Math.min(high, Math.max(low, n));
  const smooth = (n) => n * n * (3 - 2 * n);
  const set = (node, key, value) => node.style.setProperty(key, value);
  function viewportProgress(rect, height) {
    return clamp((height - rect.top) / (height + rect.height * 0.35));
  }
  function render() {
    pending = false;
    if (document.hidden) return;
    const h = innerHeight;
    set(
      document.documentElement,
      "--read-progress",
      clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - h)),
    );
    const off = document.body.classList.contains("motion-off");
    const wr = waitlist.getBoundingClientRect();
    dock.hidden =
      reduce.matches || scrollY < 300 || (wr.top < h && wr.bottom > 0);
    dock.setAttribute("aria-pressed", String(off));
    dock.querySelector("span").textContent = off
      ? "Ativar efeitos"
      : "Pausar efeitos";
    if (reduce.matches || off) return;
    const hr = hero.getBoundingClientRect();
    if (hr.bottom > 0 && hr.top < h) {
      const p = clamp(-hr.top / hr.height);
      set(hero, "--hero-lift", `${-p * 55}px`);
      set(hero, "--hero-fan-left", `${-p * 35}px`);
      set(hero, "--hero-fan-right", `${p * 35}px`);
    }
    const lr = lab.getBoundingClientRect();
    if (lr.bottom > 0 && lr.top < h) {
      const p = tall.matches
        ? clamp(-lr.top / Math.max(1, lr.height - h))
        : viewportProgress(lr, h);
      const spread = smooth(clamp(p * 1.65));
      const finish = smooth(clamp((p - 0.4) / 0.6));
      lab.dataset.step = String(Math.min(2, Math.floor(p * 3)));
      const distance = innerWidth > 1200 ? 290 : 235;
      if (mobile.matches) {
        set(lab, "--card-x", `${-40 - 32 * spread}px`);
        set(lab, "--card-y", `${(1 - spread) * 20}px`);
        set(lab, "--card-rot", `${-4 - 6 * spread}deg`);
        set(lab, "--sheet-x", `${35 + 27 * spread}px`);
        set(lab, "--sheet-y", `${20 + (1 - spread) * 30}px`);
        set(lab, "--sheet-rot", `${7 * spread}deg`);
        set(lab, "--result-x", "0px");
        set(lab, "--result-y", `${245 + (1 - finish) * 35}px`);
        set(lab, "--result-rot", `${-3 * finish}deg`);
        set(lab, "--lab-turn", "0deg");
      } else {
        set(lab, "--card-x", `${-distance * spread}px`);
        set(lab, "--card-y", `${-10 * spread}px`);
        set(lab, "--card-rot", `${-12 * spread}deg`);
        set(lab, "--sheet-x", `${30 * (1 - spread)}px`);
        set(lab, "--sheet-y", `${-12 * spread}px`);
        set(lab, "--sheet-rot", `${4 * (1 - spread)}deg`);
        set(lab, "--result-x", `${distance * spread}px`);
        set(lab, "--result-y", `${12 + (1 - finish) * 22}px`);
        set(lab, "--result-rot", `${9 * spread}deg`);
        set(lab, "--lab-turn", `${-24 * (1 - spread)}deg`);
      }
      set(lab, "--sheet-opacity", String(0.18 + 0.82 * clamp(spread * 2)));
      set(
        lab,
        "--result-opacity",
        String(0.08 + 0.92 * clamp((spread - 0.2) * 1.8)),
      );
      set(lab, "--wire", String(clamp(p * 1.5)));
    }
    const er = example.getBoundingClientRect();
    if (er.bottom > 0 && er.top < h) {
      const p = smooth(viewportProgress(er, h));
      set(
        example,
        "--example-angle",
        `${(1 - p) * (mobile.matches ? 3 : 9)}deg`,
      );
      set(example, "--example-y", `${(1 - p) * 25}px`);
    }
    const pr = pack.getBoundingClientRect();
    if (pr.bottom > 0 && pr.top < h) {
      const p = smooth(viewportProgress(pr, h)),
        range = mobile.matches ? 14 : 50;
      set(pack, "--cover-x", `${(1 - p) * range}px`);
      set(pack, "--cover-angle", `${-2 - 5 * p}deg`);
      set(pack, "--steps-x", `${-(1 - p) * range}px`);
      set(pack, "--steps-angle", `${-3 + 7 * p}deg`);
      set(pack, "--package-line", String(clamp(p * 1.8)));
    }
    if (wr.bottom > 0 && wr.top < h) {
      const p = smooth(viewportProgress(wr, h));
      set(waitlist, "--brand-shift", `${(1 - p) * -60}px`);
      set(waitlist, "--form-rise", `${(1 - p) * 22}px`);
    }
  }
  function schedule() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(render);
    }
  }
  function preferences() {
    document.body.classList.toggle("scroll-effects", !reduce.matches);
    if (reduce.matches) {
      lab.removeAttribute("style");
      lab.removeAttribute("data-step");
    }
    schedule();
  }
  function layoutChanged() {
    lab.removeAttribute("style");
    lab.removeAttribute("data-step");
    schedule();
  }
  dock.addEventListener("click", () =>
    document.querySelector("#landing-motion").click(),
  );
  new MutationObserver(schedule).observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule, { passive: true });
  document.addEventListener("visibilitychange", schedule);
  reduce.addEventListener("change", preferences);
  tall.addEventListener("change", layoutChanged);
  mobile.addEventListener("change", layoutChanged);
  preferences();
})();
