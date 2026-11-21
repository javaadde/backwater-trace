"use client";

import Link from "next/link";
import { FileText, TriangleExclamationPoint } from "lucide-react";
import type { ActivityItem, IncidentSummary } from "@/types/domain";
import { cn, timeAgo } from "@/lib/utils";

function Stat({ label, value, tone }: { label: string; value: number; tone?: "warn" | "info" | "ok" }) {
  return (
    <div className="rounded-xl border border-line bg-panel-2 px-3 py-2.5">
      <div className="text-[11px] font-medium text-fg-muted">{label}</div>
      <div
        className={cn(
          "tabular mt-0.5 text-2xl font-semibold tracking-tight",
          tone === "warn" && "text-warn",
          tone === "info" && "text-info",
          tone === "ok" && "text-ok",
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function VerificationPanel({
  incidents,
  activity,
  onSelect,
}: {
  incidents: IncidentSummary[];
  activity: ActivityItem[];
  onSelect: (id: string) => void;
}) {
  const open = incidents.filter((i) => i.status !== "resolved");
  const needs = incidents.filter((i) => i.status === "needs_verification");
  const conflicts = open.filter((i) => i.contradiction_count > 0);
  const reports = incidents.reduce((s, i) => s + i.report_count, 0);

  return (
    <div className="flex h-full flex-col">
      <section className="border-b border-line p-4">
        <h2 className="text-[13px] font-semibold tracking-tight">Overview</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Stat label="Open incidents" value={open.length} />
          <Stat label="Source reports" value={reports} tone="info" />
          <Stat label="Needs verification" value={needs.length} tone="warn" />
          <Stat label="Verified" value={incidents.filter((i) => i.status === "verified").length} tone="ok" />
        </div>
      </section>

      <section className="border-b border-line p-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-[13px] font-semibold tracking-tight">
            <TriangleExclamationPoint className="size-4 text-warn" /> Possible conflicts
          </h2>
          <span className="text-[11px] text-fg-faint">{conflicts.length} incidents</span>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-fg-faint">
          Reports that disagree on a detail. A conflict is a prompt to check, not proof that a source is wrong.
        </p>
        <ul className="mt-3 space-y-1.5">
          {conflicts.length === 0 && <li className="text-xs text-fg-muted">No open conflicts.</li>}
          {conflicts.map((i) => (
            <li key={i.id}>
              <button
                onClick={() => onSelect(i.id)}
                className="w-full rounded-lg border border-warn/25 bg-warn/5 px-3 py-2 text-left hover:border-warn/50"
              >
                <div className="text-[13px] font-medium text-fg">{i.title}</div>
                <div className="mt-0.5 text-[11px] text-warn">
                  Sources disagree on {i.contradiction_count} detail{i.contradiction_count > 1 ? "s" : ""} · {i.report_count} reports
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex min-h-0 flex-1 flex-col p-4">
        <h2 className="text-[13px] font-semibold tracking-tight">Recent activity</h2>
        <ul className="scroll-thin mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {activity.map((a) => (
            <li key={a.id} className="flex gap-2.5">
              <span
                className={cn(
                  "mt-0.5 grid size-6 shrink-0 place-items-center rounded-md [&_svg]:size-3.5",
                  a.kind === "conflict" ? "bg-warn/15 text-warn" : "bg-panel-3 text-fg-muted",
                )}
              >
                {a.kind === "conflict" ? <TriangleExclamationPoint /> : <FileText />}
              </span>
              <div className="min-w-0">
                <Link href={`/incidents/${a.incident_id}`} className="block truncate text-[12.5px] font-medium text-fg hover:text-accent">
                  {a.incident_title}
                </Link>
                <div className="text-[11px] text-fg-muted">
                  {a.text} · <span className="tabular">{timeAgo(a.at)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
