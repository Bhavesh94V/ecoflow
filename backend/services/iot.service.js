/**
 * IoT Service
 */

const prisma = require("../config/database")
const { AppError } = require("../utils/appError")
const { calculateBinStatus } = require("../utils/helpers")

class IoTService {
  // Process IoT update from bin sensor
  async processUpdate(data, io) {
    const { bin_id, fill_level, temperature, weight, gas_level, humidity, battery } = data

    // Find bin
    const bin = await prisma.bin.findUnique({ where: { bin_id } })
    if (!bin) {
      throw new AppError("Bin not found", 404)
    }

    // Calculate new status
    const newStatus = calculateBinStatus(fill_level)
    const wasOverflow = bin.status === "overflow"
    const isNowOverflow = newStatus === "overflow"

    // Create IoT log
    await prisma.ioTLog.create({
      data: {
        bin_id: bin.id,
        fill_level,
        temperature,
        weight,
        gas_level,
        humidity,
        battery,
      },
    })

    // Update bin
    const updatedBin = await prisma.bin.update({
      where: { id: bin.id },
      data: {
        fill_level,
        temperature,
        weight,
        gas_level,
        humidity,
        battery,
        status: newStatus,
        last_update: new Date(),
      },
    })

    // Emit WebSocket event
    if (io) {
      io.to("bin-updates").emit("bin-updated", {
        bin_id: updatedBin.bin_id,
        location_name: updatedBin.location_name,
        area: updatedBin.area,
        fill_level,
        status: newStatus,
        timestamp: new Date().toISOString(),
      })

      // Trigger overflow alert
      if (!wasOverflow && isNowOverflow) {
        io.to("alerts").emit("bin-overflow", {
          bin_id: updatedBin.bin_id,
          location_name: updatedBin.location_name,
          area: updatedBin.area,
          fill_level,
          message: `Bin ${updatedBin.bin_id} at ${updatedBin.location_name} has reached overflow status!`,
          timestamp: new Date().toISOString(),
        })
      }

      // High gas level alert
      if (gas_level && gas_level > 70) {
        io.to("alerts").emit("high-gas-alert", {
          bin_id: updatedBin.bin_id,
          location_name: updatedBin.location_name,
          gas_level,
          message: `High gas emission detected at ${updatedBin.location_name}!`,
          timestamp: new Date().toISOString(),
        })
      }
    }

    return updatedBin
  }

  // Get IoT history for a bin
  async getHistory(binId, query = {}) {
    const { limit = 100, from, to } = query

    const where = { bin_id: Number.parseInt(binId) }
    if (from) where.timestamp = { gte: new Date(from) }
    if (to) where.timestamp = { ...where.timestamp, lte: new Date(to) }

    const logs = await prisma.ioTLog.findMany({
      where,
      take: Number.parseInt(limit),
      orderBy: { timestamp: "desc" },
    })

    return logs
  }
}

module.exports = new IoTService()
