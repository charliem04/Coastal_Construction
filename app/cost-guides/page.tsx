import { Breadcrumbs, ContentSchema, DraftNotice, LinkGrid } from "@/components/content/ContentParts";
import { PageHeader } from "@/components/PageHeader";
import { costGuides } from "@/content/costGuides";
import { contentMetadata } from "@/lib/seo";

const title = "Dirt Work Cost Guides for Acadiana | Coastal";
const description = "What affects the cost of house pads, culverts, land clearing, ponds, bushhogging, fill delivery, and demolition across Acadiana.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Cost Guides", path: "/cost-guides" },
];
const live = costGuides.filter((c) => c.published);
const draft = live.length === 0;
const shown = draft ? costGuides : live;

export const metadata = contentMetadata({ title, description, path: "/cost-guides", draft });

export default function CostGuidesPage() {
  return (
    <>
      <ContentSchema path="/cost-guides" name={title} description={description} crumbs={crumbs} type="CollectionPage" />
      {draft && <DraftNotice>add the owner's real price ranges in content/costGuides.ts.</DraftNotice>}
      <PageHeader heading="Dirt Work [Cost Guides]" subtitle="What shapes the price of common jobs in Acadiana" />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <LinkGrid links={shown.map((c) => ({ href: `/cost-guides/${c.slug}`, label: c.title }))} />
        </div>
      </div>
    </>
  );
}
