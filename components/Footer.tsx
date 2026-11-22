import Image from "next/image";
import Link from "next/link";
import { client } from "@/client.config";
import { serviceAreaTiers } from "@/content/serviceAreas";
import { services } from "@/content/services";
import { footerHours } from "@/lib/footerLinks";
import { phoneDisplay, phoneHref } from "@/lib/phone";
import { photo } from "@/lib/photo";
import { BladeEdge } from "./survey/BladeEdge";

const f = client.footer;
/** Home base plus the core parishes; the home page has the full list. */
const parishes = serviceAreaTiers.slice(0, 2).flatMap((tier) => tier.parishes);

/**
 * The closing section on every page. Every fact comes from the config
 * and content files. The year is the build year, rendered into the HTML.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const { street, city, region, postalCode } = client.address;
  return (
    <footer className="site-footer">
      <BladeEdge />
      <div className="footer-grid">
        <div className="footer-brand">
          <Image {...photo("logo")} alt="" className="footer-logo" sizes="140px" />
          <p className="footer-name">{client.businessName}</p>
          <Link href="/contact" className="method-button">
            {f.quote}
          </Link>
        </div>

        <div className="footer-column">
          <h2>{f.contactHeading}</h2>
          <a href={phoneHref} className="footer-phone">
            {phoneDisplay}
          </a>
          <a href={`mailto:${client.email}`}>{client.email}</a>
          <address>
            {street}
            <br />
            {city}, {region} {postalCode}
          </address>
          <h2 className="mt-6">{f.hoursHeading}</h2>
          {footerHours(client.contactPage.info.hours.lines).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <nav className="footer-column" aria-label={f.servicesHeading}>
          <h2>{f.servicesHeading}</h2>
          <ul className="footer-services">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} prefetch={false}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer-column" aria-label={f.areaHeading}>
          <h2>{f.areaHeading}</h2>
          <ul>
            {parishes.map((p) => (
              <li key={p.name}>
                <Link href="/#service-area">{p.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="footer-legal">
        <p>
          &copy; {year} {f.line}
        </p>
        <span className="footer-legal-links">
          <Link href="/guides">{f.guides}</Link>
          <Link href="/privacy">{f.privacy}</Link>
        </span>
      </div>
    </footer>
  );
}
