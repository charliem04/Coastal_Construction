/**
 * The review ribbon under "Why choose Coastal?" on the home page.
 *
 * Empty on purpose: the placeholder testimonials that were here are gone
 * (Nov 2026, at the owner's request), and components/Reviews renders
 * nothing for an empty list, so the ribbon is simply absent.
 *
 * NEXT: fill this from the business's Google reviews. Plan:
 *   · a Google Places API (New) key in .env.local (GOOGLE_PLACES_KEY —
 *     no NEXT_PUBLIC_ prefix, so it stays on the build machine) and the
 *     Business Profile's place ID in client.config.ts;
 *   · fetch the reviews AT BUILD TIME (a small script before `next build`,
 *     like scripts/images.mjs) and write them into this list, so the
 *     visitor's browser never calls Google and the CSP stays as it is;
 *   · show each review's author and rating as Google returns them, link
 *     to the Google listing (Google's attribution rules require it), and
 *     only then add AggregateRating to the structured data.
 * The ribbon's look and behaviour (components/Reviews, .review-card in
 * app/globals.css) is kept for that.
 */
import type { Review } from "./types";

export const reviews: Review[] = [];
