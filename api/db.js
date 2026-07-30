/**
 * api/db.js — PostgreSQL connection pool
 * Reads PGHOST / PGPORT / PGDATABASE / PGUSER / PGPASSWORD from the
 * environment (set automatically by Replit). Never uses a connection
 * string so the pool cannot be misconfigured.
 */
import pg from "pg";
const { Pool } = pg;

// Singleton pool — never recreated after first access
let _pool = null;

export function getPool() {
  if (_pool) return _pool;

  _pool = new Pool({
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  _pool.on("error", (err) => {
    // Log but do NOT crash — pg removes the bad client from the pool automatically
    console.error("[db] Idle client error (pool will recover):", err.message);
  });

  console.log("[db] Pool created (max=10)");
  return _pool;
}

/**
 * Run a parameterised query.
 * Throws with a clean message on failure so callers don't have to
 * handle raw pg errors.
 */
export async function query(sql, params = []) {
  try {
    const { rows } = await getPool().query(sql, params);
    return rows;
  } catch (err) {
    console.error("[db] Query failed:", err.message, "| SQL:", sql.slice(0, 120));
    throw err;
  }
}
