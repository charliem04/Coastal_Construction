/**
 * Where the business works. Moved from index.html's "Our Service Area"
 * list; the contact page's "Service Coverage" card, the FAQ answer and
 * the structured data's areaServed all agree with it.
 *
 * The rebuild brief summarises the area as "Lafayette, Acadia, Vermilion
 * and surrounding parishes" (from the contact page's meta description).
 * The page itself is more specific, with Iberia Parish as home base, and
 * that is what is kept.
 */
import type { ServiceAreaTier } from "./types";

export const serviceAreaTiers: ServiceAreaTier[] = [
  {
    heading: "PRIMARY SERVICE AREA",
    parishes: [{ name: "Iberia Parish", note: " - Our home base in New Iberia", strong: true }],
  },
  {
    heading: "CORE SERVICE AREA",
    parishes: [
      { name: "Lafayette Parish", strong: true },
      { name: "Acadia Parish", strong: true },
      { name: "Vermilion Parish", strong: true },
      { name: "St. Martin Parish", strong: true },
    ],
  },
  {
    heading: "EXTENDED SERVICE AREA",
    parishes: [
      { name: "St. Landry Parish" },
      { name: "Evangeline Parish" },
      { name: "Jeff Davis Parish" },
      { name: "St. Mary Parish" },
    ],
    note: "We're happy to discuss projects in surrounding areas - call us to confirm availability!",
  },
];

/**
 * Every parish, for structured data. "Jeff Davis" is the local name;
 * schema gets the official "Jefferson Davis Parish", as the old JSON-LD
 * had it.
 */
export const allParishes = serviceAreaTiers
  .flatMap((t) => t.parishes.map((p) => p.name))
  .map((n) => (n === "Jeff Davis Parish" ? "Jefferson Davis Parish" : n));

/** The contact page's "Service Coverage" card, in its own order. */
export const coverageCard = [
  "Lafayette Parish",
  "Acadia Parish",
  "Vermilion Parish",
  "St. Martin Parish",
  "Iberia Parish",
  "And Surrounding Areas",
];
