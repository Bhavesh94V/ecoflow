/**
 * Auth Routes
 */

const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { authenticate } = require("../middlewares/auth")
const { validate } = require("../middlewares/validate")
const { registerSchema, loginSchema } = require("../validators/auth.validator")

console.log("[v0] Auth routes file loaded")

// Citizen Routes
router.post("/citizen/register", validate(registerSchema), authController.citizenRegister)
router.post("/citizen/login", validate(loginSchema), authController.citizenLogin)

// Admin Routes
router.post("/admin/login", validate(loginSchema), authController.adminLogin)

// Common Routes (legacy support)
router.post("/register", validate(registerSchema), authController.citizenRegister)
router.post("/login", validate(loginSchema), authController.login)

// Profile Route
router.get("/me", authenticate, authController.getProfile)
router.get("/profile", authenticate, authController.getProfile)

console.log(
    "[v0] Auth routes defined:",
    router.stack.filter((r) => r.route).map((r) => `${Object.keys(r.route.methods)} ${r.route.path}`),
)

module.exports = router
