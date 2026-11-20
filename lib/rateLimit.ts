/**
 * Submit limits for the quote form, per browser.
 *
 *   · one send every SPACING_MS — a double-click or an impatient retry
 *     doesn't send the same lead twice;
 *   · at most MAX_IN_WINDOW sends per WINDOW_MS — a script driving this
 *     page can't flood the inbox.
 *
 * Kept in localStorage so a reload doesn't reset it, with an in-memory
 * copy for browsers where storage throws (private modes, blocked site
 * data). It stops this page being used to flood the inbox; it does not
 * stop a bot that posts to Web3Forms directly — Web3Forms' own spam
 * filter does that.
 */
const KEY = "ccs-form-sends";
const SPACING_MS = 10_000;
const WINDOW_MS = 15 * 60_000;
const MAX_IN_WINDOW = 3;

let memory: number[] = [];

function read(now: number): number[] {
  let list = memory;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) list = parsed.filter((t): t is number => typeof t === "number");
  } catch {
    /* storage unavailable: the in-memory list stands in */
  }
  // Only sends inside the window count; a future timestamp is tampered
  // or clock-skewed and dropped.
  return list.filter((t) => t <= now && now - t < WINDOW_MS);
}

function write(list: number[]) {
  memory = list;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* in-memory only */
  }
}

/** Whether a send is allowed right now. Does not record anything. */
export function canSend(now = Date.now()): boolean {
  const recent = read(now);
  if (recent.length >= MAX_IN_WINDOW) return false;
  const last = recent[recent.length - 1];
  return last === undefined || now - last >= SPACING_MS;
}

/** Record an attempt that reached the network. */
export function recordSend(now = Date.now()) {
  write([...read(now), now]);
}
