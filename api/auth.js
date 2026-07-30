/**
 * api/auth.js — HMAC-based admin token helpers
 * Token format (base64-encoded): "admin:<timestamp_ms>:<hmac_hex>"
 * Valid for 24 hours from issue time.
 */

async function hmacHex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signToken() {
  const ts = Date.now();
  const secret = process.env.ADMIN_SECRET ?? "gj-media-house-secret";
  const sig = await hmacHex(secret, `admin:${ts}`);
  return btoa(`admin:${ts}:${sig}`);
}

export async function verifyToken(token) {
  if (!token || typeof token !== "string") return false;
  try {
    const decoded = atob(token);
    const parts = decoded.split(":");
    if (parts.length !== 3 || parts[0] !== "admin") return false;
    const ts = parseInt(parts[1], 10);
    if (isNaN(ts) || Date.now() - ts > 86_400_000) return false; // 24h TTL
    const secret = process.env.ADMIN_SECRET ?? "gj-media-house-secret";
    const expected = await hmacHex(secret, `admin:${ts}`);
    return parts[2] === expected;
  } catch {
    return false;
  }
}

/** Express middleware — rejects requests with a missing or invalid token */
export async function requireAuth(req, res, next) {
  const token = req.body?.token;
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }
  const valid = await verifyToken(token);
  if (!valid) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  next();
}
