"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import type { ActivityItem, IncidentSummary } from "@/types/domain";
import { ConflictSwatch } from "@/components/ui/badges";
import { cn, timeAgo } from "@/lib/utils";

export function VerificationPanel({
  incidents,
  activity,
  selectedId,
  onSelect,
}: {
  incidents: IncidentSummary[];
  activity: ActivityItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}) {
  const open = incidents.filter((i) => i.status !== "resolved");
  const needs = incidents.filter((i) => i.status === "needs_verification");
  const conflicts = open.filter((i) => i.contradiction_count > 0);
  const reports = incidents.reduce((s, i) => s + i.report_count, 0);

  const rows: { label: string; value: number; tone?: string; hatch?: boolean }[] = [
    { label: "Open incidents", value: open.length },
    { label: "Source reports", value: reports },
    { label: "Needs verification", value: needs.length, tone: "text-warn" },
    { label: "With possible conflicts", value: conflicts.length, tone: "text-conflict", hatch: true },
    { label: "Verified", value: incidents.filter((i) => i.status === "verified").length, tone: "text-ok" },
  ];

  return (
    <div className="flex h-full flex-col">
      <section className="border-b border-line px-4 pt-4 pb-3">
        <div className="flex items-baseline justify-between">
          <h2 className="legend text-fg">Record</h2>
          <span className="text-[11px] text-fg-muted">Synthetic demo data</span>
        </div>
        <dl className="mt-2 divide-y divide-line">
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between py-1.5">
              <dt className="flex items-center gap-2 text-[13px] text-fg-muted">
                {r.hatch && <ConflictSwatch className="size-3" />}
                {r.label}
              </dt>
              <dd className={cn("tabular text-[14px] font-semibold", r.tone ?? "text-fg")}>{String(r.value).padStart(2, "0")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-b border-line p-4">
        <div className="flex items-center justify-between">
          <h2 className="legend flex items-center gap-2 text-fg">
            <ConflictSwatch /> Possible conflicts
          </h2>
          <span className="tabular text-[11px] text-fg-faint">{conflicts.length}</span>
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-fg-muted">
          Sources that disagree on a detail. A prompt to check, not proof that anyone is wrong.
        </p>
        <ul className="mt-3 space-y-2">
          {conflicts.length === 0 && <li className="text-xs text-fg-muted">No open conflicts.</li>}
          {conflicts.map((i) => (
            <li key={i.id}>
              <button
                onClick={() => onSelect(i.id)}
                aria-pressed={selectedId === i.id}
                className={cn(
                  "grid w-full grid-cols-[14px_minmax(0,1fr)] gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors",
                  selectedId === i.id ? "border-line-strong bg-panel-3" : "border-line bg-panel hover:bg-panel-2",
                )}
              >
                <ConflictSwatch className="mt-0.5" />
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium leading-snug">{i.title}</span>
                  <span className={cn("mt-0.5 block text-[11px]", "text-fg-muted")}>
                    {i.contradiction_count} {i.contradiction_count > 1 ? "details differ" : "detail differs"}, {i.report_count} sources
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex min-h-0 flex-1 flex-col p-4">
        <h2 className="legend text-fg">Recent activity</h2>
        <ul className="scroll-thin mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {activity.map((a) => (
            <li key={a.id} className="grid grid-cols-[20px_minmax(0,1fr)] gap-2.5">
              {a.kind === "conflict" ? (
                <ConflictSwatch className="mt-0.5 size-4" />
              ) : (
                <span className="mt-0.5 grid size-4 place-items-center text-fg-faint [&_svg]:size-3.5">
                  <FileText />
                </span>
              )}
              <div className="min-w-0">
                <Link href={`/incidents/${a.incident_id}`} className="block truncate text-[13px] font-medium text-fg hover:underline">
                  {a.incident_title}
                </Link>
                <div className="text-[12px] text-fg-muted">
                  {a.text} <span className="tabular ml-1.5 text-fg-faint">{timeAgo(a.at)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
