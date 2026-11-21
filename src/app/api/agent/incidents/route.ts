import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { findIncidentsInput } from "@/lib/buddy/schemas";
import { BuddyInputError, findIncidents } from "@/lib/buddy/incident-tool";
import { DatabaseNotReadyError } from "@/lib/store/supabase";

export const dynamic = "force-dynamic";

// Tool endpoint for the Smallest.ai voice agent. Read-only; the provider sends
// `Authorization: Bearer <BUDDY_TOOL_SECRET>` from its Tools secret vault.

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hits: number[] = [];

/** Best-effort, per-instance limit. Fine for a demo; use a shared store for real traffic. */
function rateLimited(now = Date.now()): boolean {
  while (hits.length && now - hits[0] > WINDOW_MS) hits.shift();
  if (hits.length >= MAX_PER_WINDOW) return true;
  hits.push(now);
  return false;
}

function authorised(req: Request): boolean {
  const secret = process.env.BUDDY_TOOL_SECRET;
  if (!secret) return false; // fail closed when not configured
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const digest = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(given), digest(secret));
}

export async function POST(req: Request) {
  if (!authorised(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (rateLimited()) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });

  const body = await req.json().catch(() => null);
  const parsed = findIncidentsInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) }, { status: 400 });
  }

  try {
    return NextResponse.json(await findIncidents(parsed.data));
  } catch (e) {
    if (e instanceof BuddyInputError) return NextResponse.json({ error: e.message }, { status: 422 });
    console.error("agent/incidents failed:", e instanceof Error ? e.message : "unknown error");
    if (e instanceof DatabaseNotReadyError) return NextResponse.json({ error: "Database not ready" }, { status: 503 });
    return NextResponse.json({ error: "Could not load incidents" }, { status: 500 });
  }
}
