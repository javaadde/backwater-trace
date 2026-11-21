"use client";

import { forwardRef } from "react";
import { Camera, FileText, MapPin, Mic } from "lucide-react";
import type { ReportView } from "@/types/domain";
import { ROAD_LABEL, SEVERITY_LABEL, SITUATION_LABEL, WATER_LABEL } from "@/lib/labels";
import { cn, formatTime, timeAgo } from "@/lib/utils";

const LANG: Record<string, string> = { ml: "Malayalam", en: "English", mixed: "Mixed" };

export const ReportCard = forwardRef<
  HTMLDivElement,
  { report: ReportView; index: number; highlighted?: boolean; conflictFields?: Set<string> }
>(function ReportCard({ report: r, index, highlighted, conflictFields }, ref) {
  const facts: { key: string; label: string; value: string }[] = [];
  if (r.water_level) facts.push({ key: "waterLevel", label: "Water", value: WATER_LABEL[r.water_level] });
  if (r.road_status) facts.push({ key: "roadStatus", label: "Road", value: ROAD_LABEL[r.road_status] });
  if (r.severity) facts.push({ key: "severity", label: "Severity", value: SEVERITY_LABEL[r.severity] });
  if (r.situation_status) facts.push({ key: "incidentStatus", label: "Situation", value: SITUATION_LABEL[r.situation_status] });

  return (
    <article
      ref={ref}
      id={`report-${r.id}`}
      className={cn(
        "scroll-mt-24 border bg-panel transition-[border-color,box-shadow] duration-300",
        highlighted ? "border-z0 shadow-[0_0_0_3px_var(--accent)]" : "border-line-strong",
      )}
    >
      <header className="flex flex-wrap items-center gap-2.5 border-b border-line px-4 py-2.5">
        <span className="grid size-7 place-items-center border border-z0 text-fg [&_svg]:size-3.5">
          {r.source_type === "voice" ? <Mic /> : <FileText />}
        </span>
        <div>
          <div className="text-[13px] font-semibold">
            Source {index + 1} · {r.source_type === "voice" ? "Voice note" : "Written"} · {LANG[r.original_language]}
          </div>
          <div className="tabular font-mono text-[11px] text-fg-muted">
            {formatTime(r.reported_at)} · {timeAgo(r.reported_at)}
            {r.reporter_name ? ` · ${r.reporter_name}` : " · Anonymous"}
          </div>
        </div>
        <span className="legend ml-auto border border-line-strong px-1.5 py-0.5 !text-[10.5px] text-fg-muted">Unverified source</span>
      </header>

      <blockquote className={cn("px-4 pt-3.5 text-[15px] leading-relaxed text-fg", r.original_language !== "en" && "font-ml text-[16px]")}>
        {r.description}
      </blockquote>
      {r.transcript && r.source_type === "voice" && (
        <div className="mt-1.5 px-4 text-[12px] text-fg-muted">Original audio transcribed by Sarvam AI; reviewed by reporter before submission.</div>
      )}

      {facts.length > 0 && (
        <dl className="mt-3 flex flex-wrap gap-1.5 px-4">
          {facts.map((f) => (
            <div
              key={f.key}
              className={cn(
                "flex items-center gap-1.5 border px-2 py-1 text-[12px]",
                conflictFields?.has(f.key) ? "border-conflict text-conflict" : "border-line text-fg-muted",
              )}
            >
              {conflictFields?.has(f.key) && <span aria-hidden className="hatch-cross size-3 border border-conflict" />}
              <dt className="inline">{f.label}: </dt>
              <dd className="inline font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {(r.audio_signed_url || r.photo_signed_url) && (
        <div className="mt-3 space-y-2 px-4">
          {r.audio_signed_url && <audio controls src={r.audio_signed_url} className="h-9 w-full" />}
          {r.photo_signed_url && (
            <a href={r.photo_signed_url} target="_blank" rel="noreferrer" className="block overflow-hidden border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.photo_signed_url} alt={`Photo attached to report ${index + 1}`} className="max-h-60 w-full object-cover" />
            </a>
          )}
        </div>
      )}

      <footer className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1 border-t border-line px-4 py-2 text-[11.5px] text-fg-muted">
        <span className="flex items-center gap-1">
          <MapPin className="size-3" /> {r.location_text ?? "Pinned location"} ·{" "}
          <span className="tabular font-mono">
            {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
          </span>
        </span>
        {r.photo_url && !r.photo_signed_url && (
          <span className="flex items-center gap-1">
            <Camera className="size-3" /> Photo stored privately
          </span>
        )}
        {r.source_type === "voice" && !r.audio_url && <span>Audio not retained (demo seed)</span>}
      </footer>
    </article>
  );
});
