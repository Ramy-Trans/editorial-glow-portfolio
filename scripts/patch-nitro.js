import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Patch 1: nitro/dist/vite.mjs ────────────────────────────────────────────
// Fixes optional-chaining crash on rolldown metadata access during build.
const nitroVitePath = join(__dirname, "../node_modules/nitro/dist/vite.mjs");

const viteOriginal = "ctx._isRolldown = !!this.meta.rolldownVersion;";
const vitePatched  = "ctx._isRolldown = !!(this?.meta?.rolldownVersion);";

try {
  let content = readFileSync(nitroVitePath, "utf8");
  if (content.includes(vitePatched)) {
    console.log("[patch-nitro] vite.mjs: Already patched — skipping.");
  } else if (content.includes(viteOriginal)) {
    content = content.replace(viteOriginal, vitePatched);
    writeFileSync(nitroVitePath, content, "utf8");
    console.log("[patch-nitro] vite.mjs: Patched ✓");
  } else {
    console.warn("[patch-nitro] vite.mjs: Pattern not found — check nitro version.");
  }
} catch (err) {
  console.warn("[patch-nitro] vite.mjs Warning:", err.message);
}

// ── Patch 2: nitro/dist/presets/cloudflare/runtime/cloudflare-pages.mjs ─────
// ROOT CAUSE FIX for "Incorrect password" on Cloudflare Pages.
//
// Bug: The cloudflare-pages fetch handler never assigns globalThis.__env__ = env.
// Nitro's unenv shim provides process.env as a proxy over globalThis.__env__.
// Without the assignment, process.env.ADMIN_PASSWORD (and every other env var)
// resolves to undefined inside server functions, causing the fallback hardcoded
// password to be used instead of the real Cloudflare Pages environment variable.
//
// Fix: Insert `globalThis.__env__ = env;` as the first statement in the fetch
// handler — identical to what _module-handler.mjs already does correctly.
const cfPagesPath = join(
  __dirname,
  "../node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-pages.mjs"
);

const cfOriginal = "\tasync fetch(cfReq, env, context) {\n\t\taugmentReq(cfReq, {";
const cfPatched  = "\tasync fetch(cfReq, env, context) {\n\t\tglobalThis.__env__ = env;\n\t\taugmentReq(cfReq, {";

try {
  let content = readFileSync(cfPagesPath, "utf8");
  if (content.includes(cfPatched)) {
    console.log("[patch-nitro] cloudflare-pages.mjs: Already patched — skipping.");
  } else if (content.includes(cfOriginal)) {
    content = content.replace(cfOriginal, cfPatched);
    writeFileSync(cfPagesPath, content, "utf8");
    console.log("[patch-nitro] cloudflare-pages.mjs: Patched globalThis.__env__ fix ✓");
  } else {
    console.warn("[patch-nitro] cloudflare-pages.mjs: Pattern not found — check nitro version.");
  }
} catch (err) {
  console.warn("[patch-nitro] cloudflare-pages.mjs Warning:", err.message);
}

process.exit(0);
