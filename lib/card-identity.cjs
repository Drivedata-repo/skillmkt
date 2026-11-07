"use strict";
const {createHash} = require("node:crypto");
const identity = require("../dist/card-identity.js");
const sha256 = value => createHash("sha256").update(value, "utf8").digest("hex");
function getCardIdentity(skill, release) {
  const digest = sha256(identity.cardInput(skill.code));
  const editionDigest = sha256(identity.editionInput(digest, release.version, release.sha256));
  return identity.assemble(skill.code, digest, editionDigest, release.version, release.sha256);
}
module.exports = {getCardIdentity};
