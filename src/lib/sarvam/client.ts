import "server-only";

const SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text";

export class TranscriptionError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export interface TranscriptionResult {
  transcript: string;
  languageCode: string | null;
  mocked: boolean;
}

/** Synthetic demo transcript, used only when SARVAM_MOCK=1. */
const MOCK_TRANSCRIPT = "കെഎസ്ആർടിസി ബസ് സ്റ്റാൻഡിന് അടുത്ത് അരയോളം വെള്ളം കയറി, റോഡ് പൂർണ്ണമായും ബ്ലോക്ക് ആണ്.";

/**
 * Malayalam speech-to-text via Sarvam. Server-side only: the API key is read
 * from the environment and never sent to the browser. The response is treated
 * as untrusted text.
 */
export async function transcribeAudio(audio: { bytes: Uint8Array; contentType: string; ext: string }): Promise<TranscriptionResult> {
  if (process.env.SARVAM_MOCK === "1") {
    return { transcript: MOCK_TRANSCRIPT, languageCode: "ml-IN", mocked: true };
  }
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) throw new TranscriptionError("Voice transcription is not configured", 503);

  const form = new FormData();
  form.append("file", new Blob([audio.bytes as BlobPart], { type: audio.contentType }), `recording.${audio.ext}`);
  form.append("model", process.env.SARVAM_STT_MODEL || "saaras:v4");
  form.append("mode", "transcribe");
  form.append("language_code", process.env.SARVAM_LANGUAGE_CODE || "ml-IN");

  let res: Response;
  try {
    res = await fetch(SARVAM_STT_URL, {
      method: "POST",
      headers: { "api-subscription-key": apiKey },
      body: form,
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new TranscriptionError("Could not reach the transcription service", 502);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Sarvam STT error", res.status, detail.slice(0, 500));
    throw new TranscriptionError("Transcription service returned an error", 502);
  }

  const data = (await res.json()) as { transcript?: unknown; language_code?: unknown };
  const transcript = typeof data.transcript === "string" ? data.transcript.trim().slice(0, 4000) : "";
  if (!transcript) throw new TranscriptionError("No speech was recognised in the recording", 422);
  return {
    transcript,
    languageCode: typeof data.language_code === "string" ? data.language_code : null,
    mocked: false,
  };
}
