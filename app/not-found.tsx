import type { Metadata } from "next";
import { client } from "@/client.config";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Page Not Found | Coastal Construction Services",
  robots: { index: false, follow: true },
};

const n = client.notFound;

/** Served by Workers static assets for any unknown path, with a 404 status. */
export default function NotFound() {
  return (
    <>
      <PageHeader heading={n.heading} subtitle={n.body} />
      <div className="not-found-stake" aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none">
          <path d="M16 104h88" stroke="#fff" strokeWidth="2" />
          <path d="M26 104v-7M44 104v-7M62 104v-7M80 104v-7M98 104v-7" stroke="#fff" />
          <path d="M60 104V30" stroke="#dc2626" strokeWidth="6" />
          <path d="M63 28h36L88 40l11 12H63Z" fill="#dc2626" />
        </svg>
      </div>
      <CtaBand
        heading={n.ctaHeading}
        body={n.ctaBody}
        primary={{ href: "/", label: n.home }}
        extra={[
          { href: "/services", label: n.services },
          { href: "/contact", label: n.quote },
        ]}
      />
    </>
  );
}
