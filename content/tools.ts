/** The free public tools, and which ones help on each service page. */

export type SiteTool = { href: string; label: string; note: string };

export const siteTools: SiteTool[] = [
  { href: "/check-your-land", label: "Check Your Land", note: "Flood zone and soil lookup" },
  { href: "/buying-land-checklist", label: "Buying Land Checklist", note: "What to check before you buy" },
  { href: "/hurricane-prep", label: "Hurricane Prep", note: "Live outlook and property checklist" },
  { href: "/weather", label: "Acadiana Radar", note: "Live radar and rain outlook" },
];

const LAND = "/check-your-land";
const BUYING = "/buying-land-checklist";
const STORM = "/hurricane-prep";
const WEATHER = "/weather";

export const serviceToolLinks: Record<string, string[]> = {
  "site-pads": [LAND, BUYING],
  "pond-construction": [LAND, BUYING],
  "culvert-installation": [LAND, STORM],
  "levee-creation": [LAND, STORM],
  "land-leveling": [LAND, BUYING],
  "material-delivery": [LAND, WEATHER],
  "pasture-clearing": [BUYING, LAND],
  bushhogging: [BUYING, WEATHER],
  demolition: [STORM, BUYING],
};

export const toolsForService = (slug: string) =>
  (serviceToolLinks[slug] ?? []).flatMap((href) => siteTools.filter((tool) => tool.href === href));
