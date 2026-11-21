import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { readLocalEvidence } from "@/lib/store/local";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  wav: "audio/wav",
  webm: "audio/webm",
  ogg: "audio/ogg",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  aac: "audio/aac",
};

/** Serves evidence only for the local dev store. Supabase uses signed URLs instead. */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  if (getStore().kind !== "local") return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { path } = await params;
  const rel = path.join("/");
  if (!/^(photos|audio)\/[0-9a-f-]{36}\/[a-z]+\.[a-z0-9]+$/.test(rel)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const data = await readLocalEvidence(rel);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const ext = rel.split(".").pop() ?? "";
  return new NextResponse(new Uint8Array(data), {
    headers: { "Content-Type": TYPES[ext] ?? "application/octet-stream", "Cache-Control": "private, max-age=300" },
  });
}
