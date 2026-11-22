import Link from "next/link";
import { fill, phoneHref } from "@/lib/phone";
import { Reveal } from "./Reveal";
import { TickRule } from "./survey/TickRule";

/**
 * The red closing band on services, about and the 404: a heading, a
 * line, a black primary button and white outline buttons.
 */
export function CtaBand({
  heading,
  body,
  primary,
  call,
  extra,
}: {
  heading: string;
  body: string;
  primary: { href: string; label: string };
  /** "Call {phone}" — omitted on the 404. */
  call?: string;
  extra?: { href: string; label: string }[];
}) {
  return (
    <section className="cta-section">
      <TickRule className="cta-ticks" />
      <Reveal>
        <h2>{heading}</h2>
        <p>{body}</p>
        <div className="cta-buttons-group">
        <Link href={primary.href} className="cta-button">
          {primary.label}
        </Link>
        {call && (
          <a href={phoneHref} className="cta-button-outline">
            {fill(call)}
          </a>
        )}
        {extra?.map((x) => (
          <Link key={x.href} href={x.href} className="cta-button-outline">
            {x.label}
          </Link>
        ))}
      </div>
      </Reveal>
    </section>
  );
}
