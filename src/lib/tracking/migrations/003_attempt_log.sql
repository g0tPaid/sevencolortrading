-- Stores which carriers a public lookup tried, without response bodies.
ALTER TABLE public_track_cache ADD COLUMN attempt_log TEXT;
