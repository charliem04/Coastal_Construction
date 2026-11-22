"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef } from "react";

/** A thin red line along the top of the window showing page progress. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  });
  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}
