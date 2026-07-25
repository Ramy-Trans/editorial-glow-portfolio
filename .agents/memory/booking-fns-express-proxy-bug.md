---
name: booking-fns Express proxy bug
description: Root cause of "fetch failed" on /dashboard in Replit deployment — Express not running in prod.
---

# booking-fns Express Proxy Bug

## The Rule
Never proxy createServerFn handlers to a separate Express process. Put DB logic directly in the handlers.

**Why:** The Replit deployment run command (`bun run .output/server/index.mjs`) only starts the Nitro SSR server. Express is NOT started. Any `http://localhost:3001` call from a server function hits ERR_CONNECTION_REFUSED → "fetch failed" in the browser. The dev workflow starts both servers, masking the bug in dev.

**How to apply:** Server functions in `booking-fns.ts` must call the DB directly. The abstraction layer is `@/lib/db-impl.server` (aliased in vite.config.ts).

## DB Layer Architecture

Two implementations behind a shared interface:

- `src/lib/db-impl.server.ts` — pg pool (Node.js / Replit deployment, uses DATABASE_URL)
- `src/lib/db-impl.supabase.server.ts` — Supabase HTTP (Cloudflare Workers, uses SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)

`vite.config.ts` switches between them: when `CF_PAGES=1`, `@/lib/db-impl.server` resolves to the Supabase file. Otherwise pg.

## Symptoms
- Works on `.replit.app` preview URL (dev workflow, both servers running)
- "fetch failed" on custom domain / deployed URL (only Nitro running)
- Specifically on /dashboard (all createServerFn calls fail)
