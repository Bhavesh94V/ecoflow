const express = require("express")
const router = express.Router()
const { authenticate, isAdmin } = require("../middlewares/auth")
const prisma = require("../config/database")

router.get("/metrics", authenticate, isAdmin, async (req, res, next) => {
    try {
        const activeSensors = await prisma.bin.count({ where: { status: "active" } })
        const logsToday = await prisma.iotLog.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        })

        const allBins = await prisma.bin.findMany({
            select: { fullness: true, temperature: true, battery: true },
        })

        const avgResponseTime = 1.2
        const criticalAlerts = allBins.filter((b) => b.fullness > 80).length

        res.json({
            success: true,
            data: {
                activeSensors: activeSensors || 0,
                dataPointsToday: (logsToday * 4).toString() + "K",
                avgResponseTime: avgResponseTime.toFixed(1) + "s",
                criticalAlerts: criticalAlerts,
            },
        })
    } catch (error) {
        next(error)
    }
})

router.get("/fill-level-history", authenticate, isAdmin, async (req, res, next) => {
    try {
        const logs = await prisma.iotLog.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                },
            },
            orderBy: { createdAt: "asc" },
            take: 48,
        })

        const grouped = {}
        logs.forEach((log) => {
            const hour = new Date(log.createdAt).getHours().toString().padStart(2, "0")
            const key = `${hour}:00`
            if (!grouped[key]) {
                grouped[key] = []
            }
            grouped[key].push(log.fill_level)
        })

        const data = Object.entries(grouped).map(([time, levels]) => ({
            time,
            level: Math.round(levels.reduce((a, b) => a + b) / levels.length),
        }))

        res.json({ success: true, data })
    } catch (error) {
        next(error)
    }
})

router.get("/temperature-history", authenticate, isAdmin, async (req, res, next) => {
    try {
        const logs = await prisma.iotLog.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                },
            },
            orderBy: { createdAt: "asc" },
            take: 48,
        })

        const grouped = {}
        logs.forEach((log) => {
            const hour = new Date(log.createdAt).getHours().toString().padStart(2, "0")
            const key = `${hour}:00`
            if (!grouped[key]) {
                grouped[key] = []
            }
            if (log.temperature) {
                grouped[key].push(log.temperature)
            }
        })

        const data = Object.entries(grouped).map(([time, temps]) => ({
            time,
            temp: temps.length > 0 ? Math.round(temps.reduce((a, b) => a + b) / temps.length) : 20,
        }))

        res.json({ success: true, data })
    } catch (error) {
        next(error)
    }
})

router.get("/sensors", authenticate, isAdmin, async (req, res, next) => {
    try {
        const bins = await prisma.bin.findMany({
            include: {
                iotLogs: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
            take: 10,
        })

        const data = bins.map((bin) => {
            const lastLog = bin.iotLogs?.[0]
            return {
                binId: bin.id,
                location: bin.location_name,
                fillLevel: bin.fullness,
                temperature: lastLog?.temperature || bin.temperature || 20,
                weight: lastLog?.weight || 0,
                battery: lastLog?.battery || 100,
                signal: bin.battery > 50 ? "strong" : bin.battery > 20 ? "medium" : "weak",
                humidity: lastLog?.humidity || 60,
                lastUpdate: lastLog?.createdAt ? new Date(lastLog.createdAt).toLocaleString() : "N/A",
                alerts: bin.fullness > 80 ? ["High fill level"] : bin.temperature > 28 ? ["High temperature"] : [],
            }
        })

        res.json({ success: true, data })
    } catch (error) {
        next(error)
    }
})

module.exports = router
