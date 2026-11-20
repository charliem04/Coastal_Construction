import Link from "next/link";
import { client } from "@/client.config";
import { Highlight } from "@/components/Highlight";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Reviews } from "@/components/Reviews";
import { ServiceArea } from "@/components/ServiceArea";
import { ServiceCards } from "@/components/ServiceCards";
import { fill, phoneHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("home", "/");

const w = client.home.whyChoose;
const banner = client.home.banner;
const cta = client.home.cta;

/** Home: hero → service cards → why choose → service area → banner → "Ready to get started?" */
export default function Home() {
  return (
    <>
      <JsonLd page="home" />
      <Hero />
      <ServiceCards />

      <section className="about" id="about">
        <div className="about-content">
          <div className="about-text">
            <h2>
              <Highlight text={w.heading} />
            </h2>
            {w.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="about-highlight">
            <h3>{w.highlightHeading}</h3>
            <dl className="stats">
              {w.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse text-center">
                  <dt className="stat-label">{s.label}</dt>
                  <dd className="stat-number">{s.number}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <Reviews label={w.reviewsLabel} />
      </section>

      <ServiceArea />

      <section className="transition-banner">
        <div className="transition-content">
          <h2>{banner.heading}</h2>
          <p>{banner.body}</p>
        </div>
      </section>

      <section className="contact" id="contact">
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
      </section>
    </>
  );
}
