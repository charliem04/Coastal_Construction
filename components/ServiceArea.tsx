import Link from "next/link";
import { client } from "@/client.config";
import { serviceAreaTiers } from "@/content/serviceAreas";
import { Highlight } from "./Highlight";
import { Reveal } from "./Reveal";
import { SectionMarker } from "./survey/SectionMarker";
import { SurveyFrame } from "./survey/SurveyFrame";

const a = client.home.serviceArea;

/** Home page: the map, the "not sure?" box under it, and the parish tiers. */
export function ServiceArea() {
  return (
    <section className="service-area-map band-contours" id="service-area">
      <Reveal>
        <SectionMarker index="04" label={client.markers.area} />
        <h2 className="section-title">
          <Highlight text={a.title} />
        </h2>
        <p className="section-subtitle">{a.subtitle}</p>
      </Reveal>

      <div className="map-container">
        <div className="map-content">
          <div className="map-column">
            <SurveyFrame>
              <div className="parishes-map">
              <iframe
                src={a.mapSrc}
                width="100%"
                height="600"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={a.mapTitle}
              />
              <div className="map-overlay-info">
                <div className="map-pin" aria-hidden="true">
                  📍
                </div>
                <div className="map-location-text">
                  <strong>{a.based}</strong>
                  <span>{a.serving}</span>
                </div>
              </div>
            </div>
            </SurveyFrame>
            <div className="service-area-cta">
              <p>
                {a.ctaBefore}
                <Link href="/contact">{a.ctaLink}</Link>
                {a.ctaAfter}
              </p>
            </div>
          </div>

          <div className="parishes-list">
            {serviceAreaTiers.map((tier) => (
              <div key={tier.heading} className="parish-category">
                <h3>{tier.heading}</h3>
                <ul>
                  {tier.parishes.map((p) => (
                    <li key={p.name}>
                      {p.strong ? <strong>{p.name}</strong> : p.name}
                      {p.note}
                    </li>
                  ))}
                </ul>
                {tier.note && <p className="service-note">{tier.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
