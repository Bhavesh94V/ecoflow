/**
 * Route Service
 */

const prisma = require("../config/database")
const { AppError } = require("../utils/appError")
const { generateId, paginate, calculateRouteEfficiency } = require("../utils/helpers")

class RouteService {
  // Get all routes
  async getAllRoutes(query = {}) {
    const { page = 1, limit = 50, status } = query
    const { skip, take } = paginate(page, limit)

    const where = {}
    if (status) where.status = status

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        where,
        skip,
        take,
        orderBy: { scheduled_at: "desc" },
        include: {
          driver: {
            select: { id: true, name: true, phone: true },
          },
          route_bins: {
            include: {
              bin: {
                select: { bin_id: true, location_name: true, status: true, fill_level: true },
              },
            },
            orderBy: { sequence: "asc" },
          },
        },
      }),
      prisma.route.count({ where }),
    ])

    return {
      routes,
      meta: {
        total,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Create route
  async createRoute(data) {
    const { name, driver_id, scheduled_at, bin_ids = [] } = data

    const route_id = generateId("RT")

    const route = await prisma.route.create({
      data: {
        route_id,
        name,
        driver_id,
        scheduled_at: scheduled_at ? new Date(scheduled_at) : null,
        status: "scheduled",
      },
    })

    // Add bins to route
    if (bin_ids.length > 0) {
      await prisma.routeBin.createMany({
        data: bin_ids.map((bin_id, index) => ({
          route_id: route.id,
          bin_id,
          sequence: index + 1,
        })),
      })
    }

    return this.getRouteById(route.id)
  }

  // Get route by ID
  async getRouteById(id) {
    const route = await prisma.route.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        driver: true,
        route_bins: {
          include: { bin: true },
          orderBy: { sequence: "asc" },
        },
      },
    })

    if (!route) {
      throw new AppError("Route not found", 404)
    }

    return route
  }

  // Update route
  async updateRoute(id, data) {
    const route = await prisma.route.update({
      where: { id: Number.parseInt(id) },
      data: {
        ...data,
        updated_at: new Date(),
      },
    })

    return route
  }

  // Assign bin to route
  async assignBin(data) {
    const { route_id, bin_id, sequence = 0 } = data

    // Check if route exists
    const route = await prisma.route.findUnique({ where: { id: route_id } })
    if (!route) throw new AppError("Route not found", 404)

    // Check if bin exists
    const bin = await prisma.bin.findUnique({ where: { id: bin_id } })
    if (!bin) throw new AppError("Bin not found", 404)

    // Create route-bin relation
    const routeBin = await prisma.routeBin.upsert({
      where: {
        route_id_bin_id: { route_id, bin_id },
      },
      update: { sequence },
      create: { route_id, bin_id, sequence },
    })

    return routeBin
  }

  // AI Route Optimization (simplified)
  async optimizeRoutes() {
    // Get all overflow and half-full bins
    const priorityBins = await prisma.bin.findMany({
      where: {
        status: { in: ["overflow", "half"] },
      },
      orderBy: { fill_level: "desc" },
    })

    // Get available collectors
    const availableCollectors = await prisma.collector.findMany({
      where: { status: "active" },
    })

    if (availableCollectors.length === 0) {
      throw new AppError("No active collectors available", 400)
    }

    // Simple optimization: distribute bins among collectors by zone
    const suggestions = []
    const zones = [...new Set(priorityBins.map((b) => b.area))]

    for (const zone of zones) {
      const zoneBins = priorityBins.filter((b) => b.area === zone)
      const zoneCollector = availableCollectors.find((c) => c.zone === zone) || availableCollectors[0]

      if (zoneBins.length > 0) {
        suggestions.push({
          zone,
          collector: zoneCollector.name,
          collector_id: zoneCollector.id,
          bins: zoneBins.map((b) => ({
            bin_id: b.bin_id,
            location: b.location_name,
            fill_level: b.fill_level,
            status: b.status,
          })),
          estimated_distance: Math.round(zoneBins.length * 0.8 * 10) / 10, // Simplified
          estimated_time: zoneBins.length * 5, // 5 mins per bin
          priority: zoneBins.some((b) => b.status === "overflow") ? "high" : "medium",
        })
      }
    }

    return {
      total_bins_to_collect: priorityBins.length,
      available_collectors: availableCollectors.length,
      suggestions,
      estimated_fuel_savings: Math.round(priorityBins.length * 0.5 * 100) / 100, // liters
    }
  }
}

module.exports = new RouteService()
