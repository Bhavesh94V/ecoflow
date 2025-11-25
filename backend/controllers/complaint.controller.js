/**
 * Complaint Controller
 */

const complaintService = require("../services/complaint.service")
const { formatResponse } = require("../utils/helpers")

class ComplaintController {
  /**
   * @swagger
   * /admin/complaints:
   *   get:
   *     tags: [Admin - Complaints]
   *     summary: Get all complaints
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of complaints
   */
  async getAllComplaints(req, res, next) {
    try {
      const result = await complaintService.getAllComplaints(req.query)
      res.json(formatResponse(result.complaints, "Complaints retrieved", result.meta))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/complaints/assign:
   *   put:
   *     tags: [Admin - Complaints]
   *     summary: Assign complaint to collector
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Complaint assigned
   */
  async assignComplaint(req, res, next) {
    try {
      const complaint = await complaintService.assignComplaint(req.body)
      res.json(formatResponse(complaint, "Complaint assigned successfully"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /admin/complaints/resolve:
   *   put:
   *     tags: [Admin - Complaints]
   *     summary: Mark complaint as resolved
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Complaint resolved
   */
  async resolveComplaint(req, res, next) {
    try {
      const complaint = await complaintService.resolveComplaint(req.body)
      res.json(formatResponse(complaint, "Complaint resolved successfully"))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ComplaintController()
