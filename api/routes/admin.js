/**
 * api/routes/admin.js — all admin endpoints
 *
 * POST /api/admin/login             { password }              → { token }
 * POST /api/admin/verify            { token }                 → { valid }
 * POST /api/admin/bookings          { token }                 → { bookings }
 * POST /api/admin/messages          { token }                 → { messages }
 * PATCH /api/admin/bookings/:id     { token, status }         → { success }
 * DELETE /api/admin/bookings/:id    { token }                 → { success }
 * DELETE /api/admin/messages/:id    { token }                 → { success }
 */
import { Router } from "express";
import { asyncHandler } from "../middleware/error.js";
import { parseId } from "../middleware/validate.js";
import { query } from "../db.js";
import { signToken, verifyToken, requireAuth } from "../auth.js";

export const adminRouter = Router();

const ALLOWED_STATUSES = new Set(["pending", "confirmed", "rejected"]);

/* ── Auth ──────────────────────────────────────────────────── */

adminRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { password } = req.body ?? {};
    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }
    const adminPass =
      process.env.ADMIN_PASSWORD ?? "GJstudio#5x2uivfd8RufEwXX!2026";
    if (password !== adminPass) {
      // Constant-time comparison not needed here (HMAC is the security boundary),
      // but we add a tiny delay to slow brute-force attempts.
      await new Promise((r) => setTimeout(r, 300));
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = await signToken();
    res.json({ token });
  })
);

adminRouter.post(
  "/verify",
  asyncHandler(async (req, res) => {
    const { token } = req.body ?? {};
    const valid = await verifyToken(token);
    res.json({ valid });
  })
);

/* ── Data reads (token required) ───────────────────────────── */

adminRouter.post(
  "/bookings",
  asyncHandler(async (req, res) => {
    const { token } = req.body ?? {};
    if (!(await verifyToken(token))) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const bookings = await query(
      "SELECT * FROM bookings ORDER BY created_at DESC"
    );
    res.json({ bookings });
  })
);

adminRouter.post(
  "/messages",
  asyncHandler(async (req, res) => {
    const { token } = req.body ?? {};
    if (!(await verifyToken(token))) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const messages = await query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    res.json({ messages });
  })
);

/* ── Mutations (token required via requireAuth) ─────────────── */

adminRouter.patch(
  "/bookings/:id",
  asyncHandler(requireAuth),
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const { status } = req.body ?? {};
    if (!ALLOWED_STATUSES.has(status)) {
      return res
        .status(400)
        .json({ error: "status must be pending | confirmed | rejected" });
    }
    const rows = await query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id",
      [status, id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ success: true });
  })
);

adminRouter.delete(
  "/bookings/:id",
  asyncHandler(requireAuth),
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    await query("DELETE FROM bookings WHERE id = $1", [id]);
    res.json({ success: true });
  })
);

adminRouter.delete(
  "/messages/:id",
  asyncHandler(requireAuth),
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    await query("DELETE FROM contact_messages WHERE id = $1", [id]);
    res.json({ success: true });
  })
);
