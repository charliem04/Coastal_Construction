import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { anton, barlowCondensed } from "./fonts";
import { client } from "@/client.config";
import { services } from "@/content/services";
import { CalEmbed } from "@/components/CalEmbed";
import { Footer } from "@/components/Footer";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Nav } from "@/components/Nav";
import { PageTransition } from "@/components/PageTransition";
import { ScrollProgress } from "@/components/ScrollProgress";

export const metadata: Metadata = {
  metadataBase: new URL(client.siteUrl),
  applicationName: client.businessName,
  authors: [{ name: client.businessName }],
  keywords: [...client.keywords],
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
  other: {
    "geo.region": `US-${client.address.region}`,
    "geo.placename": client.address.city,
  },
};

/** Only what the nav needs, so full service copy stays out of its bundle. */
const serviceLinks = services.map(({ slug, name }) => ({ slug, name }));

export const viewport: Viewport = {
  themeColor: client.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Every page: skip link → nav → <main id="main"> → footer, as the old
 * HTML had it. The skip link is the first thing a keyboard user reaches.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US" className={`${anton.variable} ${barlowCondensed.variable}`}>
      <head>
        {/*
          Scroll reveals server-render their hidden state inline. Without
          JavaScript nothing would un-hide them, so this puts the content
          back. Static and ours — see scripts/csp.mjs.
        */}
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: "[data-reveal]{opacity:1!important;transform:none!important}.survey-frame-line rect{stroke-dasharray:none!important;stroke-dashoffset:0!important}.tick-rule:not(.dig-laser){--draw:1!important}@media(max-width:968px){.site-nav-shell{position:static!important;height:auto!important}.site-nav{position:static!important;height:auto!important;flex-wrap:wrap!important;padding:8px 12px!important;background:#000!important}.site-nav .nav-links{display:flex!important;width:100%;margin:0!important;flex-wrap:wrap!important;height:auto!important;justify-content:center}.nav-burger{display:none!important}.nav-drop,.nav-drop-toggle{display:none!important}.nav-rail,.site-nav::before,.site-nav::after{display:none!important}}" }} />
        </noscript>
      </head>
      <body>
        <a className="skip-link" href="#main">
          {client.nav.skip}
        </a>
        <ScrollProgress />
        <Nav serviceLinks={serviceLinks} />
        <main id="main">{children}</main>
        <Footer />
        <MobileCallBar />
        <PageTransition />
        {/* Cal.com's embed loader — fetched only on a page with a booking button. */}
        <CalEmbed />
      </body>
    </html>
  );
}
