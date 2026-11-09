"use strict";
// Confere se a venda pode ser ligada. Nunca imprime o valor de uma variável.
// Uso: npm run sale:check  (acrescente -- --db para conferir as tabelas, só leitura).
const fs = require("node:fs");
const path = require("node:path");
const skills = require("../data/skills.cjs");
const products = require("../data/sale-products.cjs");
const { productProblems, summary } = require("../lib/sale-rights.cjs");
const catalog = require("../lib/sale-catalog.cjs");

const results = [];
const check = (ok, label) => results.push({ ok, label });

const env = process.env;
check((env.DATABASE_URL || "").length > 0, "DATABASE_URL configurada");
check((env.RATE_LIMIT_SECRET || "").length >= 32, "RATE_LIMIT_SECRET com 32 caracteres ou mais");
check(/^sk_(live|test)_/.test(env.STRIPE_SECRET_KEY || ""), "STRIPE_SECRET_KEY configurada");
check((env.STRIPE_WEBHOOK_SECRET || "").length >= 16, "STRIPE_WEBHOOK_SECRET configurado (whsec_...)");
check(/^sk_live_/.test(env.STRIPE_SECRET_KEY || ""), "Chave do Stripe em modo ao vivo (hoje: " + (/^sk_test_/.test(env.STRIPE_SECRET_KEY || "") ? "teste" : "ausente") + ")");
check((env.CUSTOMER_SESSION_SECRET || "").length >= 32, "CUSTOMER_SESSION_SECRET com 32 caracteres ou mais");
check(Boolean(env.MAIL_API_KEY && env.MAIL_FROM), "MAIL_API_KEY e MAIL_FROM configurados");
check(env.DEMO_ENABLED === "false", "Demo gratuita fechada (DEMO_ENABLED=false)");

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
const main = catalog.get(config.checkoutKey);
check(Boolean(main), "Oferta aponta para um produto do catálogo (checkoutKey)");
check(Boolean(main) && main.status !== "draft", "Produto da oferta aprovado (hoje é rascunho, e o pagamento não abre)");
check(Number(config.guaranteeDays) >= 15, "Garantia definida (Europa exige 15 dias ou mais)");

async function database() {
  if (!process.argv.includes("--db") || !env.DATABASE_URL) return;
  const { db } = require("../lib/db.cjs");
  for (const table of ["customers", "webhook_events", "purchases", "entitlements", "access_tokens", "orders"]) {
    const r = await db().query("SELECT to_regclass($1) AS found", ["skillmkt." + table]);
    check(Boolean(r.rows[0].found), `Tabela skillmkt.${table} criada`);
  }
  await db().end();
}

const manual = [
  "Rodar as três migrações no banco, nesta ordem: 20261108120000_commerce_accounts, 20261108180000_stripe_orders e 20261109120000_orders_brl",
  "Importar a edição 1.2.1 no banco antes de publicar (node .local/admin.cjs releases), senão 44 downloads devolvem 503",
  "Conta Stripe ativada (dados da empresa e conta bancária) e chave restrita só a Checkout e Pix, sem permissão de saque",
  "Stripe ativado e, em Meios de pagamento, Pix, boleto e parcelamento ligados (valem só para cobrança em reais, que é o que o Brasil recebe)",
  "Conferir a cotação em reais: PTAX de venda do Banco Central, arredondada para cima ao real inteiro; BRL_MARGIN_PERCENT define uma margem, se quiser",
  "Webhook no Stripe para https://deck.drivedata.com.br/api/webhooks/stripe com 5 eventos: checkout.session.completed, checkout.session.async_payment_succeeded, checkout.session.expired, charge.refunded, charge.dispute.created",
  "Compra de teste com cartão 4242 em modo teste: pagar, receber o e-mail, criar a senha, baixar, reembolsar e perder o acesso",
  "Compra de teste em reais, vista do Brasil, para conferir Pix e parcelas; e em dólar, vista de fora, para conferir o cartão",
  "Imposto sobre venda para o exterior: Stripe Tax (STRIPE_AUTOMATIC_TAX=true) ou outro caminho, com o contador",
  "Recibo por e-mail ligado no Stripe e nome que aparece na fatura do cartão",
  "Vercel em plano Pro: o Hobby não permite uso comercial",
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
