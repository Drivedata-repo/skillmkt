module.exports = (_req, res) => {
  res.writeHead(410, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(
    JSON.stringify({
      error:
        "O envio de briefings foi encerrado. Escolha e baixe uma skill na coleção.",
    }),
  );
};
