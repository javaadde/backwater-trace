---
version: 1
slug: "src-app-dashboard-page-tsx"
primary_target: "src/app/dashboard/page.tsx"
related_targets: ["src/app/page.tsx","src/app/report/page.tsx","src/app/incidents/[id]/page.tsx"]
---

# Surface brief: Backwater Trace web app (landing, dashboard, incident record, report flow)

Scope: / (Persuade), /dashboard (Operate, primary), /incidents/[id] (Operate), /report (Operate, phone-first). One visual world across all four.
Audience/job: coordinator triaging grouped incident reports and possible conflicts; reporter submitting on a phone outdoors; judge grasping value in 90s.
Constraints: drop-and-canal logo untouched (docs/brand/final/); Instrument Serif for big headings (user pin); "possible conflict", never a verdict; synthetic data labelled; status and category never colour-only; must not read as vibe-coded.
Chosen: Lexicon and Plate (catalog rw-lexicon-shoulder-and-plate), adopted by the user over the roll (the roll assigned the snake-boat heat sheet). Accent left to the direction: ultramarine, echoing the logo's blue drop. New look and layout allowed; every route, field and handler stays.

## Direction contract

THESIS: Backwater Trace is a lexicon of Alappuzha's incidents: each incident is an entry, its source reports are numbered citations, and a disagreement is a variant reading set side by side in engraver's cross-hatch. Refuses the grey SaaS board, the dark ops screen and the previous Exposure Record darkroom.

OWN-WORLD: Engraving black on uncoated stock, hairline and double rules, square corners. Colour only inside bordered plates: the map, product screens, category inks (ultramarine, viridian, emerald, chrome ochre, violet, sepia). Ultramarine is the one action colour; vermilion plus cross-hatch means possible conflict and nothing else. Instrument Serif for heads, entry titles and guide words; Geist for working text; Chilanka; tabular figures for readings. Controls framed with a double rule.

STORY: The coordinator reads open entries, sees which carry variant readings, opens one, compares cited sources, then the evidence graph; the reporter files an entry in Malayalam or English and sees which entry it joined; the judge reads one entry on the landing page and understands provenance.

FIRST VIEWPORT: Landing: thin masthead (logo, guide words "first entry / last entry", links, ultramarine Report button); left shoulder index of incident kinds; centre "Alappuzha, on the record." at display scale over a double rule, one line, two actions; right Plate I, the incident board screen in a bordered plate with numbered captions. Dashboard: same masthead; left entry list headed by live guide words; map as a framed plate; right record column.

FORM: Lexicon and Plate, a catalog challenger the user adopted (not on my grounded list; the roll assigned list item 3, the snake-boat heat sheet). seed:a367c26e13500fb4. Signature move: guide words at the head of the entry list recomputed from the first and last entry in view as it scrolls.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
