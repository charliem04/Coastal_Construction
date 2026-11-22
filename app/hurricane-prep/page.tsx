import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, LinkGrid, QaList } from "@/components/content/ContentParts";
import { TropicalPanel } from "@/components/content/TropicalPanel";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { contentMetadata } from "@/lib/seo";

const title = "Hurricane Prep for Louisiana Property | Coastal";
const description = "Track the Atlantic tropical outlook, prepare your land and job site before a storm, and handle debris, drainage, and ground damage safely afterward.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Weather", path: "/weather" },
  { name: "Hurricane Prep", path: "/hurricane-prep" },
];
const before = [
  "Clear leaves, limbs, and trash from ditches, culverts, and yard drains.",
  "Trim dead limbs well before a storm is in the forecast.",
  "Secure or move loose items, fuel containers, and materials.",
  "Photograph your property, driveways, fences, and drainage for insurance records.",
  "Know your evacuation zone and route.",
  "Mark culverts, wells, septic parts, and other hazards that debris could hide.",
];
const threat = [
  "Follow official watches, warnings, and evacuation orders first.",
  "Stop non-urgent site work early enough to leave safely.",
  "Stabilize open excavations and keep people away from them.",
  "Move equipment to higher, open ground away from trees and drainage paths.",
  "Secure stockpiles, silt fence, and loose job-site materials.",
  "Do not start grading or clearing that leaves ground exposed before the storm.",
];
const after = [
  "Wait until officials say it is safe to return.",
  "Treat every downed line as live and report it to the utility.",
  "Never walk or drive through floodwater.",
  "Photograph damage before cleanup when it is safe.",
  "Keep equipment off saturated ground that can rut or give way.",
  "Check for washouts near driveways, culverts, and pond banks.",
  "Follow parish instructions for sorting and placing storm debris.",
  "Use qualified help for trees on structures or near power lines.",
];
const faqs = [
  { q: "When is Atlantic hurricane season?", a: "The Atlantic hurricane season runs from June 1 through November 30. Storms can occasionally form outside those dates, so check the National Hurricane Center when the weather looks unsettled." },
  { q: "How should I prepare my land for a hurricane?", a: "Clear drainage paths, remove dead limbs, secure loose items, document the property, and know your evacuation route. Do the larger work well before a storm is in the forecast." },
  { q: "Should I clean my ditches before a storm?", a: "Yes, when it is safe and you are responsible for them. Removing debris helps water move, but stop as conditions worsen and contact the parish about public drainage problems." },
  { q: "What should I do with storm debris?", a: "Follow your parish's debris instructions. Many programs require separating vegetation, construction debris, appliances, and hazardous materials, and keeping piles clear of lines, hydrants, and drains." },
  { q: "How soon can dirt work start after a hurricane?", a: "Work can restart when the site is safe and the ground can carry equipment. Saturated soil may take much longer to recover than the sky takes to clear." },
  { q: "What is the difference between a hurricane watch and warning?", a: "A watch means hurricane conditions are possible within the area, generally within 48 hours. A warning means those conditions are expected, generally within 36 hours." },
];
const next = [
  { href: "/guides/hurricane-season-dirt-work", label: "Hurricane Season and Dirt Work", note: "Answer guide" },
  { href: "/guides/protect-job-site-from-rain", label: "Protect a Job Site From Rain", note: "Answer guide" },
  { href: "/weather", label: "Acadiana Radar", note: "Live weather" },
];
const sources = [
  { label: "National Hurricane Center", url: "https://www.nhc.noaa.gov/" },
  { label: "NWS Lake Charles", url: "https://www.weather.gov/lch/" },
  { label: "Ready.gov Hurricane Safety", url: "https://www.ready.gov/hurricanes" },
];

export const metadata = contentMetadata({ title, description, path: "/hurricane-prep" });

function Steps({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function HurricanePrepPage() {
  const cta = client.servicesPage.cta;
  return (
    <>
      <ContentSchema path="/hurricane-prep" name={title} description={description} crumbs={crumbs} faqs={faqs} />
      <PageHeader heading="Hurricane [Prep]" subtitle="Protect your land and job site before, during, and after a storm" />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <p className="content-lead">
            Storm damage on a property often starts with water that has nowhere to go. Prepare drainage and loose materials early, then let safety and ground conditions set the pace
            afterward.
          </p>
          <section className="content-section">
            <h2>Atlantic Tropical Outlook</h2>
            <TropicalPanel />
          </section>
          <section className="content-section">
            <h2>Before Hurricane Season</h2>
            <Steps items={before} />
          </section>
          <section className="content-section">
            <h2>When a Storm Is Threatening</h2>
            <Steps items={threat} />
          </section>
          <section className="content-section">
            <h2>After the Storm</h2>
            <Steps items={after} />
          </section>
          <section className="content-section">
            <h2>Common Questions</h2>
            <QaList items={faqs} />
          </section>
          <section className="content-section">
            <h2>Keep Planning</h2>
            <LinkGrid links={next} />
          </section>
          <section className="content-section">
            <h2>Sources</h2>
            <ul className="source-list">
              {sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      <CtaBand dirtDivider="surface-950" heading={cta.heading} body={cta.body} primary={{ href: "/contact", label: cta.primary }} call={cta.call} />
    </>
  );
}
