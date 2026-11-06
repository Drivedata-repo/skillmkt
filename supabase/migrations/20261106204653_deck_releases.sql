CREATE TABLE skillmkt.package_releases (
 skill_id text NOT NULL,
 version text NOT NULL CHECK (version ~ '^[0-9]+\.[0-9]+\.[0-9]+$'),
 archive bytea NOT NULL CHECK (octet_length(archive) < 4000000),
 sha256 text NOT NULL CHECK (length(sha256)=64),
 file_count integer NOT NULL CHECK (file_count>0),
 manifest jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(skill_id,version)
);
ALTER TABLE skillmkt.package_releases ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON skillmkt.package_releases FROM PUBLIC, anon, authenticated;
GRANT SELECT ON skillmkt.package_releases TO skillmkt_app;
CREATE POLICY app_read_releases ON skillmkt.package_releases FOR SELECT TO skillmkt_app USING(true);
