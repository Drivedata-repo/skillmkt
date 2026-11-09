"use strict";
// Dólar para real. O catálogo é em dólar; no Brasil o valor em reais acompanha o dólar do dia.
// Fonte: PTAX de venda do Banco Central. Plano B: USD_BRL_RATE fixado à mão no servidor.
const BCB =
  "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)";
const TTL_MS = 6 * 3600 * 1000;
const STALE_MS = 3 * 24 * 3600 * 1000;
const MIN_RATE = 2;
const MAX_RATE = 15;

let cache = null;

const sane = (n) => Number.isFinite(n) && n >= MIN_RATE && n <= MAX_RATE;
const round4 = (n) => Math.round(n * 10000) / 10000;
const mmddyyyy = (d) =>
  `${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}-${d.getUTCFullYear()}`;

function marginPercent() {
  const m = Number(process.env.BRL_MARGIN_PERCENT || 0);
  return Number.isFinite(m) ? Math.min(Math.max(m, 0), 20) : 0;
}

async function fetchPtax(fetchImpl, now) {
  const url =
    `${BCB}?@dataInicial='${mmddyyyy(new Date(now - 10 * 86400000))}'` +
    `&@dataFinalCotacao='${mmddyyyy(new Date(now + 86400000))}'` +
    "&$orderby=dataHoraCotacao%20desc&$top=1&$format=json";
  const response = await fetchImpl(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("PTAX HTTP " + response.status);
  const row = (await response.json())?.value?.[0];
  const rate = Number(row?.cotacaoVenda);
  if (!sane(rate)) throw new Error("PTAX inválida");
  return { base: rate, asOf: String(row.dataHoraCotacao).slice(0, 10) };
}

// Devolve { rate, asOf, source } ou null quando não há cotação confiável.
async function getRate(options = {}) {
  const now = options.now ?? Date.now();
  const margin = 1 + marginPercent() / 100;
  const manual = Number(process.env.USD_BRL_RATE);
  if (sane(manual)) return { rate: round4(manual * margin), asOf: null, source: "manual" };
  if (cache && now - cache.at < TTL_MS)
    return { rate: round4(cache.base * margin), asOf: cache.asOf, source: "ptax" };
  try {
    const { base, asOf } = await fetchPtax(options.fetch || fetch, now);
    cache = { base, asOf, at: now };
    return { rate: round4(base * margin), asOf, source: "ptax" };
  } catch {
    // Sem rede: usa a última cotação por até 3 dias; depois disso, não cobra em reais.
    if (cache && now - cache.at < STALE_MS)
      return { rate: round4(cache.base * margin), asOf: cache.asOf, source: "ptax-antiga" };
    return null;
  }
}

// Reais inteiros, sempre para cima: nunca cobra menos do que o dólar vale.
const brlCents = (usdCents, rate) => Math.ceil((usdCents * rate) / 100) * 100;

// País do comprador, informado pela Vercel. Fora da Vercel só aceita ?country= para teste.
function countryOf(req) {
  let value = req.headers?.["x-vercel-ip-country"];
  if (!value && !process.env.VERCEL) {
    try {
      value = new URL(req.url, "http://local.invalid").searchParams.get("country");
    } catch {}
  }
  return /^[A-Za-z]{2}$/.test(value || "") ? value.toUpperCase() : null;
}

const reset = () => {
  cache = null;
};

module.exports = { getRate, brlCents, countryOf, reset };
