# GJ Media House — Media Production Website

A professional website for GJ Media House, a media production house based in Cairo, Egypt. Specialises in video production, event coverage, live streaming, and professional photography.

## Tech Stack

- **Framework**: TanStack Start (React 19 + Nitro SSR)
- **Styling**: Tailwind CSS v4
- **UI**: Radix UI + Framer Motion
- **Forms**: React Hook Form + Zod
- **Database**: Replit PostgreSQL (via `pg`)
- **API**: Express.js (port 3001), proxied through Vite dev server
- **Build**: Vite 6

## Running the App

```bash
npm install
npx concurrently --kill-others --names "vite,api" "npm run dev" "node api/index.js"
```

App (Vite dev server) runs on port **5000**.  
Express API runs on port **3001** (proxied at `/api/*` by Vite).

## First-Time Setup on Replit

### 1. Secrets

Set the following in Replit Secrets (never commit these):

| Secret | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Password to log into `/dashboard` |
| `ADMIN_SECRET` | HMAC signing key for admin session tokens (any 32+ char random string) |

`DATABASE_URL` is auto-provisioned by Replit PostgreSQL — do not set it manually.

### 2. Database Schema

Apply the schema once (safe to re-run; drops and recreates tables):

```bash
psql "$DATABASE_URL" -f database/schema.sql
```

Tables created: `bookings`, `contact_messages`.  
See `database/README.md` for full schema reference.

### 3. Start

Use the **Start application** workflow (configured in `.replit`), or run the command above manually.

## Admin Dashboard

Visit `/dashboard` — password protected via `ADMIN_PASSWORD` secret.

## Architecture

```
browser
  └─► Vite dev server :5000
        ├─ serves React SPA + SSR (TanStack Start / Nitro)
        └─ proxies /api/* → Express API :3001
              ├─ /api/booking   — booking enquiries → bookings table
              ├─ /api/contact   — contact form      → contact_messages table
              └─ /api/admin/*   — dashboard CRUD, password-protected
```

## Database

- **Tables**: `bookings`, `contact_messages` — see `database/schema.sql`
- **Schema**: applied manually via `psql "$DATABASE_URL" -f database/schema.sql`
- On Replit: connects directly to Replit Postgres via `DATABASE_URL`
- On Cloudflare Pages (prod): uses Supabase HTTP client (alias swapped in `vite.config.ts`)

## Deployment

- Replit autoscale deployment (see `.replit` `[deployment]` section)
- Build: `node scripts/patch-nitro.js && vite build && node scripts/build-output.js`
- Run: `node .output/server/index.mjs`

## User Preferences

- Use npm for package management in Replit (Bun for local dev)
- Video files go in `/public/` as `drone-promo.mp4` / `drone-promo.webm`
- Keep Netlify/Vercel config files for reference but deploy via Replit
- Social links live in `src/data/settings.ts` (Instagram, Facebook, LinkedIn)
- "Featured" badges were intentionally removed from all portfolio cards
