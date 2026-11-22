# Coastal site-wide visual polish and motion upgrade: design

**Date:** 2026-11-21
**Status:** Approved by owner, 2026-11-21
**Visual reference:** [2026-11-21-visual-motion-demo.html](2026-11-21-visual-motion-demo.html), the approved Survey demo v2. It is a throwaway prototype, so copy its look and timing, not its code. It still contains unused Earth-theme code.

## Intent

The Next.js migration faithfully preserved the old HTML site, including its single scroll fade. Coastal should now feel punchier, fuller, and more deliberately designed, while still reading as a serious local dirt work company whose job is to get a visitor to call or request a quote.

## Goals

- Every page feels composed, using a few small survey-inspired details.
- Subtle motion runs through the whole site from one shared set of timing values.
- Two thematic moments give the site a memorable identity:
  1. **Excavation divider:** dirt layers dig away between the home hero and Services.
  2. **Survey line:** tick rules and stake markers draw in as sections arrive.

## Non-goals

- No rewrite of existing business copy, services, SEO metadata, routes, forms, booking, or structured data. The approved hero trim is the one copy removal, and new copy is limited to the sections approved below.
- No new brand colors. Red, black, and white stay. The only exception is the dirt browns inside the page transition.
- No web fonts beyond the one self-hosted condensed display font below. Body text stays Arial.
- No new page sections beyond "How We Work" and the before-and-after section below.
- No preloaders, custom cursors, or pinned scroll sequences. The only full-screen effect is the page transition below.
- No smooth-scroll library in this pass.

## Anti-goals

This work has failed, even if it technically works, when:

- decoration competes with the headline, phone number, or quote button;
- the hero, form, or call links appear later or become harder to use;
- the site looks like a CTL Pros or white label reskin;
- motion makes a phone feel slow, jumpy, or hard to scroll;
- content is missing without JavaScript or with reduced motion enabled.

## Approaches

1. **Extend the current Framer Motion and CSS setup (recommended; the owner confirms by approving this doc).** Add a small Coastal motion system. CSS handles first paint, hovers, and simple entrances. Framer Motion handles viewport reveals and the scroll-linked divider. This adds no dependency and matches the demo.
2. **Port the full white label motion system.** This brings Lenis, page transitions, parallax, and more. It is proven, but heavier than the approved demo and pushes Coastal toward the sibling sites.
3. **CSS only.** This is the lightest option, but scroll-linked digging, stat count-up, and reliable once-only reveals would become hand-built scripts anyway.

## Decisions made by the owner

- Use **Survey and site plan** as the design base.
- Remove topographic lines from the home hero.
- Reuse the dirt-layer idea from the Earth demo, reversed, as the **divider between hero and Services**.
- Use the **Dozer blade** as the site-wide page transition.
- Tighten the hero and keep the logo.
- Move the hero divider lower so it does not touch the hero button.
- Replace the emoji with custom red-and-white survey-style icons.
- Build a real footer with logo, phone, hours, services, service area, and quote button.
- Add a mobile call bar with Call and Get a Quote.
- Add a condensed display font, a "How We Work" section, a before-and-after slider, and a themed 404 page.
- Keep embellishments minimal.

## Visual system

### Survey vocabulary

Use only these details:

| Detail | Use |
|---|---|
| Section marker | Red crosshair plus a short numbered label above major section headings |
| Tick rule | Thin measured line at section joins |
| Corner brackets | Two opposite corners on photo cards and feature photos; they extend and turn red on hover |
| Faint contours | Very low-contrast background on selected dark bands and the stats panel, never the home hero |
| Stake markers | Small circles on the service-area frame |

Limit each viewport to about two decorative ideas. Decoration is `aria-hidden` and never receives pointer events.

Marker labels are new short copy, so they live in `client.config.ts`. Marker text uses a light neutral or `brand-light`, not brand red: `#dc2626` on `#0a0a0a` is about 4.1:1, below the 4.5:1 needed at this small size. The crosshair itself can stay red.

### Page treatment

- **Home hero:** existing photo, no contours, staged entrance, excavation divider. Tighten the stack to **logo, headline, subhead, and quote button**. Remove the repeated company wordmark, "of Louisiana" line, and tagline from the hero; the business name stays in the nav, logo, footer, and metadata. "Building Stronger Foundations" remains the page's `h1` and becomes the dominant element.
- **Service cards:** adopt the demo card: photo with the service name and blurb always visible below it, corner brackets, stronger hover. This replaces the hover-only desktop overlay and the pulsing "TAP TO LEARN MORE" label. All nine cards keep their current links.
- **Why Choose:** real copy stays complete. The red stats panel gets faint contours, an offset black shadow, and count-up numbers.
- **Reviews:** keep the ribbon's drift, drag, pause, and accessibility behavior. Add only an entrance reveal and card polish.
- **Service area:** keep the real Google Map and parish lists. A survey line and stakes draw around the **map frame**. Nothing is drawn across the map, because that could look like a real route or boundary and could block map use.
- **Banner and closing CTA:** tick edge, reveal, stronger buttons.
- **Page headers (Services, About, Contact, Privacy, 404):** headline entrance and a tick rule at the base. These pages do not get the dirt divider, so it stays special to the homepage.
- **Services page:** alternating sections reveal as now, with photo brackets and a light stagger on feature lists.
- **About:** owner photo brackets and staggered value cards.
- **Contact:** method and info cards may reveal lightly. Form fields, validation, booking buttons, and submission states do not animate in.
- **Privacy:** header treatment only, so legal text is immediately readable.
- **Nav:** condenses after scrolling, link underlines animate, and a thin red scroll progress bar sits at the top. On phones it must stay compact enough to work alongside the mobile call bar.
- **Footer:** see "Footer" below.
- **Phones and tablets:** see "Mobile call bar" below.

### Custom icons

Replace 📞, ✉️, 📅, and 📍 with one small inline SVG set: phone, envelope, calendar, and survey-style map pin.

- Red and white line art with a consistent stroke, sized to replace the current icons.
- Decorative and `aria-hidden`, because each sits beside a visible label.
- No icon library or external file requests.
- Remove the emoji from `client.config.ts` and `components/ServiceArea.tsx`.
- The map pin's endless pulse is replaced by a single entrance, so the map area stays calm.
- The review stars and form/list check marks are functional text symbols and stay as they are unless they look wrong in testing.

### Footer

A strong closing section on every page, on black with a survey tick rule at the top:

- **Brand:** logo, business name, and a quote button linking to `/contact`.
- **Contact:** tap-to-call phone, email, and street address from `client.config.ts`.
- **Hours:** the confirmed business hours. Show "Monday - Friday: 7:00 AM - 6:00 PM" and omit the "N/A" weekend lines.
- **Services:** all nine, linking to their `/services#slug` sections.
- **Service area:** the core parishes from `content/serviceAreas.ts`, linking to the home service-area section.
- **Legal row:** the existing copyright line and privacy link.

All facts come from the existing config and content files, so nothing is typed twice. Columns collapse cleanly on phones. Use `nav` landmarks with labels for link groups.

### Mobile call bar

- A slim two-button bar fixed to the bottom at the site's one-column breakpoint (968px and below): **Call** (`tel:` link, red) and **Get a Quote** (black or white outline).
- **Get a Quote** goes to `/contact`; on the contact page it jumps to `#contact-form`.
- Respects the phone safe area, and the page gets enough bottom padding that the bar never hides the footer, form submit button, or legal links.
- Hides while a form field is focused so it cannot sit on top of the on-screen keyboard.
- Sits below the page transition and skip link in stacking order, and does not trigger the page transition for phone links.
- Never appears on desktop.

### Condensed display font

- Replace Arial Black for headings, nav, buttons, and labels with one tall, heavy, openly licensed condensed font. Body text stays Arial.
- Compare **Anton** (recommended), **League Gothic**, and **Barlow Condensed** on the real hero and section headings, and let the owner pick before rolling it out.
- Self-host it through `next/font/local`, with a matched fallback to limit layout shift. No Google Fonts request, and the existing `font-src 'self'` policy stays unchanged.
- Keep its license file in the repo.
- Recheck heading sizes, letter spacing, wrapping, and button widths on every page.

### How We Work

A new four-step home section between Services and Why Choose: **Assess, Clear, Grade, Finish**.

- A survey line connects numbered stake markers and draws through the steps as the section arrives. It is horizontal on desktop and vertical on phones.
- Step one says **Assess**, not "Survey." Coastal's listed services do not include land surveying, which is a licensed profession, so the site must not imply it offers that service. The survey styling stays purely visual.
- Copy lives in `client.config.ts`, describes only services and promises already on the site, and is reviewed by the owner before launch.

### Before-and-after slider

- A draggable comparison with a red survey-line handle, keyboard support, and accessible labels.
- It uses **only real matching project photos**. No staged, AI-generated, or mismatched images.
- Project pairs live in a content file. While that file is empty, the section renders nothing, so it can ship safely and turn on when photos arrive.
- Each pair needs a service, a location the client is comfortable publishing, and useful alt text.
- Placement: home page, directly after How We Work.

### Themed 404

- Heading: **"You've Hit [Unmarked Ground]"**, using the existing red-word pattern.
- A short line pointing visitors back on track, with a small survey-stake illustration.
- Keep clear links to Home, Services, and Contact, and keep the correct not-found page behavior.

## Motion system

Keep all shared timings, easing, distances, stagger, and viewport thresholds in `lib/motion.ts`. Components should not invent their own values.

Target feel, from the demo:

- Main easing: `cubic-bezier(.2,.8,.2,1)`.
- Entrances: about 0.7s, 26px rise, 60 to 120ms stagger.
- Hovers: about 0.25 to 0.35s.
- Each reveal runs once.

### Excavation divider

- Four irregular soil layers in the demo's red-to-near-black colors sit at the bottom of the home hero.
- At the top of the page, they are fully piled.
- As the hero scrolls away, the layers drop one at a time, starting with the top layer.
- As the last layer clears, a red tick line draws left to right along the seam.
- Scrolling back reverses it exactly.
- Sit it lower than the demo. Its highest peak must stay at least 32px below the quote button at every tested screen size, including short laptop screens and phones. Add hero bottom space rather than shrinking the button.

### Page transition: Dozer blade (owner's chosen site default)

Visual reference: [2026-11-21-page-transition-demo.html](2026-11-21-page-transition-demo.html), option **C Dozer blade**. The other options in that demo were explored and are not part of the build.

- Layered brown dirt quickly fills the screen from the bottom with a small impact.
- A signature-red, slightly angled, bolted blade with black and white accent lines pushes the dirt off from left to right.
- The new page is revealed directly behind the blade, with a few brown and red clods thrown off its working edge.
- Target timing from the demo: about 190ms cover, 40ms hold, 560ms clear, or 790ms total. The route changes while the screen is fully covered.
- It is the one transition for every internal page navigation.
- It never runs on first load, same-page anchors, external links, phone links, or booking actions.
- It is off for reduced motion, and navigation must still complete if the animation frame loop stalls or the tab is backgrounded.
- It never blocks focus or leaves an invisible layer over the page.
- The transition's dirt browns are the one approved addition to the palette and are used only in this effect.

## Technical constraints

- The site is a **static export**. Server and first client render must match, so do not branch markup on `useReducedMotion()` during the first render. The white label `useStillness()` pattern is the reference.
- **Hero text and photo must not wait for hydration.** Their entrance is CSS-driven, and the hero photo stays visible from first paint.
- Use `LazyMotion` with `m`, as `components/Reveal.tsx` does. Keep client boundaries small. Decorative animation should not turn whole pages into client components.
- Animate transforms and opacity where possible. The divider should update through refs or motion values, not React state on every scroll event.
- The nav condensing must not move page content or disturb `/services#slug` anchor landings. `app/globals.css` has offsets tied to the current nav height (`scroll-margin-top: 150px` and a sticky `top-[180px]` element), so check or update them together.
- Stats server-render their true final values (`500+`, `100%`, `15+`). Count-up is an enhancement.
- **Reduced motion:** no travel, drift, count-up, or scroll-linked movement. The dirt pile stays as a still illustration and all content is visible.
- **No JavaScript:** all content stays visible. The existing `data-reveal` noscript rule must cover every hidden entrance state.
- Respect the build-time CSP. Inline or same-origin SVG is fine, and no new external origin should be needed.
- Keep the 968px and 768px layout behavior and all existing focus states.

## Done means

- `npm run typecheck` and `npm run build` pass, including image, CSP, and SEO checks.
- Every route is visually checked at phone and desktop sizes: home, services, about, contact, privacy, and 404.
- No horizontal overflow, hydration errors, or console errors.
- Forms, booking buttons, call links, the map, review drag, keyboard focus, and `/services#slug` links still work.
- The mobile bar never covers a form control or footer link, and the hero divider clears the quote button at every tested size.
- Reduced-motion and no-JavaScript modes show all content.
- Home-page Lighthouse performance and layout shift are compared before and after, with no meaningful regression.

## Left to the builder

- Component and file breakdown.
- Exact section marker wording, within the numbered-label pattern.
- Which dark bands get contours, within the one-detail restraint above.
- Final responsive sizes for the divider and brackets.
