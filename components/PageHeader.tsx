import { Highlight } from "./Highlight";
import { TickRule } from "./survey/TickRule";

/** The dark gradient header on services, about, contact, privacy and 404. */
export function PageHeader({ heading, subtitle }: { heading: string; subtitle: string }) {
  return (
    <section className="page-header">
      <h1>
        <Highlight text={heading} />
      </h1>
      <p>{subtitle}</p>
      <TickRule className="page-header-ticks" />
    </section>
  );
}
