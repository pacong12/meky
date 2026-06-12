export type StorageAdapter = {
  listRecords<T>(collection: string): Promise<T[]>;
  upsertRecord<T extends object>(
    collection: string,
    idKey: keyof T,
    record: T,
  ): Promise<T>;
  findRecord<T extends object>(
    collection: string,
    predicate: (record: T) => boolean,
  ): Promise<T | null>;
  appendRecord<T extends object>(collection: string, record: T): Promise<T>;
};
