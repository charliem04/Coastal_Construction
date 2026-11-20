/**
 * next/image loader for a static export with no image server.
 *
 * scripts/images.mjs cuts every photo into some of the widths
 * next.config.mjs lists (320, 640, 960, 1600) — each photo only the ones
 * it needs — named `<photo>-<width>.webp`, and records which in
 * content/imageManifest.json. This maps each srcset entry Next asks for
 * onto the smallest cut that is at least that wide, or the largest cut
 * there is:
 *
 *   /images/site-pad-construction.webp at 640w   →  …-640.webp
 *   /images/site-pad-construction.webp at 1600w  →  …-960.webp (largest)
 *
 * Anything that isn't one of our WebP photos is passed through untouched.
 */
import manifest from "@/content/imageManifest.json";

type LoaderArgs = { src: string; width: number; quality?: number };
type Entry = { width: number; height: number; widths: number[] };

export default function imageLoader({ src, width }: LoaderArgs): string {
  const m = src.match(/^\/images\/([a-z0-9-]+)\.webp$/);
  const entry = m ? (manifest as Record<string, Entry>)[m[1]] : undefined;
  if (!m || !entry) return src;
  const cut = entry.widths.find((w) => w >= width) ?? entry.widths[entry.widths.length - 1];
  return `/images/${m[1]}-${cut}.webp`;
}
