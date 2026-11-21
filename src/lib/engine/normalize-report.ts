import type { Category, Language, Report, RoadStatus, Severity, SituationStatus, SourceType, WaterLevel } from "@/types/domain";
import { CATEGORY_LABEL } from "@/lib/labels";
import { extractDetails } from "./extract-details";

export interface ReportInput {
  description: string;
  transcript?: string | null;
  category?: Category | null;
  latitude: number;
  longitude: number;
  locationText?: string | null;
  reportedAt?: string | null;
  reporterName?: string | null;
  roadStatus?: RoadStatus | null;
  waterLevel?: WaterLevel | null;
  severity?: Severity | null;
  situationStatus?: SituationStatus | null;
  sourceType: SourceType;
}

export type NormalizedReport = Omit<Report, "id" | "incident_id" | "created_at" | "photo_url" | "audio_url">;

export function cleanText(text: string): string {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Accepts an ISO-ish timestamp; falls back to now and never allows the future. */
export function normalizeTimestamp(value: string | null | undefined, now = new Date()): string {
  if (!value) return now.toISOString();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return now.toISOString();
  return (d.getTime() > now.getTime() ? now : d).toISOString();
}

function buildTitle(category: Category, locationText: string | null): string {
  const base = CATEGORY_LABEL[category];
  return locationText ? `${base} near ${locationText}` : base;
}

/**
 * Turns validated user input into a report row. Explicit reporter choices win
 * over extracted values; extraction only fills gaps.
 */
export function normalizeReport(input: ReportInput, now = new Date()): NormalizedReport {
  const description = cleanText(input.description);
  const transcript = input.transcript ? cleanText(input.transcript) : null;
  const extracted = extractDetails([description, transcript].filter(Boolean).join(" "));

  const category: Category = input.category ?? extracted.category ?? "other";
  const locationText = input.locationText ? cleanText(input.locationText) : extracted.locationText;
  const language: Language = extracted.language;

  return {
    title: buildTitle(category, locationText),
    description,
    original_language: language,
    translated_text: null,
    latitude: Number(input.latitude.toFixed(6)),
    longitude: Number(input.longitude.toFixed(6)),
    location_text: locationText,
    category,
    reported_at: normalizeTimestamp(input.reportedAt, now),
    transcript,
    road_status: input.roadStatus ?? extracted.roadStatus,
    water_level: input.waterLevel ?? extracted.waterLevel,
    severity: input.severity ?? extracted.severity,
    situation_status: input.situationStatus ?? extracted.situationStatus,
    reporter_name: input.reporterName ? cleanText(input.reporterName).slice(0, 80) : null,
    source_type: input.sourceType,
  };
}
