/**
 * Headings with a red word — the site's one visual signature.
 *
 *   <Highlight text="BUILDING [STRONGER] FOUNDATIONS" />
 *   → BUILDING <span class="hero-red">STRONGER</span> FOUNDATIONS
 *
 * The bracket convention keeps the copy in client.config.ts as plain
 * strings while the markup stays the old site's <span class="hero-red">.
 */
import { Fragment } from "react";

export function Highlight({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[") && p.endsWith("]") ? (
          <span key={i} className="hero-red">
            {p.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        )
      )}
    </>
  );
}

/** The heading text without brackets — for <title>, aria and schema. */
export const plain = (text: string) => text.replace(/[[\]]/g, "");
