import assert from "node:assert/strict";
import { test } from "node:test";
import { motionEase, motionTiming, reveal } from "../lib/motion.ts";

test("motion tokens match the approved demo", () => {
  assert.deepEqual(motionEase, [0.2, 0.8, 0.2, 1]);
  assert.equal(reveal.rise, 26);
  assert.equal(reveal.duration, 0.7);
  assert.equal(reveal.viewport.once, true);
  assert.equal(motionTiming.stagger, 0.09);
  assert.equal(motionTiming.hover, 0.3);
});
