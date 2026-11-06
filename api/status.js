module.exports = (_req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(
    JSON.stringify({
      aiConfigured: !!process.env.GROQ_API_KEY,
      leadsConfigured: !!process.env.DATABASE_URL,
    }),
  );
};
