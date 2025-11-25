/**
 * Bin Validation Schemas
 */

const Joi = require("joi")

const createBinSchema = Joi.object({
  bin_id: Joi.string().required(),
  location_name: Joi.string().min(3).max(200).required(),
  area: Joi.string().min(2).max(100).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
})

const updateBinSchema = Joi.object({
  location_name: Joi.string().min(3).max(200).optional(),
  area: Joi.string().min(2).max(100).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  status: Joi.string().valid("normal", "half", "overflow").optional(),
})

const iotUpdateSchema = Joi.object({
  bin_id: Joi.string().required(),
  fill_level: Joi.number().min(0).max(100).required(),
  temperature: Joi.number().optional(),
  weight: Joi.number().min(0).optional(),
  gas_level: Joi.number().min(0).max(100).optional(),
  humidity: Joi.number().min(0).max(100).optional(),
  battery: Joi.number().min(0).max(100).optional(),
})

module.exports = { createBinSchema, updateBinSchema, iotUpdateSchema }
