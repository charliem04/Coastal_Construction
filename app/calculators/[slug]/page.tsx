import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, DraftNotice, emphasize, QaList } from "@/components/content/ContentParts";
import { VolumeCalculator } from "@/components/content/VolumeCalculator";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { calculator, calculators } from "@/content/calculators";
import { contentMetadata } from "@/lib/seo";

type Props = { params: { slug: string } };

export const dynamicParams = false;
export const generateStaticParams = () => calculators.map(({ slug }) => ({ slug }));

export function generateMetadata({ params }: Props): Metadata {
  const c = calculator(params.slug);
  if (!c) return {};
  return contentMetadata({ title: c.seoTitle, description: c.seoDescription, path: `/calculators/${c.slug}`, draft: !c.published });
}

export default function CalculatorPage({ params }: Props) {
  const c = calculator(params.slug);
  if (!c) notFound();
  const path = `/calculators/${c.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/calculators" },
    { name: c.title, path },
  ];
  const cta = client.servicesPage.cta;
  return (
    <>
      <ContentSchema path={path} name={c.title} description={c.seoDescription} crumbs={crumbs} faqs={c.faqs} />
      <PageHeader heading={emphasize(c.title)} subtitle={c.intro} />
      {!c.published && <DraftNotice>this calculator stays hidden until the owner approves it.</DraftNotice>}
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <section className="content-section">
            <h2>Estimate Your Project</h2>
            <VolumeCalculator kind={c.kind} fields={c.fields} resultLabel={c.resultLabel} />
            <p className="guide-note calc-note">{c.note}</p>
          </section>
          <section className="content-section">
            <h2>Common Questions</h2>
            <QaList items={c.faqs} />
            <p className="guide-hub-link">
              <Link href={c.service.href} prefetch={false}>
                See {c.service.label}
              </Link>
            </p>
          </section>
        </div>
      </div>
      <CtaBand dirtDivider="surface-950" heading={cta.heading} body={cta.body} primary={{ href: "/contact", label: cta.primary }} call={cta.call} />
    </>
  );
}
