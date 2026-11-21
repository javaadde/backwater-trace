"use client";

import { TriangleExclamationPoint } from "lucide-react";
import type { Contradiction, ContradictionField, ReportView } from "@/types/domain";
import { FIELD_LABEL, fieldValueLabel } from "@/lib/labels";
import { timeAgo } from "@/lib/utils";

/**
 * Groups pairwise contradiction candidates by field so coordinators see
 * "which sources said what" rather than every pair.
 */
export function ConflictCards({
  contradictions,
  reports,
  onOpenReport,
}: {
  contradictions: Contradiction[];
  reports: ReportView[];
  onOpenReport: (id: string) => void;
}) {
  const index = new Map(reports.map((r, i) => [r.id, i]));
  const byField = new Map<ContradictionField, Map<string, Set<string>>>();
  for (const c of contradictions) {
    const values = byField.get(c.field) ?? new Map<string, Set<string>>();
    values.set(c.value_a, (values.get(c.value_a) ?? new Set()).add(c.report_a_id));
    values.set(c.value_b, (values.get(c.value_b) ?? new Set()).add(c.report_b_id));
    byField.set(c.field, values);
  }

  if (byField.size === 0) {
    return (
      <div className="rounded-xl border border-line bg-panel-2 px-4 py-3 text-sm text-fg-muted">
        No conflicting details between sources so far.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {[...byField.entries()].map(([field, values]) => {
        const example = contradictions.find((c) => c.field === field);
        return (
          <div key={field} className="rounded-xl border border-warn/30 bg-warn/[0.04] p-4">
            <div className="flex items-center gap-2">
              <TriangleExclamationPoint className="size-4 text-warn" />
              <span className="text-[13px] font-semibold text-warn">Possible conflict · {FIELD_LABEL[field]}</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[...values.entries()].map(([value, ids]) => (
                <div key={value} className="rounded-lg border border-line bg-panel-2 p-3">
                  <div className="text-[15px] font-semibold text-fg">{fieldValueLabel(field, value)}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {[...ids]
                      .sort((a, b) => (index.get(a) ?? 0) - (index.get(b) ?? 0))
                      .map((id) => {
                        const r = reports.find((x) => x.id === id);
                        return (
                          <button
                            key={id}
                            onClick={() => onOpenReport(id)}
                            className="rounded-md bg-panel-3 px-2 py-0.5 text-[11px] font-medium text-fg-muted hover:bg-accent/15 hover:text-accent"
                          >
                            Report {(index.get(id) ?? 0) + 1}
                            {r ? ` · ${r.source_type === "voice" ? "voice" : "text"} · ${timeAgo(r.reported_at)}` : ""}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
            {example && <p className="mt-2.5 text-[11.5px] leading-relaxed text-fg-muted">{example.reason}</p>}
          </div>
        );
      })}
      <p className="text-[11px] text-fg-faint">
        Conflicts are prompts to verify. They do not mean any reporter is wrong — conditions change, and people see different parts of a scene.
      </p>
    </div>
  );
}
