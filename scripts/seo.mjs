/**
 * Post-build SEO and accessibility invariants, checked against the real
 * output in out/. Cheap to get right, invisible when they go wrong.
 *
 * Fails the build when an indexable page:
 *   · has no <title>, or one over 60 characters (cut off in results);
 *   · has no description, or one over 160 characters;
 *   · has no canonical link;
 *   · has no JSON-LD, or JSON-LD that doesn't parse;
 *   · doesn't have exactly one <h1>;
 *   · has an <img> with no alt attribute;
 * and when any page has lost the skip link or <main id="main">.
 *
 * One-word alt text ("Demolition") is reported but not fatal: the old
 * site's alt strings are carried over verbatim by design.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const MAX_TITLE = 60;
const MAX_DESCRIPTION = 160;

function pages(dir = "out", out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name !== "_next") pages(p, out);
    } else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");

export function checkSeo() {
  const problems = [];
  const notes = [];
  const found = pages();

  for (const f of found) {
    const path = "/" + relative("out", f).split(sep).join("/").replace(/(index)?\.html$/, "");
    const html = readFileSync(f, "utf8");

    if (!html.includes('class="skip-link" href="#main"')) problems.push(`${path} has lost the skip link`);
    if (!/<main id="main"/.test(html)) problems.push(`${path} has no <main id="main">`);

    const title = decode((html.match(/<title>([^<]*)<\/title>/) ?? [, ""])[1]);
    if (!title) problems.push(`${path} has no <title>`);
    else if (title.length > MAX_TITLE) problems.push(`${path} title is ${title.length} chars: ${title}`);

    if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;

    const desc = decode((html.match(/<meta name="description" content="([^"]*)"/) ?? [, ""])[1]);
    if (!desc) problems.push(`${path} has no description`);
    else if (desc.length > MAX_DESCRIPTION) problems.push(`${path} description is ${desc.length} chars`);

    if (!/<link rel="canonical" href="[^"]+"/.test(html)) problems.push(`${path} has no canonical link`);

    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (!blocks.length) problems.push(`${path} has no JSON-LD`);
    for (const [, json] of blocks) {
      try {
        JSON.parse(json);
      } catch (err) {
        problems.push(`${path} JSON-LD does not parse: ${err.message}`);
      }
    }

    const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
    if (h1s !== 1) problems.push(`${path} has ${h1s} <h1> elements (want exactly 1)`);

    for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt="/.test(img)) problems.push(`${path} image has no alt attribute: ${img.slice(0, 90)}…`);
      const alt = (img.match(/\balt="([^"]*)"/) ?? [, ""])[1];
      if (alt && !/\s/.test(alt.trim())) notes.push(`${path} alt "${alt}" is one word (kept verbatim from the old site)`);
    }
  }

  if (notes.length) console.log("[seo] note: " + [...new Set(notes)].join("\n            "));
  if (problems.length) {
    console.error("[seo] " + problems.join("\n      "));
    return false;
  }
  console.log(`[seo] ${found.length} pages: titles, descriptions, canonicals, schema, h1 and alts in range`);
  return true;
}

if (process.argv[1] && process.argv[1].endsWith("seo.mjs")) {
  process.exit(checkSeo() ? 0 : 1);
}
