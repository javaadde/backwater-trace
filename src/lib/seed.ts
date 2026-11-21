import type { Category, Contradiction, Incident, IncidentStatus, Report } from "@/types/domain";
import { normalizeReport, type ReportInput } from "@/lib/engine/normalize-report";
import { detectContradictions } from "@/lib/engine/detect-contradictions";
import { centroid, summarizeIncident } from "@/lib/engine/summarize";

/**
 * Synthetic demo dataset. No real people or events. Timestamps are relative
 * to `now` so "recent" matching rules behave the same whenever you seed.
 */
interface SeedIncident {
  n: number;
  title: string;
  category: Category;
  status: IncidentStatus;
  locationText: string;
  reports: (Omit<ReportInput, "reportedAt"> & { minutesAgo: number })[];
}

const SEED: SeedIncident[] = [
  {
    n: 1,
    title: "Flooded road near Alappuzha KSRTC",
    category: "flood",
    status: "needs_verification",
    locationText: "Alappuzha KSRTC",
    reports: [
      {
        minutesAgo: 55,
        sourceType: "voice",
        description: "ഇവിടെ കെഎസ്ആർടിസി ബസ് സ്റ്റാൻഡിന് അടുത്ത് റോഡിൽ മുട്ടോളം വെള്ളമുണ്ട്. വാഹനങ്ങൾ പോകാൻ ബുദ്ധിമുട്ടാണ്.",
        transcript: "ഇവിടെ കെഎസ്ആർടിസി ബസ് സ്റ്റാൻഡിന് അടുത്ത് റോഡിൽ മുട്ടോളം വെള്ളമുണ്ട്. വാഹനങ്ങൾ പോകാൻ ബുദ്ധിമുട്ടാണ്.",
        latitude: 9.4939,
        longitude: 76.3321,
      },
      {
        minutesAgo: 34,
        sourceType: "text",
        description: "Knee-deep water on the road outside the KSRTC bus stand. Buses are moving very slowly, difficult for two-wheelers.",
        latitude: 9.4933,
        longitude: 76.3313,
        reporterName: "Ward volunteer",
      },
    ],
  },
  {
    n: 2,
    title: "AC Road flooding at Pallathuruthy",
    category: "flood",
    status: "needs_verification",
    locationText: "Pallathuruthy",
    reports: [
      {
        minutesAgo: 80,
        sourceType: "voice",
        description: "പള്ളാത്തുരുത്തി ഭാഗത്ത് എസി റോഡിൽ അരയോളം വെള്ളം കയറി, ഗതാഗതം നിലച്ചു.",
        transcript: "പള്ളാത്തുരുത്തി ഭാഗത്ത് എസി റോഡിൽ അരയോളം വെള്ളം കയറി, ഗതാഗതം നിലച്ചു.",
        latitude: 9.4765,
        longitude: 76.3651,
      },
      {
        minutesAgo: 41,
        sourceType: "text",
        description: "AC road at Pallathuruthy is flooded at waist level but one lane is partially open for trucks and buses.",
        latitude: 9.4759,
        longitude: 76.3662,
      },
    ],
  },
  {
    n: 3,
    title: "Vadai Canal choked near Mullakkal",
    category: "blocked_canal",
    status: "needs_verification",
    locationText: "Vadai Canal",
    reports: [
      {
        minutesAgo: 150,
        sourceType: "text",
        description: "Vadai canal near Mullakkal is choked with water hyacinth and plastic. Water is not flowing at all.",
        latitude: 9.4997,
        longitude: 76.3345,
        severity: "moderate",
      },
      {
        minutesAgo: 108,
        sourceType: "voice",
        description: "വാടക്കനാലിൽ പോളയും പ്ലാസ്റ്റിക്കും നിറഞ്ഞ് ഒഴുക്ക് നിലച്ചു. ഇപ്പോഴും വൃത്തിയാക്കിയിട്ടില്ല.",
        transcript: "വാടക്കനാലിൽ പോളയും പ്ലാസ്റ്റിക്കും നിറഞ്ഞ് ഒഴുക്ക് നിലച്ചു. ഇപ്പോഴും വൃത്തിയാക്കിയിട്ടില്ല.",
        latitude: 9.5002,
        longitude: 76.3338,
        severity: "moderate",
        situationStatus: "ongoing",
      },
    ],
  },
  {
    n: 4,
    title: "Waterlogging on Thathampally road",
    category: "waterlogging",
    status: "needs_verification",
    locationText: "Thathampally",
    reports: [
      {
        minutesAgo: 190,
        sourceType: "text",
        description: "Waterlogging on the Thathampally road for two days. Stagnant water still rising near houses.",
        latitude: 9.5084,
        longitude: 76.3369,
        severity: "moderate",
      },
      {
        minutesAgo: 62,
        sourceType: "text",
        description: "Thathampally waterlogging is receding now, only minor water left on the road edge.",
        latitude: 9.5079,
        longitude: 76.3377,
      },
    ],
  },
  {
    n: 5,
    title: "Garbage dumped beside beach road",
    category: "waste_dumping",
    status: "new",
    locationText: "Alappuzha Beach",
    reports: [
      {
        minutesAgo: 240,
        sourceType: "text",
        description: "Large pile of garbage dumped beside the beach road near the old pier. Smell is spreading.",
        latitude: 9.4911,
        longitude: 76.3176,
        severity: "moderate",
      },
    ],
  },
  {
    n: 6,
    title: "Pothole on NH near Kalarcode junction",
    category: "damaged_infrastructure",
    status: "verified",
    locationText: "Kalarcode",
    reports: [
      {
        minutesAgo: 380,
        sourceType: "text",
        description: "Big pothole on the NH near Kalarcode junction, two-wheelers swerving into traffic.",
        latitude: 9.4634,
        longitude: 76.3352,
        severity: "high",
      },
    ],
  },
  {
    n: 7,
    title: "Waste near Punnamada jetty",
    category: "waste_dumping",
    status: "resolved",
    locationText: "Punnamada",
    reports: [
      {
        minutesAgo: 1260,
        sourceType: "text",
        description: "Waste dumped near Punnamada jetty, blocking the walkway.",
        latitude: 9.5106,
        longitude: 76.3544,
        severity: "low",
      },
      {
        minutesAgo: 600,
        sourceType: "voice",
        description: "പുന്നമട ജെട്ടിക്കടുത്തുള്ള മാലിന്യം നഗരസഭ നീക്കം ചെയ്തു.",
        transcript: "പുന്നമട ജെട്ടിക്കടുത്തുള്ള മാലിന്യം നഗരസഭ നീക്കം ചെയ്തു.",
        latitude: 9.5109,
        longitude: 76.3549,
        severity: "low",
        situationStatus: "cleared",
      },
    ],
  },
];

const hex = (prefix: string, n: number) => `${prefix}-0000-4000-8000-${String(n).padStart(12, "0")}`;

export function buildSeed(now: Date): { incidents: Incident[]; reports: Report[]; contradictions: Contradiction[] } {
  const incidents: Incident[] = [];
  const reports: Report[] = [];
  const contradictions: Contradiction[] = [];
  let reportN = 0;
  let conflictN = 0;

  for (const s of SEED) {
    const incidentId = hex("11111111", s.n);
    const incReports: Report[] = [];
    for (const r of s.reports) {
      reportN++;
      const reportedAt = new Date(now.getTime() - r.minutesAgo * 60_000).toISOString();
      const normalized = normalizeReport({ ...r, category: s.category, locationText: s.locationText, reportedAt }, now);
      const report: Report = {
        ...normalized,
        id: hex("22222222", reportN),
        incident_id: incidentId,
        created_at: reportedAt,
        photo_url: null,
        audio_url: null,
      };
      for (const c of detectContradictions(report, incReports)) {
        conflictN++;
        contradictions.push({ ...c, id: hex("33333333", conflictN), incident_id: incidentId, created_at: reportedAt });
      }
      incReports.push(report);
    }
    reports.push(...incReports);
    const first = incReports[0];
    const last = incReports[incReports.length - 1];
    const base = { category: s.category, location_text: s.locationText };
    incidents.push({
      id: incidentId,
      title: s.title,
      ...base,
      ...centroid(incReports),
      status: s.status,
      summary: summarizeIncident(base, incReports, contradictions.filter((c) => c.incident_id === incidentId)),
      created_at: first.reported_at,
      updated_at: last.reported_at,
    });
  }
  return { incidents, reports, contradictions };
}
