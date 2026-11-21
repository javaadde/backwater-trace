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

/** Rough bounding box for Alappuzha district; reports outside are rejected. */
export const ALAPPUZHA_BOUNDS = {
  minLat: 9.05,
  maxLat: 9.85,
  minLng: 76.2,
  maxLng: 76.7,
} as const;

export const ALAPPUZHA_CENTER = { latitude: 9.4981, longitude: 76.3388 } as const;

export function isWithinAlappuzha(lat: number, lng: number): boolean {
  return (
    lat >= ALAPPUZHA_BOUNDS.minLat &&
    lat <= ALAPPUZHA_BOUNDS.maxLat &&
    lng >= ALAPPUZHA_BOUNDS.minLng &&
    lng <= ALAPPUZHA_BOUNDS.maxLng
  );
}
