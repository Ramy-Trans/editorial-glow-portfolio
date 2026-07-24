/**
 * src/lib/booking-fns.ts
 *
 * TanStack Start server-function wrappers.
 *
 * These functions run inside the Nitro/Cloudflare Worker — no separate Express
 * process is needed. Database access goes via Supabase (HTTP, edge-compatible).
 *
 * On Replit dev the same code runs inside the Vite/Nitro server. The Express
 * API in api/ is no longer called by these functions; it is kept only as a
 * standalone server for direct local testing.
 */
import { createServerFn } from "@tanstack/react-start";
import { getSupabase } from "./db.server";
import { signToken, verifyToken } from "./auth.server";

/* ── Types ───────────────────────────────────────────────────── */

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

/* ── Validation helpers ──────────────────────────────────────── */

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function throwBad(message: string): never {
  const err = new Error(message);
  (err as Error & { status: number }).status = 400;
  throw err;
}

/* ── Public form submissions ─────────────────────────────────── */

export const submitContactFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as ContactInput)
  .handler(async ({ data }) => {
    if (!str(data.name)) throwBad("name is required");
    if (!str(data.email)) throwBad("email is required");
    if (!isValidEmail(data.email)) throwBad("Invalid email address");

    const { error } = await getSupabase()
      .from("contact_messages")
      .insert({
        name: str(data.name),
        email: str(data.email),
        phone: str(data.phone),
        event_type: str(data.event_type),
        message: str(data.message),
      });

    if (error) {
      console.error("[submitContactFn] Supabase insert error:", error.message);
      throw new Error("Failed to save message. Please try again.");
    }

    return { success: true as const };
  });

export const submitBookingFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as BookingInput)
  .handler(async ({ data }) => {
    if (!str(data.name)) throwBad("name is required");
    if (!str(data.email)) throwBad("email is required");
    if (!str(data.phone)) throwBad("phone is required");
    if (!str(data.occasion)) throwBad("occasion is required");
    if (!isValidEmail(data.email)) throwBad("Invalid email address");

    const { error } = await getSupabase()
      .from("bookings")
      .insert({
        name: str(data.name),
        email: str(data.email),
        phone: str(data.phone),
        occasion: str(data.occasion),
        description: str(data.description),
      });

    if (error) {
      console.error("[submitBookingFn] Supabase insert error:", error.message);
      throw new Error("Failed to save booking. Please try again.");
    }

    return { success: true as const };
  });

/* ── Admin auth ──────────────────────────────────────────────── */

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { password: string })
  .handler(async ({ data }) => {
    if (!data.password) throwBad("Password required");

    const adminPass =
      process.env.ADMIN_PASSWORD ?? "GJstudio#5x2uivfd8RufEwXX!2026";

    if (data.password !== adminPass) {
      // Small delay to slow brute-force attempts
      await new Promise((r) => setTimeout(r, 300));
      const err = new Error("Incorrect password");
      (err as Error & { status: number }).status = 401;
      throw err;
    }

    const token = await signToken();
    return { token };
  });

export const verifyAdminFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    const valid = await verifyToken(data.token);
    return { valid };
  });

/* ── Admin data ──────────────────────────────────────────────── */

export const getBookingsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) {
      const err = new Error("Unauthorized");
      (err as Error & { status: number }).status = 401;
      throw err;
    }

    const { data: bookings, error } = await getSupabase()
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return { bookings: (bookings ?? []) as Booking[] };
  });

export const getContactMessagesFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) {
      const err = new Error("Unauthorized");
      (err as Error & { status: number }).status = 401;
      throw err;
    }

    const { data: messages, error } = await getSupabase()
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return { messages: (messages ?? []) as ContactMessage[] };
  });

export const updateBookingStatusFn = createServerFn({ method: "POST" })
  .validator(
    (d: unknown) => d as { token: string; id: number; status: string }
  )
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) {
      const err = new Error("Unauthorized");
      (err as Error & { status: number }).status = 401;
      throw err;
    }

    const allowed = new Set(["pending", "confirmed", "rejected"]);
    if (!allowed.has(data.status)) {
      throwBad("status must be pending | confirmed | rejected");
    }

    const { error, count } = await getSupabase()
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id)
      .select("id", { count: "exact", head: true });

    if (error) throw new Error(error.message);
    if (!count) throwBad("Booking not found");

    return { success: true as const };
  });

export const deleteBookingFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) {
      const err = new Error("Unauthorized");
      (err as Error & { status: number }).status = 401;
      throw err;
    }

    const { error } = await getSupabase()
      .from("bookings")
      .delete()
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true as const };
  });

export const deleteContactMessageFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) {
      const err = new Error("Unauthorized");
      (err as Error & { status: number }).status = 401;
      throw err;
    }

    const { error } = await getSupabase()
      .from("contact_messages")
      .delete()
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true as const };
  });
