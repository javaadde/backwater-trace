import type {
  Category,
  IncidentStatus,
  RoadStatus,
  Severity,
  SituationStatus,
  WaterLevel,
  ContradictionField,
} from "@/types/domain";

export const CATEGORY_LABEL: Record<Category, string> = {
  flood: "Flooded road",
  waterlogging: "Waterlogging",
  blocked_canal: "Blocked canal",
  waste_dumping: "Waste dumping",
  damaged_infrastructure: "Damaged infrastructure",
  other: "Other issue",
};

export const CATEGORY_LABEL_ML: Record<Category, string> = {
  flood: "വെള്ളപ്പൊക്കം",
  waterlogging: "വെള്ളക്കെട്ട്",
  blocked_canal: "കനാൽ തടസ്സം",
  waste_dumping: "മാലിന്യം",
  damaged_infrastructure: "തകർന്ന റോഡ്",
  other: "മറ്റുള്ളവ",
};

export const STATUS_LABEL: Record<IncidentStatus, string> = {
  new: "New",
  needs_verification: "Needs verification",
  verified: "Verified",
  resolved: "Resolved",
};

export const ROAD_LABEL: Record<RoadStatus, string> = {
  open: "Open",
  partially_open: "Partially open",
  difficult: "Difficult to pass",
  blocked: "Blocked",
};

export const WATER_LABEL: Record<WaterLevel, string> = {
  ankle: "Ankle level",
  knee: "Knee level",
  waist: "Waist level",
  chest: "Chest level",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
};

export const SITUATION_LABEL: Record<SituationStatus, string> = {
  ongoing: "Ongoing",
  receding: "Receding",
  cleared: "Cleared",
};

export const FIELD_LABEL: Record<ContradictionField, string> = {
  roadStatus: "Road status",
  waterLevel: "Water level",
  incidentStatus: "Situation",
  severity: "Reported severity",
};

export function fieldValueLabel(field: ContradictionField, value: string): string {
  switch (field) {
    case "roadStatus":
      return ROAD_LABEL[value as RoadStatus] ?? value;
    case "waterLevel":
      return WATER_LABEL[value as WaterLevel] ?? value;
    case "severity":
      return SEVERITY_LABEL[value as Severity] ?? value;
    case "incidentStatus":
      return SITUATION_LABEL[value as SituationStatus] ?? value;
  }
}
