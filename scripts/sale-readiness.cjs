"use strict";
// Confere se a venda pode ser ligada. Nunca imprime o valor de uma variável.
// Uso: npm run sale:check  (acrescente -- --db para conferir as tabelas, só leitura).
const fs = require("node:fs");
const path = require("node:path");
const skills = require("../data/skills.cjs");
const products = require("../data/sale-products.cjs");
const { productProblems, summary } = require("../lib/sale-rights.cjs");
const { productMap } = require("../lib/commerce.cjs");

const results = [];
const check = (ok, label) => results.push({ ok, label });

const env = process.env;
check((env.DATABASE_URL || "").length > 0, "DATABASE_URL configurada");
check((env.RATE_LIMIT_SECRET || "").length >= 32, "RATE_LIMIT_SECRET com 32 caracteres ou mais");
check((env.HOTMART_HOTTOK || "").length >= 16, "HOTMART_HOTTOK configurado");
check((env.CUSTOMER_SESSION_SECRET || "").length >= 32, "CUSTOMER_SESSION_SECRET com 32 caracteres ou mais");
check(Boolean(env.MAIL_API_KEY && env.MAIL_FROM), "MAIL_API_KEY e MAIL_FROM configurados");
check(env.DEMO_ENABLED === "false", "Demo gratuita fechada (DEMO_ENABLED=false)");

const map = productMap();
for (const product of products)
  check([...map.values()].includes(product.key), `Produto ${product.key} ligado a um ID da Hotmart`);

const problems = productProblems(products);
check(problems.length === 0, `Produtos só com cartas vendáveis${problems.length ? ": " + problems.join("; ") : ""}`);
for (const product of products) {
  check(product.status !== "draft", `Produto ${product.key} aprovado (hoje é rascunho)`);
  check(product.priceUsd !== null, `Produto ${product.key} com preço definido`);
}

const offer = fs.readFileSync(path.join(__dirname, "../dist/oferta-config.js"), "utf8");
const sandbox = { window: {} };
new Function("window", offer)(sandbox.window);
const config = sandbox.window.DeckOffer;
check(Boolean(config.videoSrc), "Vídeo da VSL configurado");
check(/^https:\/\/pay\.hotmart\.com\//.test(config.checkoutUrl), "Link do checkout da Hotmart configurado");
check(Number(config.guaranteeDays) >= 15, "Garantia definida (Europa exige 15 dias ou mais)");

async function database() {
  if (!process.argv.includes("--db") || !env.DATABASE_URL) return;
  const { db } = require("../lib/db.cjs");
  for (const table of ["customers", "webhook_events", "purchases", "entitlements", "access_tokens"]) {
    const r = await db().query("SELECT to_regclass($1) AS found", ["skillmkt." + table]);
    check(Boolean(r.rows[0].found), `Tabela skillmkt.${table} criada`);
  }
  await db().end();
}

const manual = [
  "Importar a edição 1.2.1 no banco antes de publicar (node .local/admin.cjs releases), senão 44 downloads devolvem 503",
  "Vercel em plano Pro: o Hobby não permite uso comercial",
  "Produto na Hotmart com área de membros externa e login de teste",
  "Webhook da Hotmart apontando para /api/webhooks/hotmart, versão 2.0.0",
  "Evento de teste da Hotmart conferido no banco (formato real do payload)",
  "Compra real ou de teste: liberar, entrar, baixar, reembolsar e perder o acesso",
  "Conversão de moeda conferida no checkout",
  "CSP de /oferta conferida em preview da Vercel",
  "Política de privacidade atualizada para compradores",
  "Afirmações da VSL com prova: parceria, marcas, resultados",
];

database()
  .catch((error) => check(false, "Conexão com o banco: " + error.message))
  .finally(() => {
    const rights = summary(skills.map((s) => s.id));
    console.log(`Cartas: ${rights.total}. Com direito de venda: ${rights.rights}. Prontas hoje: ${rights.ready}. Travadas: ${rights.blocked}.\n`);
    for (const r of results) console.log(`${r.ok ? "[OK]    " : "[FALTA] "}${r.label}`);
    console.log("\nConferência manual:");
    for (const item of manual) console.log("[MANUAL] " + item);
    const missing = results.filter((r) => !r.ok).length;
    console.log(missing ? `\nNÃO PRONTO: ${missing} item(ns) em falta.` : "\nItens automáticos ok. Faça a conferência manual antes de ligar o tráfego.");
    process.exitCode = missing ? 1 : 0;
  });
