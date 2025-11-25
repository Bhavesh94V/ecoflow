const express = require("express")
const router = express.Router()
const dashboardController = require("../controllers/dashboard.controller")
const { authenticate, isAdmin, isAuthenticatedUser } = require("../middlewares/auth")

// router.get("/citizen-stats", authenticate, isAuthenticatedUser, dashboardController.getCitizenStats)
// router.get("/admin-stats", authenticate, isAdmin, dashboardController.getAdminStats)

router.get("/citizen-stats", authenticate, isAuthenticatedUser, dashboardController.getCitizenStats.bind(dashboardController))
router.get("/admin-stats", authenticate, isAdmin, dashboardController.getAdminStats.bind(dashboardController))

module.exports = router
