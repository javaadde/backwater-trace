import "server-only";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Contradiction, Incident, Report } from "@/types/domain";
import type { DataStore } from "./types";
import { buildSeed } from "@/lib/seed";

interface DbFile {
  incidents: Incident[];
  reports: Report[];
  contradictions: Contradiction[];
}

const ROOT = process.env.VERCEL ? path.join(os.tmpdir(), "backwater-trace") : path.join(process.cwd(), ".data");
const DB_PATH = path.join(ROOT, "db.json");
export const LOCAL_UPLOAD_ROOT = path.join(ROOT, "uploads");

let queue: Promise<unknown> = Promise.resolve();
/** Serialize file access so concurrent requests don't clobber each other. */
function serial<T>(fn: () => Promise<T>): Promise<T> {
  const next = queue.then(fn, fn);
  queue = next.catch(() => undefined);
  return next;
}

async function readDb(): Promise<DbFile> {
  try {
    return JSON.parse(await fs.readFile(DB_PATH, "utf8")) as DbFile;
  } catch {
    const seeded = buildSeed(new Date());
    await writeDb(seeded);
    return seeded;
  }
}

async function writeDb(db: DbFile): Promise<void> {
  await fs.mkdir(ROOT, { recursive: true });
  const tmp = `${DB_PATH}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2));
  await fs.rename(tmp, DB_PATH);
}

function safeUploadPath(rel: string): string {
  const full = path.resolve(LOCAL_UPLOAD_ROOT, rel);
  if (!full.startsWith(path.resolve(LOCAL_UPLOAD_ROOT) + path.sep)) throw new Error("Invalid path");
  return full;
}

export function createLocalStore(): DataStore {
  return {
    kind: "local",
    listIncidents: () => serial(async () => (await readDb()).incidents),
    getIncident: (id) => serial(async () => (await readDb()).incidents.find((i) => i.id === id) ?? null),
    listReports: (filter) =>
      serial(async () => (await readDb()).reports.filter((r) => !filter?.incidentId || r.incident_id === filter.incidentId)),
    listContradictions: (filter) =>
      serial(async () =>
        (await readDb()).contradictions.filter((c) => !filter?.incidentId || c.incident_id === filter.incidentId),
      ),
    insertIncident: (incident) =>
      serial(async () => {
        const db = await readDb();
        db.incidents.push(incident);
        await writeDb(db);
      }),
    updateIncident: (id, patch) =>
      serial(async () => {
        const db = await readDb();
        db.incidents = db.incidents.map((i) => (i.id === id ? { ...i, ...patch } : i));
        await writeDb(db);
      }),
    insertReport: (report) =>
      serial(async () => {
        const db = await readDb();
        db.reports.push(report);
        await writeDb(db);
      }),
    insertContradictions: (rows) =>
      serial(async () => {
        if (!rows.length) return;
        const db = await readDb();
        db.contradictions.push(...rows);
        await writeDb(db);
      }),
    deleteIncident: (id) =>
      serial(async () => {
        const db = await readDb();
        db.incidents = db.incidents.filter((i) => i.id !== id);
        await writeDb(db);
      }),
    replaceAll: (data) => serial(() => writeDb(data)),
    uploadEvidence: async (rel, bytes) => {
      const full = safeUploadPath(rel);
      await fs.mkdir(path.dirname(full), { recursive: true });
      await fs.writeFile(full, bytes);
    },
    signedEvidenceUrl: async (rel) => `/api/evidence/${rel.split("/").map(encodeURIComponent).join("/")}`,
  };
}

export async function readLocalEvidence(rel: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(safeUploadPath(rel));
  } catch {
    return null;
  }
}
