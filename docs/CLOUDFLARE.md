# Cloudflare setup

What the repo configures, what has been set on the zone, and how to cut
over from the current live site.

## In the repo (done)

| File | What it does |
| --- | --- |
| `wrangler.jsonc` | Worker `coastalconstructionofla`, the one already attached to the domain. Static assets from `./out`, no script. `html_handling: auto-trailing-slash` serves `/services` from `services.html`; `not_found_handling: 404-page` serves `404.html` with a 404 status. workers.dev and preview URLs on, observability on. No routes or custom domains in the file, so a deploy never adds or moves one. |
| `public/_headers` | `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, HSTS (1 year, no `includeSubDomains`/`preload`), COOP. Long immutable cache on `/_next/static/*`, 30 days on `/images/*`. `X-Robots-Tag: noindex` on `*.workers.dev` so previews are never indexed. |
| `scripts/csp.mjs` | Appends the Content-Security-Policy to `out/_headers` on every build and fails the build on drift. |
| `public/_redirects` | 301s from the old `.html` URLs, the old OG image path and `site.webmanifest`. |

## Zone `coastalconstructionservicesofla.com` (account charliem04work, Free plan)

The site is the Worker **`coastalconstructionofla`**, attached to the apex
as a Workers custom domain. Production today is still the old static HTML
(version `f864d3ba`, v21, deployed 19 June 2026). The rebuild is uploaded
to the same Worker as a *version*, not deployed:

- Preview: https://6ea6b085-coastalconstructionofla.charliem04work.workers.dev
  (version `6ea6b085`). Each `npm run preview:deploy` makes a new one.

Going live is deploying a version of this Worker; the domain never moves.

A temporary Worker, `coastal-construction`
(https://coastal-construction.charliem04work.workers.dev), was used for the
first preview. Delete it after go-live (Workers & Pages → it → Settings →
Delete).

### Git builds (Workers Builds, connected to charliem04/Coastal_Construction)

Pushes build and deploy on Cloudflare automatically:

| Trigger | Branches | Build | Deploy |
| --- | --- | --- | --- |
| Deploy default branch | `main` | **empty, to be set to `npm run build`** | `npx wrangler deploy`: **goes live** |
| Deploy non-production branches | all except `main` | `npm run build` | `npx wrangler versions upload`: preview URL only |

So **merging to `main` is going live.** Until the steps below are done, the
production trigger has no build command and every `main` build fails
before deploying anything, which keeps the old site up.

To arm production, in this order:

1. Add `NEXT_PUBLIC_WEB3FORMS_KEY` as a **secret** build variable on
   *both* triggers (Workers & Pages → `coastalconstructionofla` → Settings
   → Build → Variables and secrets). Without it `npm run build` stops at
   `scripts/env-check.mjs` rather than ship a form with nowhere to send.
2. Make sure `main` contains `scripts/env-check.mjs` (commit `f2724c7`).
3. Set the production trigger's build command to `npm run build`. The next
   push to `main` deploys the new site.

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

### Go-live (once the preview is approved)

1. `npm run deploy`. This builds and deploys the new site as the next
   version of `coastalconstructionofla`; the domain stays attached, so
   there is no downtime. (Or promote an approved preview version as is:
   `npx wrangler@4 versions deploy <version-id>@100%`.)
2. Purge the cache (Caching → Purge everything).
3. Check: `/`, `/services`, `/about`, `/contact` return 200;
   `/services.html` 301s to `/services`; `/nope` returns 404; response
   headers include the CSP. `www` needs nothing: the redirect rule covers it.
4. Search Console: submit `https://coastalconstructionservicesofla.com/sitemap.xml`
   and request indexing for the four pages (the URLs drop `.html`).
5. Delete the temporary `coastal-construction` Worker.

**Rollback** (if anything is wrong): `npx wrangler@4 rollback f864d3ba-4b66-4db2-836e-bae45bb3ded6`
puts the old site back in seconds. Or use Workers & Pages →
`coastalconstructionofla` → Deployments → the 19 June deployment →
Rollback.
