/** Only the days the business is open. "Saturday: N/A" adds nothing here. */
export function footerHours(lines: readonly string[]): string[] {
  return lines.filter((line) => !/:\s*N\/A\s*$/i.test(line));
}
