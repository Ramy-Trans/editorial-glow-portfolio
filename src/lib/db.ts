// ---------------------------------------------------------------------------
// Database — Replit PostgreSQL
//
// We deliberately do NOT pass `connectionString: process.env.DATABASE_URL`
// here. Vite's SSR bundler can interfere with process.env string reads for
// long connection strings. Instead we let node-postgres read the individual
// PG* env vars (PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD) which
// Replit sets automatically and which survive the SSR context reliably.
//
// The pool is cached on globalThis so Vite HMR module re-evaluations in dev
// reuse the same pool rather than leaking connections.
// ---------------------------------------------------------------------------

import type { Pool as PgPool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __gjPgPool: PgPool | undefined;
}

export async function getPool(): Promise<PgPool> {
  if (globalThis.__gjPgPool) return globalThis.__gjPgPool;

  const { Pool } = await import("pg");

  // No options — pg reads PGHOST / PGPORT / PGDATABASE / PGUSER / PGPASSWORD
  // from the environment automatically.
  const pool = new Pool({ max: 5 });

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
