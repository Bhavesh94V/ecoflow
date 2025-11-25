/**
 * Bin Service
 */

const prisma = require("../config/database")
const { AppError } = require("../utils/appError")
const { calculateBinStatus, generateId, paginate } = require("../utils/helpers")

class BinService {
  // Get all bins
  async getAllBins(query = {}) {
    const { page = 1, limit = 50, area, status } = query
    const { skip, take } = paginate(page, limit)

    const where = {}
    if (area) where.area = { contains: area, mode: "insensitive" }
    if (status) where.status = status

    const [bins, total] = await Promise.all([
      prisma.bin.findMany({
        where,
        skip,
        take,
        orderBy: { last_update: "desc" },
      }),
      prisma.bin.count({ where }),
    ])

    return {
      bins,
      meta: {
        total,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Get bin by ID
  async getBinById(id) {
    const bin = await prisma.bin.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        iot_logs: {
          take: 10,
          orderBy: { timestamp: "desc" },
        },
      },
    })

    if (!bin) {
      throw new AppError("Bin not found", 404)
    }

    return bin
  }

  // Create bin
  async createBin(data) {
    const { bin_id, location_name, area, latitude, longitude } = data

    // Check if bin_id exists
    const existing = await prisma.bin.findUnique({ where: { bin_id } })
    if (existing) {
      throw new AppError("Bin ID already exists", 409)
    }

    const bin = await prisma.bin.create({
      data: {
        bin_id,
        location_name,
        area,
        latitude,
        longitude,
        status: "normal",
        fill_level: 0,
      },
    })

    return bin
  }

  // Update bin
  async updateBin(id, data) {
    const bin = await prisma.bin.update({
      where: { id: Number.parseInt(id) },
      data: {
        ...data,
        updated_at: new Date(),
      },
    })

    return bin
  }

  // Delete bin
  async deleteBin(id) {
    await prisma.bin.delete({
      where: { id: Number.parseInt(id) },
    })

    return { deleted: true }
  }

  // Get nearby bins for citizen
  async getNearbyBins(latitude, longitude, radius = 5) {
    // Simple distance calculation (for demo purposes)
    // In production, use PostGIS for accurate geospatial queries
    const bins = await prisma.bin.findMany({
      select: {
        id: true,
        bin_id: true,
        location_name: true,
        area: true,
        latitude: true,
        longitude: true,
        status: true,
        fill_level: true,
        last_update: true,
      },
      take: 20,
      orderBy: { last_update: "desc" },
    })

    // Calculate approximate distance
    return bins
      .map((bin) => ({
        ...bin,
        distance: this.calculateDistance(latitude, longitude, bin.latitude, bin.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)
  }

  // Haversine formula for distance calculation
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1)
    const dLon = this.toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 + Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c * 10) / 10 // Round to 1 decimal
  }

  toRad(deg) {
    return deg * (Math.PI / 180)
  }
}

module.exports = new BinService()
