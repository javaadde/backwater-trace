import { buildLlmsFull } from "@/lib/llms";
import { getDashboardData } from "@/lib/services/queries";
import { CATEGORY_LABEL } from "@/lib/labels";

export const dynamic = "force-dynamic";

export async function GET() {
  let incidents: Parameters<typeof buildLlmsFull>[0] = [];
  try {
    const data = await getDashboardData();
    incidents = data.incidents.map((i) => ({
      id: i.id,
      title: i.title,
      category: CATEGORY_LABEL[i.category] ?? i.category,
      reports: i.report_count,
      conflicts: i.contradiction_count,
    }));
  } catch {
    // Serve the static description even if the store is unreachable.
  }
  return new Response(buildLlmsFull(incidents), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300" },
  });
}
