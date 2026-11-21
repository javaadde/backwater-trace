"use client";

import type { ReactNode } from "react";
import type { Contradiction, ContradictionField, ReportView } from "@/types/domain";
import { FIELD_LABEL, fieldValueLabel } from "@/lib/labels";
import { ConflictSwatch } from "@/components/ui/badges";
import { cn, timeAgo } from "@/lib/utils";

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
      <div className="rounded-lg border border-line bg-panel px-4 py-3 text-sm text-fg-muted">
        No conflicting details between sources so far.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...byField.entries()].map(([field, values]) => {
        const example = contradictions.find((c) => c.field === field);
        const entries = [...values.entries()];
        return (
          <div key={field} className="overflow-hidden rounded-lg border border-conflict/40 bg-panel">
            <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
              <ConflictSwatch />
              <span className="legend text-conflict">Possible conflict</span>
              <span className="text-[13px] text-fg-muted">on {FIELD_LABEL[field].toLowerCase()}</span>
            </div>
            <div className={cn("grid", entries.length === 2 ? "sm:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]" : "sm:grid-cols-2")}>
              {entries.map(([value, ids], vi) => (
                <ValueSheet
                  key={value}
                  value={fieldValueLabel(field, value)}
                  sources={[...ids].sort((a, b) => (index.get(a) ?? 0) - (index.get(b) ?? 0))}
                  reports={reports}
                  index={index}
                  onOpenReport={onOpenReport}
                  // the crossing strip sits between the two sheets
                  after={entries.length === 2 && vi === 0 ? <Crossing /> : null}
                />
              ))}
            </div>
            {example && <p className="border-t border-line px-4 py-2.5 text-[12.5px] leading-relaxed text-fg-muted">{example.reason}</p>}
          </div>
        );
      })}
      <p className="text-[12px] leading-relaxed text-fg-muted">
        Conflicts are prompts to verify. They do not mean any reporter is wrong: conditions change, and people see different parts of a scene.
      </p>
    </div>
  );
}

function Crossing() {
  return <div aria-hidden className="hidden bg-line sm:block" />;
}

function ValueSheet({
  value,
  sources,
  reports,
  index,
  onOpenReport,
  after,
}: {
  value: string;
  sources: string[];
  reports: ReportView[];
  index: Map<string, number>;
  onOpenReport: (id: string) => void;
  after: ReactNode;
}) {
  return (
    <>
      <div className="p-4">
        <div className="text-[20px] font-semibold leading-tight text-fg">{value}</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {sources.map((id) => {
            const r = reports.find((x) => x.id === id);
            return (
              <button
                key={id}
                onClick={() => onOpenReport(id)}
                className="rounded-md border border-line bg-panel px-2 py-1 text-[12px] font-medium text-fg hover:border-z7 hover:bg-panel-2 active:bg-panel-3"
              >
                Source {(index.get(id) ?? 0) + 1}
                {r ? <span className="ml-1 text-[11px] font-normal text-fg-muted">{r.source_type === "voice" ? "voice" : "text"}, {timeAgo(r.reported_at)}</span> : null}
              </button>
            );
          })}
        </div>
      </div>
      {after}
    </>
  );
}
