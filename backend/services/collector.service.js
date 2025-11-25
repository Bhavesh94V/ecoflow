/**
 * Collector Service
 */

const prisma = require("../config/database")
const { AppError } = require("../utils/appError")
const { paginate } = require("../utils/helpers")

class CollectorService {
  // Get all collectors
  async getAllCollectors(query = {}) {
    const { page = 1, limit = 50, status, zone } = query
    const { skip, take } = paginate(page, limit)

    const where = {}
    if (status) where.status = status
    if (zone) where.zone = { contains: zone, mode: "insensitive" }

    const [collectors, total] = await Promise.all([
      prisma.collector.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: "desc" },
        include: {
          routes: {
            where: { status: "active" },
            select: { route_id: true, name: true },
          },
        },
      }),
      prisma.collector.count({ where }),
    ])

    return {
      collectors,
      meta: {
        total,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Get collector by ID
  async getCollectorById(id) {
    const collector = await prisma.collector.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        routes: {
          orderBy: { scheduled_at: "desc" },
          take: 5,
        },
        pickups: {
          orderBy: { created_at: "desc" },
          take: 10,
        },
      },
    })

    if (!collector) {
      throw new AppError("Collector not found", 404)
    }

    return collector
  }

  // Create collector
  async createCollector(data) {
    const { email } = data

    // Check if email exists
    const existing = await prisma.collector.findUnique({ where: { email } })
    if (existing) {
      throw new AppError("Email already registered", 409)
    }

    const collector = await prisma.collector.create({
      data: {
        ...data,
        rating: 5.0,
        shifts_completed: 0,
        status: "active",
      },
    })

    return collector
  }

  // Update collector
  async updateCollector(id, data) {
    const collector = await prisma.collector.update({
      where: { id: Number.parseInt(id) },
      data: {
        ...data,
        updated_at: new Date(),
      },
    })

    return collector
  }

  // Delete collector
  async deleteCollector(id) {
    await prisma.collector.delete({
      where: { id: Number.parseInt(id) },
    })

    return { deleted: true }
  }
}

module.exports = new CollectorService()
