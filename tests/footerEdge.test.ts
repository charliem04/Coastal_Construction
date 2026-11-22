import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the footer uses the blade edge instead of the ruler", () => {
  const footer = read("components/Footer.tsx");
  assert.match(footer, /<BladeEdge \/>/);
  assert.doesNotMatch(footer, /TickRule/);
  assert.doesNotMatch(read("app/globals.css"), /\.footer-ticks/);
});

test("the blade edge is decorative and can rise above the footer", () => {
  assert.match(read("components/survey/BladeEdge.tsx"), /aria-hidden="true"/);
  assert.match(read("app/globals.css"), /\.footer-blade \{[\s\S]*?bottom: calc\(100% - 1px\);[\s\S]*?pointer-events: none;/);
  assert.match(read("app/globals.css"), /\.site-footer \{\s*overflow: visible;/);
});
