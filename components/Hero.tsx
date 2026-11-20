import Image from "next/image";
import { client } from "@/client.config";
import { photo } from "@/lib/photo";
import { Highlight } from "./Highlight";

const h = client.home.hero;

/**
 * Full-screen hero. The photo was a CSS background on the old site;
 * here it is a real <img> (preloaded, responsive, sized) under the same
 * 60% black scrim and red diagonal wash, so it looks the same and the
 * browser loads the right size for the screen.
 */
export function Hero() {
  return (
    <section className="hero">
      {/* Decorative: the headline says what the page is. */}
      <Image {...photo("hero-dirt-work")} alt="" className="hero-photo" sizes="100vw" priority />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-content">
        <Image {...photo("logo")} alt={h.logoAlt} className="hero-logo" sizes="300px" priority />
        <div className="logo">
          <Highlight text={h.wordmark} />
          <span className="logo-subtitle">{h.subtitle}</span>
        </div>
        <p className="tagline">{h.tagline}</p>
        <h1>
          <Highlight text={h.headline} />
        </h1>
        <p className="hero-sub">{h.subhead}</p>
        <a href="#contact" className="cta-button">
          {h.cta}
        </a>
      </div>
    </section>
  );
}
