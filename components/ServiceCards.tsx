import Link from "next/link";
import { client } from "@/client.config";
import { services } from "@/content/services";
import { motionTiming } from "@/lib/motion";
import { photo } from "@/lib/photo";
import { DeferredImage } from "./DeferredImage";
import { Highlight } from "./Highlight";
import { Reveal } from "./Reveal";
import { CornerBrackets } from "./survey/CornerBrackets";
import { SectionMarker } from "./survey/SectionMarker";

const s = client.home.services;

/** Home page: one photo card per service, each linking to its section on /services. */
export function ServiceCards() {
  return (
    <section className="services band-contours" id="services">
      <Reveal>
        <SectionMarker index="01" label={client.markers.services} />
        <h2 className="section-title">
          <Highlight text={s.title} />
        </h2>
        <p className="section-subtitle">{s.subtitle}</p>
      </Reveal>

      <div className="portfolio-grid">
        {services.map((svc, i) => (
          <Reveal key={svc.slug} delay={(i % 3) * motionTiming.stagger}>
            <Link href={`/services#${svc.slug}`} className="service-card has-brackets">
              <div className="portfolio-item">
                <CornerBrackets />
                <DeferredImage
                  {...photo(`${svc.photo}-card`)}
                  alt={svc.alt.card}
                  sizes="(max-width: 968px) 100vw, (min-width: 1400px) 33vw, 50vw"
                />
              </div>
              <div className="service-card-body">
                <h3>{svc.name}</h3>
                <p>{svc.blurb}</p>
                <span className="service-card-arrow" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="service-cta-buttons">
        <Link href="/services" className="cta-button">
          {s.viewAll}
        </Link>
        <a href="#service-area" className="cta-button-outline">
          {s.seeArea}
        </a>
      </div>
    </section>
  );
}
