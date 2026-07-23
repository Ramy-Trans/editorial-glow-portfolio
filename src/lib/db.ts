// ---------------------------------------------------------------------------
// Database — Replit PostgreSQL via pg Pool
//
// Env var: DATABASE_URL (auto-provided by Replit PostgreSQL)
//
// The pool is cached on globalThis so Vite HMR re-evaluations in dev
// reuse the same pool instead of leaking connections.
// ---------------------------------------------------------------------------

import type { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __gjPgPool: Pool | undefined;
}

export async function getPool(): Promise<Pool> {
  if (globalThis.__gjPgPool) return globalThis.__gjPgPool;

  const { Pool } = await import("pg");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  pool.on("error", (err) => {
    console.error("[db] Unexpected pool error:", err);
  });

  globalThis.__gjPgPool = pool;
  return pool;
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = await getPool();
  const { rows } = await pool.query(sql, params);
  return rows as T[];
}
