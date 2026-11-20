"use client";

/**
 * The review ribbon: drifts left slowly on its own, can be dragged
 * (mouse or touch) with a little momentum, pauses while hovered — the
 * old inline script's behaviour, kept. Two accessibility additions: it
 * also pauses while it has keyboard focus, and doesn't drift at all for
 * visitors who ask for reduced motion.
 *
 * The list is rendered twice so the drift can loop seamlessly; the
 * second copy is hidden from screen readers.
 */
import { useEffect, useRef } from "react";
import { reviews } from "@/content/reviews";

export function Reviews({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let isDown = false;
    let paused = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let raf = 0;

    const momentum = () => {
      if (Math.abs(velocity) > 0.1) {
        velocity *= 0.95;
        velocity = Math.max(-4, Math.min(4, velocity));
        el.scrollLeft -= velocity * 8;
        raf = requestAnimationFrame(momentum);
      }
    };
    const down = (x: number) => {
      isDown = true;
      startX = x - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      velocity = 0;
      lastX = startX;
      lastTime = Date.now();
      cancelAnimationFrame(raf);
    };
    const move = (x: number) => {
      if (!isDown) return;
      const px = x - el.offsetLeft;
      const now = Date.now();
      const dt = now - lastTime;
      if (dt > 0) velocity = Math.max(-3, Math.min(3, ((px - lastX) / dt) * 10));
      const target = scrollLeft + (startX - px) * 1.5;
      el.scrollLeft += (target - el.scrollLeft) * 0.3;
      lastX = px;
      lastTime = now;
    };
    const up = () => {
      if (!isDown) return;
      isDown = false;
      momentum();
    };

    const onMouseDown = (e: MouseEvent) => down(e.pageX);
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      move(e.pageX);
    };
    const onTouchStart = (e: TouchEvent) => down(e.touches[0].pageX);
    const onTouchMove = (e: TouchEvent) => move(e.touches[0].pageX);
    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
      up();
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseup", up);
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", up);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);

    // Slow and steady: 0.5px every 30ms, looping at the halfway point.
    const timer = reduced
      ? undefined
      : window.setInterval(() => {
          if (isDown || paused) return;
          el.scrollLeft += 0.5;
          if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
        }, 30);

    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(raf);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseup", up);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", up);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, []);

  if (!reviews.length) return null;

  const cards = (copy: 0 | 1) =>
    reviews.map((r, i) => (
      <figure key={`${copy}-${i}`} className="review-card" aria-hidden={copy === 1 ? true : undefined}>
        <div className="review-stars" role="img" aria-label="5 out of 5 stars">
          ★★★★★
        </div>
        <blockquote className="review-text">&ldquo;{r.quote}&rdquo;</blockquote>
        <figcaption className="review-author">- {r.author}</figcaption>
      </figure>
    ));

  return (
    <div className="reviews-scroll-container">
      <div ref={ref} className="reviews-scroll" role="region" aria-label={label} tabIndex={0}>
        {cards(0)}
        {cards(1)}
      </div>
    </div>
  );
}
