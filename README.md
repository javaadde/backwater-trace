# Backwater Trace

**A multilingual, evidence-backed incident reporting and verification platform for Alappuzha.**

Backwater Trace is a hackathon web application designed for the **Place & People — The Alappuzha Challenge** track, with a strong secondary fit for **Voice & Language** through Sarvam AI.

The product helps people submit local incident reports in text or voice, groups related reports into incidents, shows them on a map, and highlights conflicting information with source-level traceability.

## Core idea

Alappuzha can receive multiple reports about the same local issue:

- flooded roads
- waterlogging
- blocked canals
- waste dumping
- infrastructure problems

The difficulty is not just collecting reports. It is understanding:

- which reports refer to the same incident,
- where those reports happened,
- whether two reports disagree,
- and what source each claim came from.

Backwater Trace turns those reports into a structured, visual incident view.

## Hackathon positioning

**Primary track:** Place & People — The Alappuzha Challenge  
**Secondary strength:** Voice & Language — Sarvam AI

The project focuses on a practical local problem and uses Malayalam voice interaction as a meaningful accessibility feature rather than a decorative AI add-on.

## MVP

The 12-hour MVP includes:

- Alappuzha incident map
- report submission
- Malayalam voice recording
- Sarvam speech-to-text
- photo upload
- location selection
- simple incident matching
- possible contradiction detection
- incident detail pages
- source-linked reports
- React Flow evidence graph
- Supabase persistence
- Vercel deployment

## Not in MVP

To keep the build finishable in 12 hours, Backwater Trace does **not** include:

- separate Rust or Python backend
- native mobile app
- Tauri desktop app
- real-time flood prediction
- OCR
- satellite analysis
- custom ML training
- graph database
- autonomous agents
- advanced computer vision
- enterprise user roles
- offline sync

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI | shadcn/ui |
| Map | Leaflet + OpenStreetMap |
| Evidence graph | React Flow |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Voice AI | Sarvam AI |
| Validation | Zod |
| Hosting | Vercel |
| AI coding support | Devin |

## Architecture

```text
Browser
   │
   ▼
Next.js
├── React UI
├── Route Handlers / Server Actions
├── Internal incident engine
├── Sarvam integration
└── Supabase access
        │
        ▼
Supabase
├── PostgreSQL
└── Private Storage
```

There is no separate application backend for the hackathon MVP.

Next.js serves both the frontend and API/backend responsibilities.

The internal incident logic lives in:

```text
src/lib/engine/
```

This keeps the project simple now while allowing the logic to be moved into a dedicated service later if needed.

## Main user flow

```text
Submit report
   ↓
Voice or text
   ↓
Sarvam transcription if needed
   ↓
User reviews transcript
   ↓
Report is normalized
   ↓
Incident matching
   ↓
Report is attached to an existing incident
or a new incident is created
   ↓
Contradiction checks run
   ↓
Incident appears on map
   ↓
User can inspect reports + evidence graph
```

## Suggested project structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── dashboard/
│   ├── report/
│   ├── incidents/
│   │   └── [id]/
│   └── api/
│       ├── reports/
│       ├── incidents/
│       ├── transcribe/
│       └── analyze/
│
├── components/
│   ├── dashboard/
│   ├── map/
│   ├── graph/
│   ├── reports/
│   └── ui/
│
├── lib/
│   ├── engine/
│   │   ├── normalize-report.ts
│   │   ├── match-incidents.ts
│   │   ├── detect-contradictions.ts
│   │   ├── extract-details.ts
│   │   └── build-graph.ts
│   ├── sarvam/
│   ├── supabase/
│   └── validation/
│
└── types/
```

## Environment variables

Copy `.env.example` to `.env.local`. All variables are server-only; the browser never talks to Supabase or Sarvam directly.

```env
SUPABASE_URL=                 # blank → local JSON store in .data/ (dev only)
SUPABASE_SERVICE_ROLE_KEY=
SARVAM_API_KEY=
SARVAM_STT_MODEL=saaras:v4
SARVAM_LANGUAGE_CODE=ml-IN
SARVAM_MOCK=0                 # 1 = canned Malayalam transcript (rehearsal / backup)
MATCH_THRESHOLD=7
```

- never expose `SUPABASE_SERVICE_ROLE_KEY` or `SARVAM_API_KEY` in client code,
- privileged operations run in Next.js route handlers (`src/app/api/*`).

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # engine unit tests (vitest)
pnpm lint
pnpm build
pnpm seed         # reset to the synthetic demo dataset (Supabase if configured, else .data/db.json)
```

With no Supabase variables set, the app runs immediately on a local JSON store that seeds itself on first request. Delete `.data/` or run `pnpm seed` to reset.

### Supabase setup

1. Create a project, open the SQL editor, run `supabase/schema.sql` (tables, indexes, RLS on, private `evidence` bucket).
2. Put `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (and in Vercel project settings).
3. `pnpm seed`. Re-run shortly before the demo: seed timestamps are relative to "now".

### Demo rehearsal

1. `/dashboard`: open **Flooded road near Alappuzha KSRTC** (2 consistent reports: knee-deep, difficult to pass).
2. `/report`: record in Malayalam, e.g. *"കെഎസ്ആർടിസി ബസ് സ്റ്റാൻഡിന് അടുത്ത് അരയോളം വെള്ളം കയറി, റോഡ് പൂർണ്ണമായും ബ്ലോക്ക് ആണ്."* The landmark is detected and the pin placed automatically.
   No mic or network? Use the **Waist-deep at KSRTC** sample chip, or set `SARVAM_MOCK=1`.
3. Submit. The success screen shows it was grouped (match score + reasons) and which details now conflict.
4. Open the incident: grouped conflict cards → click a report chip → the source card highlights → evidence graph.

## Demo

The demo should use synthetic data.

Example:

**Report A**
- flooded road
- near Alappuzha KSRTC
- Malayalam voice
- knee-high water
- road difficult to use

**Report B**
- same area
- waist-high water
- road fully blocked

Expected result:

- reports are grouped under one incident,
- the app flags a possible conflict,
- both original sources remain visible,
- the incident is shown on the map,
- the evidence graph links the incident and its reports.

## Product language

Use cautious language:

- Possible conflict
- Needs verification
- Unverified report
- Reported by multiple sources

Avoid language such as:

- confirmed false
- fake report
- liar
- guaranteed severity
- authoritative emergency decision

## Privacy

This is a hosted web application, so do **not** claim that all evidence stays local.

For the hackathon:

- use synthetic reports,
- keep storage buckets private,
- avoid personally identifying demo data,
- keep secret keys server-side,
- treat AI outputs as suggestions.

## Definition of done

The hackathon MVP is complete when:

- the website is deployed,
- the map works,
- reports can be submitted,
- Malayalam voice can be transcribed,
- related reports can be grouped,
- a possible contradiction can be shown,
- incident details retain their source reports,
- the evidence graph works,
- the full demo can run reliably.

See:

- [`plan.md`](../backwater-trace-plan.md)
- [`PRD.md`](PRD.md)
- [`architecture.md`](architecture.md)
- [`AGENTS.md`](AGENTS.md)
