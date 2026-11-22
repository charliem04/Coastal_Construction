/**
 * ════════════════════════════════════════════════════════════════════
 *  CONTENT-SECURITY-POLICY, generated at build time.
 *
 *  public/_headers carries the headers that never change; this script
 *  appends the CSP to out/_headers after `next build`.
 *
 *  Three checks keep it honest, and each fails the build:
 *
 *   1. PROVIDER. The booking provider is read from client.config.ts and
 *      its origins are added from PROVIDER_ORIGINS below. A provider
 *      this table doesn't know fails — so switching Cal.com for
 *      something else can't silently leave the policy behind.
 *   2. REQUIRED. For the configured provider, every origin it needs must
 *      be in the right directive (Cal.com: its script in script-src, its
 *      booking pages in frame-src, its API in connect-src).
 *   3. DRIFT. Every https origin that appears anywhere in out/ must be
 *      allowed by the policy or declared below as something the browser
 *      never fetches. Adding an embed, a font CDN or an analytics script
 *      fails the build until somebody decides which it is.
 *
 *  ── WHY script-src CARRIES 'unsafe-inline' ──────────────────────────
 *
 *  Next puts inline <script> blocks on every page (the data that
 *  hydrates it), and a static export has no server to issue a nonce.
 *  Hashing them per build is fragile: one byte of drift and the browser
 *  blocks hydration — an outage caused by a security header on a site
 *  whose job is to take quote requests.
 *
 *  What the policy still buys: no script from an unlisted origin, no
 *  plugins, no <base> hijack, no framing of this site. Nothing renders
 *  user-supplied HTML — React escapes every string, and the only
 *  dangerouslySetInnerHTML uses are ours: the JSON-LD built from
 *  client.config (components/JsonLd.tsx) and the <noscript> style in
 *  app/layout.tsx. If either ever takes a value from a URL, a form or an
 *  API, come back to this comment.
 * ════════════════════════════════════════════════════════════════════
 */
import { appendFileSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const HEADERS = join(OUT, "_headers");
const MARKER = "# ── Content-Security-Policy (generated) ──";

/** What each booking provider needs the browser to be allowed to load. */
const PROVIDER_ORIGINS = {
  calcom: {
    // embed.js
    "script-src": ["https://app.cal.com"],
    // the booking popup's iframe (origin "https://cal.com"; app.cal.com serves some flows)
    "frame-src": ["https://cal.com", "https://app.cal.com"],
    // embed.js talks to its own API
    "connect-src": ["https://app.cal.com"],
  },
  calendly: {
    "script-src": ["https://assets.calendly.com"],
    "frame-src": ["https://calendly.com"],
    "connect-src": [],
  },
  none: { "script-src": [], "frame-src": [], "connect-src": [] },
};

/** Reads `booking: { provider: "…" }` out of client.config.ts. */
function bookingProvider() {
  const src = readFileSync("client.config.ts", "utf8");
  const m = src.match(/booking:\s*\{[^}]*?provider:\s*"([a-z]+)"/s);
  if (!m) throw new Error("[csp] could not find booking.provider in client.config.ts");
  return m[1];
}

/** Origins that are LINK TARGETS ONLY, or strings in JSON-LD/metadata. Never fetched. */
const LINK_ONLY = new Set([
  "https://schema.org", // JSON-LD @context
  "https://coastalconstructionservicesofla.com", // our canonical / og URLs
  "https://www.google.com", // also a frame (map) — see frame-src
  // Outbound source links in the answer guides (content/guides.ts).
  "https://extension.msstate.edu",
  "https://www.aces.edu",
  "https://www.extension.purdue.edu",
  "https://www.nrcs.usda.gov",
  "https://www.fema.gov",
  "https://fema.gov",
  "https://legis.la.gov",
  "https://lslbc.louisiana.gov",
  "https://www.lslbc.louisiana.gov",
  "https://deq.louisiana.gov",
  "https://www.ldaf.la.gov",
  "https://www.dnr.louisiana.gov",
  "https://soilseries.sc.egov.usda.gov",
  "https://websoilsurvey.nrcs.usda.gov",
  "https://www.frontiersin.org",
  "https://iberiaparishgovernment.com",
  "https://www.breauxbridgela.net",
  "https://www.osha.gov",
  "https://extension.psu.edu",
  "https://www.deq.louisiana.gov",
  "https://www.nhc.noaa.gov",
  "https://www.weather.gov",
  // Framework strings baked into React/Next error messages.
  "https://nextjs.org",
  "https://react.dev",
  "https://reactjs.org",
  "https://github.com",
]);

/** Constants inside framework code this site never exercises, and comment URLs. */
const INERT = new Set([
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://use.typekit.net",
  "https://tailwindcss.com",
  "https://www.w3.org",
  "https://www.sitemaps.org",
  // lib/booking.ts carries the Calendly branch of the adapter. While the
  // provider is calcom it is never reached; if it becomes the provider,
  // PROVIDER_ORIGINS.calendly puts it in frame-src.
  "https://calendly.com",
]);

export function buildCsp(provider) {
  const p = PROVIDER_ORIGINS[provider];
  const list = (xs) => (xs.length ? " " + xs.join(" ") : "");
  return [
    "default-src 'self'",
    // See the header comment for why 'unsafe-inline' is here.
    // static.cloudflareinsights.com: the Cloudflare Web Analytics beacon,
    // which Cloudflare injects into the HTML at the edge (it isn't in out/).
    // Cookieless; on for this zone since June 2026, kept at go-live.
    `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${list(p["script-src"])}`,
    // React, Framer Motion and Cal.com's embed write style attributes.
    "style-src 'self' 'unsafe-inline'",
    // data: for inlined SVG. Every photo is served from /images.
    // radar.weather.gov: the live radar image on /weather.
    "img-src 'self' data: https://radar.weather.gov",
    // Self-hosted Anton and Barlow Condensed (app/fonts); no font CDN.
    "font-src 'self'",
    // The quote form posts here from the browser (lib/submitContact.ts).
    // When the form provider switches to Haptic Forms, its endpoint goes here.
    // cloudflareinsights.com: where the analytics beacon reports page views
    // and Core Web Vitals.
    `connect-src 'self' https://api.web3forms.com https://cloudflareinsights.com${list(p["connect-src"])}`,
    // Google Maps: the service-area map on the home page.
    `frame-src https://www.google.com${list(p["frame-src"])}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function directive(csp, name) {
  const d = csp.split(";").map((s) => s.trim()).find((s) => s.startsWith(name + " "));
  return new Set((d ?? "").split(/\s+/).slice(1));
}

function originsInBuild(dir = OUT) {
  const found = new Set();
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) {
        walk(p);
        continue;
      }
      if (!/\.(html|js|css|json|txt|xml|webmanifest)$/.test(name)) continue;
      for (const m of readFileSync(p, "utf8").matchAll(/https:\/\/[a-zA-Z0-9.-]+[a-zA-Z0-9]/g)) {
        try {
          found.add(new URL(m[0]).origin);
        } catch {
          /* not a URL */
        }
      }
    }
  };
  walk(dir);
  return found;
}

export function applyCsp() {
  if (!existsSync(HEADERS)) {
    console.error(`[csp] ${HEADERS} missing — is public/_headers in place, and did next build run?`);
    return false;
  }
  if (readFileSync(HEADERS, "utf8").includes(MARKER)) {
    console.log("[csp] already applied, nothing to do");
    return true;
  }

  // 1. Provider
  const provider = bookingProvider();
  if (!(provider in PROVIDER_ORIGINS)) {
    console.error(
      `[csp] booking.provider is "${provider}", which scripts/csp.mjs has no origins for.\n` +
        `      Add it to PROVIDER_ORIGINS (script-src, frame-src, connect-src) before shipping.`
    );
    return false;
  }
  const csp = buildCsp(provider);

  // 2. Required origins for that provider, in the right directives
  const missing = [];
  for (const [dir, origins] of Object.entries(PROVIDER_ORIGINS[provider])) {
    const have = directive(csp, dir);
    for (const o of origins) if (!have.has(o)) missing.push(`${dir} ${o}`);
  }
  if (missing.length) {
    console.error(`[csp] ${provider} needs, but the policy lacks:\n        ${missing.join("\n        ")}`);
    return false;
  }

  // 3. Drift
  const allowed = new Set([...csp.matchAll(/https:\/\/[a-zA-Z0-9.*-]+/g)].map((m) => m[0]));
  const drift = [...originsInBuild()].filter((o) => !LINK_ONLY.has(o) && !INERT.has(o) && !allowed.has(o));
  if (drift.length) {
    console.error(
      "[csp] Origins in the build that the policy does not cover:\n" +
        drift.map((o) => `        ${o}`).join("\n") +
        "\n      Add each to the policy in scripts/csp.mjs if the browser fetches it,\n" +
        "      or to LINK_ONLY if it is only ever an href a person clicks."
    );
    return false;
  }

  appendFileSync(
    HEADERS,
    `\n${MARKER}\n# Generated by scripts/csp.mjs (booking provider: ${provider}). Edit the policy there.\n/*\n  Content-Security-Policy: ${csp}\n`
  );
  console.log(`[csp] applied for booking provider "${provider}" (${csp.length} chars)`);
  return true;
}

if (process.argv[1] && process.argv[1].endsWith("csp.mjs")) {
  process.exit(applyCsp() ? 0 : 1);
}
