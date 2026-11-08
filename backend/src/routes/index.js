const express = require("express");
const router = express.Router();

const bookingRoutes = require("./bookingRoutes");
const newsletterRoutes = require("./newsletterRoutes");
const authRoutes = require("./authRoutes");
const postRoutes = require("./postRoute");
const adminRoutes = require("./adminRoutes");
const craftRoutes = require("./craftRoutes");
const { testConnection } = require("../config/db");
const { NODE_ENV } = require("../config/env");

router.use("/auth", authRoutes);
router.use("/bookings", bookingRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/posts", postRoutes);
router.use("/admin", adminRoutes);
router.use("/craft", craftRoutes);

/**
 * Health check endpoint.
 * Returns overall system health and verifies live PostgreSQL connectivity with SELECT NOW().
 */
router.get("/health", async (req, res) => {
  const dbHealth = await testConnection();

  const isHealthy = dbHealth.connected;
  const statusCode = isHealthy ? 200 : (NODE_ENV === "production" ? 503 : 200);

  res.status(statusCode).json({
    status: isHealthy ? "OK" : "DEGRADED",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    database: {
      status: dbHealth.connected ? "connected" : "disconnected",
      currentDatabase: dbHealth.database || null,
      serverTime: dbHealth.timestamp || null,
      ...(dbHealth.error ? { error: dbHealth.error } : {}),
    },
  });
});

module.exports = router;
