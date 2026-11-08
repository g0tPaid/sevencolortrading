-- SQLite cannot drop the added columns in place. They are unused if the forwarder source is removed.
DELETE FROM schema_migrations WHERE id = '004_forwarder_source';
