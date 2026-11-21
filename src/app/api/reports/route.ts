import { NextResponse } from "next/server";
import { DatabaseNotReadyError } from "@/lib/store/supabase";
import { reportFieldsSchema, validateAudio, validatePhoto, type ValidatedFile } from "@/lib/validation/report";
import { createReport } from "@/lib/services/create-report";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const raw = Object.fromEntries(
    [...form.entries()].filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
  const parsed = reportFieldsSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid report", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const warnings: string[] = [];
  let photo: ValidatedFile | null = null;
  let audio: ValidatedFile | null = null;
  const photoFile = form.get("photo");
  const audioFile = form.get("audio");
  if (photoFile instanceof File && photoFile.size > 0) {
    try {
      photo = await validatePhoto(photoFile);
    } catch (e) {
      warnings.push(`${(e as Error).message}. The report was saved without the photo.`);
    }
  }
  if (audioFile instanceof File && audioFile.size > 0) {
    try {
      audio = await validateAudio(audioFile);
    } catch (e) {
      warnings.push(`${(e as Error).message}. The recording was not stored.`);
    }
  }

  try {
    const result = await createReport(parsed.data, { photo, audio });
    return NextResponse.json({ ...result, warnings: [...warnings, ...result.warnings] }, { status: 201 });
  } catch (e) {
    console.error("Report creation failed", e);
    if (e instanceof DatabaseNotReadyError) {
      return NextResponse.json({ error: "The database is not set up yet. Run supabase/schema.sql in Supabase, then try again." }, { status: 503 });
    }
    return NextResponse.json({ error: "The report could not be saved. Please try again." }, { status: 500 });
  }
}
