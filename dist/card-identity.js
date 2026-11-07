(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DeckIdentity = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const namespace = "drivedata:deck:card:v1";
  const hex = /^[a-f0-9]{64}$/;
  function cardInput(code) {
    if (!/^DD-\d{3,6}$/.test(code)) throw new Error("Invalid permanent card code");
    return `${namespace}\n${code}`;
  }
  function editionInput(digest, version, packageSha256) {
    if (!hex.test(digest) || !hex.test(packageSha256) || !/^\d+\.\d+\.\d+$/.test(version)) throw new Error("Invalid edition identity");
    return `${namespace}:edition\n${digest}\n${version}\n${packageSha256}`;
  }
  function assemble(code, digest, editionDigest, version, packageSha256) {
    cardInput(code); editionInput(digest, version, packageSha256);
    if (!hex.test(editionDigest)) throw new Error("Invalid edition digest");
    return {
      schema: "drivedata.card-identity.v1", namespace, registryCode: code,
      id: `ddk_${digest}`, digest,
      serial: `DDK-${code.slice(3)}-${digest.slice(0, 12).toUpperCase().match(/.{4}/g).join("-")}`,
      edition: { id: `dde_${editionDigest}`, digest: editionDigest, version, packageSha256 },
      blockchain: {status: "not-minted", network: null, contract: null, tokenId: null},
    };
  }
  async function sha256(bytes) {
    if (!globalThis.crypto?.subtle) throw new Error("Web Crypto unavailable");
    const data = typeof bytes === "string" ? new TextEncoder().encode(bytes) : bytes;
    return Array.from(new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", data)), b => b.toString(16).padStart(2, "0")).join("");
  }
  async function verify(skill) {
    try {
      const i = skill.identity, r = skill.release;
      if (!i || !r) return false;
      const digest = await sha256(cardInput(skill.code));
      const editionDigest = await sha256(editionInput(digest, r.version, r.sha256));
      const expected = assemble(skill.code, digest, editionDigest, r.version, r.sha256);
      return i.schema === expected.schema && i.namespace === namespace && i.registryCode === skill.code &&
        i.id === expected.id && i.serial === expected.serial && i.digest === digest &&
        i.edition?.id === expected.edition.id && i.edition?.digest === editionDigest &&
        i.edition?.packageSha256 === r.sha256 && i.edition?.version === r.version &&
        i.blockchain?.status === "not-minted" && i.blockchain.network === null &&
        i.blockchain.contract === null && i.blockchain.tokenId === null;
    } catch { return false; }
  }
  function manifest(s) {
    return {
      schema: "drivedata.card-passport.v1",
      issuer: "DriveData Deck",
      identity: s.identity,
      skill: {code: s.code, slug: s.id, title: s.title, version: s.version},
      url: `https://deck.drivedata.com.br/app?skill=${encodeURIComponent(s.code)}&chapter=technical&spin=off`,
      digestAlgorithm: "SHA-256",
      canonicalCardInput: cardInput(s.code),
      canonicalEditionInput: editionInput(s.identity.digest, s.release.version, s.release.sha256),
      scope: "Catalog entry shared by all users; not a unique purchased copy, signature, proof of ownership, license or on-chain asset.",
    };
  }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function mark(identity) {
    if (!hex.test(identity?.digest)) return "";
    const bits = [...identity.digest.slice(0, 7)].flatMap(c => [...parseInt(c, 16).toString(2).padStart(4, "0")]);
    return `<svg class="identity-mark" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 2 58 17v30L32 62 6 47V17Z" fill="none" stroke="currentColor"/>${bits.map((b, i) => {
      const x = i % 4, y = Math.floor(i / 4), cell = `<rect x="${12 + x * 6}" y="${12 + y * 6}" width="4" height="4" opacity="${b === "1" ? ".95" : ".13"}"/>`;
      return cell + (x < 3 ? `<rect x="${48 - x * 6}" y="${12 + y * 6}" width="4" height="4" opacity="${b === "1" ? ".95" : ".13"}"/>` : "");
    }).join("")}</svg>`;
  }
  function panel(s) {
    if (!s.identity) return "";
    const t = (text, params) => DeckI18n.t(text, params), i = s.identity;
    return `<section class="card-passport" aria-labelledby="passport-title"><div class="passport-heading">${mark(i)}<div><h3 id="passport-title">${esc(t("Passaporte da carta"))}</h3><p>${esc(i.serial)}</p></div></div><p>${esc(t("Uma identidade permanente para esta skill. O mesmo ID em todos os idiomas, preços e versões."))}</p><dl><div><dt>${esc(t("ID completo"))}</dt><dd class="digest">${esc(i.id)}</dd></div><div><dt>${esc(t("Impressão digital da edição"))} · v${esc(s.version)}</dt><dd class="digest">${esc(i.edition.id)}</dd></div></dl><div class="passport-actions"><button class="btn secondary" data-copy-identity="${esc(s.id)}">${esc(t("Copiar ID"))}</button><button class="text-button" data-passport="${esc(s.id)}">${esc(t("Baixar passaporte JSON"))}</button><button class="text-button" data-verify-identity="${esc(s.id)}">${esc(t("Conferir identidade"))}</button></div><p class="identity-result" role="status" aria-live="polite"></p><details><summary>${esc(t("Conferir meu arquivo ZIP"))}</summary><p>${esc(t("Selecione o ZIP desta versão. A conferência acontece no seu navegador; o arquivo não é enviado."))}</p><label class="zip-check-label">${esc(t("Arquivo ZIP da skill"))}<input type="file" accept=".zip,application/zip" data-verify-zip="${esc(s.id)}"></label><p class="zip-result" role="status" aria-live="polite"></p></details><p class="passport-scope">${esc(t("Registro do catálogo, compartilhado por todos que usam esta carta. Não é uma cópia exclusiva, comprovante de compra ou NFT. Blockchain ainda não ativada."))}</p></section>`;
  }
  return {namespace, cardInput, editionInput, assemble, sha256, verify, manifest, mark, panel};
});
