/**
 * Complaint Service
 */

const prisma = require("../config/database")
const { AppError } = require("../utils/appError")
const { paginate } = require("../utils/helpers")

class ComplaintService {
  // Get all complaints (admin)
  async getAllComplaints(query = {}) {
    const { page = 1, limit = 50, status, priority } = query
    const { skip, take } = paginate(page, limit)

    const where = {}
    if (status) where.status = status
    if (priority) where.priority = priority

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          bin: {
            select: { bin_id: true, location_name: true, area: true },
          },
          assignee: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.complaint.count({ where }),
    ])

    return {
      complaints,
      meta: {
        total,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Get complaints for a citizen
  async getCitizenComplaints(userId) {
    const complaints = await prisma.complaint.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        bin: {
          select: { bin_id: true, location_name: true },
        },
        assignee: {
          select: { name: true },
        },
      },
    })

    return complaints
  }

  // Create complaint (citizen)
  async createComplaint(userId, data) {
    const { message, bin_id, priority = "medium" } = data

    // Verify bin exists if provided
    if (bin_id) {
      const bin = await prisma.bin.findUnique({ where: { id: bin_id } })
      if (!bin) throw new AppError("Bin not found", 404)
    }

    const complaint = await prisma.complaint.create({
      data: {
        user_id: userId,
        bin_id,
        message,
        priority,
        status: "pending",
      },
      include: {
        bin: {
          select: { bin_id: true, location_name: true },
        },
      },
    })

    return complaint
  }

  // Assign complaint to collector (admin)
  async assignComplaint(data) {
    const { complaint_id, collector_id } = data

    // Verify collector exists
    const collector = await prisma.collector.findUnique({ where: { id: collector_id } })
    if (!collector) throw new AppError("Collector not found", 404)

    const complaint = await prisma.complaint.update({
      where: { id: complaint_id },
      data: {
        assigned_to: collector_id,
        status: "in_progress",
      },
      include: {
        user: { select: { name: true, email: true } },
        assignee: { select: { name: true } },
      },
    })

    return complaint
  }

  // Resolve complaint (admin)
  async resolveComplaint(data) {
    const { complaint_id } = data

    const complaint = await prisma.complaint.update({
      where: { id: complaint_id },
      data: {
        status: "resolved",
        resolved_at: new Date(),
      },
    })

    return complaint
  }
}

module.exports = new ComplaintService()
