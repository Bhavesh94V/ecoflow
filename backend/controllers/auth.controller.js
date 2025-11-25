/**
 * Auth Controller
 */

const authService = require("../services/auth.service")
const { formatResponse } = require("../utils/helpers")

class AuthController {
  /**
   * @swagger
   * /auth/citizen/register:
   *   post:
   *     tags: [Auth]
   *     summary: Register a new citizen
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, email, password]
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               phone:
   *                 type: string
   *               address:
   *                 type: string
   *     responses:
   *       201:
   *         description: Registration successful
   */
  async citizenRegister(req, res, next) {
    try {
      const result = await authService.registerCitizen(req.body)
      res.status(201).json(formatResponse(result, "Registration successful"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /auth/citizen/login:
   *   post:
   *     tags: [Auth]
   *     summary: Login for citizen
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   */
  async citizenLogin(req, res, next) {
    try {
      const { email, password } = req.body
      const result = await authService.citizenLogin(email, password)
      res.json(formatResponse(result, "Login successful"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /auth/admin/login:
   *   post:
   *     tags: [Auth]
   *     summary: Login for admin
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   */
  async adminLogin(req, res, next) {
    try {
      const { email, password } = req.body
      const result = await authService.adminLogin(email, password)
      res.json(formatResponse(result, "Login successful"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     tags: [Auth]
   *     summary: Universal login (auto-detects admin or citizen)
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const result = await authService.login(email, password)
      res.json(formatResponse(result, "Login successful"))
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     tags: [Auth]
   *     summary: Get current user profile
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Profile retrieved
   */
  async getProfile(req, res, next) {
    try {
      const isFixedAdmin = req.user.isFixedAdmin === true
      const profile = await authService.getProfile(req.user.id, isFixedAdmin)
      res.json(formatResponse(profile, "Profile retrieved"))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AuthController()
