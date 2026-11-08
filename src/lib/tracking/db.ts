import { mkdirSync } from "fs";
import { DatabaseSync } from "node:sqlite";
import path from "path";
import { readFileSync } from "fs";

const FALLBACK_DIR = "/tmp/sourcing-analytics";
let current: DatabaseSync | null = null;

function canWriteDir(dir: string): boolean {
  try {
    mkdirSync(dir, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

export function defaultTrackingDbPath(): string {
  if (process.env.TRACKING_DB_PATH?.trim()) return process.env.TRACKING_DB_PATH.trim();
  const preferred = process.env.ANALYTICS_DATA_DIR || process.env.DATA_DIR || "/data";
  const dir = canWriteDir(preferred) ? preferred : FALLBACK_DIR;
  if (dir === FALLBACK_DIR) mkdirSync(FALLBACK_DIR, { recursive: true });
  return path.join(dir, "shipments.sqlite");
}

function migrationSql(name: string): string {
  return readFileSync(path.join(process.cwd(), "src/lib/tracking/migrations", name), "utf8");
}

export function applyMigrations(db: DatabaseSync): void {
  db.exec(migrationSql("001_init.sql"));
  db.prepare(
    `UPDATE schema_migrations
     SET applied_at = ?
     WHERE id = '001_init' AND applied_at = '1970-01-01T00:00:00.000Z'`,
  ).run(new Date().toISOString());
  const applied = db.prepare("SELECT id FROM schema_migrations WHERE id = '002_public_cache'").get();
  if (!applied) {
    db.exec(migrationSql("002_public_cache.sql"));
    db.prepare("INSERT INTO schema_migrations (id, applied_at) VALUES ('002_public_cache', ?)").run(
      new Date().toISOString(),
    );
  }
  const attempts = db.prepare("SELECT id FROM schema_migrations WHERE id = '003_attempt_log'").get();
  if (!attempts) {
    db.exec(migrationSql("003_attempt_log.sql"));
    db.prepare("INSERT INTO schema_migrations (id, applied_at) VALUES ('003_attempt_log', ?)").run(
      new Date().toISOString(),
    );
  }
  const forwarder = db.prepare("SELECT id FROM schema_migrations WHERE id = '004_forwarder_source'").get();
  if (!forwarder) {
    db.exec(migrationSql("004_forwarder_source.sql"));
    db.prepare("INSERT INTO schema_migrations (id, applied_at) VALUES ('004_forwarder_source', ?)").run(
      new Date().toISOString(),
    );
  }
  const greeting = db.prepare("SELECT id FROM schema_migrations WHERE id = '005_greeting_name'").get();
  if (!greeting) {
    db.exec(migrationSql("005_greeting_name.sql"));
    db.prepare("INSERT INTO schema_migrations (id, applied_at) VALUES ('005_greeting_name', ?)").run(
      new Date().toISOString(),
    );
  }
}

export function openDatabase(file = defaultTrackingDbPath()): DatabaseSync {
  if (file !== ":memory:") mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA foreign_keys = ON");
  db.exec("PRAGMA busy_timeout = 5000");
  try {
    db.exec("PRAGMA journal_mode = WAL");
  } catch {
    // :memory: and unusual filesystems can refuse WAL. The default journal still locks.
  }
  applyMigrations(db);
  return db;
}

export function useTrackingDatabase(file: string): DatabaseSync {
  if (current) current.close();
  current = openDatabase(file);
  return current;
}

export function closeTrackingDatabase(): void {
  if (current) current.close();
  current = null;
}

export function getDb(): DatabaseSync {
  if (!current) current = openDatabase();
  return current;
}

export function withImmediate<T>(fn: (db: DatabaseSync) => T): T {
  const db = getDb();
  let last: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      db.exec("BEGIN IMMEDIATE");
      try {
        const value = fn(db);
        db.exec("COMMIT");
        return value;
      } catch (error) {
        try {
          db.exec("ROLLBACK");
        } catch {
          // The connection may already be unlocked.
        }
        throw error;
      }
    } catch (error) {
      last = error;
      const message = error instanceof Error ? error.message : "";
      if (!/locked|busy/i.test(message) || attempt === 3) throw error;
    }
  }
  throw last instanceof Error ? last : new Error("database busy");
}
