"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import type { IncidentSummary } from "@/types/domain";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/lib/labels";
import { CategoryIcon } from "@/components/ui/category-icon";
import { ALAPPUZHA_CENTER } from "@/lib/engine/geo";
import { timeAgo } from "@/lib/utils";
import { ALAPPUZHA_LATLNG_BOUNDS, ALAPPUZHA_MIN_ZOOM, BaseLayers } from "./tiles";

/** Pin diameter on a fixed ramp by number of independent sources. */
const SIZE_RAMP = [22, 22, 28, 34, 40];

function markerIcon(i: IncidentSummary, selected: boolean, dim: boolean) {
  const size = SIZE_RAMP[Math.min(i.report_count, SIZE_RAMP.length - 1)];
  const label = `${CATEGORY_LABEL[i.category]}: ${i.title}, ${i.report_count} source${i.report_count > 1 ? "s" : ""}${i.contradiction_count > 0 ? ", possible conflict" : ""}`;
  const html = `<div class="bt-pin" role="img" aria-label="${label.replace(/"/g, "&quot;")}" style="--pin: var(--cat-${i.category}); --s: ${size}px" data-selected="${selected}" data-dim="${dim}" data-resolved="${i.status === "resolved"}" data-conflict="${i.contradiction_count > 0 && i.status !== "resolved"}">${renderToStaticMarkup(<CategoryIcon category={i.category} size={Math.round(size * 0.52)} strokeWidth={2.25} aria-hidden />)}${i.report_count > 1 ? `<span class="bt-count">${i.report_count}</span>` : ""}</div>`;
  return L.divIcon({ html, className: "bt-marker", iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2 - 2] });
}

function FlyTo({ target }: { target: { latitude: number; longitude: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.latitude, target.longitude], Math.max(map.getZoom(), 15), { duration: 0.8 });
  }, [map, target]);
  return null;
}

export interface IncidentMapProps {
  incidents: IncidentSummary[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onOpen?: (id: string) => void;
  zoom?: number;
  center?: { latitude: number; longitude: number };
  interactive?: boolean;
  showPopups?: boolean;
  defaultLayer?: "zone" | "streets" | "satellite";
}

export default function IncidentMap({
  incidents,
  selectedId,
  onSelect,
  onOpen,
  zoom = 13,
  center = ALAPPUZHA_CENTER,
  interactive = true,
  showPopups = true,
  defaultLayer = "zone",
}: IncidentMapProps) {
  const selected = useMemo(() => incidents.find((i) => i.id === selectedId) ?? null, [incidents, selectedId]);
  const flyTarget = useMemo(
    () => (selected ? { latitude: selected.latitude, longitude: selected.longitude } : null),
    // fly only when the selection changes, not when data refreshes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected?.id],
  );

  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={zoom}
      className="h-full w-full"
      zoomControl={interactive}
      scrollWheelZoom={interactive}
      dragging={interactive}
      attributionControl
      maxBounds={ALAPPUZHA_LATLNG_BOUNDS}
      maxBoundsViscosity={1}
      minZoom={ALAPPUZHA_MIN_ZOOM}
    >
      <BaseLayers defaultLayer={defaultLayer} />
      {interactive && <FlyTo target={flyTarget} />}
      {incidents.map((i) => (
        <Marker
          key={i.id}
          position={[i.latitude, i.longitude]}
          icon={markerIcon(i, i.id === selectedId, !!selectedId && i.id !== selectedId)}
          zIndexOffset={i.id === selectedId ? 1000 : i.status === "resolved" ? -100 : 0}
          eventHandlers={{ click: () => onSelect?.(i.id) }}
        >
          {showPopups && (
            <Popup>
              <div className="min-w-52">
                <div className="text-[12px] text-fg-muted">
                  {CATEGORY_LABEL[i.category]}, {STATUS_LABEL[i.status].toLowerCase()}
                </div>
                <div className="mt-0.5 text-sm font-semibold text-fg">{i.title}</div>
                <div className="mt-1 text-xs text-fg-muted">
                  {i.report_count} report{i.report_count > 1 ? "s" : ""}, last {timeAgo(i.last_reported_at)}
                </div>
                {i.contradiction_count > 0 && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-conflict">
                    <span className="hatch-cross inline-block size-3 rounded-[3px] border border-conflict" />
                    {i.contradiction_count} possible conflict{i.contradiction_count > 1 ? "s" : ""}
                  </div>
                )}
                {onOpen && (
                  <button
                    onClick={() => onOpen(i.id)}
                    className="mt-2.5 w-full rounded-md bg-accent px-2 py-1.5 text-xs font-semibold text-accent-ink hover:bg-accent-hover active:bg-accent-press"
                  >
                    Open incident
                  </button>
                )}
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
}
