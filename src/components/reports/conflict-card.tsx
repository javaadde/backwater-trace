"use client";

import type { ReactNode } from "react";
import type { Contradiction, ContradictionField, ReportView } from "@/types/domain";
import { FIELD_LABEL, fieldValueLabel } from "@/lib/labels";
import { ConflictSwatch } from "@/components/ui/badges";
import { cn, timeAgo } from "@/lib/utils";

/** Each value gets its own hatch angle; where two meet they cross at 90°. */
const ANGLE = ["45deg", "-45deg", "0deg", "90deg"];

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
      <div className="flex items-center gap-3 border border-line-strong bg-panel px-4 py-3 text-sm text-fg-muted">
        <span className="hatch size-4 shrink-0 border border-line-strong text-z7" aria-hidden />
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
          <div key={field} className="border border-conflict bg-panel">
            <div className="flex items-center gap-2 border-b border-conflict px-4 py-2.5">
              <ConflictSwatch />
              <span className="legend text-conflict">Possible conflict</span>
              <span className="text-[13px] font-semibold text-fg">· {FIELD_LABEL[field]}</span>
            </div>
            <div className={cn("grid", entries.length === 2 ? "sm:grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)]" : "sm:grid-cols-2")}>
              {entries.map(([value, ids], vi) => (
                <ValueSheet
                  key={value}
                  angle={ANGLE[vi % ANGLE.length]}
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
  return <div aria-hidden className="hatch-cross hidden border-x border-line text-conflict/70 sm:block" />;
}

function ValueSheet({
  angle,
  value,
  sources,
  reports,
  index,
  onOpenReport,
  after,
}: {
  angle: string;
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
        <div
          aria-hidden
          className="h-2 border border-z3 text-z3"
          style={{ backgroundImage: `repeating-linear-gradient(${angle}, currentColor 0 1px, transparent 1px 5px)` }}
        />
        <div className="mt-3 font-display text-[26px] font-semibold uppercase leading-none tracking-[0.02em] text-fg">{value}</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {sources.map((id) => {
            const r = reports.find((x) => x.id === id);
            return (
              <button
                key={id}
                onClick={() => onOpenReport(id)}
                className="rounded-sm border border-z0 bg-panel px-2 py-1 text-[12px] font-medium text-fg hover:bg-z0 hover:text-z10"
              >
                Source {(index.get(id) ?? 0) + 1}
                {r ? <span className="font-mono text-[11px] opacity-70"> · {r.source_type === "voice" ? "voice" : "text"} · {timeAgo(r.reported_at)}</span> : null}
              </button>
            );
          })}
        </div>
      </div>
      {after}
    </>
  );
}
