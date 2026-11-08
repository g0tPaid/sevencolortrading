-- Public tracking cache. Separate from admin shipments.
-- Additive. Safe to run once. Does not read or change customer shipment rows.

ALTER TABLE tracking_settings ADD COLUMN public_daily_cap INTEGER NOT NULL DEFAULT 2000;
ALTER TABLE tracking_settings ADD COLUMN public_fresh_hours REAL NOT NULL DEFAULT 6;
ALTER TABLE tracking_settings ADD COLUMN public_interest_hours REAL NOT NULL DEFAULT 48;
ALTER TABLE tracking_settings ADD COLUMN public_max_rows INTEGER NOT NULL DEFAULT 2000;
ALTER TABLE tracking_settings ADD COLUMN public_concurrency INTEGER NOT NULL DEFAULT 1;
ALTER TABLE tracking_settings ADD COLUMN public_outstanding_cap INTEGER NOT NULL DEFAULT 20;

CREATE TABLE IF NOT EXISTS public_track_cache (
  id TEXT PRIMARY KEY,
  tracking_number TEXT NOT NULL,
  carrier_id TEXT,
  carrier_resolution TEXT NOT NULL,
  carrier_candidates TEXT,
  status TEXT NOT NULL,
  status_detail TEXT,
  origin TEXT,
  destination TEXT,
  origin_country TEXT,
  destination_country TEXT,
  eta TEXT,
  outcome TEXT NOT NULL,
  message TEXT,
  fetched_at TEXT,
  fresh_until TEXT,
  interest_until TEXT,
  next_check_at TEXT,
  refresh_stopped INTEGER NOT NULL DEFAULT 0,
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_track_number_carrier
  ON public_track_cache (tracking_number, carrier_id)
  WHERE carrier_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS public_track_number_open
  ON public_track_cache (tracking_number)
  WHERE carrier_id IS NULL;

CREATE INDEX IF NOT EXISTS public_track_fresh ON public_track_cache (fresh_until);
CREATE INDEX IF NOT EXISTS public_track_interest ON public_track_cache (interest_until, next_check_at);

CREATE TABLE IF NOT EXISTS public_track_events (
  id TEXT PRIMARY KEY,
  cache_id TEXT NOT NULL REFERENCES public_track_cache (id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,
  occurred_at TEXT,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  stage TEXT,
  tie_order INTEGER,
  created_at TEXT NOT NULL,
  UNIQUE (cache_id, fingerprint)
);

CREATE INDEX IF NOT EXISTS public_track_events_cache
  ON public_track_events (cache_id, occurred_at);

CREATE TABLE IF NOT EXISTS public_track_jobs (
  id TEXT PRIMARY KEY,
  cache_id TEXT NOT NULL REFERENCES public_track_cache (id) ON DELETE CASCADE,
  state TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_track_jobs_open
  ON public_track_jobs (cache_id)
  WHERE state IN ('queued', 'running');

CREATE TABLE IF NOT EXISTS public_track_claims (
  cache_id TEXT PRIMARY KEY REFERENCES public_track_cache (id) ON DELETE CASCADE,
  owner TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
