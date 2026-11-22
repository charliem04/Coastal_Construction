"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  drainageMeaning,
  floodUrl,
  geocodeUrl,
  hydricMeaning,
  inLouisiana,
  parseCoordinates,
  readFlood,
  readSoil,
  runoffMeaning,
  SOIL_URL,
  soilQuery,
  type FloodReading,
  type LandPoint,
  type SoilRow,
} from "@/lib/landLookup";

type Part<T> = { state: "ok"; value: T | null } | { state: "failed" };
type Result = { point: LandPoint; flood: Part<FloodReading>; soil: Part<SoilRow> };

const FEMA_MAP = "https://msc.fema.gov/portal/home";
const SOIL_SURVEY = "https://websoilsurvey.nrcs.usda.gov/app/";

async function findPoint(input: string): Promise<LandPoint | null> {
  const typed = parseCoordinates(input);
  if (typed) return typed;
  const response = await fetch(geocodeUrl(input));
  if (!response.ok) throw new Error("address search failed");
  const [match] = await response.json();
  if (!match) return null;
  const lat = Number(match.lat);
  const lon = Number(match.lon);
  return inLouisiana(lat, lon) ? { lat, lon, label: match.display_name } : null;
}

async function lookUpFlood(point: LandPoint): Promise<Part<FloodReading>> {
  try {
    const response = await fetch(floodUrl(point));
    const body = await response.json();
    if (!response.ok || body.error) throw new Error("flood lookup failed");
    return { state: "ok", value: readFlood((body.features ?? []).map((f: { attributes: object }) => f.attributes)) };
  } catch {
    return { state: "failed" };
  }
}

async function lookUpSoil(point: LandPoint): Promise<Part<SoilRow>> {
  try {
    const response = await fetch(SOIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format: "JSON+COLUMNNAME", query: soilQuery(point) }),
    });
    if (!response.ok) throw new Error("soil lookup failed");
    const text = await response.text();
    return { state: "ok", value: text.trim() ? readSoil(JSON.parse(text).Table) : null };
  } catch {
    return { state: "failed" };
  }
}

/** Looks up one point. Each source fails on its own so a partial answer still helps. */
export function LandLookup() {
  const heading = useRef<HTMLHeadingElement>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (input.trim().length < 5) {
      setProblem("Enter a street address, or GPS coordinates like 30.2241, -92.0198.");
      return;
    }
    setBusy(true);
    setProblem("");
    setResult(null);
    try {
      const point = await findPoint(input);
      if (!point) {
        setProblem("We could not find that location in Louisiana. Add the city, or try GPS coordinates for rural land.");
        return;
      }
      const [flood, soil] = await Promise.all([lookUpFlood(point), lookUpSoil(point)]);
      setResult({ point, flood, soil });
      requestAnimationFrame(() => heading.current?.focus());
    } catch {
      setProblem("Address search is unavailable right now. Try GPS coordinates like 30.2241, -92.0198.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="land-tool">
      <form className="land-form" onSubmit={submit} noValidate>
        <label htmlFor="land-address">Property address or GPS coordinates</label>
        <div>
          <input
            id="land-address"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="street-address"
            placeholder="123 Main St, Lafayette, LA"
            aria-describedby="land-privacy"
            aria-invalid={Boolean(problem)}
          />
          <button type="submit" disabled={busy}>
            {busy ? "Checking" : "Check Land"}
          </button>
        </div>
        <p id="land-privacy">
          Your search goes directly to OpenStreetMap, then its map point goes to FEMA and USDA. Coastal does not receive or save it.
        </p>
      </form>

      <div aria-live="polite">
        {busy && <p className="land-status">Checking flood and soil records</p>}
        {problem && (
          <p className="land-status" role="alert">
            {problem}
          </p>
        )}
      </div>

      {result && (
        <section className="land-results" aria-labelledby="land-results-title">
          <h3 id="land-results-title" ref={heading} tabIndex={-1}>
            Results for this map point
          </h3>
          <p className="land-point">{result.point.label}</p>
          <div className="land-grid">
            <article className="land-card" data-risk={result.flood.state === "ok" ? result.flood.value?.risk ?? "unknown" : "unknown"}>
              <h4>FEMA Flood Zone</h4>
              {result.flood.state === "failed" ? (
                <p>
                  FEMA&apos;s map did not respond.{" "}
                  <a href={FEMA_MAP} target="_blank" rel="noopener noreferrer">
                    Check the FEMA Map Service Center
                  </a>
                  .
                </p>
              ) : result.flood.value ? (
                <>
                  <p className="land-value">
                    {!result.flood.value.zone ? "Zone not listed" : result.flood.value.zone.length <= 3 ? `Zone ${result.flood.value.zone}` : result.flood.value.zone}
                  </p>
                  <p className="land-label">{result.flood.value.title}</p>
                  <p>{result.flood.value.meaning}</p>
                  {result.flood.value.elevation !== null && <p>Mapped base flood elevation: {result.flood.value.elevation} ft. Confirm the datum with a surveyor.</p>}
                </>
              ) : (
                <p>
                  No digital flood zone was found here.{" "}
                  <a href={FEMA_MAP} target="_blank" rel="noopener noreferrer">
                    Check the FEMA Map Service Center
                  </a>
                  .
                </p>
              )}
            </article>
            <article className="land-card">
              <h4>USDA Soil Type</h4>
              {result.soil.state === "failed" ? (
                <p>
                  USDA&apos;s soil service did not respond.{" "}
                  <a href={SOIL_SURVEY} target="_blank" rel="noopener noreferrer">
                    Open Web Soil Survey
                  </a>
                  .
                </p>
              ) : result.soil.value ? (
                <>
                  <p className="land-value">{result.soil.value.component || result.soil.value.name}</p>
                  <p className="land-label">{result.soil.value.name}</p>
                  <dl>
                    <div>
                      <dt>Drainage: {result.soil.value.drainage || "Not listed"}</dt>
                      <dd>{drainageMeaning(result.soil.value.drainage)}</dd>
                    </div>
                    <div>
                      <dt>Runoff group: {result.soil.value.group || "Not listed"}</dt>
                      <dd>{runoffMeaning(result.soil.value.group)}</dd>
                    </div>
                    <div>
                      <dt>Hydric soil: {result.soil.value.hydric || "Not listed"}</dt>
                      <dd>{hydricMeaning(result.soil.value.hydric)}</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p>
                  No mapped soil was found at this point.{" "}
                  <a href={SOIL_SURVEY} target="_blank" rel="noopener noreferrer">
                    Open Web Soil Survey
                  </a>
                  .
                </p>
              )}
            </article>
          </div>
          <p className="land-caution">
            This is a starting point for one map location, not an official flood determination, survey, wetlands decision, or soil test. Conditions can change across a
            property. Confirm requirements with your parish and qualified professionals before buying or building.
          </p>
        </section>
      )}
    </div>
  );
}
