import type { MetadataRoute } from "next";
import { getDashboardData } from "@/lib/services/queries";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/dashboard`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${base}/llms.txt`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/llms-full.txt`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
  try {
    const { incidents } = await getDashboardData();
    for (const i of incidents) {
      entries.push({
        url: `${base}/incidents/${i.id}`,
        lastModified: new Date(i.last_reported_at),
        changeFrequency: "daily",
        priority: 0.6,
      });
    }
  } catch {
    // Store unavailable at request time: still serve the static routes.
  }
  return entries;
}
