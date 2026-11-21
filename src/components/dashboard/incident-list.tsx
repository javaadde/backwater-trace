"use client";

import { ArrowRight } from "lucide-react";
import type { IncidentSummary } from "@/types/domain";
import { CATEGORY_LABEL } from "@/lib/labels";
import { ConflictSwatch, SourceStops, StatusBadge, categoryColor } from "@/components/ui/badges";
import { buttonClass } from "@/components/ui/button";
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
        <p className=" text-sm font-medium text-fg">No incidents match these filters</p>
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
          <li key={i.id} data-entry={i.title}>
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
                "group relative grid cursor-pointer grid-cols-[20px_minmax(0,1fr)] gap-x-3 px-4 py-4 transition-[background-color,opacity] duration-200 focus-visible:-outline-offset-2",
                active ? "bg-panel-2 shadow-[inset_0_0_0_1px_var(--fg)]" : dim ? "opacity-70 hover:bg-panel-2 hover:opacity-100" : "hover:bg-panel-2",
              )}
            >
              <span
                className="mt-1 grid size-5 place-items-center text-white [&_svg]:size-3"
                style={{ background: categoryColor(i.category) }}
                title={CATEGORY_LABEL[i.category]}
              >
                <CategoryIcon category={i.category} />
              </span>
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="entry-head text-[19px] leading-tight text-fg">{i.title}</div>
                  <span className={cn("tabular shrink-0 text-[11px]", "text-fg-faint")}>
                    {timeAgo(i.last_reported_at)}
                  </span>
                </div>
                <div className="mt-1 text-[13px] text-fg-muted">
                  <span className="entry-head text-[15px] italic">{CATEGORY_LABEL[i.category].toLowerCase()}</span>
                  {i.location_text ? `, ${i.location_text}` : ""}
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <StatusBadge status={i.status} />
                  <SourceStops count={i.report_count} />
                  {conflicted && (
                    <span className={"inline-flex items-center gap-1.5 text-[12px] font-medium text-conflict"}>
                      <ConflictSwatch />
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
                    className={buttonClass("primary", "sm", "mt-3 w-full justify-between")}
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
