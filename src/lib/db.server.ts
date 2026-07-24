/**
 * src/lib/db.server.ts — Edge-compatible Supabase client
 *
 * Uses @supabase/supabase-js which communicates over HTTP, making it
 * compatible with Cloudflare Workers (no TCP sockets required).
 *
 * Required environment variables (set in Cloudflare Pages → Settings → Variables):
 *   SUPABASE_URL             — your project URL (https://xxx.supabase.co)
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (never the anon key for server use)
 *
 * The client is created lazily (inside a function, never at module scope)
 * so that process.env is already patched by Nitro's CF shim before first use.
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "[db] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. " +
        "Add them to your Cloudflare Pages environment variables."
    );
  }

  _client = createClient(url, key, {
    auth: { persistSession: false },
  });

  return _client;
}

/* ── Typed query helpers ─────────────────────────────────────── */

export interface DbBooking {
  id: number;
  name: string;
  email: string;
  phone: string;
  occasion: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DbContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  message: string;
  created_at: string;
  updated_at: string;
}
