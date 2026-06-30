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
  const secret = process.env.ADMIN_SECRET || "fallback-secret";
  const sig = await hmacHex(secret, `admin:${ts}`);
  return btoa(`admin:${ts}:${sig}`);
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const decoded = atob(token);
    const [, tsStr, sig] = decoded.split(":");
    const ts = parseInt(tsStr, 10);
    if (Date.now() - ts > 86_400_000) return false;
    const secret = process.env.ADMIN_SECRET || "fallback-secret";
    const expected = await hmacHex(secret, `admin:${ts}`);
    return sig === expected;
  } catch {
    return false;
  }
}

export const submitBookingFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as BookingInput)
  .handler(async ({ data }) => {
    const { getSupabase } = await import("./db");
    const sb = getSupabase();
    const { error } = await sb.from("bookings").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      occasion: data.occasion,
      description: data.description,
    });
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const submitContactFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as ContactInput)
  .handler(async ({ data }) => {
    const { getSupabase } = await import("./db");
    const sb = getSupabase();
    const { error } = await sb.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      event_type: data.event_type,
      message: data.message,
    });
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { password: string })
  .handler(async ({ data }) => {
    const adminPass = process.env.ADMIN_PASSWORD || "GJstudio#Cairo2026!Events";
    if (data.password !== adminPass) throw new Error("Invalid password");
    return { token: await signToken() };
  });

export const verifyAdminFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    return { valid: await verifyToken(data.token) };
  });

export const getBookingsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    const { getSupabase } = await import("./db");
    const sb = getSupabase();
    const { data: rows, error } = await sb
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { bookings: (rows ?? []) as Booking[] };
  });

export const getContactMessagesFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    const { getSupabase } = await import("./db");
    const sb = getSupabase();
    const { data: rows, error } = await sb
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { messages: (rows ?? []) as ContactMessage[] };
  });

export const updateBookingStatusFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number; status: string })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    const allowed = ["pending", "confirmed", "rejected"];
    if (!allowed.includes(data.status)) throw new Error("Invalid status");
    const { getSupabase } = await import("./db");
    const sb = getSupabase();
    const { error } = await sb
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const deleteBookingFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    const { getSupabase } = await import("./db");
    const sb = getSupabase();
    const { error } = await sb.from("bookings").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const deleteContactMessageFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { token: string; id: number })
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw new Error("Unauthorized");
    const { getSupabase } = await import("./db");
    const sb = getSupabase();
    const { error } = await sb
      .from("contact_messages")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });
