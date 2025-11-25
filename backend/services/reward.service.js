/**
 * Reward Service
 */

const prisma = require("../config/database")
const { AppError } = require("../utils/appError")

class RewardService {
  // Get citizen rewards
  async getCitizenRewards(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        reward_points: true,
        pickups: {
          where: { status: "completed" },
          select: { id: true },
        },
      },
    })

    if (!user) throw new AppError("User not found", 404)

    const completedPickups = user.pickups.length
    const recyclingRate = Math.min(100, Math.round((completedPickups * 5.67) % 100))

    return {
      points: user.reward_points,
      pickups_completed: completedPickups,
      recycling_rate: recyclingRate,
      level: this.calculateLevel(user.reward_points),
      next_level_points: this.getNextLevelPoints(user.reward_points),
    }
  }

  // Calculate user level based on points
  calculateLevel(points) {
    if (points >= 5000) return "Platinum"
    if (points >= 2500) return "Gold"
    if (points >= 1000) return "Silver"
    if (points >= 500) return "Bronze"
    return "Starter"
  }

  // Get points needed for next level
  getNextLevelPoints(currentPoints) {
    const levels = [500, 1000, 2500, 5000]
    for (const level of levels) {
      if (currentPoints < level) return level - currentPoints
    }
    return 0
  }
}

module.exports = new RewardService()
