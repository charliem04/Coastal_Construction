import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { guides } from "../content/guides.ts";
import { activeAlerts, nextHours, peakHour } from "../lib/weatherNow.ts";
import { blendAt, cycleLength, FRAME_AGES, frameUrl, placeOnView, STEP_MS } from "../lib/radar.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the weather cluster is complete and sourced", () => {
  const weather = guides.filter((g) => g.category === "Weather & Wet Ground");
  assert.equal(weather.length, 6);
  for (const g of weather) {
    assert.ok(g.questions.length >= 7, g.slug);
    assert.ok(g.sources.length >= 3, g.slug);
  }
});

test("the radar stays light and defers to official warnings", () => {
  const radar = read("components/content/RadarPanel.tsx");
  assert.match(radar, /IntersectionObserver/);
  assert.match(radar, /prefers-reduced-motion/);
  assert.match(radar, /setStatus\("error"\)/);
  assert.match(radar, /warnings and safety decisions/);
});

test("radar playback covers the hour in five-minute frames and blends every step", () => {
  assert.equal(FRAME_AGES.length, 12);
  assert.ok(FRAME_AGES.every((age, i) => i === 0 || FRAME_AGES[i - 1] - age === 5));
  assert.deepEqual(blendAt(STEP_MS * 2.5, 12), { from: 2, to: 3, mix: 0.5 });
  assert.deepEqual(blendAt(STEP_MS * 11 + 10, 12), { from: 11, to: 11, mix: 0 });
  const wrap = blendAt(cycleLength(12) - 1, 12);
  assert.equal(wrap.from, 11);
  assert.equal(wrap.to, 0);
  assert.equal(blendAt(cycleLength(12), 12).from, 0);
});

test("radar requests the right frames and places Lafayette in view", () => {
  assert.match(frameUrl(0, "k"), /layers=nexrad-n0q-900913&/);
  assert.match(frameUrl(5, "k"), /layers=nexrad-n0q-900913-m05m&/);
  const { x, y } = placeOnView(30.2241, -92.0198);
  assert.ok(x > 45 && x < 60 && y > 40 && y < 60);
});

test("only the radar feed is allowed for live images and data", () => {
  const csp = read("scripts/csp.mjs");
  assert.match(csp, /img-src 'self' data: https:\/\/mesonet\.agron\.iastate\.edu"/);
  assert.match(csp, /connect-src[^\n]*https:\/\/mesonet\.agron\.iastate\.edu/);
  assert.match(read("app/sitemap.ts"), /monthly\("\/weather", 0\.7\)/);
});

test("the conditions rail skips past hours and finds the peak rain chance", () => {
  const period = (hour: number, chance: number | null) => ({
    startTime: `2026-11-22T${String(hour).padStart(2, "0")}:00:00-06:00`,
    endTime: `2026-11-22T${String(hour + 1).padStart(2, "0")}:00:00-06:00`,
    temperature: 64,
    windSpeed: "0 mph",
    shortForecast: "Clear",
    probabilityOfPrecipitation: { value: chance },
  });
  const hours = nextHours([period(1, 90), period(2, null), period(3, 40), period(4, 40)], new Date("2026-11-22T08:30:00Z"));
  assert.deepEqual(hours.map((h) => h.chance), [0, 40, 40]);
  assert.equal(hours[0].wind, "Calm");
  assert.equal(peakHour(hours)?.label, "3 AM");
});

test("the conditions rail lists the most severe alert first and never hides a failed check", () => {
  const list = activeAlerts([
    { properties: { id: "a", event: "Flood Advisory", severity: "Minor" } },
    { properties: { id: "b", event: "Tornado Warning", severity: "Extreme" } },
  ]);
  assert.equal(list[0].event, "Tornado Warning");
  assert.match(read("components/content/ConditionsRail.tsx"), /Could not check alerts/);
  assert.match(read("scripts/csp.mjs"), /connect-src[^\n]*https:\/\/api\.weather\.gov/);
});
