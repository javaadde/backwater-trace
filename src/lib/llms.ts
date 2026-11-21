import { CATEGORIES, ENGINE_RULES, FAQ, MATCH_THRESHOLD_DEFAULT, ROUTES, SITE, STACK, siteUrl } from "@/lib/site";

export function buildLlmsTxt(): string {
  const base = siteUrl();
  return `# ${SITE.name}

> ${SITE.description}

Built for "${SITE.hackathon}" (hackathon). Source code: ${SITE.repo}
This is a complete, working product: voice transcription, matching, conflict detection, maps, evidence graph and storage all run for real. Only the pre-loaded sample incidents are synthetic (no real people or incidents). No usage numbers, partners or endorsements are claimed.

## Pages
${ROUTES.filter((r) => !r.path.includes("{")).map((r) => `- [${r.name}](${base}${r.path}): ${r.what}`).join("\n")}

## Full detail
- [Full project description for agents](${base}/llms-full.txt): problem, approach, engine rules, stack, walkthrough, limits, live incident list.
- [Repository README](${SITE.repo}#readme): run locally, architecture diagrams, configuration.

## Optional
- [Sitemap](${base}/sitemap.xml)
`;
}

export function buildLlmsFull(incidents: { id: string; title: string; category: string; reports: number; conflicts: number }[]): string {
  const base = siteUrl();
  return `# ${SITE.name} — full project description

${SITE.description}

- Production URL: ${base}
- Source code: ${SITE.repo}
- Hackathon / track: ${SITE.hackathon} (secondary strength: Voice & Language with Sarvam AI)
- Status: working product. Sample incidents pre-loaded for first use are synthetic; anything submitted is stored and processed by the real pipeline.

## The problem
When people in Alappuzha describe the same flooded road or blocked canal differently, the accounts are scattered and a coordinator cannot tell which incidents are well-sourced or where sources disagree.

## The solution
1. A reporter types an observation or records a Malayalam voice note, reviews the transcript, places a pin and optionally attaches a photo.
2. A rule-based incident engine compares the new report with existing incidents and groups reports about the same event.
3. Reports in one incident are compared on structured fields; differences become "possible conflicts" shown side by side.
4. An evidence graph per incident links the incident, each report, its location and its source, with dashed conflict edges.

Principle: provenance over verdicts. The product never decides which report is true and never accuses a reporter.

## Categories
${CATEGORIES.map((c) => `- ${c.label}`).join("\n")}

## Incident matching (rule-based)
A new report is scored against each unresolved incident. Threshold: ${MATCH_THRESHOLD_DEFAULT} (configurable via MATCH_THRESHOLD).
${ENGINE_RULES.map((r) => `- ${r.signal}: ${r.points} points`).join("\n")}
Same category within 500 m (3 + 4) is enough to group; same category within 3 hours alone (3 + 2) is not. The highest score wins; nearer wins ties.

## Conflict detection
Checked fields: road access, water level, severity, situation status. A field is skipped if either value is missing or both agree. Each difference records both report IDs, the field, both values and a reason. If observations are 1+ hours apart the reason notes conditions may have changed.

## Pages and routes
${ROUTES.map((r) => `- ${r.path} — ${r.name}: ${r.what}`).join("\n")}

## Tech stack
${STACK.map((s) => `- ${s}`).join("\n")}

## Architecture
One Next.js app handles intake and serves the map. Route handlers (/api/transcribe, /api/analyze, /api/reports, /api/incidents) call a report service that normalizes, matches and detects conflicts, then persists through a store adapter (local JSON in development, Supabase Postgres plus a private evidence bucket when configured). Sarvam and Supabase keys are server-only and never reach the browser. The evidence graph is built on demand from stored records; there is no graph database.

## Try it (about 90 seconds)
1. Open ${base}/dashboard and select "Flooded road near Alappuzha KSRTC" (seeded reports: knee-deep water).
2. Open ${base}/report, record a Malayalam voice note or choose a sample, review the transcript and location, submit.
3. The new report is grouped into the existing incident; a possible conflict on water depth or road access appears.
4. Open the incident, compare both sources on the conflict card, open the evidence graph.

## Accessibility and language
Malayalam is first-class (Chilanka typeface, lang="ml" markup). Status and category never rely on colour alone.

## Limits (stated honestly)
- Matching and conflict detection are rule-based, not ML.
- No flood prediction, no authority integration, no reporter-trust scoring.
- Sample incidents are synthetic. Live transcription sends audio to Sarvam and hosted evidence is stored off-device, so avoid sensitive personal content.

## FAQ
${FAQ.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}

## Current incidents (live)
${incidents.length ? incidents.map((i) => `- ${base}/incidents/${i.id} — ${i.title} [${i.category}], ${i.reports} report(s), ${i.conflicts} disputed field(s)`).join("\n") : "- (none available)"}
`;
}
