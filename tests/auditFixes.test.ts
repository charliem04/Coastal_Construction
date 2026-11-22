import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const css = read("app/globals.css");
const channel = (v: number) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("the hero quote button goes straight to the form", () => {
  const hero = read("components/Hero.tsx");
  assert.match(hero, /<Link\s+href="\/contact#contact-form"/);
  assert.doesNotMatch(hero, /href="#contact"/);
});

test("small red text meets AA on every dark surface", () => {
  assert.match(read("tailwind.config.ts"), /text: "#f87171"/);
  for (const ground of ["#000000", "#0a0a0a", "#1a1a1a", "#2a2a2a"]) {
    assert.ok(ratio("#f87171", ground) >= 4.5, ground);
  }
  assert.ok(ratio("#ffffff", "#dc2626") >= 4.5);
  assert.match(css, /\.form-group label[\s\S]*?color: theme\("colors\.brand\.text"\)/);
  assert.match(read("app/privacy/page.tsx"), /const link = "text-brand-text underline/);
});

test("desktop nav has call and quote actions", () => {
  const nav = read("components/Nav.tsx");
  assert.match(nav, /className="nav-actions"/);
  assert.match(nav, /href=\{phoneHref\}/);
  assert.match(nav, /href=\{quoteHref\(path\)\}/);
  assert.match(css, /max-width: 968px\)[\s\S]*\.nav-actions \{\s*display: none;/);
});

test("the services page has jump links to all services", () => {
  const page = read("app/services/page.tsx");
  assert.match(page, /<ServiceJump \/>/);
  const jump = read("components/ServiceJump.tsx");
  assert.match(jump, /services\.map/);
  assert.match(jump, /href=\{`#\$\{s\.slug\}`\}/);
  assert.match(jump, /aria-label=\{/);
});

test("small controls have usable targets", () => {
  assert.match(css, /\.site-nav \.nav-links a \{[\s\S]*?min-height: 32px;/);
  assert.match(css, /\.footer-column li a,\s*\.footer-column > a,\s*\.footer-legal a \{[\s\S]*?min-height: 28px;/);
});

test("the smallest nav text is readable", () => {
  assert.match(css, /\.site-nav \.nav-subtitle \{\s*font-size: 0\.75rem;/);
});

test("form rows have even spacing", () => {
  assert.match(css, /\.form-row \{\s*row-gap: 0;/);
});

test("animations avoid transition-all and layout properties", () => {
  assert.doesNotMatch(css, /transition-all/);
  assert.doesNotMatch(css, /transition: (width|height|max-height)\b/);
  assert.doesNotMatch(css, /transition:[^;]*\b(width|height|max-height) 0\./);
  assert.match(css, /\.site-nav\.is-condensed \{[\s\S]*?clip-path:/);
});
