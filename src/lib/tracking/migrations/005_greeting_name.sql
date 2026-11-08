-- Optional given name for a forwarder greeting. Never a full recipient record.
ALTER TABLE public_track_cache ADD COLUMN greeting_name TEXT;
