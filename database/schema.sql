-- ============================================================
-- GJ Media House — Database Schema
--
-- Tables : bookings, contact_messages
-- DB     : Replit PostgreSQL (DATABASE_URL)
--
-- HOW TO APPLY
--   psql "$DATABASE_URL" -f database/schema.sql
--
-- SAFE TO RE-RUN: drops and recreates cleanly.
-- ============================================================

-- 0. TEARDOWN
DROP TABLE    IF EXISTS public.contact_messages CASCADE;
DROP TABLE    IF EXISTS public.bookings         CASCADE;
DROP FUNCTION IF EXISTS public.gj_set_updated_at() CASCADE;

-- 1. SHARED TRIGGER
CREATE OR REPLACE FUNCTION public.gj_set_updated_at()
  RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. bookings
CREATE TABLE public.bookings (
  id          bigserial   PRIMARY KEY,
  name        text        NOT NULL,
  email       text        NOT NULL CHECK (email LIKE '%@%'),
  phone       text        NOT NULL DEFAULT '',
  occasion    text        NOT NULL DEFAULT '',
  description text        NOT NULL DEFAULT '',
  status      text        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','confirmed','rejected')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER bookings_set_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.gj_set_updated_at();

CREATE INDEX bookings_created_at_idx ON public.bookings (created_at DESC);
CREATE INDEX bookings_status_idx     ON public.bookings (status);

-- 3. contact_messages
CREATE TABLE public.contact_messages (
  id          bigserial   PRIMARY KEY,
  name        text        NOT NULL,
  email       text        NOT NULL CHECK (email LIKE '%@%'),
  phone       text        NOT NULL DEFAULT '',
  event_type  text        NOT NULL DEFAULT '',
  message     text        NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER contact_messages_set_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.gj_set_updated_at();

CREATE INDEX contact_messages_created_at_idx ON public.contact_messages (created_at DESC);

-- 4. VERIFY
SELECT table_name, 'ready' AS status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('bookings', 'contact_messages')
ORDER BY table_name;
