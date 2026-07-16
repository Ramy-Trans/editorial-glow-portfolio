# GJ Media House — Database Schema

Production-ready PostgreSQL schema for the GJ Media House studio app.  
Sourced from `src/lib/booking-fns.ts` — keep the two files in sync.

---

## Tables

| Table | Purpose |
|---|---|
| `bookings` | Booking enquiries submitted via `/booking` |
| `contact_messages` | Contact form submissions via `/contact` |

> **Admin auth** is entirely server-side (HMAC tokens signed with `ADMIN_SECRET`).  
> No database tables are required for authentication.

---

## How to apply the schema

### Replit (development — Postgres)

```bash
psql "$DATABASE_URL" -f database/schema.sql
```

The script is **rebuild-safe**: it drops all tables first, then recreates them cleanly.  
Re-running it will wipe all data — only do this intentionally.

### Supabase (production — Cloudflare Pages)

1. Go to [supabase.com](https://supabase.com) → your project → **SQL Editor**
2. Click **+ New query**
3. Paste the entire contents of `database/schema.sql`
4. Click **Run** (or `Ctrl+Enter`)

Expected output:
```
table_name         row_count   status
-----------------  ----------  ------
bookings           0           ready
contact_messages   0           ready
```

---

## Schema reference

### `bookings`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `bigserial` | NO | auto | Primary key |
| `name` | `text` | NO | — | Client full name |
| `email` | `text` | NO | — | Client email (must contain `@`) |
| `phone` | `text` | NO | — | Client phone |
| `occasion` | `text` | NO | — | Type of event |
| `description` | `text` | NO | `''` | Event details |
| `status` | `text` | NO | `'pending'` | `pending` / `confirmed` / `rejected` |
| `created_at` | `timestamptz` | NO | `now()` | Submission timestamp |
| `updated_at` | `timestamptz` | NO | `now()` | Auto-updated by trigger on status change |

Indexes: `created_at DESC`, `status`, `email`  
Trigger: `bookings_set_updated_at` → calls `gj_set_updated_at()`

### `contact_messages`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `bigserial` | NO | auto | Primary key |
| `name` | `text` | NO | — | Visitor name |
| `email` | `text` | NO | — | Visitor email (must contain `@`) |
| `phone` | `text` | NO | — | Visitor phone |
| `event_type` | `text` | NO | `''` | Optional event category |
| `message` | `text` | NO | `''` | Message body |
| `created_at` | `timestamptz` | NO | `now()` | Submission timestamp |
| `updated_at` | `timestamptz` | NO | `now()` | Auto-updated by trigger on row update |

Indexes: `created_at DESC`, `email`  
Trigger: `contact_messages_set_updated_at` → calls `gj_set_updated_at()`

---

## Row-Level Security

RLS is **enabled on both tables** with **no permissive policies**.

| Key type | Access |
|---|---|
| `service_role` | Bypasses RLS — all server operations work ✓ |
| `anon` / `authenticated` | Denied by default — no client-side data exposure ✓ |

The server always uses `SUPABASE_SERVICE_ROLE_KEY` (server-only, never sent to the browser).

---

## Shared trigger function

```sql
gj_set_updated_at() → sets NEW.updated_at = now() on every UPDATE
```

Applied to both tables via `BEFORE UPDATE` triggers.

---

## Backups

Pre-rebuild schema dumps are saved to `database/backups/`.  
These are `.gitignore`d — they contain local development state only.

---

## Required environment variables

| Variable | Where to set | Description |
|---|---|---|
| `DATABASE_URL` | Replit (auto-provisioned) | Replit Postgres connection string |
| `SUPABASE_URL` | Hardcoded in `src/lib/db.ts` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Replit Secrets + Cloudflare Pages env | Service role key — **never expose client-side** |
| `ADMIN_PASSWORD` | Replit Secrets + Cloudflare Pages env | Password for `/dashboard` login |
| `ADMIN_SECRET` | Replit Secrets + Cloudflare Pages env | HMAC signing key for admin session tokens |
