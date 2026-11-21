import type { Contradiction, ContradictionField, Report } from "@/types/domain";
import { FIELD_LABEL, fieldValueLabel } from "@/lib/labels";

type ComparableReport = Pick<
  Report,
  "id" | "reported_at" | "road_status" | "water_level" | "severity" | "situation_status"
>;

const FIELD_COLUMNS: Record<ContradictionField, keyof ComparableReport> = {
  roadStatus: "road_status",
  waterLevel: "water_level",
  incidentStatus: "situation_status",
  severity: "severity",
};

export type ContradictionCandidate = Omit<Contradiction, "id" | "incident_id" | "created_at">;

/** Reports this far apart may simply describe a change over time. */
const TIME_GAP_NOTE_HOURS = 1;

function reasonFor(field: ContradictionField, a: ComparableReport, b: ComparableReport): string {
  const label = FIELD_LABEL[field].toLowerCase();
  const va = fieldValueLabel(field, String(a[FIELD_COLUMNS[field]])).toLowerCase();
  const vb = fieldValueLabel(field, String(b[FIELD_COLUMNS[field]])).toLowerCase();
  const hours = Math.abs(new Date(a.reported_at).getTime() - new Date(b.reported_at).getTime()) / 3_600_000;
  const base = `Reports for the same incident describe different ${label} (${va} vs ${vb}).`;
  return hours >= TIME_GAP_NOTE_HOURS
    ? `${base} They were made ${hours.toFixed(1)} h apart, so conditions may have changed. Needs verification.`
    : `${base} Needs verification.`;
}

/**
 * Compares a new report against existing reports of the same incident.
 * Only explicit, known structured values are compared; missing values are
 * never treated as a conflict. Results are candidates, not truth judgements.
 */
export function detectContradictions(
  newReport: ComparableReport,
  existing: ComparableReport[],
): ContradictionCandidate[] {
  const out: ContradictionCandidate[] = [];
  for (const other of existing) {
    if (other.id === newReport.id) continue;
    for (const field of Object.keys(FIELD_COLUMNS) as ContradictionField[]) {
      const col = FIELD_COLUMNS[field];
      const va = other[col];
      const vb = newReport[col];
      if (va == null || vb == null || va === vb) continue;
      out.push({
        report_a_id: other.id,
        report_b_id: newReport.id,
        field,
        value_a: String(va),
        value_b: String(vb),
        reason: reasonFor(field, other, newReport),
      });
    }
  }
  return out;
}
