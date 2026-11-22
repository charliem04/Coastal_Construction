/** Request building and plain-language readings for the Check Your Land tool. */

export type LandPoint = { lat: number; lon: number; label: string };

/** Louisiana's bounding box. A match outside it is not a useful answer here. */
const BOUNDS = { west: -94.05, south: 28.9, east: -88.8, north: 33.02 };

export const SOIL_URL = "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest";

export function parseCoordinates(input: string): LandPoint | null {
  const m = input.trim().match(/^(-?\d{1,2}(?:\.\d+)?)\s*[, ]\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lon = Number(m[2]);
  if (!inLouisiana(lat, lon)) return null;
  return { lat, lon, label: `${lat.toFixed(5)}, ${lon.toFixed(5)}` };
}

export const inLouisiana = (lat: number, lon: number) =>
  lat >= BOUNDS.south && lat <= BOUNDS.north && lon >= BOUNDS.west && lon <= BOUNDS.east;

export function geocodeUrl(address: string) {
  const params = new URLSearchParams({
    format: "jsonv2",
    limit: "1",
    countrycodes: "us",
    viewbox: `${BOUNDS.west},${BOUNDS.north},${BOUNDS.east},${BOUNDS.south}`,
    bounded: "1",
    q: address.trim(),
  });
  return `https://nominatim.openstreetmap.org/search?${params}`;
}

export function floodUrl({ lat, lon }: Pick<LandPoint, "lat" | "lon">) {
  const params = new URLSearchParams({
    geometry: `${lon.toFixed(6)},${lat.toFixed(6)}`,
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "FLD_ZONE,ZONE_SUBTY,SFHA_TF,STATIC_BFE",
    returnGeometry: "false",
    f: "json",
  });
  return `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query?${params}`;
}

/** Coordinates are formatted numbers, so nothing a visitor types reaches the query. */
export function soilQuery({ lat, lon }: Pick<LandPoint, "lat" | "lon">) {
  const point = `POINT(${lon.toFixed(6)} ${lat.toFixed(6)})`;
  return (
    "SELECT TOP 1 mu.muname, c.compname, c.comppct_r, c.drainagecl, c.hydgrp, c.hydricrating " +
    "FROM mapunit mu INNER JOIN component c ON c.mukey = mu.mukey " +
    `WHERE mu.mukey IN (SELECT * FROM SDA_Get_Mukey_from_intersection_with_WktWgs84('${point}')) ` +
    "AND c.majcompflag = 'Yes' ORDER BY c.comppct_r DESC"
  );
}

export type FloodFeature = { FLD_ZONE?: string; ZONE_SUBTY?: string | null; SFHA_TF?: string; STATIC_BFE?: number | null };
export type FloodReading = { zone: string; risk: "high" | "moderate" | "low" | "unknown"; title: string; meaning: string; elevation: number | null };

export function readFlood(features: FloodFeature[]): FloodReading | null {
  if (features.length === 0) return null;
  const f = features.find((x) => x.SFHA_TF === "T") ?? features[0];
  const zone = (f.FLD_ZONE ?? "").trim().toUpperCase();
  const sub = (f.ZONE_SUBTY ?? "").toUpperCase();
  const elevation = typeof f.STATIC_BFE === "number" && f.STATIC_BFE > -9000 ? f.STATIC_BFE : null;
  const base = { zone, elevation };

  if (sub.includes("FLOODWAY")) {
    return { ...base, risk: "high", title: "Regulatory floodway", meaning: "This is the channel and nearby land that must stay open to carry floodwater. Fill and building here face the strictest limits, so talk to the parish floodplain administrator before any work." };
  }
  if (zone.startsWith("V")) {
    return { ...base, risk: "high", title: "High-risk coastal flood area", meaning: "This area has at least a 1% annual flood chance plus storm wave hazard. Building rules are stricter, and fill is often restricted for support of structures." };
  }
  if (zone === "AO" || zone === "AH") {
    return { ...base, risk: "high", title: "High-risk shallow flooding", meaning: "This area has at least a 1% annual chance of shallow flooding, usually one to three feet deep. Elevation, drainage, and permits should be checked before site work." };
  }
  if (zone.startsWith("A")) {
    return { ...base, risk: "high", title: "High-risk flood area", meaning: "This is a Special Flood Hazard Area, with at least a 1% chance of flooding each year. Expect floodplain permitting, elevation requirements, and likely flood insurance with a federally backed mortgage." };
  }
  if (zone === "X" && sub.includes("0.2")) {
    return { ...base, risk: "moderate", title: "Moderate flood risk", meaning: "This area is outside the high-risk zone but has about a 0.2% annual flood chance. Flood insurance is usually optional, though drainage still deserves a close look." };
  }
  if (zone === "X" && sub.includes("LEVEE")) {
    return { ...base, risk: "moderate", title: "Reduced risk due to levee", meaning: "A levee lowers the mapped risk here, but it does not remove it. Flooding is still possible if a levee is overtopped or fails." };
  }
  if (zone === "X") {
    return { ...base, risk: "low", title: "Minimal mapped flood risk", meaning: "FEMA maps this point outside its higher-risk flood areas. Heavy rain can still cause local flooding, especially on flat ground with poor drainage." };
  }
  if (zone === "D") {
    return { ...base, risk: "unknown", title: "Flood risk not determined", meaning: "Flooding is possible here, but FEMA has not studied the risk. Ask the parish floodplain office what applies." };
  }
  return { ...base, risk: "unknown", title: "No standard flood zone", meaning: "FEMA's map does not give a standard zone at this point. It may be open water or an area outside the study. Confirm with the parish floodplain office." };
}

export type SoilRow = { name: string; component: string; percent: number | null; drainage: string; group: string; hydric: string };

export function readSoil(table: unknown): SoilRow | null {
  if (!Array.isArray(table) || table.length < 2) return null;
  const [name, component, percent, drainage, group, hydric] = table[1] as (string | null)[];
  return {
    name: name ?? "Unnamed soil",
    component: component ?? "",
    percent: percent ? Number(percent) : null,
    drainage: drainage ?? "",
    group: group ?? "",
    hydric: hydric ?? "",
  };
}

export function drainageMeaning(drainage: string) {
  const d = drainage.toLowerCase();
  if (d.startsWith("very poorly")) return "Water stays at or near the surface for long periods. Expect slow drying, soft access, and a serious need for drainage planning.";
  if (d.startsWith("poorly")) return "The soil stays wet for long periods. Plan for slow drying after rain and check whether the site needs drainage or imported fill.";
  if (d.startsWith("somewhat poorly")) return "The soil is wet for significant parts of the year. Work windows after rain may be limited.";
  if (d.startsWith("moderately well")) return "Water moves out somewhat slowly, so the soil can stay wet for short periods.";
  if (d.startsWith("well")) return "Water drains readily under normal conditions, which usually helps site access and drying time.";
  if (d.includes("excessively")) return "Water moves out very quickly, which can make it harder to hold moisture for ponds or vegetation.";
  return "USDA does not list a drainage class for this soil.";
}

export function runoffMeaning(group: string) {
  const g = group.toUpperCase();
  if (g.includes("/")) return `When drained it acts like group ${g.split("/")[0]}. Left undrained, it acts like group D, with high runoff.`;
  if (g === "A") return "Low runoff potential. Water soaks in readily.";
  if (g === "B") return "Moderately low runoff potential.";
  if (g === "C") return "Moderately high runoff potential. Water soaks in slowly.";
  if (g === "D") return "High runoff potential. Water soaks in very slowly, so it tends to sit or run off.";
  return "USDA does not list a runoff group for this soil.";
}

export function hydricMeaning(hydric: string) {
  if (hydric === "Yes") return "This soil is rated hydric, one possible sign of wetlands. It does not prove wetlands, but check before filling, digging, or clearing.";
  if (hydric === "No") return "The main soil is not rated hydric. Wetlands can still exist in parts of a property, so this alone does not rule them out.";
  return "USDA does not give a clear hydric rating here. Check wetlands separately before site work.";
}
