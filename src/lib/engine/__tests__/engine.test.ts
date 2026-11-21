import { describe, expect, it } from "vitest";
import { haversineMeters, isWithinAlappuzha } from "../geo";
import { extractDetails, detectLanguage } from "../extract-details";
import { normalizeReport, normalizeTimestamp, cleanText } from "../normalize-report";
import { findMatchingIncident, scoreCandidate, type MatchCandidate } from "../match-incidents";
import { detectContradictions } from "../detect-contradictions";
import { buildGraph } from "../build-graph";
import { buildSeed } from "@/lib/seed";
import { LANDMARKS } from "../landmarks";
import type { Incident, Report } from "@/types/domain";

const NOW = new Date("2026-11-21T10:00:00Z");
const minsAgo = (m: number) => new Date(NOW.getTime() - m * 60_000).toISOString();

const KSRTC = { latitude: 9.4937, longitude: 76.3318 };

function incident(over: Partial<Incident> = {}): Incident {
  return {
    id: "inc-1",
    title: "Flooded road near Alappuzha KSRTC",
    category: "flood",
    latitude: KSRTC.latitude,
    longitude: KSRTC.longitude,
    status: "needs_verification",
    summary: "",
    location_text: "Alappuzha KSRTC",
    created_at: minsAgo(60),
    updated_at: minsAgo(30),
    ...over,
  };
}

function report(over: Partial<Report> = {}): Report {
  return {
    id: "r-1",
    incident_id: "inc-1",
    title: "",
    description: "Knee deep water near KSRTC",
    original_language: "en",
    translated_text: null,
    latitude: KSRTC.latitude,
    longitude: KSRTC.longitude,
    location_text: null,
    category: "flood",
    reported_at: minsAgo(30),
    created_at: minsAgo(30),
    photo_url: null,
    audio_url: null,
    transcript: null,
    road_status: null,
    water_level: null,
    severity: null,
    situation_status: null,
    reporter_name: null,
    source_type: "text",
    ...over,
  };
}

describe("geo", () => {
  it("computes haversine distance", () => {
    expect(haversineMeters(KSRTC, KSRTC)).toBe(0);
    // ~0.001° latitude ≈ 111 m
    const d = haversineMeters(KSRTC, { latitude: KSRTC.latitude + 0.001, longitude: KSRTC.longitude });
    expect(d).toBeGreaterThan(105);
    expect(d).toBeLessThan(117);
  });
  it("checks points against the real district boundary", () => {
    expect(isWithinAlappuzha(KSRTC.latitude, KSRTC.longitude)).toBe(true);
    expect(isWithinAlappuzha(28.6, 77.2)).toBe(false); // Delhi
    expect(isWithinAlappuzha(9.9312, 76.2673)).toBe(false); // Kochi: inside the old box, outside the district
    expect(isWithinAlappuzha(9.5916, 76.5222)).toBe(false); // Kottayam
    expect(isWithinAlappuzha(9.4907, 76.31)).toBe(false); // Arabian Sea off the beach
  });
  it("keeps every landmark and seed report inside the district", () => {
    for (const l of LANDMARKS) expect(isWithinAlappuzha(l.latitude, l.longitude), l.name).toBe(true);
    for (const r of buildSeed(NOW).reports) expect(isWithinAlappuzha(r.latitude, r.longitude), r.description).toBe(true);
  });
});

describe("extractDetails", () => {
  it("reads the Malayalam demo voice report", () => {
    const d = extractDetails("ഇവിടെ റോഡിൽ മുട്ടോളം വെള്ളമുണ്ട്. വാഹനങ്ങൾ പോകാൻ ബുദ്ധിമുട്ടാണ്.");
    expect(d.category).toBe("flood");
    expect(d.waterLevel).toBe("knee");
    expect(d.roadStatus).toBe("difficult");
    expect(d.language).toBe("ml");
  });
  it("reads the English demo report", () => {
    const d = extractDetails("Water has reached waist level near KSRTC and the road appears completely blocked.");
    expect(d.category).toBe("flood");
    expect(d.waterLevel).toBe("waist");
    expect(d.roadStatus).toBe("blocked");
    expect(d.severity).toBe("high");
    expect(d.landmark?.id).toBe("ksrtc");
    expect(d.language).toBe("en");
  });
  it("matches Malayalam words with fused suffixes (real Sarvam output)", () => {
    const d = extractDetails("കെ.എസ്.ആർ.ടി.സി ബസ് സ്റ്റാൻഡിന് അടുത്ത അരയോളം വെള്ളം കയറി. റോഡ് പൂർണ്ണമായും ബ്ലോക്കാണ്.");
    expect(d.roadStatus).toBe("blocked");
    expect(d.waterLevel).toBe("waist");
    expect(d.landmark?.id).toBe("ksrtc");
  });
  it("prefers partially open over blocked", () => {
    expect(extractDetails("road partially open, one lane blocked").roadStatus).toBe("partially_open");
  });
  it("classifies canal and waste", () => {
    expect(extractDetails("canal choked with plastic and hyacinth").category).toBe("blocked_canal");
    expect(extractDetails("garbage dumped beside the road").category).toBe("waste_dumping");
  });
  it("detects language mix", () => {
    expect(detectLanguage("hello")).toBe("en");
    expect(detectLanguage("KSRTC ബസ് സ്റ്റാൻഡിന് അടുത്ത് water")).toBe("mixed");
  });
});

describe("normalizeReport", () => {
  it("cleans text and fills gaps from extraction", () => {
    const r = normalizeReport(
      { description: "  Knee   deep water \u0007 near KSRTC ", latitude: 9.49371234, longitude: 76.33181234, sourceType: "text" },
      NOW,
    );
    expect(r.description).toBe("Knee deep water near KSRTC");
    expect(r.category).toBe("flood");
    expect(r.water_level).toBe("knee");
    expect(r.location_text).toBe("Alappuzha KSRTC");
    expect(r.title).toBe("Flooded road near Alappuzha KSRTC");
    expect(r.latitude).toBe(9.493712);
  });
  it("explicit choices win over extraction", () => {
    const r = normalizeReport(
      { description: "knee deep water", waterLevel: "waist", category: "waterlogging", latitude: 9.49, longitude: 76.33, sourceType: "text" },
      NOW,
    );
    expect(r.water_level).toBe("waist");
    expect(r.category).toBe("waterlogging");
  });
  it("normalizes timestamps and rejects future ones", () => {
    expect(normalizeTimestamp("garbage", NOW)).toBe(NOW.toISOString());
    expect(normalizeTimestamp("2099-01-01T00:00:00Z", NOW)).toBe(NOW.toISOString());
    expect(normalizeTimestamp("2026-11-21T09:00:00Z", NOW)).toBe("2026-11-21T09:00:00.000Z");
  });
  it("strips control characters", () => {
    expect(cleanText("a\u0000b\n\nc")).toBe("ab c");
  });
});

describe("incident matching", () => {
  const candidate: MatchCandidate = { incident: incident(), reports: [report()] };

  it("matches same category, nearby and recent", () => {
    const r = { ...report({ id: "new", reported_at: NOW.toISOString(), description: "waist deep water near KSRTC" }) };
    const m = findMatchingIncident(r, [candidate], 7);
    expect(m?.incidentId).toBe("inc-1");
    expect(m!.score).toBeGreaterThanOrEqual(9);
  });

  it("does not match a different category far away", () => {
    const r = report({ id: "new", category: "waste_dumping", latitude: 9.51, longitude: 76.355, description: "garbage" });
    expect(findMatchingIncident(r, [candidate], 7)).toBeNull();
  });

  it("does not match same category > 500 m away", () => {
    const r = report({ id: "new", latitude: KSRTC.latitude + 0.01, description: "unrelated flood words elsewhere" });
    const s = scoreCandidate(r, candidate);
    expect(s.distanceMeters).toBeGreaterThan(500);
    expect(findMatchingIncident(r, [candidate], 7)).toBeNull();
  });

  it("treats flood and waterlogging as related", () => {
    const r = report({ id: "new", category: "waterlogging" });
    expect(findMatchingIncident(r, [candidate], 7)?.incidentId).toBe("inc-1");
  });

  it("never attaches to resolved incidents", () => {
    const resolved: MatchCandidate = { incident: incident({ status: "resolved" }), reports: [report()] };
    expect(findMatchingIncident(report({ id: "new" }), [resolved], 7)).toBeNull();
  });

  it("picks the best of several candidates", () => {
    const far: MatchCandidate = {
      incident: incident({ id: "inc-far", latitude: KSRTC.latitude + 0.003 }),
      reports: [report({ id: "x", incident_id: "inc-far", latitude: KSRTC.latitude + 0.003, reported_at: minsAgo(600) })],
    };
    expect(findMatchingIncident(report({ id: "new", reported_at: NOW.toISOString() }), [far, candidate], 7)?.incidentId).toBe("inc-1");
  });
});

describe("contradiction detection", () => {
  it("flags differing structured values only", () => {
    const a = report({ id: "a", water_level: "knee", road_status: "difficult", severity: null });
    const b = report({ id: "b", water_level: "waist", road_status: "blocked", severity: "high", reported_at: minsAgo(10) });
    const out = detectContradictions(b, [a]);
    expect(out.map((c) => c.field).sort()).toEqual(["roadStatus", "waterLevel"]);
    const water = out.find((c) => c.field === "waterLevel")!;
    expect(water).toMatchObject({ report_a_id: "a", report_b_id: "b", value_a: "knee", value_b: "waist" });
    expect(water.reason).toMatch(/Needs verification/);
    expect(water.reason).not.toMatch(/false|fake|liar/i);
  });
  it("ignores identical and missing values", () => {
    const a = report({ id: "a", water_level: "knee" });
    const b = report({ id: "b", water_level: "knee" });
    expect(detectContradictions(b, [a])).toEqual([]);
  });
  it("notes possible change over time for distant reports", () => {
    const a = report({ id: "a", situation_status: "ongoing", reported_at: minsAgo(200) });
    const b = report({ id: "b", situation_status: "receding", reported_at: minsAgo(10) });
    expect(detectContradictions(b, [a])[0].reason).toMatch(/conditions may have changed/);
  });
});

describe("evidence graph", () => {
  it("builds incident, report, location, source nodes and conflict edges", () => {
    const a = report({ id: "a", water_level: "knee", source_type: "voice", original_language: "ml" });
    const b = report({ id: "b", water_level: "waist", photo_url: "photos/b/photo.jpg", latitude: KSRTC.latitude + 0.0004 });
    const conflicts = detectContradictions(b, [a]).map((c, i) => ({ ...c, id: `c${i}`, incident_id: "inc-1", created_at: NOW.toISOString() }));
    const g = buildGraph(incident(), [a, b], conflicts);
    const kinds = g.nodes.map((n) => n.kind);
    expect(kinds.filter((k) => k === "incident")).toHaveLength(1);
    expect(kinds.filter((k) => k === "report")).toHaveLength(2);
    expect(kinds.filter((k) => k === "location")).toHaveLength(1); // merged: within 120 m
    expect(kinds.filter((k) => k === "source")).toHaveLength(3); // voice, text, photo
    expect(g.edges.filter((e) => e.kind === "CONFLICTS_WITH")).toHaveLength(1);
    const ids = new Set(g.nodes.map((n) => n.id));
    for (const e of g.edges) {
      expect(ids.has(e.source)).toBe(true);
      expect(ids.has(e.target)).toBe(true);
    }
  });
});

describe("seed data", () => {
  it("contains a conflicting incident and valid references", () => {
    const seed = buildSeed(NOW);
    expect(seed.incidents.length).toBeGreaterThanOrEqual(4);
    expect(seed.contradictions.length).toBeGreaterThan(0);
    const reportIds = new Set(seed.reports.map((r) => r.id));
    for (const c of seed.contradictions) {
      expect(reportIds.has(c.report_a_id) && reportIds.has(c.report_b_id)).toBe(true);
    }
    // The KSRTC incident is the live-demo target: consistent so far, so the new report creates the conflict.
    const ksrtc = seed.contradictions.filter((c) => c.incident_id === seed.incidents[0].id);
    expect(ksrtc).toHaveLength(0);
  });
});
