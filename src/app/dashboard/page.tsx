import type { Metadata } from "next";
import { TopBar } from "@/components/dashboard/top-bar";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = { title: "Incident board — Backwater Trace" };

export default function DashboardPage() {
  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
      <TopBar />
      <DashboardClient />
    </div>
  );
}
