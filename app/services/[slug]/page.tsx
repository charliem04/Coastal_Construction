import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, emphasize, LinkGrid, QaList } from "@/components/content/ContentParts";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { guide } from "@/content/guides";
import { serviceDetail, serviceDetails } from "@/content/serviceDetails";
import { services } from "@/content/services";
import { toolsForService } from "@/content/tools";
import { photo } from "@/lib/photo";
import { contentMetadata } from "@/lib/seo";

type Props = { params: { slug: string } };

export const dynamicParams = false;
export const generateStaticParams = () => serviceDetails.map(({ slug }) => ({ slug }));

export function generateMetadata({ params }: Props): Metadata {
  const d = serviceDetail(params.slug);
  if (!d) return {};
  return contentMetadata({ title: d.seoTitle, description: d.seoDescription, path: `/services/${d.slug}` });
}

export default function ServicePage({ params }: Props) {
  const s = services.find((x) => x.slug === params.slug);
  const d = serviceDetail(params.slug);
  if (!s || !d) notFound();
  const path = `/services/${s.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: s.name, path },
  ];
  const related = d.guides.flatMap((slug) => {
    const g = guide(slug);
    return g ? [{ href: `/guides/${g.slug}`, label: g.title }] : [];
  });
  const others = services.filter((x) => x.slug !== s.slug).map((x) => ({ href: `/services/${x.slug}`, label: x.name }));
  const cta = client.servicesPage.cta;

  return (
    <>
      <ContentSchema
        path={path}
        name={d.seoTitle}
        description={d.seoDescription}
        crumbs={crumbs}
        faqs={d.faqs}
        service={{ name: s.schema.name, serviceType: s.name, description: s.schema.description, image: `/images/${s.photo}-960.webp` }}
      />
      <PageHeader heading={emphasize(`${s.name} in Acadiana`)} subtitle={s.blurb} />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <p className="content-lead">{d.lead}</p>
          <div className="content-split">
            <Image {...photo(s.photo)} alt={s.alt.detail} sizes="(max-width: 968px) 100vw, 590px" priority />
            <div className="content-prose">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <section className="content-section">
            <h2>What We Offer</h2>
            <ul className="check-list">
              {s.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
          <section className="content-section">
            <h2>When You May Need This</h2>
            <ul className="check-list">
              {d.needs.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>
          <section className="content-section">
            <h2>How the Work Goes</h2>
            <ol className="step-list">
              {d.steps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </section>
          <section className="content-section">
            <h2>Before You Start</h2>
            <ul className="check-list">
              {d.planning.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
          <section className="content-section">
            <h2>{s.name} Questions</h2>
            <QaList items={d.faqs} />
          </section>
          <section className="content-section">
            <h2>Plan Your Project</h2>
            <LinkGrid links={toolsForService(s.slug)} />
          </section>
          <section className="content-section">
            <h2>Helpful Guides</h2>
            <LinkGrid links={related} />
          </section>
          <section className="content-section">
            <h2>Other Services</h2>
            <LinkGrid links={others} />
          </section>
        </div>
      </div>
      <CtaBand dirtDivider="surface-950" heading={cta.heading} body={cta.body} primary={{ href: "/contact", label: cta.primary }} call={cta.call} />
    </>
  );
}
