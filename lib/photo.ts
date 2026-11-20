/**
 * A photo's src and intrinsic size, from content/imageManifest.json
 * (written by scripts/images.mjs). Spread onto next/image so every
 * photo has width and height and reserves its box before it loads —
 * nothing on the page shifts when a photo lands.
 *
 *   <Image {...photo("pond-construction")} alt="…" sizes="…" />
 */
import manifest from "@/content/imageManifest.json";
import type { CardPhotoName, PhotoName } from "@/content/types";

type Entry = { width: number; height: number; widths: number[] };

export function photo(name: PhotoName | CardPhotoName) {
  const entry = (manifest as Record<string, Entry>)[name];
  if (!entry) {
    throw new Error(`[photo] "${name}" is not in content/imageManifest.json — run \`npm run images\`.`);
  }
  return { src: `/images/${name}.webp`, width: entry.width, height: entry.height };
}
