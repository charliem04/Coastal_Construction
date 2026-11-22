import { Breadcrumbs, ContentSchema, DraftNotice, LinkGrid } from "@/components/content/ContentParts";
import { PageHeader } from "@/components/PageHeader";
import { parishes } from "@/content/parishes";
import { contentMetadata } from "@/lib/seo";

const title = "Service Areas in Acadiana | Coastal Construction";
const description = "Find dirt work, drainage, pond, land clearing, and demolition services by parish across Iberia, Lafayette, Acadia, Vermilion, and St. Martin.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Service Areas", path: "/service-areas" },
];
const live = parishes.filter((p) => p.published);
const draft = live.length === 0;
const shown = draft ? parishes : live;

export const metadata = contentMetadata({ title, description, path: "/service-areas", draft });

export default function ServiceAreasPage() {
  return (
    <>
      <ContentSchema path="/service-areas" name={title} description={description} crumbs={crumbs} type="CollectionPage" />
      {draft && <DraftNotice>publish a parish in content/parishes.ts to make this page live.</DraftNotice>}
      <PageHeader heading="Our Service [Areas]" subtitle="Dirt work across Acadiana and surrounding parishes" />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <LinkGrid links={shown.map((p) => ({ href: `/service-areas/${p.slug}`, label: p.name, note: p.seat }))} />
        </div>
      </div>
    </>
  );
}
