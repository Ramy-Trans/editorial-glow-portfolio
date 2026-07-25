/**
 * src/lib/db-impl.supabase.server.ts — Supabase HTTP implementation
 *
 * Used in Cloudflare Workers builds (CF_PAGES=1). The Supabase JS client
 * communicates over HTTP — no TCP sockets required, fully edge-compatible.
 *
 * Required env vars (set in Cloudflare Pages → Settings → Environment Variables):
 *   SUPABASE_URL              — https://xxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (not the anon key)
 *
 * vite.config.ts aliases "@/lib/db-impl.server" → this file when CF_PAGES=1.
 *
 * Schema: database/schema.sql (run in Supabase SQL editor)
 */
import { getSupabase } from "./db.server";
import type { BookingInput, ContactInput, Booking, ContactMessage } from "./booking-fns";

/* ── Contact ─────────────────────────────────────────────────── */

export async function insertContact(data: ContactInput): Promise<void> {
  const { error } = await getSupabase().from("contact_messages").insert({
    name: data.name,
    email: data.email,
    phone: data.phone,
    event_type: data.event_type,
    message: data.message,
  });
  if (error) throw new Error(error.message);
}

/* ── Bookings ────────────────────────────────────────────────── */

export async function insertBooking(data: BookingInput): Promise<void> {
  const { error } = await getSupabase().from("bookings").insert({
    name: data.name,
    email: data.email,
    phone: data.phone,
    occasion: data.occasion,
    description: data.description,
  });
  if (error) throw new Error(error.message);
}

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await getSupabase()
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Booking[];
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await getSupabase()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ContactMessage[];
}

export async function updateBookingStatus(
  id: number,
  status: string
): Promise<{ found: boolean }> {
  const { error, count } = await getSupabase()
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return { found: (count ?? 0) > 0 };
}

export async function deleteBooking(id: number): Promise<void> {
  const { error } = await getSupabase().from("bookings").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteContactMessage(id: number): Promise<void> {
  const { error } = await getSupabase()
    .from("contact_messages")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}
