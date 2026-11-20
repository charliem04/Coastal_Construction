/**
 * ════════════════════════════════════════════════════════════════════
 *  PHOTOS — camera originals in, small WebP out.
 *
 *    npm run images            convert images-src/ → public/images/
 *    node scripts/images.mjs --check   (runs first in `npm run build`)
 *
 *  The old site served 25 MB of camera originals, five of them PNG
 *  photographs, at a fraction of their pixel size. Here every photo is
 *  cut once, by this script, into the widths next.config.mjs asks for
 *  (320/640/960/1600, never upscaled), as WebP, under a descriptive
 *  name. lib/imageLoader.ts points each srcset entry at those files, so
 *  a phone downloads the 640px cut and a 1440px screen the 1600px one.
 *
 *  Originals live in images-src/ (gitignored — the repo ships only the
 *  output). They are also in git history: the commit before this
 *  rebuild (4634a5b) has the whole old images/ folder.
 *
 *  To add or replace a photo: put the original in images-src/, add a
 *  line to PHOTOS below, run `npm run images`, commit public/images/
 *  and content/imageManifest.json.
 *
 *  --check (part of every build) touches nothing; it fails the build if
 *  a photo in the manifest is missing a cut, a cut is over budget, or a
 *  PNG/JPEG photograph has crept back into public/images/.
 * ════════════════════════════════════════════════════════════════════
 */
import { existsSync, mkdirSync, rmSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "images-src";
const OUT = "public/images";
const MANIFEST = "content/imageManifest.json";

/**
 * Each photo lists the widths it needs; lib/imageLoader.ts serves the
 * smallest cut at least as wide as the browser asks for. Only the
 * full-screen hero needs 1600; a service photo never shows wider than
 * ~650 CSS px, so 960 covers a 2x laptop and a 3x phone closely enough
 * for a photo of dirt work.
 *
 * `card: true` also cuts a 4:3 centre crop (`<name>-card`) for the home
 * page's cards. The card box is 4:3 and object-fit: cover crops the
 * centre anyway, so this is the same picture without downloading the
 * half of a portrait photo the card never shows.
 */
const PHOTO_WIDTHS = [960];
const CARD_WIDTHS = [480, 800];

/** Largest single cut allowed, bytes. */
const BUDGET = 420 * 1024;
/** The whole public/images folder. The old images/ was 25 MB. */
const TOTAL_BUDGET = 3 * 1024 * 1024;

/**
 * source file in images-src/  →  output name (no extension), quality.
 * Only photos the site actually shows are listed; the old folder's
 * unused alternates (sitepads2, pond2, culvert, landleveling,
 * demolition2) are not shipped.
 */
const PHOTOS = [
  // Under a 60% black scrim: detail is invisible, so quality can drop a lot.
  { src: "mainpage.JPEG", out: "hero-dirt-work", widths: [640, 960, 1600], quality: 38 },
  { src: "sitepads.JPEG", out: "site-pad-construction", card: true },
  { src: "pond.png", out: "pond-construction", card: true },
  { src: "culvert2.JPEG", out: "culvert-installation", card: true },
  { src: "levee.png", out: "levee-construction", card: true },
  { src: "landleveling2.JPEG", out: "land-leveling", card: true },
  { src: "materialdelivery.JPEG", out: "material-delivery", card: true },
  { src: "pastureclearing.JPEG", out: "pasture-clearing", card: true },
  { src: "bushhogging.JPEG", out: "bushhogging", card: true },
  { src: "demolition.png", out: "demolition", card: true },
  // The owner's portrait: a touch more quality, it's a face.
  // Shown at most ~330 CSS px square.
  { src: "CCSofLA_Owner.png", out: "owner-kevin-meyers", widths: [320, 640], quality: 86 },
  // The logo keeps its transparency (WebP alpha), lossless edges.
  // Shown at 80–300 CSS px.
  { src: "logo-square.png", out: "logo", widths: [320, 640], quality: 90, alpha: true },
];

function check() {
  const problems = [];
  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : null;
  if (!manifest) problems.push(`${MANIFEST} is missing — run \`npm run images\``);

  for (const [name, entry] of Object.entries(manifest ?? {})) {
    for (const w of entry.widths) {
      const f = join(OUT, `${name}-${w}.webp`);
      if (!existsSync(f)) problems.push(`missing ${f}`);
      else if (statSync(f).size > BUDGET) problems.push(`${f} is ${(statSync(f).size / 1024).toFixed(0)} KB (budget ${BUDGET / 1024} KB)`);
    }
  }
  for (const f of existsSync(OUT) ? readdirSync(OUT) : []) {
    if (/\.(png|jpe?g)$/i.test(f)) problems.push(`${join(OUT, f)} — photographs ship as WebP; run it through \`npm run images\``);
  }

  if (problems.length) {
    console.error("[images] " + problems.join("\n         "));
    return false;
  }
  const total = readdirSync(OUT).reduce((n, f) => n + statSync(join(OUT, f)).size, 0);
  if (total > TOTAL_BUDGET) {
    console.error(`[images] ${OUT} is ${(total / 1024 / 1024).toFixed(2)} MB (budget ${TOTAL_BUDGET / 1024 / 1024} MB)`);
    return false;
  }
  console.log(`[images] ${Object.keys(manifest).length} photos, ${(total / 1024 / 1024).toFixed(2)} MB in ${OUT}`);
  return true;
}

async function convert() {
  const { default: sharp } = await import("sharp");
  if (!existsSync(SRC)) {
    console.error(`[images] put the camera originals in ${SRC}/ first (see the header of this file).`);
    return false;
  }
  mkdirSync(OUT, { recursive: true });
  const manifest = {};
  // Start clean so a renamed or dropped photo leaves no orphan cuts.
  for (const f of readdirSync(OUT)) if (f.endsWith(".webp")) rmSync(join(OUT, f));
  let before = 0;
  let after = 0;

  for (const p of PHOTOS) {
    const input = join(SRC, p.src);
    if (!existsSync(input)) {
      console.error(`[images] ${input} not found`);
      return false;
    }
    before += statSync(input).size;
    // .rotate() applies the camera's EXIF orientation, then all metadata
    // (GPS included — these are job-site photos) is dropped on output.
    const base = sharp(input).rotate();
    const meta = await base.metadata();
    const oriented = meta.orientation && meta.orientation >= 5;
    const srcW = oriented ? meta.height : meta.width;
    const srcH = oriented ? meta.width : meta.height;

    const widths = p.widths ?? PHOTO_WIDTHS;
    for (const w of widths) {
      const file = join(OUT, `${p.out}-${w}.webp`);
      await base
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: p.quality ?? 62, effort: 6, alphaQuality: p.alpha ? 100 : undefined, smartSubsample: true })
        .toFile(file);
      after += statSync(file).size;
    }
    // Intrinsic size of the largest cut: what width/height attributes
    // and aspect ratios are computed from.
    const w = Math.min(srcW, widths[widths.length - 1]);
    manifest[p.out] = { width: w, height: Math.round((srcH / srcW) * w), widths };

    if (p.card) {
      for (const cw of CARD_WIDTHS) {
        const file = join(OUT, `${p.out}-card-${cw}.webp`);
        await base
          .clone()
          .resize({ width: cw, height: Math.round((cw * 3) / 4), fit: "cover", position: "centre" })
          .webp({ quality: p.quality ?? 62, effort: 6, smartSubsample: true })
          .toFile(file);
        after += statSync(file).size;
      }
      const cw = CARD_WIDTHS[CARD_WIDTHS.length - 1];
      manifest[`${p.out}-card`] = { width: cw, height: Math.round((cw * 3) / 4), widths: CARD_WIDTHS };
    }
    console.log(`[images] ${p.src} → ${p.out} (${srcW}×${srcH})`);
  }

  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`[images] originals ${(before / 1024 / 1024).toFixed(1)} MB → ${(after / 1024 / 1024).toFixed(2)} MB `);
  return true;
}

const ok = process.argv.includes("--check") ? check() : await convert();
process.exit(ok ? 0 : 1);
