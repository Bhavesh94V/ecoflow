/**
 * IoT Controller
 */

const iotService = require("../services/iot.service")
const { formatResponse } = require("../utils/helpers")

class IoTController {
  /**
   * @swagger
   * /iot/update:
   *   post:
   *     tags: [IoT]
   *     summary: Receive IoT sensor data from bin
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [bin_id, fill_level]
   *             properties:
   *               bin_id:
   *                 type: string
   *               fill_level:
   *                 type: integer
   *               temperature:
   *                 type: number
   *               weight:
   *                 type: number
   *               gas_level:
   *                 type: number
   *               humidity:
   *                 type: number
   *               battery:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Update processed
   */
  async processUpdate(req, res, next) {
    try {
      const io = req.app.get("io")
      const bin = await iotService.processUpdate(req.body, io)
      res.json(formatResponse(bin, "IoT data processed"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /iot/history/{bin_id}:
   *   get:
   *     tags: [IoT]
   *     summary: Get IoT history for a bin
   *     parameters:
   *       - in: path
   *         name: bin_id
   *         required: true
   *         schema:
   *           type: integer
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *       - in: query
   *         name: from
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: to
   *         schema:
   *           type: string
   *           format: date-time
   *     responses:
   *       200:
   *         description: IoT history
   */
  async getHistory(req, res, next) {
    try {
      const logs = await iotService.getHistory(req.params.bin_id, req.query)
      res.json(formatResponse(logs, "IoT history retrieved"))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new IoTController()
