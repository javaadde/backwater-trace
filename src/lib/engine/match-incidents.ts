import type { Category, Incident, Report } from "@/types/domain";
import { haversineMeters } from "./geo";

export const MATCH_WEIGHTS = {
  sameCategory: 3,
  withinDistance: 4,
  withinTime: 2,
  similarKeywords: 2,
} as const;

export const MATCH_CONFIG = {
  threshold: Number(process.env.MATCH_THRESHOLD ?? 7),
  maxDistanceMeters: 500,
  maxHoursApart: 3,
  keywordJaccard: 0.2,
};

/** Categories that describe the same physical phenomenon count as a category match. */
const RELATED: Partial<Record<Category, Category[]>> = {
  flood: ["waterlogging"],
  waterlogging: ["flood"],
};

export interface MatchCandidate {
  incident: Incident;
  reports: Pick<Report, "description" | "transcript" | "reported_at" | "latitude" | "longitude">[];
}

export interface MatchResult {
  incidentId: string;
  score: number;
  distanceMeters: number;
  reasons: string[];
}

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "and", "or", "of", "to", "in", "on", "at", "near", "has", "have", "it", "this", "there", "here", "with", "for", "be", "been", "appears", "road",
  "ഇവിടെ", "ആണ്", "ഉണ്ട്", "ഒരു", "ഈ", "അവിടെ",
]);

export function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^\p{L}\p{M}\p{N}]+/u)
      .filter((t) => t.length > 2 && !STOPWORDS.has(t)),
  );
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

export function scoreCandidate(
  report: Pick<Report, "category" | "latitude" | "longitude" | "reported_at" | "description" | "transcript">,
  candidate: MatchCandidate,
): MatchResult {
  const { incident } = candidate;
  const reasons: string[] = [];
  let score = 0;

  if (incident.category === report.category || RELATED[report.category]?.includes(incident.category)) {
    score += MATCH_WEIGHTS.sameCategory;
    reasons.push(incident.category === report.category ? "same category" : "related category");
  }

  // Distance to the nearest point we know about (incident centre or any of its reports).
  const points = [incident, ...candidate.reports];
  const distanceMeters = Math.min(...points.map((p) => haversineMeters(report, p)));
  if (distanceMeters <= MATCH_CONFIG.maxDistanceMeters) {
    score += MATCH_WEIGHTS.withinDistance;
    reasons.push(`${Math.round(distanceMeters)} m away`);
  }

  const t = new Date(report.reported_at).getTime();
  const times = candidate.reports.map((r) => new Date(r.reported_at).getTime());
  if (times.length === 0) times.push(new Date(incident.updated_at).getTime());
  const minHours = Math.min(...times.map((x) => Math.abs(x - t))) / 3_600_000;
  if (minHours <= MATCH_CONFIG.maxHoursApart) {
    score += MATCH_WEIGHTS.withinTime;
    reasons.push(`within ${minHours < 1 ? `${Math.round(minHours * 60)} min` : `${minHours.toFixed(1)} h`}`);
  }

  const reportTokens = tokenize(`${report.description} ${report.transcript ?? ""}`);
  const incidentTokens = tokenize(
    [incident.title, ...candidate.reports.map((r) => `${r.description} ${r.transcript ?? ""}`)].join(" "),
  );
  if (jaccard(reportTokens, incidentTokens) >= MATCH_CONFIG.keywordJaccard) {
    score += MATCH_WEIGHTS.similarKeywords;
    reasons.push("similar wording");
  }

  return { incidentId: incident.id, score, distanceMeters, reasons };
}

/**
 * Returns the best-scoring open incident above the threshold, or null if the
 * report should start a new incident. Resolved incidents are never reopened.
 */
export function findMatchingIncident(
  report: Parameters<typeof scoreCandidate>[0],
  candidates: MatchCandidate[],
  threshold = MATCH_CONFIG.threshold,
): MatchResult | null {
  let best: MatchResult | null = null;
  for (const c of candidates) {
    if (c.incident.status === "resolved") continue;
    const r = scoreCandidate(report, c);
    if (r.score < threshold) continue;
    if (!best || r.score > best.score || (r.score === best.score && r.distanceMeters < best.distanceMeters)) {
      best = r;
    }
  }
  return best;
}
