/**
 * ════════════════════════════════════════════════════════════════════
 *  CLIENT CONFIG — business facts and every line of page copy.
 *
 *  Every component reads from this file. If you find yourself editing a
 *  component to change a business fact or a line of copy, that fact
 *  belongs here. List-shaped content — services, service areas, form
 *  timelines, reviews, FAQs — lives in content/ instead.
 *
 *  Currently configured for: Coastal Construction Services of Louisiana.
 *
 *  Every string below was moved, not retyped, from the hand-written HTML
 *  it replaces (index.html, services.html, about.html, contact.html,
 *  404.html). Items marked TODO(charlie) are business facts that were
 *  ambiguous or contradictory in that HTML and need confirming with the
 *  client before launch.
 *
 *  Conventions:
 *    [Word]   in a heading is the red word (components/Highlight.tsx).
 *    {phone}  in any string is filled with the display number, so the
 *             number is typed once (lib/phone.ts).
 * ════════════════════════════════════════════════════════════════════
 */

export const client = {
  // ── Identity ──────────────────────────────────────────────────────
  businessName: "Coastal Construction Services of Louisiana",
  /** Short form: the manifest, the privacy notice. */
  shortName: "Coastal Construction",
  /** First year in the footer's copyright line ("© 2026 …" today). */
  copyrightYear: 2026,

  /**
   * Founded 2014. "15+ Years Experience" in the home stats is the
   * owner's experience, which predates the company (confirmed Nov 2026).
   */
  foundingYear: 2014,

  owner: {
    name: "Kevin John Meyers",
    title: "Founder & CEO",
  },

  // ── Domain / SEO ──────────────────────────────────────────────────
  /** No trailing slash. The apex is canonical; www should 301 to it. */
  siteUrl: "https://coastalconstructionservicesofla.com",
  /** Browser UI tint on mobile — the brand red, as before. */
  themeColor: "#dc2626",
  /** Social share card. 1200×630, unchanged from the old site. */
  ogImage: {
    path: "/og-image.jpg",
    alt: "Coastal Construction Services of Louisiana — Acadiana dirt work specialists, {phone}",
  },
  keywords: [
    "dirt work",
    "site pads",
    "pond construction",
    "culvert installation",
    "land leveling",
    "land clearing",
    "demolition",
    "Acadiana",
    "New Iberia",
    "Lafayette",
    "Louisiana",
  ],
  /** The business description in the structured data (search engines only). */
  schemaDescription:
    "Family-owned dirt work and excavation company serving the Acadiana region of Louisiana since 2014. Site pads, pond construction, culvert installation, levee creation, land leveling, material delivery, pasture clearing, bushhogging and demolition.",

  /**
   * Per-page <title> and description. The old titles ran 65–74
   * characters and were cut off in search results; these keep the same
   * words, reordered to fit in 60 (scripts/seo.mjs checks it). The
   * descriptions are the old ones, unchanged.
   */
  pages: {
    home: {
      title: "Acadiana Dirt Work & Land Clearing | Coastal Construction",
      description:
        "Dirt work specialists serving Acadiana, LA — site pads, ponds, culverts, levees, land leveling, clearing & demolition. Free quotes: {phone}",
      ogTitle: "Dirt Work & Land Clearing in Acadiana, LA | Coastal Construction Services",
      ogDescription:
        "Acadiana's dirt work specialists — site pads, ponds, culverts, land leveling, clearing & demolition. Free quotes: {phone}",
    },
    services: {
      title: "Dirt Work Services in Acadiana, LA | Coastal Construction",
      // TODO(charlie): "licensed, insured" — see content/faqs.ts.
      description:
        "Complete dirt work services in Acadiana: site pads, ponds, culverts, levees, land leveling, demolition. Professional, licensed, insured. Call {phone}",
      ogTitle: "Our Dirt Work Services | Coastal Construction Services",
      ogDescription:
        "Site pads, ponds, culverts, levees, land leveling, clearing & demolition across Acadiana, LA. Call {phone} for a free quote.",
    },
    about: {
      title: "About Coastal Construction | Acadiana Dirt Work Since 2014",
      description:
        "Family-owned dirt work company serving Acadiana since 2014. Modern equipment, traditional Louisiana values. Meet the team behind Coastal Construction Services.",
      ogTitle: "About Coastal Construction Services of Louisiana",
      ogDescription: "Family-owned Acadiana dirt work company since 2014 — modern equipment, traditional Louisiana values.",
    },
    contact: {
      title: "Contact Coastal Construction | Free Quote {phone}",
      description:
        "Get your free quote today. Call {phone} or email {email}. Serving Lafayette, Acadia, Vermilion & surrounding Louisiana parishes.",
      ogTitle: "Contact Us | Coastal Construction Services",
      ogDescription:
        "Request your free dirt work quote. Call {phone} or email {email}. Serving the Acadiana region.",
    },
  },

  // ── Contact ───────────────────────────────────────────────────────
  /**
   * The one number on the site. Every visible number, every tel: link
   * and the structured data's telephone derive from this pair in
   * lib/phone.ts. The build fails if the two disagree.
   */
  phone: "(337) 380-8091",
  phoneE164: "+13373808091",
  email: "ccsofla@yahoo.com",

  /**
   * The business address (confirmed Nov 2026). Shown on the contact page
   * and in the structured data. Keep it identical to the Google Business
   * Profile, letter for letter — that consistency is what local search
   * rewards.
   *
   * The old site's geo coordinates (30.0035, -91.8187) were the centre
   * of New Iberia, not this address, so they were dropped rather than
   * published as if they were the yard. Search engines geocode the
   * street address themselves.
   */
  address: {
    street: "5303 Old LA 25, Lot 2",
    city: "New Iberia",
    region: "LA",
    regionName: "Louisiana",
    postalCode: "70560",
    country: "US",
  },

  /** Contact page's "Business Hours" card, and the schema. */
  hours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "18:00",
    },
  ],

  /** Empty string hides the link. None exist on the old site. */
  socials: {
    facebook: "",
    googleBusiness: "",
  },

  // ── Booking ───────────────────────────────────────────────────────
  /**
   * Online scheduling. Cal.com today, with two event types — one per
   * button on the contact page. lib/booking.ts reads this; the CSP in
   * scripts/csp.mjs is built from it too, and the build fails if the
   * provider changes without the policy following.
   *
   *   provider  "calcom" | "calendly" | "none"
   *   account   the Cal.com username in every booking link
   *   events    id = the event-type slug (cal.com/<account>/<id>)
   */
  booking: {
    provider: "calcom",
    account: "coastal-construction-services",
    events: [
      { id: "phone-consultation", label: "Book Now", layout: "month_view" },
      { id: "meeting", label: "Schedule Meeting", layout: "month_view" },
    ],
    /** Cal.com's accent colour — the brand red, from here, not a script tag. */
    brandColor: "#dc2626",
  } as BookingConfig,

  // ── Navigation & footer (every page) ──────────────────────────────
  nav: {
    logoAlt: "Coastal Construction Logo",
    /** The wordmark beside the logo. [Word] is red. */
    wordmark: "[COASTAL] CONSTRUCTION [SERVICES]",
    subtitle: "of Louisiana",
    links: [
      { href: "/", label: "Home" },
      { href: "/services", label: "Services" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
    skip: "Skip to content",
  },
  /** The numbered labels above major sections (components/survey). */
  markers: {
    services: "Services",
    process: "How We Work",
    why: "Why Coastal",
    area: "Coverage",
  },
  footer: {
    /** "© {year} …" — the year is the build year. */
    line: "Coastal Construction Services of Louisiana. All rights reserved. | Serving the Acadiana area with pride.",
    privacy: "Privacy Policy",
    quote: "Get a Quote",
    contactHeading: "Contact",
    hoursHeading: "Hours",
    servicesHeading: "Services",
    areaHeading: "Service Area",
  },

  // ── Home ──────────────────────────────────────────────────────────
  home: {
    hero: {
      logoAlt: "Coastal Construction Services Logo",
      headline: "BUILDING [STRONGER] FOUNDATIONS",
      subhead: "Expert dirt construction services across the area of Acadiana",
      cta: "Get A Quote",
    },
    services: {
      title: "Our [Services]",
      subtitle: "Comprehensive dirt work solutions for every project",
      viewAll: "View All Services",
      seeArea: "See Our Service Area",
    },
    whyChoose: {
      heading: "WHY CHOOSE [COASTAL?]",
      paragraphs: [
        "With deep roots in Southern Louisiana, Coastal Construction Services understands the unique challenges of working in the Acadiana area. Our expertise in dirt work has been built on years of experience handling everything from small residential projects to large commercial developments.",
        "We combine modern equipment with traditional Louisiana work ethic to deliver results that exceed expectations. Every project is handled with precision, professionalism, and a commitment to quality that has made us a trusted name in the region.",
        "Whether you're preparing a site, building a pond, or clearing land, we bring the expertise and equipment to get the job done right the first time.",
      ],
      highlightHeading: "BUILT ON EXCELLENCE",
      /**
       * Confirmed by the owner, Nov 2026. "24/7 Support" was removed: the
       * business keeps Mon–Fri 7–6 hours. With three figures the last one
       * sits centred under the first two (app/globals.css, .stats).
       */
      stats: [
        { number: "500+", label: "Projects" },
        { number: "100%", label: "Satisfaction" },
        { number: "15+", label: "Years Experience" },
      ],
      reviewsLabel: "Customer reviews",
    },
    serviceArea: {
      title: "OUR [SERVICE AREA]",
      subtitle: "Proudly serving the Acadiana region and surrounding parishes",
      /**
       * Google Maps embed centred on New Iberia. A third-party frame, so
       * it's in the CSP (scripts/csp.mjs) and the privacy notice.
       */
      mapSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d437076.6183968194!2d-92.08765484999999!3d30.003758049999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8620a95d38b1a9e7%3A0x5c3b7d0c6c4e54b8!2sNew%20Iberia%2C%20LA!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus&z=9",
      mapTitle: "Coastal Construction Services Service Area - New Iberia, LA",
      based: "Based in New Iberia, LA",
      serving: "Serving Acadiana & Surrounding Parishes",
      ctaBefore: "Not sure if we serve your area? ",
      ctaLink: "Contact us",
      ctaAfter: " to find out - we may be able to help!",
    },
    banner: {
      heading: "SERVING THE ACADIANA AREA WITH PRIDE",
      body: "Professional dirt work services you can trust",
    },
    cta: {
      heading: "READY TO GET STARTED?",
      body: "Let's discuss your project and bring your vision to life",
      contact: "Contact Us",
      call: "Call {phone}",
    },
  },

  // ── Services page ─────────────────────────────────────────────────
  servicesPage: {
    heading: "OUR [SERVICES]",
    subtitle: "Expert dirt work solutions tailored to your project needs",
    featuresHeading: "What We Offer:",
    cta: {
      heading: "READY TO GET STARTED?",
      body: "Contact us today for a free quote on your project",
      primary: "Request a Quote",
      call: "Call {phone}",
    },
  },

  // ── About page ────────────────────────────────────────────────────
  aboutPage: {
    heading: "ABOUT [US]",
    subtitle: "The people and passion behind Coastal Construction Services",
    /** Carried over verbatim. */
    ownerAlt: "Owner Photo",
    /**
     * TODO(charlie): the TODO list has "re-word about us story to match
     * my father's own words" open — copy decision, deferred. The text is
     * the live text; the only change is a broken character: "dirt—”it's"
     * (an encoding slip in three places) now reads "dirt—it's".
     */
    story: {
      heading: "OUR [STORY]",
      paragraphs: [
        "Coastal Construction Services was born from a deep-rooted passion for the land and a commitment to excellence that spans generations. Growing up in Southern Louisiana, I learned early on that the earth beneath our feet is more than just dirt—it's the foundation of everything we build, grow, and create.",
        "After years of working alongside some of the best operators and contractors in the Acadiana area, I recognized a need for a dirt work company that combined modern equipment with traditional Louisiana values. In 2014, I founded Coastal Construction Services with a simple promise: to treat every project like it's our own land we're working.",
        "What started as a one-man operation with a single piece of equipment has grown into a trusted name throughout the region. But our core values haven't changed. We still believe in honest work, fair pricing, and building relationships that last longer than any project.",
      ],
    },
    mission: {
      heading: "OUR [MISSION]",
      paragraphs: [
        "At Coastal Construction Services, our mission is straightforward: to provide the Acadiana area with reliable, professional dirt work services that exceed expectations every single time.",
        "We understand that whether you're building a home, expanding your farm, or developing commercial property, the groundwork is critical. That's why we approach every job with the same level of care and precision, regardless of size. From the smallest residential pad to large-scale commercial developments, we bring the same commitment to quality.",
        "We're not just moving dirt—we're building foundations for dreams, creating solutions for challenges, and helping our community grow stronger, one project at a time.",
      ],
    },
    values: {
      heading: "WHAT WE [STAND FOR]",
      items: [
        {
          title: "INTEGRITY",
          body: "We do what we say we'll do, when we say we'll do it. Our word is our bond, and we stand behind every project we complete.",
        },
        {
          title: "QUALITY",
          body: "We never cut corners. Every job is done right the first time, using proper techniques and the best equipment available.",
        },
        {
          title: "COMMUNITY",
          body: "We're proud to serve the Acadiana area. This is our home, and we're invested in its success and growth.",
        },
        {
          title: "EXPERIENCE",
          body: "Years of hands-on work have taught us how to handle Louisiana's unique soil conditions and weather challenges.",
        },
      ],
    },
    whyChoose: {
      heading: "WHY CHOOSE [COASTAL?]",
      paragraphs: [
        "When you work with Coastal Construction Services, you're not just hiring a contractor—you're partnering with someone who understands the land, respects the craft, and cares about the outcome as much as you do.",
        "We've built our reputation on reliable service, quality workmanship, and treating every customer like family. Whether it's your first project or your fiftieth, you'll get the same level of dedication and expertise that has made us a trusted name in Southern Louisiana.",
        "Let's build something great together.",
      ],
    },
    cta: {
      heading: "READY TO WORK TOGETHER?",
      body: "Let's discuss your project and how we can help bring it to life",
      primary: "Request a Quote",
      call: "Call {phone}",
    },
  },

  // ── Contact page ──────────────────────────────────────────────────
  contactPage: {
    heading: "GET IN [TOUCH]",
    subtitle: "Let's discuss your project and bring your vision to life",
    methods: {
      /** Cal.com event "phone-consultation" (booking.events[0]). */
      call: {
        title: "BOOK A CALL",
        body: "Schedule a convenient time for a phone consultation with our team",
      },
      message: {
        title: "SEND A MESSAGE",
        body: "Fill out our contact form below and we'll get back to you within 24 hours",
        cta: "Send Message",
      },
      /** Cal.com event "meeting" (booking.events[1]). */
      meeting: {
        title: "SCHEDULE A MEETING",
        body: "Book an in-person or virtual meeting to discuss your project in detail",
      },
    },
    info: {
      contact: {
        title: "CONTACT INFORMATION",
        phone: "Phone:",
        email: "Email:",
        address: "Address:",
        area: "Service Area:",
        areaValue: "Acadiana Region, LA",
      },
      hours: {
        title: "BUSINESS HOURS",
        lines: ["Monday - Friday: 7:00 AM - 6:00 PM", "Saturday: N/A", "Sunday: N/A"],
      },
      response: {
        title: "RESPONSE TIME",
        lines: ["Phone Calls: Same Day", "Email/Forms: Within 24 Hours"],
      },
      coverage: { title: "SERVICE COVERAGE" },
      expect: {
        title: "WHAT TO EXPECT",
        // TODO(charlie): "Licensed and insured service" — see content/faqs.ts.
        lines: [
          "Free project consultation",
          "Detailed written estimates",
          "Professional assessment",
          "Timeline and cost breakdown",
          "Licensed and insured service",
        ],
      },
      equipment: {
        title: "EQUIPMENT & CAPABILITIES",
        // Equipment confirmed Nov 2026 (the leveling rig is laser-guided,
        // not GPS). TODO(charlie): "Fully licensed & insured" — see content/faqs.ts.
        lines: [
          "Excavators & bulldozers",
          "Dump trucks & haul trailers",
          "Laser-guided land leveling",
          "Heavy-duty bushhogs",
          "Skid steers & compact loaders",
          "Fully licensed & insured",
        ],
      },
    },
    faq: {
      heading: "FREQUENTLY ASKED [QUESTIONS]",
      lede: "Quick answers to what folks usually want to know before calling",
    },
  },

  // ── The quote form ────────────────────────────────────────────────
  form: {
    heading: "REQUEST A [QUOTE]",
    lede: "Fill out the form below and we'll get back to you within 24 hours.",
    labels: {
      name: "Full Name *",
      email: "Email Address *",
      phone: "Phone Number *",
      service: "Service Needed *",
      timeline: "When Do You Need Service? *",
      location: "Project Location",
      message: "Additional Details",
    },
    placeholders: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "(337) 123-4567",
      service: "Select a service...",
      timeline: "Select timeline...",
      location: "City or Parish",
      message: "Tell us about your project, access, and any specific requirements...",
    },
    submit: "SUBMIT REQUEST",
    sending: "SENDING…",
    sendingStatus: "Sending your request…",
    disclaimer: "We'll review your request and contact you within 24 hours",
    success: "Thanks — we got your request and will be in touch within 24 hours. For emergencies, call {phone}.",
    errors: {
      invalidName: "Please enter your name.",
      invalidEmail: "Please enter a valid email address.",
      invalidPhone: "Please enter a 10-digit phone number, like {phone}.",
      noLinks: "Please leave links out of the details. Describe the project, or call us at {phone}.",
      invalidSelection: "Please choose a service and a timeline from the lists.",
      tooFast: "That was quick! Please check your details and press Submit again.",
      rateLimited: "You've sent a few requests already. Please wait a little, or call us at {phone}.",
      /** Unconfigured, rejected, or any failure where nothing was sent. */
      notSent:
        "Something went wrong sending your request. Please call us at {phone} or email {email} — we don't want to lose it.",
      network: "Network error — please check your connection and try again, or call us at {phone}.",
    },
    /** Subject and sender name on the notification email. Verbatim. */
    emailSubject: "New Quote Request — Coastal Construction Website",
    emailFromName: "Coastal Construction Website",
    /** First line of the plain-text email body the office receives. */
    emailIntro: "New quote request from the Coastal Construction website",
    locationFallback: "Not specified",
    messageFallback: "(none provided)",
  },

  // ── 404 ───────────────────────────────────────────────────────────
  notFound: {
    heading: "4[0]4",
    body: "That page got cleared off the lot. Let's get you back on solid ground.",
    ctaHeading: "WHERE TO NEXT?",
    ctaBody: "Here are the pages most folks are looking for",
    home: "Back to Home",
    services: "View Services",
    quote: "Request a Quote",
  },
} as const;

export type BookingEvent = {
  /** Event-type slug: cal.com/<account>/<id>. */
  id: string;
  /** The button's text. */
  label: string;
  layout: "month_view" | "week_view" | "column_view";
};

export type BookingConfig =
  | { provider: "none" }
  | {
      provider: "calcom" | "calendly";
      account: string;
      events: BookingEvent[];
      brandColor: string;
    };

export type ClientConfig = typeof client;
