import type { FeatureCollection, Point, Polygon, MultiPolygon } from "geojson";
import type { researcherHubs } from "./research-store";

export const INDONESIA_BOUNDS: [[number, number], [number, number]] = [[94, -12], [142, 7]];

// Stable region codes allow future official administrative GeoJSON and statistics
// to be joined without changing the map component. Do not use illustrative borders.
export type RegionalProperties = { regionCode: string; name: string; value: number };
export type RegionalData = FeatureCollection<Polygon | MultiPolygon, RegionalProperties>;
export const EMPTY_REGIONS: RegionalData = { type: "FeatureCollection", features: [] };

export function hubGeoJSON(hubs: ReturnType<typeof researcherHubs>): FeatureCollection<Point> {
  return { type: "FeatureCollection", features: hubs.map(hub => ({
    type: "Feature", id: hub.id,
    geometry: { type: "Point", coordinates: [hub.lon, hub.lat] },
    properties: { id: hub.id, name: hub.name, region: hub.region, count: hub.count },
  })) };
}
