import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { BLADE_EDGE, edgePaths, swipeX } from "../lib/bladeEdge.ts";

test("the slant travels left to right and stops at its resting place", () => {
  assert.equal(swipeX(0), BLADE_EDGE.start);
  assert.equal(swipeX(1), BLADE_EDGE.rest);
  assert.equal(swipeX(-1), BLADE_EDGE.start);
  assert.equal(swipeX(2), BLADE_EDGE.rest);
  assert.ok(swipeX(0.25) < swipeX(0.5) && swipeX(0.5) < swipeX(0.75));
});

test("the slant starts off screen", () => {
  assert.ok(BLADE_EDGE.start + 52 < 0);
});

test("the resting edge matches the approved shape", () => {
  assert.deepEqual(edgePaths(760), {
    accent: "M0 34H760L812 4H1200V0H806L756 28H0Z",
    fill: "M0 46V34H760L812 4H1200V46Z",
    line: "M0 34H760L812 4H1200",
  });
});

test("the server-rendered edge is the finished shape", () => {
  const source = readFileSync(new URL("../components/survey/BladeEdge.tsx", import.meta.url), "utf8");
  assert.match(source, /edgePaths\(BLADE_EDGE\.rest\)/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /IntersectionObserver/);
});
