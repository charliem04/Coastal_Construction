import Image from "next/image";
import Link from "next/link";
import { client } from "@/client.config";
import { services } from "@/content/services";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { ServiceJump } from "@/components/ServiceJump";
import { CornerBrackets } from "@/components/survey/CornerBrackets";
import { photo } from "@/lib/photo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("services", "/services");

const p = client.servicesPage;

/**
 * Services: intro → all nine, each with its own heading and photograph,
 * alternating sides and backgrounds → CTA band. One page, as today.
 */
export default function ServicesPage() {
  return (
    <>
      <JsonLd page="services" />
      <PageHeader heading={p.heading} subtitle={p.subtitle} />
      <ServiceJump />

      {services.map((s, i) => {
        const image = (
          <div className="service-photo has-brackets">
            <CornerBrackets />
            <Image
            {...photo(s.photo)}
            alt={s.alt.detail}
            className="service-image"
            sizes="(max-width: 968px) 100vw, 650px"
          />
          </div>
        );
        return (
          <Reveal
            key={s.slug}
            as="section"
            id={s.slug}
            className={`service-detail ${i % 2 === 0 ? "is-even" : "is-odd"}`}
          >
            <div className="service-content">
              {i % 2 === 0 && image}
              <div className="service-text">
                <h2>{s.name}</h2>
                {s.body.map((para) => (
                  <p key={para}>{para}</p>
                ))}
                <div className="service-features">
                  <h3>{p.featuresHeading}</h3>
                  <ul>
                    {s.features.map((f, n) => (
                      <li key={f}>
                        <Reveal as="div" className="block" delay={n * 0.05}>
                          {f}
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={`/services/${s.slug}`} prefetch={false} className="service-more">
                  {p.learnMore}: {s.name}
                </Link>
              </div>
              {i % 2 === 1 && image}
            </div>
          </Reveal>
        );
      })}

      <CtaBanddirtDivider="surface-950"
        heading={p.cta.heading}
        body={p.cta.body}
        primary={{ href: "/contact", label: p.cta.primary }}
        call={p.cta.call}
      />
    </>
  );
}
