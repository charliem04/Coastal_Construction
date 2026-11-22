import assert from "node:assert/strict";
import { test } from "node:test";
import { parseStat } from "../lib/stat.ts";

test("parseStat reads the real stats", () => {
  assert.deepEqual(parseStat("500+"), { number: 500, suffix: "+" });
  assert.deepEqual(parseStat("100%"), { number: 100, suffix: "%" });
  assert.deepEqual(parseStat("15+"), { number: 15, suffix: "+" });
  assert.equal(parseStat("Licensed"), null);
});
