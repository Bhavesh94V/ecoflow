/**
 * Admin Collector Routes
 */

const express = require("express")
const router = express.Router()
const collectorController = require("../controllers/collector.controller")
const { authenticate, isAdmin } = require("../middlewares/auth")
const { validate } = require("../middlewares/validate")
const { createCollectorSchema, updateCollectorSchema } = require("../validators/collector.validator")

// All routes require admin authentication
router.use(authenticate, isAdmin)

router.get("/", collectorController.getAllCollectors)
router.get("/:id", collectorController.getCollectorById)
router.post("/", validate(createCollectorSchema), collectorController.createCollector)
router.put("/:id", validate(updateCollectorSchema), collectorController.updateCollector)
router.delete("/:id", collectorController.deleteCollector)

module.exports = router
