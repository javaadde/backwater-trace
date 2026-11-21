"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Search } from "lucide-react";
import type { ActivityItem, Category, IncidentStatus, IncidentSummary } from "@/types/domain";
import { CATEGORIES, INCIDENT_STATUSES } from "@/types/domain";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/lib/labels";
import { IncidentMap } from "@/components/map";
import { IncidentList } from "./incident-list";
import { VerificationPanel } from "./verification-panel";
import { cn } from "@/lib/utils";

interface DashboardData {
  incidents: IncidentSummary[];
  activity: ActivityItem[];
}

const REFRESH_MS = 15_000;

export function DashboardClient() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<IncidentStatus | "all" | "open">("open");
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/incidents", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error);
      setData(json as DashboardData);
      setError(null);
    } catch (e) {
      setError((e as Error).message || "Could not load incidents. Retrying…");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const t = setInterval(load, REFRESH_MS);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data?.incidents ?? []).filter(
      (i) =>
        (status === "all" || (status === "open" ? i.status !== "resolved" : i.status === status)) &&
        (category === "all" || i.category === category) &&
        (!q || i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q) || (i.location_text ?? "").toLowerCase().includes(q)),
    );
  }, [data, status, category, query]);

  const open = (id: string) => router.push(`/incidents/${id}`);
  const counts = useMemo(() => {
    const all = data?.incidents ?? [];
    const c: Record<string, number> = { all: all.length, open: all.filter((i) => i.status !== "resolved").length };
    for (const s of INCIDENT_STATUSES) c[s] = all.filter((i) => i.status === s).length;
    return c;
  }, [data]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Command row */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-2.5">
        <h1 className="text-[17px] font-semibold tracking-tight">Incident board</h1>
        <div className="flex items-center gap-0.5 rounded-lg border border-line bg-panel p-0.5">
          {(["open", "all", ...INCIDENT_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
                status === s ? "bg-panel-3 text-fg shadow-sm" : "text-fg-muted hover:text-fg",
              )}
            >
              {s === "open" ? "Open" : s === "all" ? "All" : STATUS_LABEL[s]}
              <span className="tabular ml-1.5 text-fg-faint">{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "all")}
          className="h-8 rounded-lg border border-line bg-panel px-2 text-[12px] text-fg outline-none focus:border-accent/60"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
        <label className="relative ml-auto">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-fg-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search incidents, places…"
            className="h-8 w-56 rounded-lg border border-line bg-panel pr-2 pl-8 text-[12.5px] text-fg placeholder:text-fg-faint outline-none focus:border-accent/60"
          />
        </label>
        <button
          onClick={load}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium text-ok"
          title="Auto-refreshes every 15 seconds"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-ok" />
          </span>
          LIVE
          <RefreshCw className={cn("size-3 text-fg-faint", loading && "animate-spin")} />
        </button>
      </div>

      {error && <div className="border-b border-danger/30 bg-danger/10 px-4 py-1.5 text-xs text-danger">{error}</div>}

      {/* Body */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)_320px]">
        <aside className="order-2 flex min-h-0 flex-col border-r border-line bg-panel lg:order-1">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="text-[13px] font-semibold tracking-tight">Active incidents</h2>
            <span className="tabular rounded-md bg-panel-3 px-1.5 py-0.5 text-[11px] font-semibold text-fg-muted">
              {filtered.length}
            </span>
          </div>
          <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
            {!data ? (
              <div className="space-y-2 p-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-panel-2" />
                ))}
              </div>
            ) : (
              <IncidentList incidents={filtered} selectedId={selectedId} onSelect={setSelectedId} onOpen={open} />
            )}
          </div>
        </aside>

        <section className="relative order-1 h-[55vh] min-h-[360px] lg:order-2 lg:h-auto">
          <IncidentMap incidents={filtered} selectedId={selectedId} onSelect={setSelectedId} onOpen={open} />
          <Legend />
        </section>

        <aside className="order-3 hidden min-h-0 border-l border-line bg-panel xl:block">
          {data && <VerificationPanel incidents={data.incidents} activity={data.activity} onSelect={setSelectedId} />}
        </aside>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-3 z-[500] rounded-xl border border-line-strong bg-panel/90 px-3 py-2 text-[11px] backdrop-blur">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {CATEGORIES.filter((c) => c !== "other").map((c) => (
          <span key={c} className="flex items-center gap-1.5 text-fg-muted">
            <span className="size-2.5 rounded-full" style={{ background: `var(--cat-${c})` }} />
            {CATEGORY_LABEL[c]}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-warn">
          <span className="size-2.5 rounded-full border-2 border-warn" /> Possible conflict
        </span>
        <span className="col-span-2 mt-0.5 flex items-center gap-1.5 border-t border-line pt-1.5 text-accent">
          <svg width="18" height="4" aria-hidden>
            <line x1="0" y1="2" x2="18" y2="2" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" />
          </svg>
          Alappuzha district border
        </span>
      </div>
    </div>
  );
}
