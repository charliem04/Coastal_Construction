"use client";

/**
 * Scroll reveal — the old site's .row-visible fade, in Framer Motion.
 *
 * LazyMotion + domAnimation keeps the bundle to the animation features
 * this uses. Hidden states carry data-reveal so the <noscript> rule in
 * app/layout.tsx shows them when JavaScript never runs, and the
 * reduced-motion rule in app/globals.css drops the travel.
 */
import { LazyMotion, domAnimation, m } from "framer-motion";
import type { ReactNode } from "react";
import { reveal } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  id?: string;
  /** Seconds to wait after entering view, for staggered siblings. */
  delay?: number;
};

export function Reveal({ children, className, as = "div", id, delay = 0 }: Props) {
  const M = as === "section" ? m.section : m.div;
  return (
    <LazyMotion features={domAnimation} strict>
      <M
        id={id}
        data-reveal=""
        className={className}
        initial={{ opacity: 0, y: reveal.rise }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={reveal.viewport}
        transition={{ duration: reveal.duration, ease: [...reveal.ease], delay }}
      >
        {children}
      </M>
    </LazyMotion>
  );
}
