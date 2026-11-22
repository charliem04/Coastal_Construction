/**
 * Draws one frame of the dozer blade transition: brown dirt fills the
 * screen, then a red bolted blade pushes it off left to right. The dirt
 * browns exist only here.
 */
import { BLADE } from "./bladeTimeline.ts";

const BROWNS = ["#6b4a2f", "#533821", "#3d2817", "#2a1b10"];
const RESTS = [-0.1, 0.25, 0.53, 0.79];
const SKEW = 0.14;

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Clod = { x: number; delay: number; vx: number; vy: number; r: number; rot: number; spin: number; color: string };

let cached: { width: number; clods: Clod[] } | null = null;

function clodsFor(width: number): Clod[] {
  if (cached?.width === width) return cached.clods;
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const count = Math.round(clamp(width / 12, 36, 100));
  const clods = Array.from({ length: count }, () => {
    const pick = Math.floor(rnd() * 4);
    return {
      x: rnd(),
      delay: rnd() * BLADE.clear * 0.84,
      vx: rnd() * 120,
      vy: -66 - rnd() * 154,
      r: 2 + rnd() * rnd() * 12,
      rot: rnd() * 6,
      spin: (rnd() - 0.5) * 12,
      color: pick === 0 ? "#dc2626" : BROWNS[pick - 1],
    };
  });
  cached = { width, clods };
  return clods;
}

function soilEdge(height: number, layer: number, x: number): number {
  const a = Math.min(height * 0.04, 30);
  const q = Math.round(x / 12) * 12;
  return a * Math.sin(q * 0.006 + layer * 1.7) + a * 0.55 * Math.sin(q * 0.019 + layer * 2.3) + a * 0.28 * Math.sin(q * 0.057 + layer);
}

function fillSoil(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = BROWNS[0];
  ctx.fillRect(-90, -90, width + 180, height + 180);
  for (let i = 1; i < 4; i++) {
    const y = RESTS[i] * height;
    ctx.beginPath();
    ctx.moveTo(-90, height + 90);
    for (let x = -90; x <= width + 102; x += 12) ctx.lineTo(x, y + soilEdge(height, i, x));
    ctx.lineTo(width + 90, height + 90);
    ctx.closePath();
    ctx.fillStyle = BROWNS[i];
    ctx.fill();
  }
}

export function drawBlade(ctx: CanvasRenderingContext2D, width: number, height: number, ms: number): void {
  const covered = BLADE.cover + BLADE.hold;
  if (ms < covered) {
    const rise = (1 - easeOut(clamp(ms / BLADE.cover))) * (height + 150);
    const since = ms - BLADE.cover;
    const shake = since >= 0 ? 5 * Math.exp(-since / 42) * Math.cos(since / 7.5) : 0;
    ctx.save();
    ctx.translate(0, rise + shake);
    fillSoil(ctx, width, height);
    ctx.restore();
    return;
  }

  const travel = height * SKEW + 80;
  const pos = (t: number) => -travel + (width + 2 * travel) * easeInOut(t);
  const edge = (b: number, y: number) => b + (y - height / 2) * SKEW;
  const elapsed = ms - covered;
  const b = pos(clamp(elapsed / BLADE.clear));
  const strip = (offset: number, w: number, color: string) => {
    ctx.beginPath();
    ctx.moveTo(edge(b + offset, -30), -30);
    ctx.lineTo(edge(b + offset + w, -30), -30);
    ctx.lineTo(edge(b + offset + w, height + 30), height + 30);
    ctx.lineTo(edge(b + offset, height + 30), height + 30);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(edge(b, -30), -30);
  ctx.lineTo(width + 90, -30);
  ctx.lineTo(width + 90, height + 30);
  ctx.lineTo(edge(b, height + 30), height + 30);
  ctx.closePath();
  ctx.clip();
  fillSoil(ctx, width, height);
  strip(0, 64, "rgb(0 0 0 / 0.3)");
  ctx.restore();

  strip(-34, 34, "#dc2626");
  strip(-43, 9, "#7f1d1d");
  strip(-5, 6, "#000");
  strip(-28, 2, "#fff");
  ctx.fillStyle = "#000";
  for (let y = 20; y < height; y += clamp(height / 9, 62, 92)) {
    ctx.beginPath();
    ctx.arc(edge(b - 18, y), y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  const fade = clamp((BLADE.clear - elapsed) / 90);
  for (const c of clodsFor(width)) {
    const s = (elapsed - c.delay) / 1000;
    if (s < 0) continue;
    const startY = c.x * height;
    const px = edge(pos(clamp(c.delay / BLADE.clear)) - 48, startY) - c.vx * s;
    const py = startY + c.vy * s + 1450 * s * s;
    if (py > height + 30 || px < -30 || px > width + 30) continue;
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(px, py);
    ctx.rotate(c.rot + c.spin * s);
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.moveTo(c.r, 0);
    ctx.lineTo(c.r * 0.4, c.r * 0.9);
    ctx.lineTo(-c.r * 0.8, c.r * 0.55);
    ctx.lineTo(-c.r, -c.r * 0.35);
    ctx.lineTo(c.r * 0.2, -c.r * 0.95);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
