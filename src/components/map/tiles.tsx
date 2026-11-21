"use client";

import { useEffect } from "react";
import L from "leaflet";
import { LayersControl, TileLayer, useMap } from "react-leaflet";
import { ALAPPUZHA_BOUNDS } from "@/lib/engine/geo";
import { DistrictBoundary } from "./district-boundary";

/** Alappuzha district box with a small margin so the edges don't feel cramped. */
const PAD = 0.03;
export const ALAPPUZHA_LATLNG_BOUNDS = L.latLngBounds(
  [ALAPPUZHA_BOUNDS.minLat - PAD, ALAPPUZHA_BOUNDS.minLng - PAD],
  [ALAPPUZHA_BOUNDS.maxLat + PAD, ALAPPUZHA_BOUNDS.maxLng + PAD],
);

/** Hard floor: at zoom 10 the view is roughly district-sized, never the world. */
export const ALAPPUZHA_MIN_ZOOM = 10;

/**
 * Minimum zoom = whatever fits the district in the current viewport, so you
 * can't zoom out past Alappuzha. Panning limits come from MapContainer's
 * maxBounds + maxBoundsViscosity props.
 */
export function LockToAlappuzha() {
  const map = useMap();
  useEffect(() => {
    const fitMinZoom = () => {
      const size = map.getSize();
      if (size.x === 0 || size.y === 0) return; // not laid out yet; keep the hard floor
      const fit = map.getBoundsZoom(ALAPPUZHA_LATLNG_BOUNDS, true);
      if (Number.isFinite(fit)) map.setMinZoom(Math.max(ALAPPUZHA_MIN_ZOOM, fit));
    };
    map.whenReady(fitMinZoom);
    map.on("resize", fitMinZoom);
    return () => {
      map.off("resize", fitMinZoom);
    };
  }, [map]);
  return null;
}

const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** Base layers: monochrome (OSM tiles printed to the zone ramp), standard OSM, and satellite imagery. */
export function BaseLayers({ defaultLayer = "zone" }: { defaultLayer?: "zone" | "streets" | "satellite" }) {
  return (
    <>
    <LockToAlappuzha />
    <DistrictBoundary />
    <LayersControl position="topright">
      <LayersControl.BaseLayer checked={defaultLayer === "zone"} name="Monochrome">
        <TileLayer attribution={OSM_ATTR} url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} className="bt-zone-tiles" bounds={ALAPPUZHA_LATLNG_BOUNDS} />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer checked={defaultLayer === "streets"} name="Streets (OSM)">
        <TileLayer attribution={OSM_ATTR} url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} bounds={ALAPPUZHA_LATLNG_BOUNDS} />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer checked={defaultLayer === "satellite"} name="Satellite">
        <TileLayer
          attribution="Imagery &copy; Esri, Maxar, Earthstar Geographics"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
          bounds={ALAPPUZHA_LATLNG_BOUNDS}
        />
      </LayersControl.BaseLayer>
    </LayersControl>
    </>
  );
}
