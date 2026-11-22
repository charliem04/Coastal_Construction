"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { reveal } from "@/lib/motion";

/** A measured line that draws in once. Decorative. */
export function TickRule({ className = "" }: { className?: string }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        aria-hidden="true"
        data-reveal=""
        className={`tick-rule ${className}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, ease: [...reveal.ease] }}
      />
    </LazyMotion>
  );
}
