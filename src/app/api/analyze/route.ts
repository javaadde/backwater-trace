import { NextResponse } from "next/server";
import { analyzeSchema } from "@/lib/validation/report";
import { extractDetails } from "@/lib/engine/extract-details";

export const dynamic = "force-dynamic";

/** Rule-based extraction of suggested fields. Advisory only. */
export async function POST(request: Request) {
  const parsed = analyzeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Text is required" }, { status: 400 });
  return NextResponse.json(extractDetails(parsed.data.text));
}
