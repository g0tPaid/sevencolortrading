declare module "node:sqlite" {
  export type SqlValue = string | number | bigint | null | Uint8Array;

  export interface StatementResult {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }

  export interface StatementSync {
    run(...values: SqlValue[]): StatementResult;
    get(...values: SqlValue[]): Record<string, SqlValue> | undefined;
    all(...values: SqlValue[]): Array<Record<string, SqlValue>>;
  }

  export class DatabaseSync {
    constructor(path: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
