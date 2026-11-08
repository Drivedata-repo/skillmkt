-- Contas de comprador, compras da Hotmart e acessos liberados.
-- Guarda só o necessário para liberar e revogar: sem CPF, telefone ou payload bruto.
-- Rodar como dono do banco. O runtime usa skillmkt_app, sem permissão de DELETE.
CREATE TABLE skillmkt.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (email = lower(email) AND length(email) <= 254 AND position('@' in email) > 1),
  name text NOT NULL DEFAULT '' CHECK (length(name) <= 200),
  password_hash text CHECK (password_hash IS NULL OR password_hash ~ '^[a-f0-9]{32}:[a-f0-9]{128}$'),
  session_version integer NOT NULL DEFAULT 1 CHECK (session_version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE skillmkt.webhook_events (
  event_id text PRIMARY KEY CHECK (length(event_id) <= 200),
  provider text NOT NULL DEFAULT 'hotmart' CHECK (provider = 'hotmart'),
  event text NOT NULL CHECK (length(event) <= 60),
  transaction_code text CHECK (length(transaction_code) <= 120),
  hotmart_product_id text CHECK (length(hotmart_product_id) <= 60),
  outcome text NOT NULL CHECK (outcome IN ('recorded','granted','revoked','unmapped','blocked-terminal')),
  occurred_at timestamptz,
  received_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX webhook_events_transaction_idx ON skillmkt.webhook_events(transaction_code);
CREATE INDEX webhook_events_outcome_idx ON skillmkt.webhook_events(outcome, received_at);

CREATE TABLE skillmkt.purchases (
  transaction_code text PRIMARY KEY CHECK (length(transaction_code) <= 120),
  customer_id uuid NOT NULL REFERENCES skillmkt.customers(id),
  hotmart_product_id text NOT NULL CHECK (length(hotmart_product_id) <= 60),
  product_key text CHECK (length(product_key) <= 60),
  offer_code text CHECK (length(offer_code) <= 60),
  status text NOT NULL CHECK (status IN ('pending','approved','refunded','chargeback','canceled')),
  price_value numeric(12,2),
  currency text CHECK (length(currency) <= 8),
  is_order_bump boolean NOT NULL DEFAULT false,
  parent_transaction text CHECK (length(parent_transaction) <= 120),
  last_event_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX purchases_customer_idx ON skillmkt.purchases(customer_id);

CREATE TABLE skillmkt.entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES skillmkt.customers(id),
  product_key text NOT NULL CHECK (length(product_key) <= 60),
  transaction_code text NOT NULL REFERENCES skillmkt.purchases(transaction_code),
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  revoke_reason text CHECK (revoke_reason IN ('refunded','chargeback','canceled','manual')),
  UNIQUE (transaction_code, product_key)
);
CREATE INDEX entitlements_active_idx ON skillmkt.entitlements(customer_id) WHERE revoked_at IS NULL;

CREATE TABLE skillmkt.access_tokens (
  token_hash text PRIMARY KEY CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  customer_id uuid NOT NULL REFERENCES skillmkt.customers(id),
  purpose text NOT NULL CHECK (purpose IN ('first-access','reset')),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX access_tokens_customer_idx ON skillmkt.access_tokens(customer_id, created_at);

ALTER TABLE skillmkt.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE skillmkt.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE skillmkt.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE skillmkt.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE skillmkt.access_tokens ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON skillmkt.customers, skillmkt.webhook_events, skillmkt.purchases, skillmkt.entitlements, skillmkt.access_tokens
  FROM PUBLIC, anon, authenticated, skillmkt_app;

GRANT SELECT, INSERT, UPDATE ON skillmkt.customers TO skillmkt_app;
GRANT INSERT ON skillmkt.webhook_events TO skillmkt_app;
GRANT SELECT (event_id), UPDATE (outcome) ON skillmkt.webhook_events TO skillmkt_app;
GRANT SELECT, INSERT, UPDATE ON skillmkt.purchases TO skillmkt_app;
GRANT SELECT, INSERT, UPDATE ON skillmkt.entitlements TO skillmkt_app;
GRANT SELECT, INSERT, UPDATE ON skillmkt.access_tokens TO skillmkt_app;

CREATE POLICY app_customers ON skillmkt.customers TO skillmkt_app USING (true) WITH CHECK (true);
CREATE POLICY app_webhook_events ON skillmkt.webhook_events TO skillmkt_app USING (true) WITH CHECK (true);
CREATE POLICY app_purchases ON skillmkt.purchases TO skillmkt_app USING (true) WITH CHECK (true);
CREATE POLICY app_entitlements ON skillmkt.entitlements TO skillmkt_app USING (true) WITH CHECK (true);
CREATE POLICY app_access_tokens ON skillmkt.access_tokens TO skillmkt_app USING (true) WITH CHECK (true);
