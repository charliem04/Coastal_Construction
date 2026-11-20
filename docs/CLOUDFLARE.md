# Cloudflare setup

What the repo configures, what has been set on the zone, and how to cut
over from the current live site.

## In the repo (done)

| File | What it does |
| --- | --- |
| `wrangler.jsonc` | Worker `coastal-construction`, static assets from `./out`, no script. `html_handling: auto-trailing-slash` serves `/services` from `services.html`; `not_found_handling: 404-page` serves `404.html` with a 404 status. workers.dev and preview URLs on, observability on. No routes or custom domains: attaching the domain is a deliberate dashboard step (below). |
| `public/_headers` | `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, HSTS (1 year, no `includeSubDomains`/`preload`), COOP. Long immutable cache on `/_next/static/*`, 30 days on `/images/*`. `X-Robots-Tag: noindex` on `*.workers.dev` so previews are never indexed. |
| `scripts/csp.mjs` | Appends the Content-Security-Policy to `out/_headers` on every build and fails the build on drift. |
| `public/_redirects` | 301s from the old `.html` URLs, the old OG image path and `site.webmanifest`. |

## Zone `coastalconstructionservicesofla.com` (account charliem04work, Free plan)

The live site today is the Worker **`coastalconstructionofla`** (the old
static HTML, last deployed June 2026), attached to the apex as a Workers
custom domain. This rebuild is a separate Worker, `coastal-construction`
(preview: https://coastal-construction.charliem04work.workers.dev), so
nothing here has touched production.

### Done (20 Nov 2026, verified from outside)

| Setting | Was | Now |
| --- | --- | --- |
| Minimum TLS version | 1.0 | **1.2** (TLS 1.0/1.1 now refused) |
| SSL mode | Full | **Full (strict)** |
| Bot Fight Mode (+ JS detections) | off | **on** |
| `www` | no DNS record (the existing "Redirect from WWW to root" rule never fired) | **proxied `AAAA www → 100::` placeholder**; `www` now 301s to the apex, keeping the path |
| DMARC | none | **`v=DMARC1; p=quarantine; adkim=r; aspf=r`** |
| DNSSEC | disabled | **pending**: Cloudflare is signing; the DS record must be added at Namecheap (below) |

Left as they were, deliberately:

- **Email.** MX → Namecheap forwarding (`eforward1–5.registrar-servers.com`)
  and SPF `include:spf.efwd.registrar-servers.com ~all` are untouched: the
  domain receives mail that way. DMARC is `quarantine`, not `reject`,
  because nothing sends *as* the domain today. If the client ever does
  (a Google Workspace or Zoho mailbox, say), add that sender to SPF first.
  There is no `rua` reporting address: aggregate reports are daily XML
  emails and the only inbox is the client's. Turn on Email → DMARC
  Management in the dashboard to collect them at a Cloudflare address.
- Always Use HTTPS, Automatic HTTPS Rewrites, TLS 1.3, HTTP/3, Brotli:
  already on. Security Level: Medium.
- Edge HSTS: off. The new site sends its own header (`public/_headers`);
  enabling it at the edge too would duplicate it.
- AI crawlers: the zone's Cloudflare-managed robots.txt already disallows
  AI training. It is prepended to the site's own robots.txt and does not
  affect search engines.
- Google Search Console: already verified (TXT record).

### To do

1. **DNSSEC at Namecheap (within a day or two).** Namecheap → Domain List →
   Manage → Advanced DNS → DNSSEC → add:

   | Key Tag | Algorithm | Digest Type | Digest |
   | --- | --- | --- | --- |
   | 2371 | 13 | 2 (SHA-256) | `75A795DB0B85EEE0E6289B747248E846045C4D41375B8795EB0910EA3F71F98B` |

   Cloudflare flips the status from *pending* to *active* once it sees it.
2. **Web3Forms key.** Create a new access key for ccsofla@yahoo.com, put it
   in `.env.local`, rebuild, then delete the old key (it is in this repo's
   git history).
3. **Analytics: decision needed.** The site runs no analytics (TODO item 8).
   Cloudflare Web Analytics is cookieless and needs no consent banner. If
   it is wanted, turn it on for the Worker and add
   `https://static.cloudflareinsights.com` to `script-src` and
   `https://cloudflareinsights.com` to `connect-src` in `scripts/csp.mjs`,
   or the build will (correctly) fail.

### Cut-over (once the preview is approved)

1. `npm run deploy` (updates `coastal-construction`).
2. Workers & Pages → `coastalconstructionofla` → Settings → Domains &
   Routes → remove `coastalconstructionservicesofla.com`; then
   `coastal-construction` → add it. Seconds of downtime between the two,
   so do it at a quiet hour. `www` needs nothing: the redirect rule covers it.
3. Purge the cache (Caching → Purge everything).
4. Check: `/`, `/services`, `/about`, `/contact` return 200;
   `/services.html` 301s to `/services`; `/nope` returns 404; response
   headers include the CSP.
5. Search Console: submit `https://coastalconstructionservicesofla.com/sitemap.xml`
   and request indexing for the four pages (the URLs drop `.html`).
6. After a week on the new Worker, delete `coastalconstructionofla`.
