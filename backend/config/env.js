/**
 * Environment Configuration
 * Load and validate environment variables
 */

const path = require("path")

require("dotenv").config({ path: path.join(__dirname, "..", ".env") })

// Debug: Log env loading (remove in production)
console.log("[ENV] Loading environment variables...")
console.log("[ENV] ADMIN_EMAIL loaded:", process.env.ADMIN_EMAIL ? "YES" : "NO")
console.log("[ENV] ADMIN_PASSWORD loaded:", process.env.ADMIN_PASSWORD ? "YES" : "NO")

const config = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "ecosmart_super_secret_jwt_key_2025_xk9m2n3b4v5c6z7a8s9d0f",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@ecosmart.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "EcoSmart@Admin#2025!Secure",

  // CORS - frontend port 8080
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:8080",

  // WebSocket
  WS_PORT: process.env.WS_PORT || 5001,
}

// Debug: Log final config (remove in production)
console.log("[ENV] Final ADMIN_EMAIL:", config.ADMIN_EMAIL)
console.log("[ENV] CORS_ORIGIN:", config.CORS_ORIGIN)

// Validate required variables in production
if (config.NODE_ENV === "production") {
  const required = ["DATABASE_URL", "JWT_SECRET"]
  required.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  })
}

module.exports = config
