/**
 * Swagger/OpenAPI Configuration
 */

const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EcoSmart API",
      version: "1.0.0",
      description: "Smart Waste Management System API Documentation",
      contact: {
        name: "EcoSmart Support",
        email: "support@ecosmart.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Citizen", description: "Citizen endpoints" },
      { name: "Admin - Bins", description: "Admin bin management" },
      { name: "Admin - Collectors", description: "Admin collector management" },
      { name: "Admin - Complaints", description: "Admin complaint management" },
      { name: "Admin - Routes", description: "Admin route management" },
      { name: "IoT", description: "IoT device endpoints" },
    ],
  },
  apis: ["./controllers/*.js", "./routes/*.js"],
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec
