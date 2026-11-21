import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import "./landing.css";

const CONFLICT_RECORD = "/incidents/11111111-0000-4000-8000-000000000002";

type FieldRecord = { place: string; title: string; ml: string; note: string; conflict?: boolean };

const records: FieldRecord[] = [
  {
    place: "KSRTC bus stand",
    title: "Flooding on the bus route",
    ml: "ഇവിടെ കെഎസ്ആർടിസി ബസ് സ്റ്റാൻഡിന് അടുത്ത് റോഡിൽ മുട്ടോളം വെള്ളമുണ്ട്.",
    note: "Voice and text agree: knee-deep water near the bus stand.",
  },
  {
    place: "Mullakkal",
    title: "A canal stops flowing",
    ml: "വാടക്കനാലിൽ പോളയും പ്ലാസ്റ്റിക്കും നിറഞ്ഞ് ഒഴുക്ക് നിലച്ചു.",
    note: "Both reports describe a blockage in Vadai Canal.",
  },
  {
    place: "Pallathuruthy",
    title: "One road, two accounts",
    ml: "പള്ളാത്തുരുത്തി ഭാഗത്ത് എസി റോഡിൽ അരയോളം വെള്ളം കയറി, ഗതാഗതം നിലച്ചു.",
    note: "Traffic stopped, or one lane open? Both stay on record.",
    conflict: true,
  },
];

const steps = [
  {
    title: "Report it your way",
    body: "Speak in Malayalam or type a few lines in English, then mark the place.",
    src: "/landing/report-phone.png",
    w: 780,
    h: 1688,
    alt: "The report form on a phone: a microphone button for a Malayalam voice note and a text box.",
    kind: "phone",
  },
  {
    title: "Reports become one incident",
    body: "Reports about the same place and problem are grouped into one record.",
    src: "/landing/record-sources.png",
    w: 1290,
    h: 980,
    alt: "Two source reports on one incident: a Malayalam voice note and an English text, each with its road status.",
    kind: "wide",
  },
  {
    title: "Every claim keeps its source",
    body: "Each detail links back to the report it came from, conflicts drawn in red.",
    src: "/landing/record-graph.png",
    w: 1452,
    h: 1570,
    alt: "The evidence graph: one incident, two reports joined by a dashed possible conflict on road status.",
    kind: "square",
  },
];

export default function Home() {
  return (
    <div className="lp">
      <a className="lp-skip" href="#main">Skip to content</a>

      <header className="lp-nav">
        <div className="lp-container lp-nav__row">
          <Logo />
          <nav aria-label="Main navigation" className="lp-nav__links">
            <a href="#how-it-works" className="lp-link lp-hide-sm">How it works</a>
            <a href="#field-records" className="lp-link lp-hide-sm">Field records</a>
            <Link href="/dashboard" className="lp-link">Incident board</Link>
            <Link href="/report" className="lp-btn lp-btn--quiet lp-btn--sm"><Plus size={16} aria-hidden /> <span>Report<span className="lp-hide-sm"> an incident</span></span></Link>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* Hero: the incident board itself */}
        <section className="lp-hero" aria-labelledby="landing-title">
          <div className="lp-container lp-hero__grid">
            <div className="lp-hero__text">
              <h1 id="landing-title">Alappuzha,<br /> on the record.</h1>
              <p className="lead">Voice notes and texts, in Malayalam or English, traced to every source.</p>
              <div className="lp-actions">
                <Link href="/report" className="lp-btn lp-btn--primary"><Plus size={20} aria-hidden /> Report an incident</Link>
                <Link href="/dashboard" className="lp-btn lp-btn--quiet">Open the incident board</Link>
              </div>
            </div>
            <figure className="lp-hero__shot">
              <div className="lp-shot" data-slot="hero" data-kind="product" data-alt="The incident board: map of Alappuzha, incident list and the record panel">
                <Image
                  src="/landing/board.png"
                  width={2880}
                  height={1800}
                  preload
                  sizes="(min-width: 60rem) 60vw, 100vw"
                  alt="The incident board: a map of Alappuzha with incident pins, the list of open incidents, and a record panel counting possible conflicts."
                />
              </div>
              <figcaption>The incident board, showing synthetic demo data.</figcaption>
            </figure>
          </div>
        </section>

        {/* Signature: one road, two accounts */}
        <section className="lp-conflict" aria-labelledby="conflict-title">
          <div className="lp-container">
            <h2 id="conflict-title">One road, two accounts</h2>
            <p className="lead lp-conflict__lead">AC road at Pallathuruthy. Same water, a different road status.</p>
            <div className="lp-accounts">
              <div className="lp-account">
                <p className="lp-account__meta">Source 1, voice note in Malayalam</p>
                <p lang="ml" className="lp-account__quote lp-ml">എസി റോഡിൽ അരയോളം വെള്ളം കയറി, ഗതാഗതം നിലച്ചു.</p>
                <p className="lp-account__value">Blocked</p>
              </div>
              <div className="lp-cross" aria-hidden><span className="hatch-cross" /></div>
              <div className="lp-account">
                <p className="lp-account__meta">Source 2, written in English</p>
                <p className="lp-account__quote">Waist-level water, but one lane is partially open for trucks and buses.</p>
                <p className="lp-account__value">Partially open</p>
              </div>
            </div>
            <div className="lp-conflict__foot">
              <p><span className="lp-conflict__flag">Possible conflict on road status.</span> Both stay on record, side by side.</p>
              <Link href={CONFLICT_RECORD} className="lp-textlink">Open this record <ArrowUpRight size={18} aria-hidden /></Link>
            </div>
          </div>
        </section>

        {/* Positioning statement */}
        <section className="lp-statement" aria-label="What Backwater Trace does and does not do">
          <div className="lp-container">
            <p className="lp-statement__text">It never decides who is right. It shows where the sources disagree.</p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="lp-steps" aria-labelledby="how-title">
          <div className="lp-container">
            <h2 id="how-title">From a voice note to a record</h2>
            <ol className="lp-steps__list">
              {steps.map((s) => (
                <li key={s.title} className="lp-step">
                  <div className="lp-step__text">
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                  <div className={`lp-step__shot lp-step__shot--${s.kind}`} data-slot={`step-${s.kind}`} data-kind="product" data-alt={s.alt}>
                    <Image src={s.src} width={s.w} height={s.h} alt={s.alt} sizes="(min-width: 60rem) 50vw, 100vw" />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Field records */}
        <section id="field-records" className="lp-records" aria-labelledby="records-title">
          <div className="lp-container">
            <div className="lp-records__head">
              <h2 id="records-title">Field records</h2>
              <Link href="/dashboard" className="lp-textlink">See all on the incident board <ArrowUpRight size={18} aria-hidden /></Link>
            </div>
            <ul className="lp-records__list">
              {records.map((r) => (
                <li key={r.title} className="lp-record">
                  <div className="lp-record__name">
                    <h3>{r.title}</h3>
                    <p className="lp-record__place">{r.place}</p>
                  </div>
                  <div className="lp-record__body">
                    <p lang="ml" className="lp-ml lp-record__ml">{r.ml}</p>
                    <p className={r.conflict ? "lp-record__note lp-record__note--conflict" : "lp-record__note"}>
                      {r.conflict ? <span className="hatch-cross lp-swatch" aria-hidden /> : null}
                      {r.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Close */}
        <section className="lp-close" aria-labelledby="cta-title">
          <div className="lp-container lp-close__grid">
            <div>
              <h2 id="cta-title">Seen something nearby?</h2>
              <p lang="ml" className="lp-ml lp-close__ml">എവിടെ, എന്ത് സംഭവിച്ചു?</p>
            </div>
            <div className="lp-actions lp-close__actions">
              <Link href="/report" className="lp-btn lp-btn--primary"><Plus size={20} aria-hidden /> Report an incident</Link>
              <Link href="/dashboard" className="lp-btn lp-btn--quiet">Incident board</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-container lp-footer__grid">
          <div className="lp-footer__mark">
            <Logo />
          </div>
          <nav aria-label="Footer" className="lp-footer__links">
            <Link href="/dashboard" className="lp-link">Incident board</Link>
            <Link href="/report" className="lp-link">Report an incident</Link>
            <a href="#how-it-works" className="lp-link">How it works</a>
            <a href="#field-records" className="lp-link">Field records</a>
          </nav>
          <div className="lp-footer__legal">
            <p>Alappuzha, Kerala</p>
            <p>Example records on this page are synthetic.</p>
            <p>Map tiles from OpenStreetMap contributors.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
