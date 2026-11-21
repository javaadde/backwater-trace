import "server-only";
import type { Contradiction, Incident, IncidentStatus, Report } from "@/types/domain";
import { getStore } from "@/lib/store";
import { normalizeReport } from "@/lib/engine/normalize-report";
import { findMatchingIncident, type MatchCandidate, type MatchResult } from "@/lib/engine/match-incidents";
import { detectContradictions } from "@/lib/engine/detect-contradictions";
import { centroid, summarizeIncident } from "@/lib/engine/summarize";
import type { ReportFields, ValidatedFile } from "@/lib/validation/report";

export interface CreateReportResult {
  report: Report;
  incident: Incident;
  match: Pick<MatchResult, "score" | "reasons"> | null;
  newContradictions: Contradiction[];
  warnings: string[];
}

function nextStatus(current: IncidentStatus, reportCount: number, newConflicts: number): IncidentStatus {
  if (current === "new" && (reportCount > 1 || newConflicts > 0)) return "needs_verification";
  if (current === "verified" && newConflicts > 0) return "needs_verification";
  return current;
}

/**
 * Report creation pipeline. Optional steps (uploads, matching, contradiction
 * checks) degrade gracefully so the report itself is always saved.
 */
export async function createReport(
  fields: ReportFields,
  files: { photo?: ValidatedFile | null; audio?: ValidatedFile | null },
): Promise<CreateReportResult> {
  const store = getStore();
  const now = new Date();
  const warnings: string[] = [];
  const id = crypto.randomUUID();
  const normalized = normalizeReport(fields, now);

  // 1. Evidence uploads (private bucket, path keyed by report id)
  let photo_url: string | null = null;
  let audio_url: string | null = null;
  if (files.photo) {
    const p = `photos/${id}/photo.${files.photo.ext}`;
    try {
      await store.uploadEvidence(p, files.photo.bytes, files.photo.contentType);
      photo_url = p;
    } catch (e) {
      console.error(e);
      warnings.push("Photo could not be stored; the report was saved without it.");
    }
  }
  if (files.audio) {
    const p = `audio/${id}/recording.${files.audio.ext}`;
    try {
      await store.uploadEvidence(p, files.audio.bytes, files.audio.contentType);
      audio_url = p;
    } catch (e) {
      console.error(e);
      warnings.push("Voice recording could not be stored; the transcript was saved.");
    }
  }

  // 2. Match against existing incidents
  let match: MatchResult | null = null;
  let incidentReports: Report[] = [];
  try {
    const [incidents, reports] = await Promise.all([store.listIncidents(), store.listReports()]);
    const candidates: MatchCandidate[] = incidents.map((incident) => ({
      incident,
      reports: reports.filter((r) => r.incident_id === incident.id),
    }));
    match = findMatchingIncident(normalized, candidates);
    if (match) incidentReports = reports.filter((r) => r.incident_id === match!.incidentId);
  } catch (e) {
    console.error("Incident matching failed", e);
    warnings.push("Automatic grouping was unavailable; a new incident was created.");
  }

  // 3. Attach or create incident
  let incident: Incident | null = match ? await store.getIncident(match.incidentId) : null;
  if (!incident) {
    match = null;
    incident = {
      id: crypto.randomUUID(),
      title: normalized.title,
      category: normalized.category,
      latitude: normalized.latitude,
      longitude: normalized.longitude,
      status: "new",
      summary: "",
      location_text: normalized.location_text,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };
    await store.insertIncident(incident);
  }

  const target: Incident = incident;
  const report: Report = {
    ...normalized,
    id,
    incident_id: target.id,
    created_at: now.toISOString(),
    photo_url,
    audio_url,
  };
  await store.insertReport(report);

  // 4. Contradiction candidates vs. reports already in the incident
  let newContradictions: Contradiction[] = [];
  try {
    newContradictions = detectContradictions(report, incidentReports).map((c) => ({
      ...c,
      id: crypto.randomUUID(),
      incident_id: target.id,
      created_at: now.toISOString(),
    }));
    await store.insertContradictions(newContradictions);
  } catch (e) {
    console.error("Contradiction check failed", e);
    newContradictions = [];
    warnings.push("Conflict check could not run for this report.");
  }

  // 5. Refresh incident aggregate (location, summary, status)
  try {
    const allReports = [...incidentReports, report];
    const allConflicts = await store.listContradictions({ incidentId: incident.id });
    const patch: Partial<Incident> = {
      ...centroid(allReports),
      location_text: incident.location_text ?? report.location_text,
      status: nextStatus(incident.status, allReports.length, newContradictions.length),
      summary: summarizeIncident(
        { category: incident.category, location_text: incident.location_text ?? report.location_text },
        allReports,
        allConflicts,
      ),
      updated_at: now.toISOString(),
    };
    await store.updateIncident(incident.id, patch);
    incident = { ...incident, ...patch };
  } catch (e) {
    console.error("Incident refresh failed", e);
  }

  return {
    report,
    incident,
    match: match ? { score: match.score, reasons: match.reasons } : null,
    newContradictions,
    warnings,
  };
}
