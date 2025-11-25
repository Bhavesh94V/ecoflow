/**
 * Route Validation Schemas
 */

const Joi = require("joi")

const createRouteSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  driver_id: Joi.number().integer().positive().optional(),
  scheduled_at: Joi.date().optional(),
  bin_ids: Joi.array().items(Joi.number().integer().positive()).optional(),
})

const updateRouteSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  driver_id: Joi.number().integer().positive().optional(),
  status: Joi.string().valid("active", "scheduled", "completed").optional(),
  scheduled_at: Joi.date().optional(),
})

const assignBinSchema = Joi.object({
  route_id: Joi.number().integer().positive().required(),
  bin_id: Joi.number().integer().positive().required(),
  sequence: Joi.number().integer().min(0).default(0),
})

module.exports = { createRouteSchema, updateRouteSchema, assignBinSchema }
