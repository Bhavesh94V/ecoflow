const express = require("express")
const router = express.Router()
const alertsController = require("../controllers/alerts.controller")
const { authenticate } = require("../middlewares/auth")

// Get all alerts
router.get("/", authenticate, alertsController.getAll)

// Mark alert as read
router.patch("/:id/read", authenticate, alertsController.markAsRead)

// Mark all alerts as read
router.patch("/read-all", authenticate, alertsController.markAllAsRead)

module.exports = router
