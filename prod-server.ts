import { join, extname } from "node:path";
import { existsSync } from "node:fs";

const PORT = Number(process.env.PORT) || 5000;
const PUBLIC_DIR = join(import.meta.dir, ".output", "public");

const MIME: Record<string, string> = {
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
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

const handler = await import("./.output/server/index.mjs");

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

    return handler.default.fetch(request);
  },
});

console.log(`GJ Studio production server on http://0.0.0.0:${PORT}`);
