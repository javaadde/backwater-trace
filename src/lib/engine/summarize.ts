import type { Contradiction, Incident, Report } from "@/types/domain";
import { ROAD_LABEL, WATER_LABEL, CATEGORY_LABEL, FIELD_LABEL } from "@/lib/labels";

function distinct<T>(xs: (T | null)[]): T[] {
  return [...new Set(xs.filter((x): x is T => x != null))];
}

/** Plain-language, source-aware summary. Never states a single "true" value when reports disagree. */
export function summarizeIncident(
  incident: Pick<Incident, "category" | "location_text">,
  reports: Report[],
  contradictions: Contradiction[],
): string {
  const n = reports.length;
  const parts: string[] = [];
  const where = incident.location_text ? ` near ${incident.location_text}` : "";
  parts.push(
    n === 1
      ? `Unverified report of ${CATEGORY_LABEL[incident.category].toLowerCase()}${where}.`
      : `Reported by ${n} sources${where}.`,
  );

  const water = distinct(reports.map((r) => r.water_level)).map((w) => WATER_LABEL[w].toLowerCase());
  if (water.length) parts.push(`Water level reported as ${water.join(" / ")}.`);
  const road = distinct(reports.map((r) => r.road_status)).map((s) => ROAD_LABEL[s].toLowerCase());
  if (road.length) parts.push(`Road described as ${road.join(" / ")}.`);

  const fields = distinct(contradictions.map((c) => c.field)).map((f) => FIELD_LABEL[f].toLowerCase());
  if (fields.length) parts.push(`Sources disagree on ${fields.join(", ")} — needs verification.`);
  return parts.join(" ");
}

/** Incident centre = mean of its report locations. */
export function centroid(reports: Pick<Report, "latitude" | "longitude">[]): { latitude: number; longitude: number } {
  const lat = reports.reduce((s, r) => s + r.latitude, 0) / reports.length;
  const lng = reports.reduce((s, r) => s + r.longitude, 0) / reports.length;
  return { latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) };
}
