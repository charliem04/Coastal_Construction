import type { MetadataRoute } from "next";
import { client } from "@/client.config";

export const dynamic = "force-static";

/**
 * Everything is crawlable. The old file also disallowed /.idea/ and
 * /docs/; neither is deployed any more (only ./out is served), and a
 * Disallow line advertises a path rather than hiding it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${client.siteUrl}/sitemap.xml`,
    host: client.siteUrl,
  };
}
