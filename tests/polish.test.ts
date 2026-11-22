import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const css = read("app/globals.css");

test("reduced motion removes entrance delays", () => {
  assert.match(css, /animation-duration: 0\.001ms !important;\s*animation-delay: 0s !important;/);
});

test("the hero entrance does not hold the button's transform", () => {
  assert.match(css, /\.hero-in \{\s*animation: hero-fade 0\.7s var\(--ease-punch\) backwards;/);
});

test("the map frame is fully drawn when it cannot animate", () => {
  assert.match(read("app/layout.tsx"), /\.survey-frame-line rect\{stroke-dasharray:none!important/);
  assert.match(css, /prefers-reduced-motion: reduce\)[\s\S]*\.survey-frame-line rect \{\s*stroke-dasharray: none !important;/);
});

test("tick rules draw through an axis-independent value", () => {
  assert.match(read("components/survey/TickRule.tsx"), /"--draw": 0/);
  assert.match(css, /\.tick-rule \{[\s\S]*?transform: scaleX\(var\(--draw, 1\)\);/);
  assert.match(css, /\.process-line \{[\s\S]*?transform: scaleY\(var\(--draw, 1\)\);/);
});

test("the process list contains only list items", () => {
  const source = read("components/HowWeWork.tsx");
  assert.ok(source.indexOf("<TickRule") < source.indexOf('<ol className="process-steps">'));
});

test("feature-list reveals can move", () => {
  assert.doesNotMatch(read("app/services/page.tsx"), /className="inline"/);
});

test("service notes use the body font", () => {
  assert.match(css, /\.service-note \{\s*@apply font-body font-normal;/);
});

test("the README states the Node version tests need", () => {
  assert.match(read("README.md"), /Node 22\.18/);
});

test("the CSP comment reflects self-hosted fonts", () => {
  const csp = read("scripts/csp.mjs");
  assert.doesNotMatch(csp, /No web fonts/);
  assert.match(csp, /Self-hosted Anton and Barlow Condensed/);
});
