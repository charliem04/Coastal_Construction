/** "500+" → { number: 500, suffix: "+" }. Anything else is not countable. */
export function parseStat(value: string): { number: number; suffix: string } | null {
  const m = value.match(/^(\d+)(\D*)$/);
  return m ? { number: Number(m[1]), suffix: m[2] } : null;
}
