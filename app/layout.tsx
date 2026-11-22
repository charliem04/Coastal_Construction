import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { client } from "@/client.config";
import { CalEmbed } from "@/components/CalEmbed";
import { Footer } from "@/components/Footer";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Nav } from "@/components/Nav";
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

export const viewport: Viewport = {
  themeColor: client.themeColor,
  width: "device-width",
  initialScale: 1,
};

/**
 * Every page: skip link → nav → <main id="main"> → footer, as the old
 * HTML had it. The skip link is the first thing a keyboard user reaches.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US">
      <head>
        {/*
          Scroll reveals server-render their hidden state inline. Without
          JavaScript nothing would un-hide them, so this puts the content
          back. Static and ours — see scripts/csp.mjs.
        */}
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: "[data-reveal]{opacity:1!important;transform:none!important}" }} />
        </noscript>
      </head>
      <body>
        <a className="skip-link" href="#main">
          {client.nav.skip}
        </a>
        <ScrollProgress />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <MobileCallBar />
        {/* Cal.com's embed loader — fetched only on a page with a booking button. */}
        <CalEmbed />
      </body>
    </html>
  );
}
