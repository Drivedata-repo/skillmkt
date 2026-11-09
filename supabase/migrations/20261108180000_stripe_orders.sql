-- Checkout próprio com Stripe: pedidos criados pelo servidor e compras de mais de um provedor.
-- Rodar como dono do banco, depois de 20261108120000_commerce_accounts.sql.

-- Aceita eventos do Stripe além dos da Hotmart.
DO $$
DECLARE c text;
BEGIN
  SELECT conname INTO c FROM pg_constraint
  WHERE conrelid = 'skillmkt.webhook_events'::regclass AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%provider%';
  IF c IS NOT NULL THEN
    EXECUTE format('ALTER TABLE skillmkt.webhook_events DROP CONSTRAINT %I', c);
  END IF;
END $$;
ALTER TABLE skillmkt.webhook_events
  ADD CONSTRAINT webhook_events_provider_check CHECK (provider IN ('hotmart','stripe'));

ALTER TABLE skillmkt.purchases
  ADD COLUMN provider text NOT NULL DEFAULT 'hotmart' CHECK (provider IN ('hotmart','stripe'));
-- No Stripe não há produto cadastrado: o que foi comprado vem do pedido.
ALTER TABLE skillmkt.purchases ALTER COLUMN hotmart_product_id DROP NOT NULL;

-- O preço e os itens são decididos no servidor, a partir do catálogo, e gravados aqui
-- antes de abrir o pagamento. O navegador nunca informa valor.
CREATE TABLE skillmkt.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'stripe' CHECK (provider = 'stripe'),
  product_keys text[] NOT NULL CHECK (cardinality(product_keys) BETWEEN 1 AND 20),
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  currency text NOT NULL DEFAULT 'usd' CHECK (currency = 'usd'),
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created','paid','expired')),
  stripe_session_id text UNIQUE CHECK (length(stripe_session_id) <= 200),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX orders_status_idx ON skillmkt.orders(status, created_at);

ALTER TABLE skillmkt.orders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON skillmkt.orders FROM PUBLIC, anon, authenticated, skillmkt_app;
GRANT SELECT, INSERT, UPDATE ON skillmkt.orders TO skillmkt_app;
CREATE POLICY app_orders ON skillmkt.orders TO skillmkt_app USING (true) WITH CHECK (true);
