"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { blendAt, cycleLength, FRAME_AGES, frameUrl, mapTiles, placeOnView, RADAR_STATUS_URL, STEP_MS, VIEW } from "@/lib/radar";

const NWS_RADAR = "https://radar.weather.gov/station/klch/standard";
const CHECK_MS = 60_000;

const PLACES = [
  { name: "Lafayette", lat: 30.2241, lon: -92.0198, major: true },
  { name: "New Iberia", lat: 30.0035, lon: -91.8187, major: true },
  { name: "Opelousas", lat: 30.5335, lon: -92.0815, major: false },
  { name: "Crowley", lat: 30.2141, lon: -92.3746, major: false },
  { name: "Abbeville", lat: 29.9744, lon: -92.1343, major: false },
  { name: "Lake Charles", lat: 30.2266, lon: -93.2174, major: true },
  { name: "Baton Rouge", lat: 30.4515, lon: -91.1871, major: true },
];

const COUNTIES = mapTiles("uscounties");
const STATES = mapTiles("usstates");

type Status = "waiting" | "loading" | "ready" | "error";
type Frame = { image: HTMLImageElement; age: number };

const clockTime = (date: Date) =>
  `${date.toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" })} CT`;

function loadFrame(age: number, key: string) {
  return new Promise<Frame | null>((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      image
        .decode()
        .catch(() => undefined)
        .then(() => resolve({ image, age }));
    };
    image.onerror = () => resolve(null);
    image.src = frameUrl(age, key);
  });
}

/**
 * Live NEXRAD radar for Acadiana. Twelve five-minute frames play in a
 * continuous loop, blended on a canvas so storms drift instead of jumping.
 * It loads near the viewport, stops off screen, picks up new frames by
 * itself, and starts paused for people who prefer less motion.
 */
export function RadarPanel() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scrubber = useRef<HTMLInputElement>(null);
  const stamp = useRef<HTMLSpanElement>(null);
  const frames = useRef<Frame[]>([]);
  const validAt = useRef<Date | null>(null);
  const key = useRef("");
  const clock = useRef(0);
  const visible = useRef(false);
  const syncing = useRef(false);
  const [status, setStatus] = useState<Status>("waiting");
  const [playing, setPlaying] = useState(true);
  const [updated, setUpdated] = useState("");

  const paint = useCallback(() => {
    const ctx = canvas.current?.getContext("2d");
    const list = frames.current;
    if (!ctx || list.length === 0) return;
    const { from, to, mix } = blendAt(clock.current, list.length);
    ctx.clearRect(0, 0, VIEW.width, VIEW.height);
    // Additive blending keeps storms at full strength through the crossfade.
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 1 - mix;
    ctx.drawImage(list[from].image, 0, 0, VIEW.width, VIEW.height);
    if (mix > 0) {
      ctx.globalAlpha = mix;
      ctx.drawImage(list[to].image, 0, 0, VIEW.width, VIEW.height);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    const shown = list[mix < 0.5 ? from : to];
    const label = validAt.current
      ? clockTime(new Date(validAt.current.getTime() - shown.age * 60_000))
      : shown.age === 0
        ? "Latest"
        : `${shown.age} min ago`;
    if (stamp.current && stamp.current.textContent !== label) stamp.current.textContent = label;
    if (scrubber.current) {
      const position = to > from ? from + mix : from;
      scrubber.current.max = String(list.length - 1);
      scrubber.current.value = String(position);
      scrubber.current.setAttribute("aria-valuetext", label);
    }
  }, []);

  const sync = useCallback(async () => {
    if (syncing.current) return;
    syncing.current = true;
    try {
      let valid: Date | null = null;
      try {
        const response = await fetch(RADAR_STATUS_URL, { cache: "no-store" });
        const body = await response.json();
        const parsed = new Date(body?.meta?.valid);
        if (!Number.isNaN(parsed.getTime())) valid = parsed;
      } catch {
        valid = null;
      }
      const nextKey = valid ? valid.toISOString() : String(Math.floor(Date.now() / 300_000));
      if (nextKey === key.current && frames.current.length > 0) return;

      const loaded = (await Promise.all(FRAME_AGES.map((age) => loadFrame(age, nextKey)))).filter((f): f is Frame => f !== null);
      if (loaded.length < 2) {
        if (frames.current.length === 0) setStatus("error");
        return;
      }
      const first = frames.current.length === 0;
      frames.current = loaded;
      validAt.current = valid;
      key.current = nextKey;
      if (first && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPlaying(false);
        clock.current = (loaded.length - 1) * STEP_MS;
      }
      setUpdated(valid ? clockTime(valid) : clockTime(new Date()));
      setStatus("ready");
      paint();
    } finally {
      syncing.current = false;
    }
  }, [paint]);

  // Load when close to the viewport, then keep the frames current while seen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const check = () => {
      if (visible.current && !document.hidden) void sync();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setStatus((s) => (s === "waiting" ? "loading" : s));
          check();
        }
      },
      { rootMargin: "240px" }
    );
    observer.observe(el);
    const timer = window.setInterval(check, CHECK_MS);
    document.addEventListener("visibilitychange", check);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, [sync]);

  useEffect(() => {
    if (!playing || status !== "ready") return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(now - last, 100);
      last = now;
      if (visible.current) {
        clock.current = (clock.current + elapsed) % cycleLength(frames.current.length);
        paint();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, status, paint]);

  const scrub = (value: string) => {
    setPlaying(false);
    clock.current = Number(value) * STEP_MS;
    paint();
  };

  const statusText = {
    waiting: "Loading radar",
    loading: "Loading radar",
    ready: `Live, updated ${updated}`,
    error: "Radar unavailable",
  }[status];
  const showMap = status === "loading" || status === "ready";

  return (
    <figure className="radar-panel" ref={root}>
      <div className="radar-bar">
        <p>
          <strong>Acadiana Radar</strong>
          <span aria-live="polite">{statusText}</span>
        </p>
      </div>
      <div className="radar-view" data-status={status}>
        {status === "error" ? (
          <p>
            The radar did not load.{" "}
            <a href={NWS_RADAR} target="_blank" rel="noopener noreferrer">
              Open it at the National Weather Service
            </a>
            .
          </p>
        ) : (
          <>
            {showMap && (
              <div className="radar-map" aria-hidden="true">
                {COUNTIES.map((t) => (
                  // eslint-disable-next-line @next/next/no-img-element -- live map tile, not a build asset
                  <img key={t.key} className="radar-county" src={t.src} alt="" decoding="async" style={{ left: `${t.left}%`, top: `${t.top}%`, width: `${t.width}%`, height: `${t.height}%` }} />
                ))}
                {STATES.map((t) => (
                  // eslint-disable-next-line @next/next/no-img-element -- live map tile, not a build asset
                  <img key={t.key} className="radar-state" src={t.src} alt="" decoding="async" style={{ left: `${t.left}%`, top: `${t.top}%`, width: `${t.width}%`, height: `${t.height}%` }} />
                ))}
              </div>
            )}
            <canvas
              ref={canvas}
              width={VIEW.width}
              height={VIEW.height}
              role="img"
              aria-label="Animated weather radar for the past hour over Acadiana and South Louisiana"
            />
            <div className="radar-places" aria-hidden="true">
              {PLACES.map((place) => {
                const { x, y } = placeOnView(place.lat, place.lon);
                return (
                  <span key={place.name} data-major={place.major} data-side={place.name === "Crowley" || place.name === "Abbeville" ? "left" : "right"} style={{ left: `${x}%`, top: `${y}%` }}>
                    {place.name}
                  </span>
                );
              })}
            </div>
            <span className="radar-time" ref={stamp} />
          </>
        )}
      </div>
      {status !== "error" && (
        <div className="radar-controls">
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing} disabled={status !== "ready"}>
            {playing ? "Pause" : "Play"}
          </button>
          <input
            ref={scrubber}
            type="range"
            min={0}
            max={FRAME_AGES.length - 1}
            step={0.01}
            defaultValue={0}
            disabled={status !== "ready"}
            aria-label="Radar time, past hour"
            onChange={(e) => scrub(e.target.value)}
          />
          <div className="radar-legend" aria-hidden="true">
            <span>Light</span>
            <i />
            <span>Heavy</span>
          </div>
        </div>
      )}
      <figcaption>
        NWS NEXRAD radar via the Iowa Environmental Mesonet, with frames blended for smooth playback. Use it for a quick look only.
        For warnings and safety decisions, go to{" "}
        <a href="https://www.weather.gov/lch/" target="_blank" rel="noopener noreferrer">
          NWS Lake Charles
        </a>
        .
      </figcaption>
    </figure>
  );
}
