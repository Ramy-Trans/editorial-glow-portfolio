/**
 * api/index.js — GJ Media House Express API server
 *
 * Runs on API_PORT (default 3001). All business logic lives here;
 * the TanStack Start SSR server (port 5000) proxies API calls to this process.
 *
 * Design goals:
 *  - Every async route is wrapped in asyncHandler so throws never go unhandled
 *  - Global error-handling middleware catches everything else
 *  - Rate limiting prevents the server from being overwhelmed
 *  - Process-level exception handlers log but do NOT crash the server
 */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { contactRouter } from "./routes/contact.js";
import { bookingRouter } from "./routes/booking.js";
import { adminRouter } from "./routes/admin.js";
import { errorHandler } from "./middleware/error.js";

const app = express();
const PORT = Number(process.env.API_PORT ?? 3001);

/* ── Security headers ───────────────────────────────────────── */
app.use(helmet());

/* ── CORS — allow the SSR server and browser previews ───────── */
app.use(
  cors({
    origin: (origin, cb) => cb(null, true), // same-host; lock down in prod if needed
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

/* ── Body parsing (small limit prevents large-payload attacks) ─ */
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));

/* ── Rate limiting ──────────────────────────────────────────── */
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min window
  max: 60,                   // max 60 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — please try again in a few minutes." },
});
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,                  // admins need higher throughput for dashboard
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many admin requests." },
});

app.use("/api/contact", publicLimiter);
app.use("/api/booking", publicLimiter);
app.use("/api/admin", adminLimiter);

/* ── Health check ───────────────────────────────────────────── */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

/* ── Routes ─────────────────────────────────────────────────── */
app.use("/api", contactRouter);
app.use("/api", bookingRouter);
app.use("/api/admin", adminRouter);

/* ── 404 for unmatched /api/* ───────────────────────────────── */
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

/* ── Global error handler (must be last) ────────────────────── */
app.use(errorHandler);

/* ── Graceful startup ───────────────────────────────────────── */
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[api] GJ Media House API listening on http://0.0.0.0:${PORT}`);
});

/* ── Graceful shutdown ──────────────────────────────────────── */
function shutdown(signal) {
  console.log(`[api] ${signal} received — shutting down gracefully`);
  server.close(() => {
    console.log("[api] Server closed");
    process.exit(0);
  });
  // Force kill after 10s if connections won't close
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));

/* ── Safety nets — log but NEVER crash the process ─────────── */
process.on("uncaughtException", (err) => {
  console.error("[api] Uncaught exception (server stays up):", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[api] Unhandled promise rejection (server stays up):", reason);
});

export default app;
