/**
 * Authentication Service
 */

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const prisma = require("../config/database")
const { JWT_SECRET, JWT_EXPIRES_IN, ADMIN_EMAIL, ADMIN_PASSWORD } = require("../config/env")
const { AppError } = require("../utils/appError")

class AuthService {
  async registerCitizen(data) {
    const { name, email, password, phone, address } = data

    // Prevent registering with admin email
    if (email === ADMIN_EMAIL) {
      throw new AppError("This email is reserved", 400)
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new AppError("Email already registered", 409)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
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
    // Block admin from citizen login
    if (email === ADMIN_EMAIL) {
      throw new AppError("Please use admin login", 403)
    }

    // Find user (citizen)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new AppError("Invalid credentials", 401)
    }

    if (user.role !== "citizen") {
      throw new AppError("Please use admin login", 403)
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new AppError("Invalid credentials", 401)
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
    console.log("[AUTH] Admin login attempt")
    console.log("[AUTH] Input email:", email)
    console.log("[AUTH] Expected email:", ADMIN_EMAIL)
    console.log("[AUTH] Email match:", email === ADMIN_EMAIL)

    const trimmedInputPassword = password?.trim()
    const trimmedExpectedPassword = ADMIN_PASSWORD?.trim()

    console.log("[AUTH] Input password length:", trimmedInputPassword?.length)
    console.log("[AUTH] Expected password length:", trimmedExpectedPassword?.length)
    console.log("[AUTH] Password match:", trimmedInputPassword === trimmedExpectedPassword)

    // Check for fixed admin credentials
    if (email?.trim() !== ADMIN_EMAIL?.trim()) {
      console.log("[AUTH] Email mismatch - rejecting")
      throw new AppError("Invalid admin credentials", 401)
    }

    if (trimmedInputPassword !== trimmedExpectedPassword) {
      console.log("[AUTH] Password mismatch - rejecting")
      throw new AppError("Invalid admin credentials", 401)
    }

    console.log("[AUTH] Admin credentials valid - generating token")

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

  // Universal login (auto-detects admin or citizen)
  async login(email, password) {
    // Check for fixed admin credentials
    if (email === ADMIN_EMAIL) {
      return this.adminLogin(email, password)
    }

    // Find user (citizen)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new AppError("Invalid credentials", 401)
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new AppError("Invalid credentials", 401)
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

  // Get profile
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
