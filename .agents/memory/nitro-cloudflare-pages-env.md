---
name: Nitro cloudflare-pages process.env bug
description: In Nitro's cloudflare-pages preset, process.env is always undefined inside server functions unless patched. Fix lives in scripts/patch-nitro.js.
---

# Nitro cloudflare-pages — process.env always undefined

## The rule
Any `process.env.*` access inside TanStack Start server functions (`createServerFn`) returns `undefined` when deployed to Cloudflare Pages with Nitro's `cloudflare-pages` preset, unless the patch in `scripts/patch-nitro.js` is applied.

**Why:** Nitro's `unenv` shim proxies `process.env` over `globalThis.__env__`. The `cloudflare-pages.mjs` fetch handler receives the CF `env` object but never assigns `globalThis.__env__ = env`. The `_module-handler.mjs` (cloudflare-module preset) correctly does this on its first line — the pages preset omitted it. This is a bug in the Nitro beta version used by this project.

**How to apply:** `scripts/patch-nitro.js` runs as the `postinstall` script. It patches both:
1. `nitro/dist/vite.mjs` — optional-chaining crash fix
2. `nitro/dist/presets/cloudflare/runtime/cloudflare-pages.mjs` — inserts `globalThis.__env__ = env;` as the first line of the fetch handler

If Nitro is upgraded and the patch pattern is not found, the script logs a warning. Re-inspect the new `cloudflare-pages.mjs` fetch handler and update the patch strings accordingly.

**Symptom if patch is missing:** Every `process.env.*` in server functions returns `undefined`. Auth falls back to hardcoded defaults, Supabase client gets no URL/key and fails silently.
