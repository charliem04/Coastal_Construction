"use client";

import { useEffect, useState } from "react";
import { activeAlerts, ALERTS_URL, type ActiveAlert } from "@/lib/weatherNow";

const OUTLOOK = "https://www.nhc.noaa.gov/xgtwo/two_atl_7d0.png";
const NHC = "https://www.nhc.noaa.gov/";
const NWS = "https://www.weather.gov/lch/";
const REFRESH_MS = 600_000;

export const isTropicalAlert = (event: string) => /hurricane|tropical|storm surge/i.test(event);

/** The official NHC seven-day graphic with any tropical alerts for Lafayette. */
export function TropicalPanel() {
  const [stamp, setStamp] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [alerts, setAlerts] = useState<ActiveAlert[] | null>(null);
  const [alertsFailed, setAlertsFailed] = useState(false);

  useEffect(() => {
    let live = true;
    const load = async () => {
      if (document.hidden) return;
      setStamp(Math.floor(Date.now() / REFRESH_MS));
      try {
        const response = await fetch(ALERTS_URL, { cache: "no-store" });
        if (!response.ok) throw new Error(String(response.status));
        const body = await response.json();
        if (!live) return;
        setAlerts(activeAlerts(body.features ?? []).filter((a) => isTropicalAlert(a.event)));
        setAlertsFailed(false);
      } catch {
        if (live) setAlertsFailed(true);
      }
    };
    void load();
    const timer = window.setInterval(load, REFRESH_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      live = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  return (
    <figure className="tropical-panel">
      <div className="tropical-alert" data-active={Boolean(alerts?.length)} aria-live="polite">
        <strong>Tropical alerts for Lafayette</strong>
        {alertsFailed ? (
          <span>
            Could not check alerts.{" "}
            <a href={NWS} target="_blank" rel="noopener noreferrer">
              Check NWS Lake Charles
            </a>
            .
          </span>
        ) : alerts === null ? (
          <span>Checking alerts</span>
        ) : alerts.length === 0 ? (
          <span>No active tropical alerts</span>
        ) : (
          <span>
            {alerts.map((a) => a.event).join(", ")}.{" "}
            <a href={NWS} target="_blank" rel="noopener noreferrer">
              Read official details
            </a>
            .
          </span>
        )}
      </div>
      {imageFailed ? (
        <p className="tropical-fallback">
          The outlook did not load.{" "}
          <a href={NHC} target="_blank" rel="noopener noreferrer">
            Open the National Hurricane Center
          </a>
          .
        </p>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- live NHC graphic, not a build asset
        <img
          src={stamp ? `${OUTLOOK}?t=${stamp}` : OUTLOOK}
          width={900}
          height={679}
          loading="lazy"
          decoding="async"
          alt="National Hurricane Center seven-day graphical tropical weather outlook for the Atlantic basin"
          onError={() => setImageFailed(true)}
        />
      )}
      <figcaption>
        Official Atlantic outlook from the{" "}
        <a href={NHC} target="_blank" rel="noopener noreferrer">
          National Hurricane Center
        </a>
        . Follow local officials and NWS Lake Charles for warnings and evacuation decisions.
      </figcaption>
    </figure>
  );
}
