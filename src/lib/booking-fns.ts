import { createServerFn } from "@tanstack/react-start";
import { query } from "./db";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  updated_at: string;
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
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

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
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Public form submissions
// ---------------------------------------------------------------------------

export const submitContactFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as ContactInput)
  .handler(async ({ data }) => {
    await query(
      `INSERT INTO contact_messages (name, email, phone, event_type, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [data.name, data.email, data.phone ?? "", data.event_type ?? "", data.message ?? ""]
    );
    return { success: true };
  });

export const submitBookingFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as BookingInput)
  .handler(async ({ data }) => {
    await query(
      `INSERT INTO bookings (name, email, phone, occasion, description)
       VALUES ($1, $2, $3, $4, $5)`,
      [data.name, data.email, data.phone ?? "", data.occasion ?? "", data.description ?? ""]
    );
    return { success: true };
  });

// ---------------------------------------------------------------------------
// Admin auth
// ---------------------------------------------------------------------------

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { password: string })
  .handler(async ({ data }) => {
    const adminPass = process.env.ADMIN_PASSWORD ?? "GJstudio#5x2uivfd8RufEwXX!2026";
    if (data.password !== adminPass) throw new Error("Incorrect password");
    return { token: await signToken() };
  });

export const verifyAdminFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    return { valid: await verifyToken(data.token) };
  });

// ---------------------------------------------------------------------------
// Admin data
// ---------------------------------------------------------------------------

export const getBookingsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    const bookings = await query<Booking>(
      "SELECT * FROM bookings ORDER BY created_at DESC"
    );
    return { bookings };
  });

export const getContactMessagesFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    const messages = await query<ContactMessage>(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    return { messages };
  });

export const updateBookingStatusFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number; status: string })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    const allowed = ["pending", "confirmed", "rejected"];
    if (!allowed.includes(data.status)) throw new Error("Invalid status");
    await query("UPDATE bookings SET status = $1 WHERE id = $2", [data.status, data.id]);
    return { success: true };
  });

export const deleteBookingFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    await query("DELETE FROM bookings WHERE id = $1", [data.id]);
    return { success: true };
  });

export const deleteContactMessageFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    await query("DELETE FROM contact_messages WHERE id = $1", [data.id]);
    return { success: true };
  });
