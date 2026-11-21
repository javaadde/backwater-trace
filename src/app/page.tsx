import Link from "next/link";
import { ArrowRight, FileText, Mic } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { buttonClass } from "@/components/ui/button";

const STEPS = [
  {
    title: "Report in your language",
    body: "Speak in Malayalam or type in English. Sarvam AI turns voice into text the reporter corrects before sending.",
    swatch: "hatch",
  },
  {
    title: "Related reports stack into one incident",
    body: "Same category, close by, close in time: the reports become sources of a single incident on the map.",
    swatch: "hatch-dense",
  },
  {
    title: "Disagreements cross, visibly",
    body: "Blocked or partially open, knee-deep or waist-deep: both values sit side by side, each linked to its source.",
    swatch: "hatch-cross",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col">
      <header className="flex h-14 items-center justify-between bg-z0 px-4 text-z10 sm:px-6">
        <Logo />
        <Link href="/dashboard" className="legend flex items-center gap-1.5 text-z7 hover:text-z10">
          Incident board <ArrowRight className="size-3.5" />
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-16">
        <div>
          <h1 className="font-display text-[56px] leading-[0.95] font-semibold tracking-[0.005em] uppercase text-balance sm:text-[84px] lg:text-[96px]">
            Every report, traced to its source.
          </h1>
          <p className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-fg-muted text-pretty">
            Backwater Trace collects flood, canal, waste and road reports from Alappuzha residents in Malayalam and English,
            groups the ones that describe the same incident, and shows exactly where sources disagree, without deciding who is right.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className={buttonClass("primary", "lg")}>
              Open the incident board <ArrowRight />
            </Link>
            <Link href="/report" className={buttonClass("secondary", "lg")}>
              <Mic /> Report incident
            </Link>
          </div>
        </div>

        <RecordSheet />
      </section>

      <section className="border-y border-z0 bg-panel">
        <ol className="mx-auto grid max-w-[1280px] divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STEPS.map((s) => (
            <li key={s.title} className="px-4 py-7 sm:px-6">
              <h2 className="flex items-start gap-3 font-display text-[24px] leading-tight font-semibold uppercase">
                <span aria-hidden className={`${s.swatch} mt-1 size-5 shrink-0 border border-z0 text-z0`} />
                {s.title}
              </h2>
              <p className="mt-2 max-w-[42ch] pl-8 text-[14.5px] leading-relaxed text-fg-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mx-auto w-full max-w-[1280px] px-4 py-6 text-[12.5px] leading-relaxed text-fg-muted sm:px-6">
        Backwater Trace does not decide the truth. It helps coordinators see reports, their sources and their disagreements faster.
        All incidents and reports shown are synthetic demo data.
      </footer>
    </main>
  );
}

/** The product's own record, drawn at life size: two source sheets that disagree on one detail. */
function RecordSheet() {
  return (
    <figure className="relative mx-auto w-full max-w-[560px] pb-10" aria-label="Example incident record with two sources that disagree on road status">
      <div className="settle border border-z0 bg-panel shadow-[0_10px_30px_rgb(12_17_16/0.12)]">
        <div className="flex items-center justify-between bg-z0 px-4 py-2 text-z10">
          <span className="legend">Incident record</span>
          <span className="tabular font-mono text-[11px] text-z7">Synthetic example</span>
        </div>
        <div className="px-4 pt-4 pb-3">
          <div className="font-display text-[26px] leading-none font-semibold uppercase">AC Road flooding at Pallathuruthy</div>
          <dl className="mt-3 grid grid-cols-3 gap-x-4 border-t border-line pt-2.5 text-[12px]">
            <div>
              <dt className="legend !text-[10.5px] text-fg-muted">Category</dt>
              <dd className="mt-0.5">Flooded road</dd>
            </div>
            <div>
              <dt className="legend !text-[10.5px] text-fg-muted">Sources</dt>
              <dd className="tabular mt-0.5 font-mono">02</dd>
            </div>
            <div>
              <dt className="legend !text-[10.5px] text-fg-muted">Status</dt>
              <dd className="mt-0.5 text-warn">Needs verification</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="relative -mt-2 grid grid-cols-2 gap-0 px-2">
        <SourceSheet
          n={1}
          icon="voice"
          when="voice note · Malayalam"
          quote="പള്ളാത്തുരുത്തി ഭാഗത്ത് എസി റോഡിൽ അരയോളം വെള്ളം കയറി, ഗതാഗതം നിലച്ചു."
          ml
          value="Blocked"
          angle="45deg"
          tilt="-1.6deg"
          delay="120ms"
        />
        <SourceSheet
          n={2}
          icon="text"
          when="written · English"
          quote="Flooded at waist level, but one lane is partially open for trucks and buses."
          value="Partially open"
          angle="-45deg"
          tilt="1.4deg"
          delay="220ms"
          className="-ml-1 sm:-ml-6"
        />
        <div
          aria-hidden
          className="settle hatch-cross pointer-events-none absolute bottom-[9px] left-1/2 z-20 h-[18px] w-16 -translate-x-1/2 border border-conflict bg-panel text-conflict"
          style={{ animationDelay: "380ms" }}
        />
      </div>

      <figcaption className="absolute right-0 bottom-0 left-0 flex items-center justify-center gap-2 text-[13px] font-medium text-conflict">
        <span aria-hidden className="hatch-cross size-3.5 border border-conflict" />
        Possible conflict · road status · both sources kept
      </figcaption>
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
  angle,
  tilt,
  delay,
  className = "",
}: {
  n: number;
  icon: "voice" | "text";
  when: string;
  quote: string;
  ml?: boolean;
  value: string;
  angle: string;
  tilt: string;
  delay: string;
  className?: string;
}) {
  return (
    <div
      className={`settle relative border border-z0 bg-panel shadow-[0_6px_18px_rgb(12_17_16/0.14)] ${className}`}
      style={{ ["--tilt" as string]: tilt, animationDelay: delay }}
    >
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="grid size-5 place-items-center border border-z0 [&_svg]:size-3">{icon === "voice" ? <Mic /> : <FileText />}</span>
        <span className="text-[12.5px] font-semibold">Source {n}</span>
      </div>
      <div className="px-3 pt-2 font-mono text-[10.5px] text-fg-muted">{when}</div>
      <p className={`px-3 pt-1.5 text-[13px] leading-snug ${ml ? "font-ml" : ""}`}>{quote}</p>
      <div className="mt-3 border-t border-line px-3 py-2.5">
        <div className="legend !text-[10.5px] text-fg-muted">Road status</div>
        <div className="mt-1 font-display text-[22px] leading-none font-semibold uppercase">{value}</div>
        <div
          aria-hidden
          className="mt-2 h-2 border border-z3 text-z3"
          style={{ backgroundImage: `repeating-linear-gradient(${angle}, currentColor 0 1px, transparent 1px 5px)` }}
        />
      </div>
    </div>
  );
}
