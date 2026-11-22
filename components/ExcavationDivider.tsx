"use client";

/**
 * The dirt between the home hero and Services. It server-renders as a
 * still pile, which is also what reduced-motion and no-JS visitors keep.
 * Scrolling digs the layers away; positions are written through refs so
 * a scroll never re-renders React.
 */
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { DIG_LAYERS, digProgress, layerOffset, layerPath, seamProgress } from "@/lib/digProgress";
import { useStillness } from "@/lib/useStillness";

export function ExcavationDivider() {
  const root = useRef<HTMLDivElement>(null);
  const seam = useRef<HTMLDivElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const still = useStillness();
  const { scrollY } = useScroll();

  const apply = useCallback((progress: number) => {
    paths.current.forEach((path, i) =>
      path?.setAttribute("transform", `translate(0 ${layerOffset(i, progress).toFixed(1)})`)
    );
    if (seam.current) seam.current.style.transform = `scaleX(${seamProgress(progress)})`;
  }, []);

  const update = useCallback(
    (y: number) => apply(digProgress(y, root.current?.parentElement?.offsetHeight ?? 0)),
    [apply]
  );

  useMotionValueEvent(scrollY, "change", (y) => {
    if (!still) update(y);
  });

  useEffect(() => {
    if (still) return apply(0);
    const onResize = () => update(scrollY.get());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [still, apply, update, scrollY]);

  return (
    <div ref={root} className="dig-divider" aria-hidden="true">
      <svg viewBox="0 0 1600 220" preserveAspectRatio="none">
        {DIG_LAYERS.map((layer, i) => (
          <path
            key={layer.color}
            ref={(el) => {
              paths.current[i] = el;
            }}
            fill={layer.color}
            d={layerPath(i)}
          />
        ))}
      </svg>
      <div ref={seam} className="dig-seam" />
    </div>
  );
}
