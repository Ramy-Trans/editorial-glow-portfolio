---
name: GJ Media House DB not auto-provisioned
description: DATABASE_URL being set on Replit does not mean the app's tables exist yet for this project.
---

The app picks direct-`pg` mode automatically once `DATABASE_URL` is present (see `src/lib/db.ts`), but nothing runs `database/schema.sql` for you — the Replit Postgres instance starts with zero tables (`bookings`, `contact_messages`) even though the connection works.

**Why:** discovered while diagnosing form submissions — `submitBookingFn`/`submitContactFn` would throw on insert with no tables present, and it's easy to assume "DATABASE_URL is set" means "schema is ready."

**How to apply:** after importing/setting up this project on a fresh Postgres instance, run `psql "$DATABASE_URL" -f database/schema.sql` once before trusting booking/contact form submissions or the admin dashboard to have real data.
