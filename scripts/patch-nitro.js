import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const nitroVitePath = join(__dirname, "../node_modules/nitro/dist/vite.mjs");

const original = "ctx._isRolldown = !!this.meta.rolldownVersion;";
const patched  = "ctx._isRolldown = !!(this?.meta?.rolldownVersion);";

try {
  let content = readFileSync(nitroVitePath, "utf8");
  if (content.includes(patched)) {
    console.log("[patch-nitro] Already patched — skipping.");
  } else if (content.includes(original)) {
    content = content.replace(original, patched);
    writeFileSync(nitroVitePath, content, "utf8");
    console.log("[patch-nitro] Patched nitro/dist/vite.mjs ✓");
  } else {
    console.warn("[patch-nitro] Pattern not found — check nitro version.");
  }
} catch (err) {
  console.warn("[patch-nitro] Warning:", err.message);
}

process.exit(0);
