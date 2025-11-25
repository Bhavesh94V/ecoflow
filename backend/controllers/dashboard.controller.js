/**
 * Dashboard Controller
 * Handles dashboard statistics and data
 */

const binService = require("../services/bin.service")
const complaintService = require("../services/complaint.service")
const pickupService = require("../services/pickup.service")
const prisma = require("../config/database")
const { formatResponse } = require("../utils/helpers")
const { AppError } = require("../utils/appError")

class DashboardController {
  /**
   * Get citizen dashboard statistics
   */
  async getCitizenStats(req, res, next) {
    try {
      const userId = req.user.id

      // Get user's reward points
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { reward_points: true },
      })

      if (!user) {
        throw new AppError("User not found", 404)
      }

      // Get completed pickups
      const completedPickups = await prisma.pickupRequest.count({
        where: {
          citizen_id: userId,
          status: "completed",
        },
      })

      // Get active complaints
      const activeComplaints = await prisma.complaint.count({
        where: {
          citizen_id: userId,
          status: { not: "resolved" },
        },
      })

      // Calculate recycling rate (completed pickups / total requests)
      const totalPickups = await prisma.pickupRequest.count({
        where: { citizen_id: userId },
      })

      const recyclingRate = totalPickups > 0 ? (completedPickups / totalPickups) * 100 : 0

      res.json(
        formatResponse(
          {
            rewardPoints: user.reward_points || 0,
            pickupsCompleted: completedPickups,
            recyclingRate: Math.round(recyclingRate),
            activeComplaints,
          },
          "Citizen statistics retrieved",
        ),
      )
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get admin dashboard statistics
   */
  async getAdminStats(req, res, next) {
    try {
      // Get total bins
      const totalBins = await prisma.bin.count()

      // Get total collectors
      const totalCollectors = await prisma.collector.count()

      // Get total complaints
      const totalComplaints = await prisma.complaint.count()

      // Get pending complaints
      const pendingComplaints = await prisma.complaint.count({
        where: { status: "pending" },
      })

      // Get active collectors
      const activeCollectors = await prisma.collector.count({
        where: { status: "active" },
      })

      // Get pending alerts
      const pendingAlerts = await prisma.alert.count({
        where: { is_read: false },
      })

      // Get waste collection data (last 7 days)
      const today = new Date()
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

      const wasteData = await prisma.pickupRequest.groupBy({
        by: ["created_at"],
        where: {
          created_at: { gte: lastWeek },
          status: "completed",
        },
        _count: true,
      })

      const wasteCollectionData = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

        const count = wasteData.find((d) => d.created_at.toISOString().split("T")[0] === dateStr)?._count || 0

        wasteCollectionData.push({
          day: dayName,
          waste: count,
          predicted: count + Math.floor(Math.random() * 5),
        })
      }

      // Area-wise data
      const areaWiseData = await prisma.bin.groupBy({
        by: ["area"],
        _count: true,
      })

      // Waste type data
      const wasteTypeData = [
        { name: "Organic", value: 35, color: "hsl(var(--chart-1))" },
        { name: "Plastic", value: 25, color: "hsl(var(--chart-2))" },
        { name: "Paper", value: 20, color: "hsl(var(--chart-3))" },
        { name: "Metal", value: 15, color: "hsl(var(--chart-4))" },
        { name: "Glass", value: 5, color: "hsl(var(--chart-5))" },
      ]

      // Get completed pickups for today
      const completedPickups = await prisma.pickupRequest.count({
        where: {
          created_at: { gte: today },
          status: "completed",
        },
      })

      res.json(
        formatResponse(
          {
            totalBins,
            totalCollectors,
            totalComplaints,
            pendingComplaints,
            activeCollectors,
            pendingAlerts,
            todayCollection: completedPickups || 0,
            wasteCollectionData,
            areaWiseData: areaWiseData.map((d) => ({
              area: d.area,
              waste: d._count,
            })),
            wasteTypeData,
          },
          "Admin statistics retrieved",
        ),
      )
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new DashboardController()
