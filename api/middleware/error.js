/**
 * api/middleware/error.js
 * Global error-handling middleware + asyncHandler wrapper.
 */

/**
 * Wrap an async route handler so thrown errors are forwarded to
 * Express's error-handling middleware instead of being unhandled.
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Global error handler — must be the LAST middleware registered.
 * Signature must have 4 args for Express to recognise it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status ?? err.statusCode ?? 500;
  const message =
    status < 500
      ? err.message
      : "An unexpected error occurred. Please try again.";

  console.error(`[api] ${req.method} ${req.path} → ${status}: ${err.message}`);
  if (status >= 500) console.error(err.stack ?? err);

  // Never leak stack traces to the client
  res.status(status).json({ error: message });
}
