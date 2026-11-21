import type { Metadata } from "next";
import { TopBar } from "@/components/dashboard/top-bar";
import { IncidentDetailView } from "@/components/reports/incident-detail";

export const metadata: Metadata = { title: "Incident — Backwater Trace" };

export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <main className="flex flex-1 flex-col">
        <IncidentDetailView id={id} />
      </main>
    </div>
  );
}
