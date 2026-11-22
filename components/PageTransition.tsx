"use client";

/**
 * The dozer blade between pages. It takes over plain clicks on internal
 * page links only; Back/Forward, anchors, phone links and new-tab clicks
 * stay native. Navigation runs on timers rather than animation frames,
 * so a backgrounded tab still arrives and the overlay still clears.
 */
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { BLADE, latestPending, pushAt } from "@/lib/bladeTimeline";
import { drawBlade } from "@/lib/drawBlade";
import { shouldRunTransition } from "@/lib/transitionRoute";

/** Longest the dirt waits for a slow route before clearing anyway. */
const MAX_WAIT = 1500;

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const commitRef = useRef<() => void>(() => {});
  const pushedRef = useRef(false);

  useEffect(() => {
    let active = false;
    let pending: string | null = null;
    let committed = false;
    let start = 0;
    let clearStart = 0;
    let raf = 0;
    let timers: number[] = [];

    const finish = () => {
      active = false;
      pending = null;
      pushedRef.current = false;
      cancelAnimationFrame(raf);
      timers.forEach(window.clearTimeout);
      timers = [];
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.getContext("2d")?.reset?.();
        canvas.width = 0;
        canvas.height = 0;
        canvas.style.display = "none";
      }
    };

    const commit = () => {
      if (!active || committed) return;
      committed = true;
      const now = performance.now();
      clearStart = Math.max(now, start + BLADE.cover + BLADE.hold);
      timers.push(window.setTimeout(finish, clearStart + BLADE.clear - now));
    };
    commitRef.current = commit;

    const begin = (destination: string) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return router.push(destination);
      const width = document.documentElement.clientWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.display = "block";
      active = true;
      committed = false;
      pushedRef.current = false;
      pending = destination;
      start = performance.now();

      const frame = (now: number) => {
        if (!active) return;
        const covered = BLADE.cover + BLADE.hold;
        const ms = committed ? covered + Math.max(0, now - clearStart) : Math.min(now - start, covered - 1);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawBlade(ctx, width, height, ms);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);

      timers.push(
        window.setTimeout(() => {
          pushedRef.current = true;
          if (pending) router.push(pending);
        }, pushAt()),
        window.setTimeout(commit, MAX_WAIT)
      );
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const run = shouldRunTransition({
        href: link.href,
        origin: window.location.origin,
        currentPath: window.location.pathname,
        button: e.button,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        target: link.target || undefined,
        download: link.hasAttribute("download"),
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
      if (!run) return;
      const url = new URL(link.href);
      const destination = `${url.pathname}${url.search}${url.hash}`;
      if (active) {
        // After the push, a click on the new page is an ordinary navigation.
        if (pushedRef.current) return;
        e.preventDefault();
        pending = latestPending(pending, destination, false);
        return;
      }
      e.preventDefault();
      begin(destination);
    };

    // Back/Forward never plays the blade. If it lands before the push, it
    // also cancels that push, so the visitor stays where they asked to go.
    const onPopState = () => {
      if (active && !pushedRef.current) finish();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      finish();
    };
  }, [router]);

  useEffect(() => {
    if (pushedRef.current) commitRef.current();
  }, [pathname]);

  return <canvas ref={canvasRef} className="page-transition" aria-hidden="true" />;
}
