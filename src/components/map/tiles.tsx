"use client";

import { LayersControl, TileLayer } from "react-leaflet";

const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** Base layers: dark (OSM tiles with a CSS filter), standard OSM, and satellite imagery. */
export function BaseLayers({ defaultLayer = "dark" }: { defaultLayer?: "dark" | "streets" | "satellite" }) {
  return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer checked={defaultLayer === "dark"} name="Dark">
        <TileLayer attribution={OSM_ATTR} url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} className="bt-dark-tiles" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer checked={defaultLayer === "streets"} name="Streets (OSM)">
        <TileLayer attribution={OSM_ATTR} url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer checked={defaultLayer === "satellite"} name="Satellite">
        <TileLayer
          attribution="Imagery &copy; Esri, Maxar, Earthstar Geographics"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
      </LayersControl.BaseLayer>
    </LayersControl>
  );
}
