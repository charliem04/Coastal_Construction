/**
 * ════════════════════════════════════════════════════════════════════
 *  THE NINE SERVICES — the one definition.
 *
 *  Read by: the home page's cards (components/ServiceCards), the
 *  services page (components/Services), the contact form's "Service
 *  Needed" dropdown and its submit allow-list (components/ContactForm,
 *  lib/formRules), and the structured data (components/JsonLd).
 *  Adding a tenth service is one record here.
 *
 *  Every string was moved from the old HTML, not retyped:
 *    name, body, features, alt.detail  ← services.html (the fullest copy)
 *    blurb, alt.card                   ← index.html's cards
 *    schema                            ← services.html's JSON-LD
 *
 *  Reconciled across the three old copies: the names and order were
 *  identical in the home cards, the services page and the dropdown. The
 *  only drift was alt text (the home cards said "Site Pads", the services
 *  page "Site Pad Construction", etc.) — both are kept, per page.
 *
 *  TODO(charlie): two claims to confirm with the client, both carried
 *  over as written —
 *    · Land leveling says "GPS-guided equipment" in its copy but "Laser
 *      precision grading" in its list. Which (or both) is the rig?
 *    · Site pads say pads meet "all local building codes and engineering
 *      specifications" and are "code-compliant"; levees are "built to
 *      Louisiana standards". Fine if true; worth a yes from the owner.
 * ════════════════════════════════════════════════════════════════════
 */
import type { Service } from "./types";

export const services: Service[] = [
  {
    slug: "site-pads",
    name: "Site Pads",
    blurb: "Professional pad construction for any project size",
    body: [
      "Professional site pad construction is the foundation of any successful building project. We specialize in creating level, properly compacted pads for residential, commercial, and industrial developments throughout the Acadiana area.",
      "Our experienced operators use state-of-the-art equipment to ensure precise grading and proper drainage, meeting all local building codes and engineering specifications. From small residential pads to large commercial developments, we deliver quality results on time and within budget.",
    ],
    features: [
      "Residential building pads",
      "Commercial and industrial site preparation",
      "Proper compaction and grading",
      "Drainage planning and implementation",
      "Code-compliant construction",
    ],
    photo: "site-pad-construction",
    alt: { card: "Site Pads", detail: "Site Pad Construction" },
    inDropdown: true,
    schema: {
      name: "Site Pad Construction",
      description:
        "Professional site pad construction for residential, commercial, and industrial projects in Acadiana. Properly compacted, code-compliant, with drainage planning.",
    },
  },
  {
    slug: "pond-construction",
    name: "Pond Construction",
    blurb: "Custom pond excavation and design",
    body: [
      "Whether you need a farm pond for livestock, an irrigation reservoir, or a recreational fishing pond, Coastal Construction Services has the expertise to bring your vision to life. We handle every aspect of pond construction from initial design to final excavation.",
      "Our team understands Louisiana's unique soil conditions and water table challenges. We design ponds with proper depth, slope, and drainage to ensure longevity and functionality. Each pond is custom-built to meet your specific needs and property characteristics.",
    ],
    features: [
      "Farm and agricultural ponds",
      "Recreational fishing ponds",
      "Irrigation reservoirs",
      "Custom pond design and sizing",
      "Proper slope and depth engineering",
      "Spillway and overflow management",
    ],
    photo: "pond-construction",
    alt: { card: "Pond Construction", detail: "Pond Construction" },
    inDropdown: true,
    schema: {
      name: "Pond Construction",
      description:
        "Custom pond excavation and design for farm, recreational, and irrigation ponds across Southern Louisiana.",
    },
  },
  {
    slug: "culvert-installation",
    name: "Culvert Installation",
    blurb: "Expert drainage solutions",
    body: [
      "Proper drainage is critical in Southern Louisiana, and quality culvert installation is key to managing water flow on your property. We install culverts of all sizes for driveways, roads, and drainage systems, ensuring proper water management and preventing erosion.",
      "Our team carefully assesses your property's drainage needs and installs culverts with the correct sizing, placement, and grade to handle Louisiana's heavy rainfall. We work with concrete, metal, and plastic culverts depending on your specific requirements and local regulations.",
    ],
    features: [
      "Driveway culvert installation",
      "Roadway drainage systems",
      "Property drainage solutions",
      "Proper sizing and placement",
      "Multiple culvert material options",
      "Erosion prevention",
    ],
    photo: "culvert-installation",
    alt: { card: "Culvert Installation", detail: "Culvert Installation" },
    inDropdown: true,
    schema: {
      name: "Culvert Installation",
      description:
        "Driveway, roadway, and property culvert installation sized for Louisiana rainfall and drainage requirements.",
    },
  },
  {
    slug: "levee-creation",
    name: "Levee Creation",
    blurb: "Protective earthwork structures",
    body: [
      "Living in Southern Louisiana means understanding the importance of flood protection. We construct levees and earthwork structures designed to protect your property from flooding and water damage. Our levees are built to Louisiana standards and engineered for maximum protection.",
      "From small property levees to larger agricultural flood control systems, we have the equipment and expertise to build reliable earthwork barriers. We ensure proper compaction, height, and slope to provide effective water management for your property.",
    ],
    features: [
      "Flood protection levees",
      "Agricultural water management",
      "Property boundary levees",
      "Proper compaction techniques",
      "Louisiana code compliance",
      "Custom height and design",
    ],
    photo: "levee-construction",
    alt: { card: "Levee Creation", detail: "Levee Construction" },
    inDropdown: true,
    schema: {
      name: "Levee Creation",
      description:
        "Flood protection levees and earthwork barriers built to Louisiana standards with proper compaction and engineering.",
    },
  },
  {
    slug: "land-leveling",
    name: "Land Leveling",
    blurb: "Precision grading and preparation",
    body: [
      "Precision land leveling is essential for proper drainage, construction preparation, and agricultural use. We use advanced GPS-guided equipment to achieve exact grades and slopes, ensuring your land is perfectly prepared for its intended purpose.",
      "Whether you're preparing land for building, farming, or improving drainage, our land leveling services create the optimal foundation. We handle projects of all sizes, from residential lots to large agricultural fields, with the same attention to detail and precision.",
    ],
    features: [
      "Laser precision grading",
      "Residential lot preparation",
      "Agricultural field leveling",
      "Drainage improvement",
      "Construction site grading",
      "Erosion control planning",
    ],
    photo: "land-leveling",
    alt: { card: "Land Leveling", detail: "Land Leveling" },
    inDropdown: true,
    schema: {
      name: "Land Leveling",
      description: "GPS-guided precision land leveling for construction, agriculture, and drainage improvement.",
    },
  },
  {
    slug: "material-delivery",
    name: "Material Delivery",
    blurb: "Dirt, limestone, and gravel transportation",
    body: [
      "Need quality materials delivered to your job site? Coastal Construction Services provides reliable transportation of dirt, limestone, gravel, and other essential construction materials throughout the Acadiana area. We ensure timely delivery of the right materials in the quantities you need.",
      "Our fleet of trucks and experienced drivers handle material delivery with professionalism and efficiency. Whether you need a single load or ongoing material supply for a large project, we coordinate deliveries to keep your project moving forward on schedule.",
    ],
    features: [
      "Dirt and fill dirt delivery",
      "Limestone transportation",
      "Gravel and aggregate delivery",
      "Sand delivery",
      "Scheduled and on-demand delivery",
      "Large quantity hauling",
    ],
    photo: "material-delivery",
    alt: { card: "Material Delivery", detail: "Material Delivery" },
    inDropdown: true,
    schema: {
      name: "Material Delivery",
      description:
        "Reliable delivery of dirt, limestone, gravel, sand, and aggregates throughout the Acadiana region.",
    },
  },
  {
    slug: "pasture-clearing",
    name: "Pasture Clearing",
    blurb: "Complete land clearing services",
    body: [
      "Transform overgrown or wooded land into productive pasture with our comprehensive land clearing services. We remove trees, stumps, brush, and debris to create clean, usable land for livestock, farming, or development.",
      "Our clearing process is thorough and efficient, preparing your land for immediate use. We can clear land to your exact specifications, whether you need complete clearing or selective tree removal. All debris is properly disposed of, leaving you with ready-to-use land.",
    ],
    features: [
      "Complete land clearing",
      "Tree and stump removal",
      "Brush and undergrowth clearing",
      "Debris removal and disposal",
      "Selective clearing options",
      "Pasture preparation",
    ],
    photo: "pasture-clearing",
    alt: { card: "Pasture Clearing", detail: "Pasture Clearing" },
    inDropdown: true,
    schema: {
      name: "Pasture Clearing",
      description:
        "Complete land clearing, tree and stump removal, and pasture preparation for agricultural or development use.",
    },
  },
  {
    slug: "bushhogging",
    name: "Bushhogging",
    blurb: "Heavy-duty brush clearing",
    body: [
      "Keep your property maintained and accessible with our heavy-duty bushhogging services. We tackle thick brush, tall grass, and overgrown vegetation that regular mowing equipment can't handle. Perfect for maintaining large properties, rights-of-way, and reclaiming overgrown land.",
      "Our industrial-grade bushhogging equipment cuts through dense vegetation quickly and efficiently. Whether you need regular maintenance or one-time clearing of severely overgrown areas, we have the power and experience to get the job done right.",
    ],
    features: [
      "Heavy brush and vegetation cutting",
      "Overgrown property maintenance",
      "Right-of-way clearing",
      "Large acreage mowing",
      "Seasonal maintenance programs",
      "Fire break creation",
    ],
    photo: "bushhogging",
    alt: { card: "Bushhogging", detail: "Bushhogging" },
    inDropdown: true,
    schema: {
      name: "Bushhogging",
      description:
        "Heavy-duty brush cutting for overgrown property, rights-of-way, large acreage, and fire-break creation.",
    },
  },
  {
    slug: "demolition",
    name: "Demolition",
    blurb: "Safe structure removal and cleanup",
    body: [
      "When structures need to come down, Coastal Construction Services provides safe, efficient demolition services. We handle everything from small outbuildings to larger structures, ensuring complete removal and proper disposal of all materials.",
      "Our demolition services include careful planning to protect surrounding structures and utilities. We handle all aspects of the demolition process including permits, safety measures, debris removal, and site cleanup, leaving you with a clean slate ready for your next project.",
    ],
    features: [
      "Building and structure demolition",
      "Concrete removal and breaking",
      "Foundation removal",
      "Complete debris hauling",
      "Site cleanup and grading",
      "Proper disposal and recycling",
    ],
    photo: "demolition",
    alt: { card: "Demolition", detail: "Demolition Services" },
    inDropdown: true,
    schema: {
      name: "Demolition",
      description:
        "Safe demolition of buildings, foundations, and concrete structures with complete debris removal and site cleanup.",
    },
  },
];

/**
 * Options in the "Service Needed" dropdown that are not services. They
 * follow the services, in this order, as they did on the old form.
 */
export const extraServiceOptions = ["Multiple Services", "Other / Not Sure"] as const;

/** The dropdown, in order: every service offered there, then the extras. */
export const serviceOptions: readonly string[] = [
  ...services.filter((s) => s.inDropdown).map((s) => s.name),
  ...extraServiceOptions,
];
