"use client";

/**
 * The dirt between the home hero and Services. It server-renders as a
 * still pile, which is also what reduced-motion and no-JS visitors keep.
 * Scrolling digs the layers away; positions are written through refs so
 * a scroll never re-renders React.
 */
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { BAND_COLORS, DIG_LAYERS, bandProgress, digProgress, layerOffset, layerPath, seamProgress } from "@/lib/digProgress";
import { useStillness } from "@/lib/useStillness";
import { LaserLayers } from "./survey/LaserLayers";

export function ExcavationDivider({ variant = "hero" }: { variant?: "hero" | "band" }) {
  const root = useRef<HTMLDivElement>(null);
  const seam = useRef<HTMLDivElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const still = useStillness();
  const { scrollY } = useScroll();

  const apply = useCallback((progress: number) => {
    paths.current.forEach((path, i) =>
      path?.setAttribute("transform", `translate(0 ${layerOffset(i, progress).toFixed(1)})`)
    );
    const draw = seamProgress(progress);
    seam.current?.style.setProperty("--draw", String(draw));
    seam.current?.classList.toggle("is-lit", draw === 1);
  }, []);

  const update = useCallback(
    (y: number) => {
      const el = root.current;
      if (!el) return;
      if (variant === "hero") return apply(digProgress(y, el.parentElement?.offsetHeight ?? 0));
      const remaining = document.documentElement.scrollHeight - window.innerHeight - y;
      apply(bandProgress(el.getBoundingClientRect().top, window.innerHeight, remaining));
    },
    [apply, variant]
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
            key={layer.base}
            ref={(el) => {
              paths.current[i] = el;
            }}
            fill={variant === "band" ? BAND_COLORS[i] : layer.color}
            d={layerPath(i)}
          />
        ))}
      </svg>
      <div ref={seam} className="tick-rule dig-laser" style={{ "--draw": 0 } as CSSProperties}>
        <LaserLayers />
      </div>
    </div>
  );
}
