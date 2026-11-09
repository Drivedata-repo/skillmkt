const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve("dist");
const port = Number(process.env.PORT || 4317);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".zip": "application/zip",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".json": "application/json; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
};
const routes = Object.fromEntries(
  [
    "triage",
    "leads",
    "status",
    "session",
    "app",
    "catalog",
    "download",
    "waitlist",
    "feedback",
    "packs",
    "pack-download",
    "commerce",
  ].map((n) => ["/api/" + n, require("./api/" + n + ".js")]),
);
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      if (url.pathname === "/app") return await routes["/api/app"](req, res);
      const commerceRoute =
        url.pathname === "/api/webhooks/hotmart"
          ? "webhook"
          : url.pathname.match(/^\/api\/account\/([a-z-]+)$/)?.[1];
      if (commerceRoute) {
        req.url = "/api/commerce?route=" + commerceRoute;
        return await routes["/api/commerce"](req, res);
      }
      if (url.pathname === "/api/nexo") {
        req.url = "/api/triage?route=chat";
        return await routes["/api/triage"](req, res);
      }
      if (routes[url.pathname]) return await routes[url.pathname](req, res);
      let file = path.resolve(
        root,
        "." +
          decodeURIComponent(
            url.pathname === "/"
              ? "/index.html"
              : url.pathname === "/login"
                ? "/login.html"
                : url.pathname === "/acesso"
                  ? "/acesso.html"
                  : url.pathname === "/oferta"
                    ? "/oferta.html"
                : url.pathname === "/privacidade"
                  ? "/privacy.html"
                  : url.pathname,
          ),
      );
      if (
        file.startsWith(root + path.sep) &&
        fs.existsSync(file) &&
        fs.statSync(file).isDirectory()
      )
        file = path.join(file, "index.html");
      if (
        !file.startsWith(root + path.sep) ||
        !fs.existsSync(file) ||
        !fs.statSync(file).isFile()
      ) {
        res.writeHead(404);
        return res.end("Not found");
      }
      res.writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
      });
      fs.createReadStream(file).pipe(res);
    } catch {
      res.writeHead(500);
      res.end("Server error");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`DriveData preview http://127.0.0.1:${port}`),
  );
