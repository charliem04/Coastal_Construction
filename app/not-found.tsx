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
