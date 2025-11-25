/**
 * Authentication Middleware
 */

const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config/env")
const prisma = require("../config/database")
const { AppError } = require("../utils/appError")

// Verify JWT Token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access token required", 401)
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    if (decoded.role === "admin" && decoded.isFixedAdmin) {
      req.user = {
        id: 0,
        email: decoded.email,
        role: "admin",
        name: "System Admin",
        isFixedAdmin: true,
      }
      return next()
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true },
    })

    if (!user) {
      throw new AppError("User not found", 401)
    }

    req.user = { ...user, isFixedAdmin: false }
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401))
    }
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired", 401))
    }
    next(error)
  }
}

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Admin access required", 403))
  }
  next()
}

// Check if user is citizen
const isCitizen = (req, res, next) => {
  if (req.user.role !== "citizen") {
    return next(new AppError("Citizen access required", 403))
  }
  next()
}

module.exports = { authenticate, isAdmin, isCitizen }
