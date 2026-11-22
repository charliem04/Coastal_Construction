import Link from "next/link";
import { abs, ld, siteNodes } from "@/components/JsonLd";
import type { Qa } from "@/content/types";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((c, i) => (
          <li key={c.path}>
            {i === crumbs.length - 1 ? (
              <span aria-current="page">{c.name}</span>
            ) : (
              <Link href={c.path} prefetch={false}>
                {c.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function DraftNotice({ children }: { children: string }) {
  return (
    <p className="draft-notice" role="status">
      Draft preview: {children}
    </p>
  );
}

export function QaList({ items }: { items: Qa[] }) {
  return (
    <div className="qa-list">
      {items.map((f) => (
        <div key={f.q} className="qa-item">
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
    </div>
  );
}

export function LinkGrid({ links }: { links: { href: string; label: string; note?: string }[] }) {
  return (
    <ul className="link-grid">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} prefetch={false} className="link-card">
            {l.label}
            {l.note && <small>{l.note}</small>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Structured data for a content page, built only from local content files. */
export function ContentSchema({
  path,
  name,
  description,
  crumbs,
  type = "WebPage",
  faqs,
  service,
}: {
  path: string;
  name: string;
  description: string;
  crumbs: Crumb[];
  type?: "WebPage" | "Article" | "CollectionPage";
  faqs?: Qa[];
  service?: { name: string; serviceType: string; description: string; image: string };
}) {
  const { business, website, founder, ids } = siteNodes();
  const url = abs(path);
  const pageId = `${url}#webpage`;
  const page = {
    "@type": type,
    "@id": pageId,
    url,
    name,
    ...(type === "Article" ? { headline: name, author: { "@id": ids.business }, publisher: { "@id": ids.business } } : {}),
    description,
    inLanguage: "en-US",
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.business },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
    },
  };
  const extras: object[] = [];
  if (service) {
    extras.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: service.name,
      serviceType: service.serviceType,
      description: service.description,
      provider: { "@id": ids.business },
      areaServed: business.areaServed,
      url,
      image: abs(service.image),
    });
  }
  if (faqs?.length) {
    extras.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      isPartOf: { "@id": pageId },
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  const graph = { "@context": "https://schema.org", "@graph": [business, website, founder, page, ...extras] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={ld(graph)} />;
}

export const emphasize = (text: string) => {
  const words = text.split(" ");
  const last = words.pop();
  return [...words, `[${last}]`].join(" ");
};
