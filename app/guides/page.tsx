import Link from "next/link";
import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, LinkGrid } from "@/components/content/ContentParts";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { guideCategories, guides } from "@/content/guides";
import { contentMetadata } from "@/lib/seo";

const title = "Dirt Work Answer Guides for Acadiana | Coastal";
const description = "Answers to common questions about house pads, fill dirt, drainage, culverts, ponds, levees, land clearing, bushhogging, demolition, and permits.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Guides", path: "/guides" },
];

const tools = [
  { href: "/check-your-land", label: "Check Your Land", note: "Flood zone and soil lookup" },
  { href: "/buying-land-checklist", label: "Buying Land Checklist", note: "What to check before you buy" },
  { href: "/hurricane-prep", label: "Hurricane Prep", note: "Live outlook and property checklist" },
];

export const metadata = contentMetadata({ title, description, path: "/guides" });

export default function GuidesPage() {
  const total = guides.reduce((sum, g) => sum + g.questions.length, 0);
  const cta = client.servicesPage.cta;
  return (
    <>
      <ContentSchema path="/guides" name={title} description={description} crumbs={crumbs} type="CollectionPage" />
      <PageHeader heading="Dirt Work [Answer Guides]" subtitle={`${total} common questions about land, drainage, and site work in South Louisiana`} />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <section className="guide-index">
            <h2>Free Property Tools</h2>
            <LinkGrid links={tools} />
          </section>
          {guideCategories.map((category) => (
            <section key={category} className="guide-index">
              <h2>{category}</h2>
              <LinkGrid
                links={guides
                  .filter((g) => g.category === category)
                  .map((g) => ({ href: `/guides/${g.slug}`, label: g.title, note: `${g.questions.length} answers` }))}
              />
              {category === "Weather & Wet Ground" && (
                <p className="guide-hub-link">
                  <Link href="/weather" prefetch={false}>
                    Check Acadiana radar and wet-weather planning
                  </Link>
                </p>
              )}
            </section>
          ))}
        </div>
      </div>
      <CtaBand dirtDivider="surface-950" heading={cta.heading} body={cta.body} primary={{ href: "/contact", label: cta.primary }} call={cta.call} />
    </>
  );
}
