import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Contradiction, Incident, Report } from "@/types/domain";
import type { DataStore } from "./types";

export const EVIDENCE_BUCKET = "evidence";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

function must<T>(res: { data: T; error: { message: string } | null }, what: string): T {
  if (res.error) throw new Error(`Supabase ${what} failed: ${res.error.message}`);
  return res.data;
}

/** Server-only client using the service role key. Never import from client components. */
export function createSupabaseStore(url: string, serviceRoleKey: string): DataStore {
  const db: SupabaseClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return {
    kind: "supabase",
    async listIncidents() {
      return must(await db.from("incidents").select("*").order("updated_at", { ascending: false }), "list incidents") as Incident[];
    },
    async getIncident(id) {
      return must(await db.from("incidents").select("*").eq("id", id).maybeSingle(), "get incident") as Incident | null;
    },
    async listReports(filter) {
      let q = db.from("reports").select("*").order("reported_at", { ascending: true });
      if (filter?.incidentId) q = q.eq("incident_id", filter.incidentId);
      return must(await q, "list reports") as Report[];
    },
    async listContradictions(filter) {
      let q = db.from("contradictions").select("*").order("created_at", { ascending: true });
      if (filter?.incidentId) q = q.eq("incident_id", filter.incidentId);
      return must(await q, "list contradictions") as Contradiction[];
    },
    async insertIncident(incident) {
      must(await db.from("incidents").insert(incident), "insert incident");
    },
    async updateIncident(id, patch) {
      must(await db.from("incidents").update(patch).eq("id", id), "update incident");
    },
    async insertReport(report) {
      must(await db.from("reports").insert(report), "insert report");
    },
    async insertContradictions(rows) {
      if (rows.length) must(await db.from("contradictions").insert(rows), "insert contradictions");
    },
    async deleteIncident(id) {
      must(await db.from("incidents").delete().eq("id", id), "delete incident");
    },
    async replaceAll(data) {
      const ALL = "00000000-0000-0000-0000-000000000000";
      must(await db.from("contradictions").delete().neq("id", ALL), "clear contradictions");
      must(await db.from("reports").delete().neq("id", ALL), "clear reports");
      must(await db.from("incidents").delete().neq("id", ALL), "clear incidents");
      if (data.incidents.length) must(await db.from("incidents").insert(data.incidents), "seed incidents");
      if (data.reports.length) must(await db.from("reports").insert(data.reports), "seed reports");
      if (data.contradictions.length) must(await db.from("contradictions").insert(data.contradictions), "seed contradictions");
    },
    async uploadEvidence(path, bytes, contentType) {
      must(
        await db.storage.from(EVIDENCE_BUCKET).upload(path, bytes, { contentType, upsert: false }),
        "upload evidence",
      );
    },
    async signedEvidenceUrl(path) {
      const { data, error } = await db.storage.from(EVIDENCE_BUCKET).createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
      return error ? null : data.signedUrl;
    },
  };
}
