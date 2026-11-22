import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { costGuides } from "../content/costGuides.ts";
import { guides } from "../content/guides.ts";
import { parishes } from "../content/parishes.ts";
import { projectStudies } from "../content/projects.ts";
import { serviceDetails } from "../content/serviceDetails.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const slugs = ["site-pads", "pond-construction", "culvert-installation", "levee-creation", "land-leveling", "material-delivery", "pasture-clearing", "bushhogging", "demolition"];
const metaOk = (p: { seoTitle: string; seoDescription: string }) => {
  assert.ok(p.seoTitle.length <= 60, `title ${p.seoTitle.length}: ${p.seoTitle}`);
  assert.ok(p.seoDescription.length >= 90 && p.seoDescription.length <= 160, `description ${p.seoDescription.length}: ${p.seoTitle}`);
};

test("all nine services have a complete page", () => {
  assert.deepEqual(serviceDetails.map((s) => s.slug).sort(), [...slugs].sort());
  for (const s of serviceDetails) {
    metaOk(s);
    assert.ok(s.needs.length >= 4 && s.steps.length === 4 && s.planning.length >= 3 && s.faqs.length >= 4, s.slug);
    for (const g of s.guides) assert.ok(guides.some((x) => x.slug === g), `${s.slug} -> ${g}`);
  }
});

test("answer guides cover every service with sourced questions", () => {
  assert.ok(guides.length >= 18);
  assert.ok(guides.reduce((n, g) => n + g.questions.length, 0) >= 110);
  assert.equal(new Set(guides.map((g) => g.slug)).size, guides.length);
  const asked = guides.flatMap((g) => g.questions.map((q) => q.q.toLowerCase()));
  assert.equal(new Set(asked).size, asked.length, "duplicate question");
  for (const g of guides) {
    metaOk(g);
    assert.ok(g.questions.length >= 5, g.slug);
    assert.ok(g.services.every((s) => slugs.includes(s)), g.slug);
    assert.ok(g.sources.length >= 1 && g.sources.every((x) => x.url.startsWith("https://")), g.slug);
  }
  for (const s of slugs) assert.ok(guides.some((g) => g.services.includes(s)), s);
});

test("guides do not publish unverified prices or credentials", () => {
  const text = JSON.stringify(guides) + JSON.stringify(serviceDetails);
  assert.doesNotMatch(text, /\$\d/);
  assert.doesNotMatch(text, /fully licensed|licensed and insured/i);
});

test("parish, project, and cost templates stay unpublished", () => {
  assert.deepEqual(parishes.map((p) => p.slug).sort(), ["acadia", "iberia", "lafayette", "st-martin", "vermilion"]);
  assert.ok(parishes.every((p) => !p.published));
  assert.ok(projectStudies.every((p) => !p.published));
  assert.ok(costGuides.length >= 7 && costGuides.every((c) => !c.published && c.priceRows.length === 0));
  for (const item of [...parishes, ...costGuides]) metaOk(item);
});

test("unpublished pages are removed from the public build", () => {
  assert.ok(existsSync(new URL("../scripts/prune-drafts.mjs", import.meta.url)));
  assert.match(read("package.json"), /next build && node scripts\/prune-drafts\.mjs && node scripts\/csp\.mjs/);
  assert.match(read("scripts/prune-drafts.mjs"), /coastal-draft/);
  assert.match(read("scripts/prune-drafts.mjs"), /SHOW_DRAFTS/);
});

test("the review template cannot invent ratings", () => {
  const page = read("app/reviews/page.tsx");
  assert.doesNotMatch(page, /AggregateRating|ratingValue/);
  assert.match(page, /reviews\.length/);
});

test("service links point to the new pages", () => {
  for (const file of ["components/Footer.tsx", "components/Nav.tsx", "components/ServiceCards.tsx"]) {
    assert.match(read(file), /\/services\/\$\{/);
    assert.doesNotMatch(read(file), /\/services#\$\{/);
  }
});

test("the sitemap lists only published content", () => {
  const sitemap = read("app/sitemap.ts");
  assert.match(sitemap, /serviceDetails/);
  assert.match(sitemap, /guides/);
  assert.match(sitemap, /\.filter\(\(\w+\) => \w+\.published\)/);
});
