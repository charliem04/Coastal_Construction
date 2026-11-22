import assert from "node:assert/strict";
import { test } from "node:test";
import { BLADE, latestPending, pushAt } from "../lib/bladeTimeline.ts";
import { shouldRunTransition } from "../lib/transitionRoute.ts";

const base = { origin: "https://site.test", currentPath: "/", button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, download: false, reducedMotion: false };
const run = (href: string, extra = {}) => shouldRunTransition({ ...base, href, ...extra });

test("internal page links transition", () => {
  assert.equal(run("https://site.test/services"), true);
  assert.equal(run("https://site.test/services#site-pads"), true);
});

test("excluded navigations do not transition", () => {
  assert.equal(run("https://site.test/#contact"), false);
  assert.equal(run("https://other.test/"), false);
  assert.equal(run("tel:+13373808091"), false);
  assert.equal(run("mailto:a@b.test"), false);
  assert.equal(run("https://site.test/services", { ctrlKey: true }), false);
  assert.equal(run("https://site.test/services", { target: "_blank" }), false);
  assert.equal(run("https://site.test/services", { download: true }), false);
  assert.equal(run("https://site.test/services", { reducedMotion: true }), false);
});

test("timing matches the approved blade", () => {
  assert.deepEqual(BLADE, { cover: 190, hold: 40, clear: 560, total: 790 });
  assert.equal(pushAt(), 208);
});

test("newest destination wins until the route is pushed", () => {
  assert.equal(latestPending("/about", "/contact", false), "/contact");
  assert.equal(latestPending("/about", "/contact", true), "/about");
});
