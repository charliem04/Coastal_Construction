"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import type { ReactNode } from "react";
import { reveal } from "@/lib/motion";

/**
 * A survey line and four stakes drawn around the map, outside it, so it
 * can't be read as a route or boundary and never blocks the map.
 */
export function SurveyFrame({ children }: { children: ReactNode }) {
  return (
    <div className="survey-frame">
      <LazyMotion features={domAnimation} strict>
        <svg className="survey-frame-line" aria-hidden="true">
          <m.rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            // Framer draws any SVG shape this way; its types only list <path>.
            initial={{ pathLength: 0 } as never}
            whileInView={{ pathLength: 1 } as never}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 2.2, ease: [...reveal.ease] }}
          />
        </svg>
      </LazyMotion>
      {["tl", "tr", "bl", "br"].map((corner) => (
        <span key={corner} className={`survey-stake is-${corner}`} aria-hidden="true" />
      ))}
      {children}
    </div>
  );
}
