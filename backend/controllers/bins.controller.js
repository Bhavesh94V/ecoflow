/**
 * Bins Controller
 * Handles bin operations
 */

const prisma = require("../config/database")
const { formatResponse } = require("../utils/helpers")
const { AppError } = require("../utils/appError")

class BinsController {
  /**
   * Get all bins with pagination
   */
  async getAll(req, res, next) {
    try {
      const { limit = 5, page = 1, area, status } = req.query

      const where = {}
      if (area) where.area = area
      if (status) where.status = status

      const bins = await prisma.bin.findMany({
        where,
        select: {
          id: true,
          bin_id: true,
          location_name: true,
          area: true,
          fill_level: true,
          status: true,
          latitude: true,
          longitude: true,
          battery: true,
          last_update: true,
        },
        orderBy: { last_update: "desc" },
        skip: (page - 1) * limit,
        take: Number.parseInt(limit),
      })

      const total = await prisma.bin.count({ where })

      res.json(
        formatResponse(
          {
            bins,
            pagination: {
              total,
              page: Number.parseInt(page),
              limit: Number.parseInt(limit),
              pages: Math.ceil(total / limit),
            },
          },
          "Bins retrieved successfully",
        ),
      )
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get single bin details
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params

      const bin = await prisma.bin.findUnique({
        where: { id: Number.parseInt(id) },
        select: {
          id: true,
          bin_id: true,
          location_name: true,
          area: true,
          fill_level: true,
          status: true,
          temperature: true,
          humidity: true,
          gas_level: true,
          battery: true,
          latitude: true,
          longitude: true,
          last_update: true,
          iot_logs: {
            select: {
              fill_level: true,
              temperature: true,
              timestamp: true,
            },
            orderBy: { timestamp: "desc" },
            take: 10,
          },
        },
      })

      if (!bin) {
        throw new AppError("Bin not found", 404)
      }

      res.json(formatResponse(bin, "Bin retrieved successfully"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update bin status
   */
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params
      const { status } = req.body

      if (!["normal", "half", "overflow"].includes(status)) {
        throw new AppError("Invalid status", 400)
      }

      const bin = await prisma.bin.update({
        where: { id: Number.parseInt(id) },
        data: { status },
        select: {
          id: true,
          bin_id: true,
          status: true,
          fill_level: true,
        },
      })

      res.json(formatResponse(bin, "Bin status updated successfully"))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new BinsController()
