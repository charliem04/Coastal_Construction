import { client } from "@/client.config";
import { motionTiming } from "@/lib/motion";
import { Highlight } from "./Highlight";
import { Reveal } from "./Reveal";
import { SectionMarker } from "./survey/SectionMarker";
import { TickRule } from "./survey/TickRule";

const p = client.home.process;

/** Home page: the four steps of a job, joined by a survey line. */
export function HowWeWork() {
  return (
    <section className="process">
      <Reveal>
        <SectionMarker index="02" label={client.markers.process} />
        <h2 className="section-title">
          <Highlight text={p.title} />
        </h2>
        <p className="section-subtitle">{p.subtitle}</p>
      </Reveal>
      <ol className="process-steps">
        <TickRule className="process-line" />
        {p.steps.map((step, i) => (
          <li key={step.title}>
            <Reveal delay={i * motionTiming.stagger}>
              <span className="process-stake" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
