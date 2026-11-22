/** Shapes National Weather Service responses for the conditions rail. */

export const LAFAYETTE = "30.2241,-92.0198";
export const POINT_URL = `https://api.weather.gov/points/${LAFAYETTE}`;
export const ALERTS_URL = `https://api.weather.gov/alerts/active?point=${LAFAYETTE}`;

type Period = {
  startTime: string;
  endTime: string;
  temperature: number;
  windSpeed?: string;
  windDirection?: string;
  shortForecast?: string;
  probabilityOfPrecipitation?: { value: number | null } | null;
};

type AlertFeature = {
  id?: string;
  properties?: { id?: string; event?: string; severity?: string; ends?: string | null; expires?: string | null };
};

export type ForecastHour = { label: string; chance: number; temperature: number; sky: string; wind: string };
export type ActiveAlert = { id: string; event: string; until: string };

const SEVERITY = ["Extreme", "Severe", "Moderate", "Minor"];

const hourLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "numeric" });

function windLabel(speed = "", direction = "") {
  if (!speed || /^0\b/.test(speed)) return "Calm";
  return `${direction} ${speed}`.trim();
}

/** The next hours that have not ended yet. A missing rain chance counts as zero. */
export function nextHours(periods: Period[], now: Date, count = 12): ForecastHour[] {
  return periods
    .filter((p) => new Date(p.endTime).getTime() > now.getTime())
    .slice(0, count)
    .map((p) => ({
      label: hourLabel(p.startTime),
      chance: p.probabilityOfPrecipitation?.value ?? 0,
      temperature: p.temperature,
      sky: p.shortForecast ?? "",
      wind: windLabel(p.windSpeed, p.windDirection),
    }));
}

/** The earliest hour with the highest rain chance. */
export function peakHour(hours: ForecastHour[]) {
  return hours.reduce<ForecastHour | null>((best, h) => (!best || h.chance > best.chance ? h : best), null);
}

/** Most severe first, so the alert that matters most is never pushed down. */
export function activeAlerts(features: AlertFeature[]): ActiveAlert[] {
  const rank = (f: AlertFeature) => {
    const i = SEVERITY.indexOf(f.properties?.severity ?? "");
    return i < 0 ? SEVERITY.length : i;
  };
  return [...features]
    .sort((a, b) => rank(a) - rank(b))
    .map((f) => {
      const end = f.properties?.ends ?? f.properties?.expires;
      return {
        id: f.properties?.id ?? f.id ?? f.properties?.event ?? "alert",
        event: f.properties?.event ?? "Weather Alert",
        until: end
          ? `Until ${new Date(end).toLocaleString("en-US", { timeZone: "America/Chicago", weekday: "short", hour: "numeric", minute: "2-digit" })} CT`
          : "",
      };
    });
}
