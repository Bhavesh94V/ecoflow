/**
 * Alerts Controller
 * Handles system alerts for admin dashboard
 */

const prisma = require("../config/database")
const { formatResponse } = require("../utils/helpers")
const { AppError } = require("../utils/appError")

class AlertsController {
  /**
   * Get all alerts - using complaints as alerts
   * Modified to use complaints as alerts since Alert model doesn't exist
   */
  async getAll(req, res, next) {
    try {
      const { limit = 5, page = 1 } = req.query

      const alerts = await prisma.complaint.findMany({
        where: { status: { not: "resolved" } },
        select: {
          id: true,
          message: true,
          priority: true,
          status: true,
          created_at: true,
          bin_id: true,
        },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: Number.parseInt(limit),
      })

      const total = await prisma.complaint.count({
        where: { status: { not: "resolved" } },
      })

      res.json(
        formatResponse(
          {
            alerts: alerts.map((alert) => ({
              id: alert.id,
              type: alert.priority === "high" ? "urgent" : "warning",
              message: alert.message,
              status: alert.status,
              is_read: alert.status === "in_progress",
              created_at: alert.created_at,
            })),
            pagination: {
              total,
              page: Number.parseInt(page),
              limit: Number.parseInt(limit),
              pages: Math.ceil(total / limit),
            },
          },
          "Alerts retrieved successfully",
        ),
      )
    } catch (error) {
      next(error)
    }
  }

  /**
   * Mark alert as read (update complaint status)
   */
  async markAsRead(req, res, next) {
    try {
      const { id } = req.params

      const alert = await prisma.complaint.update({
        where: { id: Number.parseInt(id) },
        data: { status: "in_progress" },
        select: {
          id: true,
          message: true,
          status: true,
        },
      })

      res.json(formatResponse(alert, "Alert marked as read"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * Mark all alerts as read
   */
  async markAllAsRead(req, res, next) {
    try {
      await prisma.complaint.updateMany({
        where: { status: "pending" },
        data: { status: "in_progress" },
      })

      res.json(formatResponse(null, "All alerts marked as read"))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AlertsController()
