/**
 * Alerts Controller
 * Handles system alerts for admin dashboard
 */

const prisma = require("../config/database")
const { formatResponse } = require("../utils/helpers")
const { AppError } = require("../utils/appError")

class AlertsController {
    /**
     * Get all alerts
     */
    async getAll(req, res, next) {
        try {
            const { limit = 5, page = 1, type, isRead } = req.query

            const where = {}
            if (type) where.type = type
            if (isRead !== undefined) where.is_read = isRead === "true"

            const alerts = await prisma.alert.findMany({
                where,
                orderBy: { created_at: "desc" },
                skip: (page - 1) * limit,
                take: Number.parseInt(limit),
            })

            const total = await prisma.alert.count({ where })

            res.json(
                formatResponse(
                    {
                        alerts,
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
     * Mark alert as read
     */
    async markAsRead(req, res, next) {
        try {
            const { id } = req.params

            const alert = await prisma.alert.update({
                where: { id: Number.parseInt(id) },
                data: { is_read: true },
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
            await prisma.alert.updateMany({
                where: { is_read: false },
                data: { is_read: true },
            })

            res.json(formatResponse(null, "All alerts marked as read"))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AlertsController()
