-- A compra passa a ser feita dentro da conta: o pedido guarda quem comprou.
-- Rodar depois de 20261109120000_orders_brl.sql.
-- O acesso vai para a conta que abriu o pedido, e não para o e-mail digitado no pagamento.
ALTER TABLE skillmkt.orders ADD COLUMN customer_id uuid REFERENCES skillmkt.customers(id);
CREATE INDEX orders_customer_idx ON skillmkt.orders(customer_id);
