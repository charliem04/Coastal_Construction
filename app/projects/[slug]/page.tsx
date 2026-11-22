import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, DraftNotice, emphasize, LinkGrid } from "@/components/content/ContentParts";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { projectStudies, projectStudy } from "@/content/projects";
import { services } from "@/content/services";
import { photo } from "@/lib/photo";
import { contentMetadata } from "@/lib/seo";

type Props = { params: { slug: string } };

export const dynamicParams = false;
export const generateStaticParams = () => projectStudies.map(({ slug }) => ({ slug }));

export function generateMetadata({ params }: Props): Metadata {
  const p = projectStudy(params.slug);
  if (!p) return {};
  return contentMetadata({ title: p.seoTitle, description: p.seoDescription, path: `/projects/${p.slug}`, draft: !p.published });
}

export default function ProjectPage({ params }: Props) {
  const p = projectStudy(params.slug);
  if (!p) notFound();
  const path = `/projects/${p.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: p.title, path },
  ];
  const service = services.find((s) => s.slug === p.service);
  const cta = client.servicesPage.cta;
  return (
    <>
      <ContentSchema path={path} name={p.seoTitle} description={p.seoDescription} crumbs={crumbs} type="Article" />
      {!p.published && <DraftNotice>this sample shows the layout for a real project.</DraftNotice>}
      <PageHeader heading={emphasize(p.title)} subtitle={p.location} />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <div className="content-split">
            <figure>
              <Image {...photo(p.before)} alt={p.beforeAlt} sizes="(max-width: 968px) 100vw, 590px" />
              <figcaption className="mt-2 font-label uppercase text-gray-300">Before</figcaption>
            </figure>
            <figure>
              <Image {...photo(p.after)} alt={p.afterAlt} sizes="(max-width: 968px) 100vw, 590px" />
              <figcaption className="mt-2 font-label uppercase text-gray-300">After</figcaption>
            </figure>
          </div>
          <section className="content-section content-prose">
            <h2>The Problem</h2>
            <p>{p.problem}</p>
          </section>
          <section className="content-section content-prose">
            <h2>The Work</h2>
            <p>{p.work}</p>
          </section>
          <section className="content-section">
            <h2>Equipment</h2>
            <ul className="check-list">
              {p.equipment.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </section>
          <section className="content-section content-prose">
            <h2>The Result</h2>
            <p>{p.result}</p>
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
