import "server-only";
import { getStore } from "@/lib/store";
import { haversineMeters, isWithinAlappuzha } from "@/lib/engine/geo";
import { findLandmark } from "@/lib/engine/landmarks";
import { STATUS_LABEL } from "@/lib/labels";
import { MAX_INCIDENTS, type AgentIncident, type FindIncidentsInput, type FindIncidentsResult } from "./schemas";

export class BuddyInputError extends Error {}

const LIMITATIONS =
  "These are community reports, not official information. They may be outdated, inaccurate or unverified. " +
  "No road clearance or route safety assessment was made, and the absence of reports does not mean a road is safe.";

/** Read-only lookup. Returns only fields that are safe to speak or show: no reporter names, transcripts, photos or audio. */
export async function findIncidents(input: FindIncidentsInput, now = new Date()): Promise<FindIncidentsResult> {
  let origin: { latitude: number; longitude: number };
  let label: string | null = null;
  if (input.latitude !== undefined && input.longitude !== undefined) {
    origin = { latitude: input.latitude, longitude: input.longitude };
  } else {
    const lm = findLandmark(input.place ?? "");
    if (!lm) throw new BuddyInputError("Place not recognised. Ask the user for a nearby landmark in Alappuzha or a map selection.");
    origin = { latitude: lm.latitude, longitude: lm.longitude };
    label = lm.name;
  }
  if (!isWithinAlappuzha(origin.latitude, origin.longitude)) {
    throw new BuddyInputError("Location is outside the Alappuzha area covered by Backwater Trace.");
  }

  const store = getStore();
  const [incidents, reports, contradictions] = await Promise.all([
    store.listIncidents(),
    store.listReports(),
    store.listContradictions(),
  ]);

  const out: AgentIncident[] = [];
  for (const inc of incidents) {
    if (input.category && inc.category !== input.category) continue;
    if (inc.status === "resolved") continue;
    const distanceMeters = Math.round(haversineMeters(origin, inc));
    if (distanceMeters > input.radiusMeters) continue;
    const own = reports.filter((r) => r.incident_id === inc.id);
    if (own.length === 0) continue;
    out.push({
      id: inc.id,
      title: inc.title,
      category: inc.category,
      status: STATUS_LABEL[inc.status] ?? inc.status,
      distanceMeters,
      reportCount: own.length,
      conflictingFields: new Set(contradictions.filter((c) => c.incident_id === inc.id).map((c) => c.field)).size,
      latestReportAt: own.reduce((max, r) => (r.reported_at > max ? r.reported_at : max), inc.updated_at),
      summary: inc.summary,
      sourceReportIds: own.map((r) => r.id),
      url: `/incidents/${inc.id}`,
    });
  }
  out.sort((a, b) => a.distanceMeters - b.distanceMeters);

  return {
    coverage: "crowdsourced-reports-only",
    checkedAt: now.toISOString(),
    searchedNear: { ...origin, label, radiusMeters: input.radiusMeters },
    incidents: out.slice(0, MAX_INCIDENTS),
    limitations: LIMITATIONS,
  };
}
