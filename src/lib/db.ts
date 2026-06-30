import { createClient } from "@supabase/supabase-js";

function getEnvVar(key: string): string {
  const cfEnv = (globalThis as any).__env__;
  return process.env[key] ?? cfEnv?.[key] ?? "";
}

export function getSupabase() {
  const supabaseUrl = getEnvVar("SUPABASE_URL") || "https://uavivgjpfuddrivsmptv.supabase.co";
  const supabaseKey = getEnvVar("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
