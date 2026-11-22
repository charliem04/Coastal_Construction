/** Volume math for the calculator pages. All lengths are feet unless named. */

const CUBIC_FEET_PER_YARD = 27;
const GALLONS_PER_CUBIC_FOOT = 7.48052;

export const fillYards = (length: number, width: number, depthInches: number) =>
  (length * width * (depthInches / 12)) / CUBIC_FEET_PER_YARD;

/** Prismoidal volume, exact for a rectangular basin or pad with even slopes. */
function prismoid(topL: number, topW: number, botL: number, botW: number, height: number) {
  const midL = (topL + botL) / 2;
  const midW = (topW + botW) / 2;
  return (height / 6) * (topL * topW + 4 * midL * midW + botL * botW);
}

export function padYards(length: number, width: number, height: number, slope: number) {
  const reach = 2 * slope * height;
  return prismoid(length, width, length + reach, width + reach, height) / CUBIC_FEET_PER_YARD;
}

/** Null when the slopes would meet before reaching the requested depth. */
export function pondVolume(length: number, width: number, depth: number, slope: number) {
  const reach = 2 * slope * depth;
  if (length <= reach || width <= reach) return null;
  const cubicFeet = prismoid(length, width, length - reach, width - reach, depth);
  return { yards: cubicFeet / CUBIC_FEET_PER_YARD, gallons: cubicFeet * GALLONS_PER_CUBIC_FOOT, acres: (length * width) / 43560 };
}

/** Both are hidden until the owner supplies a real number. */
export function withAssumptions(yards: number, truckYards: number | null, compactionPercent: number | null) {
  const planned = compactionPercent === null ? null : yards * (1 + compactionPercent / 100);
  const basis = planned ?? yards;
  return { planned, trucks: truckYards ? Math.ceil(basis / truckYards) : null };
}
