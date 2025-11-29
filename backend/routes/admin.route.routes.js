const express = require("express")
const router = express.Router()
const { authenticate, isAdmin } = require("../middlewares/auth")
const prisma = require("../config/database")

router.get("/", authenticate, isAdmin, async (req, res, next) => {
    try {
        const { limit = 50, page = 1 } = req.query

        const routes = await prisma.route.findMany({
            include: {
                collector: { select: { name: true, email: true, vehicle_number: true, zone: true } },
                route_bins: { include: { bin: { select: { location_name: true } } } },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: Number.parseInt(limit),
        })

        const total = await prisma.route.count()

        const mapped = routes.map((r) => ({
            id: r.id,
            name: `Route ${r.id}`,
            driver: r.collector?.name || "Unassigned",
            vehicle: r.collector?.vehicle_number || "N/A",
            bins: r.route_bins?.length || 0,
            distance: `${(r.distance || 0).toFixed(1)} km`,
            duration: `${Math.floor((r.duration || 0) / 60)}h ${(r.duration || 0) % 60}m`,
            status: r.status || "scheduled",
            efficiency: r.efficiency || 85,
            fuelSaved: `${r.fuel_saved || 10}L`,
        }))

        const avgEfficiency =
            routes.length > 0 ? Math.round(routes.reduce((sum, r) => sum + (r.efficiency || 85), 0) / routes.length) : 0

        const totalFuelSaved = routes.length > 0 ? Math.round(routes.reduce((sum, r) => sum + (r.fuel_saved || 10), 0)) : 0

        res.json({
            success: true,
            data: mapped,
            pagination: { total, page: Number.parseInt(page), limit: Number.parseInt(limit) },
            stats: {
                totalRoutesToday: total,
                activeVehicles: routes.filter((r) => r.status === "active").length,
                avgEfficiency: avgEfficiency,
                fuelSaved: totalFuelSaved + "L",
            },
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router
