"use client";

/**
 * The sticky Blade Bar on every page: brand, links with a Services
 * dropdown, phone, and a full-height quote blade. Phones get a menu
 * button instead of the links.
 *
 * The shell keeps a fixed height in the page flow, and condensing only
 * transforms the bar, so scrolling never moves content or anchor landings.
 * Service names arrive as a prop so the full service copy stays out of
 * the JavaScript sent to every page.
 */
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { client } from "@/client.config";
import { quoteHref } from "@/lib/mobileBar";
import { phoneDisplay, phoneHref } from "@/lib/phone";
import { photo } from "@/lib/photo";
import { Highlight } from "./Highlight";
import { PhoneIcon } from "./icons";

type ServiceLink = { slug: string; name: string };

export function Nav({ serviceLinks }: { serviceLinks: ServiceLink[] }) {
  const path = usePathname();
  const bar = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstMenuLink = useRef<HTMLAnchorElement>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const current = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));
  const closeAll = () => {
    setServicesOpen(false);
    setMenuOpen(false);
  };

  useEffect(() => {
    const sync = () => bar.current?.classList.toggle("is-condensed", window.scrollY > 30);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  useEffect(closeAll, [path]);

  useEffect(() => {
    if (!servicesOpen && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setServicesOpen(false);
      if (menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [servicesOpen, menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const page = [document.getElementById("main"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    );
    const root = document.documentElement;
    const overflow = root.style.overflow;
    const desktop = window.matchMedia("(min-width: 969px)");
    const onDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    page.forEach((el) => {
      el.inert = true;
    });
    root.style.overflow = "hidden";
    desktop.addEventListener("change", onDesktop);
    firstMenuLink.current?.focus();
    return () => {
      page.forEach((el) => {
        el.inert = false;
      });
      root.style.overflow = overflow;
      desktop.removeEventListener("change", onDesktop);
    };
  }, [menuOpen]);

  const onServicesBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setServicesOpen(false);
  };

  return (
    <div className="site-nav-shell">
      <nav ref={bar} className="site-nav" aria-label="Primary">
        <span className="nav-rail" aria-hidden="true" />
        <div className="nav-brand">
          <Link href="/">
            <Image {...photo("logo")} alt={client.nav.logoAlt} className="nav-logo-img" sizes="100px" loading="eager" />
          </Link>
          <Link href="/" className="nav-logo">
            <Highlight text={client.nav.wordmark} />
            <span className="nav-subtitle">{client.nav.subtitle}</span>
          </Link>
        </div>

        <ul className="nav-links">
          {client.nav.links.map((l) =>
            l.href === "/services" ? (
              <li
                key={l.href}
                className={`nav-has-drop ${servicesOpen ? "is-open" : ""}`}
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
                onBlur={onServicesBlur}
              >
                <Link href={l.href} aria-current={current(l.href) ? "page" : undefined}>
                  {l.label}
                </Link>
                <button
                  type="button"
                  className="nav-drop-toggle"
                  aria-label={client.nav.showServices}
                  aria-expanded={servicesOpen}
                  aria-controls="nav-services"
                  onClick={() => setServicesOpen((open) => !open)}
                >
                  <span aria-hidden="true" />
                </button>
                <div id="nav-services" className="nav-drop">
                  <ul>
                    {serviceLinks.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} prefetch={false} onClick={closeAll}>
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ) : (
              <li key={l.href}>
                <Link href={l.href} aria-current={current(l.href) ? "page" : undefined}>
                  {l.label}
                </Link>
              </li>
            )
          )}
        </ul>

        <div className="nav-actions">
          <a href={phoneHref} className="nav-call">
            <PhoneIcon className="nav-call-icon" />
            <span className="nav-call-number">{phoneDisplay}</span>
            <span className="nav-call-short">{client.mobileBar.call}</span>
          </a>
          <Link href={quoteHref(path)} className="nav-quote">
            <span>{client.mobileBar.quote}</span>
          </Link>
        </div>

        <button
          ref={menuButton}
          type="button"
          className={`nav-burger ${menuOpen ? "is-open" : ""}`}
          aria-label={menuOpen ? client.nav.closeMenu : client.nav.openMenu}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
        </button>

        <div id="nav-menu" className={`nav-menu ${menuOpen ? "is-open" : ""}`}>
          {client.nav.links.map((l, i) => (
            <Link
              key={l.href}
              ref={i === 0 ? firstMenuLink : undefined}
              href={l.href}
              className="nav-menu-link"
              aria-current={current(l.href) ? "page" : undefined}
              onClick={closeAll}
            >
              {l.label}
            </Link>
          ))}
          <p>{client.nav.servicesLabel}</p>
          <ul>
            {serviceLinks.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} prefetch={false} onClick={closeAll}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
