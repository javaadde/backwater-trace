import { z } from "zod";
import { CATEGORIES } from "@/types/domain";

export const MAX_RADIUS_M = 3000;
export const DEFAULT_RADIUS_M = 1200;
export const MAX_INCIDENTS = 10;

/**
 * Tool input. A voice agent rarely has coordinates, so a place name is accepted
 * and resolved against the landmark gazetteer. Coordinates win if both are sent.
 */
export const findIncidentsInput = z
  .object({
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    place: z.string().trim().min(1).max(120).optional(),
    radiusMeters: z.number().positive().max(MAX_RADIUS_M).default(DEFAULT_RADIUS_M),
    category: z.enum(CATEGORIES).optional(),
  })
  .refine((v) => (v.latitude !== undefined) === (v.longitude !== undefined), {
    message: "latitude and longitude must be sent together",
  })
  .refine((v) => v.latitude !== undefined || v.place !== undefined, {
    message: "Provide a place name or latitude and longitude",
  });

export type FindIncidentsInput = z.infer<typeof findIncidentsInput>;

export interface AgentIncident {
  id: string;
  title: string;
  category: string;
  status: string;
  distanceMeters: number;
  reportCount: number;
  conflictingFields: number;
  latestReportAt: string;
  summary: string;
  sourceReportIds: string[];
  url: string;
}

export interface FindIncidentsResult {
  coverage: "crowdsourced-reports-only";
  checkedAt: string;
  searchedNear: { latitude: number; longitude: number; label: string | null; radiusMeters: number };
  incidents: AgentIncident[];
  limitations: string;
}
