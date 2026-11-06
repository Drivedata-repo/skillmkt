const fs = require("node:fs"),
  crypto = require("node:crypto");
if (!process.stdin.isTTY)
  throw new Error("Use an interactive terminal to enter a hidden password.");
process.stdin.setRawMode(true);
process.stdin.resume();
let buffer = "",
  first = null;
process.stdout.write("Nova senha da demo (entrada oculta): ");
process.stdin.on("data", (chunk) => {
  for (const c of chunk.toString()) {
    if (c === "\u0003") {
      process.stdin.setRawMode(false);
      process.exit(1);
    }
    if (c === "\u007f" || c === "\b") {
      buffer = buffer.slice(0, -1);
      continue;
    }
    if (c === "\r" || c === "\n") {
      if (first === null) {
        if (buffer.length < 10) {
          process.stdout.write("\nUse pelo menos 10 caracteres: ");
          buffer = "";
          continue;
        }
        first = buffer;
        buffer = "";
        process.stdout.write("\nRepita a senha: ");
      } else {
        if (buffer !== first) {
          first = null;
          buffer = "";
          process.stdout.write("\nAs senhas diferem. Nova senha: ");
          continue;
        }
        const salt = crypto.randomBytes(16).toString("hex"),
          hash =
            salt + ":" + crypto.scryptSync(first, salt, 64).toString("hex");
        let env = fs.existsSync(".env.local")
          ? fs.readFileSync(".env.local", "utf8")
          : "";
        env = env.replace(
          /^DEMO_(PASSWORD_HASH|SESSION_SECRET)=.*\r?\n?/gm,
          "",
        );
        fs.writeFileSync(
          ".env.local",
          env +
            `\nDEMO_PASSWORD_HASH=${hash}\nDEMO_SESSION_SECRET=${crypto.randomBytes(32).toString("hex")}\n`,
        );
        buffer = first = "";
        process.stdin.setRawMode(false);
        console.log(
          "\nHash e chave de sessão salvos em .env.local. Reinicie o servidor.",
        );
        process.exit();
      }
    } else if (buffer.length < 256) buffer += c;
  }
});
