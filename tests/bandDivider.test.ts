import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { BAND_COLORS, bandProgress } from "../lib/digProgress.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the band divider stays piled until it enters the viewport", () => {
  assert.equal(bandProgress(900, 800, 1000), 0);
  assert.equal(bandProgress(800, 800, 1000), 0);
});

test("the band divider finishes 40% of the way up the viewport", () => {
  assert.equal(bandProgress(320, 800, 1000), 1);
});

test("the band divider can always finish before the page ends", () => {
  assert.equal(bandProgress(500, 800, 0), 1);
  assert.ok(Math.abs(bandProgress(600, 800, 100) - 2 / 3) < 0.001);
});

test("the lowest dirt layer blends into the red banner", () => {
  assert.equal(BAND_COLORS.length, 4);
  assert.equal(BAND_COLORS[3], "#dc2626");
});

test("Services and About opt into the dirt divider, and the 404 does not", () => {
  assert.match(read("app/services/page.tsx"), /<CtaBand[\s\S]*?dirtDivider/);
  assert.match(read("app/about/page.tsx"), /<CtaBand[\s\S]*?dirtDivider/);
  assert.doesNotMatch(read("app/not-found.tsx"), /dirtDivider/);
});
