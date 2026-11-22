import assert from "node:assert/strict";
import { test } from "node:test";
import { isTextEntry, quoteHref } from "../lib/mobileBar.ts";

test("quote target depends on the page", () => {
  assert.equal(quoteHref("/"), "/contact");
  assert.equal(quoteHref("/contact"), "#contact-form");
});

test("the bar hides for keyboard fields, not buttons", () => {
  assert.equal(isTextEntry("INPUT", "email"), true);
  assert.equal(isTextEntry("TEXTAREA"), true);
  assert.equal(isTextEntry("SELECT"), true);
  assert.equal(isTextEntry("INPUT", "submit"), false);
  assert.equal(isTextEntry("BUTTON"), false);
  assert.equal(isTextEntry(undefined), false);
});
