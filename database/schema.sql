-- ============================================================
-- GJ Media House — Production Database Schema
-- Generated from: src/lib/booking-fns.ts + TypeScript interfaces
--
-- Tables:   bookings, contact_messages
-- Auth:     Server-side HMAC only — no DB auth tables needed
--
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- TABLE: bookings
--
-- Sourced from:
--   BookingInput  { name, email, phone, occasion, description }
--   Booking       { id: number, status: string, created_at: string }
--
-- Supabase calls:
--   .from("bookings").insert({ name, email, phone, occasion, description })
--   .from("bookings").select("*").order("created_at", { ascending: false })
--   .from("bookings").update({ status }).eq("id", id)
--   .from("bookings").delete().eq("id", id)
-- ────────────────────────────────────────────────────────────

create table if not exists public.bookings (
  id          bigserial    primary key,
  name        text         not null,
  email       text         not null,
  phone       text         not null,
  occasion    text         not null,
  description text         not null default '',
  status      text         not null default 'pending'
                           constraint bookings_status_check
                           check (status in ('pending', 'confirmed', 'rejected')),
  created_at  timestamptz  not null default now()
);

comment on table  public.bookings               is 'Booking enquiries submitted via the /booking page.';
comment on column public.bookings.status        is 'Workflow state: pending → confirmed | rejected.';
comment on column public.bookings.occasion      is 'Type of event/occasion the client is booking for.';
comment on column public.bookings.description   is 'Free-text details provided by the client.';


-- ────────────────────────────────────────────────────────────
-- TABLE: contact_messages
--
-- Sourced from:
--   ContactInput    { name, email, phone, event_type, message }
--   ContactMessage  { id: number, created_at: string }
--
-- Supabase calls:
--   .from("contact_messages").insert({ name, email, phone, event_type, message })
--   .from("contact_messages").select("*").order("created_at", { ascending: false })
--   .from("contact_messages").delete().eq("id", id)
-- ────────────────────────────────────────────────────────────

create table if not exists public.contact_messages (
  id          bigserial    primary key,
  name        text         not null,
  email       text         not null,
  phone       text         not null,
  event_type  text         not null default '',
  message     text         not null default '',
  created_at  timestamptz  not null default now()
);

comment on table  public.contact_messages            is 'Messages submitted via the /contact page.';
comment on column public.contact_messages.event_type is 'Optional event type the enquiry relates to.';
comment on column public.contact_messages.message    is 'Free-text message body from the visitor.';


-- ────────────────────────────────────────────────────────────
-- INDEXES
-- Matches the ORDER BY and WHERE patterns used by the dashboard
-- ────────────────────────────────────────────────────────────

-- bookings: default dashboard sort + status filter
create index if not exists bookings_created_at_idx
  on public.bookings (created_at desc);

create index if not exists bookings_status_idx
  on public.bookings (status);

create index if not exists bookings_email_idx
  on public.bookings (email);

-- contact_messages: default dashboard sort
create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_email_idx
  on public.contact_messages (email);


-- ────────────────────────────────────────────────────────────
-- ROW-LEVEL SECURITY
--
-- The application exclusively uses SUPABASE_SERVICE_ROLE_KEY,
-- which bypasses RLS by design. Enabling RLS with no permissive
-- policies ensures that if the anon key were ever accidentally
-- used client-side, it would be denied at the database level.
-- ────────────────────────────────────────────────────────────

alter table public.bookings         enable row level security;
alter table public.contact_messages enable row level security;

-- No permissive policies are created intentionally.
-- Service-role key (server-only) → bypasses RLS ✓
-- Anon / authenticated keys       → denied by default ✓


-- ────────────────────────────────────────────────────────────
-- VERIFICATION
-- Run these after applying the schema. Both should return 0.
-- ────────────────────────────────────────────────────────────

select
  'bookings'         as table_name,
  count(*)           as row_count,
  'ready'            as status
from public.bookings

union all

select
  'contact_messages' as table_name,
  count(*)           as row_count,
  'ready'            as status
from public.contact_messages;
