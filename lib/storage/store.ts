import { appendRecord, findRecord, listRecords, upsertRecord } from "./json-store";
import { supabaseStore } from "./supabase-store";
import type { StorageAdapter } from "./types";

const jsonStore: StorageAdapter = {
  listRecords,
  upsertRecord,
  findRecord,
  appendRecord,
};

export function getStorageAdapter(): StorageAdapter {
  if (process.env.MEKI_STORAGE_DRIVER === "supabase") {
    return supabaseStore;
  }

  return jsonStore;
}

export const storage = getStorageAdapter();
