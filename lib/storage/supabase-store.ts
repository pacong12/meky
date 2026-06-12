import type { StorageAdapter } from "./types";

const supabaseUrl = process.env.SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

type SupabaseRequestInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

const collectionTable: Record<string, string> = {
  waitlist: "meki_waitlist",
  rewardClaims: "meki_reward_claims",
};

function isConfigured() {
  return Boolean(supabaseUrl && serviceRoleKey);
}

function getTable(collection: string) {
  const table = collectionTable[collection];

  if (!table) {
    throw new Error(`No Supabase table mapped for collection: ${collection}`);
  }

  return table;
}

async function supabaseRequest<T>(table: string, init: SupabaseRequestInit = {}) {
  if (!isConfigured()) {
    throw new Error("Supabase storage is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export const supabaseStore: StorageAdapter = {
  async listRecords<T>(collection: string) {
    const table = getTable(collection);
    const rows = await supabaseRequest<Array<{ data: T }>>(
      `${table}?select=data&order=created_at.desc`,
    );
    return rows.map((row) => row.data);
  },

  async upsertRecord<T extends object>(collection: string, idKey: keyof T, record: T) {
    const table = getTable(collection);
    const storageId = String(record[idKey] || "");

    await supabaseRequest(`${table}?on_conflict=storage_id`, {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        storage_id: storageId,
        data: record,
      }),
    });

    return record;
  },

  async findRecord<T extends object>(
    collection: string,
    predicate: (record: T) => boolean,
  ) {
    const records = await this.listRecords<T>(collection);
    return records.find(predicate) || null;
  },

  async appendRecord<T extends object>(collection: string, record: T) {
    const table = getTable(collection);
    const storageId =
      "claimId" in record
        ? String(record.claimId)
        : "storageId" in record
          ? String(record.storageId)
          : crypto.randomUUID();

    await supabaseRequest(table, {
      method: "POST",
      body: JSON.stringify({
        storage_id: storageId,
        data: record,
      }),
    });

    return record;
  },
};
