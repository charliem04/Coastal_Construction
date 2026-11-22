/**
 * Calculator pages. These stay hidden until the owner approves them.
 *
 * To publish one, set `published: true`. Leave truckYards and
 * compactionPercent as null until the owner supplies real numbers: the
 * calculator hides truck counts and fill allowances while they are null.
 */

export type CalculatorKind = "fill" | "pad" | "pond";
export type CalculatorField = { id: string; label: string; unit: string; value: number; step: number };

export type Calculator = {
  slug: string;
  kind: CalculatorKind;
  published: boolean;
  title: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  resultLabel: string;
  note: string;
  service: { href: string; label: string };
  fields: CalculatorField[];
  faqs: { q: string; a: string }[];
};

/** Owner-supplied. Null means "do not show this estimate". */
export const calculatorAssumptions: { truckYards: number | null; compactionPercent: number | null } = {
  truckYards: null,
  compactionPercent: null,
};

export const calculators: Calculator[] = [
  {
    slug: "fill-dirt",
    kind: "fill",
    published: false,
    title: "Fill Dirt Calculator",
    seoTitle: "Fill Dirt Calculator: Cubic Yards | Coastal",
    seoDescription: "Enter the length, width, and depth of your area to estimate how many cubic yards of fill dirt it may take before settling and compaction.",
    intro: "Estimate the volume of a rectangular area before you order material.",
    resultLabel: "Estimated in-place volume",
    note: "This is geometric volume. Actual material needs change with soil type, compaction, waste, and uneven ground.",
    service: { href: "/services/material-delivery", label: "Material Delivery" },
    fields: [
      { id: "length", label: "Length", unit: "ft", value: 50, step: 1 },
      { id: "width", label: "Width", unit: "ft", value: 40, step: 1 },
      { id: "depth", label: "Depth", unit: "in", value: 12, step: 1 },
    ],
    faqs: [
      { q: "How do I calculate cubic yards of dirt?", a: "Multiply length by width by depth in feet, then divide by 27. Convert inches to feet first by dividing by 12." },
      { q: "Why might I need more fill than the calculator shows?", a: "Fill compacts and settles, and uneven ground can take more material than a flat measurement suggests." },
    ],
  },
  {
    slug: "house-pad",
    kind: "pad",
    published: false,
    title: "House Pad Calculator",
    seoTitle: "House Pad Fill Calculator | Coastal",
    seoDescription: "Estimate the fill volume for a raised house or slab pad using its top size, height, and side slope, with the sloped edges included in the total.",
    intro: "Include the sloped sides of a raised pad, which are easy to leave out of a rough estimate.",
    resultLabel: "Estimated in-place volume",
    note: "This assumes level ground and even side slopes. Pad design and compaction requirements should come from the project's plans or engineer.",
    service: { href: "/services/site-pads", label: "Site Pads" },
    fields: [
      { id: "length", label: "Top length", unit: "ft", value: 70, step: 1 },
      { id: "width", label: "Top width", unit: "ft", value: 50, step: 1 },
      { id: "height", label: "Pad height", unit: "ft", value: 2, step: 0.5 },
      { id: "slope", label: "Side slope, horizontal per 1 ft rise", unit: "ft", value: 3, step: 0.5 },
    ],
    faqs: [
      { q: "Why does side slope change the fill amount?", a: "A pad gets wider toward the bottom. A flatter slope reaches farther out, so it takes more material." },
      { q: "Can this tell me how high my pad must be?", a: "No. Required height depends on flood rules, site conditions, and plans. Check with the parish and your design professional." },
    ],
  },
  {
    slug: "pond",
    kind: "pond",
    published: false,
    title: "Pond Size Calculator",
    seoTitle: "Pond Volume Calculator | Coastal",
    seoDescription: "Estimate a rectangular pond's surface area, excavated dirt volume, and water capacity from its top size, depth, and side slope before planning a dig.",
    intro: "Get a rough sense of pond size and how much dirt a basin could produce.",
    resultLabel: "Estimated excavation",
    note: "This assumes a rectangular basin on level ground. Soil, water table, permits, and pond design can change what is practical.",
    service: { href: "/services/pond-construction", label: "Pond Construction" },
    fields: [
      { id: "length", label: "Top length", unit: "ft", value: 150, step: 5 },
      { id: "width", label: "Top width", unit: "ft", value: 100, step: 5 },
      { id: "depth", label: "Depth", unit: "ft", value: 8, step: 0.5 },
      { id: "slope", label: "Side slope, horizontal per 1 ft depth", unit: "ft", value: 3, step: 0.5 },
    ],
    faqs: [
      { q: "How do I estimate pond volume?", a: "Because pond sides slope inward, use the top area, middle area, and bottom area rather than multiplying length, width, and depth." },
      { q: "Will my soil hold water?", a: "A calculator cannot tell you. Soil testing and a site review are needed to judge whether a pond will hold water." },
    ],
  },
];

export const calculator = (slug: string) => calculators.find((c) => c.slug === slug);
