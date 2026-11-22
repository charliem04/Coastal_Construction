/** The dozer blade's timing, in milliseconds. */
export const BLADE = { cover: 190, hold: 40, clear: 560, total: 790 };

/** The route changes partway through the hold, while the screen is covered. */
export function pushAt(): number {
  return BLADE.cover + Math.round(BLADE.hold * 0.45);
}

/** The newest click wins until the route has been pushed. */
export function latestPending(current: string | null, next: string, pushed: boolean): string | null {
  return pushed ? current : next;
}
