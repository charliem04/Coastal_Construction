import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { laserEase, motionTiming } from "../lib/motion.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const css = read("app/globals.css");

test("the laser timing is a shared motion token", () => {
  assert.equal(motionTiming.laser, 1.2);
  assert.deepEqual(laserEase, [0.65, 0, 0.35, 1]);
});

test("the ruler renders every laser layer", () => {
  const rule = read("components/survey/TickRule.tsx");
  for (const layer of ["laser-ticks", "laser-hot", "laser-beam", "laser-head", "laser-flash"]) {
    assert.match(rule, new RegExp(layer));
  }
  assert.match(rule, /is-lit/);
});

test("the ticks are revealed by the laser position", () => {
  assert.match(css, /\.laser-ticks \{[\s\S]*?clip-path: inset\(-2px calc\(\(1 - var\(--draw, 1\)\) \* 100%\) -2px 0\);/);
});

test("banner rulers restyle through variables", () => {
  assert.match(css, /\.banner-ticks \{[\s\S]*?--tick: rgb\(255 255 255 \/ 0\.62\);/);
  assert.match(css, /\.cta-ticks \{[\s\S]*?--tick: rgb\(255 255 255 \/ 0\.62\);/);
});

test("the phone process line draws downward", () => {
  assert.match(css, /\.process-line \.laser-ticks \{[\s\S]*?clip-path: inset\(0 0 calc\(\(1 - var\(--draw, 1\)\) \* 100%\) 0\);/);
});

test("rulers are complete without JavaScript or motion", () => {
  assert.match(read("app/layout.tsx"), /\.tick-rule\{--draw:1!important\}/);
  assert.match(css, /prefers-reduced-motion: reduce\)[\s\S]*\.tick-rule \{\s*--draw: 1 !important;/);
});
