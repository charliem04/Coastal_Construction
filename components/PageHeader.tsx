import { Highlight } from "./Highlight";

/** The dark gradient header on services, about, contact and 404. */
export function PageHeader({ heading, subtitle }: { heading: string; subtitle: string }) {
  return (
    <section className="page-header">
      <h1>
        <Highlight text={heading} />
      </h1>
      <p>{subtitle}</p>
    </section>
  );
}
