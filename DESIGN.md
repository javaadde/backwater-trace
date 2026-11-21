---
name: Backwater Trace
description: Multilingual incident reporting and verification for Alappuzha, set as a lexicon with engraved plates.
colors:
  stock-paper: "#f7f3ea"
  stock-paper-2: "#efe9dc"
  stock-paper-3: "#e6dece"
  engraving-black: "#1a1712"
  ink-2: "#3f392f"
  ink-muted: "#665e50"
  hairline: "#d6cdba"
  rule-strong: "#b3a993"
  ultramarine: "#24428f"
  ultramarine-hover: "#2d52a8"
  ultramarine-press: "#1b3374"
  ultramarine-tint: "#e2e4ec"
  vermilion: "#b8361f"
  danger: "#8f1d1d"
  danger-tint: "#f2dfd8"
  check-ochre: "#7f5200"
  check-ochre-tint: "#f1e2bf"
  verified-green: "#1f6b45"
  verified-green-tint: "#dde8d6"
  ink-flood: "#2a4d8f"
  ink-waterlogging: "#24706b"
  ink-blocked-canal: "#2f6436"
  ink-waste-dumping: "#86560f"
  ink-damaged-infrastructure: "#634585"
  ink-other: "#66563f"
typography:
  display:
    fontFamily: "Instrument Serif, Chilanka, Georgia, serif"
    fontSize: "clamp(3.25rem, 6.4vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.012em"
  statement:
    fontFamily: "Instrument Serif, Chilanka, Georgia, serif"
    fontSize: "clamp(2.25rem, 4.6vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Instrument Serif, Chilanka, Georgia, serif"
    fontSize: "clamp(2.25rem, 3.6vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.012em"
  page-title:
    fontFamily: "Instrument Serif, Chilanka, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Instrument Serif, Chilanka, Georgia, serif"
    fontSize: "clamp(1.5rem, 2vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.1
  section-head:
    fontFamily: "Instrument Serif, Chilanka, Georgia, serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1
  entry-head:
    fontFamily: "Instrument Serif, Chilanka, Georgia, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0em"
  guide-word:
    fontFamily: "Instrument Serif, Chilanka, Georgia, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.25
  part-of-speech:
    fontFamily: "Instrument Serif, Chilanka, Georgia, serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.2
  lead:
    fontFamily: "Geist, Chilanka, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.4vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Geist, Chilanka, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "\"ss01\", \"cv11\""
  legend:
    fontFamily: "Geist, Chilanka, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3
  reading:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.3
    fontFeature: "\"tnum\""
  malayalam:
    fontFamily: "Chilanka, Geist, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  none: "0px"
  pin: "9999px"
spacing:
  3xs: "2px"
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  3xl: "96px"
  4xl: "144px"
components:
  button-primary:
    backgroundColor: "{colors.ultramarine}"
    textColor: "{colors.stock-paper}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.ultramarine-hover}"
    textColor: "{colors.stock-paper}"
  button-primary-active:
    backgroundColor: "{colors.ultramarine-press}"
    textColor: "{colors.stock-paper}"
  button-primary-landing:
    backgroundColor: "{colors.ultramarine}"
    textColor: "{colors.stock-paper}"
    rounded: "{rounded.none}"
    padding: "0 24px 0 16px"
    height: "52px"
  button-quiet:
    backgroundColor: "{colors.stock-paper}"
    textColor: "{colors.engraving-black}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "36px"
  button-quiet-hover:
    backgroundColor: "{colors.stock-paper-2}"
    textColor: "{colors.engraving-black}"
  status-needs-verification:
    backgroundColor: "{colors.check-ochre-tint}"
    textColor: "{colors.check-ochre}"
    rounded: "{rounded.none}"
    padding: "0 6px"
    height: "22px"
  status-verified:
    backgroundColor: "{colors.verified-green-tint}"
    textColor: "{colors.verified-green}"
    rounded: "{rounded.none}"
    padding: "0 6px"
    height: "22px"
  entry-row:
    backgroundColor: "{colors.stock-paper}"
    textColor: "{colors.engraving-black}"
    padding: "16px"
  entry-row-selected:
    backgroundColor: "{colors.stock-paper-2}"
    textColor: "{colors.engraving-black}"
  category-ink:
    backgroundColor: "{colors.ink-flood}"
    textColor: "{colors.stock-paper}"
    size: "20px"
  plate:
    backgroundColor: "{colors.stock-paper-2}"
    rounded: "{rounded.none}"
---

# Design System: Backwater Trace

## Overview

**Creative North Star: "Lexicon and Plate"**

Backwater Trace is set as a reference book about Alappuzha's incidents. Each incident is an entry with a serif headword, its source reports are numbered citations, and a disagreement between sources is a variant reading, marked in vermilion and engraver's cross-hatch. The page is engraving black on uncoated stock paper, divided by hairlines and 3px double rules, with square corners everywhere a reader's eye lands. Colour does not wash across the page. It lives inside bordered plates: the map, product screens reproduced on the landing page, and the small category ink squares.

Density follows a working reference book rather than a dashboard. The board is three ruled columns (entry list, map plate, record column) under a double-ruled masthead. The landing page is a book spread: a shoulder index of incident kinds, a display headline over a double rule with a drawn fleuron, and numbered plates with captions and keyed callouts. Instrument Serif carries every head, entry title and guide word at weight 400 only; Geist carries the working text; Chilanka is a first-class face, not a fallback.

The signature move is the dashboard's live guide words. As in a printed dictionary, the head of the entry list shows the first and last entry in view, and they are recomputed on every scroll frame. The logo is the drop-and-canal mark from `docs/brand/final/`, used as supplied.

**Key Characteristics:**
- Engraving black (#1a1712) on stock paper (#f7f3ea); no dark theme.
- Hairline rules for division, 3px double rules for frames and section heads.
- Square corners; the only circles are map pins and source dots.
- Colour only inside bordered plates and category ink squares.
- Ultramarine is the single action colour; vermilion plus 90-degree cross-hatch means possible conflict only.
- Instrument Serif at weight 400 for heads, entries and guide words; Geist for working text; tabular figures for readings.
- Live guide words at the head of the entry list.

## Colors

A monochrome book palette of warm black on cream stock, with one blue for action, one red for disagreement, and six muted printing inks reserved for incident kinds.

### Primary
- **Ultramarine** (#24428f): the one action colour. Primary buttons ("Report incident"), text links on the landing page, the Live refresh indicator, the focus ring, the text caret and selection tint. Hover lifts to Ultramarine Hover (#2d52a8), press sinks to Ultramarine Press (#1b3374), which is also the primary button's outer border. Ultramarine Tint (#e2e4ec) backs transcript notes and the highlight ring.

### Secondary
- **Vermilion** (#b8361f): possible conflict and nothing else. Always paired with the 90-degree cross-hatch: a hatched swatch beside the text, a hatched ring around a map pin, a dashed edge in the evidence graph, a variant reading in an entry.

### Tertiary
- **Category inks**, used only as solid squares behind a white line icon, as pin fills inside the map plate, and in the map key: Flood (#2a4d8f, ultramarine), Waterlogging (#24706b, viridian), Blocked canal (#2f6436, emerald), Waste dumping (#86560f, chrome ochre), Damaged infrastructure (#634585, violet), Other (#66563f, sepia).
- **Status tints**: Check Ochre (#7f5200 on #f1e2bf) for needs verification, Verified Green (#1f6b45 on #dde8d6) for verified, Danger (#8f1d1d on #f2dfd8) for errors. Status always carries its text label; colour never stands alone.

### Neutral
- **Stock Paper** (#f7f3ea): page and panel ground.
- **Stock Paper 2** (#efe9dc): hover rows, the selected entry, the map column, plate grounds, the landing records band and colophon.
- **Stock Paper 3** (#e6dece): press states, skeleton bars, the bare map ground.
- **Engraving Black** (#1a1712): text, double rules, plate frames, the selected-entry inner rule, the source-count bubble.
- **Ink 2** (#3f392f): secondary prose, leads, citation text.
- **Ink Muted** (#665e50): captions, meta, timestamps, the italic centre guide line.
- **Hairline** (#d6cdba): the 1px divider between rows and columns.
- **Rule Strong** (#b3a993): the inner rule of quiet buttons, resolved-status borders, hover underlines.

### Named Rules
**The Plate Rule.** Colour is printed only inside a frame: the map plate, a reproduced screen, a category ink square. The page itself stays black on stock.

**The One Action Rule.** Ultramarine marks what can be done. Nothing decorative is ultramarine; the Flood ink is a category, not an action.

**The Variant Reading Rule.** Vermilion appears only with cross-hatch, and only for a possible conflict between sources. Errors use Danger (#8f1d1d), never vermilion.

## Typography

**Display Font:** Instrument Serif (with Chilanka, Georgia, serif)
**Body Font:** Geist (with Chilanka, ui-sans-serif, system-ui)
**Malayalam:** Chilanka (400 only, self-hosted from `src/app/fonts/chilanka/`, SIL OFL; never synthesised bold)

**Character:** A lexicographer's pairing. The serif is the headword and the running head; the sans is the definition and the apparatus. The serif ships at one weight, so it never bolds.

### Hierarchy
- **Display** (400, clamp(3.25rem, 6.4vw, 6rem), 0.95): the landing headline only, one line over a double rule.
- **Statement** (400, clamp(2.25rem, 4.6vw, 4.25rem), 1.04): the centred landing statement between double rules.
- **Headline** (400, clamp(2.25rem, 3.6vw, 3.5rem), 1): landing section heads and the upper-roman step numerals.
- **Page title** (400, 2rem to 3.25rem, 1, -0.01em): the app's h1 per screen (board 32px, report form 48px, incident title 36px rising to 52px).
- **Title** (400, clamp(1.5rem, 2vw, 1.875rem), 1.1): landing h3s, entry heads in the landing specimen.
- **Section head** (400, 22px, 1): record column heads ("The record", "Recent activity"), the logo wordmark line.
- **Entry head** (400, 19px, 1.25, word-spacing 0.14em): incident titles in the entry list; 17px in the record column.
- **Guide word** (400, 18px app, 17px landing): first and last entry in view.
- **Part of speech** (400 italic, 14 to 15px, lowercase): the category name after its ink square.
- **Lead** (Geist 400, clamp(1.125rem, 1.4vw, 1.3125rem), 1.45, max 36ch): landing introduction.
- **Body** (Geist 400, 15px app, 16px landing, 1.55, ss01 and cv11): working text; prose capped near 65ch.
- **Legend** (Geist 600, 13px, 1.3, sentence case): field and group names.
- **Reading** (Geist, 11 to 12px, tabular figures): counts, times, source totals, citation numbers.

### Named Rules
**The No Faux Bold Rule.** Instrument Serif is set at weight 400 only, with `font-synthesis: none`. Emphasis in the serif comes from size or italic, never weight.

**The Part of Speech Rule.** A category name is set italic, lowercase, in the serif, directly after its ink square, as a dictionary marks a word class.

**The Tabular Reading Rule.** Any figure a coordinator compares (counts, times, sources, citation numbers) uses tabular numerals.

## Layout

The board is a full-height three-column sheet: a 360px entry list, a fluid map column, and a 320px record column from 1280px up; the record column drops below 1280px and the map stacks above the list below 1024px (55svh, min 360px). Columns are divided by hairlines; the masthead (64px, sticky) and the entry-list head are closed by 3px double rules.

The landing page sits in a 1440px measure with a fluid gutter (clamp(16px, 3.4vw, 48px)). Its first viewport is a 190px shoulder index, a text column and a plate column; the shoulder drops at 80rem and every grid collapses to one column at 64rem. Sections are separated by 1px black or 3px double rules, never by background cards, with vertical gaps from the section scale (120, 144, 176px desktop; 80, 96, 120px under 60rem; 56, 72, 96px under 40rem).

Spacing steps from 2px to 144px (2, 4, 8, 12, 16, 24, 40, 64, 96, 144). Rows in the entry list breathe at 16px; plate captions sit 16px below their frame.

## Elevation & Depth

Flat, as print is flat. Depth is expressed by rules and frames: a double rule closes a sheet, a plate is a 1px black border with a second 1px outline offset 3 to 4px, and a selected entry gains a 1px inner engraving-black rule on Stock Paper 2. Surfaces never lift on hover; they change paper tone.

### Named Rules
**The Engraved Frame Rule.** Where another system would raise a card, this one draws a second rule around it. No surface uses a drop shadow to claim importance.

## Shapes

Square corners (0px) on buttons, badges, plates, the map key, popups, ink squares and the selected-entry frame. The only round forms are functional marks inside the map plate and the source count: pins (sized by source count, with a 2px paper halo), the source-count bubble, the five source-stop dots, and the hatched conflict ring. Rules are the form language: 1px hairline between items, 1px black for structure, 3px double for frames and heads. The cross-hatch is two 1px line sets at plus and minus 45 degrees, 4px apart, in vermilion.

## Components

### Buttons
Framed like a plate: every control carries an inner double rule.
- **Shape:** square (0px).
- **Primary:** Ultramarine fill, Stock Paper text, 1px Ultramarine Press border, and an inner frame drawn as a ring of fill then a 1px paper rule (2px + 1px in the app, 3px + 1px on the landing page). App size 36px high, 14px inline padding, 13 to 14px semibold; landing size 52px high, 16px semibold.
- **Hover / Active:** fill steps to Ultramarine Hover, then Ultramarine Press, with the inner ring following the fill; the landing button sinks 1px on press. Focus is a 2px ultramarine outline offset 2 to 3px.
- **Quiet:** Stock Paper fill, 1px engraving-black border, inner 1px Rule Strong frame; hover to Stock Paper 2.
- **Ghost:** muted text, Stock Paper 2 on hover; used for small utility actions.

### Status tags
- **Style:** 22px square tags, 1px border in the status colour on its tint, 12px medium text. New is black on paper; resolved is faint on Stock Paper 2.

### Category mark
- **Style:** a 20px square of the category ink holding a 12px white line icon, followed by the italic lowercase category name in the serif.

### Conflict mark
- **Style:** a 12 to 14px vermilion-bordered square filled with the cross-hatch, followed by vermilion semibold text ("Possible conflict", "2 possible conflicts"). On the map it becomes a hatched ring around the pin.

### Plates
- **Corner Style:** square.
- **Background:** Stock Paper 2 inside the frame.
- **Border:** 1px engraving black plus a 1px engraving-black outline offset 3px (app) or 4px (landing).
- **Caption:** a serif plate number ("Plate I.") then a Geist caption in Ink Muted; landing plates add numbered black callout squares on the image and a decimal key with serif markers.

### Entry list
- **Rows:** 16px padding, a 20px ink square column then the entry head (19px serif), a tabular timestamp, and a 13px muted meta line; divided by hairlines.
- **States:** hover to Stock Paper 2; selected adds a 1px engraving-black inner rule; filtered-out rows dim to 70%.

### Inputs / Fields
- **Style:** 1px field border (#8a8170) on Stock Paper, 16px text in the report textarea so phones do not zoom.
- **Focus:** the shared 2px ultramarine outline.

### Navigation
- **Masthead:** 64px, sticky, Stock Paper, closed by a 3px double rule. Logo and serif wordmark at left; 14px medium links that underline 2px in black when current; the Report button at right.

### Guide words (signature)
The head of the entry list is a three-part row closed by a double rule: the first entry in view at left, a tabular "N shown" count in the centre, the last entry in view at right, both in 18px serif and truncated. The values are recomputed on every animation frame of scroll and on resize, announced politely to screen readers. On the landing masthead the same row shows sample guide words around an italic muted centre line.

## Do's and Don'ts

### Do:
- **Do** set every head, entry title and guide word in Instrument Serif at weight 400.
- **Do** frame colour: put map, screenshots and category inks inside a 1px black border with an offset second rule.
- **Do** close sheets, mastheads and major sections with a 3px double rule (`border-bottom: 3px double`), and divide items with 1px hairlines (#d6cdba).
- **Do** give every button the inner double-rule frame, and keep ultramarine for actions only.
- **Do** pair vermilion with the 90-degree cross-hatch every time it appears.
- **Do** write category names italic and lowercase after their ink square.
- **Do** use tabular figures for counts, times and source totals.
- **Do** use the logo masters from `docs/brand/final/` exactly as supplied, on a solid container.

### Don't:
- **Don't** bold, synthesize or uppercase-track Instrument Serif.
- **Don't** round corners; circles are reserved for map pins and source dots.
- **Don't** lift surfaces with drop shadows; draw a rule instead.
- **Don't** use vermilion for errors, emphasis or decoration; errors use Danger (#8f1d1d).
- **Don't** flood a page or panel with a category ink or ultramarine background.
- **Don't** recolour, redraw or retype the logo.
- **Don't** add a dark theme; the world is printed stock.
