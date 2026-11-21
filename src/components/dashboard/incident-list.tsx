"use client";

import { ChevronRight } from "lucide-react";
import type { IncidentSummary } from "@/types/domain";
import { CategoryChip, ConflictBadge, StatusBadge } from "@/components/ui/badges";
import { cn, timeAgo } from "@/lib/utils";

export function IncidentList({
  incidents,
  selectedId,
  onSelect,
  onOpen,
}: {
  incidents: IncidentSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  if (incidents.length === 0) {
    return (
      <div className="px-4 py-10 text-center text-sm text-fg-muted">
        No incidents match these filters.
      </div>
    );
  }
  return (
    <ul className="space-y-2 p-3">
      {incidents.map((i) => {
        const active = i.id === selectedId;
        return (
          <li key={i.id}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelect(i.id)}
              onDoubleClick={() => onOpen(i.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onOpen(i.id);
                if (e.key === " ") {
                  e.preventDefault();
                  onSelect(i.id);
                }
              }}
              className={cn(
                "group relative cursor-pointer rounded-xl border p-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                active ? "border-accent/50 bg-panel-3" : "border-line bg-panel-2 hover:border-line-strong hover:bg-panel-3/70",
                i.status === "resolved" && !active && "opacity-60",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <CategoryChip category={i.category} />
                <span className="tabular shrink-0 text-[11px] text-fg-faint">{timeAgo(i.last_reported_at)}</span>
              </div>
              <div className="mt-1.5 text-[14px] font-semibold leading-snug text-fg">{i.title}</div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <StatusBadge status={i.status} />
                <ConflictBadge count={i.contradiction_count} />
                <span className="ml-auto text-[11px] text-fg-muted">
                  {i.report_count} source{i.report_count > 1 ? "s" : ""}
                </span>
              </div>
              {active && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(i.id);
                  }}
                  className="mt-2.5 flex w-full items-center justify-between rounded-lg border border-line-strong bg-panel px-2.5 py-1.5 text-xs font-medium text-fg hover:border-accent/50"
                >
                  Open incident & sources <ChevronRight className="size-3.5" />
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
