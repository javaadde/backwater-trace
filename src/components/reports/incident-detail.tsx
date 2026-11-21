"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, LoaderCircle, MapPin, Network, Plus } from "lucide-react";
import type { IncidentDetail, IncidentStatus } from "@/types/domain";
import { INCIDENT_STATUSES } from "@/types/domain";
import { STATUS_LABEL } from "@/lib/labels";
import { IncidentMap } from "@/components/map";
import { CategoryChip, ConflictBadge, StatusBadge } from "@/components/ui/badges";
import { buttonClass } from "@/components/ui/button";
import { EvidenceGraphView } from "@/components/graph/evidence-graph";
import { formatTime, timeAgo } from "@/lib/utils";
import { ReportCard } from "./report-card";
import { ConflictCards } from "./conflict-card";

export function IncidentDetailView({ id }: { id: string }) {
  const [data, setData] = useState<IncidentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const refs = useRef(new Map<string, HTMLDivElement>());

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/incidents/${id}`, { cache: "no-store" });
      if (res.status === 404) return setError("This incident does not exist or was removed.");
      if (!res.ok) throw new Error();
      setData((await res.json()) as IncidentDetail);
      setError(null);
    } catch {
      setError("Could not load this incident.");
    }
  }, [id]);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const t = setInterval(load, 20_000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [load]);

  const conflictFieldsByReport = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const c of data?.contradictions ?? []) {
      for (const rid of [c.report_a_id, c.report_b_id]) m.set(rid, (m.get(rid) ?? new Set()).add(c.field));
    }
    return m;
  }, [data]);

  const openReport = (rid: string) => {
    setHighlight(rid);
    refs.current.get(rid)?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlight((h) => (h === rid ? null : h)), 2400);
  };

  async function changeStatus(status: IncidentStatus) {
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) await load();
    } finally {
      setSavingStatus(false);
    }
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-fg-muted">{error}</p>
        <Link href="/dashboard" className={buttonClass("secondary", "md", "mt-4")}>
          Back to incident board
        </Link>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="grid flex-1 place-items-center py-24 text-sm text-fg-muted">
        <LoaderCircle className="size-5 animate-spin" />
      </div>
    );
  }

  const { incident, reports, contradictions, graph } = data;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-fg">
        <ArrowLeft className="size-3.5" /> Incident board
      </Link>

      {/* Header */}
      <div className="mt-3 flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <CategoryChip category={incident.category} />
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-balance">{incident.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-fg-muted">
            <StatusBadge status={incident.status} />
            <ConflictBadge count={incident.contradiction_count} />
            <span>
              {incident.report_count} source report{incident.report_count > 1 ? "s" : ""}
            </span>
            <span>·</span>
            <span className="tabular">First reported {formatTime(incident.created_at)}</span>
            <span>·</span>
            <span className="tabular">Updated {timeAgo(incident.last_reported_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-fg-muted">
            Review status
            <select
              value={incident.status}
              disabled={savingStatus}
              onChange={(e) => changeStatus(e.target.value as IncidentStatus)}
              className="h-9 rounded-lg border border-line-strong bg-panel-2 px-2 text-[13px] text-fg outline-none focus:border-accent/60"
            >
              {INCIDENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <Link href="/report" className={buttonClass("primary", "md")}>
            <Plus /> Add report
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Left: summary, conflicts, sources */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-panel p-4">
            <h2 className="text-[13px] font-semibold tracking-tight">Summary</h2>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-fg">{incident.summary}</p>
            <p className="mt-2 text-[11px] text-fg-faint">
              Generated from the source reports below. Treat as a starting point, not a verified account.
            </p>
            <div className="mt-4 h-48 overflow-hidden rounded-xl border border-line">
              <IncidentMap
                incidents={[incident]}
                selectedId={incident.id}
                center={{ latitude: incident.latitude, longitude: incident.longitude }}
                zoom={16}
                showPopups={false}
                interactive={false}
              />
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-fg-faint">
              <MapPin className="size-3" /> {incident.location_text ?? "Pinned area"} ·{" "}
              <span className="tabular font-mono">
                {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
              </span>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[13px] font-semibold tracking-tight">Possible conflicts</h2>
            <ConflictCards contradictions={contradictions} reports={reports} onOpenReport={openReport} />
          </section>

          <section>
            <h2 className="mb-3 text-[13px] font-semibold tracking-tight">Original source reports</h2>
            <div className="space-y-3">
              {reports.map((r, i) => (
                <ReportCard
                  key={r.id}
                  ref={(el) => {
                    if (el) refs.current.set(r.id, el);
                    else refs.current.delete(r.id);
                  }}
                  report={r}
                  index={i}
                  highlighted={highlight === r.id}
                  conflictFields={conflictFieldsByReport.get(r.id)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Right: evidence graph */}
        <section className="lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-line bg-panel">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 className="flex items-center gap-1.5 text-[13px] font-semibold tracking-tight">
                <Network className="size-4 text-accent" /> Evidence graph
              </h2>
              <span className="text-[11px] text-fg-faint">Click a report or source to jump to it</span>
            </div>
            <div className="h-[560px] lg:h-[calc(100dvh-11rem)]">
              <EvidenceGraphView graph={graph} onSelectReport={openReport} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
