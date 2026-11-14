const path = require("path");
const dotenv = require("dotenv");

// Load backend/.env if present
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = parseInt(process.env.PORT, 10) || 5000;
const DATABASE_URL = (process.env.DATABASE_URL || "").trim();

// Application URLs
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:5173").trim().replace(/\/+$/, "");
const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:5000").trim().replace(/\/+$/, "");

// OAuth & Authentication credentials
const JWT_SECRET = process.env.JWT_SECRET || (NODE_ENV === "production" ? "" : "champaweb_dev_jwt_secret_key_minimum_32_characters_long");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || "").trim();
const GOOGLE_CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
const GOOGLE_CALLBACK_URL = (process.env.GOOGLE_CALLBACK_URL || `${BACKEND_URL}/api/auth/google/callback`).trim();

const FACEBOOK_APP_ID = (process.env.FACEBOOK_APP_ID || "").trim();
const FACEBOOK_APP_SECRET = (process.env.FACEBOOK_APP_SECRET || "").trim();
const FACEBOOK_CALLBACK_URL = (process.env.FACEBOOK_CALLBACK_URL || `${BACKEND_URL}/api/auth/facebook/callback`).trim();

/**
 * Validates required environment variables during application startup.
 * Fails fast if critical production configurations are missing or insecure.
 */
function validateEnv() {
  const errors = [];

  if (NODE_ENV === "production") {
    if (!DATABASE_URL) {
      errors.push("DATABASE_URL is required in production environment (e.g., Supabase PostgreSQL connection string injected via Secret Manager).");
    } else {
      if (
        DATABASE_URL.includes("localhost") ||
        DATABASE_URL.includes("127.0.0.1") ||
        DATABASE_URL.includes("@postgres:")
      ) {
        errors.push(
          "DATABASE_URL cannot point to localhost, 127.0.0.1, or local docker network in production. A production Supabase database is required."
        );
      }
      if (
        DATABASE_URL.includes("[YOUR-PASSWORD]") ||
        DATABASE_URL.includes("[PASSWORD]") ||
        DATABASE_URL.includes("placeholder")
      ) {
        errors.push("DATABASE_URL contains unresolved placeholder credentials.");
      }
      if (!DATABASE_URL.startsWith("postgresql://") && !DATABASE_URL.startsWith("postgres://")) {
        errors.push("DATABASE_URL must be a valid PostgreSQL connection URI starting with postgresql:// or postgres://.");
      }
    }

    if (!JWT_SECRET) {
      errors.push("JWT_SECRET is required in production environment.");
    }
  } else {
    // Development or test environment
    if (!DATABASE_URL) {
      console.warn(
        "⚠️ [DATABASE] DATABASE_URL is not set in backend/.env. Using default local development connection: postgresql://champa_user:champa_password@localhost:5432/champa_dev"
      );
    }
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.warn(
        "ℹ️ [OAUTH] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not configured in backend/.env. Google login will require real credentials in live mode."
      );
    }
    if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
      console.warn(
        "ℹ️ [OAUTH] FACEBOOK_APP_ID or FACEBOOK_APP_SECRET is not configured in backend/.env. Facebook login will require real credentials in live mode."
      );
    }
  }

  if (errors.length > 0) {
    const errorMsg = `\n❌ [FATAL CONFIGURATION ERROR] Environment validation failed:\n  - ${errors.join("\n  - ")}\n`;
    console.error(errorMsg);
    return false;
  }
  return true;
}

// Run initial validation on require (non-blocking for Cloud Run port binding)
validateEnv();

module.exports = {
  NODE_ENV,
  PORT,
  DATABASE_URL: DATABASE_URL || (NODE_ENV === "development" ? "postgresql://champa_user:champa_password@localhost:5432/champa_dev" : ""),
  DB_POOL_MIN: parseInt(process.env.DB_POOL_MIN, 10) || (NODE_ENV === "production" ? 2 : 1),
  DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX, 10) || (NODE_ENV === "production" ? 10 : 5),
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  FRONTEND_URL,
  BACKEND_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL,
  validateEnv,
};

