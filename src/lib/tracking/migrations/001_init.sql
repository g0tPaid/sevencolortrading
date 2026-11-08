-- Additive shipment tracking schema. Safe to re-run.
-- Does not read or modify analytics, news, inquiry, or factory JSON files.

CREATE TABLE IF NOT EXISTS schema_migrations (
  id TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tracking_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  new_interval_hours REAL NOT NULL,
  active_interval_hours REAL NOT NULL,
  stalled_interval_hours REAL NOT NULL,
  stalled_after_hours REAL NOT NULL,
  max_consecutive_failures INTEGER NOT NULL,
  global_concurrency INTEGER NOT NULL,
  per_carrier_concurrency INTEGER NOT NULL,
  per_carrier_gap_ms INTEGER NOT NULL,
  public_refresh_cooldown_minutes INTEGER NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT INTO tracking_settings (
  id,
  new_interval_hours,
  active_interval_hours,
  stalled_interval_hours,
  stalled_after_hours,
  max_consecutive_failures,
  global_concurrency,
  per_carrier_concurrency,
  per_carrier_gap_ms,
  public_refresh_cooldown_minutes,
  updated_at
) VALUES (
  1, 5, 10, 18, 48, 8, 2, 1, 2000, 15, '1970-01-01T00:00:00.000Z'
)
ON CONFLICT(id) DO NOTHING;

CREATE TABLE IF NOT EXISTS shipments (
  id TEXT PRIMARY KEY,
  customer_ref TEXT,
  customer_name TEXT,
  order_number TEXT,
  tracking_number TEXT NOT NULL,
  tracking_number_norm TEXT NOT NULL,
  carrier_id TEXT,
  carrier_resolution TEXT NOT NULL,
  carrier_candidates TEXT,
  origin TEXT,
  destination TEXT,
  origin_country TEXT,
  destination_country TEXT,
  postcode TEXT,
  phone_last4 TEXT,
  status TEXT NOT NULL,
  status_detail TEXT,
  eta TEXT,
  last_event_at TEXT,
  last_refreshed_at TEXT,
  next_check_at TEXT,
  refresh_stopped INTEGER NOT NULL DEFAULT 0,
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS shipments_number_carrier
  ON shipments (tracking_number_norm, carrier_id)
  WHERE carrier_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS shipments_number_unresolved
  ON shipments (tracking_number_norm)
  WHERE carrier_id IS NULL;

CREATE INDEX IF NOT EXISTS shipments_due
  ON shipments (next_check_at)
  WHERE refresh_stopped = 0;

CREATE INDEX IF NOT EXISTS shipments_order ON shipments (order_number);
CREATE INDEX IF NOT EXISTS shipments_customer_name ON shipments (customer_name);
CREATE INDEX IF NOT EXISTS shipments_customer_ref ON shipments (customer_ref);
CREATE INDEX IF NOT EXISTS shipments_status ON shipments (status);
CREATE INDEX IF NOT EXISTS shipments_updated ON shipments (updated_at);

CREATE TABLE IF NOT EXISTS shipment_events (
  id TEXT PRIMARY KEY,
  shipment_id TEXT NOT NULL REFERENCES shipments (id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,
  occurred_at TEXT,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  stage TEXT,
  tie_order INTEGER,
  created_at TEXT NOT NULL,
  UNIQUE (shipment_id, fingerprint)
);

CREATE INDEX IF NOT EXISTS shipment_events_shipment
  ON shipment_events (shipment_id, occurred_at);

CREATE TABLE IF NOT EXISTS tracking_work_claims (
  shipment_id TEXT PRIMARY KEY REFERENCES shipments (id) ON DELETE CASCADE,
  owner TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  purpose TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS tracking_work_claims_expiry
  ON tracking_work_claims (expires_at);

CREATE TABLE IF NOT EXISTS tracking_refresh_queue (
  id TEXT PRIMARY KEY,
  shipment_id TEXT NOT NULL REFERENCES shipments (id) ON DELETE CASCADE,
  state TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS tracking_refresh_queue_open
  ON tracking_refresh_queue (shipment_id)
  WHERE state IN ('queued', 'running');

CREATE INDEX IF NOT EXISTS tracking_refresh_queue_state
  ON tracking_refresh_queue (state, created_at);

CREATE TABLE IF NOT EXISTS tracking_carrier_leases (
  carrier_id TEXT PRIMARY KEY,
  next_allowed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tracking_provider_logs (
  id TEXT PRIMARY KEY,
  shipment_id TEXT REFERENCES shipments (id) ON DELETE SET NULL,
  carrier_id TEXT,
  outcome TEXT NOT NULL,
  http_status INTEGER,
  duration_ms INTEGER,
  error_kind TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS tracking_provider_logs_shipment
  ON tracking_provider_logs (shipment_id, created_at);

CREATE INDEX IF NOT EXISTS tracking_provider_logs_created
  ON tracking_provider_logs (created_at);

CREATE TABLE IF NOT EXISTS tracking_rate_limits (
  bucket TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (bucket, window_start)
);

INSERT INTO schema_migrations (id, applied_at)
VALUES ('001_init', '1970-01-01T00:00:00.000Z')
ON CONFLICT(id) DO NOTHING;
