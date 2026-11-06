CREATE TABLE skillmkt.waitlist (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL CHECK(length(name) BETWEEN 2 AND 100),
 email text UNIQUE NOT NULL CHECK(length(email)<=254 AND email=lower(email)),
 audience text NOT NULL CHECK(audience IN ('business','technical')),
 interest text NOT NULL CHECK(interest IN ('spreadsheets','bi','product','content','explore')),
 consent_version text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE skillmkt.waitlist ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON skillmkt.waitlist FROM PUBLIC, anon, authenticated;
GRANT INSERT ON skillmkt.waitlist TO skillmkt_app;
CREATE POLICY app_join_waitlist ON skillmkt.waitlist FOR INSERT TO skillmkt_app WITH CHECK(consent_version='2026-11-06');
