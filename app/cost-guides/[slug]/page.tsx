import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, DraftNotice, emphasize, LinkGrid } from "@/components/content/ContentParts";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { costGuide, costGuides } from "@/content/costGuides";
import { services } from "@/content/services";
import { contentMetadata } from "@/lib/seo";

type Props = { params: { slug: string } };

export const dynamicParams = false;
export const generateStaticParams = () => costGuides.map(({ slug }) => ({ slug }));

export function generateMetadata({ params }: Props): Metadata {
  const c = costGuide(params.slug);
  if (!c) return {};
  return contentMetadata({ title: c.seoTitle, description: c.seoDescription, path: `/cost-guides/${c.slug}`, draft: !c.published });
}

export default function CostGuidePage({ params }: Props) {
  const c = costGuide(params.slug);
  if (!c) notFound();
  const path = `/cost-guides/${c.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Cost Guides", path: "/cost-guides" },
    { name: c.title, path },
  ];
  const service = services.find((s) => s.slug === c.service);
  const cta = client.servicesPage.cta;
  return (
    <>
      <ContentSchema path={path} name={c.seoTitle} description={c.seoDescription} crumbs={crumbs} type="Article" />
      {!c.published && <DraftNotice>add the owner's real local price ranges before publishing.</DraftNotice>}
      <PageHeader heading={emphasize(c.title)} subtitle={c.intro} />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <section className="content-section">
            <h2>Typical Local Ranges</h2>
            <ul className="check-list">
              {c.priceRows.length ? (
                c.priceRows.map((row) => (
                  <li key={row.label}>
                    {row.label}: {row.range}
                  </li>
                ))
              ) : (
                <li>Owner price ranges go here.</li>
              )}
            </ul>
          </section>
          <section className="content-section">
            <h2>What Affects the Price</h2>
            <ul className="check-list">
              {c.factors.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
          {service && (
            <section className="content-section">
              <h2>Related Service</h2>
              <LinkGrid links={[{ href: `/services/${service.slug}`, label: service.name }]} />
            </section>
          )}
        </div>
      </div>
      <CtaBand dirtDivider="surface-950" heading={cta.heading} body={cta.body} primary={{ href: "/contact", label: cta.primary }} call={cta.call} />
    </>
  );
}
