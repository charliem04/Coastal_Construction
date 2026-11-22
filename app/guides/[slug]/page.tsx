import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, emphasize, LinkGrid } from "@/components/content/ContentParts";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { guide, guides } from "@/content/guides";
import { services } from "@/content/services";
import { contentMetadata } from "@/lib/seo";

type Props = { params: { slug: string } };

const anchor = (q: string) => q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const dynamicParams = false;
export const generateStaticParams = () => guides.map(({ slug }) => ({ slug }));

export function generateMetadata({ params }: Props): Metadata {
  const g = guide(params.slug);
  if (!g) return {};
  return contentMetadata({ title: g.seoTitle, description: g.seoDescription, path: `/guides/${g.slug}` });
}

export default function GuidePage({ params }: Props) {
  const g = guide(params.slug);
  if (!g) notFound();
  const path = `/guides/${g.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: g.title, path },
  ];
  const relatedServices = services
    .filter((s) => g.services.includes(s.slug))
    .map((s) => ({ href: `/services/${s.slug}`, label: s.name }));
  const moreGuides = guides
    .filter((x) => x.slug !== g.slug && x.category === g.category)
    .map((x) => ({ href: `/guides/${x.slug}`, label: x.title }));
  const cta = client.servicesPage.cta;

  return (
    <>
      <ContentSchema path={path} name={g.title} description={g.seoDescription} crumbs={crumbs} type="Article" faqs={g.questions} />
      <PageHeader heading={emphasize(g.title)} subtitle={g.intro} />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap guide-layout">
          <nav className="guide-toc" aria-label="Questions in this guide">
            <p>In this guide</p>
            <ol>
              {g.questions.map((item) => (
                <li key={item.q}>
                  <a href={`#${anchor(item.q)}`}>{item.q}</a>
                </li>
              ))}
            </ol>
          </nav>
          <article>
            <p className="guide-note">
              General information for South Louisiana property owners. Rules and site conditions vary, so confirm permit, legal, and
              engineering requirements with the appropriate office or professional.
            </p>
            {g.questions.map((item) => (
              <section key={item.q} id={anchor(item.q)} className="guide-question">
                <h2>{item.q}</h2>
                <p>{item.a}</p>
              </section>
            ))}
            <section className="content-section">
              <h2>Related Services</h2>
              <LinkGrid links={relatedServices} />
            </section>
            {moreGuides.length > 0 && (
              <section className="content-section">
                <h2>More {g.category} Guides</h2>
                <LinkGrid links={moreGuides} />
              </section>
            )}
            <section className="content-section">
              <h2>Sources</h2>
              <ul className="source-list">
                {g.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      </div>
      <CtaBand dirtDivider="surface-950" heading={cta.heading} body={cta.body} primary={{ href: "/contact", label: cta.primary }} call={cta.call} />
    </>
  );
}
