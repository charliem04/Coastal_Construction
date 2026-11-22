"use client";

import { useEffect, useRef, useState } from "react";

const BASE = "https://radar.weather.gov/ridge/standard/KLCH";
const NWS_RADAR = "https://radar.weather.gov/station/klch/standard";

type Status = "loading" | "ready" | "error";

/**
 * National Weather Service radar for Acadiana (Lake Charles, KLCH).
 * Shows the small latest frame first. The larger loop loads only on request,
 * so the page stays fast and nothing moves for people who prefer less motion.
 */
export function RadarPanel() {
  const img = useRef<HTMLImageElement>(null);
  const [loop, setLoop] = useState(false);
  const [stamp, setStamp] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [loadedAt, setLoadedAt] = useState("");
  const src = `${BASE}${loop ? "_loop" : "_0"}.gif${stamp ? `?t=${stamp}` : ""}`;

  const markReady = () => {
    setStatus("ready");
    setLoadedAt(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
  };

  // The server-rendered image can finish before React attaches onLoad.
  useEffect(() => {
    const el = img.current;
    if (!el?.complete) return;
    if (el.naturalWidth > 0) markReady();
    else if (el.currentSrc) setStatus("error");
  }, [src]);

  const toggleLoop = () => {
    setStatus("loading");
    setLoop((v) => !v);
  };
  const refresh = () => {
    setStatus("loading");
    setStamp(Date.now());
  };

  return (
    <figure className="radar-panel">
      <div className="radar-bar">
        <p>
          <strong>Acadiana Radar</strong>
          <span aria-live="polite">
            {status === "ready" && `Loaded ${loadedAt}`}
            {status === "loading" && "Loading radar"}
            {status === "error" && "Radar unavailable"}
          </span>
        </p>
        <div>
          <button type="button" onClick={toggleLoop} aria-pressed={loop}>
            {loop ? "Show Latest" : "Play Loop"}
          </button>
          <button type="button" onClick={refresh} disabled={status === "loading"}>
            Refresh
          </button>
        </div>
      </div>
      <div className="radar-view" data-status={status}>
        {status === "error" ? (
          <p>
            The radar image did not load.{" "}
            <a href={NWS_RADAR} target="_blank" rel="noopener noreferrer">
              Open it at the National Weather Service
            </a>
            .
          </p>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- live NWS image, not a build asset
          <img
            ref={img}
            src={src}
            width={600}
            height={550}
            loading="lazy"
            decoding="async"
            alt="National Weather Service radar image centered on Lake Charles and covering Acadiana"
            onLoad={markReady}
            onError={() => setStatus("error")}
          />
        )}
      </div>
      <figcaption>
        Radar from the National Weather Service. Use it for a quick look only. For warnings and safety decisions, go to{" "}
        <a href="https://www.weather.gov/lch/" target="_blank" rel="noopener noreferrer">
          NWS Lake Charles
        </a>
        .
      </figcaption>
    </figure>
  );
}
