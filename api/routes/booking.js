/**
 * api/routes/booking.js
 * POST /api/booking — save a booking / quotation request
 */
import { Router } from "express";
import { asyncHandler } from "../middleware/error.js";
import { missingFields, isValidEmail, str } from "../middleware/validate.js";
import { query } from "../db.js";

export const bookingRouter = Router();

bookingRouter.post(
  "/booking",
  asyncHandler(async (req, res) => {
    const body = req.body ?? {};
    const missing = missingFields(["name", "email", "phone", "occasion"], body);
    if (missing.length) {
      return res.status(400).json({ error: `Required: ${missing.join(", ")}` });
    }
    if (!isValidEmail(body.email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    await query(
      `INSERT INTO bookings (name, email, phone, occasion, description)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        str(body.name),
        str(body.email),
        str(body.phone),
        str(body.occasion),
        str(body.description),
      ]
    );

    res.status(201).json({ success: true });
  })
);
