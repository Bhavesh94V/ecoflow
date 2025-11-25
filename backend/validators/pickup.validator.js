/**
 * Pickup Validation Schemas
 */

const Joi = require("joi")

const createPickupSchema = Joi.object({
  bin_id: Joi.number().integer().positive().optional(),
  scheduled_time: Joi.date().optional(),
})

module.exports = { createPickupSchema }
