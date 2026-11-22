import Link from "next/link";
import { client } from "@/client.config";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Highlight } from "@/components/Highlight";
import { CountUpStat } from "@/components/CountUpStat";
import { Hero } from "@/components/Hero";
import { HowWeWork } from "@/components/HowWeWork";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { Reviews } from "@/components/Reviews";
import { ServiceArea } from "@/components/ServiceArea";
import { ServiceCards } from "@/components/ServiceCards";
import { SectionMarker } from "@/components/survey/SectionMarker";
import { TickRule } from "@/components/survey/TickRule";
import { fill, phoneHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("home", "/");

const w = client.home.whyChoose;
const banner = client.home.banner;
const cta = client.home.cta;

/** Home: hero → service cards → how we work → before/after → why choose → service area → banner → "Ready to get started?" */
export default function Home() {
  return (
    <>
      <JsonLd page="home" />
      <Hero />
      <ServiceCards />
      <HowWeWork />
      <BeforeAfter />

      <section className="about" id="about">
        <div className="about-content">
          <div className="about-text">
            <Reveal>
              <SectionMarker index="03" label={client.markers.why} align="left" />
              <h2>
                <Highlight text={w.heading} />
              </h2>
            </Reveal>
            {w.paragraphs.map((p, i) => (
              <Reveal key={p} delay={(i + 1) * 0.06}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="about-highlight band-contours">
              <h3>{w.highlightHeading}</h3>
              <dl className="stats">
                {w.stats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse text-center">
                    <dt className="stat-label">{s.label}</dt>
                    <CountUpStat value={s.number} />
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
        <Reveal>
          <Reviews label={w.reviewsLabel} />
        </Reveal>
      </section>

      <ServiceArea />

      <section className="transition-banner">
        <Reveal className="transition-content">
          <h2>{banner.heading}</h2>
          <p>{banner.body}</p>
        </Reveal>
        <TickRule className="banner-ticks" />
      </section>

      <section className="contact" id="contact">
        <Reveal>
          <h2>{cta.heading}</h2>
          <p>{cta.body}</p>
          <div className="contact-cta-buttons">
            <Link href="/contact" className="cta-button">
              {cta.contact}
            </Link>
            <a href={phoneHref} className="cta-button-secondary">
              {fill(cta.call)}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
