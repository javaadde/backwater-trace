import type { Category } from "@/types/domain";

/** Public origin of the deployment. Set NEXT_PUBLIC_SITE_URL to override (e.g. a custom domain). */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE = {
  name: "Backwater Trace",
  tagline: "Alappuzha, on the record.",
  description:
    "Backwater Trace maps incident reports from Alappuzha (flood, waterlogging, blocked canals, waste, damaged roads), groups reports about the same event, and flags possible conflicts between sources, with every claim traceable to its original report. Malayalam voice reporting via Sarvam AI.",
  short:
    "Multilingual incident reporting and verification for Alappuzha: group related reports, see possible conflicts, trace every claim to its source.",
  repo: "https://github.com/javaadde/backwater-trace",
  hackathon: "Place & People — The Alappuzha Challenge",
  keywords: [
    "Backwater Trace",
    "Alappuzha",
    "Alleppey",
    "Kerala",
    "flood reporting",
    "incident reporting",
    "crowdsourced verification",
    "Malayalam voice",
    "Sarvam AI",
    "evidence graph",
    "civic tech",
    "hackathon",
  ],
  locale: "en_IN",
} as const;

export const STACK = [
  "Next.js 16 (App Router) and React 19",
  "TypeScript and Tailwind CSS 4",
  "Leaflet and react-leaflet for the incident map",
  "React Flow (@xyflow/react) for the evidence graph",
  "Sarvam AI (saaras:v4) for Malayalam speech-to-text, called server-side only",
  "Supabase Postgres and private storage, or a local JSON store for development",
  "Zod for validation, Vitest for engine tests",
] as const;

export const ROUTES = [
  { path: "/", name: "Introduction", what: "Product thesis, a live miniature of the incident board, and a worked example of one incident with two conflicting sources." },
  { path: "/dashboard", name: "Incident board", what: "Map plus incident list with filters; each incident shows report count and any possible conflicts." },
  { path: "/report", name: "Report an incident", what: "Four-step form: describe (type or Malayalam voice), locate on map, attach a photo, review and submit." },
  { path: "/incidents/{id}", name: "Incident detail", what: "Summary, status, every source report, conflict cards comparing the two accounts side by side, and the evidence graph." },
  { path: "/about", name: "About", what: "Full project description for people and AI agents: problem, approach, engine rules, stack, limits." },
  { path: "/llms.txt", name: "llms.txt", what: "Plain-text project summary for AI agents; /llms-full.txt has the full detail." },
  { path: "/api/incidents", name: "Incidents API", what: "JSON list of incidents with report and conflict counts." },
] as const;

export const ENGINE_RULES = [
  { signal: "Same category (flood and waterlogging count as the same)", points: 3 },
  { signal: "Within 500 m of the incident centre or any of its reports", points: 4 },
  { signal: "Within 3 hours of a report", points: 2 },
  { signal: "Keyword overlap of at least 0.2", points: 2 },
] as const;

export const MATCH_THRESHOLD_DEFAULT = 7;

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "flood", label: "Flooded road" },
  { id: "waterlogging", label: "Waterlogging" },
  { id: "blocked_canal", label: "Blocked canal" },
  { id: "waste_dumping", label: "Waste dumping" },
  { id: "damaged_infrastructure", label: "Damaged infrastructure" },
  { id: "other", label: "Other issue" },
];

export const FAQ = [
  {
    q: "What problem does Backwater Trace solve?",
    a: "When several people describe the same flooded road or blocked canal in Alappuzha, their accounts are scattered and sometimes disagree. Backwater Trace groups them into one incident on a map and shows exactly where the accounts differ, so a coordinator knows what to verify first.",
  },
  {
    q: "Does it decide which report is true?",
    a: "No. A flag means 'possible conflict, needs verification'. Both original reports stay visible side by side, and the product never accuses a reporter or calls a report false.",
  },
  {
    q: "How are reports grouped?",
    a: `A rule-based matcher scores each new report against open incidents: same category (3 points), within 500 m (4), within 3 hours (2), shared keywords (2). A score of ${MATCH_THRESHOLD_DEFAULT} or more attaches the report to the best-scoring incident; otherwise a new incident is created.`,
  },
  {
    q: "How are conflicts detected?",
    a: "Reports in the same incident are compared on road access, water level, severity and situation status. A field is skipped if either value is missing or both agree. Each difference records both report IDs, the field, the two values and a reason.",
  },
  {
    q: "Does it support Malayalam?",
    a: "Yes. Reporters can record a Malayalam voice note; it is transcribed by Sarvam AI (saaras:v4), shown for review and editing, and only then submitted. Malayalam text renders in the Chilanka typeface.",
  },
  {
    q: "Is this a working product or a prototype?",
    a: "The product is fully working, but the sample incidents pre-loaded on first run are synthetic: no real people or real incidents. No usage numbers, partners or endorsements are claimed.",
  },
  {
    q: "What does it not do?",
    a: "It does not predict floods, replace authorities, judge reporter truthfulness or identify people. Matching and conflict detection are rule-based, not machine-learned.",
  },
] as const;

/** Escape for embedding JSON in a <script> tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
