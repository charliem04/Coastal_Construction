"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * "Should this render completely still?", safe to branch a render on.
 *
 * The HTML in /out is produced once, with no visitor, so it cannot know
 * the answer. useReducedMotion() can report true on the first client
 * render and cause a hydration mismatch. Holding false until after mount
 * makes the first render match by construction; the reduced-motion block
 * in app/globals.css covers the one frame in between.
 */
export function useStillness(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!reduce;
}
