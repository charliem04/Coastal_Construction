/**
 * ════════════════════════════════════════════════════════════════════
 *  THE PHONE NUMBER — one source, every format derived.
 *
 *  The old site typed "(337) 380-8091" and "tel:+13373808091" out by
 *  hand on every page, in buttons, meta tags, JSON-LD and error
 *  messages. Here `client.phone` is written once and everything else is
 *  computed from it.
 *
 *  `client.phoneE164` is the one deliberate duplicate — it's the form a
 *  reader can check at a glance. assertPhoneConsistent() fails the build
 *  if the two disagree, so a half-edited number cannot ship.
 * ════════════════════════════════════════════════════════════════════
 */
import { client } from "@/client.config";

const digits = (s: string) => s.replace(/\D/g, "");

/** Ten-digit NANP number, no country code. */
const local = digits(client.phone).replace(/^1(?=\d{10}$)/, "");

/** "(337) 380-8091" — buttons, contact card, messages. */
export const phoneDisplay = `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;

/** "tel:+13373808091" */
export const phoneHref = `tel:${client.phoneE164}`;

/** "+1-337-380-8091" — schema.org's preferred telephone form. */
export const phoneSchema = `+1-${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}`;

/** Thrown at build time (module load) — loud, and before anything ships. */
function assertPhoneConsistent() {
  if (local.length !== 10) {
    throw new Error(`[client.config] phone "${client.phone}" is not a 10-digit US number.`);
  }
  if (digits(client.phoneE164) !== `1${local}`) {
    throw new Error(
      `[client.config] phone "${client.phone}" and phoneE164 "${client.phoneE164}" disagree. ` +
        `Update both — every tel: link uses phoneE164.`
    );
  }
}
assertPhoneConsistent();

/** Fill `{phone}` and `{email}` in a config string. */
export function fill(template: string): string {
  return template.replaceAll("{phone}", phoneDisplay).replaceAll("{email}", client.email);
}
