import { z } from "zod";
import {
  CATEGORIES,
  INCIDENT_STATUSES,
  ROAD_STATUSES,
  SEVERITIES,
  SITUATION_STATUSES,
  WATER_LEVELS,
} from "@/types/domain";
import { isWithinAlappuzha } from "@/lib/engine/geo";

const emptyToNull = (v: unknown) => (v === "" || v === "null" || v === undefined ? null : v);
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess(emptyToNull, z.enum(values).nullable());

export const reportFieldsSchema = z
  .object({
    description: z.string().trim().min(5, "Describe the incident in a few words").max(2000),
    transcript: z.preprocess(emptyToNull, z.string().trim().max(4000).nullable()),
    category: optionalEnum(CATEGORIES),
    latitude: z.coerce.number().finite(),
    longitude: z.coerce.number().finite(),
    locationText: z.preprocess(emptyToNull, z.string().trim().max(120).nullable()),
    reportedAt: z.preprocess(emptyToNull, z.string().max(40).nullable()),
    reporterName: z.preprocess(emptyToNull, z.string().trim().max(80).nullable()),
    roadStatus: optionalEnum(ROAD_STATUSES),
    waterLevel: optionalEnum(WATER_LEVELS),
    severity: optionalEnum(SEVERITIES),
    situationStatus: optionalEnum(SITUATION_STATUSES),
    sourceType: z.enum(["voice", "text"]).default("text"),
  })
  .refine((v) => isWithinAlappuzha(v.latitude, v.longitude), {
    message: "Location must be inside Alappuzha district",
    path: ["latitude"],
  });

export type ReportFields = z.infer<typeof reportFieldsSchema>;

export const analyzeSchema = z.object({ text: z.string().trim().min(1).max(4000) });

export const incidentPatchSchema = z.object({ status: z.enum(INCIDENT_STATUSES) });

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
export const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

const PHOTO_TYPES: Record<string, { ext: string[]; magic: (b: Uint8Array) => boolean }> = {
  "image/jpeg": { ext: ["jpg", "jpeg"], magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: ["png"], magic: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  "image/webp": {
    ext: ["webp"],
    magic: (b) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP",
  },
};

const AUDIO_TYPES: Record<string, string> = {
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/wave": "wav",
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
};

export type ValidatedFile = { bytes: Uint8Array; contentType: string; ext: string };

function baseType(t: string) {
  return t.split(";")[0].trim().toLowerCase();
}

export async function validatePhoto(file: File): Promise<ValidatedFile> {
  if (file.size === 0) throw new Error("Photo is empty");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("Photo is larger than 8 MB");
  const type = baseType(file.type);
  const spec = PHOTO_TYPES[type];
  if (!spec) throw new Error("Photo must be JPEG, PNG or WebP");
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (ext && !spec.ext.includes(ext)) throw new Error("Photo extension does not match its type");
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!spec.magic(bytes)) throw new Error("Photo content does not match its type");
  return { bytes, contentType: type, ext: spec.ext[0] };
}

export async function validateAudio(file: File): Promise<ValidatedFile> {
  if (file.size === 0) throw new Error("Recording is empty");
  if (file.size > MAX_AUDIO_BYTES) throw new Error("Recording is larger than 10 MB");
  const type = baseType(file.type);
  const ext = AUDIO_TYPES[type];
  if (!ext) throw new Error("Unsupported audio format");
  return { bytes: new Uint8Array(await file.arrayBuffer()), contentType: type, ext };
}
