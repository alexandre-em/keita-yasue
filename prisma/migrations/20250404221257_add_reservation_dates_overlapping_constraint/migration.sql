-- This is an empty migration.
ALTER TABLE reservations
ADD CONSTRAINT no_overlapping_reservations EXCLUDE USING GIST (
  author_id WITH =,
  tsrange(start_date, end_date) WITH &&
)
