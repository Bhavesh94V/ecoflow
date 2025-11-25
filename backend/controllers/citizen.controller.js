/**
 * Citizen Controller
 */

const binService = require("../services/bin.service")
const pickupService = require("../services/pickup.service")
const complaintService = require("../services/complaint.service")
const rewardService = require("../services/reward.service")
const { formatResponse } = require("../utils/helpers")

class CitizenController {
  /**
   * @swagger
   * /citizen/bins:
   *   get:
   *     tags: [Citizen]
   *     summary: Get nearby bins
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: latitude
   *         schema:
   *           type: number
   *       - in: query
   *         name: longitude
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: List of nearby bins
   */
  async getNearbyBins(req, res, next) {
    try {
      const { latitude = 28.6139, longitude = 77.209, limit } = req.query
      const bins = await binService.getNearbyBins(Number.parseFloat(latitude), Number.parseFloat(longitude))

      const result = limit ? bins.slice(0, Number.parseInt(limit)) : bins
      res.json(formatResponse(result, "Nearby bins retrieved"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /citizen/rewards:
   *   get:
   *     tags: [Citizen]
   *     summary: Get citizen rewards
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Reward details
   */
  async getRewards(req, res, next) {
    try {
      const rewards = await rewardService.getCitizenRewards(req.user.id)
      res.json(formatResponse(rewards, "Rewards retrieved"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /citizen/pickup:
   *   post:
   *     tags: [Citizen]
   *     summary: Request a pickup
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Pickup requested
   */
  async requestPickup(req, res, next) {
    try {
      const pickup = await pickupService.createPickup(req.user.id, req.body)
      res.status(201).json(formatResponse(pickup, "Pickup requested successfully"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /citizen/pickup-status:
   *   get:
   *     tags: [Citizen]
   *     summary: Get pickup status
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Pickup status
   */
  async getPickupStatus(req, res, next) {
    try {
      const pickups = await pickupService.getPickupStatus(req.user.id)
      res.json(formatResponse(pickups, "Pickup status retrieved"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /citizen/complaint:
   *   post:
   *     tags: [Citizen]
   *     summary: File a complaint
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Complaint filed
   */
  async fileComplaint(req, res, next) {
    try {
      const complaint = await complaintService.createComplaint(req.user.id, req.body)
      res.status(201).json(formatResponse(complaint, "Complaint filed successfully"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /citizen/complaints:
   *   get:
   *     tags: [Citizen]
   *     summary: Get citizen's complaints
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of complaints
   */
  async getComplaints(req, res, next) {
    try {
      const complaints = await complaintService.getCitizenComplaints(req.user.id)
      res.json(formatResponse(complaints, "Complaints retrieved"))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new CitizenController()
