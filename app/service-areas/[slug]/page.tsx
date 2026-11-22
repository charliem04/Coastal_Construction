import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, DraftNotice, emphasize, LinkGrid } from "@/components/content/ContentParts";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { parish, parishes } from "@/content/parishes";
import { projectStudies } from "@/content/projects";
import { services } from "@/content/services";
import { contentMetadata } from "@/lib/seo";

type Props = { params: { slug: string } };

export const dynamicParams = false;
export const generateStaticParams = () => parishes.map(({ slug }) => ({ slug }));

export function generateMetadata({ params }: Props): Metadata {
  const p = parish(params.slug);
  if (!p) return {};
  return contentMetadata({ title: p.seoTitle, description: p.seoDescription, path: `/service-areas/${p.slug}`, draft: !p.published });
}

function DetailList({ title, items, fallback }: { title: string; items: string[]; fallback: string }) {
  return (
    <section className="content-section">
      <h2>{title}</h2>
      <ul className="check-list">
        {(items.length ? items : [fallback]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function ParishPage({ params }: Props) {
  const p = parish(params.slug);
  if (!p) notFound();
  const path = `/service-areas/${p.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Service Areas", path: "/service-areas" },
    { name: p.name, path },
  ];
  const projects = projectStudies.filter((x) => x.published && p.projectSlugs.includes(x.slug));
  const cta = client.servicesPage.cta;
  return (
    <>
      <ContentSchema path={path} name={p.seoTitle} description={p.seoDescription} crumbs={crumbs} />
      {!p.published && <DraftNotice>add real local details and projects before publishing.</DraftNotice>}
      <PageHeader heading={emphasize(`Dirt Work in ${p.name}`)} subtitle={`Serving ${p.seat} and communities across ${p.name}`} />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <p className="content-lead">{p.intro}</p>
          <DetailList title="Local Site Conditions" items={p.conditions} fallback="Owner to add real soil, drainage, and access conditions." />
          <DetailList title="Common Jobs Here" items={p.commonJobs} fallback="Owner to add the work most often requested in this parish." />
          <DetailList title="Permits and Local Offices" items={p.permitNotes} fallback="Add verified parish permit contacts and notes." />
          <section className="content-section">
            <h2>Recent Projects</h2>
            {projects.length ? (
              <LinkGrid links={projects.map((x) => ({ href: `/projects/${x.slug}`, label: x.title }))} />
            ) : (
              <ul className="check-list">
                <li>Link real projects from this parish.</li>
              </ul>
            )}
          </section>
          <section className="content-section">
            <h2>Services in {p.name}</h2>
            <LinkGrid links={services.map((s) => ({ href: `/services/${s.slug}`, label: s.name }))} />
          </section>
        </div>
      </div>
      <CtaBand dirtDivider="surface-950" heading={cta.heading} body={cta.body} primary={{ href: "/contact", label: cta.primary }} call={cta.call} />
    </>
  );
}
