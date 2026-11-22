/**
 * Core parish pages: built, but hidden until `published` is true.
 *
 * Before publishing a parish, fill in real details from the owner:
 * local conditions you actually work in, common jobs there, and real
 * projects. Thin copies of one template can be treated as doorway pages.
 */
import type { Parish } from "./types";

const empty = { published: false, conditions: [], commonJobs: [], permitNotes: [], projectSlugs: [] };

export const parishes: Parish[] = [
  { ...empty, slug: "iberia", name: "Iberia Parish", seat: "New Iberia", seoTitle: "Dirt Work in Iberia Parish, LA | Coastal Construction", seoDescription: "Site pads, ponds, culverts, grading, land clearing, and demolition for Iberia Parish properties from our home base in New Iberia.", intro: "Iberia Parish is home base for Coastal Construction Services." },
  { ...empty, slug: "lafayette", name: "Lafayette Parish", seat: "Lafayette", seoTitle: "Dirt Work in Lafayette Parish, LA | Coastal Construction", seoDescription: "Site pads, ponds, culverts, grading, land clearing, and demolition for homes, farms, and businesses across Lafayette Parish.", intro: "Coastal Construction Services handles dirt work across Lafayette Parish." },
  { ...empty, slug: "acadia", name: "Acadia Parish", seat: "Crowley", seoTitle: "Dirt Work in Acadia Parish, LA | Coastal Construction", seoDescription: "Site pads, ponds, culverts, land leveling, clearing, and demolition for homes, farms, and businesses across Acadia Parish.", intro: "Coastal Construction Services handles dirt work across Acadia Parish." },
  { ...empty, slug: "vermilion", name: "Vermilion Parish", seat: "Abbeville", seoTitle: "Dirt Work in Vermilion Parish, LA | Coastal Construction", seoDescription: "Site pads, ponds, culverts, levees, land leveling, and clearing for homes, farms, and businesses across Vermilion Parish.", intro: "Coastal Construction Services handles dirt work across Vermilion Parish." },
  { ...empty, slug: "st-martin", name: "St. Martin Parish", seat: "St. Martinville", seoTitle: "Dirt Work in St. Martin Parish, LA | Coastal", seoDescription: "Site pads, ponds, culverts, grading, land clearing, and demolition for homes, farms, and businesses across St. Martin Parish.", intro: "Coastal Construction Services handles dirt work across St. Martin Parish." },
];

export const parish = (slug: string) => parishes.find((p) => p.slug === slug);
