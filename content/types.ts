/**
 * ════════════════════════════════════════════════════════════════════
 *  CONTENT TYPES — the shapes the site's lists take.
 *
 *  Services, service areas, timelines, reviews and FAQs are data, not
 *  JSX. Components map over these; none of them should hold a string of
 *  their own that the client would ever ask to change.
 *
 *  Headings use one markup convention throughout: a word in [brackets]
 *  is the red one — "BUILDING [STRONGER] FOUNDATIONS". See
 *  components/Highlight.tsx.
 * ════════════════════════════════════════════════════════════════════
 */

/** A photo in public/images, by its name in content/imageManifest.json. */
export type PhotoName =
  | "hero-dirt-work"
  | "site-pad-construction"
  | "pond-construction"
  | "culvert-installation"
  | "levee-construction"
  | "land-leveling"
  | "material-delivery"
  | "pasture-clearing"
  | "bushhogging"
  | "demolition"
  | "owner-kevin-meyers"
  | "logo";

/**
 * One service. The home page's cards, the services page and the contact
 * form's dropdown all map over the same list (content/services.ts), so
 * adding a record here adds it in all three places.
 */
export type Service = {
  /** Anchor on /services (#site-pads), and the stable id of the record. */
  slug: string;
  /** Heading on the services page, title on the home card, dropdown option. */
  name: string;
  /** One line under the name on the home page's card. */
  blurb: string;
  /** The services page's paragraphs, in order. */
  body: string[];
  /** The "What We Offer:" list. */
  features: string[];
  photo: PhotoName;
  /**
   * Alt text, carried over verbatim from the old HTML — which used a
   * different string on each page, so both are kept.
   */
  alt: { card: string; detail: string };
  /** Whether it is offered in the contact form's "Service Needed" list. */
  inDropdown: boolean;
  /** Name and description for the Service entry in structured data. */
  schema: { name: string; description: string };
};

/** A tier of the service-area list on the home page. */
export type ServiceAreaTier = {
  heading: string;
  /** `strong` renders the parish in bold, as the old list did. */
  parishes: { name: string; note?: string; strong?: boolean }[];
  /** Small italic note under the tier's list. */
  note?: string;
};

export type Review = {
  quote: string;
  /** "Mike T., Lafayette" */
  author: string;
};

export type Faq = {
  q: string;
  a: string;
};
