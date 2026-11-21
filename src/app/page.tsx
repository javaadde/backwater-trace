import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { HeroBoard } from "@/components/landing/hero-board";
import { Logo } from "@/components/ui/logo";
import { CategoryIcon } from "@/components/ui/category-icon";
import { CATEGORY_LABEL } from "@/lib/labels";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE, siteUrl } from "@/lib/site";
import type { Category } from "@/types/domain";
import "./landing.css";

const CONFLICT_RECORD = "/incidents/11111111-0000-4000-8000-000000000002";

const KINDS: Category[] = ["flood", "waterlogging", "blocked_canal", "waste_dumping", "damaged_infrastructure"];

type FieldRecord = { headword: string; kind: Category; place: string; ml: string; note: string; conflict?: boolean };

const records: FieldRecord[] = [
  {
    headword: "Flooding on the bus route",
    kind: "flood",
    place: "KSRTC bus stand",
    ml: "ഇവിടെ കെഎസ്ആർടിസി ബസ് സ്റ്റാൻഡിന് അടുത്ത് റോഡിൽ മുട്ടോളം വെള്ളമുണ്ട്.",
    note: "Voice and text agree: knee-deep water near the bus stand.",
  },
  {
    headword: "A canal stops flowing",
    kind: "blocked_canal",
    place: "Mullakkal",
    ml: "വാടക്കനാലിൽ പോളയും പ്ലാസ്റ്റിക്കും നിറഞ്ഞ് ഒഴുക്ക് നിലച്ചു.",
    note: "Both reports describe a blockage in Vadai Canal.",
  },
  {
    headword: "One road, two accounts",
    kind: "flood",
    place: "Pallathuruthy",
    ml: "പള്ളാത്തുരുത്തി ഭാഗത്ത് എസി റോഡിൽ അരയോളം വെള്ളം കയറി, ഗതാഗതം നിലച്ചു.",
    note: "Traffic stopped, or one lane open? Both stay on record.",
    conflict: true,
  },
];

const steps = [
  { title: "Report it your way", body: "Speak in Malayalam or type a few lines in English, then mark the place." },
  { title: "Reports become one entry", body: "Reports about the same place and problem are grouped under one entry." },
  { title: "Every claim keeps its citation", body: "Each detail links to the report it came from; disagreements stay side by side." },
];

/** An engraver's fleuron, drawn as line: a lozenge between two tendrils. */
function Fleuron() {
  return (
    <svg className="lx-fleuron" viewBox="0 0 56 16" width="56" height="16" aria-hidden>
      <path d="M28 2.5 33.5 8 28 13.5 22.5 8Z" fill="currentColor" />
      <path d="M21 8c-4-4.5-9-4.5-13-1.5M35 8c4-4.5 9-4.5 13-1.5M21 8c-4 4.5-9 4.5-13 1.5M35 8c4 4.5 9 4.5 13 1.5" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="5.5" cy="8" r="1.6" fill="currentColor" />
      <circle cx="50.5" cy="8" r="1.6" fill="currentColor" />
    </svg>
  );
}

function Kind({ category }: { category: Category }) {
  return (
    <span className="lx-kind">
      <span className="lx-kind__ink" style={{ background: `var(--cat-${category})` }} aria-hidden>
        <CategoryIcon category={category} />
      </span>
      <i>{CATEGORY_LABEL[category].toLowerCase()}</i>
    </span>
  );
}

export default function Home() {
  const base = siteUrl();
  return (
    <div className="lx">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", "@id": `${base}/#website`, url: base, name: SITE.name, description: SITE.short, inLanguage: ["en", "ml"] },
            {
              "@type": "WebApplication",
              "@id": `${base}/#app`,
              name: SITE.name,
              url: base,
              description: SITE.description,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Any (web browser)",
              inLanguage: ["en", "ml"],
              areaServed: { "@type": "AdministrativeArea", name: "Alappuzha, Kerala, India" },
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
              codeRepository: SITE.repo,
              featureList: [
                "Malayalam voice reporting transcribed by Sarvam AI",
                "Rule-based grouping of reports about the same incident",
                "Possible-conflict detection between sources",
                "Evidence graph linking every claim to its original report",
              ],
            },
          ],
        }}
      />
      <a className="lx-skip" href="#main">Skip to content</a>

      <header className="lx-mast">
        <div className="lx-wrap lx-mast__row">
          <Logo />
          <nav aria-label="Main navigation" className="lx-mast__nav">
            <a href="#how-it-works" className="lx-link lx-hide-md">How an entry is made</a>
            <a href="#field-records" className="lx-link lx-hide-md">From the lexicon</a>
            <Link href="/dashboard" className="lx-link lx-hide-sm">Incident board</Link>
            <Link href="/report" className="lx-btn lx-btn--primary lx-btn--sm"><Plus size={16} aria-hidden /> <span>Report<span className="lx-hide-sm"> an incident</span></span></Link>
          </nav>
        </div>
        <div className="lx-wrap lx-guide" aria-hidden>
          <span>Flooded road near Alappuzha KSRTC</span>
          <span className="lx-guide__mid">Alappuzha incident lexicon, synthetic edition</span>
          <span>Waste near Punnamada jetty</span>
        </div>
      </header>

      <main id="main">
        {/* First viewport: shoulder index, the thesis, Plate I */}
        <section className="lx-hero" aria-labelledby="landing-title">
          <div className="lx-wrap lx-hero__grid">
            <aside className="lx-shoulder" aria-label="Kinds of incident">
              <p className="lx-shoulder__head">Index of kinds</p>
              <ul>
                {KINDS.map((k) => (
                  <li key={k}><Kind category={k} /></li>
                ))}
              </ul>
            </aside>

            <div className="lx-hero__text">
              <h1 id="landing-title">Alappuzha,<br /> on the record.</h1>
              <div className="lx-rule" aria-hidden><Fleuron /></div>
              <p className="lx-lead">Voice notes and texts, in Malayalam or English, kept as entries you can trace to every source.</p>
              <div className="lx-actions">
                <Link href="/report" className="lx-btn lx-btn--primary"><Plus size={18} aria-hidden /> Report an incident</Link>
                <Link href="/dashboard" className="lx-btn lx-btn--quiet">Open the incident board</Link>
              </div>
            </div>

            <figure className="lx-plate lx-plate--hero">
              <div className="lx-plate__frame" data-slot="hero" data-kind="product">
                <HeroBoard />
              </div>
              <figcaption>
                <span className="lx-plate__no">Plate I.</span> The incident board, live: pan the map, pick a pin or an entry. Synthetic demo data.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* One entry, set the way a lexicon sets it */}
        <section className="lx-entry-sec" aria-labelledby="entry-title">
          <div className="lx-wrap lx-entry-sec__grid">
            <div>
              <h2 id="entry-title">One entry, two citations</h2>
              <article className="lx-entry">
                <p className="lx-entry__head">
                  <span className="lx-entry__word">AC Road flooding at Pallathuruthy,</span> <i>flooded road.</i>
                </p>
                <ol className="lx-senses">
                  <li><b>Water level.</b> Waist level. <span className="lx-cite">[1, 2]</span></li>
                  <li>
                    <b>Road status.</b> <span className="lx-variant"><span className="hatch-cross lx-swatch" aria-hidden />Possible conflict:</span>{" "}
                    <span className="lx-reading">blocked</span> <span className="lx-cite">[1]</span>; <span className="lx-reading">partially open</span> <span className="lx-cite">[2]</span>.
                  </li>
                </ol>
                <div className="lx-citations">
                  <p>
                    <span className="lx-cite">[1]</span> Voice note in Malayalam, 21 Nov, 19:16.{" "}
                    <q lang="ml" className="lx-ml">എസി റോഡിൽ അരയോളം വെള്ളം കയറി, ഗതാഗതം നിലച്ചു.</q>
                  </p>
                  <p>
                    <span className="lx-cite">[2]</span> Written in English, 21 Nov, 19:55.{" "}
                    <q>Flooded at waist level, but one lane is partially open for trucks and buses.</q>
                  </p>
                </div>
              </article>
              <Link href={CONFLICT_RECORD} className="lx-textlink">Open this entry <ArrowRight size={18} aria-hidden /></Link>
            </div>
            <figure className="lx-plate lx-plate--graph">
              <div className="lx-plate__frame" data-slot="graph" data-kind="product">
                <Image src="/landing/plate-ii-graph.png" width={1436} height={1962} sizes="(min-width: 64rem) 40vw, 100vw" alt="The evidence graph: the incident above two reports, joined by a dashed possible conflict on road status." />
              </div>
              <figcaption><span className="lx-plate__no">Plate II.</span> The same entry as an evidence graph.</figcaption>
            </figure>
          </div>
        </section>

        {/* Positioning */}
        <section className="lx-statement" aria-label="What Backwater Trace does and does not do">
          <div className="lx-wrap">
            <Fleuron />
            <p className="lx-statement__text">It never decides who is right. It shows where the sources disagree.</p>
          </div>
        </section>

        {/* How an entry is made */}
        <section id="how-it-works" className="lx-steps" aria-labelledby="how-title">
          <div className="lx-wrap lx-steps__grid">
            <figure className="lx-plate lx-plate--phone">
              <div className="lx-plate__frame" data-slot="report" data-kind="product">
                <Image src="/landing/plate-iii-report-v4.png" width={780} height={1900} sizes="(min-width: 64rem) 22vw, 70vw" alt="The report form on a phone: a microphone for a Malayalam voice note, and a text box." />
              </div>
              <figcaption><span className="lx-plate__no">Plate III.</span> Filing a report on a phone.</figcaption>
            </figure>
            <div>
              <h2 id="how-title">How an entry is made</h2>
              <ol className="lx-steps__list">
                {steps.map((s) => (
                  <li key={s.title}>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* From the lexicon */}
        <section id="field-records" className="lx-records" aria-labelledby="records-title">
          <div className="lx-wrap">
            <div className="lx-records__head">
              <h2 id="records-title">From the lexicon</h2>
              <Link href="/dashboard" className="lx-textlink">Every entry on the incident board <ArrowRight size={18} aria-hidden /></Link>
            </div>
            <ul className="lx-records__cols">
              {records.map((r) => (
                <li key={r.headword}>
                  <h3>{r.headword}</h3>
                  <p className="lx-records__meta"><Kind category={r.kind} />, {r.place}</p>
                  <p lang="ml" className="lx-ml lx-records__ml">{r.ml}</p>
                  <p className={r.conflict ? "lx-records__note lx-records__note--conflict" : "lx-records__note"}>
                    {r.conflict ? <span className="hatch-cross lx-swatch" aria-hidden /> : null}
                    {r.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Close */}
        <section className="lx-close" aria-labelledby="cta-title">
          <div className="lx-wrap lx-close__grid">
            <div>
              <h2 id="cta-title">Seen something nearby?</h2>
              <p lang="ml" className="lx-ml lx-close__ml">എവിടെ, എന്ത് സംഭവിച്ചു?</p>
            </div>
            <div className="lx-actions lx-close__actions">
              <Link href="/report" className="lx-btn lx-btn--primary"><Plus size={18} aria-hidden /> Report an incident</Link>
              <Link href="/dashboard" className="lx-btn lx-btn--quiet">Incident board</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="lx-footer">
        <div className="lx-wrap lx-footer__grid">
          <Logo />
          <nav aria-label="Footer" className="lx-footer__links">
            <Link href="/dashboard" className="lx-link">Incident board</Link>
            <Link href="/report" className="lx-link">Report an incident</Link>
            <Link href="/about" className="lx-link">About and stack</Link>
            <a href="#how-it-works" className="lx-link">How an entry is made</a>
            <a href="#field-records" className="lx-link">From the lexicon</a>
          </nav>
          <div className="lx-footer__legal">
            <p>Alappuzha, Kerala</p>
            <p>Entries on this page are synthetic demo data.</p>
            <p>Map tiles from OpenStreetMap contributors.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
