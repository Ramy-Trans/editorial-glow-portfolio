# GJ Media House — Media Production Website

A professional website for GJ Media House, a media production house based in Cairo, Egypt. Specialises in video production, event coverage, live streaming, and professional photography.

## Tech Stack

- **Framework**: TanStack Start (React 19 + Nitro SSR)
- **Styling**: Tailwind CSS v4
- **UI**: Radix UI + Framer Motion
- **Forms**: React Hook Form + Zod
- **Database**: Replit PostgreSQL (via `pg`)
- **Build**: Vite 6 + Bun

## Running the App

```bash
bun install && bun run dev
```

App runs on port 5000.

## Database

Tables: `bookings`, `contact_messages` — created automatically via Replit PostgreSQL.

## Admin Dashboard

Visit `/dashboard` — password protected via `ADMIN_PASSWORD` secret.

## Secrets Required

- `ADMIN_PASSWORD` — password to log into `/dashboard`
- `ADMIN_SECRET` — HMAC signing key for admin tokens
- `DATABASE_URL` — auto-provided by Replit PostgreSQL

## Database Path Selection

`src/lib/db.ts` picks Supabase HTTP vs. direct `pg` based on whether
`SUPABASE_SERVICE_ROLE_KEY` is set. On Replit (no Supabase key), it connects
directly to Replit's Postgres via `DATABASE_URL`. The `bookings` and
`contact_messages` tables (see `database/schema.sql`) must exist in whichever
database is active — already created here.

## User Preferences

- Use Bun (not npm) for package management and running scripts
- Video files go in `/public/` as `drone-promo.mp4` / `drone-promo.webm`
- Keep Netlify/Vercel config files for reference but deploy via Replit
- Social links live in `src/data/settings.ts` (Instagram, Facebook, LinkedIn — Behance was replaced with LinkedIn)
- "Featured" badges were intentionally removed from all portfolio cards (Work.tsx, portfolio.index.tsx)
