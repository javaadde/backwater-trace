import { cn } from "@/lib/utils";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/lib/labels";
import type { Category, IncidentStatus } from "@/types/domain";
import { CategoryIcon } from "./category-icon";

const STATUS_STYLE: Record<IncidentStatus, string> = {
  new: "bg-info/15 text-info ring-info/30",
  needs_verification: "bg-warn/15 text-warn ring-warn/30",
  verified: "bg-ok/15 text-ok ring-ok/30",
  resolved: "bg-fg-faint/20 text-fg-muted ring-fg-faint/30",
};

export function StatusBadge({ status, className }: { status: IncidentStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
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
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted", className)}>
      <span
        className="grid size-5 place-items-center rounded-md [&_svg]:size-3"
        style={{ background: `color-mix(in oklab, ${categoryColor(category)} 20%, transparent)`, color: categoryColor(category) }}
      >
        <CategoryIcon category={category} />
      </span>
      {CATEGORY_LABEL[category]}
    </span>
  );
}

export function ConflictBadge({ count, className }: { count: number; className?: string }) {
  if (count === 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-warn/10 px-1.5 py-0.5 text-[11px] font-medium text-warn",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-warn" />
      {count} possible conflict{count > 1 ? "s" : ""}
    </span>
  );
}
