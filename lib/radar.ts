/** Radar view and playback math. Kept free of React so it can be unit tested. */

const HOST = "https://mesonet.agron.iastate.edu";
const WORLD = 20037508.342789244;
const ZOOM = 8;
const TILE = (WORLD * 2) / 2 ** ZOOM;

/** Web Mercator tile window at zoom 8, roughly centered on Lafayette. */
export const VIEW = { left: 61, right: 64, top: 104.25, bottom: 106.5, width: 768, height: 576 };

export const RADAR_STATUS_URL = `${HOST}/data/gis/images/4326/USCOMP/n0q_0.json`;

/** Oldest first. The feed publishes one national composite every five minutes. */
export const FRAME_AGES = [55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0];

export const STEP_MS = 520;
export const HOLD_MS = 1100;
export const WRAP_MS = 520;

export function frameUrl(minutesAgo: number, key: string) {
  const suffix = minutesAgo === 0 ? "" : `-m${String(minutesAgo).padStart(2, "0")}m`;
  const bbox = [
    -WORLD + VIEW.left * TILE,
    WORLD - VIEW.bottom * TILE,
    -WORLD + VIEW.right * TILE,
    WORLD - VIEW.top * TILE,
  ]
    .map((n) => n.toFixed(2))
    .join(",");
  const query = [
    "service=WMS",
    "version=1.1.1",
    "request=GetMap",
    "format=image/png",
    "transparent=true",
    "srs=EPSG:900913",
    "styles=",
    `layers=nexrad-n0q-900913${suffix}`,
    `bbox=${bbox}`,
    `width=${VIEW.width}`,
    `height=${VIEW.height}`,
    `v=${encodeURIComponent(key)}`,
  ].join("&");
  return `${HOST}/cgi-bin/wms/nexrad/n0q.cgi?${query}`;
}

export type MapTile = { key: string; src: string; left: number; top: number; width: number; height: number };

export function mapTiles(layer: "uscounties" | "usstates"): MapTile[] {
  const cols = VIEW.right - VIEW.left;
  const rows = VIEW.bottom - VIEW.top;
  const tiles: MapTile[] = [];
  for (let y = Math.floor(VIEW.top); y < Math.ceil(VIEW.bottom); y++) {
    for (let x = VIEW.left; x < VIEW.right; x++) {
      tiles.push({
        key: `${layer}-${x}-${y}`,
        src: `${HOST}/c/tile.py/1.0.0/${layer}/${ZOOM}/${x}/${y}.png`,
        left: ((x - VIEW.left) / cols) * 100,
        top: ((y - VIEW.top) / rows) * 100,
        width: 100 / cols,
        height: 100 / rows,
      });
    }
  }
  return tiles;
}

/** Where a latitude and longitude falls in the view, as percentages. */
export function placeOnView(lat: number, lon: number) {
  const n = 2 ** ZOOM;
  const rad = (lat * Math.PI) / 180;
  const x = ((lon + 180) / 360) * n;
  const y = ((1 - Math.log(Math.tan(Math.PI / 4 + rad / 2)) / Math.PI) / 2) * n;
  return {
    x: ((x - VIEW.left) / (VIEW.right - VIEW.left)) * 100,
    y: ((y - VIEW.top) / (VIEW.bottom - VIEW.top)) * 100,
  };
}

export const cycleLength = (count: number) => (count - 1) * STEP_MS + HOLD_MS + WRAP_MS;

/** Which two frames to show at a point in the loop, and how far to blend them. */
export function blendAt(clock: number, count: number) {
  if (count < 2) return { from: 0, to: 0, mix: 0 };
  const last = count - 1;
  const cycle = cycleLength(count);
  const t = ((clock % cycle) + cycle) % cycle;
  const run = last * STEP_MS;
  if (t < run) {
    const from = Math.floor(t / STEP_MS);
    return { from, to: from + 1, mix: t / STEP_MS - from };
  }
  if (t < run + HOLD_MS) return { from: last, to: last, mix: 0 };
  return { from: last, to: 0, mix: (t - run - HOLD_MS) / WRAP_MS };
}
