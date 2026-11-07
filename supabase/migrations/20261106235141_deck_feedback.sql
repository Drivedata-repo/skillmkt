-- No free text, documents, email, IP, or raw session cookies are stored.
CREATE TABLE skillmkt.feedback_events (
  session_key text NOT NULL CHECK (session_key ~ '^[0-9a-f]{64}$'),
  kind text NOT NULL CHECK (kind IN ('feedback','issue','recommendation','download')),
  skill_id text NOT NULL CHECK (length(skill_id)<=100),
  outcome text NOT NULL CHECK (outcome IN ('resolved','partial','not-fit','matches','no-match','downloaded','blocked')),
  reason text NOT NULL CHECK (reason IN ('none','recognition','dependency','different-result','unclear','incompatible','out-of-scope')),
  runtime text NOT NULL CHECK (runtime IN ('any','codex','claude','other')),
  goal text NOT NULL CHECK (length(goal)<=30),
  tool text NOT NULL CHECK (length(tool)<=30),
  locale text NOT NULL CHECK (locale IN ('pt','en','es')),
  release_version text NOT NULL CHECK (release_version='catalog' OR release_version ~ '^[0-9]+\.[0-9]+\.[0-9]+$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (session_key,kind,skill_id,release_version,goal,tool),
  CHECK ((kind='feedback' AND outcome IN ('resolved','partial','not-fit') AND skill_id<>'') OR
         (kind='issue' AND outcome='blocked' AND skill_id<>'') OR
         (kind='download' AND outcome='downloaded' AND skill_id<>'') OR
         (kind='recommendation' AND outcome IN ('matches','no-match') AND skill_id=''))
);
CREATE INDEX feedback_events_created_idx ON skillmkt.feedback_events(created_at);
ALTER TABLE skillmkt.feedback_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON skillmkt.feedback_events FROM PUBLIC,anon,authenticated,skillmkt_app;
GRANT INSERT ON skillmkt.feedback_events TO skillmkt_app;
CREATE POLICY app_insert_feedback ON skillmkt.feedback_events FOR INSERT TO skillmkt_app WITH CHECK(true);
-- A narrow aggregate function is required because the runtime cannot read raw events.
-- Its role is fixed, its search path locked, and it accepts no SQL/filter inputs.
CREATE FUNCTION skillmkt.feedback_summary()
RETURNS TABLE(kind text,skill_id text,outcome text,reason text,runtime text,goal text,tool text,locale text,release_version text,total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog,skillmkt
AS $$
 SELECT f.kind,f.skill_id,f.outcome,f.reason,f.runtime,f.goal,f.tool,f.locale,f.release_version,count(*)
 FROM skillmkt.feedback_events f WHERE f.created_at>=now()-interval '90 days'
 GROUP BY f.kind,f.skill_id,f.outcome,f.reason,f.runtime,f.goal,f.tool,f.locale,f.release_version
$$;
REVOKE ALL ON FUNCTION skillmkt.feedback_summary() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION skillmkt.feedback_summary() TO skillmkt_app;
