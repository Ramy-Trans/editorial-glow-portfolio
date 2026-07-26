---
name: CF Pages worker build pipeline
description: How the Cloudflare Pages build works for this TanStack Start project and what the build-output.js script must do.
---

# CF Pages _worker.js build

## The problem (fixed)
`build-output.js` had two bugs that silently skipped _worker.js production:

1. **NITRO_PRESET not in shell**: `vite.config.ts` sets `process.env.NITRO_PRESET = "cloudflare-pages"` _inside_ Vite's subprocess. `node scripts/build-output.js` runs in the parent shell where only `CF_PAGES=1` is set — `NITRO_PRESET` is `undefined`.

2. **Empty CF branch**: Even when forced, the old CF branch just logged "no post-processing needed" and exited — never copying files or producing `_worker.js`.

**Why:** TanStack Start's Vite plugin does NOT invoke Nitro's preset bundler. It only produces `dist/server/server.js` via Vite's SSR environment pass. Nitro's cloudflare-pages preset bundling step never runs.

## What build-output.js must do for CF Pages (current fix)

```
CF_PAGES=1  →  preset = "cloudflare-pages"
```

Steps:
1. Detect CF Pages: `process.env.NITRO_PRESET ?? (process.env.CF_PAGES ? "cloudflare-pages" : "node")`
2. Copy `dist/client/` → `.output/public/` (static assets)
3. Run esbuild to bundle `dist/server/server.js` → `.output/public/_worker.js`

esbuild flags that work:
- `--bundle --format=esm --platform=browser --target=esnext`
- `--external:node:* --external:cloudflare:*`
- `--conditions=workerd,browser,module,default --main-fields=module,browser,main`

**Why `--platform=browser` not `--platform=neutral`**: `--platform=neutral` ignores `"main"` fields in package.json, causing packages like `lucide-react` that lack `"exports"` to fail resolution.

## Build output
- `dist/server/server.js` (68 kB) — Vite SSR bundle with 5 dynamic `./assets/` chunk imports
- `_worker.js` after esbuild bundling: ~2.9 MB uncompressed, ~558 KB gzip
- Valid CF Worker: exports `{ server as default }` with a `fetch` handler

## wrangler.toml
- `compatibility_flags = ["nodejs_compat"]` — required for `node:async_hooks` (AsyncLocalStorage used by TanStack)
- `pages_build_output_dir = ".output/public"`

## On CF Pages dashboard
Build command: `npm install && npm run build`  
Build output dir: `.output/public`  
Environment variable: `CF_PAGES=1` (set automatically by CF Pages — no need to add manually)
