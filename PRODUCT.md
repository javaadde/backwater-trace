# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: local coordinator** in Alappuzha (district office, panchayat, NGO or volunteer desk). Their job: see what incidents are being reported, where, how many independent sources mention each one, and where those sources disagree, so they know what to verify first. Design decisions favour this user.
- **Reporter:** a resident or volunteer on a phone, often outdoors or in rain, reporting a flood, waterlogging, blocked canal, waste dumping or damaged road in Malayalam voice or English text.
- **Hackathon judge:** must grasp the product's value in under 90 seconds of demo.

## Product Purpose

Backwater Trace collects incident reports (text, Malayalam voice via Sarvam AI, photo, location), groups reports that describe the same incident, maps them, and flags possible conflicts between sources, while keeping every claim linked to its original report. Success: a coordinator can go from "map" to "which two sources disagree, and what exactly did each say" in a few clicks.

## Positioning

It does not decide truth. It shows provenance and disagreement: each incident is a bundle of traceable source reports, and conflicts on structured fields (road status, water level, incident status, severity) are shown side by side as "possible conflict / needs verification", never as a verdict.

## Operating Context

- Alappuzha district: backwaters, canals, paddy polders below sea level, monsoon flooding; Malayalam and English both in daily use.
- Coordinators work at a desk on a laptop; reporters on phones in the field.
- Demo flow (PRD §13): open map → select incident → record Malayalam voice report → transcript → submit → grouped into existing incident → possible conflict shown → inspect both sources → open evidence graph.

## Capabilities and Constraints

- Routes: `/` (intro), `/dashboard` (map + incident list + filters + verification warnings), `/report` (~4 steps: describe, locate, attach, review), `/incidents/[id]` (summary, status, sources, conflicts, evidence graph).
- Categories: flood, waterlogging, blocked canal, waste dumping, damaged infrastructure, other.
- Matching is rule-based (category + distance + time + keywords). Contradiction detection is categorical only.
- Stack: Next.js 16 (app router), React 19, Tailwind 4, Leaflet maps, React Flow graph, Supabase or local JSON store.
- Non-goals: flood prediction, replacing authorities, judging reporter truthfulness, identifying people.

## Brand Commitments

- Name: **Backwater Trace**. Logo: "Canal B" (a bold B split by a wavy canal). Masters in `docs/brand/kit/`; guidelines in `docs/brand/README.md` (clear space, minimum sizes, no recolouring outside palette, no logo on busy map tiles without a solid container).
- Brand colours: Canal Teal `#2FC5A8`, Deep Canal `#0B3B35`. Wordmark set in Red Hat Display ExtraBold (outlined; don't retype).
- Voice: neutral and careful. Say "possible conflict" or "needs verification"; never accuse a reporter or call a report false.

## Evidence on Hand

- Synthetic demo dataset (`src/lib/seed.ts`, `.data/db.json`). Must be labelled as synthetic; no real people or real incidents.
- No testimonials, partners, usage numbers or official endorsements exist. Do not invent any.

## Product Principles

1. Provenance over verdicts: every claim stays one click from its source.
2. Disagreement is information, shown plainly and side by side.
3. Malayalam is first-class, not a translation afterthought.
4. The map is the main view; everything else answers "what is happening here?".
5. Calm under pressure: dense, readable, no alarmism.

## Accessibility & Inclusion

- Bilingual text (Malayalam + English) must render well; Noto Sans Malayalam is in use.
- Status and category must not rely on colour alone (field use in sun/rain, colour-blind coordinators).
