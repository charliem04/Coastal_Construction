"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { activeAlerts, ALERTS_URL, nextHours, peakHour, POINT_URL, type ActiveAlert, type ForecastHour } from "@/lib/weatherNow";

const NWS_OFFICE = "https://www.weather.gov/lch/";
const ALERT_MS = 120_000;
const FORECAST_MS = 900_000;

async function getJson(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}

/** Live NWS alerts and the 12-hour rain outlook for Lafayette, beside the radar. */
export function ConditionsRail() {
  const root = useRef<HTMLElement>(null);
  const visible = useRef(false);
  const forecastAt = useRef(0);
  const [hours, setHours] = useState<ForecastHour[] | null>(null);
  const [forecastFailed, setForecastFailed] = useState(false);
  const [alerts, setAlerts] = useState<ActiveAlert[] | null>(null);
  const [alertsFailed, setAlertsFailed] = useState(false);
  const [focus, setFocus] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    if (!visible.current || document.hidden) return;
    try {
      const body = await getJson(ALERTS_URL);
      setAlerts(activeAlerts(body.features ?? []));
      setAlertsFailed(false);
    } catch {
      // Never leave an old "no alerts" message up after a failed check.
      setAlertsFailed(true);
    }
    if (Date.now() - forecastAt.current < FORECAST_MS) return;
    try {
      const point = await getJson(POINT_URL);
      const forecast = await getJson(point.properties.forecastHourly);
      const next = nextHours(forecast.properties.periods ?? [], new Date());
      if (next.length === 0) throw new Error("empty forecast");
      setHours(next);
      setForecastFailed(false);
      forecastAt.current = Date.now();
    } catch {
      setForecastFailed(true);
    }
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) void refresh();
      },
      { rootMargin: "240px" }
    );
    observer.observe(el);
    const timer = window.setInterval(refresh, ALERT_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [refresh]);

  const current = hours?.[0];
  const peak = hours ? peakHour(hours) : null;
  const shown = focus !== null && hours?.[focus] ? hours[focus] : peak;
  const readout = !shown
    ? ""
    : focus !== null
      ? `${shown.chance}% at ${shown.label}`
      : shown.chance === 0
        ? "No rain expected"
        : `Peak ${shown.chance}% at ${shown.label}`;

  return (
    <aside className="conditions-rail" ref={root} aria-label="Lafayette weather conditions">
      <section className="conditions-now">
        <h3>Lafayette Forecast</h3>
        {current ? (
          <>
            <p className="conditions-temp">{current.temperature}&deg;F</p>
            <p>{current.sky}</p>
            <p className="conditions-muted">Wind {current.wind}</p>
          </>
        ) : (
          <p className="conditions-muted">{forecastFailed ? "Forecast unavailable right now." : "Loading forecast"}</p>
        )}
      </section>

      <section className="conditions-alerts" data-active={Boolean(alerts?.length)} aria-live="polite">
        <h3>NWS Alerts</h3>
        {alertsFailed ? (
          <p>
            Could not check alerts.{" "}
            <a href={NWS_OFFICE} target="_blank" rel="noopener noreferrer">
              Check NWS Lake Charles
            </a>
            .
          </p>
        ) : alerts === null ? (
          <p className="conditions-muted">Checking alerts</p>
        ) : alerts.length === 0 ? (
          <p className="conditions-clear">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            No active alerts for Lafayette
          </p>
        ) : (
          <>
            <ul>
              {alerts.slice(0, 3).map((alert) => (
                <li key={alert.id}>
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 1.5 15 14H1L8 1.5Zm-.8 4.8v4h1.6v-4H7.2Zm0 5v1.5h1.6v-1.5H7.2Z" fill="currentColor" fillRule="evenodd" />
                  </svg>
                  <span>
                    <strong>{alert.event}</strong>
                    {alert.until && <small>{alert.until}</small>}
                  </span>
                </li>
              ))}
            </ul>
            <a href={NWS_OFFICE} target="_blank" rel="noopener noreferrer">
              {alerts.length > 3 ? `See all ${alerts.length} alerts` : "Read details at NWS"}
            </a>
          </>
        )}
      </section>

      <section className="conditions-rain">
        <div className="conditions-rain-head">
          <h3>Rain Chance, 12 Hours</h3>
          <p>{readout}</p>
        </div>
        {hours ? (
          <>
            <div className="rain-chart" aria-hidden="true" onPointerLeave={() => setFocus(null)}>
              {hours.map((hour, i) => (
                <div key={`${hour.label}-${i}`} className="rain-hit" data-focus={focus === i} onPointerEnter={() => setFocus(i)} onPointerDown={() => setFocus(i)}>
                  <i style={{ height: `max(2px, ${hour.chance}%)` }} />
                </div>
              ))}
            </div>
            <div className="rain-axis" aria-hidden="true">
              <span>{hours[0].label}</span>
              <span>{hours[hours.length - 1].label}</span>
            </div>
            <table className="sr-only">
              <caption>Hourly chance of rain in Lafayette</caption>
              <tbody>
                {hours.map((hour, i) => (
                  <tr key={`${hour.label}-${i}`}>
                    <th scope="row">{hour.label}</th>
                    <td>{hour.chance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="conditions-muted">{forecastFailed ? "Rain outlook unavailable right now." : "Loading rain outlook"}</p>
        )}
      </section>

      <Link className="conditions-link" href="/guides/how-soon-after-rain-dirt-work">
        How soon can dirt work restart after rain?
      </Link>
    </aside>
  );
}
