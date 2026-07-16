import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// IMPORTANT: Do NOT read process.env at module level.
//
// On Cloudflare Pages the Nitro fetch handler sets `globalThis.__env__ = env`
// as the very first thing it does, but module-level code runs once at isolate
// boot — before any request arrives — so module-level `process.env.*` reads
// always return undefined there.  Reading inside functions guarantees we pick
// up the live env binding on every invocation.
// ---------------------------------------------------------------------------

export function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL ?? "https://uavivgjpfuddrivsmptv.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ---------------------------------------------------------------------------
// pg helper — used when SUPABASE_SERVICE_ROLE_KEY is absent (e.g. running on
// Replit, where a Postgres database is provisioned via DATABASE_URL instead
// of Supabase).
// ---------------------------------------------------------------------------

export function useDirectPg(): boolean {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const conn = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;
  return !key && !!conn;
}

// Cache the pool on `globalThis` (not just a module-level variable) so Vite's
// dev-server HMR — which re-evaluates this module on every edit — reuses the
// same pool instead of creating a new one and leaking the old one's
// connections until the DB's connection limit is exhausted.
declare global {
  // eslint-disable-next-line no-var
  var __gjPgPool: import("pg").Pool | undefined;
}

export async function getPgPool(): Promise<import("pg").Pool> {
  if (globalThis.__gjPgPool) return globalThis.__gjPgPool;
  const { Pool } = await import("pg");
  const conn = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;
  const isReplitDb = !!process.env.DATABASE_URL && !process.env.SUPABASE_DATABASE_URL;
  const pool = new Pool({
    connectionString: conn,
    // Replit's managed Postgres doesn't need/accept the relaxed Supabase SSL
    // settings; only apply them when actually talking to Supabase's pooler.
    ssl: isReplitDb ? undefined : { rejectUnauthorized: false },
    max: 5,
  });
  pool.on("error", (err) => {
    // Prevent an idle client error (e.g. a dropped connection) from crashing
    // the whole process — log it and let the pool recover on next use.
    console.error("[db] Unexpected pg pool error:", err);
  });
  globalThis.__gjPgPool = pool;
  return pool;
}
