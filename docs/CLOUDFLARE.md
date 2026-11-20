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

## In the dashboard (to do)

The live site is on Cloudflare (nameservers `*.ns.cloudflare.com`), but it
isn't a Pages project or a Worker on the account wrangler is signed into, so
it may be on another account. Find where it's served from first.

**Before cut-over**

1. **Web3Forms key.** Create a new access key for ccsofla@yahoo.com, put it
   in `.env.local`, rebuild, then delete the old key (it's in this repo's git
   history).
2. **DNS: `www`.** `www.coastalconstructionservicesofla.com` doesn't resolve
   today. Add it as a custom domain on the Worker (or a proxied record) and a
   Redirect Rule `www` → apex (301, keep path and query).
3. **SSL/TLS.** Mode *Full (strict)*; *Always Use HTTPS* on; *Automatic
   HTTPS Rewrites* on; minimum TLS 1.2; TLS 1.3 on. Leave edge HSTS off: the
   site sends its own header.
4. **DNSSEC.** Enable it (DNS → Settings), and add the DS record at the
   registrar if the registrar isn't Cloudflare.
5. **Email anti-spoofing.** The business uses a Yahoo address, so the domain
   sends no mail. Publish these so nobody can send as it:
   - `TXT @` → `v=spf1 -all`
   - `TXT _dmarc` → `v=DMARC1; p=reject; adkim=s; aspf=s`
   - `TXT *._domainkey` → `v=DKIM1; p=`

   Skip this if anyone plans to send mail from the domain.
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
