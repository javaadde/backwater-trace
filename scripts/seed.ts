/**
 * Reset the database to the synthetic demo dataset.
 *   pnpm seed          → Supabase if SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set, else .data/db.json
 * Timestamps are relative to "now", so re-run shortly before a demo.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { buildSeed } from "../src/lib/seed";

async function main() {
  const data = buildSeed(new Date());
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    const dir = path.join(process.cwd(), ".data");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "db.json"), JSON.stringify(data, null, 2));
    console.log(`Seeded local store (.data/db.json): ${data.incidents.length} incidents, ${data.reports.length} reports.`);
    return;
  }

  const db = createClient(url, key, { auth: { persistSession: false } });
  const NONE = "00000000-0000-0000-0000-000000000000";
  for (const table of ["contradictions", "reports", "incidents"] as const) {
    const { error } = await db.from(table).delete().neq("id", NONE);
    if (error) throw new Error(`clear ${table}: ${error.message}`);
  }
  for (const [table, rows] of [
    ["incidents", data.incidents],
    ["reports", data.reports],
    ["contradictions", data.contradictions],
  ] as const) {
    if (!rows.length) continue;
    const { error } = await db.from(table).insert(rows as never);
    if (error) throw new Error(`insert ${table}: ${error.message}`);
  }
  console.log(`Seeded Supabase: ${data.incidents.length} incidents, ${data.reports.length} reports, ${data.contradictions.length} contradictions.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
