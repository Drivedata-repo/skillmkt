"use strict";
const configured = () => Boolean(process.env.MAIL_API_KEY && process.env.MAIL_FROM);
const publicUrl = () => (process.env.PUBLIC_URL || "https://deck.drivedata.com.br").replace(/\/$/, "");

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

function accessMessage({ name, token, purpose }) {
  // O token vai depois do #, para não aparecer em log de servidor nem em referrer.
  const link = `${publicUrl()}/acesso#t=${token}`;
  const first = String(name || "").split(" ")[0];
  const hello = first ? `Olá, ${first}.` : "Olá.";
  const isFirst = purpose === "first-access";
  const subject = isFirst ? "Seu DriveData Deck está liberado" : "Redefina sua senha do DriveData Deck";
  const lead = isFirst
    ? "Sua compra foi aprovada. Crie sua senha para abrir o Deck:"
    : "Recebemos um pedido para redefinir sua senha. Use o link abaixo:";
  const validity = isFirst ? "O link vale por 72 horas." : "O link vale por 2 horas.";
  return {
    subject,
    text: `${hello}\n\n${lead}\n${link}\n\n${validity} Depois disso, peça um novo em ${publicUrl()}/acesso.\n\nDriveData`,
    html: `<p>${escapeHtml(hello)}</p><p>${escapeHtml(lead)}</p><p><a href="${escapeHtml(link)}">Abrir o DriveData Deck</a></p><p>${escapeHtml(validity)} Depois disso, peça um novo em ${escapeHtml(publicUrl())}/acesso.</p><p>DriveData</p>`,
  };
}

// Nunca lança: e-mail que falha não pode desfazer uma compra já processada.
async function sendAccessEmail(input, fetchImpl = fetch) {
  if (!configured()) return { sent: false, reason: "not-configured" };
  try {
    const message = accessMessage(input);
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MAIL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: process.env.MAIL_FROM, to: [input.email], ...message }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok ? { sent: true } : { sent: false, reason: "http-" + response.status };
  } catch {
    return { sent: false, reason: "network" };
  }
}

module.exports = { configured, publicUrl, accessMessage, sendAccessEmail };
