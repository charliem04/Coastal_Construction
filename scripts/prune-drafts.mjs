/**
 * Removes unpublished pages from the public build.
 *
 * Parish, project, cost, and review templates are real routes so they can
 * be previewed, but a page marked `coastal-draft` must return a true 404
 * in production. Set SHOW_DRAFTS=1 to keep them in a local preview build.
 */
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const MARKER = '<meta name="coastal-draft"';

function htmlFiles(dir = OUT, found = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name !== "_next") htmlFiles(path, found);
    } else if (name.endsWith(".html")) found.push(path);
  }
  return found;
}

function removeEmptyDirs(dir = OUT) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (name === "_next" || !statSync(path).isDirectory()) continue;
    removeEmptyDirs(path);
    if (!readdirSync(path).length) rmSync(path, { recursive: true });
  }
}

const drafts = htmlFiles().filter((file) => readFileSync(file, "utf8").includes(MARKER));

if (process.env.SHOW_DRAFTS === "1") {
  console.log(`[drafts] keeping ${drafts.length} unpublished pages for preview (SHOW_DRAFTS=1)`);
} else {
  for (const file of drafts) {
    rmSync(file);
    const payload = file.replace(/\.html$/, ".txt");
    if (existsSync(payload)) rmSync(payload);
  }
  removeEmptyDirs();
  console.log(`[drafts] removed ${drafts.length} unpublished pages from the public build`);
}
