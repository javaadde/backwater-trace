import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/services/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getDashboardData());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not load incidents" }, { status: 500 });
  }
}
