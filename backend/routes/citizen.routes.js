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
const prisma = require("../config/database")

// All routes require authentication as citizen
router.use(authenticate, isCitizen)

router.get("/bins", citizenController.getNearbyBins)
router.get("/rewards", citizenController.getRewards)
router.post("/pickup", validate(createPickupSchema), citizenController.requestPickup)
router.get("/pickup-status", citizenController.getPickupStatus)
router.post("/complaint", validate(createComplaintSchema), citizenController.fileComplaint)
router.get("/complaints", citizenController.getComplaints)

router.get("/complaints/my", async (req, res, next) => {
    try {
        const userId = req.user?.id
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }

        const complaints = await prisma.complaint.findMany({
            where: { user_id: userId },
            include: {
                bin: { select: { location_name: true, area: true } },
                assignee: { select: { name: true } },
            },
            orderBy: { created_at: "desc" },
            take: 20,
        })

        const mapped = complaints.map((c) => ({
            id: c.id,
            title: `Complaint #${c.id}`,
            message: c.message,
            priority: c.priority,
            status: c.status,
            location: c.bin?.location_name || "Unknown",
            area: c.bin?.area,
            assignedTo: c.assignee?.name,
            createdAt: c.created_at,
        }))

        res.json({ success: true, data: mapped })
    } catch (error) {
        next(error)
    }
})

module.exports = router
