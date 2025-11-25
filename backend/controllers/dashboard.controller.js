/**
 * Dashboard Controller
 * Handles dashboard statistics and data with real-time updates
 */

const prisma = require("../config/database")
const { formatResponse } = require("../utils/helpers")
const { AppError } = require("../utils/appError")

class DashboardController {
  /**
   * Get citizen dashboard statistics (Fixed to match Prisma schema)
   */
  async getCitizenStats(req, res, next) {
    try {
      const userId = req.user.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          reward_points: true,
          id: true,
          name: true,
          email: true,
        },
      })

      if (!user) {
        throw new AppError("User not found", 404)
      }

      const completedPickups = await prisma.pickup.count({
        where: {
          user_id: userId,
          status: "completed",
        },
      })

      const activeComplaints = await prisma.complaint.count({
        where: {
          user_id: userId,
          status: { not: "resolved" },
        },
      })

      const totalPickups = await prisma.pickup.count({
        where: { user_id: userId },
      })

      const recyclingRate = totalPickups > 0 ? Math.round((completedPickups / totalPickups) * 100) : 0

      res.json(
        formatResponse(
          {
            rewardPoints: user.reward_points || 0,
            pickupsCompleted: completedPickups,
            recyclingRate: recyclingRate,
            activeComplaints,
            userName: user.name,
            userEmail: user.email,
          },
          "Citizen statistics retrieved successfully",
        ),
      )
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get admin dashboard statistics (Fixed with correct Prisma schema)
   */
  async getAdminStats(req, res, next) {
    try {
      const totalBins = await prisma.bin.count()

      const overflowBins = await prisma.bin.count({
        where: {
          fill_level: { gte: 80 },
        },
      })

      const totalCollectors = await prisma.collector.count()

      const activeCollectors = await prisma.collector.count({
        where: { status: "active" },
      })

      const totalComplaints = await prisma.complaint.count()

      const pendingComplaints = await prisma.complaint.count({
        where: { status: "pending" },
      })

      const highPriorityComplaints = await prisma.complaint.count({
        where: { priority: "high" },
      })

      const pendingPickups = await prisma.pickup.count({
        where: { status: { in: ["requested", "assigned"] } },
      })

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const completedPickupsToday = await prisma.pickup.count({
        where: {
          created_at: { gte: today },
          status: "completed",
        },
      })

      const binsWithFillLevel = await prisma.bin.findMany({
        select: { fill_level: true },
      })

      const averageFillLevel =
        binsWithFillLevel.length > 0
          ? Math.round(binsWithFillLevel.reduce((sum, bin) => sum + bin.fill_level, 0) / binsWithFillLevel.length)
          : 0

      const wasteCollectionData = await this.getWasteCollectionData()


      const areaWiseData = await prisma.bin.groupBy({
        by: ["area"],
        _count: true,
      })

      // Static waste type data
      const wasteTypeData = [
        { name: "Organic", value: 35, color: "hsl(var(--chart-1))" },
        { name: "Plastic", value: 25, color: "hsl(var(--chart-2))" },
        { name: "Paper", value: 20, color: "hsl(var(--chart-3))" },
        { name: "Metal", value: 15, color: "hsl(var(--chart-4))" },
        { name: "Glass", value: 5, color: "hsl(var(--chart-5))" },
      ]

      res.json(
        formatResponse(
          {
            totalBins,
            overflowBins,
            totalCollectors,
            activeCollectors,
            totalComplaints,
            pendingComplaints,
            highPriorityComplaints,
            pendingPickups,
            todayCollection: completedPickupsToday,
            averageFillLevel,
            wasteCollectionData,
            areaWiseData: areaWiseData.map((d) => ({
              area: d.area,
              count: d._count,
            })),
            wasteTypeData,
          },
          "Admin statistics retrieved successfully",
        ),
      )
    } catch (error) {
      next(error)
    }
  }

  /**
   * Helper method to get waste collection data for past 7 days
   */
  async getWasteCollectionData() {
    const data = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

      const count = await prisma.pickup.count({
        where: {
          created_at: { gte: startOfDay, lte: endOfDay },
          status: "completed",
        },
      })

      data.push({
        day: dayName,
        waste: count,
        predicted: Math.max(count, Math.floor(Math.random() * 10) + count),
      })
    }

    return data
  }
}

module.exports = new DashboardController()
