import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the dirt divider uses the shared laser layers", () => {
  const divider = read("components/ExcavationDivider.tsx");
  assert.match(divider, /<LaserLayers \/>/);
  assert.match(divider, /tick-rule dig-laser/);
  assert.doesNotMatch(divider, /dig-seam/);
  assert.match(read("components/survey/TickRule.tsx"), /<LaserLayers \/>/);
});

test("scroll drives the laser and its finishing flash", () => {
  const divider = read("components/ExcavationDivider.tsx");
  assert.match(divider, /setProperty\("--draw", String\(draw\)\)/);
  assert.match(divider, /classList\.toggle\("is-lit", draw === 1\)/);
});

test("the still dirt pile does not get a finished laser line", () => {
  assert.match(read("app/layout.tsx"), /\.tick-rule:not\(\.dig-laser\)\{--draw:1!important\}/);
  const css = read("app/globals.css");
  assert.match(css, /prefers-reduced-motion: reduce\)[\s\S]*\.tick-rule:not\(\.dig-laser\) \{\s*--draw: 1 !important;/);
  assert.doesNotMatch(css, /\.dig-seam/);
});
