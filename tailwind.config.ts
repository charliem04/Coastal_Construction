import type { Config } from "tailwindcss";

/**
 * ── BRAND ───────────────────────────────────────────────────────────
 * Ported from the old styles.css. Its greys and reds were already
 * Tailwind's default palette (gray-300…600, red-300/600/700), so those
 * stay available under their usual names; the names below are the
 * roles each colour plays on this site.
 *
 *   brand        #dc2626  THE red: buttons, the highlighted word in every
 *                         heading, card rules, links on dark. Also Cal.com's
 *                         brandColor (client.config.ts → booking).
 *   brand-dark   #b91c1c  hover / pressed red
 *   brand-light  #fca5a5  small text on a red ground (stat labels, review
 *                         authors)
 *   surface-950  #0a0a0a  the darkest bands (services, service area, forms)
 *   surface-900  #1a1a1a  page background, cards on the darkest bands
 *   surface-800  #2a2a2a  hairlines and card borders on dark
 *   black        #000000  nav and footer
 *
 *   Text on dark: white for headings, gray-300 (#d1d5db) for running text,
 *   gray-400 (#9ca3af) for subtitles, gray-500 (#6b7280) for the footer.
 *
 * ── TYPE ────────────────────────────────────────────────────────────
 * Two self-hosted fonts (app/fonts.ts) and one system stack:
 *   display  Anton: headlines, section headings, stats. That uppercase
 *            red-word heading is the site's visual signature.
 *   label    Barlow Condensed: buttons, nav, small labels.
 *   body     Arial — running text.
 * ────────────────────────────────────────────────────────────────────
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    // Tailwind's size utilities also set a line-height. The old site set
    // line-height once (1.6, on body) and let everything inherit it, so
    // these sizes inherit too — otherwise every list and card drifts.
    fontSize: {
      xs: ["0.75rem", { lineHeight: "inherit" }],
      sm: ["0.875rem", { lineHeight: "inherit" }],
      base: ["1rem", { lineHeight: "inherit" }],
      lg: ["1.125rem", { lineHeight: "inherit" }],
      xl: ["1.25rem", { lineHeight: "inherit" }],
      "2xl": ["1.5rem", { lineHeight: "inherit" }],
      "3xl": ["1.875rem", { lineHeight: "inherit" }],
      "4xl": ["2.25rem", { lineHeight: "inherit" }],
      "5xl": ["3rem", { lineHeight: "inherit" }],
    },
    extend: {
      colors: {
        brand: { DEFAULT: "#dc2626", dark: "#b91c1c", light: "#fca5a5" },
        surface: { 950: "#0a0a0a", 900: "#1a1a1a", 800: "#2a2a2a" },
        success: "#22c55e",
      },
      fontFamily: {
        display: ["var(--font-anton)", "'Arial Black'", "'Arial Bold'", "Gadget", "sans-serif"],
        label: ["var(--font-barlow)", "'Arial Narrow'", "Arial", "sans-serif"],
        body: ["Arial", "Helvetica", "sans-serif"],
      },
      fontSize: {
        // The old site's heading steps, in rem, as it wrote them.
        "d-hero": ["4rem", { lineHeight: "1.1" }], //   hero h1, page headers
        "d-1": ["3rem", { lineHeight: "1.6" }], //      section titles
        "d-2": ["2.5rem", { lineHeight: "1.6" }], //    CTA bands, service names
        "d-3": ["1.5rem", { lineHeight: "1.6" }], //    card titles
      },
      letterSpacing: {
        // 1px for card titles, 2px for section titles, 3px for the hero.
        label: "1px",
        title: "2px",
        hero: "3px",
      },
      maxWidth: {
        // The two content widths the old CSS used.
        content: "1200px",
        wide: "1400px",
      },
      transitionTimingFunction: {
        // `ease` — every hover on the old site used 0.3s ease.
        site: "ease",
      },
    },
  },
  plugins: [],
};
export default config;
