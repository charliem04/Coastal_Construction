import type { MetadataRoute } from "next";
import { client } from "@/client.config";

export const dynamic = "force-static";

/**
 * Replaces site.webmanifest; same name, colours and description. Icons
 * are square PNGs cut from the logo (the old manifest listed the logo at
 * 519×481, which browsers reject as an install icon).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: client.businessName,
    short_name: client.shortName,
    description:
      "Acadiana's dirt work specialists — site pads, ponds, culverts, levees, land leveling, clearing & demolition.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#1a1a1a",
    theme_color: client.themeColor,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
