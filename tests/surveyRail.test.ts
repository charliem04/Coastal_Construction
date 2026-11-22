import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const css = read("app/globals.css");
const rail = css.slice(css.indexOf("Survey Rail"));

test("the rail is a decorative layer in the nav", () => {
  assert.match(read("components/Nav.tsx"), /<span className="nav-rail" aria-hidden="true" \/>/);
  assert.match(rail, /\.nav-rail \{\s*display: none;/);
});

test("the phone rail floats without taking page height", () => {
  assert.match(rail, /max-width: 968px[\s\S]*\.site-nav-shell \{\s*height: 0;/);
  assert.match(rail, /--nav-offset: 80px;\s*--nav-condensed: 60px;/);
});

test("the rail docks by clipping, not by changing layout", () => {
  assert.match(rail, /\.nav-rail \{[\s\S]*?clip-path: inset\(8px\);/);
  assert.match(rail, /\.is-condensed \.nav-rail \{\s*clip-path: inset\(0 0 20px 0\);/);
});

test("page content clears the floating rail and bottom bar", () => {
  assert.match(rail, /\.hero \{[\s\S]*?min-height: calc\(100svh - 56px - env\(safe-area-inset-bottom\)\);[\s\S]*?padding-top: calc\(var\(--nav-offset\) \+ 16px\);/);
});

test("the open menu covers the rail while brand and close stay on top", () => {
  assert.match(rail, /\.nav-menu,\s*\.is-condensed \.nav-menu \{[\s\S]*?top: 0;/);
  assert.match(rail, /\.site-nav \.nav-brand,\s*\.nav-burger \{[\s\S]*?z-index: 6;/);
});

test("the rail has a no-JavaScript fallback", () => {
  assert.match(read("app/layout.tsx"), /\.nav-rail,\.site-nav::before,\.site-nav::after\{display:none!important\}/);
});
