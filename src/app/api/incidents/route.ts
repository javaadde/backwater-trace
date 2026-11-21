import { NextResponse } from "next/server";
import { DatabaseNotReadyError } from "@/lib/store/supabase";
import { getDashboardData } from "@/lib/services/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getDashboardData());
  } catch (e) {
    console.error(e);
    if (e instanceof DatabaseNotReadyError) {
      return NextResponse.json({ error: "The database is not set up yet. Run supabase/schema.sql in Supabase, then try again." }, { status: 503 });
    }
    return NextResponse.json({ error: "Could not load incidents" }, { status: 500 });
  }
}
