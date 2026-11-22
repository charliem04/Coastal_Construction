import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, DraftNotice, LinkGrid } from "@/components/content/ContentParts";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { calculators } from "@/content/calculators";
import { contentMetadata } from "@/lib/seo";

const title = "Dirt Work Calculators for Louisiana | Coastal";
const description = "Free calculators for estimating fill dirt, raised house pads, and pond volume before you plan a dirt work project in South Louisiana.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Calculators", path: "/calculators" },
];
const live = calculators.filter((c) => c.published);
const draft = live.length === 0;
const shown = draft ? calculators : live;

export const metadata = contentMetadata({ title, description, path: "/calculators", draft });

export default function CalculatorsPage() {
  const cta = client.servicesPage.cta;
  return (
    <>
      <ContentSchema path="/calculators" name={title} description={description} crumbs={crumbs} type="CollectionPage" />
      <PageHeader heading="Dirt Work [Calculators]" subtitle="Quick volume estimates for planning your project" />
      {draft && <DraftNotice>these calculators stay hidden until the owner approves them.</DraftNotice>}
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <LinkGrid links={shown.map((c) => ({ href: `/calculators/${c.slug}`, label: c.title, note: c.intro }))} />
        </div>
      </div>
      <CtaBand dirtDivider="surface-950" heading={cta.heading} body={cta.body} primary={{ href: "/contact", label: cta.primary }} call={cta.call} />
    </>
  );
}
