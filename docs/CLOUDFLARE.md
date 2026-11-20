# Cloudflare setup

What the repo configures, what has to be set in the dashboard, and how to
cut over from the current live site.

## In the repo (done)

| File | What it does |
| --- | --- |
| `wrangler.jsonc` | Worker `coastal-construction`, static assets from `./out`, no script. `html_handling: auto-trailing-slash` serves `/services` from `services.html`; `not_found_handling: 404-page` serves `404.html` with a 404 status. workers.dev and preview URLs on, observability on. No routes or custom domains: attaching the domain is a deliberate dashboard step (below). |
| `public/_headers` | `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, HSTS (1 year, no `includeSubDomains`/`preload`), COOP. Long immutable cache on `/_next/static/*`, 30 days on `/images/*`. `X-Robots-Tag: noindex` on `*.workers.dev` so previews are never indexed. |
| `scripts/csp.mjs` | Appends the Content-Security-Policy to `out/_headers` on every build and fails the build on drift. |
| `public/_redirects` | 301s from the old `.html` URLs, the old OG image path and `site.webmanifest`. |

## Live domain today (public audit, 20 Nov 2026)

What anyone can see from outside, checked without account access:

| Check | Today | Want |
| --- | --- | --- |
| Nameservers | Cloudflare (`eugene`, `jo`) | ✓ |
| Registrar | Namecheap (MX and SPF use its email forwarding) | — |
| HTTP → HTTPS | 301 | ✓ |
| HTTP/3 | on | ✓ |
| TLS 1.0 / 1.1 | **accepted** | refused (minimum TLS 1.2) |
| `www` | **doesn't resolve** | 301 to the apex |
| DNSSEC | **off** (no DS record) | on |
| DMARC | **none** | a policy (below) |
| Security headers on the live site | **none** | set by this repo after cut-over |
| Google Search Console | verified (TXT record present) | ✓ |
| Email | MX → Namecheap forwarding (`eforward*.registrar-servers.com`), SPF `include:spf.efwd.registrar-servers.com ~all` | keep |

The live site isn't a Pages project or a Worker on the account wrangler is
signed into (charliem04work), so the zone may be on another account. Find
it first; everything below is done in that zone.

## In the dashboard (to do)

**Before cut-over**

1. **Web3Forms key.** Create a new access key for ccsofla@yahoo.com, put it
   in `.env.local`, rebuild, then delete the old key (it's in this repo's git
   history).
2. **DNS: `www`.** Add it as a custom domain on the Worker (or a proxied
   `CNAME www → coastalconstructionservicesofla.com`) and a Redirect Rule
   `www` → apex (301, keep path and query).
3. **SSL/TLS.** Edge Certificates → *Minimum TLS Version* **1.2** (the one
   real gap today); keep *Always Use HTTPS* and TLS 1.3 on; turn on
   *Automatic HTTPS Rewrites*. Leave edge HSTS off: the site sends its own.
4. **DNSSEC.** DNS → Settings → Enable DNSSEC, then add the DS record
   Cloudflare shows in Namecheap (Domain List → Manage → Advanced DNS →
   DNSSEC). Do the Namecheap half the same day, or validation fails.
5. **Email: keep the forwarding, add DMARC.** The domain *does* receive
   mail through Namecheap's email forwarding, so leave the MX records and
   the SPF record exactly as they are. Add only:
   - `TXT _dmarc` → `v=DMARC1; p=none; rua=mailto:ccsofla@yahoo.com`

   Watch the reports for a few weeks; if nothing legitimate sends as the
   domain, tighten to `p=quarantine`. (If the forwarding is ever retired,
   replace SPF with `v=spf1 -all` and set `p=reject`.)
6. **Security.** *Bot Fight Mode* on; Security Level *Medium*; the free
   Managed Ruleset is on by default (leave it). Nothing here needs Turnstile.
7. **Analytics: decision needed.** The site runs no analytics (TODO item 8).
   Cloudflare Web Analytics is cookieless and needs no consent banner. If
   it's wanted, turn it on for the Worker and add
   `https://static.cloudflareinsights.com` to `script-src` and
   `https://cloudflareinsights.com` to `connect-src` in `scripts/csp.mjs`,
   or the build will (correctly) fail.

**Cut-over** (once the preview is approved)

1. `npm run deploy`.
2. Workers & Pages → `coastal-construction` → Settings → Domains & Routes →
   add `coastalconstructionservicesofla.com` (and `www`). Remove the domain
   from whatever serves it now first.
3. Purge the cache (Caching → Purge everything).
4. Check: `/`, `/services`, `/about`, `/contact` return 200; `/services.html`
   301s to `/services`; `/nope` returns 404; response headers include the CSP.
5. Search Console: submit `https://coastalconstructionservicesofla.com/sitemap.xml`
   and request indexing for the four pages (the URLs drop `.html`).
6. Once traffic is on the new Worker, retire the old deployment.
