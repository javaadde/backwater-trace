import { NextResponse } from "next/server";
import { validateAudio } from "@/lib/validation/report";
import { transcribeAudio, TranscriptionError } from "@/lib/sarvam/client";

export const dynamic = "force-dynamic";

const FALLBACK = "Voice transcription failed. You can still type the report manually.";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("audio");
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing audio" }, { status: 400 });

  let audio;
  try {
    audio = await validateAudio(file);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  try {
    const result = await transcribeAudio(audio);
    return NextResponse.json(result);
  } catch (e) {
    const status = e instanceof TranscriptionError ? e.status : 500;
    const detail = e instanceof TranscriptionError ? e.message : "Unexpected error";
    return NextResponse.json({ error: FALLBACK, detail }, { status });
  }
}
