import "server-only";
import type { DataStore } from "./types";
import { createLocalStore } from "./local";
import { createSupabaseStore } from "./supabase";

let store: DataStore | null = null;

/**
 * Supabase when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set; otherwise a
 * local JSON file so the app runs before credentials exist.
 */
export function getStore(): DataStore {
  if (store) return store;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  store = url && key ? createSupabaseStore(url, key) : createLocalStore();
  return store;
}

export type { DataStore };
