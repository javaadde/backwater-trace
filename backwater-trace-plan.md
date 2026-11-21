# Backwater Trace — 12-Hour Hackathon Build Plan

> **Primary Track:** Place & People — The Alappuzha Challenge  
> **Secondary Strength:** Voice & Language — Sarvam AI  
> **Build Style:** Web app, solo, overnight hackathon  
> **Goal:** Deliver a polished, working MVP in 12 hours without a separate backend service.

---

## 1. Product Idea

**Backwater Trace** is a multilingual incident reporting and verification platform for Alappuzha.

Citizens or local volunteers can submit reports about issues such as:

- Flooded roads
- Waterlogging
- Waste dumping
- Blocked canals
- Damaged local infrastructure
- Other location-based public issues

Reports can contain:

- Malayalam or English text
- Malayalam voice recordings
- Photos
- Location
- Time

The system groups related reports into incidents, shows them on a map, and highlights useful patterns such as:

- Multiple reports about the same incident
- Conflicting details
- Missing information
- Source links back to the original report

The main purpose is **not to automatically decide what is true**. It helps people inspect and compare reports faster.

---

## 2. Hackathon Goal

The final demo should show this complete flow:

1. A user submits a Malayalam voice report.
2. Sarvam converts the voice to text.
3. The app extracts the basic incident details.
4. The report appears on the Alappuzha incident map.
5. Another related report is added.
6. The system groups them into the same incident.
7. A conflicting detail is detected.
8. The user opens the incident and sees all supporting sources.
9. The evidence graph visually connects Incident → Reports → Location → Sources.

Use **synthetic/demo data** prepared before judging.

---

## 3. Must-Build Features

### Incident Dashboard
- Alappuzha map
- Incident markers
- Incident count
- Recent reports
- Filters
- Incident status: New / Needs verification / Verified / Resolved

### Submit Report
- Text report
- Voice recording
- Photo upload
- Location selection
- Optional reporter name
- Timestamp

### Malayalam Voice Input
Use **Sarvam AI** for speech-to-text.

```text
Voice recording
    ↓
Next.js API
    ↓
Sarvam AI
    ↓
Transcript
    ↓
User confirms transcript
    ↓
Report saved
```

The user must be able to edit the transcript before submission.

### Incident Matching
Do not build an ML clustering system.

Use simple rules:

```text
same category
+
nearby location
+
similar time
=
possible same incident
```

### Contradiction Detection
Compare a few predefined fields such as:

```text
roadStatus
waterLevel
incidentStatus
severity
```

Example:

```text
Report A: road blocked
Report B: road partially open
```

Display this as a **possible conflict**, never as proof that one source is false.

### Interactive Map
Use:
- Leaflet
- OpenStreetMap

Show:
- Markers
- Category/status
- Popup summary
- Open incident action

### Evidence Graph
Use React Flow.

Node types:
- Incident
- Report
- Location
- Source

Keep the graph small and incident-focused.

---

## 4. Features NOT to Build in 12 Hours

Do not spend hackathon time on:

- Separate Rust backend
- Separate Python backend
- Microservices
- Tauri desktop app
- Real-time flood prediction
- Satellite data
- OCR
- Advanced image recognition
- Autonomous agents
- Enterprise auth/roles
- Push notifications
- Native mobile apps
- Offline sync
- Blockchain
- Vector databases
- Custom ML training

---

## 5. Architecture

Use one deployable Next.js application.

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
└── Storage
```

**No separate API server is required.**

Next.js acts as:
- Frontend
- API server
- Backend logic layer

---

## 6. Technology Stack

| Area | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI components | shadcn/ui |
| Map | Leaflet + OpenStreetMap |
| Graph | React Flow |
| Database | Supabase PostgreSQL |
| File storage | Supabase Storage |
| Voice AI | Sarvam AI |
| Hosting | Vercel |
| Development assistance | Devin |
| Icons | Lucide |
| Validation | Zod |

---

## 7. Project Structure

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
│   │   └── client.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── validation/
└── types/
```

`lib/engine/` contains the app's investigation logic, but it is **not** a separate service.

---

## 8. Database Design

### reports

```text
id
incident_id
title
description
original_language
translated_text
latitude
longitude
category
reported_at
created_at
photo_url
audio_url
transcript
road_status
water_level
severity
```

### incidents

```text
id
title
category
latitude
longitude
status
summary
created_at
updated_at
```

### contradictions

```text
id
incident_id
report_a_id
report_b_id
field
value_a
value_b
reason
created_at
```

---

## 9. Supabase Setup

Create:
- `reports`
- `incidents`
- `contradictions`

Create a **private** Storage bucket:

```text
evidence
```

Store:
- Photos
- Voice recordings

For the demo, auth can be skipped if necessary.

If auth is skipped:
- Never expose Supabase service credentials to the browser.
- Perform privileged operations through Next.js server routes.

---

## 10. API Routes

### `POST /api/reports`

Responsibilities:
1. Validate input
2. Store uploaded files
3. Normalize report
4. Find matching incident
5. Create or attach incident
6. Run contradiction checks
7. Return report + incident

### `POST /api/transcribe`

```text
audio
→ Sarvam
→ Malayalam transcript
→ return transcript
```

Keep the Sarvam API key server-side.

### `POST /api/analyze`

Input:
```text
report text
```

Output:
```json
{
  "category": "flood",
  "severity": "moderate",
  "locationText": "near XYZ junction",
  "roadStatus": "blocked"
}
```

Start with keyword/rule extraction. Use AI only if needed.

### `GET /api/incidents`

Returns map-ready incident data.

### `GET /api/incidents/:id`

Returns:
- Incident
- Reports
- Contradictions
- Evidence graph data

---

## 11. Internal Incident Engine

### `normalize-report.ts`
- Clean text
- Normalize category
- Normalize timestamps
- Normalize structured incident fields

### `match-incidents.ts`

Example score:

```text
same category               +3
within 500 metres           +4
within 3 hours              +2
similar keywords            +2
```

If score passes a threshold:
```text
attach report to existing incident
```

Otherwise:
```text
create new incident
```

### `detect-contradictions.ts`

Compare:
- `roadStatus`
- `waterLevel`
- `incidentStatus`
- `severity`

### `build-graph.ts`

Convert incident data to:

```ts
{
  nodes: [],
  edges: []
}
```

No graph database is needed.

---

## 12. UI Pages

### `/`
Landing page:
- Product name
- One-line pitch
- View Live Incidents
- Report an Incident

### `/dashboard`

Primary screen:

```text
┌─────────────────────────────────────────────┐
│ Backwater Trace              Report Issue  │
├───────────────┬─────────────────────────────┤
│               │                             │
│ Incident list │        Alappuzha Map        │
│               │                             │
├───────────────┴─────────────────────────────┤
│ Recent activity / verification warnings     │
└─────────────────────────────────────────────┘
```

### `/report`

Steps:
```text
1. Voice or text
2. Location
3. Photo
4. Review
5. Submit
```

### `/incidents/[id]`

Show:
- Incident summary
- Location
- Reports
- Possible contradictions
- Evidence graph
- Original sources

---

## 13. 12-Hour Build Schedule

### Hour 0–1 — Setup
- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- Supabase
- Environment variables
- Base layout

**Deliverable:** app runs locally.

### Hour 1–2 — Database + Demo Data
- Supabase tables
- Private storage bucket
- 8–12 synthetic Alappuzha reports
- 3–4 incidents

Suggested demo incidents:
- Flooded road
- Waste dumping
- Blocked canal
- Waterlogging

**Deliverable:** dashboard can fetch data.

### Hour 2–4 — Map Dashboard
- Leaflet
- Alappuzha map
- Incident markers
- Sidebar
- Filters
- Marker popups

**Deliverable:** working visual incident dashboard.

### Hour 4–5.5 — Report Submission
- Form
- Location picker
- Photo upload
- Text report
- Save to Supabase

**Deliverable:** new reports appear.

### Hour 5.5–7 — Sarvam Voice
- Browser recording
- Upload to Next.js
- Sarvam transcription
- Editable transcript
- Submit as report

**Deliverable:** Malayalam voice → incident report.

### Hour 7–8 — Incident Matching
Implement:
```text
category + distance + time
```

**Deliverable:** related reports automatically group.

### Hour 8–9 — Contradictions
Compare structured fields.

**Deliverable:** visible conflict cards with both source reports.

### Hour 9–10 — Evidence Graph
- React Flow
- Incident/report/location/source nodes
- Basic edges

**Deliverable:** interactive incident graph.

### Hour 10–11 — Polish
- Typography
- Loading states
- Empty states
- Animations
- Responsive layout
- Fix broken flows

Do not add major features.

### Hour 11–12 — Deployment + Demo
- Deploy to Vercel
- Verify environment variables
- Test Sarvam
- Test storage
- Rehearse demo
- Take screenshots
- Record a backup demo video if possible

Do not add risky features in the final hour.

---

## 14. Demo Dataset

Use synthetic reports only.

### Report A

```text
Location:
Near Alappuzha KSRTC

Category:
Flood

Malayalam voice:
"ഇവിടെ റോഡിൽ മുട്ടോളം വെള്ളമുണ്ട്. വാഹനങ്ങൾ പോകാൻ ബുദ്ധിമുട്ടാണ്."

Structured:
waterLevel = knee
roadStatus = difficult
```

### Report B

```text
Same area

Text:
"Water has reached waist level and the road appears completely blocked."

Structured:
waterLevel = waist
roadStatus = blocked
```

Expected behavior:
1. Group both reports
2. Flag conflicting water-level information
3. Show both sources

---

## 15. 90-Second Judge Demo

### 0–15 seconds
Explain the problem:

> Alappuzha receives flood, canal and waste reports from different people and formats. The difficult part is understanding which reports describe the same incident and where information conflicts.

### 15–30 seconds
Show the map and open an incident with multiple reports.

### 30–50 seconds
Record a Malayalam voice report, transcribe with Sarvam, edit if needed, and submit.

### 50–65 seconds
Show that it was grouped into an existing incident.

### 65–80 seconds
Show a possible contradiction and open both original sources.

### 80–90 seconds
Open the evidence graph.

Finish with:

> Backwater Trace doesn't decide the truth automatically. It helps people understand reports, their sources, and conflicts faster.

---

## 16. Design Direction

Aim for a real operations dashboard.

Use:
- Dark neutral background
- Large map
- Clean cards
- Minimal gradients
- Strong typography
- Clear status badges
- Smooth panel transitions

Avoid:
- Generic chatbot UI
- Too many charts
- Huge landing pages
- Excessive glow effects

The map and report workflow are the hero.

---

## 17. Privacy and Safety

Because this is a hosted web app:

- Do **not** claim evidence stays fully local.
- Keep uploads in private storage.
- Use synthetic demo reports.
- Do not expose Sarvam or Supabase service keys client-side.
- Treat AI analysis as suggestions.
- Do not call reporters liars because two reports conflict.
- Do not present severity classifications as authoritative emergency decisions.

Use labels such as:
- Possible conflict
- Needs verification
- Reported by multiple sources
- Unverified report

---

## 18. Devin Task Breakdown

### Task 1
Create the Next.js structure, design system, Supabase utilities, and dashboard shell.

### Task 2
Implement the Leaflet Alappuzha incident map with markers, filters, and sidebar.

### Task 3
Implement report submission with photo upload and location.

### Task 4
Implement Sarvam voice transcription through a server-only Next.js route.

### Task 5
Implement incident matching using category + geographic distance + time.

### Task 6
Implement structured contradiction detection.

### Task 7
Implement the React Flow evidence graph.

Keep tasks bounded and merge after each working vertical slice.

---

## 19. Definition of Done

The MVP is complete when:

- Website is deployed
- Dashboard loads
- Map displays incidents
- User can submit a report
- Malayalam voice can become text
- Report saves successfully
- Related reports can be grouped
- At least one contradiction is detected
- Incident page shows original reports
- Evidence graph works
- Demo works reliably
- No secret keys are exposed

Anything beyond this is optional.

---

## 20. Stretch Features

Only after the full demo is stable:

1. Malayalam ↔ English translation
2. Browser geolocation
3. Incident heatmap
4. Verification votes
5. Missing-information prompts
6. Search
7. Mobile UI polish

---

## 21. Final Stack

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Leaflet
OpenStreetMap
React Flow
Supabase PostgreSQL
Supabase Storage
Sarvam AI
Vercel
Devin
```

No dedicated Python backend.  
No dedicated Rust backend.  
No separate investigation microservice.

For the hackathon, **Next.js is both the frontend and API/backend layer**, while `lib/engine` holds the internal investigation logic.

---

## 22. Core Rule

If a feature risks preventing the full demo from working within 12 hours:

**cut the feature.**

A small product with a complete story is stronger than a large product with half-working features.
