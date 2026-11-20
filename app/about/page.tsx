import Image from "next/image";
import { client } from "@/client.config";
import { CtaBand } from "@/components/CtaBand";
import { Highlight } from "@/components/Highlight";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { photo } from "@/lib/photo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("about", "/about");

const a = client.aboutPage;

/** About: owner photo beside story → mission → values → why choose → CTA band. */
export default function AboutPage() {
  return (
    <>
      <JsonLd page="about" />
      <PageHeader heading={a.heading} subtitle={a.subtitle} />

      <section className="about-page">
        <div className="about-page-content">
          <div className="owner-photo-section">
            <Image
              {...photo("owner-kevin-meyers")}
              alt={a.ownerAlt}
              className="owner-photo"
              sizes="(max-width: 968px) 100vw, 286px"
              priority
            />
            <h2 className="owner-name">{client.owner.name}</h2>
            <p className="owner-title">{client.owner.title}</p>
          </div>

          <div className="owner-story">
            <h2>
              <Highlight text={a.story.heading} />
            </h2>
            {a.story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}

            <div className="mission-section">
              <h2>
                <Highlight text={a.mission.heading} />
              </h2>
              {a.mission.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="values-section">
              <h2>
                <Highlight text={a.values.heading} />
              </h2>
              <div className="values-grid">
                {a.values.items.map((v) => (
                  <div key={v.title} className="value-item">
                    <h3>{v.title}</h3>
                    <p>{v.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="why-choose-section">
              <h2>
                <Highlight text={a.whyChoose.heading} />
              </h2>
              {a.whyChoose.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        heading={a.cta.heading}
        body={a.cta.body}
        primary={{ href: "/contact", label: a.cta.primary }}
        call={a.cta.call}
      />
    </>
  );
}
