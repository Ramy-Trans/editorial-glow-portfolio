/**
 * src/lib/auth.server.ts — Edge-compatible HMAC admin auth
 *
 * Ported from api/auth.js. Uses crypto.subtle (Web Crypto API) which is
 * available in all environments: Cloudflare Workers, Node.js 18+, browsers.
 *
 * Token format (base64-encoded): "admin:<timestamp_ms>:<hmac_hex>"
 * Valid for 24 hours from issue time.
 */

async function hmacHex(secret: string, message: string): Promise<string> {
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

export async function signToken(): Promise<string> {
  const ts = Date.now();
  const secret = process.env.ADMIN_SECRET ?? "gj-media-house-secret";
  const sig = await hmacHex(secret, `admin:${ts}`);
  return btoa(`admin:${ts}:${sig}`);
}

export async function verifyToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  try {
    const decoded = atob(token);
    const parts = decoded.split(":");
    if (parts.length !== 3 || parts[0] !== "admin") return false;
    const ts = parseInt(parts[1], 10);
    if (isNaN(ts) || Date.now() - ts > 86_400_000) return false; // 24 h TTL
    const secret = process.env.ADMIN_SECRET ?? "gj-media-house-secret";
    const expected = await hmacHex(secret, `admin:${ts}`);
    return parts[2] === expected;
  } catch {
    return false;
  }
}
