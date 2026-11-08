-- SQLite cannot drop attempt_log in place. The column is unused if auto-resolve is removed.
DELETE FROM schema_migrations WHERE id = '003_attempt_log';
