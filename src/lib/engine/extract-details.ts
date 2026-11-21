import type {
  Category,
  ExtractedDetails,
  Language,
  RoadStatus,
  Severity,
  SituationStatus,
  WaterLevel,
} from "@/types/domain";
import { findLandmark } from "./landmarks";

/**
 * Keyword/rule extraction over Malayalam + English text. Output is a
 * suggestion the reporter can correct — never an authoritative judgement.
 * Rules are checked in order; the first matching rule wins.
 */
type Rule<T> = { value: T; terms: string[] };

const CATEGORY_RULES: Rule<Category>[] = [
  { value: "waste_dumping", terms: ["waste", "garbage", "dumping", "dumped", "trash", "മാലിന്യ", "ചവറ്"] },
  { value: "blocked_canal", terms: ["canal", "blocked drain", "drain blocked", "water hyacinth", "പോള", "കനാൽ", "തോട്", "ഓട"] },
  { value: "waterlogging", terms: ["waterlogging", "waterlogged", "stagnant", "വെള്ളക്കെട്ട്", "കെട്ടിക്കിടക്കുന്നു"] },
  { value: "flood", terms: ["flood", "flooded", "water level", "submerged", "knee", "waist", "വെള്ളപ്പൊക്ക", "മുട്ടോളം", "അരയോളം", "വെള്ളം കയറി", "വെള്ളമുണ്ട്", "വെള്ളം"] },
  { value: "damaged_infrastructure", terms: ["pothole", "collapsed", "damaged", "broken", "bridge", "crack", "കുഴി", "തകർന്ന", "പൊട്ടി", "പാലം"] },
];

const WATER_RULES: Rule<WaterLevel>[] = [
  { value: "chest", terms: ["chest", "neck", "നെഞ്ചോളം", "കഴുത്തോളം"] },
  { value: "waist", terms: ["waist", "hip", "അരയോളം", "അരക്കൊപ്പം"] },
  { value: "knee", terms: ["knee", "മുട്ടോളം", "മുട്ടറ്റം", "കാൽമുട്ട്"] },
  { value: "ankle", terms: ["ankle", "ankle-deep", "കണങ്കാൽ", "നേരിയ വെള്ളം"] },
];

const ROAD_RULES: Rule<RoadStatus>[] = [
  { value: "partially_open", terms: ["partially open", "partly open", "one side open", "one lane", "ഭാഗികമായി", "ഒരു വശം"] },
  { value: "blocked", terms: ["blocked", "closed", "impassable", "no vehicles", "cannot pass", "അടഞ്ഞു", "അടച്ചു", "ബ്ലോക്ക്", "ഗതാഗതം നിലച്ചു", "പോകാൻ പറ്റില്ല", "പോകാൻ കഴിയില്ല"] },
  { value: "difficult", terms: ["difficult", "slow", "struggling", "hard to pass", "ബുദ്ധിമുട്ട", "പ്രയാസ"] },
  { value: "open", terms: ["road open", "road is open", "traffic moving", "reopened", "തുറന്നു", "ഗതാഗതം സാധാരണ"] },
];

const SEVERITY_RULES: Rule<Severity>[] = [
  { value: "high", terms: ["urgent", "emergency", "dangerous", "severe", "stranded", "rescue", "അപകട", "ഗുരുതര", "അടിയന്തര", "കുടുങ്ങി"] },
  { value: "low", terms: ["minor", "small", "slight", "ചെറിയ", "നേരിയ"] },
  { value: "moderate", terms: ["moderate", "considerable", "ബുദ്ധിമുട്ട"] },
];

const SITUATION_RULES: Rule<SituationStatus>[] = [
  { value: "cleared", terms: ["cleared", "resolved", "drained", "removed", "നീക്കം ചെയ്തു", "മാറി", "വൃത്തിയാക്കി"] },
  { value: "receding", terms: ["receding", "going down", "reducing", "subsiding", "കുറയുന്നു", "താഴുന്നു"] },
  { value: "ongoing", terms: ["rising", "increasing", "still", "continuing", "കൂടുന്നു", "ഉയരുന്നു", "ഇപ്പോഴും"] },
];

function firstMatch<T>(text: string, rules: Rule<T>[]): T | null {
  for (const rule of rules) {
    if (rule.terms.some((t) => text.includes(t.toLowerCase()))) return rule.value;
  }
  return null;
}

const MALAYALAM_RE = /[ഀ-ൿ]/g;
const LATIN_RE = /[A-Za-z]/g;

export function detectLanguage(text: string): Language {
  const ml = text.match(MALAYALAM_RE)?.length ?? 0;
  const en = text.match(LATIN_RE)?.length ?? 0;
  if (ml === 0 && en === 0) return "en";
  if (ml > 0 && en > 0 && Math.min(ml, en) / Math.max(ml, en) > 0.25) return "mixed";
  return ml >= en ? "ml" : "en";
}

const LOCATION_PATTERNS = [
  /\b(?:near|at|beside|opposite|behind|in front of)\s+([A-Za-z][A-Za-z .'-]{2,40})/i,
  /([ഀ-ൿ]+(?:\s[ഀ-ൿ]+)?)\s*(?:ന്റെ\s*)?(?:അടുത്ത്|സമീപം|മുന്നിൽ|ജംഗ്ഷൻ)/,
];

export function extractDetails(rawText: string): ExtractedDetails {
  const text = rawText.toLowerCase();
  const landmark = findLandmark(rawText);
  let locationText: string | null = landmark?.name ?? null;
  if (!locationText) {
    for (const re of LOCATION_PATTERNS) {
      const m = rawText.match(re);
      if (m?.[1]) {
        locationText = m[1].trim().replace(/[.,]$/, "");
        break;
      }
    }
  }

  const waterLevel = firstMatch(text, WATER_RULES);
  const roadStatus = firstMatch(text, ROAD_RULES);
  let severity = firstMatch(text, SEVERITY_RULES);
  if (!severity) {
    if (waterLevel === "waist" || waterLevel === "chest" || roadStatus === "blocked") severity = "high";
    else if (waterLevel === "knee" || roadStatus === "difficult") severity = "moderate";
  }

  return {
    category: firstMatch(text, CATEGORY_RULES),
    severity,
    roadStatus,
    waterLevel,
    situationStatus: firstMatch(text, SITUATION_RULES),
    locationText,
    landmark,
    language: detectLanguage(rawText),
  };
}
