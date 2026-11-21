"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, useMap, useMapEvents } from "react-leaflet";
import { ALAPPUZHA_CENTER } from "@/lib/engine/geo";
import { ALAPPUZHA_LATLNG_BOUNDS, ALAPPUZHA_MIN_ZOOM, BaseLayers } from "./tiles";

const pinIcon = L.divIcon({
  html: '<div class="bt-pin" style="--pin: var(--accent)" data-selected="true">●</div>',
  className: "bt-marker",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

type LatLng = { latitude: number; longitude: number };

function ClickHandler({ onChange }: { onChange: (p: LatLng) => void }) {
  useMapEvents({ click: (e) => onChange({ latitude: e.latlng.lat, longitude: e.latlng.lng }) });
  return null;
}

function Recenter({ value }: { value: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (value) map.flyTo([value.latitude, value.longitude], Math.max(map.getZoom(), 16), { duration: 0.6 });
    // only when the point moves meaningfully (e.g. landmark pick)
  }, [map, value?.latitude, value?.longitude]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function LocationPicker({ value, onChange }: { value: LatLng | null; onChange: (p: LatLng) => void }) {
  return (
    <MapContainer center={[ALAPPUZHA_CENTER.latitude, ALAPPUZHA_CENTER.longitude]} zoom={14} className="h-full w-full" maxBounds={ALAPPUZHA_LATLNG_BOUNDS} maxBoundsViscosity={1}
      minZoom={ALAPPUZHA_MIN_ZOOM}>
      <BaseLayers defaultLayer="streets" />
      <ClickHandler onChange={onChange} />
      <Recenter value={value} />
      {value && (
        <Marker
          position={[value.latitude, value.longitude]}
          icon={pinIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const ll = (e.target as L.Marker).getLatLng();
              onChange({ latitude: ll.lat, longitude: ll.lng });
            },
          }}
        />
      )}
    </MapContainer>
  );
}
