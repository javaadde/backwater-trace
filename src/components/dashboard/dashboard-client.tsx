"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, RefreshCw, Search } from "lucide-react";
import type { ActivityItem, Category, IncidentStatus, IncidentSummary } from "@/types/domain";
import { CATEGORIES, INCIDENT_STATUSES } from "@/types/domain";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/lib/labels";
import { IncidentMap } from "@/components/map";
import { CategoryIcon } from "@/components/ui/category-icon";
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

  // Guide words: the first and last entry in view, recomputed as the list scrolls.
  const listRef = useRef<HTMLDivElement>(null);
  const [guide, setGuide] = useState<{ first: string; last: string }>({ first: "", last: "" });
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const seen = Array.from(el.querySelectorAll<HTMLElement>("[data-entry]")).filter((n) => {
        const r = n.getBoundingClientRect();
        return r.bottom > box.top + 8 && r.top < box.bottom - 8;
      });
      setGuide({ first: seen[0]?.dataset.entry ?? "", last: seen[seen.length - 1]?.dataset.entry ?? "" });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    el.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      el.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [filtered, data]);
  const counts = useMemo(() => {
    const all = data?.incidents ?? [];
    const c: Record<string, number> = { all: all.length, open: all.filter((i) => i.status !== "resolved").length };
    for (const s of INCIDENT_STATUSES) c[s] = all.filter((i) => i.status === s).length;
    return c;
  }, [data]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Command row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line bg-panel px-4 py-3">
        <h1 className="font-heading text-[32px] leading-none font-normal tracking-[-0.01em]">Incident board</h1>
        <div role="tablist" aria-label="Filter by review status" className="scroll-thin flex max-w-full items-stretch gap-1 overflow-x-auto max-sm:pr-6 max-sm:[mask-image:linear-gradient(to_right,var(--fg)_82%,transparent)]">
          {(["open", "all", ...INCIDENT_STATUSES] as const).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={status === s}
              onClick={() => setStatus(s)}
              className={cn(
                "flex h-9 shrink-0 items-center gap-1.5 border-b-2 px-2 text-[13px] font-medium whitespace-nowrap transition-colors",
                status === s ? "border-fg text-fg" : "border-transparent text-fg-muted hover:border-line-strong hover:text-fg active:bg-panel-2",
              )}
            >
              {s === "open" ? "Open" : s === "all" ? "All" : STATUS_LABEL[s]}
              <span className={cn("tabular text-[11px]", "text-fg-faint")}>{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "all")}
          className="select h-9 text-[13px]"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
        <label className="relative max-sm:order-last max-sm:basis-full sm:ml-auto">
          <span className="sr-only">Search incidents</span>
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-fg-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search incidents, places…"
            className="h-9 w-full border border-field sm:w-64 bg-panel pr-2 pl-8 text-[13px] text-fg placeholder:text-fg-faint hover:border-z3"
          />
        </label>
        <button
          onClick={load}
          className="flex h-9 items-center gap-2 px-2 text-[13px] font-medium text-accent-text hover:bg-panel-2 active:bg-panel-3"
          title="Refreshes every 15 seconds. Click to refresh now."
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          Live
          <RefreshCw className={cn("size-3 text-fg-faint", loading && "animate-spin")} />
        </button>
      </div>

      {error && <div className="border-b border-danger bg-danger-tint px-4 py-1.5 text-xs text-danger">{error}</div>}

      {/* Body */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)_320px]">
        <aside className="order-2 flex min-h-0 flex-col border-r border-line bg-panel lg:order-1">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-baseline gap-3 border-b-[3px] border-double border-fg px-4 pt-3 pb-2.5">
            <h2 className="sr-only">Incidents</h2>
            <p className="entry-head truncate text-[18px] leading-tight" aria-live="polite">
              <span className="sr-only">First entry in view: </span>
              {guide.first || "\u00a0"}
            </p>
            <span className="tabular text-[12px] text-fg-muted">
              {filtered.length} shown<span className="xl:hidden">, synthetic</span>
            </span>
            <p className="entry-head truncate text-right text-[18px] leading-tight">
              <span className="sr-only">Last entry in view: </span>
              {guide.last || "\u00a0"}
            </p>
          </div>
          <div ref={listRef} className="scroll-thin min-h-0 flex-1 overflow-y-auto">
            {!data ? (
              <div className="divide-y divide-line" aria-busy>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="px-4 py-4">
                    <div className="h-3.5 w-3/4 animate-pulse bg-panel-3" />
                    <div className="mt-2 h-3 w-1/2 animate-pulse bg-panel-3" />
                    <div className="mt-3 h-4 w-2/3 animate-pulse bg-panel-3" />
                  </div>
                ))}
              </div>
            ) : (
              <IncidentList incidents={filtered} selectedId={selectedId} onSelect={setSelectedId} onOpen={open} />
            )}
          </div>
        </aside>

        <section className="relative order-1 flex h-[55svh] min-h-[360px] flex-col bg-panel-2 p-3 lg:order-2 lg:h-auto" aria-label="Incident map">
          <p className="entry-head mb-2 flex items-baseline justify-between gap-3 text-[16px] leading-none">
            <span>Plate I. Alappuzha district</span>
            <span className="font-sans text-[12px] text-fg-faint">Pins sized by sources</span>
          </p>
          <div className="plate relative min-h-0 flex-1">
            <IncidentMap incidents={filtered} selectedId={selectedId} onSelect={setSelectedId} onOpen={open} />
            <Legend />
          </div>
        </section>

        <aside className="order-3 hidden min-h-0 border-l border-line bg-panel xl:block">
          {data && <VerificationPanel incidents={data.incidents} activity={data.activity} selectedId={selectedId} onSelect={setSelectedId} />}
        </aside>
      </div>
    </div>
  );
}

function Legend() {
  // Drop-up: the panel opens above its handle. Open on wide screens, closed on phones.
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => {
      if (window.matchMedia("(max-width: 639px)").matches) setOpen(false);
    }, 0);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="absolute bottom-6 left-3 z-[500] overflow-hidden border border-fg bg-panel text-[12px]">
      {open && (
        <div id="map-key" className="grid grid-cols-2 gap-x-3 gap-y-1 border-b border-line px-2.5 py-2">
          {CATEGORIES.filter((c) => c !== "other").map((c) => (
            <span key={c} className="flex items-center gap-1.5 text-fg">
              <span className="grid size-4 shrink-0 place-items-center text-white [&_svg]:size-2.5" style={{ background: `var(--cat-${c})` }}>
                <CategoryIcon category={c} strokeWidth={2.5} />
              </span>
              {CATEGORY_LABEL[c]}
            </span>
          ))}
          <span className="flex items-center gap-1.5 font-medium text-conflict">
            <span className="hatch-cross size-4 shrink-0 rounded-full border border-conflict text-conflict" /> Possible conflict
          </span>
          <span className="col-span-2 flex items-center gap-2 border-t border-line pt-1 text-fg-muted">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-z5" />
              <span className="size-3 rounded-full bg-z5" />
              <span className="size-4 rounded-full bg-z5" />
            </span>
            Pin size = sources
            <svg width="16" height="4" aria-hidden className="ml-auto">
              <line x1="0" y1="2" x2="16" y2="2" stroke="var(--z3)" strokeWidth="1.5" strokeDasharray="4 3" />
            </svg>
            District border
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="map-key"
        className="flex w-full items-center justify-between gap-6 px-2.5 py-1.5 text-[12px] font-medium text-fg-muted hover:bg-panel-2 hover:text-fg"
      >
        Key
        <ChevronUp aria-hidden className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>
    </div>
  );
}
