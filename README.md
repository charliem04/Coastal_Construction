# Coastal Construction Services of Louisiana

The four-page site for coastalconstructionservicesofla.com: home, services,
about, contact (plus a privacy notice and a 404). Next.js 14 static export,
Tailwind, Framer Motion, served as Cloudflare Workers static assets. No
backend: the quote form posts straight to Web3Forms, and booking is Cal.com's
embed.

## Run it

```sh
npm install
cp .env.example .env.local   # then paste the Web3Forms access key
npm run dev                  # http://localhost:3000
```

| Command                  | What it does                                                         |
| ------------------------ | -------------------------------------------------------------------- |
| `npm run dev`            | Local dev server                                                     |
| `npm run build`          | Builds the site into `out/`, with the image, CSP and SEO checks      |
| `npm run images`         | Re-cuts photos from `images-src/` into `public/images/` (see below)  |
| `npm run typecheck`      | TypeScript check only                                                |
| `npm run preview`        | Builds and updates a named **preview** (stable URL); production untouched |
| `npm run preview:deploy` | Builds and uploads a **preview** version; production untouched       |
| `npm run deploy`         | Builds and **replaces the live site** (see docs/CLOUDFLARE.md first) |

`npm run build` fails on purpose when:

- `scripts/images.mjs --check`: a photo is missing a cut, a cut is over
  420 KB, `public/images/` is over 3 MB, or a PNG/JPEG photo is in it.
- `scripts/csp.mjs`: the booking provider in `client.config.ts` has no
  origins in the Content-Security-Policy, or any https origin in the output
  isn't covered by the policy.
- `scripts/seo.mjs`: a page's title (>60) or description (>160) is missing
  or too long, it has no canonical or valid JSON-LD, it doesn't have exactly
  one `<h1>`, an image has no alt, or the skip link / `<main id="main">` is gone.
- `lib/phone.ts`: `phone` and `phoneE164` in the config disagree.

## Change something

| To change…                                         | Edit                          |
| -------------------------------------------------- | ----------------------------- |
| Phone, email, hours, any line of copy, page titles | `client.config.ts`            |
| A service (all three places it appears)            | `content/services.ts`         |
| Service area, form timelines, reviews, FAQs        | `content/*.ts`                |
| Booking provider or event types                    | `client.config.ts` → `booking` |
| Where the form sends                               | `lib/submitContact.ts` (`PROVIDER`) |
| Colours, type, layout                              | `tailwind.config.ts`, `app/globals.css` |

**Adding a tenth service** is one record in `content/services.ts`: it appears
as a home card, a section on /services, a dropdown option, and in the
structured data. Its photo goes through `npm run images` first.

Headings mark the red word with brackets: `"BUILDING [STRONGER] FOUNDATIONS"`.

### Photos

Originals live in `images-src/` (gitignored; the old camera files are also
in git history at commit `4634a5b`). Add the original there, add a line to
`PHOTOS` in `scripts/images.mjs`, run `npm run images`, and commit
`public/images/` and `content/imageManifest.json`. The script strips EXIF
(including GPS) and cuts only the widths each photo needs.

## Form

The form posts from the browser to Web3Forms (its free plan refuses
server-side calls). `NEXT_PUBLIC_WEB3FORMS_KEY` must be set in `.env.local`
on the machine that builds, or the form refuses to send and tells the
visitor to call. That is deliberate: it can never show a success it didn't
have. Checks that run in the page: per-field character filters and maxlength,
shape validation, a fixed allow-list of sent keys with control characters
scrubbed, a honeypot checkbox, a minimum fill time, and a per-browser rate
limit (`lib/formRules.ts`, `lib/rateLimit.ts`). A bot posting to Web3Forms
directly skips these; Web3Forms' own spam filter is what stops it.

Switching to Haptic Forms later: implement the `hapticforms` branch in
`lib/submitContact.ts`, change `PROVIDER`, and add its endpoint to
`connect-src` in `scripts/csp.mjs`.

## SEO

Each page has its own title, description, canonical, Open Graph card and a
JSON-LD graph (GeneralContractor + WebSite + the page, plus the nine
Services on /services, the founder, and FAQPage on /contact), all built from
`client.config.ts` and `content/`. `/sitemap.xml` and `/robots.txt` are
generated. The old `.html` URLs 301 to the clean ones (`public/_redirects`).

## Deploy

See [docs/CLOUDFLARE.md](docs/CLOUDFLARE.md) for the account-side setup and
the cut-over from the current live site.
