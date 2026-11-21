import Link from "next/link";
import { ArrowRight, GitBranch, Mic, TriangleExclamationPoint } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { buttonClass } from "@/components/ui/button";

const STEPS = [
  {
    icon: Mic,
    title: "Report in your language",
    body: "Speak in Malayalam or type in English. Sarvam AI turns voice into text you can correct before sending.",
  },
  {
    icon: GitBranch,
    title: "Related reports group together",
    body: "Reports of the same category, close by and close in time, are grouped into one incident on the map.",
  },
  {
    icon: TriangleExclamationPoint,
    title: "Disagreements are surfaced",
    body: "When sources differ — knee-deep or waist-deep, blocked or open — both are shown side by side to verify.",
  },
];

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #26313f 1px, transparent 0)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
        }}
      />
      <header className="relative flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-tight">Backwater Trace</span>
        </div>
        <Link href="/dashboard" className="text-sm text-fg-muted hover:text-fg">
          Incident board →
        </Link>
      </header>

      <section className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-16">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Alappuzha · ആലപ്പുഴ</div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          See which reports describe the same incident — and where they disagree.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted text-pretty">
          Backwater Trace collects flood, canal, waste and road reports from residents in Malayalam and English, groups them on a
          map, and keeps every claim linked to its original source.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className={buttonClass("primary", "lg")}>
            View live incidents <ArrowRight />
          </Link>
          <Link href="/report" className={buttonClass("secondary", "lg")}>
            <Mic /> Report an incident
          </Link>
        </div>

        <ol className="mt-16 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-line bg-panel/80 p-5 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
                  <s.icon className="size-4" />
                </span>
                <span className="tabular font-mono text-xs text-fg-faint">0{i + 1}</span>
              </div>
              <h2 className="mt-3 text-[15px] font-semibold">{s.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="relative px-6 py-5 text-xs text-fg-faint">
        Backwater Trace doesn&apos;t decide the truth automatically. It helps people understand reports, their sources and
        conflicts faster. Demo data is synthetic.
      </footer>
    </main>
  );
}
