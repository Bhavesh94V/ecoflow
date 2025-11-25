/**
 * Database Configuration
 * Prisma Client Singleton
 */

const { PrismaClient } = require("@prisma/client")
const logger = require("./logger")

let prisma

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["error", "warn"],
  })
} else {
  // Prevent multiple instances during development
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    })
  }
  prisma = global.prisma
}

// Connection test
prisma
  .$connect()
  .then(() => logger.info("✅ Database connected successfully"))
  .catch((err) => logger.error("❌ Database connection failed:", err))

module.exports = prisma
