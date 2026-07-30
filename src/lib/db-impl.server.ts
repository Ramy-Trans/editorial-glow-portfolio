/**
 * src/lib/db-impl.server.ts — PostgreSQL (pg) implementation
 *
 * Used in Node.js environments: Replit deployment, local dev, traditional VPS.
 * DATABASE_URL is provided automatically by Replit PostgreSQL.
 *
 * NOT compatible with Cloudflare Workers (no TCP sockets).
 * For Cloudflare builds (CF_PAGES=1), vite.config.ts aliases this module to
 * db-impl.supabase.server.ts which uses the HTTP-based Supabase client instead.
 *
 * Schema: database/schema.sql
 */
import pg from "pg";
import type { BookingInput, ContactInput, Booking, ContactMessage } from "./booking-fns";

const { Pool } = pg;

let _pool: InstanceType<typeof Pool> | null = null;

function getPool() {
  if (_pool) return _pool;
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "[db] DATABASE_URL is not set. On Replit it is provided automatically by the PostgreSQL integration."
    );
  }
  _pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
  _pool.on("error", (err) => {
    console.error("[db] Idle client error:", err.message);
  });
  return _pool;
}

async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  try {
    const { rows } = await getPool().query(sql, params);
    return rows as T[];
  } catch (err) {
    const e = err as Error;
    console.error("[db] Query failed:", e.message, "| SQL:", sql.slice(0, 120));
    throw err;
  }
}

/* ── Contact ─────────────────────────────────────────────────── */

export async function insertContact(data: ContactInput): Promise<void> {
  await query(
    `INSERT INTO contact_messages (name, email, phone, event_type, message)
     VALUES ($1, $2, $3, $4, $5)`,
    [data.name, data.email, data.phone, data.event_type, data.message]
  );
}

/* ── Bookings ────────────────────────────────────────────────── */

export async function insertBooking(data: BookingInput): Promise<void> {
  await query(
    `INSERT INTO bookings (name, email, phone, occasion, description)
     VALUES ($1, $2, $3, $4, $5)`,
    [data.name, data.email, data.phone, data.occasion, data.description]
  );
}

export async function getBookings(): Promise<Booking[]> {
  return query<Booking>("SELECT * FROM bookings ORDER BY created_at DESC");
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  return query<ContactMessage>(
    "SELECT * FROM contact_messages ORDER BY created_at DESC"
  );
}

export async function updateBookingStatus(
  id: number,
  status: string
): Promise<{ found: boolean }> {
  const rows = await query<{ id: number }>(
    "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id",
    [status, id]
  );
  return { found: rows.length > 0 };
}

export async function deleteBooking(id: number): Promise<void> {
  await query("DELETE FROM bookings WHERE id = $1", [id]);
}

export async function deleteContactMessage(id: number): Promise<void> {
  await query("DELETE FROM contact_messages WHERE id = $1", [id]);
}
