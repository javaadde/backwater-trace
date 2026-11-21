import type { Metadata } from "next";
import { TopBar } from "@/components/dashboard/top-bar";
import { ReportForm } from "@/components/reports/report-form";

export const metadata: Metadata = {
  title: "Report an incident",
  description: "Report a flood, blocked canal or damaged road in Alappuzha by typing or recording a Malayalam voice note, then place a pin and review before submitting.",
  alternates: { canonical: "/report" },
};

export default function ReportPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <main className="flex-1">
        <ReportForm />
      </main>
    </div>
  );
}
