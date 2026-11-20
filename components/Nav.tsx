"use client";

/**
 * The sticky black bar on every page. The current page's link is red
 * with the animated underline, marked aria-current="page" (the old
 * markup used class="active"; the attribute also tells screen readers).
 */
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { client } from "@/client.config";
import { photo } from "@/lib/photo";
import { Highlight } from "./Highlight";

export function Nav() {
  const path = usePathname();
  const current = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));

  return (
    <nav className="site-nav" aria-label="Primary">
      <div className="nav-brand">
        <Link href="/">
          <Image {...photo("logo")} alt={client.nav.logoAlt} className="nav-logo-img" sizes="100px" priority />
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
    </nav>
  );
}
