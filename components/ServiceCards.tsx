import Image from "next/image";
import Link from "next/link";
import { client } from "@/client.config";
import { services } from "@/content/services";
import { photo } from "@/lib/photo";
import { Highlight } from "./Highlight";
import { Reveal } from "./Reveal";

const s = client.home.services;

/** Home page: one photo card per service, each linking to its section on /services. */
export function ServiceCards() {
  return (
    <section className="services" id="services">
      <h2 className="section-title">
        <Highlight text={s.title} />
      </h2>
      <p className="section-subtitle">{s.subtitle}</p>

      <div className="portfolio-grid">
        {services.map((svc) => (
          <Reveal key={svc.slug}>
            <Link href={`/services#${svc.slug}`} className="block text-inherit no-underline">
              <div className="portfolio-item">
                <Image
                  {...photo(svc.photo)}
                  alt={svc.alt.card}
                  sizes="(max-width: 968px) 100vw, (min-width: 1400px) 33vw, 50vw"
                />
                <div className="portfolio-overlay">
                  <h3>{svc.name}</h3>
                  <p>{svc.blurb}</p>
                </div>
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
