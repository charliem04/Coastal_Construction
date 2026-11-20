/**
 * The contact page's "Frequently Asked Questions", moved verbatim from
 * contact.html (the visible cards and its FAQPage JSON-LD matched word
 * for word). Rendered on the page and as FAQPage structured data from
 * this one list, so the two can't drift.
 *
 * TODO(charlie): "Are you licensed and insured?" answers "Yes — we're
 * fully licensed and insured". The same claim is on the contact page's
 * "What to expect" and "Equipment & capabilities" cards and in the
 * services page's meta description. Confirm the license (Louisiana
 * State Licensing Board for Contractors, if commercial jobs run over
 * $50k) and the insurance with the owner — an unverifiable credential
 * on a contractor's site is the one claim that can't be wrong. If it's
 * confirmed, adding the license number to the page is worth doing.
 */
import type { Faq } from "./types";

export const faqs: Faq[] = [
  {
    q: "Do you charge for estimates?",
    a: "No — all project estimates are free. We'll come out, look at the site, and give you a written quote at no cost.",
  },
  {
    q: "What parishes do you serve?",
    a: "Our primary service area is Iberia, Lafayette, Acadia, Vermilion, and St. Martin parishes. We also handle projects in St. Landry, Evangeline, Jeff Davis, and St. Mary parishes — call to confirm we cover your location.",
  },
  {
    q: "How quickly can you start a project?",
    a: "It depends on the season and our current workload, but most projects can be scheduled within 1–3 weeks of an accepted quote. Emergency situations are handled as quickly as we can get equipment on site.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes — we're fully licensed and insured for all the dirt work services we provide. Documentation is available on request.",
  },
  {
    q: "Do I need a permit for my project?",
    a: "It depends on the parish, the scope of work, and whether you're near drainage or in a regulated zone. Ponds, levees, and culverts often require permits. We can guide you on what's typically needed, but you'll need to check with your parish for the final word.",
  },
  {
    q: "How is pricing determined?",
    a: "Most jobs are priced based on scope, access, material volume, and equipment time. We give you a written estimate before any work starts so there are no surprises.",
  },
  {
    q: "Do you handle small residential jobs or only commercial?",
    a: "Both. We do everything from a single residential pad or driveway culvert to large commercial site prep. No job is too small.",
  },
];
