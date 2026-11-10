"use strict";
// Conta de teste sem banco real: o Pool do pg responde só o que o acesso consulta.
// Funciona em qualquer ordem de require, porque troca o método no protótipo.
const { Pool } = require("pg");
const customerAuth = require("../../lib/customer-auth.cjs");

const ID = "11111111-2222-4333-8444-555555555555";

function install({ products = [], version = 1, email = "teste@example.com" } = {}) {
  process.env.CUSTOMER_SESSION_SECRET ||= "t".repeat(40);
  process.env.RATE_LIMIT_SECRET ||= "r".repeat(40);
  process.env.DATABASE_URL ||= "postgresql://t:t@127.0.0.1:1/t";
  const original = Pool.prototype.query;
  const seen = [];
  Pool.prototype.query = async function (sql) {
    seen.push(String(sql));
    if (/FROM skillmkt\.customers c/.test(sql))
      return { rows: [{ email, name: "Teste", session_version: version, products }], rowCount: 1 };
    if (/rate_limits/.test(sql) && /RETURNING count/.test(sql)) return { rows: [{ count: 1 }], rowCount: 1 };
    return { rows: [], rowCount: 0 };
  };
  return {
    id: ID,
    seen,
    // Cabeçalho de cookie como o navegador mandaria.
    cookie: "deck_customer=" + customerAuth.issue({ id: ID, sessionVersion: version }),
    restore() {
      Pool.prototype.query = original;
    },
  };
}

module.exports = { install, ID };
