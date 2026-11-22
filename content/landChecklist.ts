/** The buying-land checklist. General guidance only: no prices, timelines, or local rules. */

export type ChecklistGroup = { title: string; why: string; items: string[] };

export const landChecklist: ChecklistGroup[] = [
  {
    title: "Flood Risk",
    why: "Flood status can affect permits, insurance, financing, and how high a building must sit.",
    items: [
      "Look up the FEMA flood zone at several points on the property.",
      "Ask the seller about past flooding, standing water, and insurance claims.",
      "Ask the parish floodplain office what applies to your planned use.",
      "Get a flood insurance quote before you commit.",
      "Find out whether an elevation certificate already exists.",
    ],
  },
  {
    title: "Drainage",
    why: "Flat Louisiana land depends on where water can go after a hard rain.",
    items: [
      "Walk the land during or soon after a heavy rain if you can.",
      "Note low spots, ruts, water-loving plants, and water lines on trees.",
      "Find where water leaves the property, such as a ditch, coulee, or culvert.",
      "Check whether neighboring land drains onto this property.",
      "Ask who maintains nearby ditches and culverts.",
    ],
  },
  {
    title: "Soil",
    why: "Soil affects pad design, pond potential, equipment access, and drying time.",
    items: [
      "Look up the mapped USDA soil type.",
      "Dig or probe a few test spots to see how the ground changes.",
      "Ask whether your project needs a geotechnical soil test.",
      "Find out if old fill, debris, or buried material may be present.",
    ],
  },
  {
    title: "Wetlands",
    why: "Land can be regulated as wetlands even when it looks dry.",
    items: [
      "Check for hydric soils, standing water, and wetland plants.",
      "Ask the seller about past wetland determinations or permits.",
      "Contact the Army Corps before filling, digging, or clearing questionable areas.",
      "Check whether the property is in Louisiana's coastal zone.",
    ],
  },
  {
    title: "Access",
    why: "A property is harder to use if people, trucks, and equipment cannot reach it.",
    items: [
      "Confirm legal road access in writing.",
      "Check easements, servitudes, and shared driveways in the title work.",
      "Find out whether a new driveway or culvert needs a permit.",
      "See whether the entrance can handle dump trucks and equipment.",
      "Check whether access stays passable in wet weather.",
    ],
  },
  {
    title: "Utilities",
    why: "Bringing services to raw land can change what a property is worth to you.",
    items: [
      "Ask which electric, water, gas, and internet providers serve the property.",
      "Find out how far each service must be extended.",
      "Check whether sewer is available or a septic system would be required.",
      "Ask the parish health unit about septic requirements.",
      "Look for overhead lines and pipeline markers.",
      "Call 811 before anyone digs.",
    ],
  },
  {
    title: "Clearing and Site Work",
    why: "Knowing what the land needs helps you compare it with other properties.",
    items: [
      "Note the amount of brush, trees, stumps, and old structures.",
      "Ask whether debris can be handled on site or must be hauled off.",
      "Mark where a house, shop, pond, or driveway would make sense.",
      "Check whether the building area needs a raised pad.",
      "Get a site walk from a dirt work contractor before closing.",
    ],
  },
  {
    title: "Rules and Title",
    why: "Paperwork can limit what you are allowed to do with land you own.",
    items: [
      "Confirm zoning and allowed uses with the local government.",
      "Read any deed restrictions or subdivision rules.",
      "Order a current survey if boundaries are unclear.",
      "Ask a title professional about liens and mineral rights.",
    ],
  },
];

export const checklistFaqs = [
  { q: "What should I check before buying land in Louisiana?", a: "Start with flood zone, drainage, soil, wetlands, legal access, utilities, clearing needs, zoning, restrictions, and title. Those items affect whether the land can support your plan." },
  { q: "How can I tell if land floods?", a: "Check the FEMA flood map, ask the seller and neighbors, and walk the land after heavy rain. A low-risk flood zone does not mean a property never holds water." },
  { q: "Should I walk land after it rains?", a: "Yes, if you safely can. Wet weather shows low spots, slow drainage, soft access, and water coming from nearby property that may be hidden on a dry day." },
  { q: "How do I know if land has wetlands?", a: "Soil, water patterns, and plants all matter. Public maps can raise a flag, but the U.S. Army Corps of Engineers is the agency that makes jurisdictional determinations." },
  { q: "Does raw land need a survey?", a: "A current survey is often worth getting when boundaries, access, easements, or the buildable area are unclear. Ask your lender, title professional, or surveyor what your purchase requires." },
  { q: "When should I talk to a dirt work contractor?", a: "Before closing is ideal. A site walk can reveal access, clearing, drainage, and fill questions while you can still factor them into your decision." },
];
