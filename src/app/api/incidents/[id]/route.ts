import { NextResponse } from "next/server";
import { z } from "zod";
import { getIncidentDetail } from "@/lib/services/queries";
import { getStore } from "@/lib/store";
import { incidentPatchSchema } from "@/lib/validation/report";

export const dynamic = "force-dynamic";

const idSchema = z.uuid();

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const detail = await getIncidentDetail(id);
    if (!detail) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(detail);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not load incident" }, { status: 500 });
  }
}

/** Coordinator review status change (no auth in the hackathon build). */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = incidentPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const store = getStore();
  if (!(await store.getIncident(id))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await store.updateIncident(id, { status: parsed.data.status, updated_at: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
