import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const css = read("app/globals.css");
const nav = read("components/Nav.tsx");

test("the quote action is a full-height blade that crops as the bar condenses", () => {
  assert.match(css, /\.nav-quote \{[\s\S]*?clip-path: polygon\(30px 0, 100% 0, 100% 100%, 0 100%\);/);
  assert.match(css, /\.is-condensed \.nav-quote \{[\s\S]*?clip-path: polygon\(/);
});

test("condensing the bar does not clip its dropdown", () => {
  assert.doesNotMatch(css, /\.site-nav\.is-condensed \{\s*clip-path/);
  assert.match(css, /\.site-nav::before \{[\s\S]*?transform-origin: top;/);
  assert.match(css, /\.is-condensed::before \{\s*transform: scaleY\(var\(--nav-scale\)\);/);
});

test("the Services dropdown is a keyboard-operable disclosure", () => {
  assert.match(nav, /aria-expanded=\{servicesOpen\}/);
  assert.match(nav, /aria-controls="nav-services"/);
  assert.match(nav, /e\.key !== "Escape"/);
  assert.match(nav, /\/services\/\$\{s\.slug\}/);
});

test("the phone menu is a labeled dialog-style panel that isolates the page", () => {
  assert.match(nav, /aria-expanded=\{menuOpen\}/);
  assert.match(nav, /aria-controls="nav-menu"/);
  assert.match(nav, /\.inert = true/);
  assert.match(nav, /max-width: 968px|min-width: 969px/);
});

test("the phone bar keeps its brand from filling the row", () => {
  assert.doesNotMatch(css, /\.site-nav \.nav-brand,\s*\.site-nav \.nav-links \{\s*@apply w-full/);
});

test("the opened phone menu can receive focus immediately", () => {
  assert.match(css, /\.nav-menu\.is-open \{[\s\S]*?transition: opacity 0\.2s, transform 0\.25s var\(--ease-punch\), visibility 0s;/);
});

test("the no-JavaScript phone nav cannot overflow", () => {
  assert.match(read("app/layout.tsx"), /\.site-nav \.nav-links\{display:flex!important;width:100%;margin:0!important;flex-wrap:wrap!important;/);
  assert.match(read("app/layout.tsx"), /\.nav-drop,\.nav-drop-toggle\{display:none!important\}/);
});

test("service names reach the nav without bundling full service copy", () => {
  assert.doesNotMatch(nav, /@\/content\/services/);
  assert.match(read("app/layout.tsx"), /<Nav serviceLinks=\{serviceLinks\} \/>/);
  assert.match(read("app/layout.tsx"), /services\.map\(\(\{ slug, name \}\) => \(\{ slug, name \}\)\)/);
});
