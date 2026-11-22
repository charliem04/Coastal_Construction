import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { isCurrentPageClick } from "../lib/transitionRoute.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const css = read("app/globals.css");
const base = { origin: "https://site.test", currentPath: "/about", button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, download: false, reducedMotion: false };

test("a plain click on the current page is recognised during a transition", () => {
  assert.equal(isCurrentPageClick({ ...base, href: "https://site.test/about" }), true);
  assert.equal(isCurrentPageClick({ ...base, href: "https://site.test/about#story" }), true);
  assert.equal(isCurrentPageClick({ ...base, href: "https://site.test/contact" }), false);
  assert.equal(isCurrentPageClick({ ...base, href: "https://site.test/about", ctrlKey: true }), false);
  assert.equal(isCurrentPageClick({ ...base, href: "tel:+13373808091" }), false);
});

test("Back or Forward always clears a running blade", () => {
  assert.match(read("components/PageTransition.tsx"), /const onPopState = \(\) => \{\s*if \(active\) finish\(\);/);
});

test("focused controls scroll clear of the mobile bar", () => {
  assert.match(css, /scroll-padding-bottom: calc\(56px \+ env\(safe-area-inset-bottom\) \+ 12px\)/);
});

test("the phone safe area is active", () => {
  assert.match(read("app/layout.tsx"), /viewportFit: "cover"/);
  assert.match(css, /padding-left: env\(safe-area-inset-left\)/);
  assert.match(css, /padding-right: env\(safe-area-inset-right\)/);
});

test("the reviews ribbon matches the dark band", () => {
  assert.match(css, /\.reviews-scroll-container \{\s*background: theme\("colors\.surface\.900"\)/);
});

test("the condensed phone nav removes hidden links from the tab order", () => {
  assert.match(css, /\.nav-menu \{[\s\S]*?visibility: hidden;/);
});

test("closing call and quote buttons never wait for a reveal", () => {
  const band = read("components/CtaBand.tsx");
  assert.ok(band.indexOf('className="cta-buttons-group"') > band.indexOf("</Reveal>"));
  const home = read("app/page.tsx");
  assert.ok(home.indexOf('className="contact-cta-buttons"') > home.lastIndexOf("</Reveal>"));
});
