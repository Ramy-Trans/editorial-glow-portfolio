-- ============================================================
-- GJ Media House — Database Schema  (rebuild-safe)
--
-- Tables   : bookings, contact_messages
-- Auth     : Server-side HMAC only — no DB auth tables needed
-- Targets  : Replit PostgreSQL (dev) · Supabase PostgreSQL (prod)
--
-- HOW TO APPLY
--   Replit  → psql "$DATABASE_URL" -f database/schema.sql
--   Supabase → Dashboard → SQL Editor → paste this file → Run
--
-- SAFE TO RE-RUN: drops everything first, then recreates cleanly.
-- ============================================================


-- ── 0. TEARDOWN  ────────────────────────────────────────────
--
-- Drop tables (cascade removes dependent indexes/triggers/fks)
-- Drop the shared trigger function last.

DROP TABLE  IF EXISTS public.contact_messages CASCADE;
DROP TABLE  IF EXISTS public.bookings         CASCADE;
DROP FUNCTION IF EXISTS public.gj_set_updated_at() CASCADE;


-- ── 1. SHARED TRIGGER FUNCTION  ─────────────────────────────

CREATE OR REPLACE FUNCTION public.gj_set_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.gj_set_updated_at() IS
  'Sets updated_at to the current timestamp on every UPDATE.';


-- ── 2. TABLE: bookings  ──────────────────────────────────────
--
-- Source interfaces (src/lib/booking-fns.ts):
--   BookingInput  { name, email, phone, occasion, description }
--   Booking       extends BookingInput + { id, status, created_at, updated_at }

CREATE TABLE public.bookings (
  id          bigserial    NOT NULL,
  name        text         NOT NULL,
  email       text         NOT NULL CHECK (email LIKE '%@%'),
  phone       text         NOT NULL,
  occasion    text         NOT NULL,
  description text         NOT NULL DEFAULT '',
  status      text         NOT NULL DEFAULT 'pending',
  created_at  timestamptz  NOT NULL DEFAULT now(),
  updated_at  timestamptz  NOT NULL DEFAULT now(),

  CONSTRAINT bookings_pkey
    PRIMARY KEY (id),

  CONSTRAINT bookings_status_check
    CHECK (status IN ('pending', 'confirmed', 'rejected'))
);

-- Trigger: keep updated_at current
CREATE TRIGGER bookings_set_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.gj_set_updated_at();

-- Comments
COMMENT ON TABLE  public.bookings             IS 'Booking enquiries submitted via /booking.';
COMMENT ON COLUMN public.bookings.occasion    IS 'Type of event/occasion the client is booking for.';
COMMENT ON COLUMN public.bookings.description IS 'Free-text details provided by the client.';
COMMENT ON COLUMN public.bookings.status      IS 'Workflow state: pending → confirmed | rejected.';
COMMENT ON COLUMN public.bookings.updated_at  IS 'Auto-updated by trigger on every status change.';

-- Indexes (match ORDER BY and WHERE patterns used by the dashboard)
CREATE INDEX bookings_created_at_idx ON public.bookings (created_at DESC);
CREATE INDEX bookings_status_idx     ON public.bookings (status);
CREATE INDEX bookings_email_idx      ON public.bookings (email);


-- ── 3. TABLE: contact_messages  ─────────────────────────────
--
-- Source interfaces (src/lib/booking-fns.ts):
--   ContactInput    { name, email, phone, event_type, message }
--   ContactMessage  extends ContactInput + { id, created_at, updated_at }

CREATE TABLE public.contact_messages (
  id          bigserial    NOT NULL,
  name        text         NOT NULL,
  email       text         NOT NULL CHECK (email LIKE '%@%'),
  phone       text         NOT NULL,
  event_type  text         NOT NULL DEFAULT '',
  message     text         NOT NULL DEFAULT '',
  created_at  timestamptz  NOT NULL DEFAULT now(),
  updated_at  timestamptz  NOT NULL DEFAULT now(),

  CONSTRAINT contact_messages_pkey
    PRIMARY KEY (id)
);

-- Trigger: keep updated_at current
CREATE TRIGGER contact_messages_set_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.gj_set_updated_at();

-- Comments
COMMENT ON TABLE  public.contact_messages            IS 'Messages submitted via the /contact page.';
COMMENT ON COLUMN public.contact_messages.event_type IS 'Optional event category the enquiry relates to.';
COMMENT ON COLUMN public.contact_messages.message    IS 'Free-text message body from the visitor.';
COMMENT ON COLUMN public.contact_messages.updated_at IS 'Auto-updated by trigger on every row update.';

-- Indexes
CREATE INDEX contact_messages_created_at_idx ON public.contact_messages (created_at DESC);
CREATE INDEX contact_messages_email_idx      ON public.contact_messages (email);


-- ── 4. ROW-LEVEL SECURITY  ──────────────────────────────────
--
-- The server exclusively uses SUPABASE_SERVICE_ROLE_KEY, which
-- bypasses RLS by design.  Enabling RLS with NO permissive
-- policies means the anon key (if ever accidentally used
-- client-side) is denied at the DB level — zero data exposure.

ALTER TABLE public.bookings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- No permissive policies are created intentionally.
-- service_role key  → bypasses RLS ✓
-- anon / authed key → denied by default ✓


-- ── 5. VERIFICATION QUERY  ──────────────────────────────────
--
-- Run this after applying. All rows should show 0 / ready.

SELECT
  relname                                           AS table_name,
  (SELECT count(*) FROM public.bookings)            AS row_count,
  'ready'                                           AS status
FROM pg_class
WHERE relname = 'bookings'
  AND relnamespace = 'public'::regnamespace

UNION ALL

SELECT
  relname,
  (SELECT count(*) FROM public.contact_messages),
  'ready'
FROM pg_class
WHERE relname = 'contact_messages'
  AND relnamespace = 'public'::regnamespace;
