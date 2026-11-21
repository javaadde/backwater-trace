import Link from "next/link";
import { FileText, Mic } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { buttonClass } from "@/components/ui/button";

const STEPS = [
  {
    title: "Report in your language",
    body: "Speak in Malayalam or type in English. Sarvam AI turns voice into text the reporter corrects before sending.",
  },
  {
    title: "Related reports stack into one incident",
    body: "Same category, close by, close in time: the reports become sources of a single incident on the map.",
  },
  {
    title: "Disagreements cross, visibly",
    body: "Blocked or partially open, knee-deep or waist-deep: both values sit side by side, each linked to its source.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col">
      <header className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6">
        <Logo />
        <Link href="/dashboard" className="flex h-9 items-center rounded-md px-3 text-[14px] whitespace-nowrap font-medium text-fg-muted hover:bg-panel-2 hover:text-fg">
          Incident board
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20 lg:py-20">
        <div>
          <h1 className="font-display text-[44px] leading-[1.02] font-semibold text-balance sm:text-[60px] lg:text-[68px]">
            Every report, traced to its source.
          </h1>
          <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-fg-muted text-pretty">
            Backwater Trace collects flood, canal, waste and road reports from Alappuzha residents in Malayalam and English,
            groups the ones that describe the same incident, and shows exactly where sources disagree, without deciding who is right.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/dashboard" className={buttonClass("primary", "lg")}>
              Open the incident board
            </Link>
            <Link href="/report" className={buttonClass("secondary", "lg")}>
              <Mic /> Report incident
            </Link>
          </div>
        </div>

        <RecordSheet />
      </section>

      <section className="border-t border-line">
        <ol className="mx-auto grid max-w-[1280px] gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6">
          {STEPS.map((s) => (
            <li key={s.title}>
              <h2 className="font-display text-[17px] leading-snug font-semibold">{s.title}</h2>
              <p className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-fg-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mx-auto w-full max-w-[1280px] border-t border-line px-4 py-8 text-[13px] leading-relaxed text-fg-faint sm:px-6">
        Backwater Trace does not decide the truth. It helps coordinators see reports, their sources and their disagreements faster.
        All incidents and reports shown are synthetic demo data.
      </footer>
    </main>
  );
}

/** The product's own record, drawn at life size: two source sheets that disagree on one detail. */
function RecordSheet() {
  return (
    <figure className="mx-auto w-full max-w-[540px]" aria-label="Example incident record with two sources that disagree on road status">
      <div className="overflow-hidden rounded-xl border border-line bg-panel">
        <div className="flex items-center justify-between px-5 pt-4 text-[12px] text-fg-faint">
          <span>Incident record</span>
          <span>Synthetic example</span>
        </div>
        <div className="px-5 pt-2 pb-4">
          <div className="font-display text-[20px] leading-snug font-semibold">AC Road flooding at Pallathuruthy</div>
          <dl className="mt-3 grid grid-cols-3 gap-x-4 text-[13px]">
            <div>
              <dt className="text-[12px] text-fg-faint">Category</dt>
              <dd className="mt-0.5">Flooded road</dd>
            </div>
            <div>
              <dt className="text-[12px] text-fg-faint">Sources</dt>
              <dd className="tabular mt-0.5">02</dd>
            </div>
            <div>
              <dt className="text-[12px] text-fg-faint">Status</dt>
              <dd className="mt-0.5 text-warn">Needs verification</dd>
            </div>
          </dl>
        </div>
      <div className="grid grid-cols-2 border-t border-line">
        <SourceSheet
          n={1}
          icon="voice"
          when="Voice, Malayalam"
          quote="പള്ളാത്തുരുത്തി ഭാഗത്ത് എസി റോഡിൽ അരയോളം വെള്ളം കയറി, ഗതാഗതം നിലച്ചു."
          ml
          value="Blocked"
        />
        <SourceSheet
          n={2}
          icon="text"
          when="Written, English"
          quote="Flooded at waist level, but one lane is partially open for trucks and buses."
          value="Partially open"
          className="border-l border-line"
        />
      </div>
      <figcaption className="flex items-center gap-2 border-t border-line px-5 py-3 text-[13px] font-medium text-conflict">
        <span aria-hidden className="hatch-cross size-3 rounded-[3px] border border-conflict" />
        Possible conflict on road status, both sources kept
      </figcaption>
      </div>
    </figure>
  );
}

function SourceSheet({
  n,
  icon,
  when,
  quote,
  ml,
  value,
  className = "",
}: {
  n: number;
  icon: "voice" | "text";
  when: string;
  quote: string;
  ml?: boolean;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col px-5 py-4 ${className}`}>
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-fg-faint [&_svg]:size-3.5">{icon === "voice" ? <Mic /> : <FileText />}</span>
        <span className="font-semibold">Source {n}</span>
        <span className="text-fg-faint">{when}</span>
      </div>
      <p className={`mt-2 flex-1 text-[13.5px] leading-snug text-fg-muted ${ml ? "font-ml" : ""}`}>{quote}</p>
      <div className="mt-4 text-[12px] text-fg-faint">Road status</div>
      <div className="mt-0.5 text-[17px] font-semibold">{value}</div>
    </div>
  );
}
