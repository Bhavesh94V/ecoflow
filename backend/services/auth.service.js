/**
 * Authentication Service
 * Handles login, registration, and JWT token generation
 */

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const prisma = require("../config/database")
const { JWT_SECRET, JWT_EXPIRES_IN, ADMIN_EMAIL, ADMIN_PASSWORD } = require("../config/env")
const { AppError } = require("../utils/appError")

class AuthService {
  async registerCitizen(data) {
    const { name, email, password, phone, address } = data

    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      throw new AppError("This email is reserved", 400)
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existingUser) {
      throw new AppError("Email already registered", 409)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || null,
        address: address || null,
        role: "citizen",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        reward_points: true,
        created_at: true,
      },
    })

    // Generate token
    const token = this.generateToken(user)

    return { user, token }
  }

  async citizenLogin(email, password) {
    const normalizedEmail = email.toLowerCase()

    if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
      throw new AppError("Please use admin login", 403)
    }

    // Find user (citizen)
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (!user) {
      throw new AppError("Invalid email or password", 401)
    }

    if (user.role !== "citizen") {
      throw new AppError("Please use admin login", 403)
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new AppError("Invalid email or password", 401)
    }

    // Generate token
    const token = this.generateToken(user)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        reward_points: user.reward_points,
      },
      token,
    }
  }

  async adminLogin(email, password) {
    const normalizedInputEmail = email.toLowerCase().trim()
    const normalizedExpectedEmail = ADMIN_EMAIL.toLowerCase().trim()

    console.log("[v0] Admin login attempt - Email:", normalizedInputEmail)

    if (normalizedInputEmail !== normalizedExpectedEmail) {
      console.log("[v0] Admin login failed - Email mismatch")
      throw new AppError("Invalid admin credentials", 401)
    }

    if (password !== ADMIN_PASSWORD) {
      console.log("[v0] Admin login failed - Password mismatch")
      console.log("[v0] Received:", password, "Expected:", ADMIN_PASSWORD)
      throw new AppError("Invalid admin credentials", 401)
    }

    console.log("[v0] Admin login successful")

    const adminUser = {
      id: 0,
      name: "System Admin",
      email: ADMIN_EMAIL,
      role: "admin",
    }

    const token = jwt.sign({ id: 0, email: ADMIN_EMAIL, role: "admin", isFixedAdmin: true }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    return { user: adminUser, token }
  }

  async login(email, password) {
    const normalizedEmail = email.toLowerCase()

    // Check for fixed admin credentials
    if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
      return this.adminLogin(email, password)
    }

    // Find user (citizen)
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (!user) {
      throw new AppError("Invalid email or password", 401)
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new AppError("Invalid email or password", 401)
    }

    // Generate token
    const token = this.generateToken(user)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        reward_points: user.reward_points,
      },
      token,
    }
  }

  async getProfile(userId, isFixedAdmin = false) {
    if (isFixedAdmin) {
      return {
        id: 0,
        name: "System Admin",
        email: ADMIN_EMAIL,
        role: "admin",
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        reward_points: true,
        created_at: true,
      },
    })

    if (!user) {
      throw new AppError("User not found", 404)
    }

    return user
  }

  // Generate JWT token
  generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  }
}

module.exports = new AuthService()
