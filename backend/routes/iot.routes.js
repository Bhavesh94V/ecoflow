/**
 * IoT Routes
 */

const express = require("express")
const router = express.Router()
const iotController = require("../controllers/iot.controller")
const { validate } = require("../middlewares/validate")
const { iotUpdateSchema } = require("../validators/bin.validator")

// IoT endpoint for bin sensors (no auth - secured via API key in production)
router.post("/update", validate(iotUpdateSchema), iotController.processUpdate)
router.get("/history/:bin_id", iotController.getHistory)

module.exports = router
