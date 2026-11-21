---
version: 1
slug: "src-app-dashboard-page-tsx"
primary_target: "src/app/dashboard/page.tsx"
related_targets: ["src/app/page.tsx","src/app/report/page.tsx","src/app/incidents/[id]/page.tsx"]
---

# Surface brief: Backwater Trace web app (dashboard, incident detail, report flow, landing)

Scope: /dashboard (Operate, primary), /incidents/[id] (Operate), /report (Operate, phone-first), / (Persuade). One visual world across all four.
Audience/job: coordinator triaging grouped incident reports and possible conflicts; reporter submitting on a phone; judge grasping value in 90s.
Constraints: Canal B logo untouched; brand colours Canal Teal #2FC5A8 / Deep Canal #0B3B35; "possible conflict", never a verdict; synthetic data labelled; status/category never colour-only.
Chosen: Exposure Record (catalog operate-b-exposure-record-zone-sheets), chosen by the user over the roll. Translation: the dichroic magenta accent becomes Canal Teal (brand commitment); darkroom safelight red marks conflict, always paired with the 90° cross-hatch.

## Direction contract

THESIS: The incident board is a printer's exposure record: every incident is a stack of source sheets, and where two sheets disagree their hatches cross at ninety degrees. Refuses the dark neon ops dashboard (the old look) and the grey SaaS board.

OWN-WORLD: Cool backlit neutral ground on an eleven-step zone ramp (zone 0 ink to zone X white), hairline ink rules, square corners. Condensed tracked caps (Antonio) for legends and headings, Geist for body, Geist Mono tabular for times, counts, coordinates. One glowing accent, Canal Teal, for the primary action and live state only. Safelight red plus cross-hatch for possible conflicts. Selected = deepest zone (inverted row).

STORY: Coordinator sees open incidents and which carry crossed hatches, selects one, reads both source values side by side, opens the sources and the evidence graph; reporter speaks Malayalam, corrects transcript, pins location, submits and learns how it was grouped.

FIRST VIEWPORT: Dashboard: ink top bar with logo, nav, teal "Report incident". Left 360px record: status tabs, category filter, incident rows (stop-delta style source count, hatch swatch for conflict, inverted when selected). Map fills centre in a monochrome zone-ramp tile skin with hatch-ringed pins. Right 320px: overview counts, possible conflicts, recent activity.

FORM: Exposure Record challenger, adopted by the user (not on my grounded list; the roll assigned list item 4, coir). seed:2877d3f57f24c3b6

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
