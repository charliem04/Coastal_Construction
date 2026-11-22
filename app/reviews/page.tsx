import { client } from "@/client.config";
import { Breadcrumbs, ContentSchema, DraftNotice } from "@/components/content/ContentParts";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { reviews } from "@/content/reviews";
import { contentMetadata } from "@/lib/seo";

const title = "Customer Reviews | Coastal Construction";
const description = "Read real customer reviews of Coastal Construction Services of Louisiana for dirt work, drainage, land clearing, and site preparation in Acadiana.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Reviews", path: "/reviews" },
];
const draft = reviews.length === 0;
const slots = ["Review one", "Review two", "Review three"];

export const metadata = contentMetadata({ title, description, path: "/reviews", draft });

/**
 * Publishes itself once content/reviews.ts holds real Google reviews.
 * Do not add a rating or review schema until those reviews and their
 * Google attribution are in place.
 */
export default function ReviewsPage() {
  const cta = client.servicesPage.cta;
  return (
    <>
      <ContentSchema path="/reviews" name={title} description={description} crumbs={crumbs} />
      {draft && <DraftNotice>this page stays hidden until real Google reviews are added.</DraftNotice>}
      <PageHeader heading="Customer [Reviews]" subtitle="What customers say about working with Coastal Construction" />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap review-grid">
          {draft
            ? slots.map((slot) => (
                <figure key={slot}>
                  <blockquote>Real customer review text will appear here.</blockquote>
                  <figcaption>{slot}</figcaption>
                </figure>
              ))
            : reviews.map((r) => (
                <figure key={`${r.author}-${r.quote}`}>
                  <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
                  <figcaption>{r.author}</figcaption>
                </figure>
              ))}
        </div>
      </div>
      <CtaBand dirtDivider="surface-950" heading={cta.heading} body={cta.body} primary={{ href: "/contact", label: cta.primary }} call={cta.call} />
    </>
  );
}
