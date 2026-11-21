import type { Metadata } from "next";
import { TopBar } from "@/components/dashboard/top-bar";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { MascotLauncher } from "@/components/buddy/mascot-launcher";

export const metadata: Metadata = {
  title: "Incident board",
  description: "Map and list of Alappuzha incident reports grouped by event, with possible conflicts between sources flagged for verification. Includes synthetic sample incidents.",
  alternates: { canonical: "/dashboard" },
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
      <TopBar />
      <DashboardClient />
      <MascotLauncher />
    </div>
  );
}
