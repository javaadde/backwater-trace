# PRD — Backwater Trace

## 1. Product Summary

Backwater Trace is a web-based incident reporting and verification platform for Alappuzha.

It is built for an overnight solo hackathon and is intentionally narrow.

The product helps users submit incident reports using text, Malayalam voice, photos, and location. It groups related reports into incidents, displays them on a map, and surfaces possible conflicting details while preserving source-level traceability.

## 2. Hackathon Track Fit

### Primary track

**Place & People — The Alappuzha Challenge**

The product addresses local issues affecting Alappuzha's people, infrastructure, and environment.

Example incident categories:

- flood
- waterlogging
- blocked canal
- waste dumping
- damaged road or infrastructure

### Secondary strength

**Voice & Language — Beyond English**

Sarvam AI is used for Malayalam speech-to-text so users can report incidents naturally in voice.

## 3. Problem

Local incident information often arrives through fragmented channels:

- messages,
- phone calls,
- voice notes,
- photos,
- informal reports,
- social posts,
- local groups.

Multiple people may describe the same incident differently.

This creates several problems:

1. duplicate reports,
2. inconsistent locations,
3. conflicting severity descriptions,
4. difficulty tracing claims back to their source,
5. slow understanding of what actually needs verification.

Backwater Trace is designed to organize these reports into a single inspectable view.

## 4. Product Goal

Provide a simple system that can:

- accept reports,
- understand Malayalam voice input,
- map incidents,
- group related reports,
- highlight possible conflicts,
- preserve original report sources,
- visually explain how reports relate.

## 5. Non-goals

Backwater Trace does not aim to:

- predict floods,
- replace emergency authorities,
- determine whether a reporter is truthful,
- issue authoritative emergency severity levels,
- perform law-enforcement investigations,
- analyze satellite imagery,
- identify people from images,
- build a full civic reporting platform,
- provide advanced real-time analytics.

## 6. Primary Users

### Citizen or volunteer reporter

Needs to quickly report an incident in Malayalam or English.

### Local coordinator

Needs to understand:

- what incidents are being reported,
- where they are,
- how many sources mention them,
- where reports disagree.

### Hackathon judge

Needs to understand the product value in under 90 seconds.

## 7. Core User Stories

### Report an incident

As a reporter, I want to submit text or voice so I can report an incident quickly.

Acceptance criteria:

- user can enter text,
- user can record voice,
- user can select location,
- user can optionally upload a photo,
- user can review the transcript,
- user can submit the report.

### View incidents on a map

As a coordinator, I want to see incidents on an Alappuzha map.

Acceptance criteria:

- each incident appears as a marker,
- selecting a marker shows a summary,
- filters can reduce visible incidents,
- user can open the incident details.

### Group reports

As a coordinator, I want multiple reports about the same event grouped together.

Acceptance criteria:

- matching uses simple category + location + time rules,
- system can attach a new report to an existing incident,
- new incident is created when no match passes the threshold.

### See possible contradictions

As a coordinator, I want to see where reports conflict.

Acceptance criteria:

- predefined structured fields are compared,
- system displays both source values,
- both reports are linked,
- UI says "possible conflict" or "needs verification",
- system does not claim one report is false.

### Inspect evidence graph

As a coordinator, I want to visually understand how reports connect to an incident.

Acceptance criteria:

- graph includes incident, report, location, and source nodes,
- graph is interactive,
- user can click a report node,
- graph remains simple enough to read.

## 8. Functional Requirements

### Dashboard

Must show:

- map,
- incident list,
- incident count,
- status filters,
- category filters,
- recent activity.

### Report submission

Must support:

- text,
- Malayalam voice,
- photo,
- location,
- timestamp.

### Voice transcription

Must:

- send audio through a server-side API route,
- call Sarvam using a server-side credential,
- return transcript,
- allow user correction before submission.

### Incident matching

MVP score:

```text
same category     +3
within 500m       +4
within 3 hours    +2
similar keywords  +2
```

Threshold is configurable.

### Contradiction detection

Initial fields:

- roadStatus
- waterLevel
- incidentStatus
- severity

The system only detects obvious categorical conflicts.

### Evidence graph

Generate graph data dynamically from normal relational data.

No graph database.

## 9. Data Model

### Incident

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

### Report

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

### Contradiction

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

## 10. UX Requirements

### Dashboard

The map should be the visual hero.

Desktop layout:

```text
incident sidebar | map
```

Secondary area:

```text
recent activity / verification warnings
```

### Incident page

Should show:

- incident title,
- map location,
- summary,
- status,
- source reports,
- possible contradictions,
- evidence graph.

### Report flow

Keep to approximately four steps:

1. describe,
2. locate,
3. attach,
4. review and submit.

## 11. Design Direction

The application should feel like a real operations dashboard.

Use:

- clean dark or neutral theme,
- strong typography,
- subtle depth,
- clear status chips,
- large map,
- readable cards,
- minimal visual noise.

Avoid:

- generic chatbot interface,
- excessive gradients,
- heavy glassmorphism,
- too many charts,
- decorative AI visuals.

## 12. Privacy and Safety Requirements

- private Supabase storage bucket,
- no secret keys client-side,
- no sensitive real-world demo data,
- synthetic hackathon dataset,
- AI output is advisory,
- contradictions are not truth judgments,
- no personal accusation language.

## 13. Success Criteria

The MVP is successful if the demo can show:

1. open map,
2. select incident,
3. create Malayalam voice report,
4. receive transcript,
5. submit report,
6. group it with existing incident,
7. show possible conflict,
8. inspect both sources,
9. open evidence graph.

## 14. 12-Hour Scope

### P0

- app shell
- Supabase
- demo data
- map
- report form
- Sarvam voice
- report persistence
- incident matching
- contradiction detection
- incident detail page
- graph
- deployment

### P1

Only if P0 is stable:

- translation,
- browser geolocation,
- heatmap,
- search,
- better mobile responsiveness.

### P2

After hackathon:

- OCR
- advanced semantic clustering
- multilingual translation pipeline
- moderation tools
- trusted reporter system
- push alerts
- analytics
- real-time data feeds.

## 15. Demo Script

### Opening

"Alappuzha receives reports about floods, blocked canals and waste from many different people and formats. The problem is understanding which reports describe the same incident and where information conflicts."

### Demo sequence

- open map,
- open an incident,
- show two linked reports,
- record Malayalam voice,
- transcribe with Sarvam,
- submit,
- show grouping,
- show possible contradiction,
- open sources,
- open evidence graph.

### Closing

"Backwater Trace doesn't decide the truth automatically. It helps people understand reports, their sources, and conflicts faster."

## 16. Definition of Done

Do not call the MVP done unless:

- Vercel deployment works,
- Supabase data loads,
- voice transcription works,
- new reports save,
- grouping works,
- contradiction UI works,
- graph works,
- no secret credentials are exposed,
- the 90-second demo can be repeated reliably.
