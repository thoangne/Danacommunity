const knex = require("knex");
const { NODE_ENV, DATABASE_URL, DB_POOL_MIN, DB_POOL_MAX } = require("./env");

/**
 * Resolves SSL configuration based on the environment and database connection string.
 * Supabase and Production environments require SSL ({ rejectUnauthorized: false }).
 * Local development PostgreSQL running in Docker does not use SSL.
 */
function resolveSslConfig(url, env) {
  // Explicit override via environment variable
  if (process.env.DB_SSL === "false") {
    return false;
  }
  if (process.env.DB_SSL === "true") {
    return { rejectUnauthorized: false };
  }

  // Local hosts: do not use SSL
  if (url && (url.includes("localhost") || url.includes("127.0.0.1") || url.includes("@postgres:"))) {
    return false;
  }

  // Explicit sslmode parameter in connection string
  if (url && url.includes("sslmode=disable")) {
    return false;
  }

  // Production or Supabase hosts require SSL
  if (
    env === "production" ||
    (url && (url.includes("supabase.co") || url.includes("pooler.supabase.com") || url.includes("sslmode=require")))
  ) {
    return { rejectUnauthorized: false };
  }

  return false;
}

/**
 * Builds the database connection configuration object.
 */
function buildConnectionConfig() {
  if (!DATABASE_URL) {
    if (NODE_ENV === "production") {
      console.warn("⚠️ [DATABASE WARNING] DATABASE_URL is not set in production. Database operations will fail until configured.");
    }
    // Development/Safe fallback using individual DB_* parameters if present
    return {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      user: process.env.DB_USER || "champa_user",
      password: process.env.DB_PASSWORD || "champa_password",
      database: process.env.DB_NAME || "champa_dev",
      ssl: false,
    };
  }

  const sslConfig = resolveSslConfig(DATABASE_URL, NODE_ENV);
  return {
    connectionString: DATABASE_URL,
    ...(sslConfig ? { ssl: sslConfig } : { ssl: false }),
  };
}

// Singleton database instance
let dbInstance = null;

/**
 * Returns the singleton Knex instance with PostgreSQL connection pooling.
 */
function getDbInstance() {
  if (!dbInstance) {
    const connection = buildConnectionConfig();

    dbInstance = knex({
      client: "pg",
      connection,
      pool: {
        min: DB_POOL_MIN,
        max: DB_POOL_MAX,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        afterCreate: (conn, done) => {
          conn.on("error", (err) => {
            console.error("❌ [DB POOL ERROR] Unexpected PostgreSQL client connection error:", err.message);
          });
          done(null, conn);
        },
      },
    });
  }
  return dbInstance;
}

const db = getDbInstance();

/**
 * Verifies connectivity by executing a lightweight SELECT query.
 * @returns {Promise<{ connected: boolean, timestamp?: string, database?: string, error?: string }>}
 */
async function testConnection() {
  try {
    const result = await db.raw("SELECT NOW() as current_time, current_database() as db_name");
    const row = result.rows ? result.rows[0] : (Array.isArray(result) ? result[0] : result);
    return {
      connected: true,
      timestamp: row ? row.current_time : new Date().toISOString(),
      database: row ? row.db_name : "unknown",
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
}

/**
 * Gracefully destroys the connection pool during application shutdown.
 */
async function closeConnection() {
  if (dbInstance) {
    try {
      await dbInstance.destroy();
      dbInstance = null;
    } catch (err) {
      console.error("⚠️ Error while closing database pool:", err.message);
    }
  }
}

module.exports = db;
module.exports.db = db;
module.exports.testConnection = testConnection;
module.exports.closeConnection = closeConnection;
module.exports.resolveSslConfig = resolveSslConfig;
module.exports.buildConnectionConfig = buildConnectionConfig;

