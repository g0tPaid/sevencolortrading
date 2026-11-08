-- Rollback for 002_public_cache only. Admin shipment tables stay.
-- SQLite cannot drop the added settings columns in place. They are unused if this cache is removed.

DROP TABLE IF EXISTS public_track_claims;
DROP TABLE IF EXISTS public_track_jobs;
DROP TABLE IF EXISTS public_track_events;
DROP TABLE IF EXISTS public_track_cache;
DELETE FROM schema_migrations WHERE id = '002_public_cache';
