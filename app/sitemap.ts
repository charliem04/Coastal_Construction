import type { MetadataRoute } from "next";
import { client } from "@/client.config";

export const dynamic = "force-static";

/**
 * The four indexable pages — the same four the old static sitemap.xml
 * listed, at their clean URLs (/services, not /services.html; the old
 * .html URLs 301 here, see public/_redirects). /privacy is noindex and
 * the 404 is not a page. lastModified is the build date.
 */
const PAGES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGES.map((p) => ({
    url: p.path === "/" ? `${client.siteUrl}/` : `${client.siteUrl}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
