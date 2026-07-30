/**
 * api/routes/contact.js
 * POST /api/contact — save a contact inquiry
 */
import { Router } from "express";
import { asyncHandler } from "../middleware/error.js";
import { missingFields, isValidEmail, str } from "../middleware/validate.js";
import { query } from "../db.js";

export const contactRouter = Router();

contactRouter.post(
  "/contact",
  asyncHandler(async (req, res) => {
    const body = req.body ?? {};
    const missing = missingFields(["name", "email"], body);
    if (missing.length) {
      return res.status(400).json({ error: `Required: ${missing.join(", ")}` });
    }
    if (!isValidEmail(body.email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    await query(
      `INSERT INTO contact_messages (name, email, phone, event_type, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        str(body.name),
        str(body.email),
        str(body.phone),
        str(body.event_type),
        str(body.message),
      ]
    );

    res.status(201).json({ success: true });
  })
);
