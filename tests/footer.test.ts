import assert from "node:assert/strict";
import { test } from "node:test";
import { footerHours } from "../lib/footerLinks.ts";

test("footer hours omit N/A days", () => {
  assert.deepEqual(
    footerHours(["Monday - Friday: 7:00 AM - 6:00 PM", "Saturday: N/A", "Sunday: N/A"]),
    ["Monday - Friday: 7:00 AM - 6:00 PM"]
  );
});
