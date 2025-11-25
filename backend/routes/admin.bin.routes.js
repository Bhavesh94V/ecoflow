/**
 * Admin Bin Routes
 */

const express = require("express")
const router = express.Router()
const binController = require("../controllers/bin.controller")
const { authenticate, isAdmin } = require("../middlewares/auth")
const { validate } = require("../middlewares/validate")
const { createBinSchema, updateBinSchema } = require("../validators/bin.validator")

// All routes require admin authentication
router.use(authenticate, isAdmin)

router.get("/", binController.getAllBins)
router.get("/:id", binController.getBinById)
router.post("/", validate(createBinSchema), binController.createBin)
router.put("/:id", validate(updateBinSchema), binController.updateBin)
router.delete("/:id", binController.deleteBin)

module.exports = router
