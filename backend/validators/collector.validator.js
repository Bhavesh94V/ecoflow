/**
 * Collector Validation Schemas
 */

const Joi = require("joi")

const createCollectorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string()
    .pattern(/^[+]?[\d\s()-]{10,20}$/)
    .required(),
  email: Joi.string().email().required(),
  vehicle_number: Joi.string().min(2).max(20).required(),
  zone: Joi.string().min(2).max(50).required(),
})

const updateCollectorSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string()
    .pattern(/^[+]?[\d\s()-]{10,20}$/)
    .optional(),
  email: Joi.string().email().optional(),
  vehicle_number: Joi.string().min(2).max(20).optional(),
  zone: Joi.string().min(2).max(50).optional(),
  status: Joi.string().valid("active", "on_break", "off_duty").optional(),
  rating: Joi.number().min(0).max(5).optional(),
})

module.exports = { createCollectorSchema, updateCollectorSchema }
