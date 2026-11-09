-- Pedidos em reais para quem compra no Brasil. Rodar depois de 20261108180000_stripe_orders.sql.
-- O catálogo continua em dólar: o pedido guarda o valor cobrado, o valor em dólar e a cotação usada.

DO $$
DECLARE c text;
BEGIN
  SELECT conname INTO c FROM pg_constraint
  WHERE conrelid = 'skillmkt.orders'::regclass AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%currency%';
  IF c IS NOT NULL THEN
    EXECUTE format('ALTER TABLE skillmkt.orders DROP CONSTRAINT %I', c);
  END IF;
END $$;
ALTER TABLE skillmkt.orders
  ADD CONSTRAINT orders_currency_check CHECK (currency IN ('usd','brl'));

ALTER TABLE skillmkt.orders ADD COLUMN usd_cents integer CHECK (usd_cents > 0);
ALTER TABLE skillmkt.orders ADD COLUMN fx_rate numeric(10,4) CHECK (fx_rate IS NULL OR fx_rate > 0);
UPDATE skillmkt.orders SET usd_cents = amount_cents WHERE usd_cents IS NULL;
