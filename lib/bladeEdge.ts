/** The footer's slanted edge, in its 1200×46 viewBox. */
export const BLADE_EDGE = { start: -80, rest: 760, duration: 950 } as const;

/** The slant's position partway through the swipe (t from 0 to 1). */
export function swipeX(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  if (clamped === 1) return BLADE_EDGE.rest;
  return BLADE_EDGE.start + (BLADE_EDGE.rest - BLADE_EDGE.start) * (1 - Math.pow(1 - clamped, 4));
}

export function edgePaths(x: number): { accent: string; fill: string; line: string } {
  const n = Number(x.toFixed(1));
  return {
    accent: `M0 34H${n}L${n + 52} 4H1200V0H${n + 46}L${n - 4} 28H0Z`,
    fill: `M0 46V34H${n}L${n + 52} 4H1200V46Z`,
    line: `M0 34H${n}L${n + 52} 4H1200`,
  };
}
