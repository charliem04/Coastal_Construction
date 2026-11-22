"use client";

/**
 * The sticky black bar on every page. The current page's link is red
 * with the animated underline, marked aria-current="page".
 *
 * The shell keeps a fixed height in the page flow, so condensing the
 * visible bar after scrolling never moves content or anchor landings.
 */
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { client } from "@/client.config";
import { quoteHref } from "@/lib/mobileBar";
import { phoneDisplay, phoneHref } from "@/lib/phone";
import { photo } from "@/lib/photo";
import { Highlight } from "./Highlight";
import { PhoneIcon } from "./icons";

export function Nav() {
  const path = usePathname();
  const bar = useRef<HTMLElement>(null);
  const current = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));

  useEffect(() => {
    const sync = () => bar.current?.classList.toggle("is-condensed", window.scrollY > 30);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  return (
    <div className="site-nav-shell">
      <nav ref={bar} className="site-nav" aria-label="Primary">
        <div className="nav-brand">
          <Link href="/">
            <Image {...photo("logo")} alt={client.nav.logoAlt} className="nav-logo-img" sizes="100px" loading="eager" />
          </Link>
          <Link href="/" className="nav-logo">
            {/* Direct children of the flex column, as the old markup was, so
                COASTAL / CONSTRUCTION / SERVICES stack one per line. */}
            <Highlight text={client.nav.wordmark} />
            <span className="nav-subtitle">{client.nav.subtitle}</span>
          </Link>
        </div>
        <ul className="nav-links">
          {client.nav.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={current(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <a href={phoneHref} className="nav-call">
            <PhoneIcon className="nav-call-icon" />
            <span className="nav-call-number">{phoneDisplay}</span>
            <span className="nav-call-short">{client.mobileBar.call}</span>
          </a>
          <Link href={quoteHref(path)} className="nav-quote">
            {client.mobileBar.quote}
          </Link>
        </div>
      </nav>
    </div>
  );
}
