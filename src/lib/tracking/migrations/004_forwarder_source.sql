-- Forwarder-page cache metadata. Additive. Does not read or change admin shipment rows.

ALTER TABLE public_track_cache ADD COLUMN provider_version INTEGER;
ALTER TABLE public_track_cache ADD COLUMN reference_code TEXT;
ALTER TABLE public_track_cache ADD COLUMN package_count TEXT;
