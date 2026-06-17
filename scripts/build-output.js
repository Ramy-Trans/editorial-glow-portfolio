import { mkdirSync, cpSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

mkdirSync(join(root, ".output", "server"), { recursive: true });
mkdirSync(join(root, ".output", "public"), { recursive: true });

const clientDir = join(root, "dist", "client");
if (existsSync(clientDir)) {
  cpSync(clientDir, join(root, ".output", "public"), { recursive: true });
  console.log("[build-output] Copied dist/client → .output/public");
}

const serverEntry = `import handler from "../../dist/server/server.js";
import { join, extname } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dir = dirname(__filename);
const PORT = Number(process.env.PORT) || 5000;
const PUBLIC_DIR = join(__dir, "..", "public");

const MIME = {
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  async fetch(request) {
    const url = new URL(request.url);
    const filePath = join(PUBLIC_DIR, url.pathname);
    const file = Bun.file(filePath);
    if (await file.exists()) {
      const ext = extname(filePath);
      const mime = MIME[ext] ?? "application/octet-stream";
      return new Response(file, {
        headers: {
          "Content-Type": mime,
          "Cache-Control": ext === ".html"
            ? "no-cache"
            : "public, max-age=31536000, immutable",
        },
      });
    }
    return handler.fetch(request);
  },
});

console.log("GJ Studio production server on http://0.0.0.0:" + PORT);
`;

writeFileSync(join(root, ".output", "server", "index.mjs"), serverEntry);
console.log("[build-output] Created .output/server/index.mjs");
