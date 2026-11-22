"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { useRef } from "react";
import { laserEase, motionTiming } from "@/lib/motion";

/**
 * A measured line drawn by a red laser level: the beam races across,
 * lights each tick as it passes, then settles with a quick flash.
 * Decorative. --draw is the laser's position from 0 to 1, so CSS can
 * point it along either axis.
 */
export function TickRule({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        ref={root}
        aria-hidden="true"
        data-reveal=""
        className={`tick-rule ${className}`}
        initial={{ "--draw": 0 } as never}
        whileInView={{ "--draw": 1 } as never}
        viewport={{ once: true }}
        transition={{ duration: motionTiming.laser, ease: [...laserEase] }}
        onAnimationComplete={() => root.current?.classList.add("is-lit")}
      >
        <span className="laser-ticks" />
        <span className="laser-hot" />
        <span className="laser-beam" />
        <span className="laser-head" />
        <span className="laser-flash" />
      </m.div>
    </LazyMotion>
  );
}
