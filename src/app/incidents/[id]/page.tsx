import type { Metadata } from "next";
import { TopBar } from "@/components/dashboard/top-bar";
import { IncidentDetailView } from "@/components/reports/incident-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { getIncidentDetail } from "@/lib/services/queries";
import { CATEGORY_LABEL } from "@/lib/labels";
import { SITE, siteUrl } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  try {
    return await getIncidentDetail(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = await load(id);
  if (!detail) return { title: "Incident", robots: { index: false } };
  const { incident } = detail;
  const conflicts = incident.contradiction_count;
  const description =
    `${CATEGORY_LABEL[incident.category]} in Alappuzha: ${incident.report_count} source report${incident.report_count === 1 ? "" : "s"}` +
    (conflicts ? `, ${conflicts} possible conflict${conflicts === 1 ? "" : "s"} needing verification` : ", no conflicts flagged") +
    ".";
  return {
    title: incident.title,
    description,
    alternates: { canonical: `/incidents/${id}` },
    openGraph: { type: "article", title: incident.title, description, url: `/incidents/${id}` },
    twitter: { card: "summary_large_image", title: incident.title, description },
  };
}

export default async function IncidentPage({ params }: Props) {
  const { id } = await params;
  const detail = await load(id);
  const base = siteUrl();
  return (
    <div className="flex min-h-dvh flex-col">
      {detail ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            url: `${base}/incidents/${id}`,
            name: detail.incident.title,
            isPartOf: { "@id": `${base}/#website` },
            about: {
              "@type": "Event",
              name: detail.incident.title,
              description: `${CATEGORY_LABEL[detail.incident.category]} reported by ${detail.incident.report_count} source(s).`,
              eventStatus: "https://schema.org/EventScheduled",
              location: { "@type": "Place", name: "Alappuzha, Kerala, India" },
            },
            publisher: { "@type": "Organization", name: SITE.name },
          }}
        />
      ) : null}
      <TopBar />
      <main className="flex flex-1 flex-col">
        <IncidentDetailView id={id} />
      </main>
    </div>
  );
}
