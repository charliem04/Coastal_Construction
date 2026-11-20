"use client";

/**
 * Cal.com's embed, loaded once for the whole site from the layout.
 *
 * It does nothing on a page without a booking button: the loader only
 * runs when a [data-cal-link] element is on the page, so the home,
 * services and about pages never download Cal.com's script. There is
 * no consent gate on this site (no cookies of ours, no analytics); if
 * one is ever added, Cal.com loads after it.
 *
 * The bootstrap below is Cal.com's own snippet (the same one the old
 * contact.html inlined), rewritten as a function. Its first call
 * appends https://app.cal.com/embed/embed.js; calls before that script
 * arrives are queued. Cal("ui") takes the brand colour from
 * client.config.ts, not from a hardcoded script tag.
 */
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { bookingBrandColor, bookingProvider, CALCOM_EMBED_SRC, CALCOM_ORIGIN } from "@/lib/booking";

type CalFn = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, unknown>;
  q?: unknown[];
};

declare global {
  interface Window {
    Cal?: CalFn;
    /** Set when embed.js has actually loaded (BookingButton's fallback reads it). */
    __calReady?: boolean;
  }
}

function bootstrapCal(): CalFn {
  const w = window;
  if (w.Cal) return w.Cal;
  const push = (target: { q?: unknown[] }, args: unknown) => {
    (target.q = target.q || []).push(args);
  };
  const cal: CalFn = function (...args: unknown[]) {
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      const s = document.createElement("script");
      s.src = CALCOM_EMBED_SRC;
      s.async = true;
      s.onload = () => {
        w.__calReady = true;
      };
      document.head.appendChild(s);
      cal.loaded = true;
    }
    if (args[0] === "init") {
      const api: CalFn = function (...a: unknown[]) {
        push(api, a);
      };
      const namespace = args[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        cal.ns![namespace] = api;
        push(api, args);
      } else push(cal, args);
      return;
    }
    push(cal, args);
  };
  w.Cal = cal;
  return cal;
}

let started = false;

export function CalEmbed() {
  const path = usePathname();

  useEffect(() => {
    if (started || bookingProvider !== "calcom") return;
    if (!document.querySelector("[data-cal-link]")) return;
    started = true;
    const Cal = bootstrapCal();
    Cal("init", { origin: CALCOM_ORIGIN });
    Cal("ui", {
      styles: { branding: { brandColor: bookingBrandColor } },
      hideEventTypeDetails: false,
    });
  }, [path]);

  return null;
}
