# AGENTS.md — Backwater Trace

This file defines how AI coding agents such as Devin should work on the repository.

Read these files before implementing major changes:

1. `README.md`
2. `PRD.md`
3. `architecture.md`
4. `plan.md`

## Mission

Build a complete 12-hour hackathon MVP of **Backwater Trace**.

The product is a web-based multilingual incident reporting and verification platform for Alappuzha.

Primary goals:

- map incidents,
- accept text/voice reports,
- use Sarvam for Malayalam transcription,
- group related reports,
- flag possible conflicts,
- preserve source reports,
- show an evidence graph.

## Hard Constraints

### Time

The MVP must remain finishable within 12 hours.

Do not add features simply because they are technically interesting.

### Architecture

Use:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Leaflet
- OpenStreetMap
- React Flow
- Supabase
- Sarvam AI
- Vercel

Do **not** add:

- Express server
- FastAPI
- Rust service
- Tauri
- microservices
- Redis
- Kafka
- graph database
- vector database
- custom ML training

unless explicitly approved.

## Implementation Priority

Follow this order:

1. project setup
2. Supabase schema
3. seed/demo data
4. dashboard + map
5. report form
6. Sarvam transcription
7. report persistence
8. incident matching
9. contradiction detection
10. incident detail view
11. evidence graph
12. polish
13. deploy

If a lower-priority feature threatens a higher-priority feature, cut the lower-priority feature.

## Coding Rules

### TypeScript

- strict mode
- avoid `any`
- use clear domain types
- validate all incoming API data with Zod

### React

- prefer small feature components
- do not put all logic in page components
- keep client components only where needed
- keep server-side operations server-side

### Next.js

- use App Router
- use route handlers or server actions appropriately
- never import server credentials into client components

### Supabase

- normal browser access uses anon credentials
- privileged operations use server-only utilities
- never expose the service role key
- storage bucket for evidence must be private

## Internal Engine

All incident logic belongs under:

```text
src/lib/engine/
```

Expected modules:

```text
normalize-report.ts
match-incidents.ts
detect-contradictions.ts
extract-details.ts
build-graph.ts
```

Do not create a separate engine process.

## Incident Matching Rules

Start deterministic.

Recommended scoring:

```text
same category     +3
within 500m       +4
within 3 hours    +2
similar keywords  +2
```

Use a configurable threshold.

Do not introduce embeddings unless the full MVP is already stable.

## Contradiction Rules

Only compare known structured values.

Initial fields:

- roadStatus
- waterLevel
- incidentStatus
- severity

Always label results as:

- possible conflict
- conflicting reports
- needs verification

Never label a report:

- fake
- false
- liar

## Sarvam Rules

Use Sarvam only through server-side code.

Flow:

```text
audio
→ /api/transcribe
→ Sarvam
→ transcript
→ user review
```

Requirements:

- user can edit transcript,
- failure should not block manual report entry,
- API key never reaches browser,
- do not store raw AI responses unless required.

## UI Rules

The primary screen is map-first.

Priority:

1. map
2. incident list
3. report workflow
4. contradiction card
5. graph

Avoid:

- generic chatbot UI
- excessive dashboards
- unnecessary charts
- overly decorative animation
- hidden core actions

## Demo Data

Use synthetic demo data only.

Recommended incidents:

- flooded road
- waterlogging
- blocked canal
- waste dumping

At least one demo incident must contain two source reports with a clear conflict.

## Privacy

This is a hosted web app.

Do not claim local-only processing.

Rules:

- private Supabase bucket
- no real private citizen data
- no secrets in frontend
- no secrets in git
- no PII in seed data
- no public evidence URLs by default

## API Expectations

### `/api/reports`

Must:

- validate input
- save files
- normalize
- match incident
- create/attach
- check contradictions
- return useful response

### `/api/transcribe`

Must:

- validate audio
- call Sarvam
- return transcript
- handle failure cleanly

### `/api/incidents`

Must return map-ready data.

### `/api/incidents/[id]`

Must return:

- incident
- reports
- contradictions
- graph data or enough data to build graph.

## Error Handling

Do not let optional functionality block core flows.

Examples:

- Sarvam fails → allow manual typing
- contradiction detection fails → save report
- photo upload fails → allow report without photo
- no incident match → create new incident

## Testing

Minimum tests:

### Unit

- incident matching
- distance calculation
- contradiction detection
- report normalization

### Integration

- create report
- attach to incident
- create new incident
- fetch incident detail

### Smoke

- dashboard loads
- report form submits
- voice transcription endpoint responds
- graph renders

## Pre-merge Checklist

Before claiming a task is complete:

- TypeScript builds
- lint passes
- affected tests pass
- no secrets were added
- no private evidence was added
- route works locally
- error state is handled
- UI is understandable without explanation

## Commands

Expected commands:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
pnpm test
```

Only report a command as passing if it was actually run.

## Devin Task Strategy

Prefer bounded tasks.

Good:

"Implement Leaflet incident map with markers and category filters."

Bad:

"Build the whole app."

Good:

"Implement deterministic incident matching in `src/lib/engine/match-incidents.ts` with unit tests."

Bad:

"Add AI intelligence."

## Final Demo Protection

During the last hour:

- do not refactor architecture,
- do not change database schema unless essential,
- do not add a new provider,
- do not add risky dependencies,
- do not redesign the UI,
- fix demo blockers only.

## Definition of Done

The repository is hackathon-ready only when:

- deployed app works,
- incidents load,
- map works,
- reports submit,
- Malayalam voice can transcribe,
- grouping works,
- conflict appears,
- source reports remain inspectable,
- graph works,
- no secret keys are exposed,
- the 90-second demo can be repeated reliably.
