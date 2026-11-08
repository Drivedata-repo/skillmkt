"use strict";
// Órbita do catálogo: cada ponto é uma carta do Deck, na ordem dos códigos.
// A carta da tarefa escolhida acende e se liga à mão por um traço fino.
(() => {
  const canvas = document.querySelector("#hero-orbit");
  const hero = document.querySelector(".hero");
  const stage = document.querySelector(".card-stage");
  const mainCard = document.querySelector("#fan-main");
  const column = document.querySelector("#universe");
  const ctx = canvas && canvas.getContext("2d");
  if (!ctx || !hero || !stage || !mainCard || !column) return;
  if (typeof PublicPreview === "undefined") return;

  const facts = document.querySelector(".collection-facts strong");
  const total = Number.parseInt(facts && facts.textContent, 10) || 169;
  const green =
    getComputedStyle(document.body).getPropertyValue("--green").trim() ||
    "#34d59a";
  const TAU = Math.PI * 2;
  const ENTRY_MS = 2800;
  const PULSE_MS = 950;
  const LINE_MS = 750;
  const ANCHOR = -0.62;
  const ANCHOR_NARROW = -1.22;
  const narrow = matchMedia("(max-width: 640px)");
  const DRIFT_PER_MS = 0.000012;
  const REPEL_RADIUS = 96;

  const clamp = (n) => Math.min(1, Math.max(0, n));
  const easeOut = (n) => 1 - (1 - n) ** 3;
  const points = Array.from({ length: total }, (_, i) => ({
    angle: (i / total) * TAU + (Math.random() - 0.5) * 0.03,
    band: 0.91 + Math.random() * 0.18,
    fromX: Math.random(),
    fromY: Math.random(),
    delay: Math.random() * 0.34,
    spread: 0.4 + Math.random() * 0.6,
    pushX: 0,
    pushY: 0,
  }));

  let width = 0;
  let height = 0;
  let clock = 0;
  let last = 0;
  let frame = 0;
  let running = false;
  let inView = true;
  let drift = 0;
  let turn = 0;
  let turnTarget = 0;
  let pulseAt = -Infinity;
  let selected = 0;
  let pointer = null;

  const isOff = () => document.body.classList.contains("motion-off");

  function paint() {
    const box = canvas.getBoundingClientRect();
    const stageBox = stage.getBoundingClientRect();
    const cardBox = mainCard.getBoundingClientRect();
    const columnBox = column.getBoundingClientRect();
    const fieldX = columnBox.left - box.left;
    const fieldY = columnBox.top - box.top;
    const cx = stageBox.left + stageBox.width / 2 - box.left;
    const cy = narrow.matches
      ? cardBox.top + cardBox.height / 2 - box.top
      : stageBox.top + stageBox.height * 0.47 - box.top;
    const rx = Math.min(column.clientWidth / 2 + 4, 318);
    const ry = narrow.matches
      ? cardBox.height / 2 + 30
      : stageBox.height * 0.51;
    const entry = clamp(clock / ENTRY_MS);
    const pulse = Math.sin(Math.PI * clamp((clock - pulseAt) / PULSE_MS));
    let chosenX = 0;
    let chosenY = 0;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#a9c3dc";
    points.forEach((p, index) => {
      const local = easeOut(clamp((entry - p.delay) / (1 - p.delay)));
      const angle = p.angle + turn + drift;
      const sin = Math.sin(angle);
      const band = index === selected ? 1 : p.band;
      const reach = band * (1 + pulse * 0.13 * p.spread);
      const ringX = cx + Math.cos(angle) * rx * reach;
      const ringY = cy + sin * ry * reach;
      const startX = fieldX + p.fromX * columnBox.width;
      const startY = fieldY + p.fromY * columnBox.height;
      let x = startX + (ringX - startX) * local;
      let y = startY + (ringY - startY) * local;

      let wantX = 0;
      let wantY = 0;
      if (pointer) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance < REPEL_RADIUS) {
          const force = (1 - distance / REPEL_RADIUS) ** 2 * 30;
          wantX = (dx / distance) * force;
          wantY = (dy / distance) * force;
        }
      }
      p.pushX += (wantX - p.pushX) * 0.14;
      p.pushY += (wantY - p.pushY) * 0.14;
      x += p.pushX;
      y += p.pushY;

      if (index === selected) {
        chosenX = x;
        chosenY = y;
        return;
      }
      const depth = (sin + 1) / 2;
      ctx.globalAlpha = (0.34 + depth * 0.56) * Math.min(1, local * 2 + 0.4);
      ctx.beginPath();
      ctx.arc(x, y, 1 + depth * 1.2, 0, TAU);
      ctx.fill();
    });

    const reveal = clamp((entry - 0.86) / 0.14);
    if (reveal > 0) {
      const grow = easeOut(clamp((clock - pulseAt) / LINE_MS));
      const targetX = cardBox.left + cardBox.width / 2 - box.left;
      const targetY = cardBox.top + cardBox.height / 2 - box.top;
      ctx.strokeStyle = green;
      ctx.fillStyle = green;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.62 * reveal;
      ctx.beginPath();
      ctx.moveTo(chosenX, chosenY);
      ctx.lineTo(
        chosenX + (targetX - chosenX) * grow,
        chosenY + (targetY - chosenY) * grow,
      );
      ctx.stroke();
      ctx.globalAlpha = reveal;
      ctx.beginPath();
      ctx.arc(chosenX, chosenY, 3.5, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function tick(now) {
    if (!running) return;
    const elapsed = Math.min(now - last, 200);
    last = now;
    clock += elapsed;
    drift += elapsed * DRIFT_PER_MS;
    turn += (turnTarget - turn) * (1 - Math.exp(-elapsed / 380));
    paint();
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    const go = inView && !isOff();
    if (go && !running) {
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    } else if (!go && running) {
      running = false;
      cancelAnimationFrame(frame);
    }
    if (!go && !document.hidden) {
      clock = Math.max(clock, ENTRY_MS);
      pulseAt = -Infinity;
      turn = turnTarget;
      paint();
    }
  }

  function select(mission, animate) {
    const preview = PublicPreview[mission];
    if (!preview) return;
    const code = Number.parseInt(String(preview.card.code).replace(/\D/g, ""), 10);
    selected = (((code || 1) - 1) % total + total) % total;
    const anchor = narrow.matches ? ANCHOR_NARROW : ANCHOR;
    const gap = anchor - (points[selected].angle + turnTarget + drift);
    turnTarget += Math.atan2(Math.sin(gap), Math.cos(gap));
    if (animate && running) {
      pulseAt = clock;
      return;
    }
    turn = turnTarget;
    if (!running) paint();
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    width = box.width;
    height = box.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (!running) paint();
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest && event.target.closest("[data-mission]");
    if (button) select(Number(button.dataset.mission), true);
  });
  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const box = canvas.getBoundingClientRect();
    pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
  });
  hero.addEventListener("pointerleave", () => {
    pointer = null;
  });
  new ResizeObserver(resize).observe(hero);
  new MutationObserver(sync).observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }).observe(hero);

  resize();
  const pressed = document.querySelector('#hero-tasks [aria-pressed="true"]');
  select(pressed ? Number(pressed.dataset.mission) : 0, false);
  sync();
})();
