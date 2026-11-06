-- Additive: existing registrations and previous app versions keep Portuguese.
-- Existing RLS and insert-only runtime privileges remain unchanged.
ALTER TABLE skillmkt.waitlist
  ADD COLUMN preferred_language text NOT NULL DEFAULT 'pt'
  CONSTRAINT waitlist_preferred_language_check CHECK (preferred_language IN ('pt', 'en', 'es'));

COMMENT ON COLUMN skillmkt.waitlist.preferred_language IS
  'Interface language selected when joining the waitlist: pt, en or es.';
