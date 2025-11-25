/**
 * Alert Cron Jobs
 */

const prisma = require("../config/database")
const logger = require("../config/logger")

// Run alert for overflow bins and high gas levels
const runAlertCron = async (io) => {
  try {
    // Find all overflow bins
    const overflowBins = await prisma.bin.findMany({
      where: { status: "overflow" },
    })

    // Find bins with high gas levels
    const highGasBins = await prisma.bin.findMany({
      where: { gas_level: { gt: 70 } },
    })

    if (overflowBins.length > 0) {
      logger.warn(`[CRON] ${overflowBins.length} bins in overflow status`)

      if (io) {
        io.to("alerts").emit("cron-overflow-alert", {
          count: overflowBins.length,
          bins: overflowBins.map((b) => ({
            bin_id: b.bin_id,
            location: b.location_name,
            fill_level: b.fill_level,
          })),
          timestamp: new Date().toISOString(),
        })
      }
    }

    if (highGasBins.length > 0) {
      logger.warn(`[CRON] ${highGasBins.length} bins with high gas levels`)

      if (io) {
        io.to("alerts").emit("cron-gas-alert", {
          count: highGasBins.length,
          bins: highGasBins.map((b) => ({
            bin_id: b.bin_id,
            location: b.location_name,
            gas_level: b.gas_level,
          })),
          timestamp: new Date().toISOString(),
        })
      }
    }

    return { overflowBins: overflowBins.length, highGasBins: highGasBins.length }
  } catch (error) {
    logger.error("[CRON] Alert cron error:", error)
    throw error
  }
}

// Find inactive bins (no update in last 30 minutes)
const runInactiveBinCron = async (io) => {
  try {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000)

    const inactiveBins = await prisma.bin.findMany({
      where: {
        last_update: { lt: thirtyMinsAgo },
      },
    })

    if (inactiveBins.length > 0) {
      logger.warn(`[CRON] ${inactiveBins.length} inactive bins detected`)

      if (io) {
        io.to("alerts").emit("inactive-bins-alert", {
          count: inactiveBins.length,
          bins: inactiveBins.map((b) => ({
            bin_id: b.bin_id,
            location: b.location_name,
            last_update: b.last_update,
          })),
          timestamp: new Date().toISOString(),
        })
      }
    }

    return { inactiveBins: inactiveBins.length }
  } catch (error) {
    logger.error("[CRON] Inactive bin cron error:", error)
    throw error
  }
}

module.exports = { runAlertCron, runInactiveBinCron }
