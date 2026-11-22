import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { client } from "@/client.config";
import { headlineWords } from "@/lib/headlineWords";
import { photo } from "@/lib/photo";
import { ExcavationDivider } from "./ExcavationDivider";

const h = client.home.hero;

/**
 * Full-screen hero: logo, headline, subhead, quote button. The entrance
 * is CSS, so nothing here waits for hydration, and the photo is visible
 * from first paint.
 */
export function Hero() {
  return (
    <section className="hero">
      {/* Decorative: the headline says what the page is. */}
      <Image {...photo("hero-dirt-work")} alt="" className="hero-photo" sizes="100vw" priority />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-content">
        <Image
          {...photo("logo")}
          alt={h.logoAlt}
          className="hero-logo hero-in"
          style={{ "--d": "0ms" } as CSSProperties}
          sizes="300px"
          loading="eager"
        />
        <h1>
          {headlineWords(h.headline).map(({ word, red }, i) => (
            <span key={word}>
              <span className="hero-word">
                <span className={red ? "hero-red" : undefined} style={{ "--i": i } as CSSProperties}>
                  {word}
                </span>
              </span>{" "}
            </span>
          ))}
        </h1>
        <p className="hero-sub hero-in" style={{ "--d": "520ms" } as CSSProperties}>
          {h.subhead}
        </p>
        <Link href="/contact#contact-form" className="cta-button hero-in" style={{ "--d": "640ms" } as CSSProperties}>
          {h.cta}
        </Link>
      </div>
      <ExcavationDivider />
    </section>
  );
}
