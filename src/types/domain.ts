export const CATEGORIES = [
  "flood",
  "waterlogging",
  "blocked_canal",
  "waste_dumping",
  "damaged_infrastructure",
  "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const INCIDENT_STATUSES = [
  "new",
  "needs_verification",
  "verified",
  "resolved",
] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

/** Ordered from least to most severe where an order makes sense. */
export const ROAD_STATUSES = ["open", "partially_open", "difficult", "blocked"] as const;
export type RoadStatus = (typeof ROAD_STATUSES)[number];

export const WATER_LEVELS = ["ankle", "knee", "waist", "chest"] as const;
export type WaterLevel = (typeof WATER_LEVELS)[number];

export const SEVERITIES = ["low", "moderate", "high"] as const;
export type Severity = (typeof SEVERITIES)[number];

/** What the reporter says about the situation itself (not the incident's review status). */
export const SITUATION_STATUSES = ["ongoing", "receding", "cleared"] as const;
export type SituationStatus = (typeof SITUATION_STATUSES)[number];

export const LANGUAGES = ["ml", "en", "mixed"] as const;
export type Language = (typeof LANGUAGES)[number];

export type SourceType = "voice" | "text";

export interface Report {
  id: string;
  incident_id: string | null;
  title: string;
  description: string;
  original_language: Language;
  translated_text: string | null;
  latitude: number;
  longitude: number;
  location_text: string | null;
  category: Category;
  reported_at: string;
  created_at: string;
  /** Storage path (never a public URL). */
  photo_url: string | null;
  /** Storage path (never a public URL). */
  audio_url: string | null;
  transcript: string | null;
  road_status: RoadStatus | null;
  water_level: WaterLevel | null;
  severity: Severity | null;
  situation_status: SituationStatus | null;
  reporter_name: string | null;
  source_type: SourceType;
}

export interface Incident {
  id: string;
  title: string;
  category: Category;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  summary: string;
  location_text: string | null;
  created_at: string;
  updated_at: string;
}

export type ContradictionField = "roadStatus" | "waterLevel" | "incidentStatus" | "severity";

export interface Contradiction {
  id: string;
  incident_id: string;
  report_a_id: string;
  report_b_id: string;
  field: ContradictionField;
  value_a: string;
  value_b: string;
  reason: string;
  created_at: string;
}

/** Incident row enriched for the map/list. */
export interface IncidentSummary extends Incident {
  report_count: number;
  contradiction_count: number;
  last_reported_at: string;
}

/** Report with short-lived, signed media links attached for display. */
export interface ReportView extends Report {
  photo_signed_url: string | null;
  audio_signed_url: string | null;
}

export interface IncidentDetail {
  incident: IncidentSummary;
  reports: ReportView[];
  contradictions: Contradiction[];
  graph: EvidenceGraph;
}

export type GraphNodeKind = "incident" | "report" | "location" | "source";
export type GraphEdgeKind = "REPORTS" | "LOCATED_AT" | "SUPPORTS" | "CONFLICTS_WITH";

export interface GraphNode {
  id: string;
  kind: GraphNodeKind;
  label: string;
  sublabel?: string;
  refId?: string;
  x: number;
  y: number;
  flagged?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: GraphEdgeKind;
  label?: string;
}

export interface EvidenceGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ExtractedDetails {
  category: Category | null;
  severity: Severity | null;
  roadStatus: RoadStatus | null;
  waterLevel: WaterLevel | null;
  situationStatus: SituationStatus | null;
  locationText: string | null;
  landmark: Landmark | null;
  language: Language;
}

export interface Landmark {
  id: string;
  name: string;
  nameMl: string;
  aliases: string[];
  latitude: number;
  longitude: number;
}

export interface ActivityItem {
  id: string;
  kind: "report" | "conflict";
  at: string;
  incident_id: string;
  incident_title: string;
  text: string;
}
