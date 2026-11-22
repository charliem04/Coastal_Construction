import assert from "node:assert/strict";
import { test } from "node:test";
import { sliderKey } from "../lib/slider.ts";

test("slider keyboard control", () => {
  assert.equal(sliderKey(50, "ArrowLeft"), 45);
  assert.equal(sliderKey(50, "ArrowRight"), 55);
  assert.equal(sliderKey(2, "ArrowLeft"), 0);
  assert.equal(sliderKey(98, "ArrowRight"), 100);
  assert.equal(sliderKey(50, "Home"), 0);
  assert.equal(sliderKey(50, "End"), 100);
  assert.equal(sliderKey(50, "x"), 50);
});
