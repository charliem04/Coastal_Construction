"use client";

/**
 * A button that opens one Cal.com event type in Cal.com's popup.
 *
 * It carries data-cal-link / data-cal-config exactly as the old markup
 * did; Cal.com's embed (components/CalEmbed) listens for clicks on those
 * attributes. If the embed hasn't loaded — blocked by an extension, a
 * network hiccup, a click in the first moment — the click opens the
 * same booking page in a new tab instead, so the button never does
 * nothing.
 *
 * Renders nothing when the event isn't configured (lib/booking).
 */
import type { MouseEvent } from "react";
import { bookingTarget } from "@/lib/booking";

export function BookingButton({ event, className = "method-button" }: { event: string; className?: string }) {
  const target = bookingTarget(event);
  if (!target) return null;

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (window.__calReady) return; // the embed opens its popup
    e.preventDefault();
    window.open(target.url, "_blank", "noopener");
  };

  return (
    <button
      type="button"
      className={className}
      data-cal-link={target.calLink}
      data-cal-config={JSON.stringify(target.config)}
      onClick={onClick}
    >
      {target.label}
    </button>
  );
}
