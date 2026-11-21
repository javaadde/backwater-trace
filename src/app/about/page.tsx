import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { CATEGORIES, ENGINE_RULES, FAQ, MATCH_THRESHOLD_DEFAULT, ROUTES, SITE, STACK, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About — what it does, how it works, stack",
  description: `${SITE.short} Problem, approach, matching rules, tech stack and limits for ${SITE.hackathon}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const base = siteUrl();
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 96px", lineHeight: 1.65 }}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              "@id": `${base}/about#page`,
              url: `${base}/about`,
              name: `About ${SITE.name}`,
              description: SITE.description,
              isPartOf: { "@id": `${base}/#website` },
              mainEntity: { "@id": `${base}/#app` },
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQ.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />

      <p><Link href="/">← {SITE.name}</Link></p>
      <h1 style={{ fontSize: "2.25rem", margin: "16px 0" }}>About {SITE.name}</h1>
      <p>{SITE.description}</p>
      <p>
        Built for <strong>{SITE.hackathon}</strong>. Source code:{" "}
        <a href={SITE.repo}>{SITE.repo.replace("https://", "")}</a>. It is a complete, working product; the pre-loaded sample incidents are synthetic.
      </p>

      <h2>The problem</h2>
      <p>
        When people in Alappuzha describe the same flooded road or blocked canal differently, the accounts are scattered
        and a coordinator cannot tell which incidents are well-sourced or where sources disagree.
      </p>

      <h2>How it works</h2>
      <ol>
        <li>Report by typing, or by recording a Malayalam voice note that Sarvam AI transcribes for review.</li>
        <li>Place a pin and optionally attach a photo.</li>
        <li>The incident engine groups reports about the same event.</li>
        <li>Differences on road access, water level, severity or status become <em>possible conflicts</em>, shown side by side.</li>
        <li>An evidence graph links each claim to the report it came from.</li>
      </ol>
      <p><strong>Provenance over verdicts:</strong> it never decides which report is true.</p>

      <h2>Incident categories</h2>
      <ul>{CATEGORIES.map((c) => <li key={c.id}>{c.label}</li>)}</ul>

      <h2>Matching rules</h2>
      <p>A new report is scored against each unresolved incident; a score of {MATCH_THRESHOLD_DEFAULT} or more groups it.</p>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead><tr><th align="left">Signal</th><th align="right">Points</th></tr></thead>
        <tbody>
          {ENGINE_RULES.map((r) => (
            <tr key={r.signal}><td style={{ padding: "4px 0" }}>{r.signal}</td><td align="right">{r.points}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Pages</h2>
      <ul>
        {ROUTES.map((r) => (
          <li key={r.path}><code>{r.path}</code> — <strong>{r.name}</strong>: {r.what}</li>
        ))}
      </ul>

      <h2>Tech stack</h2>
      <ul>{STACK.map((s) => <li key={s}>{s}</li>)}</ul>

      <h2>Limits</h2>
      <ul>
        <li>Matching and conflict detection are rule-based, not machine-learned.</li>
        <li>No flood prediction, no replacement of authorities, no judging of reporter truthfulness.</li>
        <li>The pre-loaded sample incidents are synthetic; reports you submit are stored and grouped for real.</li>
      </ul>

      <h2>FAQ</h2>
      {FAQ.map((f) => (
        <section key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </section>
      ))}

      <p>
        For AI agents: <a href="/llms.txt">/llms.txt</a> and <a href="/llms-full.txt">/llms-full.txt</a>.
      </p>
    </main>
  );
}
