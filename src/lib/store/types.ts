import type { Contradiction, Incident, Report } from "@/types/domain";

export interface DataStore {
  readonly kind: "supabase" | "local";
  listIncidents(): Promise<Incident[]>;
  getIncident(id: string): Promise<Incident | null>;
  listReports(filter?: { incidentId?: string }): Promise<Report[]>;
  listContradictions(filter?: { incidentId?: string }): Promise<Contradiction[]>;
  insertIncident(incident: Incident): Promise<void>;
  updateIncident(id: string, patch: Partial<Omit<Incident, "id">>): Promise<void>;
  insertReport(report: Report): Promise<void>;
  insertContradictions(rows: Contradiction[]): Promise<void>;
  deleteIncident(id: string): Promise<void>;
  /** Replace all data (used by the seed script). */
  replaceAll(data: { incidents: Incident[]; reports: Report[]; contradictions: Contradiction[] }): Promise<void>;
  uploadEvidence(path: string, bytes: Uint8Array, contentType: string): Promise<void>;
  /** Short-lived URL for private evidence. */
  signedEvidenceUrl(path: string): Promise<string | null>;
}
