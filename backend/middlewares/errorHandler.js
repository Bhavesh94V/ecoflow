/**
 * Global Error Handler
 */

const logger = require("../config/logger")

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(err.message, { stack: err.stack })

  // Default error values
  let statusCode = err.statusCode || 500
  let message = err.message || "Internal Server Error"
  const errors = err.errors || null

  // Prisma errors
  if (err.code) {
    switch (err.code) {
      case "P2002":
        statusCode = 409
        message = "A record with this value already exists"
        break
      case "P2025":
        statusCode = 404
        message = "Record not found"
        break
      case "P2003":
        statusCode = 400
        message = "Foreign key constraint violation"
        break
      default:
        statusCode = 500
        message = "Database error"
    }
  }

  // JWT errors are handled in auth middleware

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

module.exports = errorHandler
