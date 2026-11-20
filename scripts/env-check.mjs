/**
 * Runs first in `npm run build`. Fails the build when the quote form has
 * nowhere to send.
 *
 * Without NEXT_PUBLIC_WEB3FORMS_KEY the site still builds and the form
 * refuses to send (it tells the visitor to call), which is the right
 * behaviour for a visitor but the wrong thing to ship: a Cloudflare build
 * on `main` deploys straight to production. So the build stops here
 * instead, with a message saying where to set the key.
 *
 * The key is read the way Next reads it: the process environment first
 * (Cloudflare build variables), then .env.production.local / .env.local /
 * .env.production / .env.
 *
 * Escape hatch for a deliberate test build without a key:
 *   ALLOW_MISSING_FORM_KEY=1 npm run build
 */
import { existsSync, readFileSync } from "node:fs";

const NAME = "NEXT_PUBLIC_WEB3FORMS_KEY";

function fromFiles() {
  for (const f of [".env.production.local", ".env.local", ".env.production", ".env"]) {
    if (!existsSync(f)) continue;
    const m = readFileSync(f, "utf8").match(new RegExp(`^\\s*${NAME}\\s*=\\s*["']?([^"'\\r\\n#]*)`, "m"));
    if (m && m[1].trim()) return m[1].trim();
  }
  return "";
}

const key = (process.env[NAME] ?? "").trim() || fromFiles();

if (key) {
  console.log(`[env] ${NAME} is set`);
  process.exit(0);
}
if (process.env.ALLOW_MISSING_FORM_KEY === "1") {
  console.warn(`[env] ${NAME} is NOT set — building anyway (ALLOW_MISSING_FORM_KEY=1). The form will refuse to send.`);
  process.exit(0);
}
console.error(
  `[env] ${NAME} is not set, so the quote form would have nowhere to send.\n` +
    `      Locally: put it in .env.local (see .env.example).\n` +
    `      Cloudflare: Workers & Pages → coastalconstructionofla → Settings → Build →\n` +
    `      Variables and secrets → add ${NAME} (as a secret).`
);
process.exit(1);
