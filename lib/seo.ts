/**
 * Per-page <head>: title, description, canonical, Open Graph, Twitter.
 * Built from client.config.ts → pages, so every page's tags come from
 * one place and scripts/seo.mjs can check them after the build.
 */
import type { Metadata } from "next";
import { client } from "@/client.config";
import { fill } from "@/lib/phone";

type PageKey = keyof typeof client.pages;

export function pageMetadata(key: PageKey, path: string): Metadata {
  const p = client.pages[key];
  const description = fill(p.description);
  const ogDescription = fill(p.ogDescription);
  const image = { url: client.ogImage.path, width: 1200, height: 630, alt: fill(client.ogImage.alt) };
  return {
    title: fill(p.title),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: client.businessName,
      locale: "en_US",
      title: p.ogTitle,
      description: ogDescription,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: p.ogTitle,
      description: ogDescription,
      images: [image],
    },
  };
}

/** The <head> for a content page. Drafts are noindex and pruned from the public build. */
export function contentMetadata({
  title,
  description,
  path,
  draft = false,
}: {
  title: string;
  description: string;
  path: string;
  draft?: boolean;
}): Metadata {
  const image = { url: client.ogImage.path, width: 1200, height: 630, alt: fill(client.ogImage.alt) };
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(draft ? { robots: { index: false, follow: false }, other: { "coastal-draft": "1" } } : {}),
    openGraph: { type: "website", url: path, siteName: client.businessName, locale: "en_US", title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
