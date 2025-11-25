/**
 * IoT Routes
 */

const express = require("express")
const router = express.Router()
const iotController = require("../controllers/iot.controller")
const { validate } = require("../middlewares/validate")
const { iotUpdateSchema } = require("../validators/bin.validator")

// IoT endpoints for bin sensors
router.post("/update", validate(iotUpdateSchema), iotController.processUpdate)
router.post("/sensor-data", validate(iotUpdateSchema), iotController.processUpdate)
router.get("/history/:bin_id", iotController.getHistory)
router.get("/bins/:bin_id/logs", iotController.getHistory)

module.exports = router
