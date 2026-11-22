import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, LinkGrid, QaList } from "@/components/content/ContentParts";
import { LandLookup } from "@/components/content/LandLookup";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { contentMetadata } from "@/lib/seo";

const title = "Check Your Land: Flood Zone & Soil Lookup | Coastal";
const description = "Enter a South Louisiana address to see its FEMA flood zone and USDA soil type, with plain answers on what each can mean for building or dirt work.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Check Your Land", path: "/check-your-land" },
];
const faqs = [
  { q: "What flood zone is my property in?", a: "Enter the address or GPS coordinates above to see the zone FEMA maps at that point. For an official determination, use the FEMA Map Service Center or ask your parish floodplain administrator." },
  { q: "What does flood zone AE mean?", a: "Zone AE is a high-risk Special Flood Hazard Area with at least a 1% chance of flooding each year and a mapped base flood elevation. Building there usually involves floodplain permits and elevation requirements." },
  { q: "What does flood zone X mean?", a: "Zone X is outside FEMA's high-risk flood areas. Some Zone X land has moderate risk and some has minimal risk, but heavy rain and poor drainage can still cause flooding." },
  { q: "How do I find out what kind of soil is on my land?", a: "This tool reads the USDA soil survey for one point. For a building, pad, or pond, a geotechnical or site-specific soil test gives information the survey cannot." },
  { q: "What is a hydric soil?", a: "A hydric soil formed under wet conditions and is one possible sign of wetlands. A hydric rating does not prove a property has regulated wetlands, and a non-hydric rating does not rule them out." },
  { q: "Why does the result say it is only for one point?", a: "Flood zones and soils can change across a property. A large or irregular tract can include several, so check more than one location and confirm the results before making a decision." },
  { q: "Can I check rural land without a street address?", a: "Yes. Enter GPS coordinates in latitude, longitude order, such as 30.2241, -92.0198. You can copy them from most phone map apps." },
];
const next = [
  { href: "/buying-land-checklist", label: "Buying Land Checklist", note: "What to check before you buy" },
  { href: "/guides/building-pad-flood-zone", label: "Building a Pad in a Flood Zone", note: "Answer guide" },
  { href: "/guides/do-i-need-a-wetlands-permit", label: "Do I Need a Wetlands Permit?", note: "Answer guide" },
];

export const metadata = contentMetadata({ title, description, path: "/check-your-land" });

export default function CheckYourLandPage() {
  const cta = client.servicesPage.cta;
  return (
    <>
      <ContentSchema path="/check-your-land" name={title} description={description} crumbs={crumbs} faqs={faqs} />
      <PageHeader heading="Check Your [Land]" subtitle="See the mapped flood zone and soil type for a South Louisiana property" />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <p className="content-lead">
            Flood risk and soil shape what a piece of land can handle. Start with the public FEMA and USDA records, then use them to ask better questions before you buy, build, or
            move dirt.
          </p>
          <section className="content-section">
            <h2>Look Up a Property</h2>
            <LandLookup />
          </section>
          <section className="content-section">
            <h2>Common Questions</h2>
            <QaList items={faqs} />
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
