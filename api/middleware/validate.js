/**
 * api/middleware/validate.js — lightweight input validation helpers.
 * No external dependencies — keeps the validation layer simple and auditable.
 */

/** Returns an array of field names that are missing or blank */
export function missingFields(required, body) {
  return required.filter(
    (f) => body[f] === undefined || body[f] === null || String(body[f]).trim() === ""
  );
}

/** Basic RFC 5322 email check */
export function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Trim a string field; return empty string if not a string */
export function str(value) {
  return typeof value === "string" ? value.trim() : "";
}

/** Parse an integer id from path params; throws 400 if invalid */
export function parseId(raw) {
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    const err = new Error("Invalid id");
    err.status = 400;
    throw err;
  }
  return id;
}
