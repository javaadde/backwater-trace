---
name: Backwater Trace
description: Multilingual incident reporting and verification for Alappuzha, drawn as a printer's exposure record.
colors:
  zone-0-ink: "#0c1110"
  zone-1: "#1a201f"
  zone-2: "#29302e"
  zone-3: "#3b4341"
  zone-4-muted-ink: "#4f5856"
  zone-5: "#666f6c"
  zone-6-strong-rule: "#848c89"
  zone-7: "#a4aba8"
  zone-8-hairline: "#c3c9c6"
  zone-9-sunk-paper: "#dde2df"
  zone-10-paper: "#f5f7f6"
  backlit-ground: "#e7ebe9"
  paper-2: "#eef1ef"
  faint-ink: "#5d6663"
  canal-teal: "#2fc5a8"
  canal-teal-hover: "#45d3b8"
  canal-teal-press: "#27b096"
  deep-canal: "#0b3b35"
  canal-text: "#0b7563"
  safelight: "#c0392b"
  safelight-on-ink: "#ff8a7a"
  fault-red: "#b4231a"
  amber-check: "#8f5508"
  amber-check-tint: "#f6ead6"
  verified-green: "#1d7a4c"
  verified-green-tint: "#e1efe6"
  survey-blue: "#285f93"
  cat-flood: "#285f93"
  cat-waterlogging: "#2b7f86"
  cat-blocked-canal: "#4a7434"
  cat-waste-dumping: "#94650f"
  cat-damaged-infrastructure: "#6a4f8c"
  cat-other: "#5d6663"
typography:
  display:
    fontFamily: "Antonio, Geist, sans-serif"
    fontSize: "96px"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Antonio, Geist, sans-serif"
    fontSize: "48px"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "0.01em"
  title:
    fontFamily: "Antonio, Geist, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.02em"
  body:
    fontFamily: "Geist, Noto Sans Malayalam, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "\"ss01\", \"cv11\""
  body-dense:
    fontFamily: "Geist, Noto Sans Malayalam, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.375
  label:
    fontFamily: "Antonio, Geist, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.12em"
  data:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: "\"tnum\""
  malayalam:
    fontFamily: "Noto Sans Malayalam, Geist, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.625
rounded:
  none: "0px"
  sm: "2px"
  md: "3px"
  lg: "4px"
  full: "9999px"
spacing:
  hair: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  record-rail: "360px"
  ledger-rail: "320px"
components:
  button-primary:
    backgroundColor: "{colors.canal-teal}"
    textColor: "{colors.deep-canal}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.canal-teal-hover}"
  button-primary-active:
    backgroundColor: "{colors.canal-teal-press}"
  button-ink:
    backgroundColor: "{colors.zone-0-ink}"
    textColor: "{colors.zone-10-paper}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  button-ink-hover:
    backgroundColor: "{colors.zone-2}"
  button-secondary:
    backgroundColor: "{colors.zone-10-paper}"
    textColor: "{colors.zone-0-ink}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  button-secondary-hover:
    backgroundColor: "{colors.zone-9-sunk-paper}"
  button-ghost:
    textColor: "{colors.zone-4-muted-ink}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  button-ghost-hover:
    backgroundColor: "{colors.zone-9-sunk-paper}"
    textColor: "{colors.zone-0-ink}"
  input:
    backgroundColor: "{colors.zone-10-paper}"
    textColor: "{colors.zone-0-ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "40px"
  select:
    backgroundColor: "{colors.zone-10-paper}"
    textColor: "{colors.zone-0-ink}"
    rounded: "{rounded.sm}"
    padding: "0 28px 0 8px"
    height: "30px"
  segmented-tab:
    textColor: "{colors.zone-4-muted-ink}"
    typography: "{typography.body-dense}"
    padding: "0 10px"
    height: "28px"
  segmented-tab-selected:
    backgroundColor: "{colors.zone-0-ink}"
    textColor: "{colors.zone-10-paper}"
  status-tag-new:
    backgroundColor: "{colors.zone-10-paper}"
    textColor: "{colors.zone-0-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: "20px"
    padding: "0 6px"
  status-tag-needs-verification:
    backgroundColor: "{colors.amber-check-tint}"
    textColor: "{colors.amber-check}"
    rounded: "{rounded.sm}"
    height: "20px"
  status-tag-verified:
    backgroundColor: "{colors.verified-green-tint}"
    textColor: "{colors.verified-green}"
    rounded: "{rounded.sm}"
    height: "20px"
  status-tag-resolved:
    backgroundColor: "{colors.zone-9-sunk-paper}"
    textColor: "{colors.zone-4-muted-ink}"
    rounded: "{rounded.sm}"
    height: "20px"
  incident-row:
    backgroundColor: "{colors.zone-10-paper}"
    textColor: "{colors.zone-0-ink}"
    padding: "14px 16px"
  incident-row-selected:
    backgroundColor: "{colors.zone-0-ink}"
    textColor: "{colors.zone-10-paper}"
  record-sheet:
    backgroundColor: "{colors.zone-10-paper}"
    textColor: "{colors.zone-0-ink}"
    rounded: "{rounded.none}"
    padding: "16px"
  top-bar:
    backgroundColor: "{colors.zone-0-ink}"
    textColor: "{colors.zone-10-paper}"
    height: "56px"
    padding: "0 16px"
---

# Design System: Backwater Trace

## Overview

**Creative North Star: "The Exposure Record"**

Every incident is a stack of source sheets on a printer's light table. The interface is a cool, backlit neutral ground built from one eleven-step zone ramp, from zone 0 ink to zone X paper, with each sheet edged in a hairline ink rule and cut with square corners. Labels are condensed, tracked capitals, the way a darkroom log is lettered. Times, counts and coordinates are set in tabular mono because they are readings, not prose.

Disagreement is drawn, never colored alone. Each source value carries its own hatch angle; where two sources disagree their hatches cross at ninety degrees, and that crossing is printed in safelight red. Selection inverts a sheet to the deepest zone, the way a negative reads. A single glowing accent, Canal Teal, is reserved for the action that moves the work forward and for live state. Everything else is ink on paper.

The world replaced an earlier dark "Night" operations look. It refuses the dark neon ops dashboard and the grey SaaS board: density comes from ruled ledgers and hairlines, not from cards, glows or gradients.

**Key Characteristics:**
- One zone ramp (z0 to z10, tinted toward Deep Canal) supplies every neutral.
- Hairline ink rules (1px zone 0) bound sheets; inner divisions use the lighter hairline (zone 8).
- Square sheets; controls take a barely-there 2px corner.
- Antonio condensed caps for headings and legends, Geist for reading, Geist Mono tabular for readings.
- Canal Teal is the only glowing color; safelight red is the only alarm color, and it always travels with the cross-hatch.
- Selected means inverted to zone 0.

## Colors

A monochrome zone ramp carries the whole interface; two saturated voices, teal and safelight red, each own exactly one meaning.

### Primary
- **Canal Teal** (`canal-teal`): the brand color from the Canal B mark. Fills the primary button ("Report incident", "Open the incident board", "Open sources and evidence"), the live-refresh dot, the active step number in the report stepper, the highlight ring around a jumped-to source, and the selection ring in the evidence graph. Text on it is always Deep Canal. Hover lightens (`canal-teal-hover`), press deepens (`canal-teal-press`).
- **Deep Canal** (`deep-canal`): the ink of the logo mark; the text color and 1px border on every teal fill.
- **Canal Text** (`canal-text`): the teal darkened for legible type on paper, used for the "Live" legend and the caret.

### Secondary
- **Safelight** (`safelight`): possible conflict, and nothing else. Conflict card borders, the "Possible conflict" legend, conflict counts, conflicting fact chips, flagged evidence-graph nodes, and the crossed-hatch ring around map pins.
- **Safelight on Ink** (`safelight-on-ink`): the same meaning lifted for legibility when a conflicted row is inverted to zone 0.

### Tertiary
- **Amber Check** (`amber-check`, tint `amber-check-tint`): the "Needs verification" status tag.
- **Verified Green** (`verified-green`, tint `verified-green-tint`): the "Verified" status tag and the verified count.
- **Fault Red** (`fault-red`): system errors only: the load-error strip, the destructive button, the recording pulse in the voice recorder. Never a conflict.
- **Category inks** (`cat-flood` survey blue, `cat-waterlogging` lagoon, `cat-blocked-canal` paddy green, `cat-waste-dumping` ochre, `cat-damaged-infrastructure` violet, `cat-other` faint ink): fill the 20px category tiles and map pin cores, with white glyphs. They identify kind, not urgency.

### Neutral
- **Zone 0 Ink** (`zone-0-ink`): body text, the 1px sheet rule, the top bar, selected rows, selected tabs, focus outline, text selection background.
- **Zone 4 Muted Ink** (`zone-4-muted-ink`): secondary text and ghost buttons.
- **Faint Ink** (`faint-ink`): timestamps, placeholders, attribution.
- **Zone 6 Strong Rule** (`zone-6-strong-rule`): borders of quieter sheets (source report cards, empty states, unverified-source tags).
- **Zone 7** (`zone-7`): muted text on ink (clock, inverted metadata, logo tagline).
- **Zone 8 Hairline** (`zone-8-hairline`): inner dividers between rows and fields.
- **Zone 9 Sunk Paper** (`zone-9-sunk-paper`): hover fill, resolved tags, map ground.
- **Zone 10 Paper** (`zone-10-paper`): every sheet and panel.
- **Backlit Ground** (`backlit-ground`): the page under the sheets.
- **Paper 2** (`paper-2`): dimmed incident rows when another row is selected or the incident is resolved.

### Named Rules
**The Safelight Rule.** Safelight red means "possible conflict" and nothing else, and it never appears without the 90° cross-hatch beside or inside it. A conflict must read in grayscale.

**The One Glow Rule.** Canal Teal appears only on the primary action and on live or highlighted state. If two teal fills compete in one viewport, one of them is wrong.

**The Zone Ramp Rule.** Every neutral comes from the eleven-step ramp. New greys are not invented; pick the nearest zone.

## Typography

**Display Font:** Antonio (with Geist, sans-serif)
**Body Font:** Geist (with Noto Sans Malayalam, ui-sans-serif, system-ui)
**Label/Mono Font:** Geist Mono (with ui-monospace)
**Malayalam:** Noto Sans Malayalam, set one step larger (16px) than English body in source quotes.

**Character:** Antonio's tall condensed capitals letter the record like a darkroom log; Geist reads plainly underneath; Geist Mono turns every time, count and coordinate into a tabular reading. Body text uses Geist stylistic sets ss01 and cv11.

### Hierarchy
- **Display** (Antonio 600, 56px / 84px / 96px by breakpoint, 0.95, uppercase): the landing statement only.
- **Headline** (Antonio 600, 40px to 48px, 1.02, uppercase, balanced): page titles: incident title, "Report an incident".
- **Title** (Antonio 600, 22px to 28px, 1.0, uppercase): sheet titles and the values sources disagree on ("Blocked", "Partially open"), the board title, the submit confirmation.
- **Body** (Geist 400, 15px, 1.625): summaries and source quotes, max 60 to 68ch.
- **Body dense** (Geist 500 to 600, 13px to 14px): row titles, list items, chips; 12px to 12.5px for supporting notes.
- **Label** (Antonio 500, 12px, 0.12em tracking, uppercase): the "legend" voice. Section headings (Summary, Record, Recent activity), nav items, field names in a sheet, stepper steps. Drops to 10.5px to 11px for field names and tags.
- **Data** (Geist Mono 11px to 15px, tabular figures): times, counts (zero-padded "02"), coordinates, match scores, step numbers.

### Named Rules
**The Legend Rule.** Labels that name a field, a section or a nav destination are Antonio caps with wide tracking. Sentences are never set in legend caps.

**The Reading Rule.** Anything that is a measurement (time, count, coordinate, score) is Geist Mono with tabular figures.

## Layout

The dashboard is a three-rail ledger under a 56px ink top bar and a single ruled command row: a 360px incident record on the left, the map filling the centre, a 320px ledger (record counts, possible conflicts, recent activity) on the right. The right rail appears at 1280px; below 1024px the rails stack to one column. The incident page is a two-column split at 1024px (sheets on the left, a sticky evidence graph on the right, 1.15fr) inside a 1400px container; the report form is a single 768px column; the landing page is a 1280px container with a 1.05fr / 1fr split.

Spacing follows a 4px base. Sheets pad 16px (20px in the report form, 24px for the confirmation sheet); row padding is 14px by 16px; header strips are 10px by 16px. Lists are ruled with zone 8 hairlines rather than spaced apart; stacked sheets sit 12px to 24px apart. Segmented controls are a single ruled strip whose segments share 1px zone 0 dividers.

## Elevation & Depth

The record is flat. Depth is carried by rules and by inversion: a sheet is a zone 10 panel edged in zone 0, and the selected thing turns zone 0. Shadows appear only where paper physically lifts off the table or floats over the map: the landing page's stacked source sheets, map overlays and popups, the evidence-graph root node, and map pins.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 10px 30px rgb(12 17 16 / 0.12)`): the lead record sheet on the landing page.
- **Source sheet lift** (`box-shadow: 0 6px 18px rgb(12 17 16 / 0.14)`): tilted source sheets stacked under it.
- **Map overlay** (`box-shadow: 0 2px 6px rgb(12 17 16 / 0.12)` to `0 2px 8px`): zoom and layer controls, the map legend.
- **Map popup** (`box-shadow: 0 8px 20px rgb(12 17 16 / 0.18)`): Leaflet popups.
- **Graph root** (`box-shadow: 0 4px 12px rgb(12 17 16 / 0.25)`): the inked incident node in the evidence graph.
- **Pin rings** (`box-shadow: 0 0 0 2px #f5f7f6, 0 0 0 3px #0c1110, 0 3px 8px rgb(12 17 16 / 0.3)`): paper-and-ink ring on every pin; the ink ring widens to 5px when selected.
- **Highlight ring** (`box-shadow: 0 0 0 3px` Canal Teal): a source card jumped to from the graph.

### Named Rules
**The Flat Ledger Rule.** Panels, rows and cards in the working views carry no shadow. Lift is earned only by paper floating over something: a stacked sheet, a map overlay, a popup.

## Shapes

Sheets, panels, rows, conflict cards and source cards are square (0px). Interactive controls take a barely perceptible 2px corner (buttons, inputs, selects, status tags, category tiles, count flags); popups take 3px. Circles are reserved for things on the map and for live state: pins, legend dots, the live pulse, the voice-record button.

The hatch is the recurring form. A 45° single hatch (1px line, 5px pitch) marks "one source" and completed steps; a dense hatch (3px pitch) marks "stacked"; the 90° cross-hatch marks a possible conflict. Source value strips print their own angle (45°, -45°, 0°, 90°) so two disagreeing values read as crossing lines. Source counts are drawn as five "stop" cells (5px by 12px, 2px apart) filled in zone 1, one per independent source.

## Components

### Buttons
Ruled and plain: an inked edge, a flat fill, no lift.
- **Shape:** 2px corner; heights 32px (sm), 36px (md), 44px (lg) with 12px to 20px side padding and a 16px icon.
- **Primary:** Canal Teal fill, Deep Canal text and 1px border, semibold. The single forward action in a view.
- **Ink:** zone 0 fill, paper text; hover to zone 2.
- **Secondary:** paper fill, 1px zone 0 border, ink text; hover to zone 9.
- **Ghost:** muted ink text, no border; hover to ink text on zone 9.
- **Danger:** fault red fill, white text; hover brightens.
- **Hover / Focus:** 150ms color transition; focus is a 2px zone 0 outline at 2px offset; disabled drops to 45% opacity.

### Status tags
- **Style:** Antonio caps at 11px with 0.08em tracking, 20px tall, 2px corner, 1px border in the status color over its tint. New is ink on paper; Needs verification is amber; Verified is green; Resolved is muted ink on sunk paper.
- **State:** on an inverted row the tag inverts too (zone 1 fill, zone 5 border, paper text). Status reads by its text, never by color alone.

### Cards / Containers (sheets)
- **Corner Style:** square.
- **Background:** zone 10 paper on the backlit ground.
- **Shadow Strategy:** none in working views (see Flat Ledger Rule).
- **Border:** 1px zone 0 for primary sheets; 1px zone 6 for quieter source cards; 1px safelight for conflict cards.
- **Internal Padding:** 16px; header strips 10px by 16px with a hairline below; an ink header strip (zone 0) labels a record sheet.

### Inputs / Fields
- **Style:** paper fill, 1px zone 0 border, 2px corner, 40px tall in forms and 30px in the command row; placeholder in faint ink. Native selects are re-skinned with an ink chevron and hover to zone 9.
- **Focus:** the global 2px zone 0 outline at 2px offset; the caret is Canal Text.

### Navigation
- **Style:** a 56px zone 0 top bar with the Canal B logo, legend-caps nav items in zone 7, the IST clock in mono, and the teal "Report incident" button at the right. The active item is a zone 1 cell framed by zone 3 side rules with paper text. Back links on inner pages are legend caps with an arrow. Below 768px the nav and clock hide; the logo and primary action remain.

### Incident row (signature)
A ruled ledger row: 20px category tile, 14px semibold title with a mono relative time, location in 12px muted text, then a line of status tag, source stops and, when conflicted, the cross-hatch swatch with "N possible conflicts". Selecting a row inverts it to zone 0 and reveals a full-width teal "Open sources and evidence" button; the other rows dim to paper 2.

### Conflict card (signature)
A safelight-bordered sheet headed by the cross-hatch swatch and a "Possible conflict" legend plus the field name. Each disagreeing value sits on its own sheet: a hatch strip at that value's angle, the value in Antonio 26px caps, then buttons for each source. With two values a cross-hatched strip sits between them. A closing note states that a conflict is a prompt to verify, not a verdict.

### Map pin (signature)
A round pin filled with the category ink, white count, a paper ring and an ink ring. Pin size follows the source count. A possible conflict adds a cross-hatched safelight ring around the pin; resolved pins turn to paper with muted text; unselected pins dim to 45% when one is selected. Map tiles are printed monochrome (grayscale, slight contrast drop).

### Motion
Sheets settle into place: a 520ms 8px rise on `cubic-bezier(0.16, 1, 0.3, 1)`, content visible from the first frame, with optional tilt and staggered delays for stacked sheets. Pins scale and fade over 220ms. All of it is removed under reduced motion.

## Do's and Don'ts

### Do:
- **Do** take every neutral from the zone ramp (z0 to z10) and keep sheets as zone 10 paper on the backlit ground.
- **Do** pair every use of safelight red with the 90° cross-hatch (`hatch-cross`), so a conflict reads without color.
- **Do** show selection by inverting to zone 0 with paper text and zone 7 metadata.
- **Do** set field names, section headings and nav in Antonio caps at 12px with 0.12em tracking, and every time, count and coordinate in Geist Mono tabular.
- **Do** draw source counts as stop cells and disagreements as hatch angles rather than adding new badges.
- **Do** keep sheets square with a 1px rule; give controls the 2px corner.
- **Do** honour reduced motion by dropping the settle animation and pin transitions.

### Don't:
- **Don't** use safelight red for errors, destructive actions or recording; that is fault red's job.
- **Don't** put Canal Teal on anything but the primary action and live or highlighted state.
- **Don't** return to the dark neon ops dashboard or the grey SaaS board this world replaced: no dark page ground, no glowing panels, no soft rounded cards.
- **Don't** add drop shadows to panels, rows or cards in working views.
- **Don't** set sentences in legend caps, or put decorative eyebrow labels above headlines; the only caps line above a page title is a back link, which is navigation.
- **Don't** recolor or redraw the Canal B logo; its master artwork lives in `docs/brand/`.
