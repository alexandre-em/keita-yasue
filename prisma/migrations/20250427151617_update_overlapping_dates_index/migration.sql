ALTER TABLE reservations
DROP CONSTRAINT IF EXISTS no_overlapping_reservations;

ALTER TABLE reservations
ADD CONSTRAINT no_overlapping_reservations EXCLUDE USING GIST (
  (true) WITH =,
  tsrange(start_date, end_date) WITH &&
);

