/**
 * Structured data for search, one @graph per page.
 *
 * Every page carries the business (a GeneralContractor — schema.org's
 * HomeAndConstructionBusiness subtype for this trade), the website, and
 * the page itself, all linked by @id so search engines see one business.
 * Then, per page:
 *   /          —
 *   /services  each of the nine services, from content/services.ts
 *   /about     the founder
 *   /contact   the FAQ, from content/faqs.ts
 * Inner pages add a BreadcrumbList (structured data only; nothing
 * visible is added to the page).
 *
 * Built only from client.config.ts and content/ — nothing interpolated
 * from a URL, form or API — which is what makes dangerouslySetInnerHTML
 * safe here (scripts/csp.mjs relies on it). Reviews are deliberately
 * left out: see content/reviews.ts.
 */
import { client } from "@/client.config";
import { allParishes } from "@/content/serviceAreas";
import { faqs } from "@/content/faqs";
import { services } from "@/content/services";
import { fill, phoneSchema } from "@/lib/phone";

type PageKey = keyof typeof client.pages;

const PATHS: Record<PageKey, string> = { home: "/", services: "/services", about: "/about", contact: "/contact" };
const CRUMB: Record<PageKey, string> = { home: "Home", services: "Services", about: "About", contact: "Contact" };

function ld(data: object) {
  // `<` escaped so a string can never close the <script> element.
  return { __html: JSON.stringify(data).replace(/</g, "\u003c") };
}

export function JsonLd({ page }: { page: PageKey }) {
  const root = `${client.siteUrl}/`;
  const abs = (path: string) => (path === "/" ? root : `${client.siteUrl}${path}`);
  const url = abs(PATHS[page]);
  const ids = { business: `${root}#business`, website: `${root}#website`, page: `${url}#webpage`, founder: `${root}#founder` };
  const meta = client.pages[page];

  const business = {
    "@type": "GeneralContractor",
    "@id": ids.business,
    name: client.businessName,
    url: root,
    image: [abs(client.ogImage.path), abs("/images/hero-dirt-work-960.webp")],
    logo: abs("/icon-512.png"),
    telephone: phoneSchema,
    email: client.email,
    priceRange: "$$",
    description: client.schemaDescription,
    foundingDate: String(client.foundingYear),
    founder: { "@id": ids.founder },
    address: {
      "@type": "PostalAddress",
      addressLocality: client.address.city,
      addressRegion: client.address.region,
      addressCountry: client.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: client.geo.latitude, longitude: client.geo.longitude },
    areaServed: allParishes.map((name) => ({ "@type": "AdministrativeArea", name: `${name}, Louisiana` })),
    openingHoursSpecification: client.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dirt Work Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: `${abs("/services")}#${s.slug}` },
      })),
    },
    ...(Object.values(client.socials).some(Boolean) ? { sameAs: Object.values(client.socials).filter(Boolean) } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": ids.website,
    url: root,
    name: client.businessName,
    inLanguage: "en-US",
    publisher: { "@id": ids.business },
  };

  const webpage = {
    "@type": page === "about" ? "AboutPage" : page === "contact" ? "ContactPage" : "WebPage",
    "@id": ids.page,
    url,
    name: fill(meta.title),
    description: fill(meta.description),
    inLanguage: "en-US",
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.business },
    ...(page !== "home"
      ? {
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: CRUMB.home, item: root },
              { "@type": "ListItem", position: 2, name: CRUMB[page], item: url },
            ],
          },
        }
      : {}),
  };

  const extras: object[] = [];
  if (page === "services") {
    for (const s of services) {
      extras.push({
        "@type": "Service",
        "@id": `${url}#${s.slug}`,
        name: s.schema.name,
        serviceType: s.name,
        description: s.schema.description,
        provider: { "@id": ids.business },
        areaServed: { "@type": "State", name: "Louisiana" },
        url: `${url}#${s.slug}`,
        image: abs(`/images/${s.photo}-960.webp`),
      });
    }
  }
  {
    // The founder, on every page: the business node points to this entry.
    extras.push({
      "@type": "Person",
      "@id": ids.founder,
      name: client.owner.name,
      jobTitle: client.owner.title,
      worksFor: { "@id": ids.business },
    });
  }
  if (page === "contact") {
    extras.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      isPartOf: { "@id": ids.page },
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }

  const graph = { "@context": "https://schema.org", "@graph": [business, website, webpage, ...extras] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={ld(graph)} />;
}
