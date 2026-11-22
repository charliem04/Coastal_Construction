# Coastal Visual and Motion Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved Survey visual system, site-wide motion, excavation divider, Dozer blade page transition, and conversion/layout upgrades to the Coastal Next.js site.

**Architecture:** Pure geometry and decision logic lives in small `lib/` modules covered by Node's test runner. Server components keep rendering all content; small client components add motion after hydration. CSS owns first paint, hovers, and decoration, while Framer Motion owns viewport reveals and scroll-linked work.

**Tech Stack:** Next.js 14.2.35 static export, React 18.3.1, TypeScript 5.9.3, Tailwind 3.4.17, Framer Motion 11.18.2, Canvas 2D, `node:test`.

**Spec:** `docs/superpowers/specs/2026-11-21-visual-motion-upgrade-design.md`

**Visual references:** `docs/superpowers/specs/2026-11-21-visual-motion-demo.html` and `docs/superpowers/specs/2026-11-21-page-transition-demo.html` (option C only). Copy look and timing, not prototype code.

## Global Constraints

- Work on branch `feat/visual-motion-upgrade`. Do not push, deploy, or merge.
- End every commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- No dependency additions except the font files handled in Task 11. Do not add Lenis.
- Every business fact and line of copy comes from `client.config.ts` or `content/`.
- Red, black, and white stay the palette. Dirt browns appear only in the page transition.
- Small marker text must not use brand red on dark (`#dc2626` on `#0a0a0a` is about 4.1:1).
- Never imply land surveying is a service. Survey styling is visual only.
- Decoration is `aria-hidden` and `pointer-events: none`.
- Do not branch rendered markup on `useReducedMotion()` during first render. Use `useStillness()`.
- All content remains visible with reduced motion and without JavaScript.
- Hero text and photo never wait for hydration.
- Use `LazyMotion` with `m` for element animation. Keep client boundaries small.
- Keep the 968px and 768px breakpoints and existing focus states.
- CSP in `scripts/csp.mjs` should not need a new origin.

## Review Focus

1. Browser Back/Forward during or after a transition: the page changes normally, with no blade and no stuck overlay. Pinned in Task 9.
2. A second link clicked while the blade is running: the newest destination wins before the route push, and exactly one navigation happens. Pinned in Task 9.
3. Tab backgrounded or animation frames stalled mid-transition: navigation still completes and the overlay clears. Pinned in Task 9.
4. Short landscape phones and laptops: the dirt divider stays at least 32px below the hero button. Pinned in Task 3.
5. Phone keyboard open in the quote form: the mobile bar hides and cannot cover a field or submit button. Pinned in Task 8.

---

### Task 1: Foundation, test runner, and motion tokens

**Files:**
- Modify: `package.json`, `tsconfig.json`, `lib/motion.ts`, `components/Reveal.tsx`, `app/globals.css`
- Create: `lib/useStillness.ts`, `tests/motion.test.ts`

**Interfaces:**
- Produces: `reveal`, `motionEase`, `motionTiming` from `lib/motion.ts`; `useStillness(): boolean`; `<Reveal delay?: number>`.

- [ ] **Step 1: Prepare the branch and dependencies**

Run: `git switch -c feat/visual-motion-upgrade`, then `npm ci`, then `npm run typecheck`
Expected: branch created and typecheck exits 0. `node_modules` is currently absent, so `npm ci` is required.

- [ ] **Step 2: Add the test script and TS extension support**

Add `"test": "node --test \"tests/**/*.test.ts\""` to `package.json`. Add `"allowImportingTsExtensions": true` to `tsconfig.json`. Tests import pure modules with explicit `.ts` paths; those modules must not use the `@/` alias.

- [ ] **Step 3: Write the failing test**

```ts
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
```

- [ ] **Step 4: Run it**

Run: `npm test`
Expected: FAIL because `motionEase` is not exported.

- [ ] **Step 5: Implement tokens, hook, and Reveal**

Export the tested tokens from `lib/motion.ts`, with `reveal.ease = motionEase` and the existing viewport object. Port `useStillness()` from `../Site_Base/white-label-template/site/lib/useScrollMotion.ts`. Add optional `delay` seconds to `Reveal`. Add `--ease-punch: cubic-bezier(.2,.8,.2,1)` to `:root` in `globals.css`.

- [ ] **Step 6: Verify and commit**

Run: `npm test`, then `npm run typecheck`
Expected: both pass.

```bash
git add package.json package-lock.json tsconfig.json lib/motion.ts lib/useStillness.ts components/Reveal.tsx app/globals.css tests/motion.test.ts docs/superpowers
git commit -m "Add motion tokens, stillness gate, and test runner"
```

---

### Task 2: Survey decoration primitives

**Files:**
- Create: `components/survey/SectionMarker.tsx`, `components/survey/TickRule.tsx`, `components/survey/CornerBrackets.tsx`, `public/contours.svg`
- Modify: `app/globals.css`, `client.config.ts`

**Interfaces:**
- Produces: `<SectionMarker index="01" label={string} align?: "center" | "left" />`, `<TickRule className?: string />`, `<CornerBrackets />`, CSS class `.band-contours`.
- Produces: config labels at `client.markers`: `services: "Services"`, `process: "How We Work"`, `why: "Why Coastal"`, `area: "Coverage"`.

- [ ] **Step 1: Implement primitives**

`SectionMarker` renders a red CSS crosshair and `{index} / {label}` in `brand-light` or gray-300. `TickRule` draws a 11px tick pattern with a red base and scales in once using CSS when its reveal parent is visible. `CornerBrackets` places two 18px white corners, extending to 30px and red when an ancestor with `.has-brackets` is hovered or contains focus. `.band-contours::before` uses `/contours.svg` at about 0.11 opacity. Generate `contours.svg` once from the demo's `blob()` values as static paths.

- [ ] **Step 2: Verify and commit**

Run: `npm run typecheck`
Expected: pass.

```bash
git add components/survey public/contours.svg app/globals.css client.config.ts
git commit -m "Add survey markers, ticks, brackets, and contours"
```

---

### Task 3: Tight hero and excavation divider

**Files:**
- Create: `lib/headlineWords.ts`, `lib/digProgress.ts`, `components/ExcavationDivider.tsx`, `tests/hero.test.ts`
- Modify: `components/Hero.tsx`, `client.config.ts`, `app/globals.css`

**Interfaces:**
- Produces: `headlineWords(text: string): { word: string; red: boolean }[]`.
- Produces: `DIG_LAYERS: readonly { color: string; base: number; freq: number; phase: number }[]`, `digProgress(scrollY: number, heroHeight: number): number`, `layerOffset(index: number, progress: number): number`, `seamProgress(progress: number): number`, `layerPath(index: number): string`.

- [ ] **Step 1: Write failing tests**

```ts
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
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: FAIL because modules are missing.

- [ ] **Step 3: Implement logic**

Use the demo's layers: `#b91c1c/34/.0048/1`, `#7f1d1d/86/.0039/2.4`, `#431411/136/.0056/.6`, `#190b0a/184/.0044/3.3`, viewBox `1600x220`. Layer timing is `smooth(clamp((p - i * 0.2) / 0.4))`; seam timing is `smooth(clamp((p - 0.78) / 0.22))`.

- [ ] **Step 4: Rebuild the hero**

`Hero` renders only logo, `h1` from `headlineWords`, subhead, and quote button, plus `ExcavationDivider`. Remove `wordmark`, `subtitle`, and `tagline` from `client.home.hero` only; `client.nav.wordmark` stays. Remove `.logo`, `.logo-subtitle`, and `.tagline` CSS, but keep `.hero-sub`, which shares the `.tagline` rule today. Hero entrance is CSS-only and does not hide the photo. Each word uses a masked rise with `calc(.2s + var(--i) * .09s)`.

- [ ] **Step 5: Implement `ExcavationDivider`**

Server-render all layers in their piled state. After mount, update path transforms and seam `scaleX` through refs from `useMotionValueEvent(scrollY, "change")`. Under `useStillness()`, leave the pile still and keep the seam at 0. Reserve hero bottom space so the highest dirt peak is at least 32px under the button.

- [ ] **Step 6: Verify clearance in the browser**

At 1440x900, 1366x640, 844x390, 390x844, and 320x568, assert `button.getBoundingClientRect().bottom + 32 <= highestDirtPathTop`.
Expected: true at every size, with no horizontal overflow.

- [ ] **Step 7: Verify and commit**

Run: `npm test`, then `npm run typecheck`
Expected: pass.

```bash
git add lib/headlineWords.ts lib/digProgress.ts components/ExcavationDivider.tsx components/Hero.tsx client.config.ts app/globals.css tests/hero.test.ts
git commit -m "Tighten the hero and add the excavation divider"
```

---

### Task 4: Home sections and shared reveals

**Files:**
- Create: `lib/stat.ts`, `components/CountUpStat.tsx`, `tests/stat.test.ts`
- Modify: `app/page.tsx`, `components/ServiceCards.tsx`, `components/Reviews.tsx`, `components/ServiceArea.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: Task 1 and Task 2 primitives.
- Produces: `parseStat(value: string): { number: number; suffix: string } | null`, `<CountUpStat value={string} />`.

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseStat } from "../lib/stat.ts";

test("parseStat reads the real stats", () => {
  assert.deepEqual(parseStat("500+"), { number: 500, suffix: "+" });
  assert.deepEqual(parseStat("100%"), { number: 100, suffix: "%" });
  assert.deepEqual(parseStat("15+"), { number: 15, suffix: "+" });
  assert.equal(parseStat("Licensed"), null);
});
```

- [ ] **Step 2: Run it**

Run: `npm test`
Expected: FAIL because `lib/stat.ts` is missing.

- [ ] **Step 3: Implement stats and section treatments**

`CountUpStat` server-renders the true value and counts only after entering view when not still. Service cards use photo plus always-visible name and blurb below, with `CornerBrackets`, keeping all nine links. Remove `.portfolio-overlay` and `tap-pulse`. Stats panel gets contours and a 12px offset black shadow. Reviews get only an entrance and card polish; their JS behavior does not change. Banner and closing CTA get tick edges and reveals.

- [ ] **Step 4: Add the service-area frame**

Draw the survey line and stake markers around `.parishes-map`, outside the iframe's interactive area. Nothing crosses the map.

- [ ] **Step 5: Verify and commit**

Run: `npm test`, then `npm run typecheck`
Expected: pass. In a browser, the map can pan and every card opens its `/services#slug`.

```bash
git add lib/stat.ts components/CountUpStat.tsx tests/stat.test.ts app/page.tsx components/ServiceCards.tsx components/Reviews.tsx components/ServiceArea.tsx app/globals.css
git commit -m "Apply survey treatment and motion to home sections"
```

---

### Task 5: Inner page treatments

**Files:**
- Modify: `components/PageHeader.tsx`, `components/CtaBand.tsx`, `app/services/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: `Reveal`, `TickRule`, `CornerBrackets`.

- [ ] **Step 1: Apply treatments**

Page headers get a CSS headline entrance and tick rule. Services photos get brackets and feature lists a light stagger. About gets owner-photo brackets and staggered values. Contact method and info cards reveal lightly. Do not animate the form, form fields, booking controls, or submission states. Privacy gets the shared header only.

- [ ] **Step 2: Verify and commit**

Run: `npm run typecheck`
Expected: pass. Browser: `/services#demolition`, `/about`, `/contact`, and `/privacy` show all content immediately or on scroll, and the form accepts input.

```bash
git add components/PageHeader.tsx components/CtaBand.tsx app/services/page.tsx app/about/page.tsx app/contact/page.tsx app/globals.css
git commit -m "Apply survey treatment to inner pages"
```

---

### Task 6: Nav condense and scroll progress

**Files:**
- Create: `components/ScrollProgress.tsx`
- Modify: `components/Nav.tsx`, `app/layout.tsx`, `app/globals.css`

**Interfaces:**
- Produces: stable CSS variable `--nav-offset`, used by anchor offsets and sticky elements.

- [ ] **Step 1: Implement**

Condense the visual nav after 30px of scroll without changing the document flow height. Replace `scroll-margin-top: 150px` and sticky `top-[180px]` with values based on `--nav-offset`. Make the phone nav compact enough to work alongside the Task 8 bar. `ScrollProgress` is a 3px fixed red bar using `scaleX`.

- [ ] **Step 2: Verify and commit**

Browser: scrolling across the threshold causes no content jump, and `/services#levee-creation` lands with its heading visible under the nav at desktop and phone sizes.

Run: `npm run typecheck`
Expected: pass.

```bash
git add components/ScrollProgress.tsx components/Nav.tsx app/layout.tsx app/globals.css
git commit -m "Condense nav on scroll and add scroll progress"
```

---

### Task 7: Custom icons and real footer

**Files:**
- Create: `components/icons.tsx`, `lib/footerLinks.ts`, `tests/footer.test.ts`
- Modify: `components/Footer.tsx`, `components/ServiceArea.tsx`, `app/contact/page.tsx`, `client.config.ts`, `app/globals.css`

**Interfaces:**
- Produces: `PhoneIcon`, `MailIcon`, `CalendarIcon`, `PinIcon`, each accepting `{ className?: string }` and rendering `aria-hidden`.
- Produces: `footerHours(lines: readonly string[]): string[]`.

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { footerHours } from "../lib/footerLinks.ts";

test("footer hours omit N/A days", () => {
  assert.deepEqual(
    footerHours(["Monday - Friday: 7:00 AM - 6:00 PM", "Saturday: N/A", "Sunday: N/A"]),
    ["Monday - Friday: 7:00 AM - 6:00 PM"]
  );
});
```

- [ ] **Step 2: Run it**

Run: `npm test`
Expected: FAIL because `footerLinks.ts` is missing.

- [ ] **Step 3: Replace emoji**

Use inline red-and-white line SVGs for 📞, ✉️, 📅, and 📍. Remove the `icon` fields from `client.config.ts`. The pin gets one entrance, not an infinite pulse. Keep review stars and check marks.

- [ ] **Step 4: Build the footer**

Sections: brand (logo, name, `/contact` quote button), contact (phone, email, address), hours, nine `/services#slug` links, core parishes linking to `/#service-area`, and legal row. Use labeled `nav` groups and all values from config/content. Show Iberia plus the core tier parishes.

- [ ] **Step 5: Verify and commit**

Run: `npm test`, then `npm run typecheck`
Expected: pass. Grep `app components content client.config.ts` for 📞, ✉, 📅, and 📍 returns nothing.

```bash
git add components/icons.tsx lib/footerLinks.ts tests/footer.test.ts components/Footer.tsx components/ServiceArea.tsx app/contact/page.tsx client.config.ts app/globals.css
git commit -m "Replace emoji with survey icons and build the footer"
```

---

### Task 8: Mobile call bar

**Files:**
- Create: `components/MobileCallBar.tsx`, `lib/mobileBar.ts`, `tests/mobileBar.test.ts`
- Modify: `app/layout.tsx`, `client.config.ts`, `app/globals.css`

**Interfaces:**
- Produces: `quoteHref(pathname: string): "/contact" | "#contact-form"`, `isTextEntry(tagName: string | undefined, type?: string): boolean`.

- [ ] **Step 1: Write failing tests**

```ts
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
```

- [ ] **Step 2: Run them**

Run: `npm test`
Expected: FAIL because `mobileBar.ts` is missing.

- [ ] **Step 3: Implement**

Show at `max-width: 968px` only, with labels `client.mobileBar.call = "Call"` and `client.mobileBar.quote = "Get a Quote"`. Use `phoneHref`, `env(safe-area-inset-bottom)`, `z-index: 1100`, and matching `body` bottom padding. Hide on `focusin` when `isTextEntry` is true and restore on `focusout`.

- [ ] **Step 4: Verify and commit**

Browser at 390x844: bar visible, footer links reachable, and the bar is hidden while a contact field is focused. At 1280px, it is absent.

Run: `npm test`, then `npm run typecheck`
Expected: pass.

```bash
git add components/MobileCallBar.tsx lib/mobileBar.ts tests/mobileBar.test.ts app/layout.tsx client.config.ts app/globals.css
git commit -m "Add mobile call and quote bar"
```

---

### Task 9: Dozer blade page transition

**Files:**
- Create: `lib/transitionRoute.ts`, `lib/bladeTimeline.ts`, `lib/drawBlade.ts`, `components/PageTransition.tsx`, `tests/transition.test.ts`
- Modify: `app/layout.tsx`, `app/globals.css`

**Interfaces:**
- Produces: `shouldRunTransition(input: TransitionInput): boolean`, where `TransitionInput = { href: string; origin: string; currentPath: string; button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; target?: string; download: boolean; reducedMotion: boolean }`.
- Produces: `BLADE = { cover: 190, hold: 40, clear: 560, total: 790 }`, `pushAt(): number` returning `208`, `latestPending(current: string | null, next: string, pushed: boolean): string | null`, `drawBlade(ctx, width, height, ms): void`.

- [ ] **Step 1: Write failing tests**

```ts
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
```

- [ ] **Step 2: Run them**

Run: `npm test`
Expected: FAIL because modules are missing.

- [ ] **Step 3: Implement decisions and drawing**

Implement the tested functions. Port option C's look into `drawBlade`: brown layers `#6b4a2f`, `#533821`, `#3d2817`, `#2a1b10`; red blade, black and white accents, bolts, slight `.14` skew, and limited clods. Cap canvas DPR at `1.5`. Clear must use the same transform as sizing.

- [ ] **Step 4: Implement `PageTransition`**

Mount once in the layout. A capture-phase `document` click listener finds the nearest `a[href]`, calls `shouldRunTransition`, then `preventDefault()`. Schedule `router.push(pending)` with `setTimeout(pushAt())`, so navigation never depends on `requestAnimationFrame`. Draw from wall-clock time. Clear after `BLADE.total` and also through a `1500ms` safety timeout. Do not listen to `popstate`; Back/Forward stays native with no blade. Canvas is fixed, `aria-hidden`, `pointer-events: none`, `z-index: 3000`, and has no size or paint when idle.

- [ ] **Step 5: Exercise failure modes in the browser**

Check: normal nav, Back/Forward, double-clicking two links, backgrounding the tab mid-transition, `/services#site-pads` from home, phone link, booking button, ctrl-click, and reduced motion.
Expected: correct final page, one navigation, no overlay left, and no blade on excluded actions.

- [ ] **Step 6: Verify and commit**

Run: `npm test`, then `npm run typecheck`
Expected: pass.

```bash
git add lib/transitionRoute.ts lib/bladeTimeline.ts lib/drawBlade.ts components/PageTransition.tsx tests/transition.test.ts app/layout.tsx app/globals.css
git commit -m "Add the dozer blade page transition"
```

---

### Task 10: How We Work, before-and-after, and 404

**Files:**
- Create: `components/HowWeWork.tsx`, `components/BeforeAfter.tsx`, `content/projects.ts`, `lib/slider.ts`, `tests/slider.test.ts`
- Modify: `app/page.tsx`, `app/not-found.tsx`, `client.config.ts`, `content/types.ts`, `app/globals.css`

**Interfaces:**
- Produces: `ProjectPair = { service: string; location: string; before: PhotoName; after: PhotoName; beforeAlt: string; afterAlt: string }`, `projectPairs: ProjectPair[] = []`.
- Produces: `sliderKey(value: number, key: string): number`.

- [ ] **Step 1: Write the failing test**

```ts
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
```

- [ ] **Step 2: Run it**

Run: `npm test`
Expected: FAIL because `slider.ts` is missing.

- [ ] **Step 3: Add How We Work**

Place between `ServiceCards` and Why Choose. Add this exact starting copy to `client.home.process` for owner review:

- Assess: "We review your property, project goals, and site conditions."
- Clear: "We remove brush, debris, or structures to prepare the work area."
- Grade: "We shape and level the ground with drainage in mind."
- Finish: "We complete the site so it is ready for what comes next."

A survey line draws through numbered stakes, horizontal above 968px and vertical below. Never use the word "survey" as a service step.

- [ ] **Step 4: Add the slider**

Render directly after How We Work. Return `null` when `projectPairs` is empty. Use a native `input type="range"` overlaid for keyboard and screen-reader support, plus pointer dragging, a red handle, and labeled before/after images. Do not add placeholder or generated photos.

- [ ] **Step 5: Theme the 404**

Set `client.notFound.heading` to `"You've Hit [Unmarked Ground]"`, keep the existing body and link labels, add a small inline survey stake, and retain `robots: { index: false, follow: true }`.

- [ ] **Step 6: Verify and commit**

Temporarily verify the slider with two existing photos in a local-only edit, then restore `projectPairs` to `[]`. Confirm the section disappears.

Run: `npm test`, then `npm run typecheck`
Expected: pass and `git diff -- content/projects.ts` shows no sample pair.

```bash
git add components/HowWeWork.tsx components/BeforeAfter.tsx content/projects.ts content/types.ts lib/slider.ts tests/slider.test.ts app/page.tsx app/not-found.tsx client.config.ts app/globals.css
git commit -m "Add How We Work, before-and-after support, and themed 404"
```

---

### Task 11: Condensed display font

**Files:**
- Create: `app/fonts/<chosen>.woff2`, `app/fonts/<chosen>-LICENSE.txt`, `app/fonts.ts`
- Modify: `app/layout.tsx`, `tailwind.config.ts`, `app/globals.css`

**Interfaces:**
- Produces: `displayFont` from `app/fonts.ts` with CSS variable `--font-display`.

- [ ] **Step 1: Get download approval and compare**

Ask the owner before downloading. State the package names (`@fontsource/anton`, `@fontsource/league-gothic`, `@fontsource/barlow-condensed`), source (npm), and approximate size. Put each in a new empty scratch directory using `npm pack`; do not install or run package scripts. Render the real hero and section headings with each font.

- [ ] **Step 2: Stop for the owner's font choice**

Recommend Anton. Do not continue until the owner picks.

- [ ] **Step 3: Implement the chosen font**

Copy one Latin `woff2` and its OFL license into `app/fonts/`. Use `next/font/local` with `display: "swap"`, `adjustFontFallback: "Arial"`, and `variable: "--font-display"`. Update Tailwind `display` to start with `var(--font-display)`, keeping the current stack as fallback. Body remains Arial.

- [ ] **Step 4: Recheck type fit**

Browser at 1440, 968, 768, 390, and 320px on all routes: tune size and tracking with no heading overflow, clipped words, or broken buttons.

- [ ] **Step 5: Verify and commit**

Run: `npm run typecheck`, then `npm run build`
Expected: pass, including the CSP check, with no external font request in the network log.

```bash
git add app/fonts app/fonts.ts app/layout.tsx tailwind.config.ts app/globals.css
git commit -m "Add self-hosted condensed display font"
```

---

### Task 12: Final verification

**Files:**
- Modify only what a failed check requires.

- [ ] **Step 1: Run automated checks**

Run: `npm test`, `npm run typecheck`, `npm run build`
Expected: all exit 0, including images, CSP, and SEO checks.

- [ ] **Step 2: Check every route**

Serve `out/`. Visit `/`, `/services`, `/about`, `/contact`, `/privacy`, and an unknown path at 1440x900 and 390x844.
Expected: no horizontal overflow, hydration errors, or console errors.

- [ ] **Step 3: Check modes and actions**

Test reduced motion, JavaScript disabled, keyboard-only navigation, form validation without submitting a real lead, booking popup opening without completing a booking, phone links without placing a call, map use, review drag, and `/services#slug` links.
Expected: all content visible and every action works.

- [ ] **Step 4: Compare performance**

Run Lighthouse mobile on `/` from `main` and this branch.
Expected: no meaningful Performance or CLS regression. Report both scores.

- [ ] **Step 5: Commit any fixes and report**

Commit only verified fixes. Report what passed, what could not be tested, the client review items (How We Work copy and before-and-after photos), and leave the branch unpushed.
