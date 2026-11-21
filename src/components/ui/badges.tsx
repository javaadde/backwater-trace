import { cn } from "@/lib/utils";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/lib/labels";
import type { Category, IncidentStatus } from "@/types/domain";
import { CategoryIcon } from "./category-icon";

/** Status reads by its tag shape and text, never by colour alone. */
const STATUS_STYLE: Record<IncidentStatus, string> = {
  new: "border-fg bg-panel text-fg",
  needs_verification: "border-warn bg-warn-tint text-warn",
  verified: "border-ok bg-ok-tint text-ok",
  resolved: "border-line-strong bg-panel-2 text-fg-faint",
};

export function StatusBadge({ status, className }: { status: IncidentStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center border px-1.5 text-[12px] font-medium",
        STATUS_STYLE[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function categoryColor(c: Category): string {
  return `var(--cat-${c})`;
}

export function CategoryChip({ category, className }: { category: Category; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-fg-muted", className)}>
      <span
        className="grid size-5 place-items-center text-white [&_svg]:size-3"
        style={{ background: categoryColor(category) }}
      >
        <CategoryIcon category={category} />
      </span>
      <span className="entry-head text-[14px] italic">{CATEGORY_LABEL[category].toLowerCase()}</span>
    </span>
  );
}

/** A small swatch of the 90° cross-hatch: the mark of a possible conflict. */
export function ConflictSwatch({ className }: { className?: string }) {
  return <span aria-hidden className={cn("hatch-cross inline-block size-3 shrink-0 border border-conflict text-conflict", className)} />;
}

export function ConflictBadge({ count, className }: { count: number; className?: string }) {
  if (count === 0) return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium text-conflict", className)}>
      <ConflictSwatch />
      {count} possible conflict{count > 1 ? "s" : ""}
    </span>
  );
}

/** Independent-source count as a row of stop cells (max five drawn). */
export function SourceStops({ count, className, inverted }: { count: number; className?: string; inverted?: boolean }) {
  const cells = 5;
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} title={`${count} independent source report${count === 1 ? "" : "s"}`}>
      <span className="stops" data-inverted={inverted} aria-hidden>
        {Array.from({ length: cells }).map((_, i) => (
          <i key={i} data-on={i < count} />
        ))}
      </span>
      <span className={cn("tabular text-[11px]", inverted ? "text-fg-muted" : "text-fg-muted")}>
        {count} source{count === 1 ? "" : "s"}
      </span>
    </span>
  );
}
