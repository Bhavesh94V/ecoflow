/**
 * EcoSmart Backend Server
 * Smart Waste Management System
 */

const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const swaggerUi = require("swagger-ui-express")
const cron = require("node-cron")

// Config
const { PORT, CORS_ORIGIN } = require("./config/env")
const logger = require("./config/logger")
const swaggerSpec = require("./config/swagger")

// Middlewares
const errorHandler = require("./middlewares/errorHandler")
const { notFound } = require("./middlewares/notFound")

// Routes
const authRoutes = require("./routes/auth.routes")
const citizenRoutes = require("./routes/citizen.routes")
const dashboardRoutes = require("./routes/dashboard.routes")
const adminBinRoutes = require("./routes/admin.bin.routes")
const adminCollectorRoutes = require("./routes/admin.collector.routes")
const adminComplaintRoutes = require("./routes/admin.complaint.routes")
const adminRouteRoutes = require("./routes/admin.route.routes")
const iotRoutes = require("./routes/iot.routes")
const alertsRoutes = require("./routes/alerts.routes")

// Cron Jobs
const { runAlertCron, runInactiveBinCron } = require("./crons/alertCron")

// Initialize Express
const app = express()
const server = http.createServer(app)

const corsOrigins = CORS_ORIGIN.split(",").map((origin) => origin.trim())

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ["GET", "POST"],
  },
})

// Make io accessible to routes
app.set("io", io)

// Security Middlewares
app.use(helmet())
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
)

// Request Parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(morgan("combined", { stream: { write: (message) => logger.http(message.trim()) } }))

// Swagger Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), version: "1.0.0" })
})

// Debug Routes (development only)
if (process.env.NODE_ENV !== "production") {
  app.get("/api/debug/routes", (req, res) => {
    const routes = []
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        routes.push({
          path: middleware.route.path,
          methods: Object.keys(middleware.route.methods),
        })
      } else if (middleware.name === "router") {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            routes.push({
              path: handler.route.path,
              methods: Object.keys(handler.route.methods),
            })
          }
        })
      }
    })
    res.json({ routes })
  })
}

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/citizen", citizenRoutes)
app.use("/api/bins", (req, res, next) => {
  // Middleware to redirect /api/bins to citizen endpoints
  req.url = req.url.replace(/^\/api\/bins/, "/api/citizen")
  next()
})
app.use("/api/bins", citizenRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/admin/bins", adminBinRoutes)
app.use("/api/admin/collectors", adminCollectorRoutes)
app.use("/api/admin/complaints", adminComplaintRoutes)
app.use("/api/admin/routes", adminRouteRoutes)
app.use("/api/admin/alerts", alertsRoutes)
app.use("/api/iot", iotRoutes)

// Error Handling
app.use(notFound)
app.use(errorHandler)

// WebSocket Events
io.on("connection", (socket) => {
  logger.info(`Client connected: ${socket.id}`)

  socket.on("subscribe:dashboard:admin", async () => {
    socket.join("dashboard-admin")
    logger.info(`Admin client ${socket.id} subscribed to dashboard updates`)

    // Send initial stats
    try {
      const dashboardController = require("./controllers/dashboard.controller")
      const stats = await dashboardController.getAdminStats({}, { json: (data) => data }, () => {})
      socket.emit("dashboard:update", stats.data)
    } catch (error) {
      logger.error("Error sending initial admin stats:", error)
    }
  })

  socket.on("subscribe:dashboard:citizen", async () => {
    socket.join(`dashboard-citizen-${socket.handshake.auth.userId || socket.id}`)
    logger.info(`Citizen client ${socket.id} subscribed to dashboard updates`)
  })

  socket.on("subscribe:bins", () => {
    socket.join("bin-updates")
    logger.info(`Client ${socket.id} subscribed to bin updates`)
  })

  socket.on("subscribe:alerts", () => {
    socket.join("alerts")
    logger.info(`Client ${socket.id} subscribed to alerts`)
  })

  socket.on("disconnect", () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

// Cron Jobs - Every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  logger.info("Running scheduled alert cron job...")
  await runAlertCron(io)
  await runInactiveBinCron(io)
})

// Start Server
server.listen(PORT, () => {
  logger.info(`🚀 EcoSmart Server running on port ${PORT}`)
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api/docs`)
  logger.info(`🔗 Health Check: http://localhost:${PORT}/api/health`)
})

module.exports = { app, server, io }
