import { jsonLdString } from "@/lib/site";

/** Renders schema.org JSON-LD. Native <script> per the Next.js JSON-LD guide; `<` is escaped against XSS. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}
