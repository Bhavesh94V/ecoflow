/**
 * Bins Routes
 */

const express = require("express")
const router = express.Router()
const binsController = require("../controllers/bins.controller")
const { authenticate, isAdmin } = require("../middlewares/auth")

// Public routes (no auth required for nearby bins)
router.get("/", binsController.getAll)
router.get("/:id", binsController.getById)

// Admin routes
router.patch("/:id/status", authenticate, isAdmin, binsController.updateStatus)

module.exports = router
