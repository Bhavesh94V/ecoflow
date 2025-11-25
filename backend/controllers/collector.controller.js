/**
 * Collector Controller
 */

const collectorService = require("../services/collector.service")
const { formatResponse } = require("../utils/helpers")

class CollectorController {
  /**
   * @swagger
   * /admin/collectors:
   *   get:
   *     tags: [Admin - Collectors]
   *     summary: Get all collectors
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of collectors
   */
  async getAllCollectors(req, res, next) {
    try {
      const result = await collectorService.getAllCollectors(req.query)
      res.json(formatResponse(result.collectors, "Collectors retrieved", result.meta))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/collectors/{id}:
   *   get:
   *     tags: [Admin - Collectors]
   *     summary: Get collector by ID
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Collector details
   */
  async getCollectorById(req, res, next) {
    try {
      const collector = await collectorService.getCollectorById(req.params.id)
      res.json(formatResponse(collector, "Collector retrieved"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/collectors:
   *   post:
   *     tags: [Admin - Collectors]
   *     summary: Create a new collector
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Collector created
   */
  async createCollector(req, res, next) {
    try {
      const collector = await collectorService.createCollector(req.body)
      res.status(201).json(formatResponse(collector, "Collector created successfully"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/collectors/{id}:
   *   put:
   *     tags: [Admin - Collectors]
   *     summary: Update a collector
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Collector updated
   */
  async updateCollector(req, res, next) {
    try {
      const collector = await collectorService.updateCollector(req.params.id, req.body)
      res.json(formatResponse(collector, "Collector updated successfully"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/collectors/{id}:
   *   delete:
   *     tags: [Admin - Collectors]
   *     summary: Delete a collector
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Collector deleted
   */
  async deleteCollector(req, res, next) {
    try {
      await collectorService.deleteCollector(req.params.id)
      res.json(formatResponse(null, "Collector deleted successfully"))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new CollectorController()
