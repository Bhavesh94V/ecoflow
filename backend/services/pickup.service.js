/**
 * Pickup Service
 */

const prisma = require("../config/database")
const { AppError } = require("../utils/appError")

class PickupService {
  // Create pickup request (citizen)
  async createPickup(userId, data) {
    const { bin_id, scheduled_time } = data

    // Check for existing pending pickup
    const existing = await prisma.pickup.findFirst({
      where: {
        user_id: userId,
        status: { in: ["requested", "assigned", "on_the_way"] },
      },
    })

    if (existing) {
      throw new AppError("You already have a pending pickup request", 400)
    }

    const pickup = await prisma.pickup.create({
      data: {
        user_id: userId,
        bin_id,
        scheduled_time: scheduled_time ? new Date(scheduled_time) : null,
        status: "requested",
      },
      include: {
        bin: {
          select: { bin_id: true, location_name: true },
        },
      },
    })

    return pickup
  }

  // Get pickup status (citizen)
  async getPickupStatus(userId) {
    const pickups = await prisma.pickup.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      take: 10,
      include: {
        bin: {
          select: { bin_id: true, location_name: true },
        },
        driver: {
          select: { name: true, phone: true },
        },
      },
    })

    return pickups
  }

  // Complete pickup and award points
  async completePickup(pickupId) {
    const pickup = await prisma.pickup.findUnique({
      where: { id: pickupId },
    })

    if (!pickup) throw new AppError("Pickup not found", 404)

    // Update pickup status
    await prisma.pickup.update({
      where: { id: pickupId },
      data: {
        status: "completed",
        completed_time: new Date(),
      },
    })

    // Award 15 points to citizen
    await prisma.user.update({
      where: { id: pickup.user_id },
      data: {
        reward_points: { increment: 15 },
      },
    })

    return { success: true, points_awarded: 15 }
  }
}

module.exports = new PickupService()
