const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve("dist");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
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
  ].map((n) => ["/api/" + n, require("./api/" + n + ".js")]),
);
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      if (url.pathname === "/app") return await routes["/api/app"](req, res);
      if (routes[url.pathname]) return await routes[url.pathname](req, res);
      const file = path.resolve(
        root,
        "." +
          decodeURIComponent(
            url.pathname === "/"
              ? "/index.html"
              : url.pathname === "/login"
                ? "/login.html"
                : url.pathname === "/privacidade"
                  ? "/privacy.html"
                  : url.pathname,
          ),
      );
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
  .listen(4317, "127.0.0.1", () =>
    console.log("DriveData preview http://127.0.0.1:4317"),
  );
