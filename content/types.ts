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

/** A service photo's 4:3 centre crop, cut for the home page's cards. */
export type CardPhotoName = `${PhotoName}-card`;

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

/** A real before-and-after job, shown by components/BeforeAfter. */
export type ProjectPair = {
  service: string;
  location: string;
  before: PhotoName;
  after: PhotoName;
  beforeAlt: string;
  afterAlt: string;
};

/** A question and answer on a service, guide, or cost page. */
export type Qa = { q: string; a: string };

/** The extra content on a service's own page. */
export type ServiceDetail = {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  lead: string;
  needs: string[];
  steps: { title: string; body: string }[];
  planning: string[];
  faqs: Qa[];
  guides: string[];
};

export type GuideSource = { label: string; url: string };

export type Guide = {
  slug: string;
  category: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  questions: Qa[];
  services: string[];
  sources: GuideSource[];
};

/** Hidden from the public build until `published` is true. */
export type Parish = {
  slug: string;
  name: string;
  seat: string;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  conditions: string[];
  commonJobs: string[];
  permitNotes: string[];
  projectSlugs: string[];
};

export type ProjectStudy = {
  slug: string;
  published: boolean;
  title: string;
  seoTitle: string;
  seoDescription: string;
  service: string;
  location: string;
  problem: string;
  work: string;
  equipment: string[];
  result: string;
  before: PhotoName;
  after: PhotoName;
  beforeAlt: string;
  afterAlt: string;
};

export type CostGuide = {
  slug: string;
  service: string;
  published: boolean;
  title: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  factors: string[];
  /** Real local ranges from the owner. Empty keeps the page unpublished. */
  priceRows: { label: string; range: string }[];
};
