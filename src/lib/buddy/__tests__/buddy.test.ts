import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const incidents = [
  { id: "i1", title: "Flooded road near KSRTC", category: "flood", latitude: 9.4937, longitude: 76.3318, status: "needs_verification", summary: "s", location_text: null, created_at: "2026-11-21T04:00:00Z", updated_at: "2026-11-21T05:00:00Z" },
  { id: "i2", title: "Far away", category: "flood", latitude: 9.4289, longitude: 76.4378, status: "new", summary: "", location_text: null, created_at: "2026-11-21T04:00:00Z", updated_at: "2026-11-21T05:00:00Z" },
];
const reports = [
  { id: "r1", incident_id: "i1", reported_at: "2026-11-21T06:00:00Z", reporter_name: "Secret Name", transcript: "private", photo_url: "p", audio_url: "a" },
  { id: "r2", incident_id: "i1", reported_at: "2026-11-21T07:00:00Z", reporter_name: null, transcript: null, photo_url: null, audio_url: null },
  { id: "r3", incident_id: "i2", reported_at: "2026-11-21T07:00:00Z", reporter_name: null, transcript: null, photo_url: null, audio_url: null },
];
vi.mock("@/lib/store", () => ({
  getStore: () => ({
    listIncidents: async () => incidents,
    listReports: async () => reports,
    listContradictions: async () => [{ incident_id: "i1", field: "roadStatus" }],
  }),
}));

import { findIncidentsInput } from "../schemas";
import { BuddyInputError, findIncidents } from "../incident-tool";
import { POST } from "@/app/api/agent/incidents/route";

describe("find_incidents input", () => {
  it("rejects excessive radius, half coordinates and missing location", () => {
    expect(findIncidentsInput.safeParse({ place: "ksrtc", radiusMeters: 50_000 }).success).toBe(false);
    expect(findIncidentsInput.safeParse({ latitude: 9.49 }).success).toBe(false);
    expect(findIncidentsInput.safeParse({}).success).toBe(false);
    expect(findIncidentsInput.safeParse({ latitude: 95, longitude: 76 }).success).toBe(false);
    expect(findIncidentsInput.parse({ place: "ksrtc" }).radiusMeters).toBe(1200);
  });
});

describe("findIncidents", () => {
  it("returns nearby incidents with counts, without private fields", async () => {
    const res = await findIncidents(findIncidentsInput.parse({ place: "near the KSRTC bus stand" }));
    expect(res.incidents.map((i) => i.id)).toEqual(["i1"]);
    expect(res.incidents[0]).toMatchObject({ reportCount: 2, conflictingFields: 1, latestReportAt: "2026-11-21T07:00:00Z", url: "/incidents/i1" });
    const json = JSON.stringify(res);
    for (const leak of ["Secret Name", "private", "photo_url", "audio_url"]) expect(json).not.toContain(leak);
    expect(res.limitations).toMatch(/does not mean a road is safe/);
  });

  it("returns an empty list, not an error, when nothing is nearby", async () => {
    const res = await findIncidents(findIncidentsInput.parse({ place: "kalarcode", radiusMeters: 300 }));
    expect(res.incidents).toEqual([]);
  });

  it("rejects unknown places and out-of-district coordinates", async () => {
    await expect(findIncidents(findIncidentsInput.parse({ place: "Mars" }))).rejects.toBeInstanceOf(BuddyInputError);
    await expect(findIncidents(findIncidentsInput.parse({ latitude: 12.9, longitude: 77.5 }))).rejects.toBeInstanceOf(BuddyInputError);
  });
});

describe("POST /api/agent/incidents", () => {
  const call = (headers: Record<string, string>, body: unknown = { place: "ksrtc" }) =>
    POST(new Request("http://x/api/agent/incidents", { method: "POST", headers, body: JSON.stringify(body) }));

  beforeEach(() => vi.unstubAllEnvs());

  it("fails closed when no secret is configured", async () => {
    vi.stubEnv("BUDDY_TOOL_SECRET", "");
    expect((await call({ authorization: "Bearer " })).status).toBe(401);
  });
  it("rejects a wrong secret and accepts the right one", async () => {
    vi.stubEnv("BUDDY_TOOL_SECRET", "s3cret");
    expect((await call({ authorization: "Bearer nope" })).status).toBe(401);
    expect((await call({ authorization: "Bearer s3cret" })).status).toBe(200);
  });
  it("returns 400 for invalid input and 422 for unknown places", async () => {
    vi.stubEnv("BUDDY_TOOL_SECRET", "s3cret");
    const h = { authorization: "Bearer s3cret" };
    expect((await call(h, { place: "ksrtc", radiusMeters: 99999 })).status).toBe(400);
    expect((await call(h, { place: "Mars" })).status).toBe(422);
  });
});
