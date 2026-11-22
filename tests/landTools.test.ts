import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { calculators, calculatorAssumptions } from "../content/calculators.ts";
import { landChecklist } from "../content/landChecklist.ts";
import { fillYards, padYards, pondVolume, withAssumptions } from "../lib/calculators.ts";
import { hydricMeaning, parseCoordinates, readFlood, readSoil, soilQuery } from "../lib/landLookup.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("coordinates must be numeric and in Louisiana", () => {
  assert.equal(parseCoordinates("30.2241, -92.0198")?.lat, 30.2241);
  assert.equal(parseCoordinates("40.7, -74.0"), null);
  assert.equal(parseCoordinates("123 Main St"), null);
  assert.match(soilQuery({ lat: 30.2241, lon: -92.0198 }), /POINT\(-92\.019800 30\.224100\)/);
});

test("flood readings never overstate safety", () => {
  assert.equal(readFlood([{ FLD_ZONE: "AE", SFHA_TF: "T", STATIC_BFE: 12 }])?.risk, "high");
  assert.equal(readFlood([{ FLD_ZONE: "AE", ZONE_SUBTY: "FLOODWAY", SFHA_TF: "T" }])?.title, "Regulatory floodway");
  assert.equal(readFlood([{ FLD_ZONE: "X", ZONE_SUBTY: "0.2 PCT ANNUAL CHANCE FLOOD HAZARD", SFHA_TF: "F" }])?.risk, "moderate");
  assert.equal(readFlood([{ FLD_ZONE: "X", ZONE_SUBTY: "AREA WITH REDUCED FLOOD RISK DUE TO LEVEE", SFHA_TF: "F" }])?.risk, "moderate");
  assert.equal(readFlood([{ FLD_ZONE: "D", SFHA_TF: "F" }])?.risk, "unknown");
  assert.equal(readFlood([{ FLD_ZONE: "X", SFHA_TF: "F" }, { FLD_ZONE: "AE", SFHA_TF: "T" }])?.zone, "AE");
  assert.equal(readFlood([{ FLD_ZONE: "AE", SFHA_TF: "T", STATIC_BFE: -9999 }])?.elevation, null);
  assert.equal(readFlood([]), null);
});

test("soil readings parse USDA rows and hedge wetlands", () => {
  const soil = readSoil([["muname"], ["Kaplan silt loam", "Kaplan", "85", "Somewhat poorly drained", "D", "No"]]);
  assert.equal(soil?.component, "Kaplan");
  assert.match(hydricMeaning("No"), /does not rule them out/);
  assert.match(hydricMeaning("Yes"), /does not prove wetlands/);
});

test("the land tool discloses where a search goes and each page stays honest", () => {
  assert.match(read("components/content/LandLookup.tsx"), /does not receive or save it/);
  assert.match(read("components/content/LandLookup.tsx"), /not an official flood determination/);
  assert.match(read("app/privacy/page.tsx"), /Check Your Land/);
  assert.equal(landChecklist.length, 8);
  assert.ok(!/\$\d/.test(read("content/landChecklist.ts")));
  for (const route of ["check-your-land", "buying-land-checklist", "hurricane-prep"]) assert.match(read("app/sitemap.ts"), new RegExp(route));
});

test("calculator math", () => {
  assert.ok(Math.abs(fillYards(27, 10, 12) - 10) < 1e-9);
  assert.ok(Math.abs(padYards(10, 10, 1, 0) - 100 / 27) < 1e-9);
  assert.ok(Math.abs(padYards(10, 10, 3, 1) - 516 / 27) < 1e-9);
  assert.equal(pondVolume(10, 10, 8, 3), null);
  assert.ok(pondVolume(150, 100, 8, 3)!.yards > 0);
  assert.deepEqual(withAssumptions(100, null, null), { planned: null, trucks: null });
  assert.deepEqual(withAssumptions(100, 14, 25), { planned: 125, trucks: 9 });
});

test("calculators stay hidden with no invented owner numbers", () => {
  assert.ok(calculators.every((c) => !c.published));
  assert.deepEqual(calculatorAssumptions, { truckYards: null, compactionPercent: null });
});
