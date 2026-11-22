import Link from "next/link";
import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, LinkGrid, QaList } from "@/components/content/ContentParts";
import { LandChecklist } from "@/components/content/LandChecklist";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { checklistFaqs, landChecklist } from "@/content/landChecklist";
import { contentMetadata } from "@/lib/seo";

const title = "Buying Land in Louisiana: Checklist | Coastal";
const description = "A practical checklist for buying land in South Louisiana, covering flood risk, drainage, soil, access, wetlands, utilities, clearing, and site work.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Buying Land Checklist", path: "/buying-land-checklist" },
];
const next = [
  { href: "/check-your-land", label: "Check Your Land", note: "Flood zone and soil lookup" },
  { href: "/services/pasture-clearing", label: "Land Clearing", note: "Service" },
  { href: "/services/site-pads", label: "Site Pads", note: "Service" },
];

export const metadata = contentMetadata({ title, description, path: "/buying-land-checklist" });

export default function BuyingLandChecklistPage() {
  const cta = client.servicesPage.cta;
  return (
    <>
      <ContentSchema path="/buying-land-checklist" name={title} description={description} crumbs={crumbs} type="Article" faqs={checklistFaqs} />
      <PageHeader heading="Buying Land [Checklist]" subtitle="What to check before you buy property in South Louisiana" />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <p className="content-lead">
            A good price can hide a hard piece of land. Use this list to spot water, access, and site problems while you still have room to ask questions.
          </p>
          <p className="guide-note">
            General information only. Confirm legal, title, permit, insurance, and engineering questions with the appropriate office or professional.{" "}
            <Link href="/check-your-land" prefetch={false}>
              Start with a flood and soil lookup
            </Link>
            .
          </p>
          <section className="content-section">
            <h2>Your Land Checklist</h2>
            <LandChecklist groups={landChecklist} />
          </section>
          <section className="content-section">
            <h2>Common Questions</h2>
            <QaList items={checklistFaqs} />
          </section>
          <section className="content-section">
            <h2>Keep Planning</h2>
            <LinkGrid links={next} />
          </section>
        </div>
      </div>
      <CtaBand dirtDivider="surface-950" heading={cta.heading} body={cta.body} primary={{ href: "/contact", label: cta.primary }} call={cta.call} />
    </>
  );
}
