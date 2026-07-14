import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? "https://uavivgjpfuddrivsmptv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function getSupabase(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ---------------------------------------------------------------------------
// pg helper — used when SUPABASE_SERVICE_ROLE_KEY is absent (e.g. running on
// Replit, where a Postgres database is provisioned via DATABASE_URL instead
// of Supabase).
// ---------------------------------------------------------------------------
const PG_CONNECTION_STRING =
  process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;

export function useDirectPg(): boolean {
  return !SUPABASE_KEY && !!PG_CONNECTION_STRING;
}

let _pool: import("pg").Pool | null = null;

export async function getPgPool(): Promise<import("pg").Pool> {
  if (_pool) return _pool;
  const { Pool } = await import("pg");
  const isReplitDb = !!process.env.DATABASE_URL && !process.env.SUPABASE_DATABASE_URL;
  _pool = new Pool({
    connectionString: PG_CONNECTION_STRING,
    // Replit's managed Postgres doesn't need/accept the relaxed Supabase SSL
    // settings; only apply them when actually talking to Supabase's pooler.
    ssl: isReplitDb ? undefined : { rejectUnauthorized: false },
    max: 5,
  });
  return _pool;
}
