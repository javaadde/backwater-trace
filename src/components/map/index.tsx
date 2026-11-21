"use client";

import dynamic from "next/dynamic";

function MapSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center bg-[#0d131a] text-xs text-fg-faint">
      <span className="animate-pulse">Loading Alappuzha map…</span>
    </div>
  );
}

/** Leaflet touches `window`, so maps are client-only. */
export const IncidentMap = dynamic(() => import("./incident-map"), { ssr: false, loading: MapSkeleton });
export const LocationPicker = dynamic(() => import("./location-picker"), { ssr: false, loading: MapSkeleton });
