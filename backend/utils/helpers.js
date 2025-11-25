/**
 * Utility Helper Functions
 */

// Calculate bin status based on fill level
const calculateBinStatus = (fillLevel) => {
  if (fillLevel <= 40) return "normal"
  if (fillLevel <= 70) return "half"
  return "overflow"
}

// Generate unique ID
const generateId = (prefix = "ID") => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `${prefix}-${timestamp}${random}`.toUpperCase()
}

// Pagination helper
const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  return { skip, take: limit }
}

// Response formatter
const formatResponse = (data, message = "Success", meta = null) => {
  const response = {
    success: true,
    message,
    data,
  }
  if (meta) response.meta = meta
  return response
}

// Calculate route efficiency (simple algorithm)
const calculateRouteEfficiency = (bins, totalDistance) => {
  if (!bins.length || !totalDistance) return 0
  const avgFillLevel = bins.reduce((sum, b) => sum + (b.fill_level || 0), 0) / bins.length
  const efficiency = (avgFillLevel / totalDistance) * 10
  return Math.min(100, Math.round(efficiency * 100) / 100)
}

module.exports = {
  calculateBinStatus,
  generateId,
  paginate,
  formatResponse,
  calculateRouteEfficiency,
}
