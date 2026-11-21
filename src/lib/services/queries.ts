import "server-only";
import type { ActivityItem, Contradiction, Incident, IncidentDetail, IncidentSummary, Report, ReportView } from "@/types/domain";
import { getStore } from "@/lib/store";
import { buildGraph } from "@/lib/engine/build-graph";
import { FIELD_LABEL } from "@/lib/labels";

function summarize(incident: Incident, reports: Report[], contradictions: Contradiction[]): IncidentSummary {
  const own = reports.filter((r) => r.incident_id === incident.id);
  return {
    ...incident,
    report_count: own.length,
    // Count distinct fields in dispute, not report pairs.
    contradiction_count: new Set(contradictions.filter((c) => c.incident_id === incident.id).map((c) => c.field)).size,
    last_reported_at: own.reduce((max, r) => (r.reported_at > max ? r.reported_at : max), incident.updated_at),
  };
}

export async function getDashboardData(): Promise<{ incidents: IncidentSummary[]; activity: ActivityItem[] }> {
  const store = getStore();
  const [incidents, reports, contradictions] = await Promise.all([
    store.listIncidents(),
    store.listReports(),
    store.listContradictions(),
  ]);
  const summaries = incidents
    .map((i) => summarize(i, reports, contradictions))
    .filter((i) => i.report_count > 0)
    .sort((a, b) => b.last_reported_at.localeCompare(a.last_reported_at));
  const byId = new Map(summaries.map((i) => [i.id, i]));

  const activity: ActivityItem[] = [
    ...reports.map((r) => ({
      id: `r:${r.id}`,
      kind: "report" as const,
      at: r.reported_at,
      incident_id: r.incident_id ?? "",
      incident_title: byId.get(r.incident_id ?? "")?.title ?? r.title,
      text: `${r.source_type === "voice" ? "Voice" : "Text"} report${r.reporter_name ? ` from ${r.reporter_name}` : ""}`,
    })),
    ...contradictions.map((c) => ({
      id: `c:${c.id}`,
      kind: "conflict" as const,
      at: c.created_at,
      incident_id: c.incident_id,
      incident_title: byId.get(c.incident_id)?.title ?? "Incident",
      text: `Possible conflict · ${FIELD_LABEL[c.field]}`,
    })),
  ]
    .filter((a) => byId.has(a.incident_id))
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 25);

  return { incidents: summaries, activity };
}

export async function getIncidentDetail(id: string): Promise<IncidentDetail | null> {
  const store = getStore();
  const incident = await store.getIncident(id);
  if (!incident) return null;
  const [reports, contradictions] = await Promise.all([
    store.listReports({ incidentId: id }),
    store.listContradictions({ incidentId: id }),
  ]);
  reports.sort((a, b) => a.reported_at.localeCompare(b.reported_at));
  const views: ReportView[] = await Promise.all(
    reports.map(async (r) => ({
      ...r,
      photo_signed_url: r.photo_url ? await store.signedEvidenceUrl(r.photo_url) : null,
      audio_signed_url: r.audio_url ? await store.signedEvidenceUrl(r.audio_url) : null,
    })),
  );
  return {
    incident: summarize(incident, reports, contradictions),
    reports: views,
    contradictions,
    graph: buildGraph(incident, reports, contradictions),
  };
}
