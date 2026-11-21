import type { Contradiction, EvidenceGraph, GraphEdge, GraphNode, Incident, Report } from "@/types/domain";
import { CATEGORY_LABEL, FIELD_LABEL } from "@/lib/labels";
import { haversineMeters } from "./geo";

const LOCATION_MERGE_METERS = 120;
const CHILD_W = 190;
const REPORT_MIN_W = 230;
const ROW_REPORT_Y = 190;
const ROW_CHILD_Y = 400;
const ROW_LOCATION_Y = 590;

const SHORT_FIELD: Record<string, string> = {
  roadStatus: "road",
  waterLevel: "water level",
  incidentStatus: "situation",
  severity: "severity",
};

function shortTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
}

/**
 * Top-down evidence tree: Incident on top, reports in a row beneath it, and
 * each report's location + original source(s) beneath the report. Positions
 * are node centres. Pure function of relational data — no graph database.
 */
export function buildGraph(
  incident: Incident,
  reports: Report[],
  contradictions: Contradiction[],
): EvidenceGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const flagged = new Set(contradictions.flatMap((c) => [c.report_a_id, c.report_b_id]));
  const sorted = [...reports].sort((a, b) => a.reported_at.localeCompare(b.reported_at));

  // First pass: decide each report's children so we know how wide its column is.
  const locations: { id: string; lat: number; lng: number }[] = [];
  type Child = Omit<GraphNode, "x" | "y">;
  const locationNodes = new Map<string, Child>();
  const locationXs = new Map<string, number[]>();
  const plan = sorted.map((r) => {
    const children: Child[] = [];
    let loc = locations.find((l) => haversineMeters({ latitude: l.lat, longitude: l.lng }, r) <= LOCATION_MERGE_METERS);
    if (!loc) {
      loc = { id: `location:${locations.length}`, lat: r.latitude, lng: r.longitude };
      locations.push(loc);
      locationNodes.set(loc.id, {
        id: loc.id,
        kind: "location",
        label: r.location_text ?? "Pinned location",
        sublabel: `${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)}`,
      });
    }
    children.push(
      r.source_type === "voice"
        ? { id: `source:${r.id}:voice`, kind: "source", label: "Voice note", sublabel: r.original_language === "ml" ? "Malayalam · Sarvam" : "Transcribed audio", refId: r.id }
        : { id: `source:${r.id}:text`, kind: "source", label: "Written report", sublabel: r.original_language === "ml" ? "Malayalam" : r.original_language === "mixed" ? "Mixed language" : "English", refId: r.id },
    );
    if (r.photo_url) children.push({ id: `source:${r.id}:photo`, kind: "source", label: "Photo", sublabel: "Private evidence", refId: r.id });
    return { r, children, locId: loc.id, width: Math.max(REPORT_MIN_W, children.length * CHILD_W) };
  });

  const total = plan.reduce((s, p) => s + p.width, 0);
  let cursor = -total / 2;

  nodes.push({
    id: `incident:${incident.id}`,
    kind: "incident",
    label: incident.title,
    sublabel: `${CATEGORY_LABEL[incident.category]} · ${sorted.length} source${sorted.length === 1 ? "" : "s"}`,
    refId: incident.id,
    x: 0,
    y: 0,
  });

  plan.forEach(({ r, children, locId, width }, i) => {
    const cx = cursor + width / 2;
    const rid = `report:${r.id}`;
    nodes.push({
      id: rid,
      kind: "report",
      label: `Report ${i + 1}`,
      sublabel: `${r.source_type === "voice" ? "Voice" : "Text"} · ${shortTime(r.reported_at)}`,
      refId: r.id,
      x: cx,
      y: ROW_REPORT_Y,
      flagged: flagged.has(r.id),
    });
    edges.push({ id: `e:${rid}:incident`, source: rid, target: `incident:${incident.id}`, kind: "REPORTS" });

    const childStart = cx - ((children.length - 1) * CHILD_W) / 2;
    children.forEach((c, j) => {
      nodes.push({ ...c, x: childStart + j * CHILD_W, y: ROW_CHILD_Y });
      edges.push({ id: `e:${c.id}:${rid}`, source: c.id, target: rid, kind: "SUPPORTS" });
    });
    edges.push({ id: `e:${rid}:${locId}`, source: rid, target: locId, kind: "LOCATED_AT" });
    locationXs.set(locId, [...(locationXs.get(locId) ?? []), cx]);
    cursor += width;
  });

  // Locations sit on their own row, centred under the reports that point to them.
  for (const [id, node] of locationNodes) {
    const xs = locationXs.get(id) ?? [0];
    nodes.push({ ...node, x: xs.reduce((a, b) => a + b, 0) / xs.length, y: ROW_LOCATION_Y });
  }

  // One conflict edge per report pair, labelled with the fields in dispute.
  const pairs = new Map<string, string[]>();
  for (const c of contradictions) {
    const key = [c.report_a_id, c.report_b_id].sort().join("|");
    pairs.set(key, [...(pairs.get(key) ?? []), SHORT_FIELD[c.field] ?? FIELD_LABEL[c.field]]);
  }
  for (const [key, fields] of pairs) {
    const [a, b] = key.split("|");
    edges.push({
      id: `e:conflict:${key}`,
      source: `report:${a}`,
      target: `report:${b}`,
      kind: "CONFLICTS_WITH",
      label: `Conflict · ${[...new Set(fields)].join(", ")}`,
    });
  }

  return { nodes, edges };
}
