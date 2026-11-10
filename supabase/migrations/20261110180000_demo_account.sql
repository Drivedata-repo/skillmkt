-- Conta de demonstração: acesso a todas as cartas à venda sem comprar.
-- Rodar depois de 20261110120000_orders_customer.sql.
-- Só o dono do banco liga o interruptor, com UPDATE direto. O app nunca consegue:
-- ele perde o direito de gravar em qualquer coluna fora da lista abaixo.
ALTER TABLE skillmkt.customers ADD COLUMN access_all boolean NOT NULL DEFAULT false;

REVOKE INSERT, UPDATE ON skillmkt.customers FROM skillmkt_app;
GRANT INSERT (email, name, password_hash) ON skillmkt.customers TO skillmkt_app;
GRANT UPDATE (name, password_hash, session_version, updated_at) ON skillmkt.customers TO skillmkt_app;
