const { send, initializeLocale } = require("../lib/http.cjs");
module.exports = (req, res) => {
  initializeLocale(req, res);
  send(res, 410, {
    error:
      "O envio de briefings foi encerrado. Escolha e baixe uma skill na coleção.",
  });
};
