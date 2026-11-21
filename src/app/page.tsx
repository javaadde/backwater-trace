import Link from "next/link";
import { ArrowDown, ArrowUpRight, AudioLines, FileText, Layers, Link2, Mic, Plus } from "lucide-react";
import { IncidentPrint, type PrintKind } from "@/components/incident-print";
import { CategoryChip, ConflictSwatch, StatusBadge } from "@/components/ui/badges";
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

const steps = [
  {
    icon: Mic,
    title: "Report it your way",
    body: "Record a voice note in Malayalam or type a few lines in English. Add the place and you're done.",
  },
  {
    icon: Layers,
    title: "Reports become one incident",
    body: "Reports about the same place and problem are grouped, so ten messages about one flooded road read as one record.",
  },
  {
    icon: Link2,
    title: "Every claim keeps its source",
    body: "Each detail links back to the report it came from. Where sources disagree, both stay visible.",
  },
];

/** Static example of an incident record, built from the app's own badges. */
function RecordPreview() {
  return (
    <figure className="m-0 rounded-[14px] border border-line bg-panel shadow-[0_24px_60px_-28px_var(--shade-strong)]">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <span className="text-xs font-medium text-fg-faint">Example record · synthetic data</span>
        <StatusBadge status="needs_verification" />
      </div>
      <div className="px-5 pb-5 pt-4">
        <CategoryChip category="flood" />
        <h2 className="mt-2 max-w-none text-[1.35rem] font-semibold leading-tight">AC road flooded at Pallathuruthy</h2>
        <div className="mt-2 flex items-center gap-3 text-xs text-fg-muted">
          <span className="stops" aria-hidden><i data-on="true" /><i data-on="true" /><i data-on="true" /><i /><i /></span>
          3 independent sources
        </div>

        <ol className="mt-4 space-y-2.5 p-0" aria-label="Sources">
          <li className="list-none rounded-lg bg-panel-2 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted"><AudioLines size={14} aria-hidden /> Voice · Malayalam</div>
            <p lang="ml" className="mt-1 font-ml text-[0.95rem] leading-relaxed">എസി റോഡിൽ അരയോളം വെള്ളം കയറി, ഗതാഗതം നിലച്ചു.</p>
          </li>
          <li className="list-none rounded-lg bg-panel-2 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted"><FileText size={14} aria-hidden /> Text · English</div>
            <p className="mt-1 text-[0.95rem] leading-relaxed">Waist-level water, but one lane is partially open for trucks and buses.</p>
          </li>
        </ol>

        <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-conflict/30 p-3 text-sm text-fg">
          <ConflictSwatch className="mt-1" />
          <p><span className="font-semibold text-conflict">Possible conflict.</span> One source says traffic stopped, the other says one lane is open. Both stay on record.</p>
        </div>
      </div>
    </figure>
  );
}

export default function Home() {
  return (
    <main className="w-full">
      <div className="lp-wrap">
        <header className="flex min-h-[5.25rem] items-center justify-between gap-4 border-b border-line">
          <Logo />
          <nav aria-label="Main navigation" className="flex items-center gap-1 text-[0.9rem] font-medium sm:gap-2">
            <a href="#how-it-works" className="lp-navlink">How it works</a>
            <a href="#field-records" className="lp-navlink">Field records</a>
            <Link href="/dashboard" className="lp-navlink">Incident board</Link>
            <Link href="/report" className="lp-btn lp-btn-outline ml-2"><Plus size={16} aria-hidden /> <span>Report<span className="max-sm:hidden"> an incident</span></span></Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="grid items-center gap-12 py-[clamp(3rem,7vw,7rem)] lg:grid-cols-[1.1fr_1fr]" aria-labelledby="landing-title">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[0.8rem] font-medium text-fg-muted">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              Incident reports for Alappuzha · <span lang="ml" className="font-ml">ആലപ്പുഴ</span>
            </p>
            <h1 id="landing-title" className="mt-6 max-w-none text-[clamp(3rem,6.6vw,6.4rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
              Alappuzha,<br />on the record.
            </h1>
            <p className="mt-6 max-w-[34rem] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-normal text-fg-muted">
              When a canal clogs or a road floods, the people there see it first. Backwater Trace turns their voice notes and messages, in Malayalam and English, into one record you can trace back to every source.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/report" className="lp-btn lp-btn-primary"><Plus size={18} aria-hidden /> Report an incident</Link>
              <Link href="/dashboard" className="lp-btn lp-btn-outline">Open the incident board <ArrowUpRight size={18} aria-hidden /></Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 p-0 text-sm text-fg-muted">
              <li className="flex list-none items-center gap-2"><Mic size={15} aria-hidden /> Voice or text</li>
              <li className="flex list-none items-center gap-2"><span lang="ml" className="font-ml font-semibold text-fg">മ</span> Malayalam &amp; English</li>
              <li className="flex list-none items-center gap-2"><Link2 size={15} aria-hidden /> Every claim sourced</li>
            </ul>
          </div>
          <RecordPreview />
        </section>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-line bg-panel-2 py-[clamp(3.5rem,7vw,6.5rem)]" aria-labelledby="how-title">
        <div className="lp-wrap">
          <h2 id="how-title" className="lp-h2">From a voice note to a record you can check</h2>
          <p className="mt-3 max-w-[40rem] text-fg-muted">No accounts and no forms to learn. Reports come in however people send them, and the record does the sorting.</p>
          <ol className="mt-10 grid gap-4 p-0 md:grid-cols-3 md:gap-6">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="list-none rounded-[14px] border border-line bg-panel p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent-tint text-deep-canal"><Icon size={20} aria-hidden /></span>
                  <span className="tabular text-sm font-medium text-fg-faint">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-[1.2rem] font-semibold">{title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Field records */}
      <section id="field-records" className="lp-wrap scroll-mt-4 py-[clamp(3.5rem,7vw,6.5rem)]" aria-labelledby="gallery-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="gallery-title" className="lp-h2">Field records</h2>
            <p className="mt-3 text-fg-muted">Three synthetic incidents. Open a record to compare its sources.</p>
          </div>
          <Link href="/dashboard" className="lp-textlink">See all on the incident board <ArrowUpRight size={16} aria-hidden /></Link>
        </div>
        <div className="mt-8 grid items-start gap-[clamp(1rem,2vw,2rem)] sm:grid-cols-2 lg:grid-cols-3">
          {records.map(({ art, place, title, ml, en, note }) => (
            <details className="field-record group" key={art}>
              <summary>
                <div className="field-print"><IncidentPrint kind={art} /></div>
                <div className="flex items-end justify-between gap-2 py-3.5">
                  <div>
                    <span className="text-sm text-fg-muted">{place}</span>
                    <h3 className="mt-1 text-[clamp(1.15rem,1.6vw,1.45rem)] font-semibold leading-snug">{title}</h3>
                  </div>
                  <span className="field-toggle"><ArrowDown size={18} aria-hidden /><span className="visually-hidden">Show sources</span></span>
                </div>
              </summary>
              <div className="border-t border-line py-4">
                <p className="text-xs font-semibold text-fg-muted">Voice · Malayalam excerpt</p>
                <blockquote lang="ml" className="mx-0 mb-4 mt-1.5 font-ml leading-relaxed">{ml}</blockquote>
                <p className="text-xs font-semibold text-fg-muted">Text · English</p>
                <blockquote className="mx-0 mb-4 mt-1.5 leading-relaxed">{en}</blockquote>
                <strong className="block border-l-[3px] border-deep-canal pl-3 text-sm font-medium">{note}</strong>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="lp-wrap pb-8" aria-labelledby="cta-title">
        <div className="lp-cta relative overflow-hidden rounded-[20px] bg-deep-canal px-[clamp(1.5rem,5vw,4.5rem)] py-[clamp(2.5rem,6vw,5rem)] text-white">
          <div className="relative grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 id="cta-title" className="max-w-[18ch] text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">Seen something nearby?</h2>
              <p className="mt-4 max-w-[34rem] text-[1.05rem] leading-normal text-white/75">Record a voice note or write a report. You can check the details before you send it.</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/report" className="lp-btn lp-btn-primary"><Plus size={18} aria-hidden /> Report an incident</Link>
              <Link href="/dashboard" className="lp-btn lp-btn-ghost">Incident board <ArrowUpRight size={18} aria-hidden /></Link>
            </div>
          </div>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 py-8 text-sm text-fg-faint">
          <span>Backwater Trace · Alappuzha, Kerala</span>
          <span>Example records on this page are synthetic.</span>
        </footer>
      </section>
    </main>
  );
}
