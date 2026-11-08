-- SQLite cannot drop greeting_name in place.
DELETE FROM schema_migrations WHERE id = '005_greeting_name';
