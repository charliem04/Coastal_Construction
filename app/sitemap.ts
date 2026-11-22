import type { MetadataRoute } from "next";
import { client } from "@/client.config";
import { costGuides } from "@/content/costGuides";
import { guides } from "@/content/guides";
import { parishes } from "@/content/parishes";
import { projectStudies } from "@/content/projects";
import { reviews } from "@/content/reviews";
import { serviceDetails } from "@/content/serviceDetails";

export const dynamic = "force-static";

type Page = { path: string; priority: number; changeFrequency: "weekly" | "monthly" };

/**
 * Every indexable page. /privacy is noindex, the 404 is not a page, and
 * parish, project, cost, and review pages appear only once published.
 * lastModified is the build date.
 */
function indexablePages(): Page[] {
  const monthly = (path: string, priority: number): Page => ({ path, priority, changeFrequency: "monthly" });
  const areas = parishes.filter((p) => p.published);
  const projects = projectStudies.filter((p) => p.published);
  const costs = costGuides.filter((c) => c.published);
  return [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    monthly("/services", 0.9),
    monthly("/contact", 0.8),
    monthly("/about", 0.7),
    ...serviceDetails.map((s) => monthly(`/services/${s.slug}`, 0.9)),
    monthly("/weather", 0.7),
    monthly("/guides", 0.7),
    ...guides.map((g) => monthly(`/guides/${g.slug}`, 0.6)),
    ...(areas.length ? [monthly("/service-areas", 0.7), ...areas.map((p) => monthly(`/service-areas/${p.slug}`, 0.8))] : []),
    ...(projects.length ? [monthly("/projects", 0.7), ...projects.map((p) => monthly(`/projects/${p.slug}`, 0.7))] : []),
    ...(costs.length ? [monthly("/cost-guides", 0.7), ...costs.map((c) => monthly(`/cost-guides/${c.slug}`, 0.7))] : []),
    ...(reviews.length ? [monthly("/reviews", 0.6)] : []),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return indexablePages().map((p) => ({
    url: p.path === "/" ? `${client.siteUrl}/` : `${client.siteUrl}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
