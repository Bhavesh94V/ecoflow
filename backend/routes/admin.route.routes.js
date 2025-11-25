/**
 * Admin Route Routes
 */

const express = require("express")
const router = express.Router()
const routeController = require("../controllers/route.controller")
const { authenticate, isAdmin } = require("../middlewares/auth")
const { validate } = require("../middlewares/validate")
const { createRouteSchema, updateRouteSchema, assignBinSchema } = require("../validators/route.validator")

// All routes require admin authentication
router.use(authenticate, isAdmin)

router.get("/", routeController.getAllRoutes)
router.post("/", validate(createRouteSchema), routeController.createRoute)
router.put("/:id", validate(updateRouteSchema), routeController.updateRoute)
router.post("/assign-bin", validate(assignBinSchema), routeController.assignBin)
router.post("/optimize", routeController.optimizeRoutes)

module.exports = router
