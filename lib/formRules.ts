/**
 * ════════════════════════════════════════════════════════════════════
 *  FORM RULES — what each answer box may contain, in one place.
 *
 *  The same rules run three times:
 *    1. as the visitor types (`filter`), so a box never holds a
 *       character it can't use — the phone box takes digits and formats
 *       them as (337) 380-8091, as the old form did;
 *    2. on submit (`validateContact`), so a value that is the right
 *       characters but the wrong shape (9 digits, no "@") is refused
 *       with a message that says what to fix;
 *    3. in `serializeContact` (scrub), which builds the exact object
 *       that is sent, from an allow-list of keys, cleaned again.
 *
 *  None of this replaces a server. Web3Forms is the receiving end, and
 *  a bot posting straight to its API never runs this file. What it does
 *  guarantee is that everything THIS PAGE sends is clean and expected,
 *  and that a real visitor learns what's wrong before pressing send.
 * ════════════════════════════════════════════════════════════════════
 */
import { client } from "@/client.config";
import { serviceOptions } from "@/content/services";
import { timelines } from "@/content/timelines";

const f = client.form;

/** The old form's maxlength on every box, kept. */
export const LIMITS = { name: 100, email: 254, phone: 30, location: 100, message: 2000 } as const;

/*
 * ── Control and invisible characters ─────────────────────────────────
 *
 *   \p{Cc}  C0/C1 controls: NUL, ESC, BEL, DEL… A newline in a name is
 *           the classic header-injection shape; the rest is garbage.
 *   \p{Cf}  "format" characters: zero-width spaces/joiners, BOM, and the
 *           bidi overrides that can make an email display text in a
 *           different order from what it says.
 *   \p{Co}  private-use code points; \p{Cs} lone surrogate halves.
 *   U+2028/2029 line/paragraph separators.
 */
const INVISIBLE = /[\p{Cf}\p{Co}\p{Cs}]/gu;
const CONTROL_SPACE = /[\t\v\f]/g;
// eslint-disable-next-line no-control-regex
const CONTROL_OTHER = /[\u0000-\u0008\u000e-\u001f\u007f-\u009f]/g;

/**
 * Strips control and invisible characters and normalises the text.
 * Single-line fields turn every line break into a space; `multiline`
 * keeps \n and caps blank runs at one empty line.
 */
export function stripControl(value: string, multiline = false): string {
  const s = value
    .normalize("NFC")
    .replace(INVISIBLE, "")
    .replace(CONTROL_OTHER, "")
    .replace(CONTROL_SPACE, " ")
    .replace(/\r\n?|[\p{Zl}\p{Zp}]/gu, "\n");
  return multiline
    ? s.replace(/ {2,}/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n")
    : s.replace(/\s+/g, " ");
}

/** scrub(): final cleanup for sending — control chars out, trimmed, capped. */
export const scrub = (value: string, max: number, multiline = false) =>
  stripControl(value, multiline).trim().slice(0, max);

/*
 * ── What each box accepts, as the visitor types ──────────────────────
 */
const NAME_DISALLOWED = /[^\p{L}\p{M} '’.-]/gu;
const EMAIL_DISALLOWED = /[\s<>()[\]\\,;:"]/g;
/** A place: letters, digits and the punctuation addresses use. */
const LOCATION_DISALLOWED = /[^\p{L}\p{M}0-9 '’.,#&/-]/gu;

/** (337) 380-8091 as the digits arrive — the old form's formatter. */
function formatPhone(v: string): string {
  const d = v.replace(/\D/g, "").replace(/^1(?=\d{10})/, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export const filter = {
  name: (v: string) => stripControl(v).replace(NAME_DISALLOWED, "").replace(/ {2,}/g, " ").slice(0, LIMITS.name),
  email: (v: string) => stripControl(v).replace(EMAIL_DISALLOWED, "").slice(0, LIMITS.email),
  phone: (v: string) => formatPhone(stripControl(v)).slice(0, LIMITS.phone),
  location: (v: string) =>
    stripControl(v).replace(LOCATION_DISALLOWED, "").replace(/ {2,}/g, " ").slice(0, LIMITS.location),
  message: (v: string) => stripControl(v, true).slice(0, LIMITS.message),
};

/*
 * ── What each answer must look like on submit ────────────────────────
 */
const EMAIL_SHAPE =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}(?<!\.)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;
/** Links and markup: a quote request has no use for either, and spam always does. */
const LINK_OR_MARKUP = /\b(?:https?:\/\/|www\.)|<[^>]*>|\[url/i;

/** A US number: 10 digits, or 11 with a leading 1. Returns the 10, or null. */
export function phoneDigits(v: string): string | null {
  const d = v.replace(/\D/g, "");
  if (d.length === 10) return d;
  if (d.length === 11 && d.startsWith("1")) return d.slice(1);
  return null;
}

export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  service: string;
  timeline: string;
  location: string;
  message: string;
};

/** The first problem with the answers, as a message for the visitor, or null. */
export function validateContact(v: ContactFields): string | null {
  const name = scrub(v.name, LIMITS.name);
  if ((name.match(/\p{L}/gu) ?? []).length < 2) return f.errors.invalidName;
  if (!EMAIL_SHAPE.test(scrub(v.email, LIMITS.email))) return f.errors.invalidEmail;
  if (!phoneDigits(v.phone)) return f.errors.invalidPhone;
  // The dropdowns and this check read the same lists, so an option can
  // never be offered and then refused.
  if (!serviceOptions.includes(v.service) || !(timelines as readonly string[]).includes(v.timeline)) {
    return f.errors.invalidSelection;
  }
  if (LINK_OR_MARKUP.test(v.message) || LINK_OR_MARKUP.test(v.location)) return f.errors.noLinks;
  return null;
}

/**
 * The exact fields that leave the page: fixed keys in a fixed order,
 * every value scrubbed again, the phone normalised to (337) 380-8091.
 * Built field by field — never by spreading form state — so nothing
 * extra can ride along. Call only after validateContact() passed.
 */
export function serializeContact(v: ContactFields) {
  const d = phoneDigits(v.phone) ?? "";
  return Object.freeze({
    name: scrub(v.name, LIMITS.name),
    email: scrub(v.email, LIMITS.email).toLowerCase(),
    phone: `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`,
    service: v.service,
    timeline: v.timeline,
    location: scrub(v.location, LIMITS.location),
    message: scrub(v.message, LIMITS.message, true),
  });
}

export type SerializedContact = ReturnType<typeof serializeContact>;
