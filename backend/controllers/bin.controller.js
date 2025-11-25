/**
 * Bin Controller
 */

const binService = require("../services/bin.service")
const { formatResponse } = require("../utils/helpers")

class BinController {
  /**
   * @swagger
   * /admin/bins:
   *   get:
   *     tags: [Admin - Bins]
   *     summary: Get all bins
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *       - in: query
   *         name: area
   *         schema:
   *           type: string
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [normal, half, overflow]
   *     responses:
   *       200:
   *         description: List of bins
   */
  async getAllBins(req, res, next) {
    try {
      const result = await binService.getAllBins(req.query)
      res.json(formatResponse(result.bins, "Bins retrieved", result.meta))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/bins/{id}:
   *   get:
   *     tags: [Admin - Bins]
   *     summary: Get bin by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Bin details
   */
  async getBinById(req, res, next) {
    try {
      const bin = await binService.getBinById(req.params.id)
      res.json(formatResponse(bin, "Bin retrieved"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/bins:
   *   post:
   *     tags: [Admin - Bins]
   *     summary: Create a new bin
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [bin_id, location_name, area, latitude, longitude]
   *             properties:
   *               bin_id:
   *                 type: string
   *               location_name:
   *                 type: string
   *               area:
   *                 type: string
   *               latitude:
   *                 type: number
   *               longitude:
   *                 type: number
   *     responses:
   *       201:
   *         description: Bin created
   */
  async createBin(req, res, next) {
    try {
      const bin = await binService.createBin(req.body)
      res.status(201).json(formatResponse(bin, "Bin created successfully"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/bins/{id}:
   *   put:
   *     tags: [Admin - Bins]
   *     summary: Update a bin
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               location_name:
   *                 type: string
   *               area:
   *                 type: string
   *               latitude:
   *                 type: number
   *               longitude:
   *                 type: number
   *     responses:
   *       200:
   *         description: Bin updated
   */
  async updateBin(req, res, next) {
    try {
      const bin = await binService.updateBin(req.params.id, req.body)
      res.json(formatResponse(bin, "Bin updated successfully"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/bins/{id}:
   *   delete:
   *     tags: [Admin - Bins]
   *     summary: Delete a bin
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Bin deleted
   */
  async deleteBin(req, res, next) {
    try {
      await binService.deleteBin(req.params.id)
      res.json(formatResponse(null, "Bin deleted successfully"))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new BinController()
