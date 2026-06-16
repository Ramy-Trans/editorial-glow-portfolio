# GJ Studio — Media Production Website

A professional website for GJ Studio, a media production house based in Cairo, Egypt. Specialises in video production, event coverage, live streaming, and professional photography.

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

## User Preferences

- Use Bun (not npm) for package management and running scripts
- Video files go in `/public/` as `drone-promo.mp4` / `drone-promo.webm`
- Keep Netlify/Vercel config files for reference but deploy via Replit
