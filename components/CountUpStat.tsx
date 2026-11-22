"use client";

/**
 * A stat that counts up once on entering view. The real value is always
 * in the HTML, so crawlers, no-JS and reduced-motion visitors see it.
 */
import { useEffect, useRef } from "react";
import { parseStat } from "@/lib/stat";
import { useStillness } from "@/lib/useStillness";

const DURATION = 1250;

export function CountUpStat({ value }: { value: string }) {
  const el = useRef<HTMLElement>(null);
  const still = useStillness();

  useEffect(() => {
    const node = el.current;
    const stat = parseStat(value);
    if (!node || !stat || still || !("IntersectionObserver" in window)) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const frame = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          node.textContent = `${Math.round(stat.number * (1 - Math.pow(1 - t, 3)))}${stat.suffix}`;
          if (t < 1) raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      node.textContent = value;
    };
  }, [value, still]);

  return (
    <dd ref={el} className="stat-number">
      {value}
    </dd>
  );
}
