import Link from "next/link";
import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, LinkGrid } from "@/components/content/ContentParts";
import { ConditionsRail } from "@/components/content/ConditionsRail";
import { RadarPanel } from "@/components/content/RadarPanel";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { guides } from "@/content/guides";
import { contentMetadata } from "@/lib/seo";

const title = "Rain, Radar & Dirt Work in Acadiana | Coastal";
const description = "Check Acadiana radar and learn how rain, wet clay, and hurricane season affect grading, house pads, ponds, land clearing, and project schedules.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Weather", path: "/weather" },
];
const effects = [
  "Saturated ground can rut under equipment and damage finished grade.",
  "Fill that is too wet will not compact to a stable surface.",
  "Soft access can stop dump trucks before it stops tracked machines.",
  "Open excavations need inspection after rain before anyone re-enters.",
  "Low, shaded areas can stay wet after the rest of the site dries.",
  "A sunny forecast does not mean the ground is ready to work.",
];

export const metadata = contentMetadata({ title, description, path: "/weather" });

export default function WeatherPage() {
  const weatherGuides = guides
    .filter((g) => g.category === "Weather & Wet Ground")
    .map((g) => ({ href: `/guides/${g.slug}`, label: g.title, note: `${g.questions.length} answers` }));
  const cta = client.servicesPage.cta;
  return (
    <>
      <ContentSchema path="/weather" name={title} description={description} crumbs={crumbs} type="CollectionPage" />
      <PageHeader heading="Weather and [Dirt Work]" subtitle="Why the ground, not just the sky, sets the schedule in South Louisiana" />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <p className="content-lead">
            Rain can stop dirt work long after the clouds clear. Acadiana&apos;s clay holds water, so a job restarts when the ground can
            safely carry equipment and hold a finished grade.
          </p>
          <section className="content-section">
            <h2>Current Radar</h2>
            <div className="radar-layout">
              <RadarPanel />
              <ConditionsRail />
            </div>
          </section>
          <section className="content-section">
            <h2>What Wet Weather Changes</h2>
            <ul className="check-list">
              {effects.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </section>
          <section className="content-section">
            <h2>Weather Guides</h2>
            <LinkGrid links={weatherGuides} />
            <p className="guide-hub-link">
              <Link href="/hurricane-prep" prefetch={false}>
                See the tropical outlook and hurricane prep checklist
              </Link>
            </p>
          </section>
        </div>
      </div>
      <CtaBand dirtDivider="surface-950" heading={cta.heading} body={cta.body} primary={{ href: "/contact", label: cta.primary }} call={cta.call} />
    </>
  );
}
