<p align="center">
  <img src="public/brand/app-icon.png" alt="Backwater Trace icon" width="160" />
</p>

<h1 align="center">Backwater Trace</h1>

When people in Alappuzha describe the same flooded road differently, Backwater Trace maps their reports together and lets readers trace each claim to its source.

Built for *Place & People — The Alappuzha Challenge*, with Malayalam voice reporting for people who would rather speak than type.

- **Report from the scene:** type an observation or record it in Malayalam, review the transcript, place a pin, and optionally attach a photo.
- **Find related reports:** the incident engine compares category, distance, time, and wording before grouping reports on the map.
- **Inspect a disagreement:** follow a possible conflict about water depth or road access back to the original reports in the evidence graph. A flag asks for verification; it does not decide which report is true.

[Run locally](#run-locally) · [Try the demo](#try-the-ksrtc-flood-report) · [Architecture](#architecture) · [Incident engine](#incident-engine) · [Evidence graph](#evidence-graph) · [Configuration](#optional-services) · [Development](#development)

## Run locally

Use Node.js 24 LTS and pnpm 11.22.0. From the repository root:

```bash
pnpm install --frozen-lockfile
SUPABASE_URL='' SARVAM_MOCK=1 pnpm dev
```

Open [the dashboard](http://localhost:3000/dashboard). This command selects local storage and mock transcription even if you already have service keys configured. On first use, the app creates `.data/db.json` with synthetic incidents; you do not need to create an account or run a seed command.

## Try the KSRTC flood report

1. On the dashboard, open **Flooded road near Alappuzha KSRTC**. The seeded reports describe knee-deep water near the bus stand.
2. Open [the report form](http://localhost:3000/report), choose **Waist-deep at KSRTC (EN)**, review the location, and submit. On fresh demo data, the result groups this observation with the earlier reports.
3. Open the incident and select a source on the conflict card. Compare the original descriptions of water depth and road access rather than relying on the summary alone.

To inspect the dashboard data without the map, run this in a second terminal while the app is running:

```bash
curl --fail --silent --show-error http://localhost:3000/api/incidents
```

## Architecture

One Next.js app handles intake and serves the map. The browser never needs a Supabase or Sarvam key. The [store adapter](src/lib/store/index.ts) chooses where to keep records and attachments; switching stores does not change the matching rules.

```mermaid
flowchart TD
    form["Report form"] --> api["Next.js route handlers"]
    api -->|voice only| speech["Sarvam transcription or demo transcript"]
    api --> write["Report service"]
    write --> engine["Normalization, matching and conflict rules"]
    write --> store["Store adapter"]
    pages["Dashboard and incident detail"] --> read["Query service"]
    read --> store
    read --> evidence["Build evidence graph for one incident"]
    store -->|local| disk["JSON records and uploaded files"]
    store -->|hosted| cloud["Supabase Postgres and private evidence bucket"]
```

### From observation to report

Text and voice enter the same pipeline **after** the reporter reviews the form. Transcription alone does not create an incident.

```mermaid
sequenceDiagram
    actor Reporter
    participant Form as Report form
    participant API as Next.js API
    participant Service as Report service
    alt Malayalam voice
        Reporter->>Form: Record an observation
        Form->>API: POST /api/transcribe with audio
        API-->>Form: Transcript for review
    else Written report
        Reporter->>Form: Type an observation
    end
    Form->>API: POST /api/analyze with draft text
    API-->>Form: Suggested fields
    Reporter->>Form: Review details and confirm the pin
    Form->>API: POST /api/reports with optional media
    API->>Service: Pass validated fields and accepted files
    Service-->>API: Incident, match reasons, conflicts and warnings
    API-->>Form: Submission result
```

## Incident engine

The [report service](src/lib/services/create-report.ts) runs the rules in order. Matching asks **whether two reports describe the same event**. Conflict detection asks **where their accounts differ**. A pair can match on location and category while disagreeing about water depth.

```mermaid
flowchart TD
    input["Validated report"] --> normalize["Clean text and time; fill missing fields from text"]
    normalize --> media["Store optional photo or audio if available"]
    media --> score["Score each unresolved incident"]
    score --> decision{"Any score at or above threshold?"}
    decision -->|Yes| attach["Choose highest score; prefer nearer on a tie"]
    decision -->|No| create["Create an incident"]
    attach --> save["Save report with incident ID"]
    create --> save
    save --> compare["Compare with earlier reports in this incident"]
    compare --> flag["Record each differing pair of known values"]
    flag --> refresh["Refresh map position, summary and status"]
```

The [matcher](src/lib/engine/match-incidents.ts) adds the following points. With the default threshold of **7**, the same category within 500 m is sufficient (3 + 4); the same category within three hours is not (3 + 2).

| Signal | Points |
| --- | ---: |
| Same category, or flood paired with waterlogging | 3 |
| Within 500 m of the incident center or any of its reports | 4 |
| Within 3 hours of a report, or the incident update time if it has none | 2 |
| Keyword overlap of at least 0.2 (shared tokens divided by distinct tokens) | 2 |

The [conflict detector](src/lib/engine/detect-contradictions.ts) checks road access, water level, severity, and reported situation status. It skips a field if either value is missing or both agree. Each difference records the two report IDs, field, values, and reason. If observations are at least an hour apart, the reason notes that conditions may have changed.

## Evidence graph

The [storage schema](supabase/schema.sql) keeps observations separate from disagreements. Each contradiction references one incident and both source reports, so a reader can recover the original accounts behind a flag.

```mermaid
erDiagram
    INCIDENTS |o--o{ REPORTS : groups
    INCIDENTS ||--o{ CONTRADICTIONS : tracks
    REPORTS ||--o{ CONTRADICTIONS : report_a_id
    REPORTS ||--o{ CONTRADICTIONS : report_b_id
```

The [incident detail query](src/lib/services/queries.ts) loads those records for one incident. The [graph builder](src/lib/engine/build-graph.ts) turns them into React Flow nodes and edges on demand; there is no graph database. Here is a two-report example from the KSRTC scenario:

```mermaid
flowchart TD
    voice["Voice note"] -->|SUPPORTS| first["Report A: knee-deep"]
    text["Written account"] -->|SUPPORTS| second["Report B: waist-deep"]
    first -->|REPORTS| flood["Flooded road near Alappuzha KSRTC"]
    second -->|REPORTS| flood
    first -->|LOCATED_AT| pin["Bus stand pin"]
    second -->|LOCATED_AT| pin
    first -.->|CONFLICTS_WITH| second
```

Nearby reports can share a location node (within 120 m of an existing graph pin). One conflict edge connects each report pair and lists the disputed fields. Neither report replaces the other.

## Optional services

For persistent hosted storage, apply [the Supabase schema](supabase/schema.sql) to a dedicated project and configure the server variables below. For live Malayalam transcription, configure Sarvam and start with `pnpm dev` instead of the mock command. Use synthetic reports for demos: live transcription sends audio to Sarvam, and hosted evidence does not stay on the device.

Use [the environment template](.env.example) as a reference for `.env.local`. Keep keys server-side; none need a `NEXT_PUBLIC_` prefix.

| Variable | When to set it |
| --- | --- |
| `SUPABASE_URL` | Set with a server key to use Postgres and the private `evidence` storage bucket. Omit for local development. |
| `SUPABASE_SECRET_KEY` | Preferred server key for hosted storage. `SUPABASE_SERVICE_ROLE_KEY` is the legacy alternative. |
| `SUPABASE_DB_URL` | Direct Postgres connection for applying the schema outside the SQL editor; not needed by the app. |
| `SARVAM_API_KEY` | Required only for live speech-to-text. Text reports do not need a key. |
| `SARVAM_MOCK` | Set to `1` to return a canned Malayalam transcript instead of sending audio to Sarvam. |
| `SARVAM_STT_MODEL` / `SARVAM_LANGUAGE_CODE` | Override the transcription defaults, `saaras:v4` and `ml-IN`. |
| `MATCH_THRESHOLD` | Minimum score for grouping reports; defaults to `7`. |

**Reset warning:** `pnpm seed` replaces the selected store's incidents, reports, and conflict records with synthetic data. It targets Supabase when a URL and server key are configured. Use it only on disposable demo data.

## Development

Run the engine tests, TypeScript checks, and linter from the repository root:

```bash
pnpm test
pnpm typecheck
pnpm lint
```

See the [product requirements](docs/PRD.md), [architecture](docs/architecture.md), and [hackathon plan](backwater-trace-plan.md) for scope and design decisions.

## License

This repository does not specify a license.
