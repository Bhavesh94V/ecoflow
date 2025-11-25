const express = require("express")
const router = express.Router()
const dashboardController = require("../controllers/dashboard.controller")
const { authenticate } = require("../middlewares/auth")

// Citizen routes
router.get("/citizen-stats", authenticate, dashboardController.getCitizenStats)

// Admin routes (would need admin auth in production)
router.get("/admin-stats", dashboardController.getAdminStats)

module.exports = router
