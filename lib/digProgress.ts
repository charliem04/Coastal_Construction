/**
 * The geometry of the dirt divider under the home hero: four soil layers
 * that start piled and dig away one at a time as the hero scrolls off.
 * All values are in the divider's 1600×220 viewBox.
 */
export const DIG_LAYERS = [
  { color: "#b91c1c", base: 34, freq: 0.0048, phase: 1 },
  { color: "#7f1d1d", base: 86, freq: 0.0039, phase: 2.4 },
  { color: "#431411", base: 136, freq: 0.0056, phase: 0.6 },
  { color: "#190b0a", base: 184, freq: 0.0044, phase: 3.3 },
] as const;

/** The same four layers above a red banner: dark soil down into brand red. */
export const BAND_COLORS = ["#2a1210", "#7f1d1d", "#b91c1c", "#dc2626"] as const;

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (t: number) => t * t * (3 - 2 * t);

export function digProgress(scrollY: number, heroHeight: number): number {
  return heroHeight > 0 ? clamp(scrollY / (heroHeight * 0.62)) : 0;
}

/** How far a layer has dropped. The top layer (index 0) leaves first. */
export function layerOffset(index: number, progress: number): number {
  const k = smooth(clamp((progress - index * 0.2) / 0.4));
  return k * (236 - DIG_LAYERS[index].base);
}

export function seamProgress(progress: number): number {
  return smooth(clamp((progress - 0.78) / 0.22));
}

export function layerPath(index: number): string {
  const { base, freq, phase } = DIG_LAYERS[index];
  const amp = 12;
  const y = (x: number) =>
    (base + amp * Math.sin(x * freq + phase) + amp * 0.4 * Math.sin(x * freq * 2.7 + phase)).toFixed(1);
  let d = `M0 ${y(0)}`;
  for (let x = 20; x <= 1600; x += 20) d += `L${x} ${y(x)}`;
  return `${d}L1600 220L0 220Z`;
}

/**
 * Progress for a divider further down the page: piled as it enters the
 * viewport, cleared 40% of the way up, or by the end of the page if the
 * page can't scroll that far.
 */
export function bandProgress(top: number, viewportHeight: number, remainingScroll: number): number {
  if (viewportHeight <= 0) return 0;
  const end = Math.max(viewportHeight * 0.4, top - remainingScroll);
  if (end >= viewportHeight) return 0;
  return clamp((viewportHeight - top) / (viewportHeight - end));
}
