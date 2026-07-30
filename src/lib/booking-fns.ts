/**
 * src/lib/booking-fns.ts
 *
 * TanStack Start server-function wrappers.
 * All DB operations are delegated to "@/lib/db-impl.server", which resolves to:
 *   - db-impl.server.ts         (pg, direct TCP) — Replit / Node.js deployments
 *   - db-impl.supabase.server.ts (Supabase HTTP) — Cloudflare Pages builds (CF_PAGES=1)
 *
 * The alias is set in vite.config.ts. No code changes needed when switching targets.
 *
 * WHAT WAS WRONG BEFORE (the "fetch failed" root cause):
 *   const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3001";
 *   Every handler proxied server-side to the Express API on port 3001.
 *   The Replit deployment run command only starts Nitro — Express never runs in
 *   production, so every createServerFn call hit ERR_CONNECTION_REFUSED and the
 *   browser showed "fetch failed". The .replit.app preview worked because it ran
 *   the dev workflow which starts both servers.
 */
import { createServerFn } from "@tanstack/react-start";
import * as db from "@/lib/db-impl.server";
import { signToken, verifyToken } from "./auth.server";

/* ── Types (re-exported so the dashboard can import them) ────── */

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

    await db.insertContact({
      name: str(data.name),
      email: str(data.email),
      phone: str(data.phone),
      event_type: str(data.event_type),
      message: str(data.message),
    });

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

    await db.insertBooking({
      name: str(data.name),
      email: str(data.email),
      phone: str(data.phone),
      occasion: str(data.occasion),
      description: str(data.description),
    });

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
    const bookings = await db.getBookings();
    return { bookings };
  });

export const getContactMessagesFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) {
      const err = new Error("Unauthorized");
      (err as Error & { status: number }).status = 401;
      throw err;
    }
    const messages = await db.getContactMessages();
    return { messages };
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

    const { found } = await db.updateBookingStatus(data.id, data.status);
    if (!found) throwBad("Booking not found");

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
    await db.deleteBooking(data.id);
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
    await db.deleteContactMessage(data.id);
    return { success: true as const };
  });
