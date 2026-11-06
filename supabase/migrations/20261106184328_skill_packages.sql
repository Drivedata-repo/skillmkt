CREATE TABLE skillmkt.packages (
 skill_id text PRIMARY KEY,
 archive bytea NOT NULL CHECK (octet_length(archive) < 4000000),
 sha256 text NOT NULL CHECK (length(sha256)=64),
 file_count integer NOT NULL CHECK (file_count>0),
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE skillmkt.packages ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON skillmkt.packages FROM PUBLIC, anon, authenticated;
GRANT SELECT ON skillmkt.packages TO skillmkt_app;
CREATE POLICY app_read_packages ON skillmkt.packages FOR SELECT TO skillmkt_app USING(true);
