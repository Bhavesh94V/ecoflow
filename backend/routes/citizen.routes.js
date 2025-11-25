/**
 * Citizen Routes
 */

const express = require("express")
const router = express.Router()
const citizenController = require("../controllers/citizen.controller")
const { authenticate, isCitizen } = require("../middlewares/auth")
const { validate } = require("../middlewares/validate")
const { createPickupSchema } = require("../validators/pickup.validator")
const { createComplaintSchema } = require("../validators/complaint.validator")

// All routes require authentication as citizen
router.use(authenticate, isCitizen)

router.get("/bins", citizenController.getNearbyBins)
router.get("/rewards", citizenController.getRewards)
router.post("/pickup", validate(createPickupSchema), citizenController.requestPickup)
router.get("/pickup-status", citizenController.getPickupStatus)
router.post("/complaint", validate(createComplaintSchema), citizenController.fileComplaint)
router.get("/complaints", citizenController.getComplaints)

module.exports = router
