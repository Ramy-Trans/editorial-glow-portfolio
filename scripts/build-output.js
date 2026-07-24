import { mkdirSync, cpSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const preset = process.env.NITRO_PRESET ?? "node";

const clientDir = join(root, "dist", "client");

if (preset === "netlify") {
  mkdirSync(join(root, "netlify", "functions"), { recursive: true });

  const bundleCmd = [
    "bun", "build",
    join(root, "dist", "server", "server.js"),
    "--target=node",
    "--format=esm",
    "--external=pg",
    "--external=pg-native",
    "--external=pg-cloudflare",
    "--external=jsonwebtoken",
    "--outfile=" + join(root, "netlify", "functions", "server-bundle.mjs"),
  ].join(" ");

  console.log("[build-output] Bundling server for Netlify…");
  execSync(bundleCmd, { stdio: "inherit", cwd: root });
  console.log("[build-output] Created netlify/functions/server-bundle.mjs");

  const fnEntry = `import handler from "./server-bundle.mjs";
export default async (request, context) => handler.fetch(request);
`;
  writeFileSync(join(root, "netlify", "functions", "server.mjs"), fnEntry);
  console.log("[build-output] Created netlify/functions/server.mjs");

} else {
  // ── Node.js production server (default) ─────────────────────────────────
  // Uses Node's built-in http module — NOT Bun.serve() — so react-dom uses
  // the Node SSR bundle (react-dom-server.node.*) which supports streaming
  // correctly.  Running with Bun's runtime caused react-dom to pick the
  // incompatible bun bundle, crashing every SSR request with an AbortError.

  mkdirSync(join(root, ".output", "server"), { recursive: true });
  mkdirSync(join(root, ".output", "public"), { recursive: true });

  if (existsSync(clientDir)) {
    cpSync(clientDir, join(root, ".output", "public"), { recursive: true });
    console.log("[build-output] Copied dist/client → .output/public");
  }

  const MIME = {
    ".js":   "application/javascript",
    ".mjs":  "application/javascript",
    ".css":  "text/css",
    ".html": "text/html",
    ".json": "application/json",
    ".png":  "image/png",
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif":  "image/gif",
    ".svg":  "image/svg+xml",
    ".ico":  "image/x-icon",
    ".woff": "font/woff",
    ".woff2":"font/woff2",
    ".ttf":  "font/ttf",
    ".mp4":  "video/mp4",
    ".webm": "video/webm",
    ".txt":  "text/plain",
    ".xml":  "application/xml",
  };

  // The server entry uses Node's http module — no Bun APIs.
  const serverEntry = `#!/usr/bin/env node
/**
 * GJ Media House — Node.js production server
 * Serves static assets directly; all other requests go to the Nitro handler.
 * Must be run with Node.js (not Bun) to get the correct react-dom SSR bundle.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dir      = dirname(__filename);
const PORT       = Number(process.env.PORT ?? 5000);
const PUBLIC_DIR = join(__dir, "..", "public");

const MIME = ${JSON.stringify(MIME, null, 2)};

// Import the Nitro handler (built by vite build)
const { default: handler } = await import("../../dist/server/server.js");

const server = createServer(async (req, res) => {
  try {
    const url  = new URL(req.url, "http://localhost");
    const file = join(PUBLIC_DIR, url.pathname);

    // Serve static assets from .output/public
    try {
      const info = await stat(file);
      if (info.isFile()) {
        const ext    = extname(file);
        const mime   = MIME[ext] ?? "application/octet-stream";
        const isHtml = ext === ".html";
        const buf    = await readFile(file);
        res.writeHead(200, {
          "Content-Type":  mime,
          "Content-Length": buf.length,
          "Cache-Control":  isHtml
            ? "no-cache"
            : "public, max-age=31536000, immutable",
        });
        res.end(buf);
        return;
      }
    } catch {
      // not a static file — fall through to Nitro
    }

    // Forward to Nitro SSR handler
    const reqBody = await new Promise((resolve) => {
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => resolve(Buffer.concat(chunks)));
    });

    const fetchReq = new Request(\`http://localhost\${req.url}\`, {
      method:  req.method,
      headers: Object.fromEntries(
        Object.entries(req.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : v])
      ),
      ...(reqBody.length ? { body: reqBody } : {}),
    });

    const fetchRes = await handler.fetch(fetchReq);
    res.writeHead(fetchRes.status, Object.fromEntries(fetchRes.headers));
    if (fetchRes.body) {
      const reader = fetchRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    console.error("[server] Request error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal server error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(\`GJ Media House production server on http://0.0.0.0:\${PORT} (Node.js)\`);
});

process.on("SIGTERM", () => { server.close(() => process.exit(0)); });
process.on("SIGINT",  () => { server.close(() => process.exit(0)); });
`;

  writeFileSync(join(root, ".output", "server", "index.mjs"), serverEntry);
  console.log("[build-output] Created .output/server/index.mjs (Node.js HTTP)");
}
