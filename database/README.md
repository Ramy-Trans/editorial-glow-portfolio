# GJ Media House — Database Schema

Production-ready schema for the Supabase PostgreSQL database.  
Generated from `src/lib/booking-fns.ts` and the TypeScript interfaces in the same file.

---

## Tables

| Table | Purpose |
|---|---|
| `bookings` | Booking enquiries submitted via `/booking` |
| `contact_messages` | Contact form submissions via `/contact` |

> **Admin auth** is entirely server-side (HMAC tokens signed with `ADMIN_SECRET`).  
> No database tables are required for authentication.

---

## How to import into Supabase

### Step 1 — Open the SQL Editor

1. Go to [supabase.com](https://supabase.com) and open your project.
2. In the left sidebar click **SQL Editor**.
3. Click **+ New query**.

### Step 2 — Paste the schema

1. Open `database/schema.sql` from this repository.
2. Copy the entire file contents.
3. Paste it into the SQL Editor query window.

### Step 3 — Run the migration

Click the **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`).

You should see output like:

```
table_name         row_count   status
-----------------  ----------  ------
bookings           0           ready
contact_messages   0           ready
```

Both tables are now created with the correct columns, indexes, constraints, and Row-Level Security settings.

---

## Schema summary

### `bookings`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `bigserial` | NO | auto | Primary key |
| `name` | `text` | NO | — | Client full name |
| `email` | `text` | NO | — | Client email |
| `phone` | `text` | NO | — | Client phone |
| `occasion` | `text` | NO | — | Type of event |
| `description` | `text` | NO | `''` | Event details |
| `status` | `text` | NO | `'pending'` | `pending` / `confirmed` / `rejected` |
| `created_at` | `timestamptz` | NO | `now()` | Submission timestamp |

### `contact_messages`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `bigserial` | NO | auto | Primary key |
| `name` | `text` | NO | — | Visitor name |
| `email` | `text` | NO | — | Visitor email |
| `phone` | `text` | NO | — | Visitor phone |
| `event_type` | `text` | NO | `''` | Optional event category |
| `message` | `text` | NO | `''` | Message body |
| `created_at` | `timestamptz` | NO | `now()` | Submission timestamp |

---

## Row-Level Security

RLS is **enabled on both tables** with **no permissive policies**.

- The server uses `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS — all server operations work normally.
- Any accidental use of the anon key (e.g. client-side leak) is denied at the database level.

---

## Environment variables required

Set these in your Replit Secrets (already configured):

| Secret | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only, never expose client-side) |
| `ADMIN_PASSWORD` | Password for the `/dashboard` admin login |
| `ADMIN_SECRET` | HMAC signing key for admin session tokens |

---

## Verifying the dashboard login

1. Visit `/dashboard` on your deployed site.
2. Enter the value of your `ADMIN_PASSWORD` secret.
3. Click **Sign In**.

The login is verified entirely server-side — the server compares the submitted password against `ADMIN_PASSWORD`, then signs a time-limited HMAC token using `ADMIN_SECRET`. No database query is involved in authentication.
