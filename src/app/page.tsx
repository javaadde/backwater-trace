import Link from "next/link";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import { IncidentPrint, type PrintKind } from "@/components/incident-print";
import { Logo } from "@/components/ui/logo";
import "./landing.css";

type FieldRecord = { art: PrintKind; place: string; title: string; ml: string; en: string; note: string };

const records: FieldRecord[] = [
  {
    art: "bus", place: "KSRTC bus stand", title: "Flooding on the bus route",
    ml: "ഇവിടെ കെഎസ്ആർടിസി ബസ് സ്റ്റാൻഡിന് അടുത്ത് റോഡിൽ മുട്ടോളം വെള്ളമുണ്ട്.",
    en: "Knee-deep water on the road outside the KSRTC bus stand. Buses are moving very slowly, difficult for two-wheelers.",
    note: "Both accounts describe knee-deep water near the bus stand.",
  },
  {
    art: "canal", place: "Mullakkal", title: "A canal stops flowing",
    ml: "വാടക്കനാലിൽ പോളയും പ്ലാസ്റ്റിക്കും നിറഞ്ഞ് ഒഴുക്ക് നിലച്ചു.",
    en: "Vadai canal near Mullakkal is choked with water hyacinth and plastic. Water is not flowing at all.",
    note: "The voice and written reports both describe a blockage in Vadai Canal.",
  },
  {
    art: "gauge", place: "Pallathuruthy", title: "One road, two accounts",
    ml: "പള്ളാത്തുരുത്തി ഭാഗത്ത് എസി റോഡിൽ അരയോളം വെള്ളം കയറി, ഗതാഗതം നിലച്ചു.",
    en: "AC road at Pallathuruthy is flooded at waist level but one lane is partially open for trucks and buses.",
    note: "Possible conflict: one source says traffic stopped; the other says one lane is open. Both stay on record.",
  },
];

export default function Home() {
  return (
    <main className="field-page">
      <header className="field-header">
        <Logo />
        <nav aria-label="Main navigation">
          <a href="#field-records" className="field-gallery-nav">Field records</a>
          <Link href="/report" className="field-report"><Plus size={16} aria-hidden /> Report an incident</Link>
        </nav>
      </header>
      <section className="field-hero" aria-labelledby="landing-title">
        <h1 id="landing-title">Alappuzha,<br />on the record.</h1>
        <div className="field-intro">
          <p>When a canal clogs or a road floods, the people there see it first. Follow reports in Malayalam and English back to their original sources.</p>
          <Link href="/dashboard" className="field-primary">Open the incident board <ArrowUpRight size={19} aria-hidden /></Link>
        </div>
      </section>
      <section id="field-records" className="field-gallery" aria-labelledby="gallery-title">
        <div className="field-section-head">
          <div><h2 id="gallery-title">Field records</h2><p>Three synthetic incidents. Open a record to compare its sources.</p></div>
          <span lang="ml" className="field-district">ആലപ്പുഴ</span>
        </div>
        <div className="field-grid">
          {records.map(({ art, place, title, ml, en, note }) => (
            <details className="field-record" key={art}>
              <summary>
                <div className="field-print"><IncidentPrint kind={art} /></div>
                <div className="field-caption">
                  <div><span className="field-place">{place}</span><h3>{title}</h3></div>
                  <span className="field-toggle"><ArrowDown size={18} aria-hidden /></span>
                </div>
              </summary>
              <div className="field-sources">
                <p>Voice · Malayalam excerpt</p><blockquote lang="ml">{ml}</blockquote>
                <p>Text · English</p><blockquote>{en}</blockquote>
                <strong>{note}</strong>
              </div>
            </details>
          ))}
        </div>
      </section>
      <footer className="field-footer">
        <h2>Seen something nearby?</h2>
        <p>Record a voice note or write a report. You can review the details before you send it.</p>
        <Link href="/report">Report an incident <ArrowUpRight size={17} aria-hidden /></Link>
      </footer>
    </main>
  );
}
