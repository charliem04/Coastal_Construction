import assert from "node:assert/strict";
import { test } from "node:test";
import { headlineWords } from "../lib/headlineWords.ts";
import { DIG_LAYERS, digProgress, layerOffset, seamProgress } from "../lib/digProgress.ts";

test("headlineWords keeps the red word", () => {
  assert.deepEqual(headlineWords("BUILDING [STRONGER] FOUNDATIONS"), [
    { word: "BUILDING", red: false },
    { word: "STRONGER", red: true },
    { word: "FOUNDATIONS", red: false },
  ]);
});

test("dig progress is clamped and completes at 62% of hero height", () => {
  assert.equal(digProgress(-20, 1000), 0);
  assert.equal(digProgress(620, 1000), 1);
  assert.equal(digProgress(5000, 1000), 1);
});

test("the top layer leaves first and every layer clears", () => {
  assert.equal(layerOffset(0, 0), 0);
  assert.ok(layerOffset(0, 0.3) > layerOffset(3, 0.3));
  DIG_LAYERS.forEach((layer, i) => assert.equal(layerOffset(i, 1), 236 - layer.base));
});

test("the seam draws only as the last layer clears", () => {
  assert.equal(seamProgress(0.78), 0);
  assert.equal(seamProgress(1), 1);
});
