import { ALAPPUZHA_BOUNDARY, ALAPPUZHA_BOUNDARY_BBOX } from "@/lib/geo/alappuzha-boundary";
import { pointInPolygon } from "@/lib/geo/point-in-polygon";

const EARTH_RADIUS_M = 6_371_000;

/** Great-circle distance in metres between two lat/lng points. */
export function haversineMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Bounding box of the official district boundary (used for map limits and as a fast pre-check). */
export const ALAPPUZHA_BOUNDS = ALAPPUZHA_BOUNDARY_BBOX;

export const ALAPPUZHA_CENTER = { latitude: 9.4981, longitude: 76.3388 } as const;

/** True when the point lies inside Alappuzha district's OSM boundary. */
export function isWithinAlappuzha(lat: number, lng: number): boolean {
  const b = ALAPPUZHA_BOUNDS;
  if (lat < b.minLat || lat > b.maxLat || lng < b.minLng || lng > b.maxLng) return false;
  return pointInPolygon(lat, lng, ALAPPUZHA_BOUNDARY);
}
