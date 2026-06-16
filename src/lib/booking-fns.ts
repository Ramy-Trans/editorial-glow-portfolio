import { createServerFn } from "@tanstack/react-start";
import { createHmac } from "crypto";

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

function signToken(): string {
  const ts = Date.now();
  const secret = process.env.ADMIN_SECRET || "fallback-secret";
  const sig = createHmac("sha256", secret)
    .update(`admin:${ts}`)
    .digest("hex");
  return Buffer.from(`admin:${ts}:${sig}`).toString("base64");
}

function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [, tsStr, sig] = decoded.split(":");
    const ts = parseInt(tsStr, 10);
    if (Date.now() - ts > 86_400_000) return false;
    const secret = process.env.ADMIN_SECRET || "fallback-secret";
    const expected = createHmac("sha256", secret)
      .update(`admin:${ts}`)
      .digest("hex");
    return sig === expected;
  } catch {
    return false;
  }
}

export const submitBookingFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as BookingInput)
  .handler(async ({ data }) => {
    const { query } = await import("./db");
    await query(
      `INSERT INTO bookings (name, email, phone, occasion, description) VALUES ($1, $2, $3, $4, $5)`,
      [data.name, data.email, data.phone, data.occasion, data.description]
    );
    return { success: true };
  });

export const submitContactFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as ContactInput)
  .handler(async ({ data }) => {
    const { query } = await import("./db");
    await query(
      `INSERT INTO contact_messages (name, email, phone, event_type, message) VALUES ($1, $2, $3, $4, $5)`,
      [data.name, data.email, data.phone, data.event_type, data.message]
    );
    return { success: true };
  });

export const adminLoginFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { password: string })
  .handler(async ({ data }) => {
    const adminPass = process.env.ADMIN_PASSWORD || "GJstudio#Cairo2026!Events";
    if (data.password !== adminPass) {
      throw new Error("Invalid password");
    }
    return { token: signToken() };
  });

export const verifyAdminFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    return { valid: verifyToken(data.token) };
  });

export const getBookingsFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    if (!verifyToken(data.token)) throw new Error("Unauthorized");
    const { query } = await import("./db");
    const result = await query(
      `SELECT * FROM bookings ORDER BY created_at DESC`
    );
    return { bookings: result.rows as Booking[] };
  });

export const getContactMessagesFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    if (!verifyToken(data.token)) throw new Error("Unauthorized");
    const { query } = await import("./db");
    const result = await query(
      `SELECT * FROM contact_messages ORDER BY created_at DESC`
    );
    return { messages: result.rows as ContactMessage[] };
  });

export const updateBookingStatusFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { token: string; id: number; status: string })
  .handler(async ({ data }) => {
    if (!verifyToken(data.token)) throw new Error("Unauthorized");
    const allowed = ["pending", "confirmed", "rejected"];
    if (!allowed.includes(data.status)) throw new Error("Invalid status");
    const { query } = await import("./db");
    await query(`UPDATE bookings SET status = $1 WHERE id = $2`, [data.status, data.id]);
    return { success: true };
  });

export const deleteBookingFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { token: string; id: number })
  .handler(async ({ data }) => {
    if (!verifyToken(data.token)) throw new Error("Unauthorized");
    const { query } = await import("./db");
    await query(`DELETE FROM bookings WHERE id = $1`, [data.id]);
    return { success: true };
  });

export const deleteContactMessageFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { token: string; id: number })
  .handler(async ({ data }) => {
    if (!verifyToken(data.token)) throw new Error("Unauthorized");
    const { query } = await import("./db");
    await query(`DELETE FROM contact_messages WHERE id = $1`, [data.id]);
    return { success: true };
  });
