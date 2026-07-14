import { createServerFn } from "@tanstack/react-start";

export interface BookingInput {
  name: string;
  email: string;
  phone: string;
  occasion: string;
  description: string;
}

export interface Booking extends BookingInput {
  id: number;
  status: string;
  created_at: string;
}

export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  event_type: string;
  message: string;
}

export interface ContactMessage extends ContactInput {
  id: number;
  created_at: string;
}

/* ── Auth helpers ──────────────────────────────────────────── */

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signToken(): Promise<string> {
  const ts = Date.now();
  const secret = process.env.ADMIN_SECRET ?? "gj-media-house-secret";
  const sig = await hmacHex(secret, `admin:${ts}`);
  return btoa(`admin:${ts}:${sig}`);
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const decoded = atob(token);
    const parts = decoded.split(":");
    if (parts.length !== 3 || parts[0] !== "admin") return false;
    const ts = parseInt(parts[1], 10);
    if (isNaN(ts) || Date.now() - ts > 86_400_000) return false;
    const secret = process.env.ADMIN_SECRET ?? "gj-media-house-secret";
    const expected = await hmacHex(secret, `admin:${ts}`);
    return parts[2] === expected;
  } catch (err) {
    console.error("[verifyToken] malformed/invalid token:", err);
    return false;
  }
}

/* ── DB helpers (dual-path: Supabase HTTP or direct pg) ────── */

async function queryBookings(): Promise<Booking[]> {
  const { useDirectPg, getPgPool, getSupabase } = await import("./db");
  if (useDirectPg()) {
    const pool = await getPgPool();
    const { rows } = await pool.query(
      "SELECT * FROM bookings ORDER BY created_at DESC"
    );
    return rows as Booking[];
  }
  const sb = getSupabase();
  const { data, error } = await sb
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Booking[];
}

async function queryMessages(): Promise<ContactMessage[]> {
  const { useDirectPg, getPgPool, getSupabase } = await import("./db");
  if (useDirectPg()) {
    const pool = await getPgPool();
    const { rows } = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    return rows as ContactMessage[];
  }
  const sb = getSupabase();
  const { data, error } = await sb
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ContactMessage[];
}

async function insertBooking(data: BookingInput): Promise<void> {
  const { useDirectPg, getPgPool, getSupabase } = await import("./db");
  if (useDirectPg()) {
    const pool = await getPgPool();
    await pool.query(
      "INSERT INTO bookings (name, email, phone, occasion, description) VALUES ($1,$2,$3,$4,$5)",
      [data.name, data.email, data.phone, data.occasion, data.description]
    );
    return;
  }
  const sb = getSupabase();
  const { error } = await sb.from("bookings").insert(data);
  if (error) throw new Error(error.message);
}

async function insertMessage(data: ContactInput): Promise<void> {
  const { useDirectPg, getPgPool, getSupabase } = await import("./db");
  if (useDirectPg()) {
    const pool = await getPgPool();
    await pool.query(
      "INSERT INTO contact_messages (name, email, phone, event_type, message) VALUES ($1,$2,$3,$4,$5)",
      [data.name, data.email, data.phone, data.event_type, data.message]
    );
    return;
  }
  const sb = getSupabase();
  const { error } = await sb.from("contact_messages").insert(data);
  if (error) throw new Error(error.message);
}

async function updateStatus(id: number, status: string): Promise<void> {
  const { useDirectPg, getPgPool, getSupabase } = await import("./db");
  if (useDirectPg()) {
    const pool = await getPgPool();
    await pool.query("UPDATE bookings SET status=$1 WHERE id=$2", [status, id]);
    return;
  }
  const sb = getSupabase();
  const { error } = await sb.from("bookings").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

async function removeBooking(id: number): Promise<void> {
  const { useDirectPg, getPgPool, getSupabase } = await import("./db");
  if (useDirectPg()) {
    const pool = await getPgPool();
    await pool.query("DELETE FROM bookings WHERE id=$1", [id]);
    return;
  }
  const sb = getSupabase();
  const { error } = await sb.from("bookings").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

async function removeMessage(id: number): Promise<void> {
  const { useDirectPg, getPgPool, getSupabase } = await import("./db");
  if (useDirectPg()) {
    const pool = await getPgPool();
    await pool.query("DELETE FROM contact_messages WHERE id=$1", [id]);
    return;
  }
  const sb = getSupabase();
  const { error } = await sb.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Public form submissions ───────────────────────────────── */

export const submitBookingFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as BookingInput)
  .handler(async ({ data }) => {
    try {
      await insertBooking(data);
      return { success: true };
    } catch (err) {
      console.error("[submitBookingFn] failed:", err);
      throw err;
    }
  });

export const submitContactFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as ContactInput)
  .handler(async ({ data }) => {
    try {
      await insertMessage(data);
      return { success: true };
    } catch (err) {
      console.error("[submitContactFn] failed:", err);
      throw err;
    }
  });

/* ── Admin auth ────────────────────────────────────────────── */

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { password: string })
  .handler(async ({ data }) => {
    const adminPass =
      process.env.ADMIN_PASSWORD ?? "GJstudio#5x2uivfd8RufEwXX!2026";
    if (data.password !== adminPass) {
      throw new Error("Incorrect password");
    }
    return { token: await signToken() };
  });

export const verifyAdminFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    return { valid: await verifyToken(data.token) };
  });

/* ── Admin data ────────────────────────────────────────────── */

export const getBookingsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    return { bookings: await queryBookings() };
  });

export const getContactMessagesFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    return { messages: await queryMessages() };
  });

export const updateBookingStatusFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number; status: string })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    const allowed = ["pending", "confirmed", "rejected"];
    if (!allowed.includes(data.status)) throw new Error("Invalid status");
    await updateStatus(data.id, data.status);
    return { success: true };
  });

export const deleteBookingFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    await removeBooking(data.id);
    return { success: true };
  });

export const deleteContactMessageFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    await removeMessage(data.id);
    return { success: true };
  });
