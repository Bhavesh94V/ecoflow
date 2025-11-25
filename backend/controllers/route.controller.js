/**
 * Route Controller
 */

const routeService = require("../services/route.service")
const { formatResponse } = require("../utils/helpers")

class RouteController {
  /**
   * @swagger
   * /admin/routes:
   *   get:
   *     tags: [Admin - Routes]
   *     summary: Get all routes
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of routes
   */
  async getAllRoutes(req, res, next) {
    try {
      const result = await routeService.getAllRoutes(req.query)
      res.json(formatResponse(result.routes, "Routes retrieved", result.meta))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/routes:
   *   post:
   *     tags: [Admin - Routes]
   *     summary: Create a new route
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Route created
   */
  async createRoute(req, res, next) {
    try {
      const route = await routeService.createRoute(req.body)
      res.status(201).json(formatResponse(route, "Route created successfully"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/routes/{id}:
   *   put:
   *     tags: [Admin - Routes]
   *     summary: Update a route
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Route updated
   */
  async updateRoute(req, res, next) {
    try {
      const route = await routeService.updateRoute(req.params.id, req.body)
      res.json(formatResponse(route, "Route updated successfully"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/routes/assign-bin:
   *   post:
   *     tags: [Admin - Routes]
   *     summary: Assign a bin to a route
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Bin assigned to route
   */
  async assignBin(req, res, next) {
    try {
      const result = await routeService.assignBin(req.body)
      res.json(formatResponse(result, "Bin assigned to route"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/routes/optimize:
   *   post:
   *     tags: [Admin - Routes]
   *     summary: Get AI route optimization suggestions
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Optimization suggestions
   */
  async optimizeRoutes(req, res, next) {
    try {
      const suggestions = await routeService.optimizeRoutes()
      res.json(formatResponse(suggestions, "Route optimization suggestions generated"))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new RouteController()
