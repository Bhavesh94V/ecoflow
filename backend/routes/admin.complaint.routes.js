/**
 * Admin Complaint Routes
 */

const express = require("express")
const router = express.Router()
const complaintController = require("../controllers/complaint.controller")
const { authenticate, isAdmin } = require("../middlewares/auth")
const { validate } = require("../middlewares/validate")
const { assignComplaintSchema, resolveComplaintSchema } = require("../validators/complaint.validator")

// All routes require admin authentication
router.use(authenticate, isAdmin)

router.get("/", complaintController.getAllComplaints)
router.put("/assign", validate(assignComplaintSchema), complaintController.assignComplaint)
router.put("/resolve", validate(resolveComplaintSchema), complaintController.resolveComplaint)

module.exports = router
