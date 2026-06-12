import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

type StoreShape = Record<string, unknown[]>;

const storageDir = process.env.MEKI_STORAGE_DIR || path.join(process.cwd(), ".data");
const storageFile = path.join(storageDir, "meki-store.json");

async function readStore(): Promise<StoreShape> {
  try {
    const file = await readFile(storageFile, "utf8");
    return JSON.parse(file) as StoreShape;
  } catch {
    return {};
  }
}

async function writeStore(store: StoreShape) {
  await mkdir(storageDir, { recursive: true });
  await writeFile(storageFile, JSON.stringify(store, null, 2), "utf8");
}

export async function listRecords<T>(collection: string): Promise<T[]> {
  const store = await readStore();
  return ((store[collection] || []) as T[]).slice();
}

export async function upsertRecord<T extends object>(
  collection: string,
  idKey: keyof T,
  record: T,
) {
  const store = await readStore();
  const records = ((store[collection] || []) as T[]).slice();
  const index = records.findIndex((item) => item[idKey] === record[idKey]);

  if (index >= 0) {
    records[index] = { ...records[index], ...record };
  } else {
    records.push(record);
  }

  store[collection] = records;
  await writeStore(store);
  return record;
}

export async function findRecord<T extends object>(
  collection: string,
  predicate: (record: T) => boolean,
) {
  const records = await listRecords<T>(collection);
  return records.find(predicate) || null;
}

export async function appendRecord<T extends object>(
  collection: string,
  record: T,
) {
  const store = await readStore();
  const records = ((store[collection] || []) as T[]).slice();
  records.push(record);
  store[collection] = records;
  await writeStore(store);
  return record;
}
