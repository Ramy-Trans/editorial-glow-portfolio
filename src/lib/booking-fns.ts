/**
 * src/lib/booking-fns.ts
 *
 * Thin TanStack Start server-function wrappers.
 * All business logic, validation, and database access live in the Express
 * API server (api/index.js).  These wrappers translate the createServerFn
 * RPC calls the frontend makes into plain HTTP calls to that API, so the
 * frontend (booking.tsx, contact.tsx, dashboard.tsx) is unchanged.
 */
import { createServerFn } from "@tanstack/react-start";

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

/* ── Internal fetch helper ───────────────────────────────────── */

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3001";

async function apiCall<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const json = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));

  if (!res.ok) {
    const err = new Error(
      (json as { error?: string }).error ?? `Request failed (${res.status})`
    );
    throw err;
  }
  return json as T;
}

/* ── Public form submissions ─────────────────────────────────── */

export const submitContactFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as ContactInput)
  .handler(async ({ data }) => {
    return apiCall<{ success: true }>("POST", "/api/contact", data);
  });

export const submitBookingFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as BookingInput)
  .handler(async ({ data }) => {
    return apiCall<{ success: true }>("POST", "/api/booking", data);
  });

/* ── Admin auth ──────────────────────────────────────────────── */

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { password: string })
  .handler(async ({ data }) => {
    return apiCall<{ token: string }>("POST", "/api/admin/login", data);
  });

export const verifyAdminFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    return apiCall<{ valid: boolean }>("POST", "/api/admin/verify", data);
  });

/* ── Admin data ──────────────────────────────────────────────── */

export const getBookingsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    return apiCall<{ bookings: Booking[] }>("POST", "/api/admin/bookings", data);
  });

export const getContactMessagesFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    return apiCall<{ messages: ContactMessage[] }>(
      "POST",
      "/api/admin/messages",
      data
    );
  });

export const updateBookingStatusFn = createServerFn({ method: "POST" })
  .validator(
    (d: unknown) => d as { token: string; id: number; status: string }
  )
  .handler(async ({ data }) => {
    return apiCall<{ success: true }>(
      "PATCH",
      `/api/admin/bookings/${data.id}`,
      { token: data.token, status: data.status }
    );
  });

export const deleteBookingFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number })
  .handler(async ({ data }) => {
    return apiCall<{ success: true }>(
      "DELETE",
      `/api/admin/bookings/${data.id}`,
      { token: data.token }
    );
  });

export const deleteContactMessageFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number })
  .handler(async ({ data }) => {
    return apiCall<{ success: true }>(
      "DELETE",
      `/api/admin/messages/${data.id}`,
      { token: data.token }
    );
  });
