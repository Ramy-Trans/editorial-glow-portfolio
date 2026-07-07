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
// pg helper — used when SUPABASE_SERVICE_ROLE_KEY is absent (local Node.js dev)
// ---------------------------------------------------------------------------
export function useDirectPg(): boolean {
  return !SUPABASE_KEY && !!process.env.SUPABASE_DATABASE_URL;
}

let _pool: import("pg").Pool | null = null;

export async function getPgPool(): Promise<import("pg").Pool> {
  if (_pool) return _pool;
  const { Pool } = await import("pg");
  _pool = new Pool({
    connectionString: process.env.SUPABASE_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
  });
  return _pool;
}
