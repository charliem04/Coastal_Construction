"use client";

/**
 * The footer's angled top edge, cut like a dozer blade. When the footer
 * comes into view the slant swipes in from the left and stops in place,
 * once per page. The HTML holds the finished shape, so no-JS and
 * reduced-motion visitors simply see the edge at rest.
 */
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { BLADE_EDGE, edgePaths, swipeX } from "@/lib/bladeEdge";

const rest = edgePaths(BLADE_EDGE.rest);

export function BladeEdge() {
  const pathname = usePathname();
  const svg = useRef<SVGSVGElement>(null);
  const accent = useRef<SVGPathElement>(null);
  const fill = useRef<SVGPathElement>(null);
  const line = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const draw = (x: number) => {
      const d = edgePaths(x);
      accent.current?.setAttribute("d", d.accent);
      fill.current?.setAttribute("d", d.fill);
      line.current?.setAttribute("d", d.line);
    };

    let raf = 0;
    let settle = 0;
    draw(BLADE_EDGE.start);

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const frame = (now: number) => {
          const t = (now - start) / BLADE_EDGE.duration;
          draw(swipeX(t));
          if (t < 1) raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        // A backgrounded tab pauses frames; the edge still finishes in place.
        settle = window.setTimeout(() => draw(BLADE_EDGE.rest), BLADE_EDGE.duration + 120);
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      draw(BLADE_EDGE.rest);
    };
  }, [pathname]);

  return (
    <svg ref={svg} className="footer-blade" viewBox="0 0 1200 46" preserveAspectRatio="none" aria-hidden="true">
      <path ref={accent} fill="#7f1d1d" d={rest.accent} />
      <path ref={fill} fill="#000" d={rest.fill} />
      <path ref={line} fill="none" stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" d={rest.line} />
    </svg>
  );
}
