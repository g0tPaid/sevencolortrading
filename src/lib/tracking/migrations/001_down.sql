-- Rollback for 001_init. Drops only shipment-tracking tables.
-- Does not touch analytics, news, inquiry, or factory JSON files.
-- Stop the app first. Prefer moving the tracking sqlite file aside
-- when that file contains only these tables.

DROP TABLE IF EXISTS tracking_rate_limits;
DROP TABLE IF EXISTS tracking_provider_logs;
DROP TABLE IF EXISTS tracking_carrier_leases;
DROP TABLE IF EXISTS tracking_refresh_queue;
DROP TABLE IF EXISTS tracking_work_claims;
DROP TABLE IF EXISTS shipment_events;
DROP TABLE IF EXISTS shipments;
DROP TABLE IF EXISTS tracking_settings;
DELETE FROM schema_migrations WHERE id = '001_init';
