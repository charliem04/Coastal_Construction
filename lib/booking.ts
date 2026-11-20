/**
 * ════════════════════════════════════════════════════════════════════
 *  BOOKING — the seam between the page and the scheduling provider.
 *
 *  client.config.ts → booking says which provider and which event
 *  types. Components ask this file for a booking target and render a
 *  button; they never know whether Cal.com or Calendly is behind it.
 *
 *  Cal.com, with more than one event type, is new here: the earlier
 *  template sites booked through a single Calendly link. Cal.com mounts
 *  through its own embed script (not a plain iframe) and takes its
 *  options through the embed's config object — layout here, prefill
 *  later — never URL query parameters. See components/BookingButton.tsx
 *  and components/CalEmbed.tsx.
 *
 *  The CSP follows the same config: scripts/csp.mjs reads the provider
 *  from client.config.ts, adds that provider's origins to the policy,
 *  and fails the build if the provider is one it has no origins for —
 *  or if anything in the built pages points at an origin the policy
 *  doesn't cover. Switching provider can't leave the CSP behind.
 * ════════════════════════════════════════════════════════════════════
 */
import { client, type BookingEvent } from "@/client.config";

const booking = client.booking;

/** The Cal.com embed loader. Loaded once, only on a page with a booking button. */
export const CALCOM_EMBED_SRC = "https://app.cal.com/embed/embed.js";
/** Where Cal.com booking pages are served (the embed's `origin`). */
export const CALCOM_ORIGIN = "https://cal.com";

export type BookingTarget = {
  /** "coastal-construction-services/meeting" — Cal.com's data-cal-link. */
  calLink: string;
  /** Full booking page URL: the no-JavaScript fallback. */
  url: string;
  /** Embed options (Cal.com's data-cal-config). */
  config: { layout: BookingEvent["layout"] };
  label: string;
};

/** Is online booking switched on at all? */
export const bookingEnabled = booking.provider !== "none";

/**
 * The booking target for one event type, by its id in the config.
 * Returns null when booking is off or the id isn't configured, so a
 * button whose event was removed disappears rather than linking nowhere.
 */
export function bookingTarget(id: string): BookingTarget | null {
  if (booking.provider === "none") return null;
  const event = booking.events.find((e) => e.id === id);
  if (!event) return null;
  const calLink = `${booking.account}/${event.id}`;
  const base = booking.provider === "calcom" ? CALCOM_ORIGIN : "https://calendly.com";
  return { calLink, url: `${base}/${calLink}`, config: { layout: event.layout }, label: event.label };
}

/** Brand colour for the provider's UI (Cal("ui", …)). */
export const bookingBrandColor = booking.provider === "none" ? undefined : booking.brandColor;
export const bookingProvider = booking.provider;
