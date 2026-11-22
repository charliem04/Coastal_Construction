import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { guides } from "../content/guides.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the weather cluster is complete and sourced", () => {
  const weather = guides.filter((g) => g.category === "Weather & Wet Ground");
  assert.equal(weather.length, 6);
  for (const g of weather) {
    assert.ok(g.questions.length >= 7, g.slug);
    assert.ok(g.sources.length >= 3, g.slug);
  }
});

test("the radar stays light and defers to official warnings", () => {
  const radar = read("components/content/RadarPanel.tsx");
  assert.match(radar, /loading="lazy"/);
  assert.match(radar, /useState\(false\)/);
  assert.match(radar, /onError/);
  assert.match(radar, /warnings and safety decisions/);
});

test("only the weather page's radar origin is allowed for images", () => {
  assert.match(read("scripts/csp.mjs"), /img-src 'self' data: https:\/\/radar\.weather\.gov"/);
  assert.match(read("app/sitemap.ts"), /monthly\("\/weather", 0\.7\)/);
});
