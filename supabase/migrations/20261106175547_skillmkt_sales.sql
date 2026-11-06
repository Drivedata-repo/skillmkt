-- Isolated application schema. Run as database owner after creating skillmkt_app.
CREATE SCHEMA skillmkt;
REVOKE ALL ON SCHEMA skillmkt FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA skillmkt TO skillmkt_app;
CREATE TABLE skillmkt.leads (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 request_id uuid NOT NULL UNIQUE,
 fingerprint text NOT NULL,
 name text NOT NULL,
 email text NOT NULL,
 company text NOT NULL,
 phone text NOT NULL DEFAULT '',
 context jsonb NOT NULL,
 solutions text[] NOT NULL,
 skill_ids text[] NOT NULL DEFAULT '{}',
 consent_version text NOT NULL DEFAULT '2026-11-06',
 stage text NOT NULL DEFAULT 'new',
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE skillmkt.leads ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON skillmkt.leads TO skillmkt_app;
GRANT SELECT(id,request_id,fingerprint) ON skillmkt.leads TO skillmkt_app;
CREATE POLICY app_insert ON skillmkt.leads FOR INSERT TO skillmkt_app WITH CHECK (true);
CREATE POLICY app_reference ON skillmkt.leads FOR SELECT TO skillmkt_app USING (true);
CREATE TABLE skillmkt.rate_limits (key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL);
ALTER TABLE skillmkt.rate_limits ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,UPDATE,DELETE ON skillmkt.rate_limits TO skillmkt_app;
CREATE POLICY app_limits ON skillmkt.rate_limits TO skillmkt_app USING (true) WITH CHECK (true);
CREATE INDEX rate_limits_expiry ON skillmkt.rate_limits(expires_at);
