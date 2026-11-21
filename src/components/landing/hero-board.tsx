"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { IncidentSummary } from "@/types/domain";
import { IncidentMap } from "@/components/map";
import { IncidentList } from "@/components/dashboard/incident-list";

/** Plate I on the landing page: the same live map and entry list as the incident board. */
export function HeroBoard() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<IncidentSummary[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/incidents", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { incidents: IncidentSummary[] }) => alive && setIncidents(j.incidents.filter((i) => i.status !== "resolved")))
      .catch(() => alive && setIncidents([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="lx-board">
      <p className="entry-head lx-board__head">
        <span>Plate I. Alappuzha district</span>
        <span>Pins sized by sources</span>
      </p>
      <div className="plate lx-board__map">
        <IncidentMap incidents={incidents ?? []} selectedId={selectedId} onSelect={setSelectedId} onOpen={(id) => router.push(`/incidents/${id}`)} />
      </div>
      <div className="lx-board__list scroll-thin">
        {incidents === null ? (
          <p className="lx-board__empty" aria-busy>Loading entries…</p>
        ) : (
          <IncidentList incidents={incidents} selectedId={selectedId} onSelect={setSelectedId} onOpen={(id) => router.push(`/incidents/${id}`)} />
        )}
      </div>
    </div>
  );
}
