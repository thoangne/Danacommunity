/**
 * In-memory sliding window rate limiter middleware for authentication routes.
 * Prevents brute-force attacks and abuse on sensitive authentication endpoints.
 */

const requestCounts = new Map();

/**
 * Creates an Express rate limiter middleware.
 *
 * @param {object} options
 * @param {number} [options.windowMs=900000] - Window duration in ms (default: 15 mins)
 * @param {number} [options.max=60] - Max allowed requests per window (default: 60)
 * @param {string} [options.message="Quá nhiều yêu cầu xác thực. Vui lòng thử lại sau."] - Error message
 * @returns {import("express").RequestHandler}
 */
function createRateLimiter({
  windowMs = 15 * 60 * 1000,
  max = 60,
  message = "Quá nhiều yêu cầu xác thực từ địa chỉ IP này. Vui lòng thử lại sau.",
} = {}) {
  // Cleanup periodically
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requestCounts.entries()) {
      if (now > data.resetTime) {
        requestCounts.delete(ip);
      }
    }
  }, Math.min(windowMs, 60000)).unref();

  return (req, res, next) => {
    // Skip rate limiting in automated test runs if header or NODE_ENV matches
    if (process.env.NODE_ENV === "test" || req.headers["x-test-bypass-ratelimit"] === "true") {
      return next();
    }

    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const now = Date.now();

    const record = requestCounts.get(ip);

    if (!record || now > record.resetTime) {
      requestCounts.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", max - 1);
      return next();
    }

    record.count += 1;
    const remaining = Math.max(0, max - record.count);
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", remaining);

    if (record.count > max) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfterSec);
      return res.status(429).json({
        success: false,
        message,
        retryAfter: retryAfterSec,
      });
    }

    next();
  };
}

const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 60,
  message: "Quá nhiều yêu cầu xác thực từ địa chỉ IP của bạn. Vui lòng đợi trong giây lát và thử lại.",
});

module.exports = {
  createRateLimiter,
  authRateLimiter,
};

