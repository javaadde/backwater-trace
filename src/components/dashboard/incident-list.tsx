"use client";

import { ArrowRight } from "lucide-react";
import type { IncidentSummary } from "@/types/domain";
import { CATEGORY_LABEL } from "@/lib/labels";
import { ConflictSwatch, SourceStops, StatusBadge, categoryColor } from "@/components/ui/badges";
import { CategoryIcon } from "@/components/ui/category-icon";
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
      <div className="px-5 py-12 text-center">
        <div className="hatch mx-auto h-10 w-16 border border-line-strong text-z7" aria-hidden />
        <p className="mt-3 text-sm font-medium text-fg">No incidents match these filters</p>
        <p className="mt-1 text-xs text-fg-muted">Clear the search or choose another status or category.</p>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-line">
      {incidents.map((i) => {
        const active = i.id === selectedId;
        const dim = (selectedId !== null && !active) || i.status === "resolved";
        const conflicted = i.contradiction_count > 0 && i.status !== "resolved";
        return (
          <li key={i.id}>
            <div
              role="button"
              tabIndex={0}
              aria-pressed={active}
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
                "group relative grid cursor-pointer grid-cols-[20px_minmax(0,1fr)] gap-x-3 px-4 py-3.5 transition-[background-color,opacity] duration-200 focus-visible:-outline-offset-2",
                active ? "bg-z0 text-z10" : dim ? "bg-panel-2 hover:bg-panel-3" : "hover:bg-panel-3",
              )}
            >
              <span
                className="mt-0.5 grid size-5 place-items-center rounded-sm text-white [&_svg]:size-3"
                style={{ background: categoryColor(i.category) }}
                title={CATEGORY_LABEL[i.category]}
              >
                <CategoryIcon category={i.category} />
              </span>
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <div className={cn("text-[14px] font-semibold leading-snug", active ? "text-z10" : dim ? "text-fg-muted" : "text-fg")}>{i.title}</div>
                  <span className={cn("tabular shrink-0 font-mono text-[11px]", active ? "text-z7" : "text-fg-faint")}>
                    {timeAgo(i.last_reported_at)}
                  </span>
                </div>
                <div className={cn("mt-0.5 text-xs", active ? "text-z7" : "text-fg-muted")}>
                  {CATEGORY_LABEL[i.category]}
                  {i.location_text ? ` · ${i.location_text}` : ""}
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <StatusBadge status={i.status} className={active ? "border-z5 bg-z1 text-z10" : undefined} />
                  <SourceStops count={i.report_count} inverted={active} />
                  {conflicted && (
                    <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium", active ? "text-[#ff8a7a]" : "text-conflict")}>
                      <ConflictSwatch className={active ? "border-[#ff8a7a] text-[#ff8a7a]" : undefined} />
                      {i.contradiction_count} possible conflict{i.contradiction_count > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                {active && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(i.id);
                    }}
                    className="mt-3 flex h-8 w-full items-center justify-between rounded-sm bg-accent px-3 text-[13px] font-semibold text-accent-ink hover:bg-[#45d3b8]"
                  >
                    Open sources and evidence <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
