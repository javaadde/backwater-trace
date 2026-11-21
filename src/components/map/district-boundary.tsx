"use client";

import { Polygon, Polyline } from "react-leaflet";
import { ALAPPUZHA_BOUNDARY } from "@/lib/geo/alappuzha-boundary";

/** A frame far larger than the viewable area; the district is cut out of it as a hole. */
const OUTER: [number, number][] = [
  [0, 60],
  [0, 100],
  [25, 100],
  [25, 60],
];
const RING: [number, number][] = [...ALAPPUZHA_BOUNDARY, ALAPPUZHA_BOUNDARY[0]];

/**
 * Marks Alappuzha district: everything outside the official boundary is
 * shaded and the border is a dashed ink rule. Purely visual —
 * non-interactive so map clicks (e.g. the location picker) pass through.
 */
export function DistrictBoundary() {
  return (
    <>
      <Polygon
        positions={[OUTER, ALAPPUZHA_BOUNDARY]}
        interactive={false}
        pathOptions={{ stroke: false, fillColor: "#0c1110", fillOpacity: 0.22 }}
      />
      <Polyline
        positions={RING}
        interactive={false}
        pathOptions={{ color: "#0c1110", weight: 1.6, opacity: 0.9, lineJoin: "round", dashArray: "6 5" }}
      />
    </>
  );
}
